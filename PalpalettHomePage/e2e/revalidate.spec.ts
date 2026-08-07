import { test, expect } from "@playwright/test";
import {
  MOCK_ORIGIN,
  postWebhook,
  resetMockAndCaches,
  sign,
} from "./helpers/webhook";

/**
 * Webhook → オンデマンドISR の一連の流れを検証する。
 *
 * このファイルはモックサーバーの状態を書き換えるため、他テストと並行に走らせては
 * いけない。playwright.config.ts で専用プロジェクトに分け、chromium プロジェクトの
 * 完了後に単独で実行している。
 *
 * なお ISR は開発モードでは成立しない（常にオンデマンドレンダリングされる）。
 * webServer が build && start を実行しているからこそ意味のあるテストになる。
 */
test.describe.configure({ mode: "serial" });

const MOCK = MOCK_ORIGIN;

const NEW_WORK = {
  id: "newly-published-work",
  title: "あとから公開した作品",
  client: "テスト出版",
  category: null,
  coverImage: {
    url: "http://127.0.0.1:4010/assets/new.png",
    width: 700,
    height: 1000,
  },
  year: 2026,
  order: 99,
  createdAt: "2026-02-01T00:00:00.000Z",
  updatedAt: "2026-02-01T00:00:00.000Z",
  publishedAt: "2026-02-01T00:00:00.000Z",
  revisedAt: "2026-02-01T00:00:00.000Z",
};

test.afterAll(async ({ request }) => {
  // 後続の実行に影響しないよう、モックとキャッシュの両方を戻す
  await resetMockAndCaches(request);
});

test("publishing a new work appears only after revalidation", async ({
  page,
  request,
}) => {
  await resetMockAndCaches(request);

  const cards = page.getByTestId("works-grid").locator("> li");

  await page.goto("/works");
  await expect(cards).toHaveCount(4);

  // CMS側に1件追加する
  const current = await (await request.get(`${MOCK}/api/v1/works?limit=100`, {
    headers: { "x-microcms-api-key": "e2e-dummy-key" },
  })).json();
  await request.post(`${MOCK}/__mock/works`, {
    data: [...current.contents, NEW_WORK],
  });

  // 再検証していないので、まだ4件のまま見えること
  // （= ページが実際にキャッシュされている証拠。ここが5件だとISRが効いていない）
  await page.reload();
  await expect(cards).toHaveCount(4);

  // Webhook を叩く
  const response = await postWebhook(request, {
    api: "works",
    id: NEW_WORK.id,
    contents: { new: { id: NEW_WORK.id } },
  });
  expect(response.status()).toBe(200);
  expect(await response.json()).toMatchObject({ revalidated: true });

  // 一覧に反映される
  await page.reload();
  await expect(cards).toHaveCount(5);
  // 位置は order（99）と year の兼ね合いで決まるため、末尾とは限らない。
  // ここで見たいのは「反映されたこと」なので一覧に含まれることだけを見る。
  await expect(page.getByTestId("works-grid")).toContainText(NEW_WORK.title);

  // generateStaticParams は再実行されないので、詳細ページが出せるのは
  // dynamicParams によるオンデマンド生成のおかげ。ここが404なら設定が壊れている。
  const detail = await page.goto(`/works/${NEW_WORK.id}`);
  expect(detail?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    NEW_WORK.title,
  );
});

test("rejects a request with an invalid signature", async ({ request }) => {
  const response = await postWebhook(
    request,
    { api: "works" },
    "0".repeat(64),
  );
  expect(response.status()).toBe(401);
});

test("rejects a request with no signature header", async ({ request }) => {
  const response = await request.post("/api/revalidate", {
    headers: { "content-type": "application/json" },
    data: JSON.stringify({ api: "works" }),
  });
  expect(response.status()).toBe(401);
});

test("rejects a truncated signature without crashing", async ({ request }) => {
  // timingSafeEqual は長さ不一致で例外を投げる。500 ではなく 401 を返すこと。
  const response = await postWebhook(request, { api: "works" }, "abc");
  expect(response.status()).toBe(401);
});

test("accepts a valid signature with an unparseable body", async ({
  request,
}) => {
  const body = "this-is-not-json";
  const response = await request.post("/api/revalidate", {
    headers: {
      "content-type": "application/json",
      "x-microcms-signature": sign(body),
    },
    // content-type が application/json のとき、Playwright は文字列を
    // JSON として再エンコードしてしまい、署名対象のバイト列がずれる。
    // Buffer で渡して生バイトのまま送る。
    data: Buffer.from(body, "utf8"),
  });
  // 署名が正しい以上リトライさせる意味はないので、保守的に全体無効化して 200 を返す
  expect(response.status()).toBe(200);
});
