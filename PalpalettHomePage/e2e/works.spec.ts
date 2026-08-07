import { test, expect } from "@playwright/test";

/** e2e/fixtures/works.json の並び順（lib/microcms/works.ts の compareWorks による）
 *  order 昇順 → year 降順 → タイトル(ja) */
const EXPECTED_ORDER = [
  "BE・LOVE 2025年4月号 表紙",
  "ちはやふる 公式コミックガイド",
  "カテゴリー未公開の作品",
  "マグカル・パフォーミング・アカデミー募集要項およびイベント告知用チラシ一式のデザイン制作",
];

test.describe("works list", () => {
  test("lists every work in the expected order", async ({ page }) => {
    await page.goto("/works");

    const cards = page.getByTestId("works-grid").locator("> li");
    await expect(cards).toHaveCount(EXPECTED_ORDER.length);

    for (const [i, title] of EXPECTED_ORDER.entries()) {
      await expect(cards.nth(i)).toContainText(title);
    }
  });

  test("filters by category without leaving the page", async ({ page }) => {
    await page.goto("/works");

    await page.getByRole("button", { name: "雑誌", exact: true }).click();

    const cards = page.getByTestId("works-grid").locator("> li");
    await expect(cards).toHaveCount(1);
    await expect(cards.first()).toContainText("BE・LOVE 2025年4月号 表紙");

    // 絞り込みは searchParams を使わない（使うとISRが無効化されるため）
    await expect(page).toHaveURL(/\/works$/);

    await page.getByRole("button", { name: "すべて", exact: true }).click();
    await expect(cards).toHaveCount(EXPECTED_ORDER.length);
  });

  test("navigates to a work detail page", async ({ page }) => {
    await page.goto("/works");
    await page.getByRole("link", { name: /ちはやふる 公式コミックガイド/ }).click();

    await expect(page).toHaveURL(/\/works\/chihayafuru-comic-guide$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "ちはやふる 公式コミックガイド" }),
    ).toBeVisible();
  });
});

test.describe("work detail", () => {
  test("renders optimized images and metadata", async ({ page }) => {
    await page.goto("/works/belove-2025-04");

    const firstImage = page.locator("main img").first();
    // next/image を経由していること（生のCMS URLを直接出していない）
    await expect(firstImage).toHaveAttribute("src", /^\/_next\/image/);
    const alt = await firstImage.getAttribute("alt");
    expect(alt?.length ?? 0).toBeGreaterThan(0);

    await expect(page.getByText("株式会社講談社『BE・LOVE』")).toBeVisible();
    await expect(page.getByText("2025年", { exact: true })).toBeVisible();
  });

  test("renders a work whose category is unpublished (null)", async ({ page }) => {
    // 参照先カテゴリーが下書きだと microCMS は null を返す。500 にならないこと。
    const response = await page.goto("/works/unpublished-category-work");
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "カテゴリー未公開の作品",
    );
  });

  for (const slug of ["does-not-exist", "UPPERCASE", "..%2F..%2Fetc"]) {
    test(`returns 404 for /works/${slug}`, async ({ page }) => {
      const response = await page.goto(`/works/${slug}`);
      expect(response?.status()).toBe(404);
    });
  }
});

test.describe("lightbox", () => {
  test("opens on click, navigates, and restores focus on close", async ({
    page,
  }) => {
    await page.goto("/works/belove-2025-04");

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeHidden();

    const firstThumb = page.getByRole("button", {
      name: /画像 1 を拡大表示/,
    });
    await firstThumb.click();
    await expect(dialog).toBeVisible();

    // 表紙 + gallery2枚 = 3枚
    await expect(dialog).toContainText("1 / 3");

    await page.getByRole("button", { name: "次の画像" }).click();
    await expect(dialog).toContainText("2 / 3");

    // キーボードでも移動できる
    await page.keyboard.press("ArrowRight");
    await expect(dialog).toContainText("3 / 3");
    await page.keyboard.press("ArrowLeft");
    await expect(dialog).toContainText("2 / 3");

    // Esc は <dialog> がネイティブに処理する
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();

    // フォーカスは「最後に見ていた画像」のサムネイルに戻る（2枚目で閉じたので画像2）。
    // 文脈を保つため、開いたサムネイルではなく直前に見ていた位置へ戻す実装にしている。
    await expect(
      page.getByRole("button", { name: /画像 2 を拡大表示/ }),
    ).toBeFocused();
  });

  test("returns focus to the opening thumbnail when closed without paging", async ({
    page,
  }) => {
    await page.goto("/works/belove-2025-04");

    const secondThumb = page.getByRole("button", { name: /画像 2 を拡大表示/ });
    await secondThumb.click();
    await expect(page.getByRole("dialog")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(secondThumb).toBeFocused();
  });

  test("closes with the close button", async ({ page }) => {
    await page.goto("/works/belove-2025-04");

    await page.getByRole("button", { name: /画像 1 を拡大表示/ }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    await page.getByRole("button", { name: "拡大表示を閉じる" }).click();
    await expect(dialog).toBeHidden();
  });

  test("actually enlarges the image and locks background scroll", async ({
    page,
  }) => {
    await page.goto("/works/belove-2025-04");

    const thumbButton = page.getByRole("button", {
      name: /画像 1 を拡大表示/,
    });
    const thumbBox = await thumbButton.locator("img").boundingBox();

    // 開く前は背景スクロールが効いている
    await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");

    await thumbButton.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    const enlarged = dialog.locator("img").first();
    await expect(enlarged).toBeVisible();
    const enlargedBox = await enlarged.boundingBox();

    // 「拡大」表示なのだから、サムネイルより明確に大きくなっていること
    expect(enlargedBox!.height).toBeGreaterThan(thumbBox!.height * 1.5);

    // showModal() だけでは背景スクロールが止まらないブラウザがあるため明示的にロックする
    await expect(page.locator("body")).toHaveCSS("overflow", "hidden");

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();

    // 閉じたらロックを必ず解除する（解除漏れはページが操作不能になる重大バグ）
    await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  });

  // 閉じる経路ごとにスクロールロックの解除を確認する。
  // 解除漏れはページが操作不能になる重大バグなので、経路を1つずつ潰しておく。
  for (const { name, close } of [
    {
      name: "Escape キー",
      close: (page: import("@playwright/test").Page) =>
        page.keyboard.press("Escape"),
    },
    {
      name: "閉じるボタン",
      close: (page: import("@playwright/test").Page) =>
        page.getByRole("button", { name: "拡大表示を閉じる" }).click(),
    },
    {
      name: "背景クリック",
      close: (page: import("@playwright/test").Page) =>
        // ::backdrop のクリックは dialog 自身がターゲットになる。
        // locator.click の position は「要素基準」でダイアログ内部を叩いてしまうため、
        // ビューポート座標で外側を突く必要がある。
        page.mouse.click(2, 2),
    },
  ]) {
    test(`releases the scroll lock when closed via ${name}`, async ({ page }) => {
      await page.goto("/works/belove-2025-04");

      await page.getByRole("button", { name: /画像 1 を拡大表示/ }).click();
      const dialog = page.getByRole("dialog");
      await expect(dialog).toBeVisible();
      await expect(page.locator("body")).toHaveCSS("overflow", "hidden");

      await close(page);

      await expect(dialog).toBeHidden();
      await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
    });
  }

  test("hides paging controls for a single-image work", async ({ page }) => {
    await page.goto("/works/chihayafuru-comic-guide");

    await page.getByRole("button", { name: /画像 1 を拡大表示/ }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByRole("button", { name: "次の画像" })).toHaveCount(0);
  });
});
