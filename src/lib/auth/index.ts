/**
 * 認証関連のモジュールエクスポート
 *
 * このファイルは、認証関連の型定義、ヘルパー関数、ガード関数などを
 * 一箇所からエクスポートして、インポート文を簡潔にするためのファイルです。
 */

// 型定義
export type {
  DbUser,
  User,
  DbSession,
  Session,
  BetterAuthUser,
  RoleType,
  RelationshipType,
} from "./auth-types";

// 型ガード・変換関数
export {
  dbUserToUser,
  userToDbUser,
  isUser,
  isSession,
  isRoleType,
  isRelationshipType,
} from "./auth-types";

// エラー処理
export type { AuthErrorType, AuthErrorInfo } from "./auth-errors";
export {
  categorizeError,
  getOAuthErrorInfo,
  getAnonymousErrorInfo,
  formatErrorMessage,
  getSignatureValidationErrorInfo,
} from "./auth-errors";

// 認証機能定義
export {
  AUTH_METHOD_FEATURES,
  convertToAuthFeatures,
  getAuthFeatures,
} from "./auth-features";

// 認証階層
export type { AuthMethodType, AuthMethodInfo } from "./auth-hierarchy";
export {
  getAllAuthMethods,
  getActiveAuthMethod,
  hasAuthMethod,
  recordAuthMethod,
  removeAuthMethod,
  removeAllAuthMethods,
  updateAuthMethodLastUsed,
  getAuthState,
} from "./auth-hierarchy";

// ヘルパー関数
export {
  getSession,
  auth,
  getCurrentUser,
  getAuthMethodsForUser,
} from "./helper";

// ルートアカウントガード
export {
  hasRootAccount,
  getRootAccountId,
} from "./root-account-guard";

// RBAC権限チェックヘルパー（Server Action用）
export type {
  AuthSession,
  GroupRole,
  NationRole,
  AuthCheck,
  AuthCheckResult,
} from "./rbac-helper";

export {
  checkPlatformAdmin,
  checkGroupRole,
  checkNationRole,
  checkRelationship,
  checkMultiple,
} from "./rbac-helper";

// withAuth は別ファイルに分離されています
export { withAuth } from "./with-auth";
