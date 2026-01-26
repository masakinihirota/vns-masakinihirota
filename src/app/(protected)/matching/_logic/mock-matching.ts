import { v4 as uuidv4 } from "uuid";

export type UserProfile = {
  id: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  tags: string[];
  compatibility: number;
  maskType: "glitch" | "blur" | "pixel" | "noise";
  isWatchlisted: boolean;
  // 未登録ユーザー向け優先選出用の追加フィールド
  isPriority: boolean; // マッチングを強く希望している
  popularity: number; // 人気度 (0-100)
  matchCount: number; // 現在のマッチング数
  createdAt: string; // アカウント作成日
};

const MOCK_NAMES = [
  "AeonFlux",
  "CyberMonk",
  "NeonDreamer",
  "QuantumSoul",
  "EchoVoice",
  "NullPointer",
  "BinaryBard",
  "GlitchWitch",
  "PixelPaladin",
  "VoidWalker",
  "DataDruid",
  "NetNinja",
  "SynthSage",
  "LogicLord",
  "ChaosCleric",
];

const MOCK_TAGS = [
  "Philosophy",
  "Art",
  "Coding",
  "Music",
  "Nature",
  "Gaming",
  "Sci-Fi",
  "History",
  "Psychology",
  "Space",
];

const MOCK_BIOS = [
  "Seeking the truth in the noise.",
  "Digital ghost haunting the machine.",
  "Artist of the invisible.",
  "Explorer of consciousness.",
  "Just a glitch in the system.",
  "Dreaming of electric sheep.",
  "Coding the future, one line at a time.",
  "Lost in the data stream.",
  "Observer of the multiverse.",
  "Collector of rare moments.",
];

const MASK_TYPES = ["glitch", "blur", "pixel", "noise"] as const;

function getRandomItem<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomSubset<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export const generateMockProfiles = (count: number = 30): UserProfile[] => {
  return Array.from({ length: count }).map(() => {
    const createdAt = new Date(
      Date.now() - Math.floor(Math.random() * 10000000000)
    ).toISOString();
    return {
      id: uuidv4(),
      displayName: getRandomItem(MOCK_NAMES),
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`,
      bio: getRandomItem(MOCK_BIOS),
      tags: getRandomSubset(MOCK_TAGS, 3),
      compatibility: Math.floor(Math.random() * 20) + 80,
      maskType: getRandomItem(MASK_TYPES),
      isWatchlisted: false,
      isPriority: Math.random() > 0.8, // 20%の確率でマッチング希望者
      popularity: Math.floor(Math.random() * 100),
      matchCount: Math.floor(Math.random() * 50),
      createdAt,
    };
  });
};

// Simulate async matching process
export const findMatches = async (
  hasProfile: boolean = true
): Promise<UserProfile[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const allProfiles = generateMockProfiles(50);

      if (hasProfile) {
        // 通常のマッチング：相性順
        resolve(
          allProfiles
            .sort((a, b) => b.compatibility - a.compatibility)
            .slice(0, 10)
        );
      } else {
        // 未登録者向け：優先選出ロジック
        // 優先順位: 強く希望している人 > 人気な人 > 新しい人 > マッチングが少ない人
        const guestMatches = allProfiles.sort((a, b) => {
          // 1. 強く希望している人を最優先
          if (a.isPriority !== b.isPriority) {
            return a.isPriority ? -1 : 1;
          }
          // 2. 次に人気な人
          if (Math.abs(b.popularity - a.popularity) > 20) {
            return b.popularity - a.popularity;
          }
          // 3. 次に新しい人
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          if (Math.abs(dateB - dateA) > 1000 * 60 * 60 * 24 * 30) {
            return dateB - dateA;
          }
          // 4. マッチングが少ない人
          return a.matchCount - b.matchCount;
        });

        // ゲスト向けは相性を一律「誰でもマッチング」として85%前後に固定
        const results = guestMatches.slice(0, 10).map((p) => ({
          ...p,
          compatibility: Math.floor(Math.random() * 5) + 85,
        }));

        resolve(results);
      }
    }, 2000); // 2 seconds delay
  });
};

// Simulate adding to watchlist
export const activeWatchlist = async (
  profiles: UserProfile[]
): Promise<UserProfile[]> => {
  return profiles.map((p) => ({ ...p, isWatchlisted: true }));
};
