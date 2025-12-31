export type MenuItemState = "locked" | "unlocked" | "grayed" | "hidden";

export const getMenuItemState = (
  _feature: string,
  _currentLevel: number,
): MenuItemState => {
  // Stub implementation: everything is unlocked for now
  // Suppress unused vars
  void _feature;
  void _currentLevel;
  return "unlocked";
};

export const getMenuUnlockTip = (_feature: string): string => {
  void _feature;
  return "";
};
