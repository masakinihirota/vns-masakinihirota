/**
 * DBアダプター切替メカニズム
 * 環境変数 DB_ADAPTER で "supabase" と "drizzle" を切り替える
 */

/** サポートするアダプター種別 */
export type DbAdapterType = "supabase" | "drizzle";

/** 現在のアダプター取得 */
export function getAdapter(): DbAdapterType {
  const adapter = process.env.DB_ADAPTER ?? "supabase";
  if (adapter !== "supabase" && adapter !== "drizzle") {
    console.warn(`不明なDB_ADAPTER: "${adapter}"、"supabase"にフォールバック`);
    return "supabase";
  }
  return adapter;
}

/** Drizzleアダプターが有効か判定 */
export function isDrizzle(): boolean {
  return getAdapter() === "drizzle";
}
