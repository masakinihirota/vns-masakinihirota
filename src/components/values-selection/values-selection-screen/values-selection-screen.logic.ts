export interface Choice {
  label: string;
  user?: string;
}

export interface ValueSelectionMessage {
  text: string;
  type: "success" | "error";
}

export const INITIAL_CHOICES: Choice[] = [
  { label: "選択肢1" },
  { label: "選択肢2" },
  { label: "選択肢3" },
  { label: "選択肢4 (追加)", user: "登録ユーザー名" },
  { label: "選択肢5 (追加)", user: "登録ユーザー名" },
];

// 関連ID生成ロジック（純粋関数として分離）
export const generateRelatedIds = (baseId: string, count: number): string[] => {
  return Array.from({ length: count }).map((_, i) => `${baseId}-${i}`);
};
