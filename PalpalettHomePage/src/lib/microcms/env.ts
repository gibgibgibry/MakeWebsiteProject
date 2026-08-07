import "server-only";

/**
 * microCMS の接続情報。
 *
 * MICROCMS_BASE_URL は e2e テスト用のシーム。ここを差し替えることで、
 * ローカルのモックサーバーに対して「本物と同じコードパス」を走らせられる。
 * （Playwright の page.route はブラウザのリクエストしか横取りできないため、
 *  サーバー側で走る microCMS へのfetchには届かない）
 *
 * APIキーは NEXT_PUBLIC_ を付けないこと。付けるとクライアントバンドルに
 * 埋め込まれて公開されてしまう。
 */
export type MicroCmsEnv = {
  baseUrl: string;
  apiKey: string;
};

function readBaseUrl(serviceDomain: string | undefined): string {
  const override = process.env.MICROCMS_BASE_URL?.trim();

  if (override) {
    let parsed: URL;
    try {
      parsed = new URL(override);
    } catch {
      throw new Error("MICROCMS_BASE_URL is not a valid URL.");
    }
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      throw new Error("MICROCMS_BASE_URL must use http or https.");
    }
    // 本番で任意のホストを向けられると、このサイトが SSRF の踏み台になりうる。
    if (
      process.env.NODE_ENV === "production" &&
      !parsed.hostname.endsWith(".microcms.io")
    ) {
      throw new Error(
        "MICROCMS_BASE_URL must point at a *.microcms.io host in production.",
      );
    }
    return override.replace(/\/$/, "");
  }

  if (!serviceDomain) {
    throw new Error(
      "MICROCMS_SERVICE_DOMAIN is not set. Set it (and MICROCMS_API_KEY), " +
        "or set MICROCMS_BASE_URL to point at a mock server for testing.",
    );
  }

  return `https://${serviceDomain}.microcms.io/api/v1`;
}

export function getMicroCmsEnv(): MicroCmsEnv {
  const apiKey = process.env.MICROCMS_API_KEY?.trim();

  if (!apiKey) {
    throw new Error("MICROCMS_API_KEY is not set.");
  }

  return {
    baseUrl: readBaseUrl(process.env.MICROCMS_SERVICE_DOMAIN?.trim()),
    apiKey,
  };
}

/** microCMS の設定が揃っているか。ビルドを止めずに空表示へ倒す判断に使う。 */
export function isMicroCmsConfigured(): boolean {
  const hasKey = Boolean(process.env.MICROCMS_API_KEY?.trim());
  const hasHost =
    Boolean(process.env.MICROCMS_SERVICE_DOMAIN?.trim()) ||
    Boolean(process.env.MICROCMS_BASE_URL?.trim());
  return hasKey && hasHost;
}
