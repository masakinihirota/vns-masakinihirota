import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";

import * as schema from "./schema.postgres";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type User = InferSelectModel<typeof schema.users>;
export type NewUser = InferInsertModel<typeof schema.users>;

export type RootAccount = InferSelectModel<typeof schema.rootAccounts>;
export type NewRootAccount = InferInsertModel<typeof schema.rootAccounts>;

export type UserProfile = InferSelectModel<typeof schema.userProfiles>;
export type NewUserProfile = InferInsertModel<typeof schema.userProfiles>;

export type BusinessCard = InferSelectModel<typeof schema.businessCards>;
export type NewBusinessCard = InferInsertModel<typeof schema.businessCards>;

export type Alliance = InferSelectModel<typeof schema.alliances>;
export type NewAlliance = InferInsertModel<typeof schema.alliances>;

export type Group = InferSelectModel<typeof schema.groups>;
export type NewGroup = InferInsertModel<typeof schema.groups>;

export type GroupMember = InferSelectModel<typeof schema.groupMembers>;
export type NewGroupMember = InferInsertModel<typeof schema.groupMembers>;

export type Work = InferSelectModel<typeof schema.works>;
export type NewWork = InferInsertModel<typeof schema.works>;

export type UserWorkRating = InferSelectModel<typeof schema.userWorkRatings>;
export type NewUserWorkRating = InferInsertModel<typeof schema.userWorkRatings>;

export type UserWorkEntry = InferSelectModel<typeof schema.userWorkEntries>;
export type NewUserWorkEntry = InferInsertModel<typeof schema.userWorkEntries>;

export type Event = InferSelectModel<typeof schema.nationEvents>;
export type NewEvent = InferInsertModel<typeof schema.nationEvents>;

export type Nation = InferSelectModel<typeof schema.nations>;
export type NewNation = InferInsertModel<typeof schema.nations>;

export type MarketItem = InferSelectModel<typeof schema.marketItems>;
export type NewMarketItem = InferInsertModel<typeof schema.marketItems>;

export type MarketTransaction = InferSelectModel<typeof schema.marketTransactions>;
export type NewMarketTransaction = InferInsertModel<typeof schema.marketTransactions>;

export type Notification = InferSelectModel<typeof schema.notifications>;
export type NewNotification = InferInsertModel<typeof schema.notifications>;

export type NationPost = InferSelectModel<typeof schema.nationPosts>;
export type NewNationPost = InferInsertModel<typeof schema.nationPosts>;

export type Follow = InferSelectModel<typeof schema.follows>;
export type NewFollow = InferInsertModel<typeof schema.follows>;

export type Penalty = InferSelectModel<typeof schema.penalties>;
export type NewPenalty = InferInsertModel<typeof schema.penalties>;

export type Approval = InferSelectModel<typeof schema.approvals>;
export type NewApproval = InferInsertModel<typeof schema.approvals>;

export type AuditLog = InferSelectModel<typeof schema.auditLogs>;
export type NewAuditLog = InferInsertModel<typeof schema.auditLogs>;

export type AdminDashboardCache = InferSelectModel<typeof schema.adminDashboardCache>;
export type NewAdminDashboardCache = InferInsertModel<typeof schema.adminDashboardCache>;

export type UserPreference = InferSelectModel<typeof schema.userPreferences>;
export type NewUserPreference = InferInsertModel<typeof schema.userPreferences>;

export type SessionToken = InferSelectModel<typeof schema.sessionTokens>;
export type NewSessionToken = InferInsertModel<typeof schema.sessionTokens>;

export type TwoFactorSecret = InferSelectModel<typeof schema.twoFactorSecrets>;
export type NewTwoFactorSecret = InferInsertModel<typeof schema.twoFactorSecrets>;

export type RateLimitKey = InferSelectModel<typeof schema.rateLimitKeys>;
export type NewRateLimitKey = InferInsertModel<typeof schema.rateLimitKeys>;

export type FeatureFlag = InferSelectModel<typeof schema.featureFlags>;
export type NewFeatureFlag = InferInsertModel<typeof schema.featureFlags>;
