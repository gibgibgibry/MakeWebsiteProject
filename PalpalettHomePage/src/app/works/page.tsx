import type { Metadata } from "next";
import WorksGrid from "@/components/WorksGrid";
import { isMicroCmsConfigured } from "@/lib/microcms/env";
import { getCategories, getWorks } from "@/lib/microcms/works";

export const metadata: Metadata = {
  title: "実績",
  description:
    "Palpalletteが手がけた雑誌の表紙、コミックス・書籍の装丁、ポスターやロゴなどの実績をご紹介します。",
};

/** fetch 側の revalidate と同値にしておく。
 *  ルート全体では最小値が採用されるため、片方だけ短いと全体が引きずられる。 */
export const revalidate = 3600;

export default async function WorksPage() {
  // microCMS 未設定でもサイト全体をビルドできるようにしておく（公開前の作業用）。
  const configured = isMicroCmsConfigured();
  const [works, categories] = configured
    ? await Promise.all([getWorks(), getCategories()])
    : [[], []];

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
      <p className="text-sm tracking-[0.3em] text-brand-ink">WORKS</p>
      <h1 className="mt-4 font-display text-3xl text-ink md:text-5xl">実績</h1>
      <p className="mt-6 max-w-xl text-sm leading-loose text-ink-soft">
        雑誌の表紙、コミックス・書籍の装丁、ポスターやロゴなど、
        これまでに手がけた仕事をご紹介します。
      </p>

      {configured ? (
        <WorksGrid works={works} categories={categories} />
      ) : (
        <p className="mt-16 rounded-card border border-line bg-paper-soft px-6 py-16 text-center text-sm text-ink-soft">
          実績は準備中です。
        </p>
      )}
    </div>
  );
}
