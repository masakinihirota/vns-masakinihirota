import { CellStatus, Profile } from "../types";

/**
 * 自分と相手の習得状況からセルのステータスを判定するロジック
 * 仕様書のロジック（自分=1, 相手=2 の合計値）に基づく
 * @param itemIndex アイテムのインデックス (0-7)
 * @param skillId スキルテンプレートID
 * @param me 自分のプロファイル
 * @param target 相手のプロファイル
 * @returns セルのステータス（SYNC, ADVICE, LEARN, NONE）
 */
export const getCellStatus = (
  itemIndex: number,
  skillId: string,
  me?: Profile,
  target?: Profile
): CellStatus => {
  const myMastery = me?.mastery[skillId]?.includes(itemIndex) ?? false;
  const theirMastery = target?.mastery[skillId]?.includes(itemIndex) ?? false;

  const statusValue = (myMastery ? 1 : 0) + (theirMastery ? 2 : 0);

  switch (statusValue) {
    case 3: {
      return "SYNC";
    }
    case 1: {
      return "ADVICE";
    }
    case 2: {
      return "LEARN";
    }
    default: {
      return "NONE";
    }
  }
};

/**
 * 指定したスキルの全習得数を取得する
 * @param profile
 * @param skillId
 */
export const getMasteryCount = (profile: Profile, skillId: string): number => {
  return profile.mastery[skillId]?.length ?? 0;
};
