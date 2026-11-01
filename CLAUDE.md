# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@PalpalettHomePage/AGENTS.md

## Project

This repo (`MakeWebsiteProject`) is a workspace root that can hold multiple product sites.
`PalpalettHomePage/` is the current product: the marketing site for **Palpallette**
(有限会社パルパレット), a small design studio founded in 1998, led by 白井秀子. It designs magazine
covers, comics/book jackets, posters, pamphlets, flyers and logos — largely for Kodansha titles
(BE・LOVE, 別冊フレンド, なかよし, ちはやふる, カードキャプターさくら, etc.). The brand voice is
「かわいいデザインや柔らかいデザイン全般、お任せください！」. Content is Japanese.

The legacy site being replaced is https://palpallette.sakura.ne.jp/info/ (WordPress).
**The name is "Palpallette", never "PalPallet".**

Routes: Home, 実績 (Works, CMS-backed), 事業内容 (Business), 会社情報 (Company),
お問い合わせ (Contact).

All commands below must be run from inside `PalpalettHomePage/`, not from the workspace root —
`package.json`, `node_modules`, and all source files live there.

## Commands

```bash
cd PalpalettHomePage

npm run dev          # start dev server (Turbopack) at localhost:3000
npm run build         # production build
npm run start          # serve the production build
npm run lint            # eslint
npx next typegen && npx tsc --noEmit   # typecheck (typegen creates route types; CI does the same)
PLAYWRIGHT_BROWSERS_PATH=0 npm run test:e2e   # run the full Playwright suite
PLAYWRIGHT_BROWSERS_PATH=0 npx playwright test e2e/navigation.spec.ts -g "contact page"   # single test/file
node scripts/compose-logo.mjs   # regenerate the logo and icons from the source images
```

`test:e2e` builds and starts a production server automatically (see `playwright.config.ts`
`webServer`) — don't start a dev server manually first, it will conflict on port 3000.

## Architecture

- Next.js App Router, TypeScript, `PalpalettHomePage/src/` layout, path alias `@/*` →
  `PalpalettHomePage/src/*`.
- Tailwind CSS v4: no `tailwind.config`; design tokens are declared in
  `PalpalettHomePage/src/app/globals.css` via `@theme inline`.
- **The brand pink is split by role and the roles are not interchangeable.** The page background
  is `paper-tint` `#ffecff`, not white, which lowers every text contrast — ratios below are
  "on white / on paper-tint". Measured values are recorded in `globals.css`; re-measure if you
  change any value.
  - `brand` `#ff80ff` (2.15 / —) — decorative fills only. **Never text, never icons.**
  - `brand-ui` `#e0439f` (3.84 / 3.42) — focus rings, borders, type ≥24px
  - `brand-fill` `#cb3b92` (4.59 / 4.08) — **fills only**: bands, buttons, heading underlines.
    White text on it is 4.59:1. Never use it for small text on the page background (fails AA).
  - `brand-ink` `#c2187f` (5.63 / 5.01) — body-size text, links, small badges with white text
  - also `line` `#ece3e9` is decorative-only (1.26:1); use `line-strong` `#8a7a86` (4.03 / 3.59)
    for a border that is the sole indicator of a control.
  - On a `brand-fill` band, focus rings switch to white (see `globals.css`), and translucent
    white (`text-white/85`, `bg-white/15`) is too low-contrast — use solid `text-paper`, and
    `bg-brand-ink` for a badge.
  - `brand-wash` chips disappear on `paper-tint`; a chip that sits on the page background uses
    `bg-paper`.
- Layout: every page is `PageBand` (pink heading band) + `SidebarLayout` (content + `Sidebar`
  with recent works / categories / search). `Sidebar` is an async server component that reads
  microCMS, so **every page — including the otherwise static Business/Company/Contact — fetches
  the CMS at build time** and is invalidated by the `works` tag.
- The logo `public/palpallette_logo.png` and `src/app/icon.png` / `apple-icon.png` are generated
  by `scripts/compose-logo.mjs` from `palpallette_logo_without_dog.png` (text) +
  `transparent_background.png` (dog). Re-run it only when the source images change and commit
  the output; it is not part of the build.
- Don't wrap Japanese copy across source lines in JSX: JSX turns the line break into a
  half-width space (「です。 かわいい」). Keep each sentence on one line.
- Fonts: `font-sans` = Noto Sans JP (body), `font-display` = Zen Maru Gothic (headings).
  The rounded gothic is deliberate — it carries the 「柔らかい」 brand. Mincho was removed.
- Fonts are loaded via `next/font/google` in `PalpalettHomePage/src/app/layout.tsx` with
  `preload: false`. Do not re-enable preload — these CJK font families are split into ~300+
  unicode-range chunks each, and preloading all of them bloats the page and destabilizes any
  browser automation against it (this caused Playwright `page.goto` to hang consistently;
  disabling preload fixed it). Browsers already fetch only the chunks a page actually needs via
  `unicode-range`, so `preload: false` is correct here, not just a workaround.
- **There is no contact form.** It was deliberately removed — `/contact` publishes phone, address
  and (once decided) an email address as static text. Do not reintroduce a form, a Server Action,
  or an email provider without being asked. The project currently has no `"use server"` file.
- The public email address is still undecided; `src/app/contact/page.tsx` holds `EMAIL = null`
  behind a `TODO`, and the email block renders only once it is set.
