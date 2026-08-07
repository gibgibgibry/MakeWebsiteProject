import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "実績",
  description:
    "Palpalletteが手がけた雑誌の表紙、コミックス・書籍の装丁、ポスターやロゴなどの実績をご紹介します。",
};

// TODO(Sprint 5): microCMS から作品を取得する一覧に差し替える。
//   このスタブはナビゲーションが404にならないようにするための仮置き。
export default function WorksPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
      <p className="text-sm tracking-[0.3em] text-brand-ink">WORKS</p>
      <h1 className="mt-4 font-display text-3xl text-ink md:text-5xl">実績</h1>
      <p className="mt-6 max-w-xl text-sm leading-loose text-ink-soft">
        雑誌の表紙、コミックス・書籍の装丁、ポスターやロゴなど、
        これまでに手がけた仕事をご紹介します。
      </p>

      <p className="mt-16 rounded-card border border-line bg-paper-soft px-6 py-16 text-center text-sm text-ink-soft">
        実績は準備中です。
      </p>
    </div>
  );
}
