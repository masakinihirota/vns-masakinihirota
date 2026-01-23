/**
 * ゲーミフィケーションの選択状態に基づいて、遷移先のパスを決定する。
 * @param isGamification ゲーミフィケーションが有効かどうか
 * @returns 遷移先パス
 */
export const determineRedirectPath = (isGamification: boolean): string => {
  return isGamification ? "/beginning-country" : "/home";
};

/**
 * ゲーミフィケーションのモード設定を更新する（現時点では値を返すのみ）。
 * 将来的にはここで Supabase 等の永続化層との連携を行う。
 * @param currentState 現在の状態
 * @param selectedMode 選択されたモード
 * @returns 更新後の状態
 */
export const updateGamificationMode = (
  currentState: boolean,
  selectedMode: boolean
): boolean => {
  return selectedMode;
};
