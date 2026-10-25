# PROGRESS: 本番依存の脆弱性対応（next 16.4.3 への更新ほか）

対象: `PalpalettHomePage/package.json` / `package-lock.json`（アプリのコードは原則変更しない）

## 前タスクの未完了事項（このタスクとは別に扱う）

- 脆弱性チェック自動化（`.github/dependabot.yml`、`.github/workflows/ci.yml`、
  `.github/workflows/security-audit.yml`）は作成・ローカル検証済み。
  ユーザー承認を得て、このタスクと同時に別コミットとしてコミット済み（手順6参照）。

## 要望

`npm audit --omit=dev` の結果（5件: critical 1 / high 4）を解消する。

| パッケージ | 現状 | 対応 |
|---|---|---|
| next（critical） | 16.2.12 | 16.4.3 へ更新（`eslint-config-next` も 16.4.3 に揃える） |
| postcss（high） | next 内部の 8.4.31 | next 16.4.3 が 8.5.23 を使うため、next の更新で解消 |
| sharp（high） | 0.34.5 | next 16.4.3 が ^0.35.5 を使うため、next の更新で解消 |
| nanoid（high） | 3.3.16 | `npm audit fix`（`--force` なし） |
| source-map-js（high） | 1.2.1 | `npm audit fix`（`--force` なし） |

`react` / `react-dom`（19.2.4）は next 16.4.3 の peer 要件 `^19.0.0` を満たすため更新不要。

## 事前調査（完了）

- [x] next 16系の最新は 16.4.3、`eslint-config-next@16.4.3` も存在することを確認。
- [x] 作業開始時点の未コミット変更: `CLAUDE.md`（ユーザー編集）、`.github/`（前タスク）、
      `PROGRESS.md`。**このタスクのコミットには `package.json` / `package-lock.json` /
      `PROGRESS.md`（と、必要が生じたコード修正）のみを含める。**

## ステップ

- [x] 1. `npm install next@16.4.3 eslint-config-next@16.4.3 --save-exact` 完了。
       結果: next 16.4.3、eslint-config-next 16.4.3、sharp 0.35.5（修正版）、
       next内部のpostcss 8.5.23（修正版）。critical は解消。
       変更ファイル: `package.json`（next / eslint-config-next の2行）、`package-lock.json`
       メモ: `sharp` 0.35 は `require("sharp/package.json")` を禁止しているため、
       バージョン確認は `fs` で package.json を直接読む必要がある。
- [x] 2. `npm audit fix`（`--force` なし）完了。**全体（開発用含む）で 0 件**になった。
       結果: nanoid 3.3.20、source-map-js 1.2.2。開発用の残り3件も
       brace-expansion / fastq / js-yaml / zod のパッチ・マイナー更新で解消。
       lockfile差分: バージョン変更46件・追加4件（optional/devのみ）・削除0件。メジャー更新なし。
       変更ファイル: `package-lock.json`（`package.json` は手順1の2行以外変化なし）
- [x] 3. 同梱ドキュメントで 16.3 / 16.4 の変更点を確認した（全ドキュメントのバージョン履歴を抽出）。
       結果: ほぼ新機能の追加のみ。このサイトが使う機能（next/image・ISR・revalidateTag・
       generateStaticParams・next/font・opengraph-image）に関わる変更なし。
       注意点:
       - `enablePrerenderSourceMaps` のデフォルトが `true` に（ビルド時のエラー表示のみ、影響なし）
       - `agentRules`（16.3〜）: `next dev` 実行時に `PalpalettHomePage/AGENTS.md` の管理ブロックを
         Next.jsが自動更新する。次回 `npm run dev` 時に差分が出るが、Next.js自身による更新なので
         コミットしてよい。e2e は `build && start` のため発生しない。
       変更ファイル: なし
- [x] 4. 検証完了: `npm run lint` 通過、`npx next typegen && npx tsc --noEmit` 通過、
       `CI=true npm run test:e2e` **34件全通過**（画像最適化・OGP画像・ISR再検証・
       dynamicParamsによるオンデマンド生成など、今回の脆弱性に関わる機能のテストを含む）。
       変更ファイル: なし
- [x] 5. 監査結果: `npm audit --omit=dev` **0件**、`npm audit`（全体）**0件**。
       `security-audit.yml` と同じ判定（`--omit=dev --audit-level=high`）も終了コード0。
       変更ファイル: なし
- [x] 6. git commit（ユーザー承認済み）。2つのコミットに分けた:
       1. `fix(deps)`: `package.json`、`package-lock.json`、`PROGRESS.md`
       2. `ci`: `.github/dependabot.yml`、`.github/workflows/ci.yml`、`.github/workflows/security-audit.yml`
       `CLAUDE.md`（ユーザー編集中）は含めていない。ハッシュは `git log` で確認できる。

## 次の具体的なアクション

このタスクは完了。残作業はユーザー側:
- push と Vercel での再デプロイ（公開中のサイトに修正を反映するため）
- GitHub の Settings → Code security で Dependabot alerts / security updates をON
- Actions タブで「Security audit」を手動実行して動作確認
