type Props = {
  /** 見出し上の英字ラベル（WORKS / BUSINESS など） */
  eyebrow: string;
  title: string;
  /** 実績詳細のように、ページの h1 が別にある場合は "p" にする */
  titleAs?: "h1" | "p";
};

/**
 * 各ページ冒頭のピンクの帯見出し。
 * 帯（brand-fill）の上のラベルは半透明の白だとコントラストが足りないため、
 * 濃いピンク（brand-ink）の地に白文字にしている。
 */
export default function PageBand({ eyebrow, title, titleAs: Title = "h1" }: Props) {
  return (
    <div className="bg-brand-fill">
      <div className="mx-auto max-w-6xl px-6 py-6 md:px-10">
        <span className="inline-block rounded-full bg-brand-ink px-4 py-1.5 text-xs tracking-[0.25em] text-paper">
          {eyebrow}
        </span>
        <Title className="mt-3 font-display text-3xl text-paper md:text-5xl">
          {title}
        </Title>
      </div>
    </div>
  );
}
