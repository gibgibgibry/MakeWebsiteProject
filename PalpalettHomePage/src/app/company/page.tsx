import type { Metadata } from "next";
import PageBand from "@/components/PageBand";
import SidebarLayout from "@/components/SidebarLayout";

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

/** 見出しをピンクの帯にした白いカード（旧サイトの見出しの意匠） */
function BandCard({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      aria-labelledby={id}
      className="mt-10 overflow-hidden rounded-card border border-line bg-paper"
    >
      <div className="bg-brand-fill px-6 py-3">
        <h2 id={id} className="font-display text-lg text-paper">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

export default function CompanyPage() {
  return (
    <>
      <PageBand eyebrow="COMPANY" title="会社情報" />
      <SidebarLayout>
        <p className="text-sm leading-loose text-ink-soft">
          1998年の設立以来、出版社の雑誌やコミックスを中心に、紙面のデザインを手がけてきました。かわいいデザイン、柔らかいデザインを得意としています。
        </p>

        {/* 社名の由来は代表の言葉であり、この会社を最もよく表す部分なので前に出す */}
        <BandCard id="origin-heading" title="社名の由来">
          <div className="space-y-5 px-6 py-8 text-sm leading-loose text-ink">
            <p>
              会社の名前を付けるにあたり、まず最初は “P” のつく言葉をつけたかったんです。“P” は元気に前向き、飛び出すイメージ。“P” がついている言葉に、私の中には暗いイメージがありませんでした。pleasure、paradise、passion、peace などなど……。
            </p>
            <p>
              pal の意味は仲間、pallette はそのまま絵のパレット。スタッフやクライアントを含め、色とりどりの違う個性がパレットの上で混ぜ合わさり、美しい絵になる……というイメージで名付けました。
            </p>
            <p>
              これからも、すべての個性を活かしつつ、引き出しつつ、ステキな作品を作って行けたらと考えています。
            </p>
            <p className="pt-2 text-right font-display text-base text-ink">
              代表　白井秀子
            </p>
          </div>
        </BandCard>

        <BandCard id="overview-heading" title="会社概要">
          <dl className="px-6">
            {COMPANY_INFO.map((item) => (
              <div
                key={item.label}
                className="grid grid-cols-1 gap-2 border-b border-line py-6 last:border-b-0 sm:grid-cols-[10rem_1fr] sm:gap-6"
              >
                <dt className="text-sm tracking-wide text-ink-soft">{item.label}</dt>
                <dd className="text-base leading-relaxed text-ink">{item.value}</dd>
              </div>
            ))}
          </dl>
        </BandCard>
      </SidebarLayout>
    </>
  );
}
