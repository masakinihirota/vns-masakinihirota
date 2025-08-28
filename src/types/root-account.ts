/**
 * ルートアカウント関連の型定義
 */

import { z } from "zod";

// Drizzleスキーマから推論される基本的なRootAccount型
export interface RootAccount {
  id: string;
  authUserId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  isVerified: boolean;
  motherTongueCode?: string | null;
  siteLanguageCode?: string | null;
  birthGeneration?: string | null;
  totalPoints: number;
  livingAreaSegment: "area1" | "area2" | "area3";
  warningCount: number;
  lastWarningAt?: Date | null;
  isAnonymousInitialAuth: boolean;
  invitedAt?: Date | null;
  confirmedAt?: Date | null;
  maxPoints: number;
  lastPointRecoveryAt?: Date | null;
  totalConsumedPoints: number;
  activityPoints: number;
  clickPoints: number;
  consecutiveDays: number;
  trustScore: number;
  oauthProviders: string[];
  oauthCount: number;
  accountStatus: "active" | "suspended" | "banned" | "pending";
}

// フォーム用のZodスキーマ
export const rootAccountFormSchema = z.object({
  isVerified: z.boolean().default(false),
  motherTongueCode: z.string().optional(),
  siteLanguageCode: z.string().optional(),
  birthGeneration: z.string().optional(),
  livingAreaSegment: z.enum(["area1", "area2", "area3"]).default("area1"),
  maxPoints: z.number().min(1).default(1000),
  accountStatus: z.enum(["active", "suspended", "banned", "pending"]).default("active"),
});

// フォームデータの型
export type RootAccountFormData = z.infer<typeof rootAccountFormSchema>;

// CRUD操作の結果型
export interface CrudResult<T = RootAccount> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// リスト表示用の型
export interface RootAccountListItem {
  id: string;
  authUserId: string;
  isVerified: boolean;
  totalPoints: number;
  accountStatus: RootAccount["accountStatus"];
  createdAt: Date;
  updatedAt: Date;
}

// 詳細表示用の型（全フィールドを含む）
export type RootAccountDetail = RootAccount;

// 作成用の型（IDやタイムスタンプを除く）
export type CreateRootAccountData = Omit<
  RootAccount,
  "id" | "createdAt" | "updatedAt" | "deletedAt"
>;

// 更新用の型（ID以外を更新可能）
export type UpdateRootAccountData = Partial<
  Omit<RootAccount, "id" | "createdAt" | "updatedAt" | "deletedAt">
>;

// Server Actions用の型
export interface RootAccountActionResult {
  success: boolean;
  data?: RootAccount | RootAccount[];
  error?: string;
  message?: string;
  fieldErrors?: Record<string, string[]>;
}
