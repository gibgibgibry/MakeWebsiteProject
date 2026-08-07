import type { NextConfig } from "next";
import path from "path";

/**
 * e2e ビルドかどうか。next.config.ts はビルド時に評価されるため、
 * テスト用ビルドにだけローカルモックの画像ホストを許可し、本番ビルドには入れない。
 */
const isE2E = process.env.MICROCMS_BASE_URL?.startsWith("http://127.0.0.1") ?? false;

const nextConfig: NextConfig = {
  // 親ディレクトリに紛れ込んだ lockfile のせいで Next がワークスペースルートを
  // 誤検出するため明示的に固定する。消さないこと。
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.microcms-assets.io",
        pathname: "/assets/**",
        // NOTE: `search` は意図的に指定しない。microCMS の画像URLは ?w= や ?fm= などの
        //       クエリ文字列を伴うため、search: "" を書くと全ての画像が拒否される。
      },
      ...(isE2E
        ? ([
            {
              protocol: "http" as const,
              hostname: "127.0.0.1",
              port: "4010",
              pathname: "/assets/**",
            },
          ])
        : []),
    ],
    // next/image はローカルIPへの最適化を既定で禁止している（v16）。
    // モックから画像を配信する e2e ビルドでのみ解禁する。
    ...(isE2E ? { dangerouslyAllowLocalIP: true } : {}),
  },
};

export default nextConfig;
