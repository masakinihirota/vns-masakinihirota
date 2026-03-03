/**
 * Errors Module
 *
 * @description
 * エラーハンドリングの中心モジュール
 *
 * @usage
 * import { AuthenticationError, getUserMessage } from "@/lib/errors";
 *
 * // エラーをスロー
 * throw new AuthenticationError("Invalid credentials", ErrorCodes.AUTH_INVALID_CREDENTIALS, {
 *   userId: user.id
 * });
 *
 * // エラーメッセージを取得
 * const message = getUserMessage(ErrorCodes.AUTH_INVALID_CREDENTIALS);
 */

export {
  AppError,
  AuthenticationError,
  AuthorizationError,
  ConflictError,
  DatabaseError,
  ErrorCodes,
  ExternalServiceError,
  isAppError,
  NotFoundError,
  SystemError,
  toAppError,
  ValidationError,
  type ErrorCode,
} from "./app-error";

export {
  ERROR_MESSAGES,
  getErrorMessage,
  getSuggestion,
  getTechnicalMessage,
  getUserMessage,
  type ErrorMessage,
} from "./messages";

export {
  withAuth,
  withErrorHandling,
  withValidation,
  type ActionResult,
} from "./server-action-handler";
