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
  current: z.number(),
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
export const MAX_POINTS = 1000000;
// const RECOVER_LIMIT = 2000;

export const TrialStorage = {
  // Save entire data
  save: (data: VNSTrialData): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save trial data:", error);
    }
  },

  // Load entire data
  load: (): VNSTrialData | null => {
    if (typeof window === "undefined") return null;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return null;
      // In a real app, you might want to safeParse here, but for trial speed is prioritized.
      // We assume the shape is correct if it exists. Re-validating every UI render might be heavy.
      return JSON.parse(data) as VNSTrialData;
    } catch (error) {
      console.error("Failed to load trial data:", error);
      return null;
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
    return initial;
  },

  // --- Actions ---

  setRootAccount: (account: TrialRootAccount) => {
    const data = TrialStorage.init();
    data.rootAccount = account;
    TrialStorage.save(data);
  },

  // Point Consumption Logic with Progressive Penalty
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
      console.warn(`Rapid access detected! Point consumption x${multiplier}`);
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

  clear: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
  },

  // For Migration
  exportTrialData: (): VNSTrialData | null => {
    return TrialStorage.load();
  },
};
