import { SectionId, UserProfile } from "./user-profile-app.types";

/**
 * Tierのローテーションロジックを取得する
 * @param current 現在のTier
 * @returns 次のTier (1 -> 2 -> 3 -> undefined -> 1)
 */
export const getNextTier = (current?: number): 1 | 2 | 3 | undefined => {
  if (current === 1) return 2;
  if (current === 2) return 3;
  if (current === 3) return undefined;
  return 1;
};

/**
 * SectionId から UserProfile 内の key を取得する
 * @param sectionId
 * @returns
 */
export const getKeysBySectionId = (
  sectionId: SectionId
): keyof UserProfile["equippedSlots"] => {
  if (sectionId === "work_future") return "worksFuture";
  if (sectionId === "work_current") return "worksCurrent";
  if (sectionId === "work_life") return "worksLife";
  if (sectionId === "value") return "values";
  if (sectionId === "skill") return "skills";
  return "worksCurrent";
};
