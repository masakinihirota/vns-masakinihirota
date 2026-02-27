/**
 * アプリケーション全体で使用するルート定数
 *
 * @description
 * すべてのパス定義をここに集約することで:
 * - タイポを防ぐ
 * - リファクタリングを容易にする
 * - 一貫性を保つ
 * - TypeScriptの型サポートを活用する
 *
 * @example
 * import { ROUTES, PUBLIC_PATHS } from '@/config/routes';
 *
 * // ルート使用例
 * <Link href={ROUTES.LOGIN}>ログイン</Link>
 *
 * // 公開パスチェック
 * const isPublic = PUBLIC_PATHS.includes(pathname);
 *
 * @module config/routes
 */

/**
 * アプリケーションルート
 * @const
 */
export const ROUTES = {
  /** ランディングページ（誰でもアクセス可能） */
  LANDING: '/',

  /** ログインページ */
  LOGIN: '/login',

  /** サインアップページ */
  SIGNUP: '/signup',

  /** 認証済みユーザーのホーム */
  HOME: '/home',

  /** 管理者専用ページ */
  ADMIN: '/admin',

  /** FAQ（静的ページ） */
  FAQ: '/faq',

  /** ヘルプ（静的ページ） */
  HELP: '/help',

  /** 404ページ */
  NOT_FOUND: '/_not-found',
} as const;

/**
 * 公開ページ（未認証でもアクセス可能）
 */
export const PUBLIC_PATHS = [
  ROUTES.LOGIN,
  ROUTES.SIGNUP,
] as const;

/**
 * 保護されたページ（認証必須）
 */
export const PROTECTED_PATHS = [
  ROUTES.HOME,
  ROUTES.ADMIN,
] as const;

/**
 * 管理者専用ページ
 */
export const ADMIN_PATHS = [
  ROUTES.ADMIN,
] as const;

/**
 * 静的ページ（認証不要、SEO対象）
 */
export const STATIC_PATHS = [
  ROUTES.LANDING,
  ROUTES.FAQ,
  ROUTES.HELP,
] as const;

/**
 * API Routes
 */
export const API_ROUTES = {
  /** Better Auth API */
  AUTH: '/api/auth',
} as const;

/**
 * 型定義
 */
export type Route = typeof ROUTES[keyof typeof ROUTES];
export type PublicPath = typeof PUBLIC_PATHS[number];
export type ProtectedPath = typeof PROTECTED_PATHS[number];
export type AdminPath = typeof ADMIN_PATHS[number];
export type StaticPath = typeof STATIC_PATHS[number];
