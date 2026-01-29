import { z } from "zod";

// Status Definition
export type RatingStatus = "Now" | "Future" | "Life";

// Value Definition (Tier)
export type RatingValue =
  | "Tier1"
  | "Tier2"
  | "Tier3"
  | "普通 or 自分に合わない"
  | "興味無し"
  | "後で見る"; // Legacy compatibility

// Combined Rating Type
export type Rating =
  | { status: RatingStatus; value: RatingValue }
  // Legacy string support for backward compatibility during migration
  | RatingValue
  | null;

/**
 * 作品と評価のペア
 */
export interface ItemRating {
  title: string;
  rating: Rating;
}

/**
 * アニメデータのロード
 */
export const loadAnimeData = async (): Promise<string[]> => {
  const res = await fetch("/anime_titles.json");
  if (!res.ok) {
    throw new Error("Failed to load anime data");
  }
  const data = await res.json();
  const schema = z.array(z.string());
  return schema.parse(data);
};

/**
 * 漫画データのロード
 */
export const loadMangaData = async (): Promise<string[]> => {
  const res = await fetch("/manga.md");
  if (!res.ok) {
    throw new Error("Failed to load manga data");
  }
  const text = await res.text();
  // マークダウンからリスト項目を抽出（" - "を含む行を対象とする簡易パース）
  const lines = text.split("\n").filter((l) => l.includes(" - "));
  // タイトル部分のみ抽出
  const titles = lines.map((l) => l.split(" - ", 1)[0].trim());
  // 重複排除
  return Array.from(new Set(titles));
};

/**
 * ローカルストレージから評価を取得
 */
export const getRatingsFromStorage = (
  category: "anime" | "manga",
  patternId: string = "default"
): Record<string, Rating> => {
  if (typeof window === "undefined") return {};
  const key = `ratings_${category}_${patternId}`;
  const saved = localStorage.getItem(key);
  try {
    return saved ? JSON.parse(saved) : {};
  } catch (e) {
    console.error("Failed to parse ratings from storage", e);
    return {};
  }
};

/**
 * ローカルストレージに評価を保存
 */
export const saveRatingsToStorage = (
  category: "anime" | "manga",
  ratings: Record<string, Rating>,
  patternId: string = "default"
) => {
  if (typeof window === "undefined") return;
  const key = `ratings_${category}_${patternId}`;
  localStorage.setItem(key, JSON.stringify(ratings));
};

/**
 * 評価データのエクスポート
 */
export const exportRatings = (
  category: "anime" | "manga",
  ratings: Record<string, Rating>
) => {
  const rated: ItemRating[] = [];
  Object.keys(ratings).forEach((title) => {
    const r = ratings[title];
    if (r) rated.push({ title, rating: r });
  });

  // フォーマット: [評価][タイトル]
  const output = rated
    .map((i) => {
      // 事前にフィルタリングしているが型定義上nullが含まれるためチェック
      if (!i.rating) return "";
      const ratingStr =
        typeof i.rating === "object"
          ? `${i.rating.status}:${i.rating.value}`
          : i.rating;
      return `[${ratingStr}][${i.title}]`;
    })
    .filter((s) => s !== "")
    .join("\n");
  const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${category}_ratings_${new Date().toISOString().split("T")[0]}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
