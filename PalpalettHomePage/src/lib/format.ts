/**
 * microCMS の日付フィールドは UTC の ISO 文字列で返る。管理画面で「2025-03-19」を選ぶと
 * 日本時間の0時 = "2025-03-18T15:00:00.000Z" になるため、UTC のまま日付を取ると1日ずれる。
 * サーバー（Vercel は UTC）の時刻設定に依存しないよう、必ず日本時間で整形する。
 */
const DATE_FORMAT = new Intl.DateTimeFormat("ja-JP", {
  timeZone: "Asia/Tokyo",
  year: "numeric",
  month: "long",
  day: "numeric",
});

/** "2025-03-18T15:00:00.000Z" → "2025年3月19日"。不正な値なら null。 */
export function formatDate(iso: string | undefined): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return DATE_FORMAT.format(date);
}
