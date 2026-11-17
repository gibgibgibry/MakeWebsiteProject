/**
 * サイト全体で使う絶対URL。
 *
 * NEXT_PUBLIC_ 接頭辞の環境変数は**ビルド時にバンドルへ埋め込まれる**ため、
 * ドメインを変更したら再ビルドが必要（Webhookの再検証では反映されない）。
 *
 * 未設定のまま本番ビルドを通すと OGP タグと sitemap.xml に localhost が
 * 焼き込まれたまま公開され、しばらく誰も気づかない。そのため Vercel の本番ビルド
 * （VERCEL_ENV=production。Vercel が自動で設定する）では未設定ならビルドを失敗させる。
 * ビルドが失敗しても公開中のサイトは直前のデプロイのまま残る。
 *
 * プレビュー（Dependabot の PR など）・CI・ローカルのビルドは止めず、警告に留める。
 * CI の e2e は playwright.config.ts の webServer.env で値を渡している。
 */
const FALLBACK_SITE_URL = "http://localhost:3000";

function resolveSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (configured) return configured.replace(/\/$/, "");

  if (process.env.VERCEL_ENV === "production") {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL is not set for the production deployment. " +
        "Set it to the public origin (https://www.palpallette.com) in the Vercel " +
        "project's environment variables and redeploy.",
    );
  }

  if (process.env.NODE_ENV === "production") {
    console.warn(
      "[site] NEXT_PUBLIC_SITE_URL is not set — falling back to " +
        `${FALLBACK_SITE_URL}. OGP tags and sitemap.xml will contain localhost URLs. ` +
        "Set it before deploying.",
    );
  }

  return FALLBACK_SITE_URL;
}

export const SITE_URL = resolveSiteUrl();

export const siteUrl = (path = "/"): string =>
  new URL(path, SITE_URL).toString();

export const SITE_NAME = "Palpallette";
export const SITE_NAME_JA = "有限会社パルパレット";
