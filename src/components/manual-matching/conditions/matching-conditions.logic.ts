// Types for Settings
export const VALUE_OPTIONS = [
  { id: "v1", label: "仕事より家庭優先" },
  { id: "v2", label: "一人の時間も大切" },
  { id: "v3", label: "隠し事はしない" },
  { id: "v4", label: "金銭感覚は堅実" },
  { id: "v5", label: "週末はアクティブに" },
];

export const GENRE_OPTIONS = [
  { id: "g1", label: "漫画・アニメ" },
  { id: "g2", label: "映画・ドラマ" },
  { id: "g3", label: "ゲーム" },
  { id: "g4", label: "読書" },
];

export interface MatchingSettings {
  valueImportance: Record<string, number>;
  selectedGenres: string[];
  minAge: number;
  maxAge: number;
  locationPreference: string;
}

export const DEFAULT_SETTINGS: MatchingSettings = {
  valueImportance: VALUE_OPTIONS.reduce(
    (acc, opt) => ({ ...acc, [opt.id]: 50 }),
    {}
  ),
  selectedGenres: [],
  minAge: 20,
  maxAge: 40,
  locationPreference: "all",
};

// Simulation Logic
export const saveSettings = async (
  _settings: MatchingSettings
): Promise<boolean> => {
  return new Promise((resolve) => setTimeout(() => resolve(true), 500));
};

export const startAutoMatching = async (
  _settings: MatchingSettings
): Promise<string> => {
  return new Promise((resolve) =>
    setTimeout(() => resolve("session-123"), 800)
  );
};
