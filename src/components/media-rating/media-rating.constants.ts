import { Profile, RatingKey, RatingValue } from './media-rating.types';

export const RATINGS: Record<RatingKey, RatingValue> = {
  TIER1: { label: 'Tier 1', value: 'TIER1', weight: 10, color: 'text-red-600' },
  TIER2: { label: 'Tier 2', value: 'TIER2', weight: 9, color: 'text-orange-500' },
  TIER3: { label: 'Tier 3', value: 'TIER3', weight: 8, color: 'text-yellow-600' },
  LIKE1: { label: '好き(1)', value: 'LIKE1', weight: 7, color: 'text-pink-500' },
  NORMAL_OR_NOT: { label: '普通or自分には合わない', value: 'NORMAL_OR_NOT', weight: 4, color: 'text-gray-600' },
  UNRATED: { label: '未評価', value: 'UNRATED', weight: 1, color: 'text-gray-400' },
  NO_INTEREST: { label: '興味がない', value: 'NO_INTEREST', weight: 0, color: 'text-slate-300' },
} as const;

export const PROFILES: readonly Profile[] = [
  { id: 'p1', name: 'masakinihirota', color: 'bg-blue-600' },
  { id: 'p2', name: 'guest_user_01', color: 'bg-emerald-600' },
  { id: 'p3', name: 'reviewer_alpha', color: 'bg-purple-600' },
  { id: 'p4', name: 'anime_otaku_99', color: 'bg-pink-600' }
] as const;

export const ITEMS_PER_PAGE = 50;

export const TARGET_CATEGORIES: readonly string[] = ['アニメ', '漫画'] as const;
