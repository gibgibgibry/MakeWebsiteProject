/**
 * サイト全体で使う絶対URL。
 *
 * NEXT_PUBLIC_ 接頭辞の環境変数は**ビルド時にバンドルへ埋め込まれる**ため、
 * ドメインを変更したら再ビルドが必要（Webhookの再検証では反映されない）。
 *
 * TODO(Sprint 7 / 独自ドメイン確定後): 下の console.warn を throw に変える。
 *   未設定のまま本番ビルドを通すと OGP タグと sitemap.xml に localhost が
 *   焼き込まれたまま公開され、しばらく誰も気づかない。ドメインが決まり次第、
 *   ビルドを失敗させて事故を防ぐこと。現時点ではドメイン未定のため、
 *   各スプリントの検証（npm run build）を止めないよう警告に留めている。
 */
const FALLBACK_SITE_URL = "http://localhost:3000";

function resolveSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (configured) return configured.replace(/\/$/, "");

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
