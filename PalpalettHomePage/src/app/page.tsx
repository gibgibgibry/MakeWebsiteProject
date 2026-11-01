import Image from "next/image";
import Link from "next/link";
import CtaBand from "@/components/CtaBand";
import SidebarLayout from "@/components/SidebarLayout";
import WorkFeedItem from "@/components/WorkFeedItem";
import { isMicroCmsConfigured } from "@/lib/microcms/env";
import { getRecentWorks } from "@/lib/microcms/works";
import logo from "../../public/palpallette_logo.png";

export const revalidate = 3600;

/** 旧サイトと同じく「ホーム = 実績のフィード」が主役の構成。 */
export default async function Home() {
  const recent = isMicroCmsConfigured() ? await getRecentWorks(6) : [];

  return (
    <>
      <section className="bg-brand-fill">
        <div className="mx-auto max-w-6xl px-6 py-12 md:px-10 md:py-16">
          <div className="grid gap-8 md:grid-cols-[1fr_28rem] md:items-center">
            <div>
              <span className="inline-block rounded-full bg-brand-ink px-4 py-1.5 text-xs tracking-[0.25em] text-paper">
                DESIGN OFFICE
              </span>
              {/* 「デ／ザイン」のような語の途中で折り返さないよう、句読点の位置でだけ改行させる */}
              <h1 className="mt-4 font-display text-2xl leading-snug text-paper md:text-4xl">
                <span className="inline-block">かわいいを、</span>
                <span className="inline-block">ていねいにデザインする。</span>
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-loose text-paper">
                有限会社パルパレットは、1998年から出版社の雑誌やコミックスを中心に紙面のデザインを手がけてきたデザイン事務所です。かわいいデザイン、柔らかいデザイン全般、お任せください。
              </p>
            </div>
            {/* ファーストビューの最大要素（LCP）なので preload する */}
            <Image
              src={logo}
              alt="Palpallette DESIGN"
              sizes="(min-width: 768px) 448px, 384px"
              preload
              className="h-auto w-full max-w-sm justify-self-center drop-shadow-[0_12px_28px_rgba(0,0,0,0.3)] md:max-w-none md:justify-self-end"
            />
          </div>
        </div>
      </section>

      <SidebarLayout
        showRecent={false}
        after={
          <CtaBand
            message="デザインのご相談、お待ちしています。"
            href="/contact"
            label="お問い合わせはこちら"
            className="mt-16"
          />
        }
      >
        <section aria-labelledby="recent-heading">
          <div className="flex items-baseline justify-between border-b-2 border-brand-fill pb-2">
            <h2 id="recent-heading" className="font-display text-lg text-ink">
              最近の実績
            </h2>
            <Link href="/works" className="text-sm text-brand-ink hover:underline">
              すべて見る →
            </Link>
          </div>

          {recent.length > 0 ? (
            <ul className="mt-8 divide-y divide-line">
              {recent.map((work) => (
                <WorkFeedItem key={work.id} work={work} />
              ))}
            </ul>
          ) : (
            <p className="mt-8 rounded-card border border-line bg-paper px-6 py-16 text-center text-sm text-ink-soft">
              実績は準備中です。
            </p>
          )}
        </section>
      </SidebarLayout>
    </>
  );
}
