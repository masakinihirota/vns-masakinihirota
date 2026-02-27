export type WeekStatus = "BUSY" | "MATCH" | "PENDING";

export interface WeekSchedule {
  mon: WeekStatus;
  tue: WeekStatus;
  wed: WeekStatus;
  thu: WeekStatus;
  fri: WeekStatus;
  sat: WeekStatus;
  sun: WeekStatus;
}
export type DayKey = keyof WeekSchedule;

export interface DayInfo {
  key: DayKey;
  label: string;
}

export const DAYS: DayInfo[] = [
  { key: "mon", label: "月" },
  { key: "tue", label: "火" },
  { key: "wed", label: "水" },
  { key: "thu", label: "木" },
  { key: "fri", label: "金" },
  { key: "sat", label: "土" },
  { key: "sun", label: "日" },
] as const;
