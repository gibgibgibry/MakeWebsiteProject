import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import {
  CATEGORIES_TAG,
  WORKS_TAG,
  isValidSlug,
  workTag,
} from "@/lib/microcms/tags";

/** node:crypto と ISR の再検証には Node ランタイムが要る。 */
export const runtime = "nodejs";
/** 受け口自体は絶対にキャッシュさせない。 */
export const dynamic = "force-dynamic";

const SIGNATURE_HEADER = "x-microcms-signature";

/**
 * このエンドポイントには**キャッシュ無効化以外の副作用を絶対に足さないこと。**
 *
 * microCMS の署名にはタイムスタンプが含まれず、リプレイ攻撃を防げない。
 * 影響範囲が「キャッシュが破棄されるだけ」に限定されている限り実害は無いが、
 * ここにメール送信やDB更新などを足した瞬間、リプレイが実害に変わる。
 */
function isValidSignature(rawBody: string, signature: string | null, secret: string): boolean {
  if (!signature) return false;

  const expected = createHmac("sha256", secret).update(rawBody, "utf8").digest("hex");

  // timingSafeEqual は長さが違うと例外を投げる。
  // 先に長さを見ないと、細工されたヘッダで 401 ではなく 500 を返してしまう。
  const received = signature.trim().toLowerCase();
  if (received.length !== expected.length) return false;

  return timingSafeEqual(Buffer.from(received, "utf8"), Buffer.from(expected, "utf8"));
}

type WebhookPayload = {
  api?: unknown;
  id?: unknown;
  contents?: {
    old?: { id?: unknown } | null;
    new?: { id?: unknown } | null;
  } | null;
};

/** ペイロードの形は通知設定によって変わる。検証済みの構造とみなさず、
 *  取れなければ「全体を無効化する」側に倒す。 */
function safeParse(rawBody: string): WebhookPayload | null {
  try {
    const parsed: unknown = JSON.parse(rawBody);
    return typeof parsed === "object" && parsed !== null
      ? (parsed as WebhookPayload)
      : null;
  } catch {
    return null;
  }
}

const asString = (value: unknown): string | null =>
  typeof value === "string" && value.length > 0 ? value : null;

export async function POST(request: NextRequest): Promise<Response> {
  const secret = process.env.MICROCMS_WEBHOOK_SECRET?.trim();
  if (!secret) {
    return Response.json({ message: "Not configured" }, { status: 500 });
  }

  // 署名検証には「パース前の生ボディ」が要る。
  // JSON.parse したものを再シリアライズするとキー順や空白が変わり、必ず不一致になる。
  const rawBody = await request.text();

  if (!isValidSignature(rawBody, request.headers.get(SIGNATURE_HEADER), secret)) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  // ここから先で例外を外に出さないこと。
  // 500 を返すと microCMS がリトライし続け、恒久的に壊れたペイロードで無限に叩かれる。
  try {
    const payload = safeParse(rawBody);
    const api = asString(payload?.api);
    const id =
      asString(payload?.id) ??
      asString(payload?.contents?.new?.id) ??
      asString(payload?.contents?.old?.id);

    /* expire: 0 を使う理由（'max' ではなく）:
       'max' は stale-while-revalidate になるため、microCMS で削除した作品が
       次の1人にはまだ配信されてしまう。出版社から掲載取り下げを依頼されうる以上、
       1回でも配信するのは誤り。expire: 0 なら次のリクエストで即座に作り直される。 */
    const expireNow = { expire: 0 } as const;

    if (api === null || api === "categories") {
      revalidateTag(CATEGORIES_TAG, expireNow);
      // カテゴリー名は全作品カードに埋まっているので作品側も作り直す
      revalidateTag(WORKS_TAG, expireNow);
    }

    if (api === null || api === "works") {
      revalidateTag(WORKS_TAG, expireNow);
      if (id && isValidSlug(id)) {
        revalidateTag(workTag(id), expireNow);
      } else {
        // IDが取れないときだけ全詳細ページを落とす。
        // 動的セグメントを含むパスは第2引数が必須。
        revalidatePath("/works/[slug]", "page");
      }
    }

    revalidatePath("/");
    revalidatePath("/sitemap.xml");

    return Response.json({
      revalidated: true,
      api: api ?? "(unknown)",
      id: id ?? null,
      now: Date.now(),
    });
  } catch (error) {
    console.error(
      "[revalidate] webhook handling failed",
      error instanceof Error ? error.message : error,
    );
    return Response.json({ revalidated: false, degraded: true }, { status: 200 });
  }
}
