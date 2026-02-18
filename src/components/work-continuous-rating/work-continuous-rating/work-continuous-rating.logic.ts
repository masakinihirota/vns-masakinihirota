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
  | {
      status: RatingStatus;
      isLiked: boolean;
      tier: "Tier1" | "Tier2" | "Tier3";
      otherValue: RatingValue | null; // For "普通" etc.
    }
  // Legacy string support for backward compatibility during migration
  | RatingValue
  | null;

export const normalizeRating = (
  rating: Rating
): {
  status: RatingStatus;
  isLiked: boolean;
  tier: "Tier1" | "Tier2" | "Tier3";
  otherValue: RatingValue | null;
} => {
  if (!rating) {
    return { status: "Now", isLiked: false, tier: "Tier1", otherValue: null };
  }

  // Legacy string handling
  if (typeof rating === "string") {
    if (["Tier1", "Tier2", "Tier3"].includes(rating)) {
      return {
        status: "Now",
        isLiked: true,
        tier: rating as "Tier1" | "Tier2" | "Tier3",
        otherValue: null,
      };
    }
    return {
      status: "Now",
      isLiked: false,
      tier: "Tier1", // Default preference
      otherValue: rating,
    };
  }

  // Object handling (Already migrated or new)
  // Ensure all fields exist even if partial (though Type says full)
  if ("isLiked" in rating) {
    return rating;
  }

  // Fallback for old object style { status: "Now", value: "Tier1" }
  const oldObj = rating as { status: RatingStatus; value: RatingValue };
  if (["Tier1", "Tier2", "Tier3"].includes(oldObj.value)) {
    return {
      status: oldObj.status,
      isLiked: true,
      tier: oldObj.value as "Tier1" | "Tier2" | "Tier3",
      otherValue: null,
    };
  }
  return {
    status: oldObj.status,
    isLiked: false,
    tier: "Tier1",
    otherValue: oldObj.value,
  };
};

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
      const r = normalizeRating(i.rating);
      const ratingStr = r.isLiked
        ? `${r.status}:${r.tier}`
        : `${r.status}:${r.otherValue || "未評価"}`;
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
