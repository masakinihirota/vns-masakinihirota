/**
 * Performance Monitoring
 *
 * @description
 * パフォーマンス測定・トレーシングのためのユーティリティ
 * - Server Actions の実行時間計測
 * - データベースクエリのトレース
 * - API呼び出しのレイテンシ記録
 */

import { logger } from "@/lib/logger";

/**
 * トレーススパンのインターフェース
 */
export interface Span {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  attributes?: Record<string, unknown>;
  events?: SpanEvent[];
}

export interface SpanEvent {
  name: string;
  timestamp: number;
  attributes?: Record<string, unknown>;
}

/**
 * アクティブなスパンを管理
 */
class SpanManager {
  private spans: Map<string, Span> = new Map();

  /**
   * 新しいスパンを開始
   */
  start(name: string, attributes?: Record<string, unknown>): string {
    const spanId = `span-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    const span: Span = {
      name,
      startTime: performance.now(),
      attributes,
      events: [],
    };

    this.spans.set(spanId, span);

    logger.debug(`Span started: ${name}`, { spanId, ...attributes });

    return spanId;
  }

  /**
   * スパンにイベントを追加
   */
  addEvent(
    spanId: string,
    eventName: string,
    attributes?: Record<string, unknown>
  ): void {
    const span = this.spans.get(spanId);
    if (!span) {
      logger.warn(`Span not found: ${spanId}`);
      return;
    }

    span.events?.push({
      name: eventName,
      timestamp: performance.now(),
      attributes,
    });
  }

  /**
   * スパンを終了
   */
  end(spanId: string, attributes?: Record<string, unknown>): Span | null {
    const span = this.spans.get(spanId);
    if (!span) {
      logger.warn(`Span not found: ${spanId}`);
      return null;
    }

    span.endTime = performance.now();
    span.duration = span.endTime - span.startTime;

    if (attributes) {
      span.attributes = { ...span.attributes, ...attributes };
    }

    // パフォーマンス警告
    if (span.duration > 1000) {
      logger.warn(`Slow operation detected: ${span.name}`, {
        duration: span.duration,
        spanId,
        ...span.attributes,
      });
    } else {
      logger.info(`Span completed: ${span.name}`, {
        duration: span.duration,
        spanId,
        ...span.attributes,
      });
    }

    this.spans.delete(spanId);
    return span;
  }

  /**
   * スパンを取得
   */
  get(spanId: string): Span | undefined {
    return this.spans.get(spanId);
  }
}

export const spanManager = new SpanManager();

/**
 * 関数の実行時間を計測
 *
 * @example
 * const result = await measurePerformance("fetchUsers", async () => {
 *   return await db.query.users.findMany();
 * }, { limit: 100 });
 */
export async function measurePerformance<T>(
  name: string,
  fn: () => Promise<T> | T,
  attributes?: Record<string, unknown>
): Promise<T> {
  const spanId = spanManager.start(name, attributes);

  try {
    const result = await fn();
    spanManager.end(spanId, { success: true });
    return result;
  } catch (error) {
    spanManager.end(spanId, {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

/**
 * Server Action用のパフォーマンス計測デコレータ
 *
 * @example
 * export const createPost = withPerformanceTracking(
 *   "createPost",
 *   async (data: PostData) => {
 *     return await db.insert(posts).values(data);
 *   }
 * );
 */
export function withPerformanceTracking<TArgs extends unknown[], TReturn>(
  name: string,
  fn: (...args: TArgs) => Promise<TReturn>
): (...args: TArgs) => Promise<TReturn> {
  return async (...args: TArgs): Promise<TReturn> => {
    return measurePerformance(name, () => fn(...args), {
      argsCount: args.length,
    });
  };
}

/**
 * データベースクエリ用のパフォーマンス計測
 *
 * @example
 * const users = await measureQuery("users.findMany", () =>
 *   db.query.users.findMany({ limit: 10 })
 * );
 */
export async function measureQuery<T>(
  queryName: string,
  queryFn: () => Promise<T>,
  params?: Record<string, unknown>
): Promise<T> {
  const spanId = spanManager.start(`db.query.${queryName}`, {
    type: "database",
    ...params,
  });

  try {
    const result = await queryFn();
    spanManager.end(spanId, { success: true });
    return result;
  } catch (error) {
    spanManager.end(spanId, {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

/**
 * メトリクス収集
 */
class MetricsCollector {
  private metrics: Map<string, number[]> = new Map();

  /**
   * メトリクスを記録
   */
  record(name: string, value: number, tags?: Record<string, string>): void {
    const key = this.getKey(name, tags);
    const values = this.metrics.get(key) || [];
    values.push(value);
    this.metrics.set(key, values);

    // 最新100件のみ保持（メモリ節約）
    if (values.length > 100) {
      values.shift();
    }
  }

  /**
   * 統計情報を取得
   */
  getStats(name: string, tags?: Record<string, string>): {
    count: number;
    min: number;
    max: number;
    avg: number;
    p50: number;
    p95: number;
    p99: number;
  } | null {
    const key = this.getKey(name, tags);
    const values = this.metrics.get(key);

    if (!values || values.length === 0) {
      return null;
    }

    const sorted = [...values].sort((a, b) => a - b);
    const count = sorted.length;

    return {
      count,
      min: sorted[0],
      max: sorted[count - 1],
      avg: sorted.reduce((a, b) => a + b, 0) / count,
      p50: sorted[Math.floor(count * 0.5)],
      p95: sorted[Math.floor(count * 0.95)],
      p99: sorted[Math.floor(count * 0.99)],
    };
  }

  /**
   * すべてのメトリクスをクリア
   */
  clear(): void {
    this.metrics.clear();
  }

  private getKey(name: string, tags?: Record<string, string>): string {
    if (!tags) return name;
    const tagString = Object.entries(tags)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}:${v}`)
      .join(",");
    return `${name}[${tagString}]`;
  }
}

export const metricsCollector = new MetricsCollector();
