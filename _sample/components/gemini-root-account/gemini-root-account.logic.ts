// ルートアカウントのデータ構造を定義するインターフェース
export interface IRootAccountData {
  id: string;
  oathDeclaration: boolean;
  birthEra: string;
  residence: string;
  motherTongue: string[];
  basicValues: string[];
  maxPoints: number;
  currentPoints: number;
  trustScore: number;
  warningCount: number;
  oauthProviders: string[];
  siteLanguage: string;
  nickname: string;
  profilesCount: number;
  groupsCount: number;
  alliancesCount: number;
}

// ダミーデータ
export const DUMMY_DATA: IRootAccountData = {
  id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  oathDeclaration: true,
  birthEra: "1980年代",
  residence: "地球2",
  motherTongue: ["日本語", "英語"],
  basicValues: ["創造性", "協調性", "探求心"],
  maxPoints: 2000,
  currentPoints: 1200,
  trustScore: 85,
  warningCount: 0,
  oauthProviders: ["Google", "GitHub"],
  siteLanguage: "日本語",
  nickname: "匿名の賢者",
  profilesCount: 3,
  groupsCount: 1,
  alliancesCount: 2,
};
