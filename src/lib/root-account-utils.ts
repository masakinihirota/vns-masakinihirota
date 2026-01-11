/**
 * Root Account データの変換・正規化ユーティリティ
 * 既存データの後方互換性を保つための処理を提供
 */

import { RootAccount } from "../components/root-accounts/root-account-dashboard/root-account-dashboard.types";

export const AREA_DEFINITIONS = {
  1: {
    name: "北米、南米 (アメリカ NY時間)",
    timezone: "America/New_York",
    defaultCoreHours: { start: "16:00", end: "24:00" },
  },
  2: {
    name: "欧州、アフリカ (イギリス ロンドン時間)",
    timezone: "Europe/London",
    defaultCoreHours: { start: "08:00", end: "16:00" },
  },
  3: {
    name: "アジア、オセアニア (日本 東京時間)",
    timezone: "Asia/Tokyo",
    defaultCoreHours: { start: "00:00", end: "08:00" },
  },
} as const;

/**
 * 旧スキーマ（単一言語コード）から新スキーマ（配列）への変換
 */
export function normalizeRootAccountData(data: any): RootAccount {
  const normalized = { ...data };

  // mother_tongue_code (string) → mother_tongue_codes (string[])
  if (!Array.isArray(normalized.mother_tongue_codes)) {
    if (
      normalized.mother_tongue_code &&
      typeof normalized.mother_tongue_code === "string"
    ) {
      normalized.mother_tongue_codes = [normalized.mother_tongue_code];
    } else {
      normalized.mother_tongue_codes = [];
    }
  }

  // site_language_code (string) → available_language_codes (string[])
  if (!Array.isArray(normalized.available_language_codes)) {
    if (
      normalized.site_language_code &&
      typeof normalized.site_language_code === "string"
    ) {
      normalized.available_language_codes = [normalized.site_language_code];
    } else if (
      normalized.available_language_code &&
      typeof normalized.available_language_code === "string"
    ) {
      normalized.available_language_codes = [
        normalized.available_language_code,
      ];
    } else {
      normalized.available_language_codes = [];
    }
  }

  return normalized as RootAccount;
}

/**
 * 時間文字列をアワー値に変換（例："09:30" → 9.5）
 */
export const timeToHours = (time: string): number => {
  if (!time) return 0;
  const [hours, minutes] = time.split(":").map(Number);
  return hours + minutes / 60;
};

/**
 * アワー値を時間文字列に変換（例：9.5 → "09:30"）
 */
export const hoursToTime = (hours: number): string => {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

/**
 * コア活動時間の合計を計算
 * @param start 開始時刻（"HH:MM"形式）
 * @param end 終了時刻（"HH:MM"形式）
 * @param nextDayEndHour 翌日の終了時刻（数値）
 * @returns 合計時間数
 */
export function calculateTotalCoreHours(
  start: string,
  end: string,
  nextDayEndHour: number = 0
): number {
  const startHours = timeToHours(start);
  const endHours = timeToHours(end);

  if (endHours >= 24 && nextDayEndHour > 0) {
    // 24時を超えて翌日まで続く場合
    return 24 - startHours + nextDayEndHour;
  } else if (endHours >= startHours) {
    // 同日内で完結する場合
    return endHours - startHours;
  } else {
    // 日をまたぐ場合（例: 22:00 - 06:00）
    return 24 - startHours + endHours;
  }
}
