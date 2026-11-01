import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/format";
import type { WorkSummary } from "@/lib/microcms/types";

type Props = {
  work: WorkSummary;
};

/**
 * ホームの実績フィードの1行（旧サイトのブログ一覧形式: サムネイル + カテゴリー + タイトル + 日付 + 抜粋）。
 *
 * サムネイルとタイトルの両方を詳細ページへのリンクにするが、サムネイル側は
 * フォーカス順と読み上げから外し、同じリンクが2回並ばないようにしている。
 */
export default function WorkFeedItem({ work }: Props) {
  const href = `/works/${work.id}`;
  const date =
    formatDate(work.publishedOn) ?? (work.year ? `${work.year}年` : null);
  const meta = [date, work.client].filter(Boolean).join(" ／ ");
  // 和文なので改行は空白にせず詰める（空白にすると「しました。 春らしい」のように隙間が出る）
  const excerpt = work.description
    ?.replace(/\s*\n\s*/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return (
    <li className="flex gap-5 py-6">
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden="true"
        className="relative aspect-[3/4] w-24 shrink-0 overflow-hidden rounded-lg border border-line bg-paper sm:w-32"
      >
        {/* 表紙・ポスター・ロゴで縦横比がまちまちなので、切り抜かずに枠へ収める */}
        <Image
          src={work.coverImage.url}
          alt=""
          fill
          sizes="128px"
          className="object-contain"
        />
      </Link>

      <div className="min-w-0">
        {work.category && (
          // ページ背景（paper-tint）と brand-wash はほぼ同色でチップが見えなくなるため白地にする
          <span className="inline-block rounded-full bg-paper px-3 py-0.5 text-xs text-brand-ink">
            {work.category.name}
          </span>
        )}
        <h3 className="mt-2 font-display text-base leading-snug text-ink">
          <Link href={href} className="hover:text-brand-ink">
            {work.title}
          </Link>
        </h3>
        {meta && <p className="mt-1 text-xs text-ink-soft">{meta}</p>}
        {excerpt && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-soft">
            {excerpt}
          </p>
        )}
      </div>
    </li>
  );
}
