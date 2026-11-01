import Image from "next/image";
import Link from "next/link";
import type { WorkSummary } from "@/lib/microcms/types";

type Props = {
  work: WorkSummary;
  /** 先頭カードだけ true。LCP 画像を先に読ませる。
   *  v16 で priority は非推奨になったので preload を使う。 */
  preload?: boolean;
};

export default function WorkCard({ work, preload = false }: Props) {
  return (
    <Link
      href={`/works/${work.id}`}
      className="group block focus-visible:outline-none"
    >
      <div className="overflow-hidden rounded-card border border-line bg-paper transition-colors group-hover:border-brand-ui">
        <Image
          src={work.coverImage.url}
          alt={work.title}
          width={work.coverImage.width}
          height={work.coverImage.height}
          // サイドバーの横に並ぶので、lg 以上でもカード幅は 240px 程度に収まる
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 240px"
          preload={preload}
          className="h-auto w-full transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>

      <div className="mt-3">
        {work.category && (
          // ページ背景（paper-tint）上では brand-wash のチップが背景に溶けるため白地にする
          <span className="inline-block rounded-full bg-paper px-3 py-1 text-xs text-brand-ink">
            {work.category.name}
          </span>
        )}
        <h3 className="mt-2 font-display text-sm leading-snug text-ink group-hover:text-brand-ink">
          {work.title}
        </h3>
        <p className="mt-1 text-xs text-ink-soft">
          {[work.client, work.year ? `${work.year}年` : null]
            .filter(Boolean)
            .join(" / ")}
        </p>
      </div>
    </Link>
  );
}
