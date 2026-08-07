import Link from "next/link";

const SERVICES = [
  {
    index: "01",
    title: "雑誌デザイン",
    body: "誌面のレイアウト・組版から特集ページのアートディレクションまで、雑誌一冊を通したデザインを手がけます。",
  },
  {
    index: "02",
    title: "書籍装丁・DTP",
    body: "書籍のカバーデザインや本文組版など、紙面に落とし込むまでの制作進行をトータルでサポートします。",
  },
  {
    index: "03",
    title: "エディトリアル制作",
    body: "編集者・ライターとの協働を前提に、読みやすく・伝わる誌面構成を設計します。",
  },
];

export default function Home() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-16 md:px-10 md:pb-32 md:pt-24">
        <p className="text-sm tracking-[0.3em] text-accent">DESIGN STUDIO</p>
        <h1 className="mt-6 max-w-3xl font-serif text-4xl leading-snug text-ink md:text-6xl md:leading-snug">
          編集の現場から、
          <br />
          誌面をデザインする。
        </h1>
        <p className="mt-8 max-w-xl text-base leading-loose text-ink-soft">
          PalPalletは、講談社をはじめとする出版社の雑誌・書籍デザインを手がける
          小さな編集デザインスタジオです。企画の意図を汲み取り、読者に届く誌面を組み立てます。
        </p>
        <div className="mt-10 flex gap-4">
          <Link
            href="/business"
            className="border border-ink px-6 py-3 text-sm tracking-wide text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            事業内容を見る
          </Link>
          <Link
            href="/contact"
            className="bg-accent px-6 py-3 text-sm tracking-wide text-paper transition-opacity hover:opacity-90"
          >
            お問い合わせ
          </Link>
        </div>
      </section>

      <section className="border-y border-line bg-ink py-10 text-paper">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <p className="text-xs tracking-[0.3em] text-paper/60">CLIENT</p>
          <p className="mt-3 font-serif text-2xl md:text-3xl">
            講談社 <span className="mx-3 text-paper/40">/</span> 出版社各社
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-28">
        <div className="flex items-end justify-between border-b border-line pb-6">
          <h2 className="font-serif text-2xl text-ink md:text-3xl">事業内容</h2>
          <Link href="/business" className="text-sm text-ink-soft hover:text-accent">
            すべて見る →
          </Link>
        </div>

        <div className="mt-10 grid gap-10 md:grid-cols-3">
          {SERVICES.map((service) => (
            <div key={service.index}>
              <p className="font-serif text-3xl text-line">{service.index}</p>
              <h3 className="mt-3 text-lg text-ink">{service.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                {service.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-16 md:flex-row md:items-center md:px-10">
          <h2 className="max-w-md font-serif text-2xl leading-snug text-ink md:text-3xl">
            誌面づくりのご相談、お待ちしています。
          </h2>
          <Link
            href="/contact"
            className="border border-ink px-6 py-3 text-sm tracking-wide text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            お問い合わせはこちら
          </Link>
        </div>
      </section>
    </>
  );
}
