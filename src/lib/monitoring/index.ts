/**
 * Monitoring Module
 *
 * @description
 * パフォーマンス監視とメトリクス収集のエントリーポイント
 *
 * @usage
 * import { measurePerformance, measureQuery, metricsCollector } from "@/lib/monitoring";
 *
 * // パフォーマンス計測
 * await measurePerformance("myFunction", async () => {
 *   // 処理
 * });
 *
 * // データベースクエリ計測
 * await measureQuery("users.findMany", () => db.query.users.findMany());
 *
 * // メトリクス記録
 * metricsCollector.record("api.response.time", responseTime, { endpoint: "/api/users" });
 */

export {
  measurePerformance,
  measureQuery,
  metricsCollector,
  spanManager,
  withPerformanceTracking,
  type Span,
  type SpanEvent,
} from "./performance";
