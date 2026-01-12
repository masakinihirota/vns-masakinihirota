import { z } from "zod";

// 定数定義
export const SCALES = [
  { value: "half_day", label: "半日 (2時間〜映画など)" },
  { value: "one_day", label: "1日 (1〜数冊)" },
  { value: "one_week", label: "一週間 (数冊〜十数冊)" },
  { value: "one_month", label: "一ヶ月以内 (十数冊〜)" },
  { value: "long_term", label: "一ヶ月以上 (十数冊〜百冊以上)" },
] as const;

export const CATEGORIES = [
  { value: "manga", label: "マンガ" },
  { value: "anime", label: "アニメ" },
] as const;

export const STATUS_OPTIONS = [
  { value: "expecting", label: "期待している (未来)" },
  { value: "reading", label: "読んでいる (今)" },
  { value: "interesting", label: "面白かった (人生)" },
] as const;

// スキーマ定義

// 作品情報スキーマ
export const workSchema = z.object({
  id: z.string().optional(), // 新規作成時はundefined
  title: z
    .string()
    .min(1, "タイトルは必須です")
    .max(100, "タイトルは100文字以内で入力してください"),
  author: z
    .string()
    .min(1, "作者名は必須です")
    .max(100, "作者名は100文字以内で入力してください"),
  publisher: z.string().optional(),
  summary: z
    .string()
    .max(1000, "あらすじは1000文字以内で入力してください")
    .optional(),
  coverImageUrl: z
    .string()
    .url("有効なURLを入力してください")
    .optional()
    .or(z.literal("")),
  officialUrl: z
    .string()
    .url("有効なURLを入力してください")
    .optional()
    .or(z.literal("")),
  category: z.enum(["manga", "anime"]),
  scale: z
    .enum(["half_day", "one_day", "one_week", "one_month", "long_term"])
    .optional(),
  isNew: z.boolean().default(false),
  isAiGenerated: z.boolean().default(false),
});

// ユーザーエントリー（評価・メモ）スキーマ
export const userEntrySchema = z.object({
  id: z.number().optional(),
  status: z.string().min(1, "ステータスを選択してください"),
  tier: z.number().min(1).max(3).optional(),
  memo: z.string().max(5000, "メモは5000文字以内で入力してください").optional(),
  workTitle: z.string().optional(), // 表示用
});

// フォーム全体のスキーマ（Work + UserEntry）
// 実際のフォーム入力ではこれらを組み合わせて使う
export const registrationFormSchema = z.object({
  work: workSchema,
  entry: userEntrySchema,
});

// 型推論のエクスポート
export type Work = z.infer<typeof workSchema>;
export type UserEntry = z.infer<typeof userEntrySchema>;
export type RegistrationFormValues = z.infer<typeof registrationFormSchema>;
