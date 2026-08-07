/** キャッシュタグとスラッグ検証。
 *  Webhook からもページからも参照するので、"use server"/"server-only" は付けない
 *  （ここには秘密情報も通信も無い）。 */

export const WORKS_TAG = "works";
export const CATEGORIES_TAG = "categories";

/** 個別作品用のタグ。作品1件の更新で一覧まで作り直さずに済む。 */
export const workTag = (slug: string): string => `work:${slug}`;

/**
 * URLスラッグ（= microCMS の contentId）として許容する形。
 *
 * dynamicParams: true にしている都合上、/works/<任意の文字列> へのアクセスは
 * すべてレンダリングとCMSへの問い合わせを発生させる。ここで先に弾くことで、
 * ゴミリクエストが上流のAPIを叩き続けるのを防ぐ。
 */
const SLUG_PATTERN = /^[a-z0-9][a-z0-9_-]{0,63}$/;

export const isValidSlug = (slug: string): boolean => SLUG_PATTERN.test(slug);
