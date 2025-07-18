import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  pgEnum,
  varchar,
  integer,
  unique,
  primaryKey,
} from "drizzle-orm/pg-core";
import { rootAccounts } from "./root_accounts";

// プロフィールタイプのEnum定義（要件定義書に合わせて修正）
export const profileTypeEnum = pgEnum("profile_type", [
  "本人_匿名",
  "本人_非認証実名",
  "本人_認証済実名",
  "インタビュー",
  "他人",
]);

// ステータスのEnum定義
export const profileStatusEnum = pgEnum("profile_status", [
  "active",
  "inactive",
  "suspended",
]);

/**
 * ユーザープロフィールテーブル
 * ユーザーの公開プロフィール情報を管理
 */
export const userProfiles = pgTable(
  "user_profiles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    rootAccountId: uuid("root_account_id")
      .references(() => rootAccounts.id, { onDelete: "cascade" })
      .notNull(),

    // 基本情報
    profileName: varchar("profile_name", { length: 100 }).notNull(),
    profileNameWithTimestamp: varchar("profile_name_with_timestamp", {
      length: 150,
    }).notNull(),
    profileType: profileTypeEnum("profile_type").notNull(),

    // プロフィール設定
    isLeader: boolean("is_leader").notNull().default(true),
    groupName: varchar("group_name", { length: 100 }),
    allianceName: varchar("alliance_name", { length: 100 }),

    // 言語設定
    primaryLanguages: text("primary_languages").array(), // 使用言語（配列）

    // 状態管理
    currentStatus: varchar("current_status", { length: 50 }), // メンバー募集中、仕事募集中など
    isHidden: boolean("is_hidden").notNull().default(false), // 隠しプロフィール

    // 既存フィールド（互換性維持）
    status: profileStatusEnum("status").notNull().default("active"),
    purpose: text("purpose"),
    isAnonymous: boolean("is_anonymous").notNull().default(false),
    isVerified: boolean("is_verified").notNull().default(false),

    // セキュリティ
    separatedPassword: varchar("separated_password", { length: 64 }),
    isSeparated: boolean("is_separated").notNull().default(false),

    // メタ情報
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    uniqueProfileNameWithTimestamp: unique().on(table.profileNameWithTimestamp),
  }),
);

// プロフィール目的のEnum定義（Seeds で使用される値を追加）
export const purposeEnum = pgEnum("purpose_type", [
  "広告",
  "友活",
  "趣味",
  "推し活",
  "仕事",
  "婚活",
  "パートナー活",
  "サポート",
  "就活",
  "老活",
  "終活",
  "政活_政治",
  "政活_選挙",
  "恋活",
  "相活",
  "朝活",
  "妊活",
  "保活",
  "美活",
  "離活",
  "再活",
  "育活",
  "住活",
  "赤ちゃんマッチング",
  // Seeds で使用される追加の値
  "悩み相談",
  "政治活動",
  "特別な活動",
]);

/**
 * ユーザープロフィール目的テーブル
 */
export const userProfilePurposes = pgTable(
  "user_profile_purposes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userProfileId: uuid("user_profile_id")
      .references(() => userProfiles.id, { onDelete: "cascade" })
      .notNull(),
    purpose: purposeEnum("purpose").notNull(),
    isPrimary: boolean("is_primary").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    uniqueUserProfilePurpose: unique().on(table.userProfileId, table.purpose),
  }),
);

/**
 * ユーザープロフィール SNSアカウントテーブル
 */
export const userProfileSnsAccounts = pgTable(
  "user_profile_sns_accounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userProfileId: uuid("user_profile_id")
      .references(() => userProfiles.id, { onDelete: "cascade" })
      .notNull(),
    platform: varchar("platform", { length: 50 }).notNull(), // YouTube, X(Twitter), Instagram など
    accountUrl: varchar("account_url", { length: 500 }).notNull(),
    accountName: varchar("account_name", { length: 100 }),
    isVerified: boolean("is_verified").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    uniqueUserProfileSns: unique().on(
      table.userProfileId,
      table.platform,
      table.accountUrl,
    ),
  }),
);

// 連絡先タイプのEnum定義
export const contactTypeEnum = pgEnum("contact_type", [
  "email",
  "line",
  "zoom",
  "other",
]);

