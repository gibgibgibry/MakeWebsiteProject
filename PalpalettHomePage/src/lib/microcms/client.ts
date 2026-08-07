import "server-only";
import { getMicroCmsEnv } from "./env";

/** ページ側の `export const revalidate` と同じ値にしておく。
 *  Next.js はルート全体で最小の revalidate を採用するため、片方だけ短いと
 *  ルート全体が引きずられて短くなる。 */
export const DEFAULT_REVALIDATE_SECONDS = 3600;

export type MicroCmsQuery = Record<string, string | number | undefined>;

type FetchOptions = {
  tags: string[];
  query?: MicroCmsQuery;
  /** 404 を「未検出」として null で返すか。false なら 404 も例外にする。 */
  allowNotFound?: boolean;
  revalidate?: number;
};

function buildUrl(baseUrl: string, path: string, query?: MicroCmsQuery): string {
  const url = new URL(`${baseUrl}${path}`);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }
  return url.toString();
}

/**
 * microCMS への GET。
 *
 * **404 以外の失敗では必ず throw する。空配列や null にフォールバックしてはいけない。**
 * Next.js は再検証中に例外が投げられた場合、最後に成功したレンダリング結果を
 * 配信し続ける。逆にここで空データを返してしまうと、CMSの一時的な 5xx で
 * 「正常なページが空のページに上書きされ、その状態が次の再検証まで配信され続ける」
 * という最悪の壊れ方をする。
 *
 * エラーメッセージにはステータスとパスだけを載せる。APIキー・レスポンス本文・
 * クエリ（将来 draftKey が乗りうる）は絶対に含めない。
 */
export async function microcmsFetch<T>(
  path: string,
  { tags, query, allowNotFound = false, revalidate }: FetchOptions,
): Promise<T | null> {
  const { baseUrl, apiKey } = getMicroCmsEnv();

  const response = await fetch(buildUrl(baseUrl, path, query), {
    headers: { "X-MICROCMS-API-KEY": apiKey },
    next: {
      tags,
      revalidate: revalidate ?? DEFAULT_REVALIDATE_SECONDS,
    },
  });

  if (response.status === 404 && allowNotFound) return null;

  if (!response.ok) {
    throw new Error(`microCMS request failed: ${response.status} ${path}`);
  }

  return (await response.json()) as T;
}
