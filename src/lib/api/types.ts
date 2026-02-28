/**
 * Hono RPC Type Export
 *
 * @description
 * - Hono RPC Client 用の型定義を明示的にエクスポート
 * - [[...route]] ディレクトリから型をre-exportすることで
 *   TypeScript の型推論を改善
 */

export type { AppType } from '@/app/api/[[...route]]/route';
