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
