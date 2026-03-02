/**
 * Query Logger & Performance Monitor
 *
 * Tracks database query execution, identifies N+1 patterns,
 * and provides performance metrics for optimization.
 *
 * @file src/lib/db/query-logger.ts
 * @version 1.0
 * @lastUpdated 2026-03-03
 */

import { performance } from "perf_hooks";

/**
 * Query execution log entry
 */
export interface QueryLogEntry {
  id: string;
  timestamp: number;
  query: string;
  operationType: "select" | "insert" | "update" | "delete" | "transaction";
  duration: number; // milliseconds
  rowCount?: number;
  error?: string;
  stack?: string;
}

/**
 * Performance metrics aggregation
 */
export interface PerformanceMetrics {
  totalQueries: number;
  totalDuration: number;
  averageDuration: number;
  slowQueries: QueryLogEntry[];
  n1Patterns: N1Pattern[];
  queryByType: Record<string, number>;
  slowestQueries: Array<{ query: string; duration: number; count: number }>;
}

/**
 * N+1 query pattern detected
 */
export interface N1Pattern {
  query: string;
  count: number;
  totalDuration: number;
  averageDuration: number;
  instances: QueryLogEntry[];
}

/**
 * QueryLogger - Singleton for tracking all database operations
 */
class QueryLogger {
  private logs: QueryLogEntry[] = [];
  private slowQueryThreshold = 100; // ms
  private n1PatternThreshold = 5; // same query count
  private maxLogs = 10000; // prevent memory leak

  /**
   * Record a query execution
   */
  public record(
    query: string,
    duration: number,
    operationType: "select" | "insert" | "update" | "delete" | "transaction" = "select",
    rowCount?: number,
    error?: Error
  ): void {
    const entry: QueryLogEntry = {
      id: this.generateId(),
      timestamp: Date.now(),
      query,
      operationType,
      duration,
      rowCount,
      error: error?.message,
      stack: error?.stack,
    };

    this.logs.push(entry);

    // Prevent memory leak
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Log slow queries in development
    if (process.env.NODE_ENV === "development" && duration > this.slowQueryThreshold) {
      console.warn(
        `[SLOW_QUERY] ${query.substring(0, 80)}... (${duration.toFixed(2)}ms)`
      );
    }
  }

  /**
   * Execute function with automatic logging
   */
  public async executeWithLogging<T>(
    fn: () => Promise<T>,
    query: string,
    operationType: "select" | "insert" | "update" | "delete" | "transaction" = "select"
  ): Promise<T> {
    const start = performance.now();

    try {
      const result = await fn();
      const duration = performance.now() - start;

      this.record(query, duration, operationType);

      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.record(
        query,
        duration,
        operationType,
        undefined,
        error instanceof Error ? error : new Error(String(error))
      );

      throw error;
    }
  }

  /**
   * Get all query logs
   */
  public getLogs(limit?: number): QueryLogEntry[] {
    if (limit) {
      return this.logs.slice(-limit);
    }
    return [...this.logs];
  }

