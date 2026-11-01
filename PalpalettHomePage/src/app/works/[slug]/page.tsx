import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageBand from "@/components/PageBand";
import SidebarLayout from "@/components/SidebarLayout";
import WorkGallery, { type GalleryImage } from "@/components/WorkGallery";
import { isValidSlug } from "@/lib/microcms/tags";
import { getWork, getWorkSlugs } from "@/lib/microcms/works";
import type { Work } from "@/lib/microcms/types";

export const revalidate = 3600;

/**
 * dynamicParams は true のままにすること。
 *
 * generateStaticParams は ISR の再検証時に**再実行されない**ため、
 * microCMS に新しく公開された作品はプリレンダ済みの一覧に含まれない。
 * その作品の詳細ページが表示できるのは dynamicParams によるオンデマンド生成が
 * あるからで、ここを false にすると新規作品は次のデプロイまで永久に404になる。
 */
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getWorkSlugs();
  return slugs.map((slug) => ({ slug }));
}

/** generateMetadata とページ本体で同じ作品を取りにいくが、
 *  fetch は同一レンダー内でメモ化されるため通信は1回で済む。 */
async function loadWork(slugParam: string): Promise<Work> {
  if (!isValidSlug(slugParam)) notFound();
  const work = await getWork(slugParam);
  if (!work) notFound();
  return work;
}

export async function generateMetadata(
  props: PageProps<"/works/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  if (!isValidSlug(slug)) return { title: "実績" };

  const work = await getWork(slug);
  if (!work) return { title: "実績" };

  const description =
    work.description?.replace(/\s+/g, " ").slice(0, 120) ??
    `${work.title}のデザインを担当しました。`;

  return {
    title: work.title,
    description,
    openGraph: {
      title: work.title,
      description,
      images: [{ url: work.coverImage.url }],
    },
  };
}

export default async function WorkDetailPage(
  props: PageProps<"/works/[slug]">,
) {
  const { slug } = await props.params;
  const work = await loadWork(slug);

  const images: GalleryImage[] = [
    { ...work.coverImage },
    ...(work.gallery ?? []).map((item) => ({
      ...item.image,
      caption: item.caption,
    })),
  ];

  const meta = [
    work.client ? { label: "クライアント", value: work.client } : null,
    work.category ? { label: "カテゴリー", value: work.category.name } : null,
    work.year ? { label: "制作年", value: `${work.year}年` } : null,
    work.role?.length ? { label: "担当", value: work.role.join(" / ") } : null,
  ].filter((item): item is { label: string; value: string } => item !== null);

  return (
    <>
      <PageBand eyebrow="WORKS" title="実績" titleAs="p" />
      <SidebarLayout>
        <article className="rounded-card bg-paper p-6 md:p-10">
          <nav aria-label="パンくず" className="text-sm text-ink-soft">
            <Link href="/works" className="hover:text-brand-ink">
              実績
            </Link>
            <span aria-hidden="true" className="mx-2 text-line-strong">
              /
            </span>
            <span className="text-ink">{work.title}</span>
          </nav>

          <h1 className="mt-4 font-display text-2xl leading-snug text-ink md:text-3xl md:leading-snug">
            {work.title}
          </h1>

          <div className="mt-8">
            <WorkGallery images={images} title={work.title} />
            <p className="mt-4 text-xs text-ink-soft">
              画像をクリックすると拡大表示できます。
            </p>
          </div>

          {meta.length > 0 && (
            <section className="mt-10">
              <h2 className="sr-only">作品情報</h2>
              <dl className="grid border-t border-line sm:grid-cols-2 sm:gap-x-8">
                {meta.map((item) => (
                  <div key={item.label} className="border-b border-line py-4">
                    <dt className="text-xs tracking-wide text-ink-soft">
                      {item.label}
                    </dt>
                    <dd className="mt-1 text-sm text-ink">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {work.description && (
            <p className="mt-10 whitespace-pre-line text-sm leading-loose text-ink">
              {work.description}
            </p>
          )}

          <div className="mt-12 border-t border-line pt-8">
            <Link
              href="/works"
              className="rounded-full border border-line-strong px-6 py-3 text-sm text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper"
            >
              ← 実績一覧へ戻る
            </Link>
          </div>
        </article>
      </SidebarLayout>
    </>
  );
}
