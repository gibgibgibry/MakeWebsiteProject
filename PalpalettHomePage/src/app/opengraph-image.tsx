import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Palpallette — デザイン事務所";

/**
 * SNS共有用の画像。
 *
 * ImageResponse は既定フォントに和文を持たないため、和文フォントを埋め込まない限り
 * 日本語は豆腐になる。ここでは欧文のみで構成して、フォント埋め込み（数MBのwoffを
 * fetchする）を避けている。
 * TODO: ロゴの原データを受領したら、ワードマークを画像に差し替える。
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
          justifyContent: "center",
          padding: "0 96px",
          background: "#ffffff",
          backgroundImage:
            "radial-gradient(circle at 88% 18%, #ffeafd 0%, #ffffff 55%)",
        }}
      >
        <div
          style={{
            fontSize: 28,
            letterSpacing: 12,
            color: "#c2187f",
            display: "flex",
          }}
        >
          DESIGN OFFICE
        </div>

        <div
          style={{
            marginTop: 24,
            fontSize: 128,
            fontWeight: 700,
            color: "#1c1418",
            display: "flex",
          }}
        >
          Pal<span style={{ color: "#c2187f" }}>pallette</span>
        </div>

        <div
          style={{
            marginTop: 32,
            fontSize: 30,
            color: "#625660",
            display: "flex",
          }}
        >
          Magazines · Comics · Books · Posters · Logos — since 1998
        </div>

        <div
          style={{
            marginTop: 56,
            width: 160,
            height: 8,
            borderRadius: 999,
            background: "#ff80ff",
            display: "flex",
          }}
        />
      </div>
    ),
    size,
  );
}
