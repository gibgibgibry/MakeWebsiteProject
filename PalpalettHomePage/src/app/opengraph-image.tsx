import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Palpallette — デザイン事務所";

/** scripts/compose-logo.mjs が生成する合成ロゴ（1249×528）。
 *  リクエストに依存しないので、モジュールの読み込み時に1回だけ読む。 */
const LOGO = { width: 1249, height: 528 };
const logoSrc = `data:image/png;base64,${await readFile(
  join(process.cwd(), "public/palpallette_logo.png"),
  "base64",
)}`;
const LOGO_WIDTH = 860;

/**
 * SNS共有用の画像。
 *
 * ImageResponse は既定フォントに和文を持たないため、和文フォントを埋め込まない限り
 * 日本語は豆腐になる。社名はロゴ画像で見せ、文字は欧文のみにして
 * フォント埋め込み（数MBのwoffを読み込む）を避けている。
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffecff",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse は next/image を描画できない */}
        <img
          src={logoSrc}
          alt=""
          width={LOGO_WIDTH}
          height={Math.round((LOGO_WIDTH * LOGO.height) / LOGO.width)}
        />

        <div
          style={{
            marginTop: 28,
            fontSize: 30,
            color: "#625660",
            display: "flex",
          }}
        >
          Magazines · Comics · Books · Posters · Logos — since 1998
        </div>
      </div>
    ),
    size,
  );
}
