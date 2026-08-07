import { test, expect } from "@playwright/test";

/** ヘッダー内のナビゲーションに限定する。
 *  ページ本文にも同じ文言のCTAリンクがあるため、スコープを絞らないと
 *  `.first()` がどれを指すかがレイアウト変更のたびに変わってしまう。 */
const headerNav = (page: import("@playwright/test").Page) =>
  page.getByRole("banner").getByRole("navigation");

test("home page renders hero and nav", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(headerNav(page).getByRole("link", { name: "会社情報" })).toBeVisible();
});

test.describe("page navigation", () => {
  for (const { path, heading } of [
    { path: "/company", heading: "会社情報" },
    { path: "/business", heading: "事業内容" },
    { path: "/contact", heading: "お問い合わせ" },
  ]) {
    test(`navigates to ${path}`, async ({ page }) => {
      await page.goto("/");
      await headerNav(page).getByRole("link", { name: heading }).click();
      await expect(page).toHaveURL(new RegExp(`${path}$`));
      await expect(
        page.getByRole("heading", { level: 1, name: heading }),
      ).toBeVisible();
    });
  }
});

test.describe("company page", () => {
  test("shows the real company details", async ({ page }) => {
    await page.goto("/company");

    await expect(page.getByText("有限会社パルパレット（Palpallette）")).toBeVisible();
    await expect(page.getByText("1998年", { exact: true })).toBeVisible();
    await expect(page.getByText("白井秀子", { exact: true })).toBeVisible();
    await expect(
      page.getByText("〒178-0063 東京都練馬区東大泉7-32-6"),
    ).toBeVisible();

    // 社名の由来は代表の言葉で、この会社を最もよく表す部分なので必ず載せる
    await expect(
      page.getByRole("heading", { name: "社名の由来" }),
    ).toBeVisible();

    // プレースホルダが残っていないこと
    await expect(page.getByText("◯")).toHaveCount(0);
  });
});

test.describe("business page", () => {
  test("lists all service categories", async ({ page }) => {
    await page.goto("/business");
    for (const title of [
      "雑誌デザイン",
      "コミックス・書籍の装丁",
      "ポスター・パンフレット・チラシ",
      "ロゴ・グッズデザイン",
    ]) {
      await expect(page.getByRole("heading", { name: title })).toBeVisible();
    }
  });
});

test.describe("contact page", () => {
  test("shows contact details instead of a form", async ({ page }) => {
    await page.goto("/contact");

    // 電話番号と所在地が公開されていること
    await expect(page.getByRole("link", { name: "03-4296-4965" })).toBeVisible();
    await expect(page.getByText("東京都練馬区東大泉7-32-6")).toBeVisible();

    // 問い合わせフォームは撤去済み
    await expect(page.locator("form")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "送信する" })).toHaveCount(0);
  });
});
