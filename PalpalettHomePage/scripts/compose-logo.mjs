/**
 * ロゴとアイコンを生成するスクリプト。開発時に手動で実行する（ビルドには関与しない）。
 *
 *   cd PalpalettHomePage && node scripts/compose-logo.mjs
 *
 * 入力（public/）
 *   palpallette_logo_without_dog.png  旧ロゴから犬だけを消したもの（1536×1024）
 *   transparent_background.png        犬アイコン（240×210）
 * 出力
 *   public/palpallette_logo.png       合成ロゴ（余白を詰めたもの）
 *   src/app/icon.png                  favicon 等に使われるアイコン（Next.js のファイル規約）
 *   src/app/apple-icon.png            iOS ホーム画面用アイコン
 *
 * 犬の縮尺と位置は、旧ロゴ（public/palpallette_Mainlogo_transparent.png）の犬との
 * 重なり（IoU）が最大になる値を総当たりで求めたもの（IoU 0.878）。
 * 新しい犬は描き直されたもので縦横比が少し違うため、完全一致はしない。
 *
 * sharp は next の依存として node_modules に入っているものを使う。
 */
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const PUBLIC = new URL("../public/", import.meta.url);
const APP = new URL("../src/app/", import.meta.url);
const path = (base, name) => fileURLToPath(new URL(name, base));

const DOG_SCALE = 1.345;
const DOG_LEFT = 88;
const DOG_TOP = 355;
/** 合成後に残す透明な余白（px） */
const LOGO_PADDING = 24;

const logoPath = path(PUBLIC, "palpallette_logo_without_dog.png");
const dogPath = path(PUBLIC, "transparent_background.png");

async function composeLogo() {
  const dogMeta = await sharp(dogPath).metadata();
  const dog = await sharp(dogPath)
    .resize(Math.round(dogMeta.width * DOG_SCALE), Math.round(dogMeta.height * DOG_SCALE), {
      kernel: "lanczos3",
    })
    .png()
    .toBuffer();

  const composed = await sharp(logoPath)
    .composite([{ input: dog, left: DOG_LEFT, top: DOG_TOP }])
    .png()
    .toBuffer();

  // 旧ロゴは上下左右に大きな透明余白があり、ヘッダー等で高さを指定すると
  // ロゴが極端に小さくなる。見た目（配置）は変えずに余白だけ詰める。
  const { data, info } = await sharp(composed).raw().toBuffer({ resolveWithObject: true });
  let x0 = info.width, y0 = info.height, x1 = -1, y1 = -1;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      if (data[(y * info.width + x) * 4 + 3] > 8) {
        if (x < x0) x0 = x;
        if (y < y0) y0 = y;
        if (x > x1) x1 = x;
        if (y > y1) y1 = y;
      }
    }
  }
  const left = Math.max(0, x0 - LOGO_PADDING);
  const top = Math.max(0, y0 - LOGO_PADDING);
  const width = Math.min(info.width, x1 + LOGO_PADDING + 1) - left;
  const height = Math.min(info.height, y1 + LOGO_PADDING + 1) - top;

  const result = await sharp(composed)
    .extract({ left, top, width, height })
    .png({ compressionLevel: 9 })
    .toFile(path(PUBLIC, "palpallette_logo.png"));
  console.log(`palpallette_logo.png: ${result.width}x${result.height}`);
}

/** 犬アイコンを正方形のキャンバス中央に収める */
async function composeIcon(size, fileName, background) {
  const dog = await sharp(dogPath).trim().toBuffer();
  const inner = Math.round(size * 0.86);
  const fitted = await sharp(dog)
    .resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  await sharp({ create: { width: size, height: size, channels: 4, background } })
    .composite([{ input: fitted, gravity: "center" }])
    .png({ compressionLevel: 9 })
    .toFile(path(APP, fileName));
  console.log(`${fileName}: ${size}x${size}`);
}

await composeLogo();
// ブラウザのタブ等に使う。背景は透明のまま
await composeIcon(192, "icon.png", { r: 0, g: 0, b: 0, alpha: 0 });
// iOS は透明部分を黒で塗るため、白背景にする
await composeIcon(180, "apple-icon.png", { r: 255, g: 255, b: 255, alpha: 1 });
