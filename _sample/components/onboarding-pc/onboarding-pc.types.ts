import { WeekSchedule } from "../ui/week-scheduler/types";

export interface OnboardingPCData {
  activity_area_id: number | null;
  activity_culture_code?: string;
  moon_location?: string;
  mars_location?: string;
  core_activity_start: string;
  core_activity_end: string;
  core_activity_2_start?: string;
  core_activity_2_end?: string;
  birth_generation?: string;
  display_name?: string;
  availableLanguages?: string[];
  holidayActivityStart: string;
  holidayActivityEnd: string;
  holidayActivity2Start?: string;
  holidayActivity2End?: string;
  uses_ai_translation: boolean;
  display_id: string;
  nativeLanguages: string[];
  amazon_associate_tag: string;
  is_minor: boolean | undefined;
  basic_values: Record<string, string | string[] | undefined>;
  agreed_oasis: boolean;
  agreed_human: boolean;
  agreed_honesty: boolean;
  agreed_system_open_data: boolean;
  agreed_system_mediator: boolean;
  agreed_system_ad: boolean;
  agreed_system_creator: boolean;
  zodiac_sign?: string;
  week_schedule: WeekSchedule;
  selectedCountry?: string;
  selectedRegion?: string;
  [key: string]: unknown;
}

export interface OnboardingStepProperties {
  readonly data: OnboardingPCData;
  readonly onUpdate: (data: Partial<OnboardingPCData>) => void;
}
