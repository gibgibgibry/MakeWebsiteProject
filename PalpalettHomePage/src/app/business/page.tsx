import type { Metadata } from "next";
import Link from "next/link";
import { SERVICES } from "@/lib/services";

export const metadata: Metadata = {
  title: "事業内容",
  description:
    "Palpalletteは雑誌の表紙・誌面デザイン、コミックス・書籍の装丁、ポスター・パンフレット・チラシ、ロゴデザインを手がけています。",
};

export default function BusinessPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
      <p className="text-sm tracking-[0.3em] text-brand-ink">BUSINESS</p>
      <h1 className="mt-4 font-display text-3xl text-ink md:text-5xl">事業内容</h1>
      <p className="mt-6 max-w-xl text-sm leading-loose text-ink-soft">
        出版社の雑誌・コミックスを中心に、紙面まわりのデザインを幅広く手がけています。
        かわいいデザイン、柔らかいデザイン全般、お任せください。
      </p>

      <div className="mt-14 divide-y divide-line border-t border-line">
        {SERVICES.map((service) => (
          <article
            key={service.index}
            className="grid grid-cols-1 gap-4 py-10 md:grid-cols-[6rem_1fr] md:gap-10"
          >
            <p className="font-display text-4xl text-brand-ui">{service.index}</p>
            <div>
              <h2 className="font-display text-xl text-ink">{service.title}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-loose text-ink-soft">
                {service.body}
              </p>
              <p className="mt-4 inline-block rounded-full bg-brand-wash px-4 py-1.5 text-xs text-brand-ink">
                {service.examples}
              </p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-16 flex flex-col items-start gap-6 rounded-card bg-paper-soft px-6 py-10 md:flex-row md:items-center md:justify-between md:px-10">
        <p className="max-w-md font-display text-xl leading-relaxed text-ink md:text-2xl">
          手がけた仕事は、実績ページでご覧いただけます。
        </p>
        <Link
          href="/works"
          className="rounded-full bg-brand-ink px-7 py-3 text-sm tracking-wide text-paper transition-opacity hover:opacity-90"
        >
          実績を見る
        </Link>
      </div>
    </div>
  );
}
