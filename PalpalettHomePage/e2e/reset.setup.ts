import { test as setup } from "@playwright/test";
import { resetMockAndCaches } from "./helpers/webhook";

/** 全テストの前に、モックのデータと Next 側のキャッシュを初期状態へ戻す。
 *  webServer が前回のプロセスを再利用しても結果が変わらないようにするため。 */
setup("reset mock data and caches", async ({ request }) => {
  await resetMockAndCaches(request);
});
