export interface RootAccountData {
  id: string;
  authUserId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
  isVerified: boolean;
  motherTongueCode: string;
  siteLanguageCode: string;
  birthGeneration: string;
  livingAreaSegment: string;
  isAnonymousInitialAuth: boolean;
  invitedAt: string;
  confirmedAt: string;
  totalPoints: number;
  maxPoints: number;
  lastPointRecoveryAt: string;
  totalConsumedPoints: number;
  activityPoints: number;
  clickPoints: number;
  consecutiveDays: number;
  trustScore: number;
  oauthProviders: string[];
  oauthCount: number;
  warningCount: number;
  lastWarningAt: string;
  accountStatus: string;
  lastLogin: string;
}

export interface UserProfile {
  id: string;
  name: string;
  imageUrl: string;
  purpose: string;
  type: string;
}

export interface ProfileManagementData {
  createdProfiles: number;
  maxProfiles: number;
  resetCount: number;
  creationCost: number;
}

export interface StaticData {
  rootAccount: RootAccountData;
  userProfiles: UserProfile[];
  profileManagement: ProfileManagementData;
}

export const staticData: StaticData = {
  rootAccount: {
    id: "a1b2c3d4-e5f6-7890-abcd-1234567890ef",
    authUserId: "f9c8b7a6-d5e4-3c2b-1a09-fedcba987654",
    createdAt: "2025-08-18T10:00:00Z",
    updatedAt: "2025-08-22T15:30:00Z",
    deletedAt: null,
    isVerified: true,
    motherTongueCode: "ja-JP",
    siteLanguageCode: "ja-JP",
    birthGeneration: "1990年代",
    livingAreaSegment: "area1",
    isAnonymousInitialAuth: false,
    invitedAt: "2025-08-17T09:00:00Z",
    confirmedAt: "2025-08-18T10:00:00Z",
    totalPoints: 1500,
    maxPoints: 2000,
    lastPointRecoveryAt: "2025-08-22T08:00:00Z",
    totalConsumedPoints: 500,
    activityPoints: 300,
    clickPoints: 200,
    consecutiveDays: 30,
    trustScore: 85,
    oauthProviders: ["google", "github"],
    oauthCount: 2,
    warningCount: 1,
    lastWarningAt: "2025-08-01T12:00:00Z",
    accountStatus: "active",
    lastLogin: "2025-08-21T12:00:00Z",
  },
  userProfiles: [
    {
      id: "prof1",
      name: "仕事用ユーザープロフィール",
      imageUrl: "https://placehold.co/80x80/6366f1/ffffff?text=Work",
      purpose: "仕事",
      type: "multiple",
    },
    {
      id: "prof2",
      name: "趣味用ユーザープロフィール",
      imageUrl: "https://placehold.co/80x80/f97316/ffffff?text=Hobby",
      purpose: "趣味",
      type: "multiple",
    },
    {
      id: "prof3",
      name: "婚活用ユーザープロフィール",
      imageUrl: "https://placehold.co/80x80/ec4899/ffffff?text=Love",
      purpose: "婚活",
      type: "single",
    },
  ],
  profileManagement: {
    createdProfiles: 3,
    maxProfiles: 5,
    resetCount: 1,
    creationCost: 50, // 新しいプロフィール作成に必要なポイント
  },
};
