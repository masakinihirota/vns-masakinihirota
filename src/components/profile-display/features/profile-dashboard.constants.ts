import { DashboardData, RATING_TYPES } from './profile-dashboard.types';

/**
 * 初期データ
 */
export const INITIAL_DATA: DashboardData = {
  profile: {
    name: "山田 太郎",
    headline: "System Architect / Content Curator",
    status: "recruiting",
    bio: "大規模データの視覚化と、エンタメコンテンツの構造化を専門としています。アクセシビリティと美学の両立を追求しています。"
  },
  works: [
    { id: 1, title: "Data Matrix 2026", category: "System", url: "https://vns.internal/dm26", rating: RATING_TYPES.TIER1 },
    { id: 2, title: "Neural Link UI", category: "Design", url: "https://vns.internal/nl-ui", rating: RATING_TYPES.TIER2 },
  ],
  favorites: [
    { id: 1, title: "鋼の錬金術師", subCategory: "Manga", genre: "Fantasy", rating: RATING_TYPES.TIER1 },
    { id: 2, title: "攻殻機動隊 S.A.C.", subCategory: "Anime", genre: "Sci-Fi", rating: RATING_TYPES.TIER1 },
    { id: 3, title: "チェンソーマン", subCategory: "Manga", genre: "Action", rating: RATING_TYPES.TIER2 },
    { id: 4, title: "カウボーイビバップ", subCategory: "Anime", genre: "Sci-Fi", rating: RATING_TYPES.TIER3 },
  ],
  values: [
    { id: 1, key: "効率性", description: "最小の労力で最大の情報密度を実現する", rating: RATING_TYPES.TIER1 },
    { id: 2, key: "透明性", description: "評価基準が常に明確であること", rating: RATING_TYPES.TIER2 },
    { id: 3, key: "自律性", description: "自ら課題を発見し、解決までのプロセスを設計する", rating: RATING_TYPES.TIER1 },
  ],
  skills: [
    { id: 1, name: "React / Next.js", level: "Lvl 99", category: "Frontend" },
    { id: 2, name: "PostgreSQL", level: "Lvl 85", category: "Database" },
    { id: 3, name: "TypeScript", level: "Lvl 92", category: "Language" },
  ]
} as const;
