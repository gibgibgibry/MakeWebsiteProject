import { test, expect } from "@playwright/test";

test("home page renders hero and nav", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "誌面をデザインする。",
  );
  await expect(page.getByRole("link", { name: "会社情報" }).first()).toBeVisible();
});

test.describe("page navigation", () => {
  for (const { path, heading } of [
    { path: "/company", heading: "会社情報" },
    { path: "/business", heading: "事業内容" },
    { path: "/contact", heading: "お問い合わせ" },
  ]) {
    test(`navigates to ${path}`, async ({ page }) => {
      await page.goto("/");
      await page.getByRole("link", { name: heading, exact: false }).first().click();
      await expect(page).toHaveURL(new RegExp(`${path}$`));
      await expect(
        page.getByRole("heading", { level: 1, name: heading }),
      ).toBeVisible();
    });
  }
});

test("contact form shows validation errors on empty submit", async ({ page }) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: "送信する" }).click();
  await expect(page.getByText("お名前を入力してください。")).toBeVisible();
});

test("contact form submits successfully", async ({ page }) => {
  await page.goto("/contact");
  await page.getByLabel("お名前").fill("山田太郎");
  await page.getByLabel("メールアドレス").fill("taro@example.com");
  await page.getByLabel("お問い合わせ内容").fill("テストお問い合わせです。");
  await page.getByRole("button", { name: "送信する" }).click();
  await expect(page.getByText("送信が完了しました")).toBeVisible();
});
