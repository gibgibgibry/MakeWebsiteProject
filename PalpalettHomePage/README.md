# PalPallet ホームページ

編集デザインスタジオ PalPallet のコーポレートサイト。Next.js (App Router) + TypeScript +
Tailwind CSS v4 で構築。

## 構成

- Home / 会社情報 / 事業内容 / お問い合わせ の4ページ
- お問い合わせフォームは Server Action（`src/app/contact/actions.ts`）で処理。現状はメール送信サービス未接続で、受付ログを出力するのみ
- 詳細な開発ガイドはリポジトリルートの `CLAUDE.md` を参照

## セットアップ

```bash
npm install
```

## 開発

```bash
npm run dev          # 開発サーバー起動 (Turbopack) http://localhost:3000
npm run build         # 本番ビルド
npm run start          # 本番ビルドの起動
npm run lint            # ESLint
npx tsc --noEmit          # 型チェック
npm run test:e2e            # Playwright e2eテスト一式
```

`test:e2e` はビルド＋起動を自動で行うため、事前に `npm run dev` を起動したままにしないこと
（ポート3000が競合する）。

## 未対応事項（公開前に対応）

- `src/app/company/page.tsx` / `src/app/contact/page.tsx` の会社概要（住所・電話番号・設立年・
  代表者名）が `◯◯` のプレースホルダーのまま
- お問い合わせフォームのメール送信サービス（Resendなど）が未接続
