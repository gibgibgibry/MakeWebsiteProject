import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "会社情報",
  description: "PalPalletの会社概要ページです。",
};

// TODO: 下記の会社概要は仮の情報です。正式な内容に差し替えてください。
const COMPANY_INFO: { label: string; value: string }[] = [
  { label: "会社名", value: "PalPallet" },
  { label: "設立", value: "◯◯◯◯年◯月" },
  { label: "代表者", value: "◯◯ ◯◯" },
  { label: "所在地", value: "〒◯◯◯-◯◯◯◯ ◯◯都道府県◯◯市◯◯" },
  { label: "電話番号", value: "◯◯-◯◯◯◯-◯◯◯◯" },
  { label: "メールアドレス", value: "info@example.com" },
  { label: "主な取引先", value: "講談社 ほか出版社各社" },
  { label: "事業内容", value: "雑誌・書籍のデザイン、DTP制作、編集制作 ほか" },
];

export default function CompanyPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
      <p className="text-sm tracking-[0.3em] text-accent">COMPANY</p>
      <h1 className="mt-4 font-serif text-3xl text-ink md:text-5xl">会社情報</h1>
      <p className="mt-6 max-w-xl text-sm leading-loose text-ink-soft">
        PalPalletは、出版社の雑誌・書籍づくりに伴走する編集デザインスタジオです。
        企画から誌面が完成するまで、編集部の一員のような距離感でデザインを担当します。
      </p>

      <div className="mt-14 border-t border-line">
        <dl>
          {COMPANY_INFO.map((item) => (
            <div
              key={item.label}
              className="grid grid-cols-1 gap-2 border-b border-line py-6 md:grid-cols-[10rem_1fr] md:gap-6"
            >
              <dt className="text-sm tracking-wide text-ink-soft">{item.label}</dt>
              <dd className="text-base text-ink">{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
