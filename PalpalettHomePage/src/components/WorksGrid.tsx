"use client";

import { useMemo, useState } from "react";
import WorkCard from "./WorkCard";
import type { Category, WorkSummary } from "@/lib/microcms/types";

type Props = {
  works: WorkSummary[];
  categories: Category[];
};

const ALL = "__all__";

/**
 * カテゴリー絞り込みはクライアント側で行う。
 * `?category=` のような searchParams はリクエスト時APIなので、使うと
 * /works が動的レンダリングになり ISR が効かなくなる。作品数は100件未満なので
 * 全件を渡して手元で絞るほうが速く、静的配信も維持できる。
 */
export default function WorksGrid({ works, categories }: Props) {
  const [selected, setSelected] = useState<string>(ALL);

  // 実際に作品が存在するカテゴリーだけをタブに出す（空振りする選択肢を作らない）
  const usedCategoryIds = useMemo(
    () => new Set(works.map((work) => work.category?.id).filter(Boolean)),
    [works],
  );
  const visibleCategories = categories.filter((category) =>
    usedCategoryIds.has(category.id),
  );

  const filtered = useMemo(
    () =>
      selected === ALL
        ? works
        : works.filter((work) => work.category?.id === selected),
    [works, selected],
  );

  return (
    <>
      {visibleCategories.length > 0 && (
        <div
          role="group"
          aria-label="カテゴリーで絞り込む"
          className="mt-10 flex flex-wrap gap-2"
        >
          {[{ id: ALL, name: "すべて" }, ...visibleCategories].map((category) => {
            const active = selected === category.id;
            return (
              <button
                key={category.id}
                type="button"
                aria-pressed={active}
                onClick={() => setSelected(category.id)}
                className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                  active
                    ? "border-brand-ink bg-brand-ink text-paper"
                    : "border-line-strong text-ink-soft hover:border-brand-ui hover:text-brand-ink"
                }`}
              >
                {category.name}
              </button>
            );
          })}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="mt-16 rounded-card border border-line bg-paper-soft px-6 py-16 text-center text-sm text-ink-soft">
          該当する実績がありません。
        </p>
      ) : (
        <ul
          data-testid="works-grid"
          className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4"
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
