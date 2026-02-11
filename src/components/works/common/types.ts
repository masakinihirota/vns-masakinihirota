export interface Work {
  id: string;
  title: string;
  category: "anime" | "comic" | "novel" | "movie" | "game" | "other";
  period: string;
  tags: string[];
  urls: { type: string; value: string }[];
  creatorName?: string; // 作成者名（任意）
  imageUrl?: string; // サムネイル画像URL（任意）
  author?: string | null; // 著者名（DB由来、任意）
  is_official?: boolean; // 公式作品フラグ（任意）
  status?: string; // ステータス（任意）
}
