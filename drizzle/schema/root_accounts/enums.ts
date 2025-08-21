import { pgEnum } from "drizzle-orm/pg-core";

// living_area_segmentのEnum定義
export const livingAreaSegmentEnum = pgEnum("living_area_segment", [
    'area1',
    'area2',
    'area3'
]);

// 認証プロバイダ (Supabase provider 名称 + anonymous 初期状態)
export const authProviderEnum = pgEnum("auth_provider", [
  "google",
  "github",
  "anonymous",
]);

// ポイント加減算理由 (最小セット / 拡張余地あり)
export const pointsReasonEnum = pgEnum("points_reason", [
  "system_adjust",
  "manual_adjust",
  "signup_bonus",
  "profile_complete",
  "login_streak",
  "penalty",
]);

// 認証イベント種別
export const authEventTypeEnum = pgEnum("auth_event_type", [
  "sign_in",
  "sign_out",
  "refresh",
  "anonymous_upgrade",
  "provider_link",
  "provider_unlink",
  "failure",
]);

// 言語熟練度 (ユーザー追加言語管理)
export const languageProficiencyEnum = pgEnum("language_proficiency", [
  "native",
  "fluent",
  "intermediate",
  "basic",
  "learning",
]);