  /**
   * Get performance metrics
   */
  public getMetrics(): PerformanceMetrics {
    const slowQueries = this.logs.filter(
      (log) => log.duration > this.slowQueryThreshold
    );

    const queryByType = this.logs.reduce(
      (acc, log) => {
        acc[log.operationType] = (acc[log.operationType] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // Group queries by text to find N+1 patterns
    const groupedQueries = this.logs.reduce(
      (acc, log) => {
        if (!acc[log.query]) {
          acc[log.query] = [];
        }
        acc[log.query].push(log);
        return acc;
      },
      {} as Record<string, QueryLogEntry[]>
    );

    const n1Patterns: N1Pattern[] = Object.entries(groupedQueries)
      .filter(([_, entries]) => entries.length >= this.n1PatternThreshold)
      .map(([query, entries]) => ({
        query,
        count: entries.length,
        totalDuration: entries.reduce((sum, e) => sum + e.duration, 0),
        averageDuration: entries.reduce((sum, e) => sum + e.duration, 0) / entries.length,
        instances: entries,
      }))
      .sort((a, b) => b.count - a.count);

    // Find slowest queries
    const slowestQueries = Object.entries(groupedQueries)
      .map(([query, entries]) => ({
        query: query.substring(0, 100),
        duration: entries.reduce((sum, e) => sum + e.duration, 0) / entries.length,
        count: entries.length,
      }))
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 10);

    return {
      totalQueries: this.logs.length,
      totalDuration: this.logs.reduce((sum, log) => sum + log.duration, 0),
      averageDuration: this.logs.length > 0
        ? this.logs.reduce((sum, log) => sum + log.duration, 0) / this.logs.length
        : 0,
      slowQueries,
      n1Patterns,
      queryByType,
      slowestQueries,
    };
  }

  /**
   * Clear all logs
   */
  public clear(): void {
    this.logs = [];
  }

  /**
   * Reset metrics
   */
  public reset(): void {
    this.clear();
  }

  /**
   * Generate unique ID for log entry
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }

  /**
   * Set slow query threshold (in milliseconds)
   */
  public setSlowQueryThreshold(milliseconds: number): void {
    this.slowQueryThreshold = milliseconds;
  }

  /**
   * Set N+1 pattern detection threshold
   */
  public setN1PatternThreshold(count: number): void {
    this.n1PatternThreshold = count;
  }

  /**
   * Print formatted metrics report
   */
  public printReport(): void {
    const metrics = this.getMetrics();

    console.log("\n📊 === DATABASE PERFORMANCE REPORT === 📊");
    console.log(`  Total Queries: ${metrics.totalQueries}`);
    console.log(`  Total Duration: ${metrics.totalDuration.toFixed(2)}ms`);
    console.log(`  Average Duration: ${metrics.averageDuration.toFixed(2)}ms`);

    console.log("\n📈 Queries by Type:");
    Object.entries(metrics.queryByType).forEach(([type, count]) => {
      console.log(`  ${type.padEnd(12)}: ${count}`);
    });

    if (metrics.slowQueries.length > 0) {
      console.log("\n🐌 Top Slow Queries:");
      metrics.slowestQueries.slice(0, 5).forEach((q) => {
        console.log(`  ${q.duration.toFixed(2)}ms (${q.count}x) ${q.query}`);
      });
    }

    if (metrics.n1Patterns.length > 0) {
      console.log("\n⚠️  N+1 Query Patterns Detected:");
      metrics.n1Patterns.forEach((pattern) => {
        console.log(
          `  ${pattern.count}x "${pattern.query.substring(0, 60)}..." (${pattern.totalDuration.toFixed(2)}ms)`
        );
      });
    } else {
      console.log("\n✅ No N+1 patterns detected!");
    }
    console.log("\n");
  }

  /**
   * Export metrics as JSON
   */
  public exportMetrics(): string {
    return JSON.stringify(this.getMetrics(), null, 2);
  }
}

// Singleton instance
export const queryLogger = new QueryLogger();

/**
 * Middleware wrapper for Drizzle queries
 * Usage: const result = await executeWithLogging(() => db.query.users.findMany(), "SELECT users");
 */
export async function executeWithLogging<T>(
  fn: () => Promise<T>,
  label: string,
  operationType: "select" | "insert" | "update" | "delete" | "transaction" = "select"
): Promise<T> {
  return queryLogger.executeWithLogging(fn, label, operationType);
}

/**
 * Manual logging for complex queries
 */
export function logQuery(
  query: string,
  duration: number,
  operationType: "select" | "insert" | "update" | "delete" | "transaction" = "select"
): void {
  queryLogger.record(query, duration, operationType);
}

/**
 * Get current metrics
 */
export function getMetrics(): PerformanceMetrics {
  return queryLogger.getMetrics();
}

/**
 * Clear all logs
 */
export function clearLogs(): void {
  queryLogger.clear();
}

/**
 * Print formatted report
 */
export function printReport(): void {
  queryLogger.printReport();
}

/**
 * Export metrics as JSON string
 */
export function exportMetrics(): string {
  return queryLogger.exportMetrics();
}