/**
 * ユーザープロフィール 連絡先テーブル
 */
export const userProfileContactMethods = pgTable(
  "user_profile_contact_methods",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userProfileId: uuid("user_profile_id")
      .references(() => userProfiles.id, { onDelete: "cascade" })
      .notNull(),
    contactType: contactTypeEnum("contact_type").notNull(),
    contactValue: varchar("contact_value", { length: 200 }).notNull(),
    isCopiedFromRoot: boolean("is_copied_from_root").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
);

// 作品タイプのEnum定義
export const workTypeEnum = pgEnum("work_type", [
  "自分の作品",
  "グループ作品",
  "アライアンス作品",
]);

/**
 * ユーザープロフィール 作品テーブル
 */
export const userProfileWorks = pgTable("user_profile_works", {
  id: uuid("id").primaryKey().defaultRandom(),
  userProfileId: uuid("user_profile_id")
    .references(() => userProfiles.id, { onDelete: "cascade" })
    .notNull(),
  workType: workTypeEnum("work_type").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  url: varchar("url", { length: 500 }),
  salesUrl: varchar("sales_url", { length: 500 }),
  blogUrl: varchar("blog_url", { length: 500 }),
  youtubeUrl: varchar("youtube_url", { length: 500 }),
  affiliateUrl: varchar("affiliate_url", { length: 500 }),
  amazonWishlistUrl: varchar("amazon_wishlist_url", { length: 500 }),
  myPosition: varchar("my_position", { length: 100 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// カテゴリEnum定義（好きな作品用）
export const favoriteWorkCategoryEnum = pgEnum("favorite_work_category", [
  "今",
  "人生",
  "未来",
]);

// ティア評価Enum定義
export const tierRatingEnum = pgEnum("tier_rating", [
  "Tier1",
  "Tier2",
  "Tier3",
  "普通",
  "読了未評価",
  "未読未評価",
]);

/**
 * ユーザープロフィール 好きな作品テーブル（旧バージョン、今後は userProfileFavoriteWorksV2 を使用）
 */
export const userProfileFavoriteWorksOld = pgTable(
  "user_profile_favorite_works",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userProfileId: uuid("user_profile_id")
      .references(() => userProfiles.id, { onDelete: "cascade" })
      .notNull(),
    workId: uuid("work_id").notNull(), // works テーブルへの参照
    category: favoriteWorkCategoryEnum("category").notNull(),
    tierRating: tierRatingEnum("tier_rating"),
    myEvaluation: integer("my_evaluation"), // 0-5の評価
    personalNote: text("personal_note"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    uniqueUserProfileFavoriteWork: unique().on(
      table.userProfileId,
      table.workId,
      table.category,
    ),
  }),
);

/**
 * 価値観質問テーブル
 * ER図の ValueQuestions に対応
 */
export const valueQuestions = pgTable("value_questions", {
  id: uuid("id").primaryKey().defaultRandom(),
  questionText: text("question_text").notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * 価値観選択肢テーブル
 * ER図の ValueChoices に対応
 */
export const valueChoices = pgTable("value_choices", {
  id: uuid("id").primaryKey().defaultRandom(),
  questionId: uuid("question_id")
    .references(() => valueQuestions.id, { onDelete: "cascade" })
    .notNull(),
  choiceText: varchar("choice_text", { length: 200 }).notNull(),
  choiceOrder: integer("choice_order").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * スキルテーブル
 * ER図の Skills に対応
 */
export const skills = pgTable("skills", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  creatorType: text("creator_type").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * カテゴリテーブル
 * ER図の Categories に対応
 */
export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * ジャンルテーブル
 * ER図の Genres に対応
 */
export const genres = pgTable("genres", {
  id: uuid("id").primaryKey().defaultRandom(),
  categoryId: uuid("category_id")
    .references(() => categories.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// 作品サイズのEnum定義
export const workSizeEnum = pgEnum("work_size", [
  "small",
  "medium",
  "large",
  "extra_large",
]);

/**
 * 作品テーブル
 * ER図の Works に対応
 */
export const works = pgTable("works", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  categoryId: uuid("category_id")
    .references(() => categories.id)
    .notNull(),
  genreId: uuid("genre_id").references(() => genres.id),
  officialUrl: text("official_url"),
  creatorType: text("creator_type").notNull(),
  userProfileId: uuid("user_profile_id").references(() => userProfiles.id),
  size: workSizeEnum("size"),
  releaseYear: integer("release_year"),
  aiCommentScore: integer("ai_comment_score"),
  callCount: integer("call_count").default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// リストタイプEnum定義
export const listTypeEnum = pgEnum("list_type", [
  "公式リスト",
  "ユーザーリスト",
]);

/**
 * リストテーブル
 * ER図の Lists に対応
 */
export const lists = pgTable("lists", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  creatorType: text("creator_type").notNull(),
  userProfileId: uuid("user_profile_id").references(() => userProfiles.id),
  isPublic: boolean("is_public").notNull().default(true),
  listType: listTypeEnum("list_type").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * ユーザープロフィール 価値観選択テーブル（修正版）
 * ER図の UserProfile_SelectedValues に完全対応
 */
export const userProfileValues = pgTable(
  "user_profile_values",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userProfileId: uuid("user_profile_id")
      .references(() => userProfiles.id, { onDelete: "cascade" })
      .notNull(),
    valueQuestionId: uuid("value_question_id")
      .references(() => valueQuestions.id, { onDelete: "cascade" })
      .notNull(),
    selectedChoiceId: uuid("selected_choice_id")
      .references(() => valueChoices.id, { onDelete: "cascade" })
      .notNull(),
    valueCategory: varchar("value_category", { length: 50 }).notNull(),
    evaluatorProfileId: uuid("evaluator_profile_id").references(
      () => userProfiles.id,
    ), // NULL = 本人評価
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    uniqueUserProfileValue: unique().on(
      table.userProfileId,
      table.valueQuestionId,
      table.valueCategory,
      table.evaluatorProfileId,
    ),
  }),
);

// displayType のEnum定義（スキル表示方法用）
export const displayTypeEnum = pgEnum("display_type", ["list", "mandala"]);

/**
 * ユーザープロフィール スキルテーブル（修正版）
 * ER図の UserProfile_Skills に完全対応
 */
export const userProfileSkills = pgTable(
  "user_profile_skills",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userProfileId: uuid("user_profile_id")
      .references(() => userProfiles.id, { onDelete: "cascade" })
      .notNull(),
    skillId: uuid("skill_id")
      .references(() => skills.id, { onDelete: "cascade" })
      .notNull(),
    skillLevel: integer("skill_level"), // ER図に合わせて修正
    collaborationDesire: integer("collaboration_desire"), // 0-5の一緒に仕事をしたい度
    displayType: displayTypeEnum("display_type").notNull().default("list"),
    mandalaPosition: integer("mandala_position"), // 1-9のマンダラチャートでの位置
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    uniqueUserProfileSkill: unique().on(table.userProfileId, table.skillId),
  }),
);

/**
 * ユーザープロフィール 好きな作品テーブル（修正版）
 * ER図の UserProfile_FavoriteWorks に完全対応
 */
export const userProfileFavoriteWorks = pgTable(
  "user_profile_favorite_works",
  {
    userProfileId: uuid("user_profile_id")
      .references(() => userProfiles.id, { onDelete: "cascade" })
      .notNull(),
    workId: uuid("work_id")
      .references(() => works.id, { onDelete: "cascade" })
      .notNull(),
    category: favoriteWorkCategoryEnum("category").notNull(),
    evaluationTier: text("evaluation_tier"), // ER図のフィールド
    tierRating: tierRatingEnum("tier_rating"),
    myEvaluation: integer("my_evaluation"), // 0-5の評価
    timeSegment: text("time_segment"), // ER図のフィールド
    reactionType: text("reaction_type"), // ER図のフィールド
    personalNote: text("personal_note"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    // 複合主キー（ER図に合わせて）
    pk: primaryKey({ columns: [table.userProfileId, table.workId] }),
    uniqueUserProfileFavoriteWork: unique().on(
      table.userProfileId,
      table.workId,
      table.category,
    ),
  }),
);

/**
 * ユーザープロフィール スキル評価テーブル（修正版）
 * ER図の UserProfile_SkillEvaluations に完全対応
 */
export const userProfileSkillEvaluations = pgTable(
  "user_profile_skill_evaluations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    evaluatedProfileId: uuid("evaluated_profile_id")
      .references(() => userProfiles.id, { onDelete: "cascade" })
      .notNull(),
    evaluatorProfileId: uuid("evaluator_profile_id")
      .references(() => userProfiles.id, { onDelete: "cascade" })
      .notNull(),
    skillId: uuid("skill_id")
      .references(() => skills.id, { onDelete: "cascade" })
      .notNull(),
    levelEvaluation: integer("level_evaluation").notNull(), // 0-5の評価
    collaborationDesire: integer("collaboration_desire").notNull(), // 0-5の一緒に仕事をしたい度
    evaluationComment: text("evaluation_comment"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    uniqueSkillEvaluation: unique().on(
      table.evaluatedProfileId,
      table.evaluatorProfileId,
      table.skillId,
    ),
  }),
);

/**
 * ユーザープロフィール マンダラチャートテーブル
 */
export const userProfileMandalaCharts = pgTable("user_profile_mandala_charts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userProfileId: uuid("user_profile_id")
    .references(() => userProfiles.id, { onDelete: "cascade" })
    .notNull(),
  chartName: varchar("chart_name", { length: 100 })
    .notNull()
    .default("デフォルトチャート"),
  centerGoal: varchar("center_goal", { length: 200 }).notNull(),
  position1: varchar("position_1", { length: 200 }), // 下
  position2: varchar("position_2", { length: 200 }), // 左
  position3: varchar("position_3", { length: 200 }), // 上
  position4: varchar("position_4", { length: 200 }), // 右
  position5: varchar("position_5", { length: 200 }), // 左下
  position6: varchar("position_6", { length: 200 }), // 左上
  position7: varchar("position_7", { length: 200 }), // 右上
  position8: varchar("position_8", { length: 200 }), // 右下
  markdownContent: text("markdown_content"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * ユーザープロフィール リスト選択テーブル
 */
export const userProfileLists = pgTable(
  "user_profile_lists",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userProfileId: uuid("user_profile_id")
      .references(() => userProfiles.id, { onDelete: "cascade" })
      .notNull(),
    listId: uuid("list_id").notNull(), // lists テーブルへの参照
    listType: listTypeEnum("list_type").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    uniqueUserProfileList: unique().on(table.userProfileId, table.listId),
  }),
);

/**
 * 相互フォローテーブル
 * Seeds で参照されているテーブルを追加
 */
export const mutualFollows = pgTable(
  "mutual_follows",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    followerRootAccountId: uuid("follower_root_account_id")
      .references(() => rootAccounts.id, { onDelete: "cascade" })
      .notNull(),
    followingRootAccountId: uuid("following_root_account_id")
      .references(() => rootAccounts.id, { onDelete: "cascade" })
      .notNull(),
    isMutual: boolean("is_mutual").notNull().default(false),
    followedAt: timestamp("followed_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    uniqueMutualFollow: unique().on(
      table.followerRootAccountId,
      table.followingRootAccountId,
    ),
  }),
);

/**
 * ユーザープロフィール 価値観評価テーブル
 * 他人による価値観評価を管理
 */
export const userProfileValueEvaluations = pgTable(
  "user_profile_value_evaluations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    evaluatedProfileId: uuid("evaluated_profile_id")
      .references(() => userProfiles.id, { onDelete: "cascade" })
      .notNull(),
    evaluatorProfileId: uuid("evaluator_profile_id")
      .references(() => userProfiles.id, { onDelete: "cascade" })
      .notNull(),
    valueQuestionId: uuid("value_question_id")
      .references(() => valueQuestions.id, { onDelete: "cascade" })
      .notNull(),
    selectedChoiceId: uuid("selected_choice_id")
      .references(() => valueChoices.id, { onDelete: "cascade" })
      .notNull(),
    evaluationComment: text("evaluation_comment"), // 評価コメント
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    uniqueValueEvaluation: unique().on(
      table.evaluatedProfileId,
      table.evaluatorProfileId,
      table.valueQuestionId,
    ),
  }),
);
