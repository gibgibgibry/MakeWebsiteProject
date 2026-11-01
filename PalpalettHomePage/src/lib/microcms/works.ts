import "server-only";
import { microcmsFetch } from "./client";
import { isMicroCmsConfigured } from "./env";
import { CATEGORIES_TAG, WORKS_TAG, workTag } from "./tags";
import type {
  Category,
  MicroCmsListResponse,
  Work,
  WorkSummary,
} from "./types";

/** microCMS の limit は既定 10 / 上限 100。
 *  指定を忘れると作品が黙って10件で打ち切られるので、必ず明示する。 */
const MAX_LIMIT = 100;

const WORK_SUMMARY_FIELDS = [
  "id",
  "title",
  "client",
  "category",
  "coverImage",
  "year",
  "order",
  "publishedOn",
  "description",
  "updatedAt",
].join(",");

/**
 * 表示順を TypeScript 側で確定させる。
 * microCMS 側の orders だけに頼ると、未設定の数値フィールドの扱いが不定で
 * 並びが揺れ、e2e のアサーションが不安定になる。
 */
function compareWorks(a: WorkSummary, b: WorkSummary): number {
  const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
  const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
  if (orderA !== orderB) return orderA - orderB;

  const yearA = a.year ?? 0;
  const yearB = b.year ?? 0;
  if (yearA !== yearB) return yearB - yearA; // 新しい年が先

  return a.title.localeCompare(b.title, "ja");
}

export async function getWorks(): Promise<WorkSummary[]> {
  const data = await microcmsFetch<MicroCmsListResponse<WorkSummary>>(
    "/works",
    {
      tags: [WORKS_TAG],
      query: { limit: MAX_LIMIT, fields: WORK_SUMMARY_FIELDS },
    },
  );

  const contents = data?.contents ?? [];

  if (data && data.totalCount > contents.length) {
    // 100件を超えたらページングが要る。黙って切り捨てると実績が消えるので気づけるようにする。
    console.warn(
      `[microcms] works totalCount=${data.totalCount} exceeds fetched ${contents.length}. ` +
        "Pagination is required.",
    );
  }

  return [...contents].sort(compareWorks);
}

/**
 * 「最近の実績」の並び。公開日（publishedOn）の新しい順。
 * publishedOn が無い作品は制作年で比べる（ISO 文字列と年の文字列は辞書順でそのまま比較できる）。
 * 同じ場合は compareWorks に委ねて並びを確定させる。
 */
function compareRecent(a: WorkSummary, b: WorkSummary): number {
  const keyA = a.publishedOn ?? (a.year ? String(a.year) : "");
  const keyB = b.publishedOn ?? (b.year ? String(b.year) : "");
  if (keyA !== keyB) return keyA < keyB ? 1 : -1;
  return compareWorks(a, b);
}

export async function getRecentWorks(limit = 5): Promise<WorkSummary[]> {
  const works = await getWorks();
  return [...works].sort(compareRecent).slice(0, limit);
}

/** generateStaticParams 用。ビルドを止めないため、ここだけは失敗を握りつぶす。 */
export async function getWorkSlugs(): Promise<string[]> {
  if (!isMicroCmsConfigured()) return [];

  try {
    const data = await microcmsFetch<MicroCmsListResponse<{ id: string }>>(
      "/works",
      { tags: [WORKS_TAG], query: { limit: MAX_LIMIT, fields: "id" } },
    );
    return (data?.contents ?? []).map((content) => content.id);
  } catch (error) {
    // CMS障害中に無関係な修正すらデプロイできなくなるのを避ける。
    // 空を返すと全ページが dynamicParams によるオンデマンド生成に倒れるだけで、
    // 表示自体は壊れない。
    console.warn(
      "[microcms] failed to list work slugs at build time; " +
        "falling back to on-demand rendering.",
      error instanceof Error ? error.message : error,
    );
    return [];
  }
}

export async function getWork(slug: string): Promise<Work | null> {
  return microcmsFetch<Work>(`/works/${slug}`, {
    tags: [WORKS_TAG, workTag(slug)],
    allowNotFound: true,
  });
}

export async function getCategories(): Promise<Category[]> {
  const data = await microcmsFetch<MicroCmsListResponse<Category>>(
    "/categories",
    { tags: [CATEGORIES_TAG], query: { limit: MAX_LIMIT } },
  );

  return [...(data?.contents ?? [])].sort(
    (a, b) =>
      (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER),
  );
}
