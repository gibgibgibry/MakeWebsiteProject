# Palpallette ホームページ

有限会社パルパレット（Palpallette）のコーポレートサイト。
Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 で構築。

雑誌・コミックス・書籍の装丁からポスター・パンフレット・チラシ・ロゴまで手がける
デザイン事務所のサイトで、作品（実績）は microCMS から配信する。

## 構成

- Home / 実績 / 事業内容 / 会社情報 / お問い合わせ
- **問い合わせフォームは無い。** 連絡先は静的テキストとして公開する
- 実績は microCMS から取得し、Webhook によるオンデマンド ISR で反映する

詳細な開発ガイドはリポジトリルートの `CLAUDE.md` を参照。

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

- 公開用メールアドレスが未確定（`src/app/contact/page.tsx` の `EMAIL` が `null`）
- ロゴ画像が未配置
- 独自ドメインが未確定
- microCMS のサービスが未作成
