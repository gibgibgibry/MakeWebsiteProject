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

## 環境変数

`PalpalettHomePage/.env.local`（`src/` の中ではなくプロジェクト直下）に作成する。
**このファイルはリポジトリに含めない。**`.gitignore` の `.env*` により
`.env.example` も無視されるため、正はこの表とする。

| 変数 | 必須 | 用途 |
|---|---|---|
| `MICROCMS_SERVICE_DOMAIN` | ✅ | microCMS のサービスドメイン（`https://<これ>.microcms.io`） |
| `MICROCMS_API_KEY` | ✅ | microCMS の APIキー。**取得(GET)のみ**の権限で発行する |
| `MICROCMS_WEBHOOK_SECRET` | ✅ | Webhook の署名検証用シークレット |
| `NEXT_PUBLIC_SITE_URL` | ✅(公開時) | 公開オリジン（例 `https://example.com`）。OGP と sitemap の絶対URLに使う |
| `MICROCMS_BASE_URL` | – | APIのベースURLを上書きする。e2e のモック用。本番では `*.microcms.io` 以外を拒否する |

`MICROCMS_API_KEY` に `NEXT_PUBLIC_` を付けないこと。付けるとクライアントバンドルに
埋め込まれて公開される。

`NEXT_PUBLIC_SITE_URL` は**ビルド時にバンドルへ埋め込まれる**ため、
ドメインを変えたら再ビルドが必要（Webhookの再検証では変わらない）。

一時的に環境変数を指定してビルドする場合:

```powershell
# PowerShell
$env:NEXT_PUBLIC_SITE_URL='https://example.com'; npm run build
```

```bash
# bash
NEXT_PUBLIC_SITE_URL='https://example.com' npm run build
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
