# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@PalpalettHomePage/AGENTS.md

## Project

This repo (`MakeWebsiteProject`) is a workspace root that can hold multiple product sites.
`PalpalettHomePage/` is the current product: the marketing site for PalPallet, a small editorial
design studio (magazine/book design for publishers including Kodansha). Content is Japanese.
Four routes: Home, 会社情報 (Company), 事業内容 (Business), お問い合わせ (Contact).

All commands below must be run from inside `PalpalettHomePage/`, not from the workspace root —
`package.json`, `node_modules`, and all source files live there.

## Commands

```bash
cd PalpalettHomePage

npm run dev          # start dev server (Turbopack) at localhost:3000
npm run build         # production build
npm run start          # serve the production build
npm run lint            # eslint
npx tsc --noEmit          # typecheck (no dedicated script)
npm run test:e2e            # run the full Playwright suite
npx playwright test e2e/navigation.spec.ts -g "contact form"   # run a single test/file
```

`test:e2e` builds and starts a production server automatically (see `playwright.config.ts`
`webServer`) — don't start a dev server manually first, it will conflict on port 3000.

## Architecture

- Next.js App Router, TypeScript, `PalpalettHomePage/src/` layout, path alias `@/*` →
  `PalpalettHomePage/src/*`.
- Tailwind CSS v4: no `tailwind.config`; design tokens (colors, fonts) are declared in
  `PalpalettHomePage/src/app/globals.css` via `@theme inline`. Custom tokens:
  `paper`/`ink`/`ink-soft`/`accent`/`line` colors, and `font-sans` (Noto Sans JP) / `font-serif`
  (Shippori Mincho) — use the standard Tailwind `font-sans`/`font-serif` utilities rather than
  inventing new font utility names.
- Fonts are loaded via `next/font/google` in `PalpalettHomePage/src/app/layout.tsx` with
  `preload: false`. Do not re-enable preload — these CJK font families are split into ~300+
  unicode-range chunks each, and preloading all of them bloats the page and destabilizes any
  browser automation against it (this caused Playwright `page.goto` to hang consistently;
  disabling preload fixed it). Browsers already fetch only the chunks a page actually needs via
  `unicode-range`, so `preload: false` is correct here, not just a workaround.
- Contact form (`PalpalettHomePage/src/app/contact/`) uses a React Server Action (`actions.ts`,
  `"use server"`) driven by `useActionState` in the client `ContactForm.tsx`, per current Next.js
  form guidance — not a `/api` route handler. `"use server"` files may only export async
  functions, so shared constants (e.g. the initial form state) live in the client component
  instead.
- Email sending is stubbed (`console.info` only) — wire in a real provider (e.g. Resend) in
  `PalpalettHomePage/src/app/contact/actions.ts` before launch.
- `PalpalettHomePage/src/app/company/page.tsx` and `.../contact/page.tsx` contain placeholder
  company details (address, phone, established date) marked with `◯◯` and a `TODO` comment —
  replace with real data before launch.
- `PalpalettHomePage/next.config.ts` pins `turbopack.root` explicitly (via `__dirname`) because a
  stray lockfile in the parent user directory otherwise causes Next to misdetect the workspace
  root.
- Target deployment is Vercel; no special config needed beyond the standard Next.js build.

## 禁止事項

以下はユーザーの明示的な承認なしに行ってはならない。

**システムへの変更禁止（最優先）**
- OSの設定変更は禁止。
- レジストリ編集禁止。
- システムサービスの追加・削除禁止。
- PATH変更禁止。
- Windows設定変更禁止。
- WSL設定変更禁止。
- Docker Desktop設定変更禁止。
- ファイアウォール設定変更禁止。

**勝手なインストール禁止**（ユーザーの承認なしに）
- `npm install -g`
- `winget`
- `choco`
- `brew`
- `apt`
- `pip install`
- `cargo install` など、グローバル／システムスコープへのインストール全般。

**プロジェクトフォルダ外は読み書き禁止**
- 変更は必ずプロジェクト配下のみに限定する。
- プロジェクト外のファイル・フォルダの削除禁止。
- プロジェクト外のファイル・フォルダのリネーム禁止。
- プロジェクト外のファイル・フォルダの移動禁止。
- プロジェクト外のファイル・フォルダの上書き禁止。

**Git操作禁止。コミットは必ず確認する。**
- `git push` 禁止
- `git push --force` 禁止
- `git reset --hard` 禁止
- `git clean` 禁止
- `git rebase` 禁止
- ブランチ削除禁止
- タグ削除禁止

**Secrets管理**
- `.env` を生成しない。
- APIキーをコードやログに書き込まない。
- シークレットをログ出力しない。
- 認証情報を保存しない。
- 環境変数の値を画面やログに表示しない。

**外部アクセス・外部API実行禁止**（ユーザーの承認なしに）
- メール送信禁止
- Slack投稿禁止
- Teams投稿禁止
- HTTP POST禁止
- Webhook送信禁止

**コスト発生操作の禁止**
- AWS / Azure / GCP / Vercel / Cloudflare / Supabase / Firebase へのデプロイ禁止。
- クラウドリソースの作成禁止。
- 課金対象となる操作は一切禁止。

## ディレクトリ構成

- `MakeWebsiteProject/`　プロダクト横断のリソースや設定ファイル等を配置する（このファイル、`.claude/` など）
  - `PalpalettHomePage/`　プロダクト（PalPalletサイト）ごとのリソースを配置。`README.md`あり
    - `src/app/`　App Routerのページ（`page.tsx`, `layout.tsx`, `globals.css`、`company/`・`business/`・`contact/`の各ルート）
    - `src/components/`　共通コンポーネント（`Header.tsx`, `Footer.tsx`）
    - `e2e/`　Playwrightのe2eテスト
    - `public/`　静的アセット
    - `README.md`　このプロダクトの説明・セットアップ手順
    - `package.json` / `next.config.ts` / `tsconfig.json` / `eslint.config.mjs` / `postcss.config.mjs` / `playwright.config.ts` など設定ファイル一式