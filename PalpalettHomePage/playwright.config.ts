import { defineConfig, devices } from "@playwright/test";

const MOCK_ORIGIN = "http://127.0.0.1:4010";

/**
 * e2e は microCMS のモックサーバーに対して実行する。
 * webServer.env で子プロセスに注入するので `.env` ファイルは作らない
 * （CLAUDE.md の「.env を生成しない」に抵触しないのはこの方式だけ）。
 */
const E2E_ENV = {
  MICROCMS_SERVICE_DOMAIN: "e2e",
  MICROCMS_API_KEY: "e2e-dummy-key",
  MICROCMS_BASE_URL: `${MOCK_ORIGIN}/api/v1`,
  MICROCMS_WEBHOOK_SECRET: "e2e-webhook-secret",
  NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
};

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  webServer: [
    {
      command: "node e2e/mock-microcms.mjs",
      url: `${MOCK_ORIGIN}/__mock/health`,
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
    },
    {
      command: "npm run build && npm run start",
      url: "http://localhost:3000",
      reuseExistingServer: !process.env.CI,
      timeout: 180_000,
      env: E2E_ENV,
    },
  ],
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
