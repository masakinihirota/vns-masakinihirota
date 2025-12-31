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

export const generateMockProfiles = (count: number = 10): UserProfile[] => {
  return Array.from({ length: count })
    .map(() => ({
      id: uuidv4(),
      displayName: getRandomItem(MOCK_NAMES),
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`, // Random avatar
      bio: getRandomItem(MOCK_BIOS),
      tags: getRandomSubset(MOCK_TAGS, 3),
      compatibility: Math.floor(Math.random() * 20) + 80, // 80-99% compatibility
      maskType: getRandomItem(MASK_TYPES),
      isWatchlisted: false,
    }))
    .sort((a, b) => b.compatibility - a.compatibility); // Sort by compatibility desc
};

// Simulate async matching process
export const findMatches = async (): Promise<UserProfile[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateMockProfiles(10));
    }, 3000); // 3 seconds delay to show animation
  });
};

// Simulate adding to watchlist (automatically for top matches)
export const activeWatchlist = async (
  profiles: UserProfile[]
): Promise<UserProfile[]> => {
  // In this requirement, we automatically add ALL found matches (top 10) to watchlist
  // Real implementation would call an API
  return profiles.map((p) => ({ ...p, isWatchlisted: true }));
};
