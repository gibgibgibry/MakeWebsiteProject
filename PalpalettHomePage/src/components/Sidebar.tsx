import Form from "next/form";
import Link from "next/link";
import { isMicroCmsConfigured } from "@/lib/microcms/env";
import { getCategories, getRecentWorks, getWorks } from "@/lib/microcms/works";

type Props = {
  /** ホームは本文自体が最近の実績のフィードなので、重複する一覧を出さない */
  showRecent?: boolean;
};

const headingClass =
  "border-b-2 border-brand-fill pb-2 font-display text-sm tracking-wide text-ink";

/**
 * 旧サイトの構成に合わせたサイドバー（最近の実績 / カテゴリー / 検索）。
 *
 * カテゴリーと検索は `/works?category=` `/works?q=` へのリンク。
 * 読み取りは実績一覧のクライアント側（useSearchParams）で行うので、
 * どのページも静的配信（ISR）のまま保てる。
 *
 * getWorks はページ本体と同じ fetch になり、同一レンダー内でメモ化されるため
 * サイドバーを足しても microCMS への通信は増えない。
 */
export default async function Sidebar({ showRecent = true }: Props) {
  const configured = isMicroCmsConfigured();
  const [recent, works, categories] = configured
    ? await Promise.all([getRecentWorks(5), getWorks(), getCategories()])
    : [[], [], []];

  // 作品が1件も無いカテゴリーは出さない（空振りするリンクを作らない）
  const usedCategoryIds = new Set(works.map((work) => work.category?.id));
  const visibleCategories = categories.filter((category) =>
    usedCategoryIds.has(category.id),
  );

  return (
    <aside
      aria-label="サイドバー"
      className="w-full shrink-0 space-y-10 md:w-72"
    >
      {showRecent && recent.length > 0 && (
        <section>
          <h2 className={headingClass}>最近の実績</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {recent.map((work) => (
              <li key={work.id}>
                <Link
                  href={`/works/${work.id}`}
                  className="text-ink-soft hover:text-brand-ink"
                >
                  {work.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {visibleCategories.length > 0 && (
        <section>
          <h2 className={headingClass}>カテゴリー</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {visibleCategories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/works?category=${encodeURIComponent(category.id)}`}
                  className="text-ink-soft hover:text-brand-ink"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className={headingClass}>検索</h2>
        {/* GET で /works?q= へ遷移するだけ。Server Action ではない。
            JS が無くても通常のフォーム送信として動く。 */}
        <Form action="/works" role="search" className="mt-4 flex">
          <label htmlFor="sidebar-search" className="sr-only">
            実績を検索
          </label>
          <input
            id="sidebar-search"
            type="search"
            name="q"
            placeholder="キーワード"
            className="w-full min-w-0 rounded-l-full border border-line-strong bg-paper px-4 py-2 text-sm text-ink placeholder:text-ink-soft"
          />
          <button
            type="submit"
            className="shrink-0 rounded-r-full bg-brand-fill px-4 text-sm text-paper transition-opacity hover:opacity-90"
          >
            検索
          </button>
        </Form>
      </section>
    </aside>
  );
}
