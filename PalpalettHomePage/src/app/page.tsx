import Link from "next/link";
import { SERVICES } from "@/lib/services";

export default function Home() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-16 md:px-10 md:pb-28 md:pt-24">
        <p className="text-sm tracking-[0.3em] text-brand-ink">DESIGN OFFICE</p>
        <h1 className="mt-6 max-w-3xl font-display text-4xl leading-snug text-ink md:text-6xl md:leading-snug">
          かわいいを、
          <br />
          ていねいにデザインする。
        </h1>
        <p className="mt-8 max-w-xl text-base leading-loose text-ink-soft">
          有限会社パルパレットは、1998年から出版社の雑誌やコミックスを中心に
          紙面のデザインを手がけてきたデザイン事務所です。
          かわいいデザイン、柔らかいデザイン全般、お任せください。
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/works"
            className="rounded-full bg-brand-ink px-7 py-3 text-sm tracking-wide text-paper transition-opacity hover:opacity-90"
          >
            実績を見る
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-line-strong px-7 py-3 text-sm tracking-wide text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper"
          >
            お問い合わせ
          </Link>
        </div>
      </section>

      <section
        aria-label="主な取引先"
        className="border-y border-line bg-brand-wash py-10"
      >
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <p className="text-xs tracking-[0.3em] text-brand-ink">CLIENT</p>
          <p className="mt-3 font-display text-2xl text-ink md:text-3xl">
            株式会社講談社
            <span aria-hidden="true" className="mx-3 text-brand-ui">
              /
            </span>
            出版社各社
          </p>
        </div>
      </section>

      <section
        aria-labelledby="services-heading"
        className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-28"
      >
        <div className="flex items-end justify-between border-b border-line pb-6">
          <h2
            id="services-heading"
            className="font-display text-2xl text-ink md:text-3xl"
          >
            事業内容
          </h2>
          <Link
            href="/business"
            className="text-sm text-ink-soft hover:text-brand-ink"
          >
            すべて見る →
          </Link>
        </div>

        <div className="mt-10 grid gap-10 sm:grid-cols-2">
          {SERVICES.map((service) => (
            <div key={service.index}>
              <p className="font-display text-3xl text-brand-ui">
                {service.index}
              </p>
              <h3 className="mt-3 font-display text-lg text-ink">
                {service.title}
              </h3>
              <p className="mt-3 text-sm leading-loose text-ink-soft">
                {service.summary}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-paper-soft">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-16 md:flex-row md:items-center md:px-10">
          <h2 className="max-w-md font-display text-2xl leading-relaxed text-ink md:text-3xl">
            デザインのご相談、
            <br className="hidden sm:inline" />
            お待ちしています。
          </h2>
          <Link
            href="/contact"
            className="rounded-full bg-brand-ink px-7 py-3 text-sm tracking-wide text-paper transition-opacity hover:opacity-90"
          >
            お問い合わせはこちら
          </Link>
        </div>
      </section>
    </>
  );
}
