/**
 * Sanctuary Trust System - Logic and Types
 */

export type TrustRank = 'S' | 'A' | 'B' | 'C';

export interface TrustData {
  streakDays: number;
  activityIndex: number; // 0.0 to 1.0
  trustScore: number;
  rank: TrustRank;
}

export interface Permission {
  id: string;
  label: string;
  description: string;
  unlockedAt: TrustRank;
}

export interface TroubleLevel {
  level: number;
  name: string;
  description: string;
  coreApproach: string;
  category: string;
  examples: string[];
  remedy: string;
}

export const TROUBLE_LEVELS: TroubleLevel[] = [
  {
    level: 1,
    name: '違法行為',
    category: '警察・法の領域',
    description: 'プラットフォーム運営の裁量を超え、実社会の法律に抵触する重大事案。',
    coreApproach: '法的措置・外部通報',
    examples: ['殺害予告', '詐欺行為', 'リベンジポルノ', 'サイバー攻撃'],
    remedy: '直ちに通報を行い、法的措置を講じる。'
  },
  {
    level: 2,
    name: '価値観の対立',
    category: '人間の業・思想の領域',
    description: '違法ではないが、個人の核心的な価値観に関わるため、議論による解決が不可能な領域。',
    coreApproach: '物理的・心理的隔離',
    examples: ['思想・信条の対立', '創作の領分論争', '感情の縺れ'],
    remedy: '互いの視界に入らない「住み分け」を徹底する。'
  },
  {
    level: 3,
    name: '機械的悪意',
    category: '認証・AIの領域',
    description: '悪意あるユーザーやbotが、「量」を武器に攻撃を仕掛けてくるケース。',
    coreApproach: 'システム自動排除',
    examples: ['身元の詐称', '広告スパム', '自動化された攻撃'],
    remedy: 'エンジニアリング（Auth認証・AI・フィルター）による自動防御。'
  },
  {
    level: 4,
    name: '文化的摩擦',
    category: '文化・価値観の領域',
    description: 'ルールの解釈違いや知識不足、プレイスタイルの不一致による摩擦。',
    coreApproach: 'マッチングの最適化',
    examples: ['ネタバレ行為', '無断転載', 'プレイスタイル不一致'],
    remedy: 'マッチングの最適化と、メディエーターによる教育的介入。'
  },
  {
    level: 5,
    name: '不誠実な振る舞い',
    category: '相互評価・コミュニティの領域',
    description: '明確な規約違反ではないが、周囲に「不快・不誠実」と感じさせる振る舞い。',
    coreApproach: '相互評価・自浄作用',
    examples: ['約束の軽視', '不快なパーソナリティ', '信用の毀損'],
    remedy: 'ユーザー同士による相互評価と信用スコアの活用。'
  }
];

export const PERMISSIONS: Permission[] = [
  {
    id: 'chat',
    label: 'テキストチャット',
    description: '基本的なテキストメッセージの送信。',
    unlockedAt: 'C'
  },
  {
    id: 'media',
    label: '画像・URL送信',
    description: '画像ファイルやリンクの送信権限。',
    unlockedAt: 'B'
  },
  {
    id: 'call',
    label: '音声通話',
    description: '1対1およびグループでの音声通話。',
    unlockedAt: 'B'
  },
  {
    id: 'event',
    label: 'イベント主催',
    description: 'コミュニティ内でのイベントの作成と管理。',
    unlockedAt: 'A'
  },
  {
    id: 'mediate',
    label: '紛争解決（メディエーター）',
    description: 'トラブルの仲裁、他者の行為に対する最終判定権限。',
    unlockedAt: 'S'
  }
];

/**
 * 信頼スコアからランクを算出する
 */
export const calculateRank = (score: number): TrustRank => {
  if (score >= 1000) return 'S';
  if (score >= 500) return 'A';
  if (score >= 100) return 'B';
  return 'C';
};

/**
 * 信頼データオブジェクトを生成する
 */
export const createTrustData = (streakDays: number, activityIndex: number): TrustData => {
  const trustScore = Math.floor(streakDays * activityIndex * 10);
  return {
    streakDays,
    activityIndex,
    trustScore,
    rank: calculateRank(trustScore)
  };
};

/**
 * 指定したランクが解放されているか判定する
 */
export const isUnlocked = (userRank: TrustRank, targetRank: TrustRank): boolean => {
  const rankValues: Record<TrustRank, number> = { S: 3, A: 2, B: 1, C: 0 };
  return rankValues[userRank] >= rankValues[targetRank];
};
