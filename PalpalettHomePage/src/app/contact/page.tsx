import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description:
    "Palpalletteへのお問い合わせ先。雑誌・書籍・コミックスの装丁、ポスターやチラシ、ロゴのご相談を承ります。",
};

// TODO: 公開用メールアドレスが未確定。確定次第 EMAIL を差し替え、
//       下の「メールでのお問い合わせ」ブロックのコメントアウトを解除する。
const EMAIL: string | null = null;

const TEL_FAX = "03-4296-4965";
const POSTAL_CODE = "〒178-0063";
const ADDRESS = "東京都練馬区東大泉7-32-6";
const ACCESS = "西武池袋線 大泉学園駅から徒歩11分";

const TOPICS = [
  "雑誌の表紙・誌面デザイン",
  "コミックス・書籍の装丁",
  "ポスター・パンフレット・チラシ",
  "ロゴデザイン",
  "付録やグッズのデザイン",
];

const STEPS = [
  {
    index: "01",
    title: "ご連絡",
    body: "お電話またはメールで、企画の概要・希望スケジュール・ご予算感をお知らせください。",
  },
  {
    index: "02",
    title: "お打ち合わせ",
    body: "内容をうかがい、デザインの方向性と進め方をご相談します。",
  },
  {
    index: "03",
    title: "お見積もり",
    body: "作業範囲を確定し、お見積もりをご提示します。",
  },
  {
    index: "04",
    title: "制作開始",
    body: "スケジュールに沿ってデザインを進行します。",
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
      <p className="text-sm tracking-[0.3em] text-accent">CONTACT</p>
      <h1 className="mt-4 font-serif text-3xl text-ink md:text-5xl">
        お問い合わせ
      </h1>
      <p className="mt-6 max-w-xl text-sm leading-loose text-ink-soft">
        デザインのご相談・お見積もりのご依頼は、お電話またはメールにて承ります。
        まずはお気軽にご連絡ください。
      </p>

      <div className="mt-14 grid gap-14 md:grid-cols-[1fr_22rem]">
        <div>
          <h2 className="font-serif text-xl text-ink">こんなご相談を承ります</h2>
          <ul className="mt-6 space-y-3">
            {TOPICS.map((topic) => (
              <li
                key={topic}
                className="flex items-baseline gap-3 border-b border-line pb-3 text-sm text-ink"
              >
                <span aria-hidden="true" className="text-accent">
                  —
                </span>
                {topic}
              </li>
            ))}
          </ul>

          <h2 className="mt-14 font-serif text-xl text-ink">ご依頼の流れ</h2>
          <ol className="mt-6 space-y-6">
            {STEPS.map((step) => (
              <li
                key={step.index}
                className="grid grid-cols-[3rem_1fr] gap-4 md:gap-6"
              >
                <span className="font-serif text-2xl text-line">
                  {step.index}
                </span>
                <div>
                  <p className="text-base text-ink">{step.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <aside className="text-sm leading-loose text-ink-soft">
          <h2 className="sr-only">連絡先</h2>

          <p className="text-ink">お電話・FAX</p>
          <p className="mt-1">
            <a href={`tel:${TEL_FAX.replace(/-/g, "")}`} className="hover:text-accent">
              {TEL_FAX}
            </a>
          </p>

          {EMAIL && (
            <>
              <p className="mt-8 text-ink">メール</p>
              <p className="mt-1">
                <a href={`mailto:${EMAIL}`} className="hover:text-accent">
                  {EMAIL}
                </a>
              </p>
            </>
          )}

          <p className="mt-8 text-ink">所在地</p>
          <address className="mt-1 not-italic">
            {POSTAL_CODE}
            <br />
            {ADDRESS}
          </address>
          <p className="mt-2 text-xs">{ACCESS}</p>
        </aside>
      </div>
    </div>
  );
}
