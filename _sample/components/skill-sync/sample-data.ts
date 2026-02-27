import { Profile } from "./types";

/**
 * 自分のプロファイル（モックデータ）
 */
export const MY_PROFILES: readonly Profile[] = [
  {
    id: "masakinihirota",
    name: "masakinihirota",
    role: "Full Stack Developer",
    mastery: {
      "React / Next.js": [0, 1, 2, 5, 6, 7],
      "Python / AI": [0, 3, 4, 7],
      Infrastructure: [0, 1, 2, 4, 5],
    },
  },
  {
    id: "hirota-lead",
    name: "Hirota (Lead Mode)",
    role: "Engineering Manager",
    mastery: {
      "React / Next.js": [0, 1, 6],
      "Python / AI": [0, 1],
      Infrastructure: [0, 1, 2, 3, 4, 5, 6, 7],
      "Node.js / Go": [0, 1, 2, 3, 4, 5],
    },
  },
] as const;

/**
 * 候補者（パートナー）のプロファイル（モックデータ）
 */
export const CANDIDATES: readonly Profile[] = [
  {
    id: "candidate-1",
    name: "田中 健太",
    role: "Frontend Specialist",
    mastery: {
      "React / Next.js": [0, 1, 3, 4, 7],
      "Python / AI": [0],
    },
  },
  {
    id: "candidate-2",
    name: "佐藤 結衣",
    role: "AI / Data Engineer",
    mastery: {
      "React / Next.js": [0, 7],
      "Python / AI": [0, 1, 2, 3, 4, 5, 6, 7],
    },
  },
  {
    id: "candidate-3",
    name: "鈴木 一郎",
    role: "Cloud Architect",
    mastery: {
      Infrastructure: [0, 1, 2, 3, 4, 5, 6, 7],
      "React / Next.js": [0, 1, 2],
    },
  },
  {
    id: "candidate-4",
    name: "伊藤 舞",
    role: "Backend Dev",
    mastery: {
      "Node.js / Go": [0, 1, 2, 3, 4],
      "React / Next.js": [0, 1, 2, 3, 4, 5],
    },
  },
] as const;
