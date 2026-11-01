import type { Metadata } from "next";
import PageBand from "@/components/PageBand";
import SidebarLayout from "@/components/SidebarLayout";

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
  "雑誌の表紙・誌面デザイン","コミックス・書籍の装丁","ポスター・パンフレット・チラシ","ロゴデザイン","付録やグッズのデザイン",
];

const STEPS = [
  {
    index: "01",
    title: "ご連絡",body: "お電話またはメールで、企画の概要・希望スケジュール・ご予算感をお知らせください。",
  },
  {
    index: "02",
    title: "お打ち合わせ",body: "内容をうかがい、デザインの方向性と進め方をご相談します。",
  },
  {
    index: "03",
    title: "お見積もり",body: "作業範囲を確定し、お見積もりをご提示します。",
  },
  {
    index: "04",
    title: "制作開始",body: "スケジュールに沿ってデザインを進行します。",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageBand eyebrow="CONTACT" title="お問い合わせ" />
      <SidebarLayout>
        <p className="text-sm leading-loose text-ink-soft">
          デザインのご相談・お見積もりのご依頼は、お電話またはメールにて承ります。まずはお気軽にご連絡ください。
        </p>

        {/* 連絡先はこのページで最も重要な情報なので、1カラム時は先頭に出す。
            xl 以上で右列へ（サイドバーと並ぶため、それ未満では横に並べると本文列が狭すぎる） */}
        <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_16rem]">
          <section
            aria-labelledby="contact-info-heading"
            className="h-fit rounded-card border border-line bg-paper p-6 text-sm leading-loose text-ink-soft xl:col-start-2 xl:row-start-1"
          >
            <h2 id="contact-info-heading" className="sr-only">
              連絡先
            </h2>

            <p className="text-ink">お電話・FAX</p>
            <p className="mt-1">
              <a
                href={`tel:${TEL_FAX.replace(/-/g, "")}`}
                className="text-brand-ink hover:underline"
              >
                {TEL_FAX}
              </a>
            </p>

            {EMAIL && (
              <>
                <p className="mt-8 text-ink">メール</p>
                <p className="mt-1">
                  <a
                    href={`mailto:${EMAIL}`}
                    className="break-all text-brand-ink hover:underline"
                  >
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
          </section>

          <div className="space-y-8 xl:col-start-1 xl:row-start-1">
            <section className="rounded-card border border-line bg-paper p-6">
              <h2 className="font-display text-xl text-ink">こんなご相談を承ります</h2>
              <ul className="mt-5 space-y-3">
                {TOPICS.map((topic) => (
                  <li
                    key={topic}
                    className="flex items-baseline gap-3 border-b border-line pb-3 text-sm text-ink last:border-b-0 last:pb-0"
                  >
                    <span aria-hidden="true" className="text-brand-ink">
                      —
                    </span>
                    {topic}
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-card border border-line bg-paper p-6">
              <h2 className="font-display text-xl text-ink">ご依頼の流れ</h2>
              <ol className="mt-5 space-y-6">
                {STEPS.map((step) => (
                  <li key={step.index} className="grid grid-cols-[3rem_1fr] gap-4">
                    <span className="font-display text-2xl text-brand-ui">
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
            </section>
          </div>
        </div>
      </SidebarLayout>
    </>
  );
}
