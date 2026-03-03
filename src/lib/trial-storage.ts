

import { logger } from "@/lib/logger";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

// --- Sub Schemas ---

export const TrialRootAccountSchema = z.object({
  display_id: z.string(),
  display_name: z.string(),
  activity_area_id: z.number().nullable().optional(),
  core_activity_start: z.string(),
  core_activity_end: z.string(),
  holidayActivityStart: z.string(),
  holidayActivityEnd: z.string(),
  uses_ai_translation: z.boolean(),
  nativeLanguages: z.array(z.string()),
  agreed_oasis: z.boolean(),
  zodiac_sign: z.string(),
  birth_generation: z.string(),
  week_schedule: z.record(z.string(), z.string()),
  created_at: z.string(),
});

export type TrialRootAccount = z.infer<typeof TrialRootAccountSchema>;

// Profile type (for future use)
export const TrialProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["general", "business", "hobby"]),
  created_at: z.string(),
});

export type TrialProfile = z.infer<typeof TrialProfileSchema>;

// Simple Group Schema for Trial
export const TrialGroupSchema = z.object({
  id: z.string(),
  name: z.string(),
  created_at: z.string(),
});

// Simple Nation Schema for Trial
export const TrialNationSchema = z.object({
  id: z.string(),
  name: z.string(),
  created_at: z.string(),
});

// Points Schema
export const TrialPointsSchema = z.object({
  current: z.number().int().min(0).max(1_000_000),
  lastRecoveredAt: z.string().optional(),
  lastActionAt: z.number().optional(), // Timestamp for rate limiting logic
  consecutiveFastActions: z.number().optional(), // Count of fast actions for penalty
});

// --- Main Schema ---

export const VNSTrialDataSchema = z.object({
  rootAccount: TrialRootAccountSchema.nullable(),
  profiles: z.array(TrialProfileSchema),
  groups: z.array(TrialGroupSchema), // Max 2
  nation: TrialNationSchema.nullable(), // Max 1
  watchlist: z.array(z.string()),
  points: TrialPointsSchema,
  createdAt: z.string(),
});

export type VNSTrialData = z.infer<typeof VNSTrialDataSchema>;

const STORAGE_KEY = "vns_trial_data";
export const INITIAL_POINTS = 2000;
export const MAX_POINTS = 1_000_000;
// const RECOVER_LIMIT = 2000;

