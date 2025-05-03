import {
  pgTable,
  uuid,
  timestamp,
  text,
  jsonb,
  boolean,
  index,
} from "drizzle-orm/pg-core";

/**
 * Supabaseの認証ユーザー情報（またはそれに準ずる情報）を格納するテーブルスキーマ。
 * `auth.users` テーブルを直接操作する代わりに、アプリケーション固有のロジックや
 * 追加情報を管理するために使用することを想定しています。
 */
export const rootAccounts = pgTable(
  "root_account",
  {
    /** ユーザーの一意な識別子 (UUID)。主キーです。 */
    id: uuid("id").primaryKey(),
    /** JWTの対象者 (Audience)。通常は 'authenticated' など。 */
    aud: text("aud"),
    /** ユーザーの役割 (例: 'user', 'admin')。権限管理に使用します。 */
    role: text("role"),
    /** ユーザーのメールアドレス。 */
    // .notNull() を追加して必須カラムにすることや、
    // .unique() を追加して一意制約を設けることを検討できます。
    email: text("email"),
    /** メールアドレスが確認された日時。未確認の場合はNULLになる可能性があります。 */
    // .notNull() をつけないことで、NULLを許容します。
    email_confirmed_at: timestamp("email_confirmed_at", { withTimezone: true }), // タイムゾーン情報を保持
    /** アプリケーション固有のメタデータ (JSONB形式)。 */
    raw_app_meta_data: jsonb("raw_app_meta_data"),
    /** ユーザー固有のメタデータ (JSONB形式)。 */
    raw_user_meta_data: jsonb("raw_user_meta_data"),
    /** レコードが作成された日時。自動的に現在時刻が設定されます。 */
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(), // タイムゾーン情報とNOT NULL制約を追加
    /** レコードが最後に更新された日時。 */
    // アプリケーション側で更新時に設定するか、DBトリガーが必要です。
    // NULLを許容する場合は .notNull() をつけません。
    updated_at: timestamp("updated_at", { withTimezone: true }), // タイムゾーン情報を保持
    /** ユーザーが（メール等で）確認された日時。 */
    confirmed_at: timestamp("confirmed_at", { withTimezone: true }), // タイムゾーン情報を保持
    /** SSO (Single Sign-On) 経由で認証されたユーザーかどうかのフラグ。 */
    // デフォルト値を設定することも検討できます (例: .default(false))
    is_sso_user: boolean("is_sso_user").notNull().default(false), // NOT NULL制約とデフォルト値を追加
    /** 匿名ユーザーかどうかのフラグ。 */
    is_anonymous: boolean("is_anonymous").notNull().default(false), // NOT NULL制約とデフォルト値を追加

    /** 認証に使用されたプロバイダー (例: 'google', 'github', 'email')。 */
    provider: text("provider"),
    /** ユーザーの表示名。 */
    name: text("name"),
    /** プロフィール画像のURL。 */
    avatar_url: text("avatar_url"),
  },
  // --- テーブルレベルの制約やインデックス ---
  (table) => {
    return {
      // emailカラムにインデックスを作成し、検索パフォーマンスを向上させます。
      // 一意制約も兼ねる場合は uniqueIndex を使用します。
      emailIndex: index("email_idx").on(table.email),
      // roleカラムにもインデックスを作成すると、ロールベースの検索が高速化します。
      roleIndex: index("role_idx").on(table.role),
    };
  },
);