- Real company data (use these, not placeholders): 有限会社パルパレット / 設立 1998年 /
  代表 白井秀子 / 〒178-0063 東京都練馬区東大泉7-32-6 / Tel Fax 03-4296-4965 /
  西武池袋線 大泉学園駅 徒歩11分.
- `PalpalettHomePage/next.config.ts` pins `turbopack.root` explicitly (via `__dirname`) because a
  stray lockfile in the parent user directory otherwise causes Next to misdetect the workspace
  root. **Do not remove it when editing `images`.**

### microCMS / ISR — the parts that are easy to break

- Data layer is `src/lib/microcms/`, using plain `fetch` (not `microcms-js-sdk`) so that
  `next: { tags }` is passed natively rather than through an undocumented SDK path.
- **`microcmsFetch` must throw on any non-404 failure.** Returning `[]` on a transient CMS 5xx
  would overwrite a good cached page with an empty one and serve that until the next
  revalidation. Throwing makes Next keep serving the last good render. Only
  `getWorkSlugs` (used by `generateStaticParams`) swallows errors, so a CMS outage can't
  block an unrelated deploy.
- **`dynamicParams` must stay `true`** in `works/[slug]`. `generateStaticParams` is not re-run
  during ISR, so newly published works only render via on-demand generation.
- **`revalidateTag` takes two arguments in v16** — `revalidateTag(tag, { expire: 0 })`.
  Use `{ expire: 0 }`, not `'max'`: stale-while-revalidate would serve a deleted work once more.
- microCMS `limit` defaults to 10 and caps at 100 — always pass it explicitly.
- A referenced category that is still a draft comes back as `null`; `Work["category"]` is
  nullable for that reason. Never pass `depth=0`.
- Images: `images.remotePatterns` must **omit `search`** — microCMS URLs carry query strings and
  `search: ""` would reject every one. Don't set `quality` (v16 allows only `[75]` by default).
  Use the `preload` prop, not the deprecated `priority`.
- `/works` keeps filter/search state in the URL (`?category=`, `?q=`, linked from the sidebar)
  but reads it **client-side** with `useSearchParams` inside `<Suspense>` (`WorksGrid`). Never
  read the page's `searchParams` prop — it makes the route dynamic and kills ISR. The Suspense
  fallback renders the unfiltered list so the static HTML still contains every work; buttons
  update the URL with `window.history.replaceState` (no server round trip).
- Home and the sidebar order works by `publishedOn` (falling back to `year`) via
  `getRecentWorks`; the list page uses `compareWorks` (`order` → `year` → title). There is no
  `featured` field — it was removed from the schema.
- The webhook at `src/app/api/revalidate/route.ts` must never gain a side effect beyond cache
  invalidation — microCMS signatures have no timestamp, so replay is possible.

### Testing

- e2e runs against a local mock (`e2e/mock-microcms.mjs`) via the `MICROCMS_BASE_URL` seam.
  Playwright's `page.route` cannot intercept these calls because they happen server-side.
- Test env vars are injected through `webServer.env`, which is what keeps us from needing a
  `.env` file.
- Projects run in order `setup` → `chromium` → `revalidate`. The revalidate spec mutates shared
  mock state, so it is isolated; `setup` resets state because `reuseExistingServer` can carry
  data over between runs.
- ISR assertions only hold against `build && start`, never `next dev`.
- Playwright browsers live inside the project: install and run with `PLAYWRIGHT_BROWSERS_PATH=0`
  (`node_modules/playwright-core/.local-browsers`), never the user-level cache outside the
  project. Ask before downloading, and check for vulnerability reports on the bundled browser
  build first.

- Target deployment is Vercel with **Root Directory set to `PalpalettHomePage`**.
  Required env vars are documented in `PalpalettHomePage/README.md`.

## 禁止事項

共通の禁止事項は [`../../CLAUDE.md`](../../CLAUDE.md) を参照(全プロジェクト共通、自動的に適用される)。

## ディレクトリ構成

- `MakeWebsiteProject/`　プロダクト横断のリソースや設定ファイル等を配置する（このファイル、`.claude/` など）
  - `PalpalettHomePage/`　プロダクト（Palpalletteサイト）ごとのリソースを配置。`README.md`あり
    - `src/app/`　App Routerのページ（`page.tsx`, `layout.tsx`, `globals.css`、`works/`・`company/`・`business/`・`contact/`の各ルート、`api/revalidate/`、`icon.png`・`apple-icon.png`・`opengraph-image.tsx`）
    - `src/components/`　共通コンポーネント（`Header.tsx`, `Footer.tsx`, `PageBand.tsx`, `SidebarLayout.tsx`, `Sidebar.tsx`, `CtaBand.tsx`, `WorksGrid.tsx`, `WorkCard.tsx`, `WorkFeedItem.tsx`, `WorkGallery.tsx`）
    - `src/lib/`　microCMSのデータ層（`microcms/`）、ナビゲーション・事業内容などの定数、日付の整形
    - `scripts/`　開発用スクリプト（`compose-logo.mjs`：ロゴ・アイコンの生成。ビルドでは実行しない）
    - `design-poc/`　デザインのPOC（静的HTML。本番には含まれない）
    - `e2e/`　Playwrightのe2eテスト
    - `public/`　静的アセット（ロゴ画像とその素材）
    - `README.md`　このプロダクトの説明・セットアップ手順
    - `package.json` / `next.config.ts` / `tsconfig.json` / `eslint.config.mjs` / `postcss.config.mjs` / `playwright.config.ts` など設定ファイル一式