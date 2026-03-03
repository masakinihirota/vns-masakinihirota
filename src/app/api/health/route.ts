/**
 * Health Check Endpoint
 *
 * @description
 * アプリケーションの健全性をチェックするエンドポイント
 * - データベース接続確認
 * - 外部サービス疎通確認
 * - システムメトリクス確認
 */

import { db } from "@/lib/db/client";
import { logger } from "@/lib/logger";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface HealthStatus {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  checks: {
    database: CheckResult;
    memory: CheckResult;
    uptime: CheckResult;
  };
  version?: string;
}

interface CheckResult {
  status: "pass" | "warn" | "fail";
  message?: string;
  value?: unknown;
  duration?: number;
}

/**
 * データベース接続チェック
 */
async function checkDatabase(): Promise<CheckResult> {
  const startTime = performance.now();

  try {
    // シンプルなクエリで接続確認
    await db.execute(sql`SELECT 1`);

    const duration = performance.now() - startTime;

    if (duration > 1000) {
      return {
        status: "warn",
        message: "Database connection is slow",
        duration,
      };
    }

    return {
      status: "pass",
      message: "Database connection is healthy",
      duration,
    };
  } catch (error) {
    const duration = performance.now() - startTime;
    logger.error("Database health check failed", error instanceof Error ? error : new Error(String(error)));

    return {
      status: "fail",
      message: error instanceof Error ? error.message : "Database connection failed",
      duration,
    };
  }
}

/**
 * メモリ使用量チェック
 */
function checkMemory(): CheckResult {
  if (typeof process === "undefined" || !process.memoryUsage) {
    return {
      status: "pass",
      message: "Memory check not available in this environment",
    };
  }

  const memUsage = process.memoryUsage();
  const heapUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
  const heapTotalMB = Math.round(memUsage.heapTotal / 1024 / 1024);
  const heapUsagePercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;

  if (heapUsagePercent > 90) {
    return {
      status: "fail",
      message: "Memory usage is critically high",
      value: { heapUsedMB, heapTotalMB, heapUsagePercent: Math.round(heapUsagePercent) },
    };
  }

  if (heapUsagePercent > 75) {
    return {
      status: "warn",
      message: "Memory usage is high",
      value: { heapUsedMB, heapTotalMB, heapUsagePercent: Math.round(heapUsagePercent) },
    };
  }

  return {
    status: "pass",
    message: "Memory usage is normal",
    value: { heapUsedMB, heapTotalMB, heapUsagePercent: Math.round(heapUsagePercent) },
  };
}

/**
 * アップタイムチェック
 */
function checkUptime(): CheckResult {
  if (typeof process === "undefined" || !process.uptime) {
    return {
      status: "pass",
      message: "Uptime check not available in this environment",
    };
  }

  const uptimeSeconds = process.uptime();
  const uptimeHours = Math.floor(uptimeSeconds / 3600);

  return {
    status: "pass",
    message: "Application is running",
    value: {
      uptimeSeconds: Math.round(uptimeSeconds),
      uptimeHours,
    },
  };
}

/**
 * GET /api/health
 */
export async function GET() {
  const timestamp = new Date().toISOString();

  try {
    // すべてのチェックを並列実行
    const [databaseCheck, memoryCheck, uptimeCheck] = await Promise.all([
      checkDatabase(),
      checkMemory(),
      checkUptime(),
    ]);

    const checks = {
      database: databaseCheck,
      memory: memoryCheck,
      uptime: uptimeCheck,
    };

    // 全体ステータスを判定
    let status: "healthy" | "degraded" | "unhealthy" = "healthy";

    if (
      databaseCheck.status === "fail" ||
      memoryCheck.status === "fail"
    ) {
      status = "unhealthy";
    } else if (
      databaseCheck.status === "warn" ||
      memoryCheck.status === "warn"
    ) {
      status = "degraded";
    }

    const health: HealthStatus = {
      status,
      timestamp,
      checks,
      version: process.env.NEXT_PUBLIC_APP_VERSION,
    };

    // unhealthyの場合はログに記録
    if (status === "unhealthy") {
      logger.error("Health check failed", new Error("System is unhealthy"), { health });
    } else if (status === "degraded") {
      logger.warn("Health check degraded", { health });
    }

    // ステータスコードを返す
    const statusCode = status === "healthy" ? 200 : status === "degraded" ? 200 : 503;

    return NextResponse.json(health, { status: statusCode });
  } catch (error) {
    logger.error("Health check error", error instanceof Error ? error : new Error(String(error)));

    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 }
    );
  }
}
