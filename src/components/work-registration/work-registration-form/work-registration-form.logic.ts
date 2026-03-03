import { z } from "zod";

/**
 * 作品の長さ（読了・視聴目安）の選択肢
 */
export const WORK_LENGTH_OPTIONS = [
  "半日",
  "1日",
  "3日",
  "1週間",
  "1ヶ月以上",
] as const;

export type WorkLength = (typeof WORK_LENGTH_OPTIONS)[number];

/**
 * 発表年代の選択肢
 */
const currentYear = new Date().getFullYear();
export const RELEASE_YEAR_OPTIONS = [
  "発売未定",
  ...Array.from({ length: 2030 - 1971 + 1 }, (_, i) => (2030 - i).toString()),
  "1970以前",
] as const;

export type ReleaseYear = (typeof RELEASE_YEAR_OPTIONS)[number];

/**
 * 作品カテゴリ
 */
export const WORK_CATEGORY = {
  ANIME: "anime",
  MANGA: "manga",
} as const;

export type WorkCategory = (typeof WORK_CATEGORY)[keyof typeof WORK_CATEGORY];

/**
 * フォームデータのバリデーションスキーマ
 */
export const workRegistrationSchema = z.object({
  title: z.string().min(1, "タイトルを入力してください"),
  creator: z.string().min(1, "作者またはスタジオ名を入力してください"),
  releaseYear: z.enum(RELEASE_YEAR_OPTIONS as unknown as [string, ...string[]]),
  officialUrl: z.string().url("有効なURLを入力してください").or(z.literal("")),
  affiliateUrl: z.string().url("有効なURLを入力してください").or(z.literal("")),
  length: z.enum(WORK_LENGTH_OPTIONS),
  isPurchasable: z.boolean(),
  tags: z.string(),
  synopsis: z.string(),
});

export type WorkFormData = z.infer<typeof workRegistrationSchema>;

/**
 * AI提案データの型
 */
export type AiDraftData = Partial<WorkFormData>;

/**
 * 差分チェックロジック
 */
export const getDiffKeys = (
  current: WorkFormData,
  draft: AiDraftData
): (keyof WorkFormData)[] => {
  return (Object.keys(draft) as (keyof WorkFormData)[]).filter((key) => {
    if (key === "synopsis") return false; // あらすじは差分表示対象外（仕様書準拠）
    return String(current[key]) !== String(draft[key]);
  });
};

/**
 * AIモックデータの取得 (シミュレーション用)
 */
export const getAiMockResult = (category: WorkCategory): AiDraftData => {
  return {
    creator: category === WORK_CATEGORY.ANIME ? "MAPPA" : "芥見下々",
    releaseYear: "2024",
    officialUrl: "https://example.com/official",
    length: "1週間",
    isPurchasable: true,
    tags: "アクション, ファンタジー, 少年",
    synopsis:
      "AIによって生成されたあらすじです。この作品は、かつての伝説を巡る壮大な物語を描いています。PC専用の広い画面で詳細を確認してください。",
  };
};