export const TrialStorage = {
  // Helpers for trial mode flag (localStorage key)
  enableMode: () => {
    if (globalThis.window === undefined) return;
    try {
      localStorage.setItem("vns_trial_mode", "true");
      // カスタムイベントを発火して同一タブ内で即座に反映
      window.dispatchEvent(new Event("trialModeChanged"));
    } catch {}
  },
  disableMode: () => {
    if (globalThis.window === undefined) return;
    try {
      localStorage.removeItem("vns_trial_mode");
      // カスタムイベントを発火して同一タブ内で即座に反映
      window.dispatchEvent(new Event("trialModeChanged"));
    } catch {}
  },
  // Clear all data (stop recording trial)
  clear: () => {
    if (globalThis.window === undefined) return;
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem("vns_trial_mode");
      // カスタムイベントを発火して同一タブ内で即座に反映
      window.dispatchEvent(new Event("trialModeChanged"));
    } catch {}
  },

  // Save entire data
  save: (data: VNSTrialData): boolean => {
    if (globalThis.window === undefined) return false;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (error) {
      // localStorage が満杯またはブラウザ設定で無効化されている場合の詳細ログ
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorType = error instanceof Error ? error.constructor.name : "Unknown";

      // 構造化ログで記録
      logger.error(
        "Failed to save trial data to localStorage",
        error instanceof Error ? error : new Error(errorMessage),
        {
          operation: "TrialStorage.save",
          storageKey: STORAGE_KEY,
          errorType,
          dataSize: JSON.stringify(data).length,
          timestamp: new Date().toISOString(),
        }
      );

      // Graceful Degradation: 一応動作は続行（メモリ内のデータは保持）
      // ただし、ユーザーには警告を示す方法をページコンポーネント側で実装すべき
      return false;
    }
  },

  // Load entire data
  load: (): VNSTrialData | undefined => {
    if (globalThis.window === undefined) return undefined;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return undefined;
      // In a real app, you might want to safeParse here, but for trial speed is prioritized.
      // We assume the shape is correct if it exists. Re-validating every UI render might be heavy.
      return JSON.parse(data) as VNSTrialData;
    } catch (error) {
      // localStorage が破損している、またはアクセス不可の場合的詳細ログ
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorType = error instanceof Error ? error.constructor.name : "Unknown";

      logger.warn(
        "Failed to load trial data from localStorage",
        {
          operation: "TrialStorage.load",
          storageKey: STORAGE_KEY,
          errorType,
          originalError: errorMessage,
          timestamp: new Date().toISOString(),
          suggestion: "localStorage may be disabled or corrupted. Trial mode will continue with default data.",
        }
      );

      // Graceful Degradation: undefined を返して、呼び出し側が init() で新規データを作成
      return undefined;
    }
  },

  // Initialize or get existing
  init: (): VNSTrialData => {
    const existing = TrialStorage.load();
    if (existing) {
      let modified = false;

      // Migrate points if missing
      if (!existing.points) {
        existing.points = {
          current: INITIAL_POINTS,
          lastActionAt: Date.now(),
          consecutiveFastActions: 0,
        };
        modified = true;
      }

      // Ensure arrays exist
      if (!existing.profiles) {
        existing.profiles = [];
        modified = true;
      }
      if (!existing.groups) {
        existing.groups = [];
        modified = true;
      }
      if (!existing.watchlist) {
        existing.watchlist = [];
        modified = true;
      }
      if (existing.nation === undefined) {
        existing.nation = null;
        modified = true;
      }

      if (modified) {
        TrialStorage.save(existing);
      }
      return existing;
    }

    const initial: VNSTrialData = {
      rootAccount: null,
      profiles: [],
      groups: [],
      nation: null,
      watchlist: [],
      points: {
        current: INITIAL_POINTS,
        lastActionAt: Date.now(),
        consecutiveFastActions: 0,
      },
      createdAt: new Date().toISOString(),
    };
    TrialStorage.save(initial);
    // ensure mode flag is set when we create initial data
    TrialStorage.enableMode();
    return initial;
  },

  consumePoints: (baseAmount: number): boolean => {
    const data = TrialStorage.init();
    const now = Date.now();
    const lastAction = data.points.lastActionAt || 0;
    const diff = now - lastAction;

    // Gentle Balance: < 300ms is considered "Machine-like / Spam"
    const PENALTY_THRESHOLD_MS = 300;
    let multiplier = 1;

    if (diff < PENALTY_THRESHOLD_MS) {
      data.points.consecutiveFastActions =
        (data.points.consecutiveFastActions || 0) + 1;
      // Penalty: Double the cost for every consecutive fast action, capped at 10x
      multiplier = Math.min(
        Math.pow(2, data.points.consecutiveFastActions),
        10
      );
      logger.warn(`Rapid access detected! Point consumption x${multiplier}`);
    } else {
      // Reset penalty if action is normal speed
      data.points.consecutiveFastActions = 0;
    }

    const finalAmount = Math.ceil(baseAmount * multiplier);

    if (data.points.current < finalAmount) {
      return false; // Not enough points
    }

    data.points.current -= finalAmount;
    data.points.lastActionAt = now;
    TrialStorage.save(data);
    return true;
  },

  addPoints: (amount: number) => {
    const data = TrialStorage.init();
    data.points.current = Math.min(data.points.current + amount, MAX_POINTS);
    TrialStorage.save(data);
  },

  // --- Feature Actions (Mock but Persistent) ---

  createGroup: (name: string): { success: boolean; message?: string } => {
    const data = TrialStorage.init();
    if (data.groups.length >= 2)
      return {
        success: false,
        message: "お試し版ではグループ作成は2つまでです。",
      };

    // Group creation is free in trial as per requirements (or 0 pt)
    const newGroup = {
      id: uuidv4(),
      name,
      created_at: new Date().toISOString(),
    };
    data.groups.push(newGroup);
    TrialStorage.save(data);
    return { success: true };
  },

  createNation: (name: string): { success: boolean; message?: string } => {
    if (!TrialStorage.consumePoints(10))
      return {
        success: false,
        message: "ポイントが不足しています (必要: 10pt)",
      };

    const data = TrialStorage.init(); // Refresh data after consumption
    if (data.nation)
      return { success: false, message: "お試し版では国の作成は1つまでです。" };

    data.nation = { id: uuidv4(), name, created_at: new Date().toISOString() };
    TrialStorage.save(data);
    return { success: true };
  },

  // For Migration
  exportTrialData: (): VNSTrialData | undefined => {
    return TrialStorage.load();
  },
};

/**
 * 星座匿名（コンステレーション・アノニマス）を生成
 * 形式: 色+マテリアル+の+星座 (例: 緑の光速の魚座)
 * @param userConstellation ユーザーの星座（省略時はランダム）
 * @returns ランダム生成された星座匿名
 */
export function generateRandomAnonymousName(userConstellation?: string): string {
  const colors = [
    "赤い", "青い", "黄色い", "緑の", "紫の", "橙色の",
    "ピンクの", "茶色の", "灰色の", "黒い", "白い", "銀色の",
    "金色の", "虹色の", "透明な", "輝く"
  ];

  const materials = [
    "マテリアル", "光", "幻想", "氷", "炎", "輝き",
    "熱狂", "闇", "風", "水", "土", "雷",
    "音", "光速", "宇宙", "時間", "魂", "夢",
    "記憶", "希望", "絆", "運命"
  ];

  const constellations = [
    "牡羊座", "牡牛座", "双子座", "蟹座", "獅子座", "乙女座",
    "天秤座", "蠍座", "射手座", "山羊座", "水瓶座", "魚座"
  ];

  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const randomMaterial = materials[Math.floor(Math.random() * materials.length)];
  const constellation = userConstellation || constellations[Math.floor(Math.random() * constellations.length)];

  return `${randomColor}${randomMaterial}の${constellation}`;
}

