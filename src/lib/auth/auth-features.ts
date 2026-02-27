/**
 * 認証方法ごとの機能・制限の定義
 * 各ログインフォームで使用される特徴リストを一元管理
 */

export interface AuthFeature {
  label: string;
  value: string;
  isNegative?: boolean;
}

export interface AuthMethodFeatures {
  rootAccounts: string;
  userProfiles: string;
  points: string;
  valuesRegistration: boolean;
  worksRegistration: boolean;
  tagsRegistration: boolean;
  dataRead: boolean;
  dataSave: boolean;
  dataDelete: boolean;
  adsControl: string;
  oasisDeclaration: boolean;
}

/**
 * 認証方法別の機能定義
 */
export const AUTH_METHOD_FEATURES: Record<
  "google" | "github" | "anonymous",
  AuthMethodFeatures
> = {
  google: {
    rootAccounts: "1",
    userProfiles: "10枚",
    points: "1000",
    valuesRegistration: true,
    worksRegistration: true,
    tagsRegistration: true,
    dataRead: true,
    dataSave: true,
    dataDelete: true,
    adsControl: "選択可能",
    oasisDeclaration: true,
  },
  github: {
    rootAccounts: "1",
    userProfiles: "15枚",
    points: "2500",
    valuesRegistration: true,
    worksRegistration: true,
    tagsRegistration: true,
    dataRead: true,
    dataSave: true,
    dataDelete: true,
    adsControl: "選択可能",
    oasisDeclaration: true,
  },
  anonymous: {
    rootAccounts: "1",
    userProfiles: "3枚",
    points: "500",
    valuesRegistration: false,
    worksRegistration: false,
    tagsRegistration: false,
    dataRead: true,
    dataSave: false,
    dataDelete: false,
    adsControl: "あり強制",
    oasisDeclaration: false,
  },
};

/**
 * AuthMethodFeaturesをAuthFeature配列に変換
 */
export function convertToAuthFeatures(
  features: AuthMethodFeatures
): AuthFeature[] {
  return [
    { label: "ルートアカウント", value: features.rootAccounts, isNegative: false },
    { label: "ユーザープロフィール", value: features.userProfiles, isNegative: false },
    { label: "所持ポイント", value: features.points, isNegative: false },
    {
      label: "価値観登録",
      value: features.valuesRegistration ? "OK" : "NG",
      isNegative: !features.valuesRegistration,
    },
    {
      label: "作品登録",
      value: features.worksRegistration ? "OK" : "NG",
      isNegative: !features.worksRegistration,
    },
    {
      label: "タグ登録",
      value: features.tagsRegistration ? "OK" : "NG",
      isNegative: !features.tagsRegistration,
    },
    {
      label: "データ読み込み",
      value: features.dataRead ? "OK" : "NG",
      isNegative: !features.dataRead,
    },
    {
      label: "データ保存",
      value: features.dataSave ? "OK" : "NG",
      isNegative: !features.dataSave,
    },
    {
      label: "データ削除",
      value: features.dataDelete ? "OK" : "NG",
      isNegative: !features.dataDelete,
    },
    {
      label: "広告",
      value: features.adsControl,
      isNegative: features.adsControl === "あり強制",
    },
    {
      label: "オアシス宣言",
      value: features.oasisDeclaration ? "あり" : "なし",
      isNegative: !features.oasisDeclaration,
    },
  ];
}

/**
 * 認証方法のfeature配列を取得
 */
export function getAuthFeatures(
  authMethod: "google" | "github" | "anonymous"
): AuthFeature[] {
  return convertToAuthFeatures(AUTH_METHOD_FEATURES[authMethod]);
}
