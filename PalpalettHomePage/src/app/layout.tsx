import type { Metadata } from "next";
import { Noto_Sans_JP, Zen_Maru_Gothic } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE_NAME, SITE_NAME_JA, SITE_URL } from "@/lib/site";

/**
 * preload: false は必須。これらのCJKファミリーは ~300+ の unicode-range チャンクに
 * 分割されており、全部を preload するとページが肥大化し、ブラウザ自動化
 * （Playwright の page.goto）が高確率でハングする。ブラウザは unicode-range を見て
 * 必要なチャンクだけ取得するため、preload: false が正しい設定であって回避策ではない。
 */
/* next/font は引数に「明示的なリテラル」しか受け付けない（ビルド時に静的解析するため）。
   共通の fallback 配列を定数に切り出すとビルドが失敗するので、各呼び出しに直接書く。 */
const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  preload: false,
  display: "swap",
  fallback: ["Hiragino Sans", "Hiragino Kaku Gothic ProN", "Meiryo", "sans-serif"],
});

/** 見出し用の丸ゴシック。「かわいい・柔らかい」というブランドを字形で表現する。
 *  明朝（旧: Shippori Mincho）は硬派でブランドと衝突するため置き換えた。 */
const zenMaruGothic = Zen_Maru_Gothic({
  variable: "--font-zen-maru-gothic",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  preload: false,
  display: "swap",
  fallback: ["Hiragino Sans", "Hiragino Kaku Gothic ProN", "Meiryo", "sans-serif"],
});

const DESCRIPTION =
  "有限会社パルパレットは、雑誌・コミックス・書籍の装丁からポスター・パンフレット・チラシ・ロゴまで手がけるデザイン事務所です。かわいいデザイン、柔らかいデザインをお任せください。";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | デザイン事務所`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: SITE_NAME,
    url: SITE_URL,
    title: `${SITE_NAME} | デザイン事務所`,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
  },
};

/** 検索エンジン向けの構造化データ。所在地と連絡先は会社概要と同じ実データ。 */
const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME_JA,
  alternateName: SITE_NAME,
  url: SITE_URL,
  foundingDate: "1998",
  description: DESCRIPTION,
  telephone: "+81-3-4296-4965",
  faxNumber: "+81-3-4296-4965",
  address: {
    "@type": "PostalAddress",
    postalCode: "178-0063",
    addressCountry: "JP",
    addressRegion: "東京都",
    addressLocality: "練馬区",
    streetAddress: "東大泉7-32-6",
  },
} as const;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${notoSansJP.variable} ${zenMaruGothic.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          本文へスキップ
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <script
          type="application/ld+json"
          // 内容はビルド時に確定する自前の定数のみ。外部入力は混ぜないこと。
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(ORGANIZATION_JSON_LD),
          }}
        />
      </body>
    </html>
  );
}
