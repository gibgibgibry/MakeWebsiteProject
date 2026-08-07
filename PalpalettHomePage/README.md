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

e2e は microCMS の**モックサーバー**（`e2e/mock-microcms.mjs`）に対して実行するため、
APIキーが無くても動く。テスト用の環境変数は `playwright.config.ts` の
`webServer.env` から子プロセスへ注入している。

## microCMS のセットアップ

サービスを作成し、以下2つのAPIを「リスト形式」で定義する。

### `categories` API

| フィールドID | 表示名 | 種類 | 必須 |
|---|---|---|---|
| `name` | 表示名 | テキストフィールド | ✅ |
| `order` | 表示順 | 数値 | – |

コンテンツIDは `magazine` / `comics` / `poster` / `logo` のように**半角英小文字**で手入力する。

### `works` API

| フィールドID | 表示名 | 種類 | 必須 |
|---|---|---|---|
| `title` | 作品名 | テキストフィールド | ✅ |
| `client` | クライアント・掲載媒体 | テキストフィールド | – |
| `category` | カテゴリー | コンテンツ参照（`categories`・単一） | ✅ |
| `coverImage` | メインビジュアル | 画像 | ✅ |
| `gallery` | 追加画像 | 繰り返しフィールド（カスタム `workImage`: 画像 + `caption`テキスト） | – |
| `year` | 制作年 | 数値 | – |
| `publishedOn` | 発行日 | 日時 | – |
| `role` | 担当 | 複数選択（装丁 / 本文デザイン / ロゴ / イラスト / DTP） | – |
| `description` | 説明 | **テキストエリア**（リッチエディタは使わない） | – |
| `order` | 表示順 | 数値 | – |
| `featured` | トップページに掲載 | 真偽値 | – |

**重要な運用ルール**

- **コンテンツIDがそのままURLになる。** 入稿時に「コンテンツIDを指定する」に
  チェックを入れ、`belove-2025-04` のような半角英小文字・数字・ハイフンで手入力する。
  忘れるとランダムな文字列がURLになり、後から変更できない
- `description` は**リッチエディタにしない**。HTMLが返るとサニタイズ処理が必要になり、
  編集者アカウントの乗っ取りがそのままXSSになる
- カテゴリーを「下書き」のまま作品から参照すると、APIは `null` を返す。
  カテゴリーは先に公開しておく
- 作品が100件を超えたらページング実装が必要（現在は100件で打ち切り、
  超過時はサーバーログに警告が出る）

### APIキー

**GET のみ**を許可したキーを発行する。書き込み権限は不要。

### Webhook

`works` と `categories` の両方に、以下のWebhookを設定する。

- URL: `https://<公開ドメイン>/api/revalidate`
- シークレット: `MICROCMS_WEBHOOK_SECRET` と同じ値
- 署名ヘッダ: `X-MICROCMS-Signature`（HMAC-SHA256）

設定後、作品を1件更新して数秒でサイトに反映されることを確認する。

## 公開手順（GitHub → Vercel）

1. GitHub にリポジトリを作成し push する
   （リポジトリのルートはワークスペースルート `MakeWebsiteProject/`）
2. Vercel で当該リポジトリを Import し、**Root Directory に `PalpalettHomePage` を指定**する
3. Vercel の環境変数に上表の値を登録する（`NEXT_PUBLIC_SITE_URL` は独自ドメイン）
4. デプロイ後、独自ドメインを割り当てる
5. `NEXT_PUBLIC_SITE_URL` はビルド時に埋め込まれるため、**ドメイン確定後に再デプロイする**
6. microCMS の Webhook を本番URLに向ける

## 未対応事項（公開前に対応）

- 公開用メールアドレスが未確定（`src/app/contact/page.tsx` の `EMAIL` が `null`）
- ロゴ画像が未配置（`public/` に配置後、ヘッダー・フッターの文字ワードマークと
  `opengraph-image.tsx`、favicon を差し替える）
- 独自ドメインが未確定（`NEXT_PUBLIC_SITE_URL`）
- microCMS のサービスが未作成
- 旧サイトからの作品移行（画像は旧サーバーから再アップロードが必要）
- `src/lib/site.ts` の `TODO`: ドメイン確定後、`NEXT_PUBLIC_SITE_URL` 未設定の
  本番ビルドを警告ではなくエラーにする
