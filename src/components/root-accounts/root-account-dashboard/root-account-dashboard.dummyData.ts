import { Language, RootAccount, UserProfileSummary } from "./root-account-dashboard.types";

export const LANGUAGES_MOCK: Language[] = [
  { id: "ja", name: "Japanese", native_name: "日本語" },
  { id: "en", name: "English", native_name: "English" },
  { id: "es", name: "Spanish", native_name: "Español" },
];

export const dummyRootAccountData: RootAccount = {
  id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
  display_id: "root_user_001",
  display_name: "Kento Tanaka",
  statement:
    "フルスタックエンジニアを目指して学習中です。主にNext.jsとSupabaseを使用しています。",
  mother_tongue_code: "ja",
  site_language_code: "en",
  location: "東京都",
  birth_generation: "1990s",
  activity_culture_code: "JP",
  core_hours_start: "09:00",
  core_hours_end: "18:00",
  uses_ai_translation: true,
  level: 12,
  total_points: 3450,
  trust_duration_days: 45, // Initial 30 + 15 days active
  warning_count: 0,
  status: "active",
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
