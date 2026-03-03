export type RatingKey = 'TIER1' | 'TIER2' | 'TIER3' | 'LIKE1' | 'NORMAL_OR_NOT' | 'UNRATED' | 'NO_INTEREST';

export interface RatingValue {
  readonly label: string;
  readonly value: RatingKey;
  readonly weight: number;
  readonly color: string;
}

export type Category = 'アニメ' | '漫画' | 'その他';

export interface Work {
  readonly id: number;
  readonly title: string;
  readonly category: Category;
  readonly tags: readonly string[];
  readonly externalUrl: string;
  readonly affiliateUrl: string;
  readonly isOfficial: boolean;
  readonly userRating: RatingKey;
  readonly lastTier: 'TIER1' | 'TIER2' | 'TIER3';
}

export interface Profile {
  readonly id: string;
  readonly name: string;
  readonly color: string;
}

export type RatingMode = 'tier' | 'like';

export interface SortConfig {
  readonly key: keyof Work | 'userRating';
  readonly direction: 'asc' | 'desc';
}
