import { z } from "zod";

// Define strict types for trial data
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
  type: z.enum(["general", "business", "hobby"]), // Example types
  created_at: z.string(),
});

export type TrialProfile = z.infer<typeof TrialProfileSchema>;

export const VNSTrialDataSchema = z.object({
  rootAccount: TrialRootAccountSchema.nullable(),
  profiles: z.array(TrialProfileSchema),
  watchlist: z.array(z.string()),
  createdAt: z.string(),
});

export type VNSTrialData = z.infer<typeof VNSTrialDataSchema>;

const STORAGE_KEY = "vns_trial_data";

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
      return JSON.parse(data) as VNSTrialData; // Ideally validate with zod here but keep it fast
    } catch (error) {
      console.error("Failed to load trial data:", error);
      return null;
    }
  },

  // Initialize or get existing
  init: (): VNSTrialData => {
    const existing = TrialStorage.load();
    if (existing) return existing;

    const initial: VNSTrialData = {
      rootAccount: null,
      profiles: [],
      watchlist: [],
      createdAt: new Date().toISOString(),
    };
    TrialStorage.save(initial);
    return initial;
  },

  // Specific Actions
  setRootAccount: (account: TrialRootAccount) => {
    const data = TrialStorage.init();
    data.rootAccount = account;
    TrialStorage.save(data);
  },

  clear: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
  },
};
