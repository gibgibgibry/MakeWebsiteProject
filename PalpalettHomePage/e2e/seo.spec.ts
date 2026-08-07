import { test, expect } from "@playwright/test";

/** playwright.config.ts の webServer.env と同じ値。 */
const SITE_URL = "http://localhost:3000";

test("robots.txt points at the sitemap and hides the webhook", async ({
  request,
}) => {
  const response = await request.get("/robots.txt");
  expect(response.status()).toBe(200);

  const body = await response.text();
  expect(body).toContain(`Sitemap: ${SITE_URL}/sitemap.xml`);
  expect(body).toContain("Disallow: /api/");
});

test("sitemap lists static routes and every work", async ({ request }) => {
  const response = await request.get("/sitemap.xml");
  expect(response.status()).toBe(200);

  const xml = await response.text();
  for (const path of ["/", "/works", "/business", "/company", "/contact"]) {
    expect(xml).toContain(`<loc>${SITE_URL}${path}</loc>`);
  }

  // フィクスチャの4作品がすべて含まれること
  const workUrls = xml.match(/<loc>[^<]*\/works\/[^<]*<\/loc>/g) ?? [];
  expect(workUrls).toHaveLength(4);
});

test("home page exposes OGP tags and organization structured data", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute(
    "content",
    "Palpallette",
  );
  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
    "content",
    "ja_JP",
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);

  const jsonLd = await page
    .locator('script[type="application/ld+json"]')
    .textContent();
  const parsed = JSON.parse(jsonLd ?? "{}");
  expect(parsed).toMatchObject({
    "@type": "Organization",
    name: "有限会社パルパレット",
    foundingDate: "1998",
  });
  // 会社概要ページと同じ実データであること
  expect(parsed.address.postalCode).toBe("178-0063");
});

test("the OG image renders", async ({ request }) => {
  const response = await request.get("/opengraph-image");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("image/png");
});

test("a work detail page has its own title and OGP", async ({ page }) => {
  await page.goto("/works/belove-2025-04");

  await expect(page).toHaveTitle(/BE・LOVE 2025年4月号 表紙 \| Palpallette/);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    "content",
    "BE・LOVE 2025年4月号 表紙",
  );
});
