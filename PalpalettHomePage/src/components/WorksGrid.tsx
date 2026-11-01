"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import WorkCard from "./WorkCard";
import type { Category, WorkSummary } from "@/lib/microcms/types";

type Props = {
  works: WorkSummary[];
  categories: Category[];
};

/**
 * カテゴリー絞り込み（`?category=`）とキーワード検索（`?q=`）。
 *
 * 状態は URL だけに持たせ、クライアント側で読む。ページの `searchParams` prop は
 * リクエスト時 API なので、使うと /works が動的レンダリングになり ISR が効かなくなる。
 * `useSearchParams` なら静的 HTML はそのままで、この部分だけがブラウザで描画される。
 *
 * サイドバーのリンク（同じ /works 上でのクエリだけの遷移）でも、絞り込みボタン
 * （history.replaceState）でも、同じ useSearchParams の値が変わるだけなので
 * どちらの経路でも表示が揃う。作品は100件未満なので全件を渡して手元で絞る。
 */
export default function WorksGrid(props: Props) {
  return (
    // プリレンダ時は useSearchParams がここで中断し fallback が HTML に入る。
    // fallback を「絞り込みなしの全件」にしておけば、JS 無しや検索エンジンにも一覧が見える。
    <Suspense fallback={<WorksGridView {...props} category={null} query="" />}>
      <WorksGridFromUrl {...props} />
    </Suspense>
  );
}

function WorksGridFromUrl(props: Props) {
  const searchParams = useSearchParams();
  return (
    <WorksGridView
      {...props}
      category={searchParams.get("category")}
      query={searchParams.get("q") ?? ""}
    />
  );
}

/** URL のクエリを書き換える。サーバーへのリクエストは発生しない（Next.js が useSearchParams に反映する）。 */
function updateQuery(name: "category" | "q", value: string | null) {
  const params = new URLSearchParams(window.location.search);
  if (value) params.set(name, value);
  else params.delete(name);
  const query = params.toString();
  window.history.replaceState(
    null,
    "",
    query ? `?${query}` : window.location.pathname,
  );
}

/** 全角・半角や大文字・小文字の違いで取りこぼさないよう正規化して比較する */
const normalize = (text: string) => text.normalize("NFKC").toLowerCase();

function matchesQuery(work: WorkSummary, query: string): boolean {
  const haystack = normalize(
    [work.title, work.client, work.category?.name, work.description]
      .filter(Boolean)
      .join(" "),
  );
  return normalize(query)
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term));
}

function WorksGridView({
  works,
  categories,
  category,
  query,
}: Props & { category: string | null; query: string }) {
  // 実際に作品が存在するカテゴリーだけをボタンに出す（空振りする選択肢を作らない）
  const usedCategoryIds = new Set(works.map((work) => work.category?.id));
  const visibleCategories = categories.filter((c) => usedCategoryIds.has(c.id));

  // 存在しないカテゴリー ID が URL に来たら「すべて」として扱う
  const selected = visibleCategories.some((c) => c.id === category)
    ? category
    : null;
  const trimmedQuery = query.trim();

  const filtered = works.filter(
    (work) =>
      (selected === null || work.category?.id === selected) &&
      (trimmedQuery === "" || matchesQuery(work, trimmedQuery)),
  );

  return (
    <>
      {visibleCategories.length > 0 && (
        <div
          role="group"
          aria-label="カテゴリーで絞り込む"
          className="mt-6 flex flex-wrap gap-2"
        >
          {[{ id: null, name: "すべて" }, ...visibleCategories].map((c) => {
            const active = selected === c.id;
            return (
              <button
                key={c.id ?? "all"}
                type="button"
                aria-pressed={active}
                onClick={() => updateQuery("category", c.id)}
                className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                  active
                    ? "border-brand-fill bg-brand-fill text-paper"
                    : "border-line-strong text-ink-soft hover:border-brand-ui hover:text-brand-ink"
                }`}
              >
                {c.name}
              </button>
            );
          })}
        </div>
      )}

      {trimmedQuery !== "" && (
        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <p role="status" className="text-ink">
            「{trimmedQuery}」の検索結果：{filtered.length}件
          </p>
          <button
            type="button"
            onClick={() => updateQuery("q", null)}
            className="text-brand-ink underline hover:no-underline"
          >
            検索をクリア
          </button>
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="mt-8 rounded-card border border-line bg-paper px-6 py-16 text-center text-sm text-ink-soft">
          該当する実績がありません。
        </p>
      ) : (
        <ul
          data-testid="works-grid"
          className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((work, i) => (
            <li key={work.id}>
              <WorkCard work={work} preload={i === 0} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
