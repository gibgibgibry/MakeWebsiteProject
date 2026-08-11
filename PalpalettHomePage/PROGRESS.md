# PROGRESS: デザインPOC追加要望対応

対象: `PalpalettHomePage/design-poc/*.html`（Next.js本体には影響しない）

## 要望

1. メインカラー（マゼンタ）を、"DESIGN OFFICE" ラベルで使われている色に変更
2. 透過処理済みロゴ（`palpallette_Mainlogo_transparent.png`）をHomeのメインビジュアルとして配置
3. 変更前のデザインをバックアップとして残す

## 事前調査（完了）

- [x] `public/` を確認 — ユーザーが旧ロゴ（不透明版）を `public/old/` へ移動済み、
      新しい透過ロゴ2点が `public/` 直下に配置されていることを確認。
      **現状、design-poc内の画像パスは旧ファイルを指しており壊れている**ため、
      今回の対応と合わせて修正が必要。
- [x] `palpallette_Mainlogo_transparent.png` の透過を検証（92.3%のピクセルが
      alpha=0の完全透明。プレビューに見えるグレーはビューアーの背景表示であり、
      画像データ自体は正しく透過されている）。1536×1024px。
- [x] "DESIGN OFFICE" ラベルの実効色を実測: `rgba(255,255,255,0.15)` を
      現行の帯色 `#c2187f` に重ねた実効色は **`#cb3b92`**。
      白文字とのコントラストは **4.59:1**（AA基準4.5:1をぎりぎり満たす）。

## ステップ

- [x] 1. `design-poc-backup/`（変更前スナップショット）を作成した。
       完了内容: `design-poc-backup/{index,works,business,company,contact}.html`
       （変更前の5ファイルのコピー）と `design-poc-backup/README.md` を作成。
       変更ファイル: `design-poc-backup/*`（新規6ファイル）
       冪等性: 既存なら中身を現状の5ファイルで上書きする実装（再実行しても同じ結果）。
- [x] 2. 全5ファイルの画像参照を新しい透過ロゴに更新した
       （`palpallette_Mainlogo.png` → `palpallette_Mainlogo_transparent.png`、
       `palpalletteNameOnlylogo.jpeg` → `palpalletteNameOnlylogo_transparent.png`）。
       変更ファイル: `design-poc/{index,works,business,company,contact}.html`
       （sedによる文字列置換、5ファイルとも2箇所ずつ＝計10箇所）
- [x] 3. 全5ファイルの `tailwind.config` 内 `'brand-ink'` の値を
       `#c2187f` → `#cb3b92` に変更した。
       変更ファイル: 同上（各ファイル1箇所）
- [x] 4. Homeページ（index.html）のヒーローを再構成した。
       変更内容: 帯の中を2カラム化（左: 既存のコピー、右: 透過ロゴを大きく配置）。
       白カードでの囲いは不要になった（透過のため帯に直接乗る）。
       変更ファイル: `design-poc/index.html`
- [x] 5. 検証完了。
       - `npm run lint` / `npx tsc --noEmit`: 影響なし（両方エラーなし）
       - 全5ページで `getComputedStyle` により背景色(`#ffecff`)・帯色(`#cb3b92`)を実測確認
       - 全5ページで画像読み込み成功（`complete:true`、404なし、consoleエラーなし）
       - 横スクロール: 390px幅・1385px幅の両方で全ページ `overflow: 0` を確認
       - スクリーンショットでロゴの視認性を確認（黒い線画がピンク帯上で明瞭に読める）
- [ ] 6. git commit する。

## 次の具体的なアクション

ステップ6（git commit）から着手する。
