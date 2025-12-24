import { Language, RootAccount } from "./root-account-dashboard.types";

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
  level: 12,
  total_points: 3450,
  warning_count: 0,
  status: "active",
  is_anonymous_initial_auth: false,
  is_sso_user: true,
  created_at: "2024-01-15T10:00:00Z",
  last_login_at: "2024-05-20T09:30:00Z",
};
