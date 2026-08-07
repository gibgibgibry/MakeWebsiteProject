import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "会社情報",
  description:
    "有限会社パルパレットの会社概要。1998年設立、代表 白井秀子。雑誌・コミックス・書籍の装丁からポスター・チラシ・ロゴまで手がけるデザイン事務所です。",
};

const COMPANY_INFO: { label: string; value: string }[] = [
  { label: "会社名", value: "有限会社パルパレット（Palpallette）" },
  { label: "設立", value: "1998年" },
  { label: "代表者", value: "白井秀子" },
  { label: "所在地", value: "〒178-0063 東京都練馬区東大泉7-32-6" },
  { label: "アクセス", value: "西武池袋線 大泉学園駅から徒歩11分" },
  { label: "Tel / Fax", value: "03-4296-4965" },
  {
    label: "事業内容",
    value:
      "雑誌・書籍（コミックス）のデザイン、ポスター・パンフレット・チラシ、ロゴデザイン ほか",
  },
  { label: "主な取引先", value: "株式会社講談社 ほか出版社各社" },
];

export default function CompanyPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
      <p className="text-sm tracking-[0.3em] text-brand-ink">COMPANY</p>
      <h1 className="mt-4 font-display text-3xl text-ink md:text-5xl">会社情報</h1>
      <p className="mt-6 max-w-xl text-sm leading-loose text-ink-soft">
        1998年の設立以来、出版社の雑誌やコミックスを中心に、
        紙面のデザインを手がけてきました。
        かわいいデザイン、柔らかいデザインを得意としています。
      </p>

      {/* 社名の由来は代表の言葉であり、この会社を最もよく表す部分なので前に出す */}
      <section
        aria-labelledby="origin-heading"
        className="mt-16 rounded-card bg-brand-wash px-6 py-10 md:px-12 md:py-14"
      >
        <h2
          id="origin-heading"
          className="font-display text-2xl text-ink md:text-3xl"
        >
          社名の由来
        </h2>
        <div className="mt-6 max-w-2xl space-y-5 text-sm leading-loose text-ink">
          <p>
            会社の名前を付けるにあたり、まず最初は “P” のつく言葉をつけたかったんです。
            “P” は元気に前向き、飛び出すイメージ。
            “P” がついている言葉に、私の中には暗いイメージがありませんでした。
            pleasure、paradise、passion、peace などなど……。
          </p>
          <p>
            pal の意味は仲間、pallette はそのまま絵のパレット。
            スタッフやクライアントを含め、色とりどりの違う個性がパレットの上で混ぜ合わさり、
            美しい絵になる……というイメージで名付けました。
          </p>
          <p>
            これからも、すべての個性を活かしつつ、引き出しつつ、
            ステキな作品を作って行けたらと考えています。
          </p>
          <p className="pt-2 text-right font-display text-base text-ink">
            代表　白井秀子
          </p>
        </div>
      </section>

      <section aria-labelledby="overview-heading" className="mt-20">
        <h2
          id="overview-heading"
          className="font-display text-2xl text-ink md:text-3xl"
        >
          会社概要
        </h2>
        <dl className="mt-8 border-t border-line">
          {COMPANY_INFO.map((item) => (
            <div
              key={item.label}
              className="grid grid-cols-1 gap-2 border-b border-line py-6 md:grid-cols-[12rem_1fr] md:gap-6"
            >
              <dt className="text-sm tracking-wide text-ink-soft">{item.label}</dt>
              <dd className="text-base leading-relaxed text-ink">{item.value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
