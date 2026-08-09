# デザインPOC（静的HTML）

Next.js本体（`src/`）とは完全に独立した、レイアウト・配色検討用の静的プロトタイプ。
ビルド不要。**各HTMLファイルをブラウザで直接開けば見られる。**

```
design-poc/
  index.html      Home
  works.html      実績（カテゴリー絞り込み・画像拡大のデモ動作つき）
  business.html   事業内容
  company.html    会社情報
  contact.html    お問い合わせ
```

## 今回反映した要望

1. **背景を薄いピンクに。** ブランドピンク `#ff80ff` を白と15%で混色した
   `#ffecff` をページ全体の背景に使用（`--color-brand-wash-15`）。
   ヘッダー・フッターのみ白背景を維持（ロゴ画像が不透明な白背景で
   作られているため、直接ピンク地に置くと白い矩形が浮いて見えるのを回避）。
2. **見出しを濃いピンクの帯でハイライト。** 各ページのH1、「社名の由来」
   「会社概要」などのセクション見出し、CLIENT/CTA帯を `#c2187f`
   （既存の `brand-ink` トークン）の帯＋白抜き文字に。
   白文字 on `brand-ink` は **5.63:1**（実測済み・AA適合）。
3. **ロゴ画像を反映。** `public/palpallette_Mainlogo.png`（マスコット＋ワードマーク）を
   ヘッダーとHomeヒーローに、`public/palpalletteNameOnlylogo.jpeg`（文字のみ）を
   フッターに使用。

## 見づらい場合の調整ポイント

- 帯の白抜き文字が見づらい場合 → 各HTMLの `@theme` 内 `--color-brand-ink` の値を
  1箇所変更すれば全体に反映される。
- ピンク背景が強すぎる場合 → `body` の `bg-brand-wash-15` を `bg-paper` や
  `bg-brand-wash`（既存のより薄いトークン）に変更。
- 帯の頻度を減らしたい場合 → 各ページのH1帯のみ残し、セクション見出し
  （社名の由来・会社概要など）は白カードの上部帯をやめて通常の見出しに戻す。

## 技術メモ

- Tailwind CDN（`cdn.tailwindcss.com`）を使用。`src/app/globals.css` の
  `@theme` と同じトークン名・値を各HTMLの `<style type="text/tailwindcss">` に
  埋め込んでいるため、`bg-brand-ink` 等のクラス名は本番と同じ。
  方向性確定後にNext.jsコンポーネントへ移植する際、クラス名の書き換えは
  ほぼ不要な想定。
- `.html`/`.css` のみで構成し `.ts`/`.tsx`/`.js` ファイルを作っていないため、
  `npm run lint` / `npx tsc --noEmit` の対象外（確認済み）。
- モバイルメニュー・実績ページのカテゴリー絞り込み・画像拡大表示は、
  見た目確認用の簡易JS（各HTML内にインライン）で動作する。

## ステータス

- [x] 5ページ作成、ロゴ反映、背景・見出し帯の要望反映
- [ ] ステークホルダーフィードバック待ち
- [ ] Next.js本体への反映（別タスク）
