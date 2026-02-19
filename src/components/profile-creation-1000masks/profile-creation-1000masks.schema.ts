import { z } from "zod";

/**
 * プロフィール作成用の Zod スキーマ
 */
export const profileSchema = z.object({
  name: z.string().min(1, "名前を入力してください"),
  constellationName: z.string().min(1, "星座名を選択してください"),
  selectedTypeId: z
    .string()
    .nullable()
    .refine((val) => val !== null, {
      message: "プロフィールのタイプを選択してください",
    }),
  selectedObjectiveIds: z
    .array(z.string())
    .min(1, "プロフィールの目的を1つ以上選択してください"),
  selectedSlots: z.array(z.string()),
  selectedValues: z.array(z.string()).min(1, "価値観を1つ以上選択してください"),
});

/**
 * プロフィールのバリデーションを実行する
 * @param profile プロフィールデータ
 * @returns バリデーション結果
 */
export const validateProfile = (profile: any) => {
  return profileSchema.safeParse(profile);
};

export type ProfileFormValues = z.infer<typeof profileSchema>;
