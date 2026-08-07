import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "事業内容",
  description: "Palpalletteが手がける雑誌・書籍デザインなどの事業内容をご紹介します。",
};

const SERVICES = [
  {
    index: "01",
    title: "雑誌デザイン",
    body: "特集ページのアートディレクションから連載ページのフォーマット設計まで、雑誌一冊を通した誌面デザインを担当します。講談社をはじめとする出版社の雑誌制作に携わっています。",
  },
  {
    index: "02",
    title: "書籍装丁・DTP",
    body: "書籍のカバーデザイン、本文の組版・DTP制作を行います。読みやすさと世界観の両立を意識した紙面づくりを行います。",
  },
  {
    index: "03",
    title: "エディトリアルデザイン",
    body: "企画意図をくみ取り、写真・イラスト・文字組みのバランスを設計します。編集者・ライター・カメラマンとの協働を前提とした制作体制です。",
  },
  {
    index: "04",
    title: "DTP・制作進行サポート",
    body: "入稿データの作成や校正対応など、誌面が印刷にかかるまでの制作進行を支援します。",
  },
];

export default function BusinessPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
      <p className="text-sm tracking-[0.3em] text-accent">BUSINESS</p>
      <h1 className="mt-4 font-serif text-3xl text-ink md:text-5xl">事業内容</h1>
      <p className="mt-6 max-w-xl text-sm leading-loose text-ink-soft">
        講談社をはじめとする出版社の雑誌・書籍のデザインを中心に、
        誌面づくりに関わる制作業務を行っています。
      </p>

      <div className="mt-14 divide-y divide-line border-t border-line">
        {SERVICES.map((service) => (
          <div
            key={service.index}
            className="grid grid-cols-1 gap-4 py-10 md:grid-cols-[6rem_1fr] md:gap-10"
          >
            <p className="font-serif text-4xl text-line">{service.index}</p>
            <div>
              <h2 className="text-xl text-ink">{service.title}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft">
                {service.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
