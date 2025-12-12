import { z } from "zod";

export const workSchema = z.object({
  title: z
    .string()
    .min(1, "タイトルは必須です")
    .max(100, "タイトルは100文字以内で入力してください"),
  description: z.string().max(1000, "説明文は1000文字以内で入力してください").optional(),
  itemTime: z.string().optional(), // 制作時間など
  images: z.array(z.string().url("画像のURL形式が正しくありません")).default([]),
  status: z.enum(["draft", "published"]).default("draft"),
  tags: z.array(z.string()).default([]),
});

export type WorkFormValues = z.infer<typeof workSchema>;

export interface Work {
  id: string;
  title: string;
  description?: string;
  itemTime?: string;
  images: string[];
  status: "draft" | "published";
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// ダミーデータ生成関数
export const generateDummyWork = (): Work => {
  return {
    id: crypto.randomUUID(),
    title: "サンプル作品タイトル",
    description: "これはダミーデータによる作品説明文です。UIの確認用に使用します。",
    itemTime: "2023-01-01",
    images: [
      "https://placehold.jp/300x200.png?text=Sample+Image+1",
      "https://placehold.jp/300x200.png?text=Sample+Image+2",
    ],
    status: "draft",
    tags: ["イラスト", "キャラクター", "ファンタジー"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const initialFormValues: WorkFormValues = {
  title: "",
  description: "",
  itemTime: "",
  images: [],
  status: "draft",
  tags: [],
};
