import {
  Language,
  RootAccount,
  UserProfileSummary,
} from "./root-account-dashboard.types";

export const LANGUAGES_MOCK: Language[] = [
  { id: "ja", name: "Japanese", native_name: "日本語" },
  { id: "en", name: "English", native_name: "English" },
  { id: "es", name: "Spanish", native_name: "Español" },
];

// VNS masakinihirota 管理国リスト
export const COUNTRIES_MOCK = [
  { code: "NVA", name: "ノヴァリア連邦", flag: "🏛️", region: "中央大陸" },
  { code: "AEG", name: "エーギル王国", flag: "⚓", region: "海洋諸島" },
  { code: "SLV", name: "シルヴァニア公国", flag: "🌲", region: "北部森林地帯" },
  { code: "IGN", name: "イグニス帝国", flag: "🔥", region: "南部火山地域" },
  {
    code: "AQU",
    name: "アクアティカ自治領",
    flag: "💧",
    region: "東部水郷地帯",
  },
  { code: "TER", name: "テラノヴァ共和国", flag: "⛰️", region: "西部山岳地帯" },
  {
    code: "LUX",
    name: "ルクスブルク自由都市",
    flag: "✨",
    region: "中央都市圏",
  },
  { code: "UMB", name: "アンブラ連合", flag: "🌙", region: "北西部暗黒地域" },
  { code: "AUR", name: "オーロラ共和国", flag: "🌅", region: "極北地域" },
  { code: "VER", name: "ヴェルダント同盟", flag: "🍃", region: "南東部緑地帯" },
];

export const dummyRootAccountData: RootAccount = {
  id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
  display_id: "root_user_001",
  display_name: "Kento Tanaka",
  statement:
    "フルスタックエンジニアを目指して学習中です。主にNext.jsを使用しています。",
  mother_tongue_codes: ["ja", "es"],
  available_language_codes: ["ja", "en", "es"],
  location: "東京都",
  activity_area_id: 1,
  birth_generation: "1990-1994",
  activity_culture_code: "JP",
  core_hours_start: "09:00",
  core_hours_end: "18:00",
  core_hours_2_start: "21:00",
  core_hours_2_end: "23:00",
  uses_ai_translation: true,
  level: 12,
  total_points: 3450,
  auto_recovery_max_points: 2000,
  total_consumed_points: 12_500,
  consumed_points_click: 4500,
  consumed_points_activity: 8000,
  daily_recovery_rate: 0.5,
  last_recovery_at: "2025-08-22T17:00:00Z",
  trust_duration_days: 45, // Initial 30 + 15 days active
  warning_count: 0,
  amazon_associate_tag: "masakinihirota-22",
  status: "active",
  penalty_status: {
    total_penalties: 2,
    yellow_cards: 1,
    red_cards: 0,
    drift_count: 5,
  },
  awards: [
    {
      id: "aw1",
      title: "Early Adopter",
      description: "ベータ版からの参加者に贈られる記念バッジ",
      awarded_at: "2024-01-20T10:00:00Z",
      icon_type: "star",
    },
    {
      id: "aw2",
      title: "Top Contributor",
      description: "月間貢献度ランキング上位入賞",
      awarded_at: "2024-03-01T09:00:00Z",
      icon_type: "trophy",
    },
    {
      id: "aw3",
      title: "Language Master",
      description: "3ヶ国語以上の言語を完了",
      awarded_at: "2024-04-15T14:30:00Z",
      icon_type: "crown",
    },
  ],
  is_anonymous_initial_auth: false,
  is_sso_user: true,
  created_at: "2024-01-15T10:00:00Z",
  last_login_at: "2024-05-20T09:30:00Z",
};

export const dummyUserProfileList: UserProfileSummary[] = [
  {
    id: "p1",
    display_name: "TechKento",
    purpose: "技術学習・開発",
    role_type: "leader",
    is_active: true,
  },
  {
    id: "p2",
    display_name: "GamerK",
    purpose: "ゲーム・エンタメ",
    role_type: "member",
    is_active: true,
  },
  {
    id: "p3",
    display_name: "QuietObserver",
    purpose: "情報収集",
    role_type: "member",
    is_active: false,
  },
];
