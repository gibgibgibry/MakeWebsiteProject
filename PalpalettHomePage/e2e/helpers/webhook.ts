import { createHmac } from "node:crypto";
import type { APIRequestContext } from "@playwright/test";

export const MOCK_ORIGIN = "http://127.0.0.1:4010";

/** playwright.config.ts の webServer.env と同じ値。 */
export const WEBHOOK_SECRET = "e2e-webhook-secret";

export const sign = (body: string): string =>
  createHmac("sha256", WEBHOOK_SECRET).update(body, "utf8").digest("hex");

export function postWebhook(
  request: APIRequestContext,
  payload: unknown,
  signature?: string,
) {
  const body = JSON.stringify(payload);
  return request.post("/api/revalidate", {
    headers: {
      "content-type": "application/json",
      "x-microcms-signature": signature ?? sign(body),
    },
    data: body,
  });
}

/**
 * モックのデータをフィクスチャ初期状態へ戻し、Next 側のキャッシュも破棄する。
 *
 * webServer は reuseExistingServer で前回のプロセスを使い回すことがあるため、
 * 「前回の実行で追加した作品が残ったまま次の実行が始まる」事故が起きうる。
 * 毎回ここから始めることで、実行順や再利用に関係なく既知の状態を保証する。
 */
export async function resetMockAndCaches(request: APIRequestContext) {
  await request.post(`${MOCK_ORIGIN}/__mock/reset`);
  await postWebhook(request, { api: "works" });
  await postWebhook(request, { api: "categories" });
}
