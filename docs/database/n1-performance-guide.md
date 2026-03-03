# N+1 Query Detection & Performance Measurement Guide

> **バージョン**: 1.0
> **更新日**: 2026-03-03
> **対象**: VNS Masakinihirota Database Performance Optimization

## 概要

N+1 クエリ問題（1 つのメインクエリのあと、その結果ごとに N 件の追加クエリが実行される）を検出し、パフォーマンスを最適化するためのガイドです。

---

## N+1 クエリとは

### 悪い例（N+1）:

```typescript
// 1 つのクエリ: グループ一覧を取得
const groups = await db.select().from(groups).limit(10);
// ↓ 結果: 10 件のグループ

// N 個のクエリ: 各グループのメンバー数を取得
for (const group of groups) {
  const memberCount = await db
    .select({ count: sql`COUNT(*)` })
    .from(groupMembers)
    .where(eq(groupMembers.groupId, group.id));
  // ↓ 合計: 10 + 1 = 11 クエリ!
}
```

**問題**: 11 回のデータベース往復 → 遅い (100ms ~ 数秒)

### 良い例（Eager Loading）:

```typescript
// 1 つのクエリ: グループ + メンバー数を一括取得
const groupsWithMembers = await db
  .select({
    group: groups,
    memberCount: sql`COUNT(${groupMembers.id})`,
  })
  .from(groups)
  .leftJoin(groupMembers, eq(groups.id, groupMembers.groupId))
  .groupBy(groups.id)
  .limit(10);
// ↓ 合計: 1 クエリ!
```

**利点**: 1 回のデータベース往復 → 高速 (1-5ms)

---

## Drizzle ORM での N+1 回避パターン

### パターン 1: `.with()` で関連テーブルを eager load

```typescript
import { db } from "@/lib/db";
import { groups } from "@/lib/db/schema.postgres";

//❌ N+1 パターン
const groups1 = await db.query.groups.findMany({ limit: 10 });
for (const group of groups1) {
  const members = await db.query.groupMembers.findMany({
    where: (fields, { eq }) => eq(fields.groupId, group.id),
  });
  // 11 クエリ実行!
}

// ✅ Eager load パターン
const groupsWithMembers = await db.query.groups.findMany({
  limit: 10,
  with: {
    members: true, // メンバーを eager load
    leader: true,  // リーダー情報も eager load
  },
});
// 1 クエリで完了!
```

### パターン 2: SQL JOIN で複数情報を一括取得

```typescript
import { db } from "@/lib/db";
import { groups, groupMembers, userProfiles } from "@/lib/db/schema.postgres";
import { sql, eq } from "drizzle-orm";

// グループ + メンバー数 + リーダー名を一括取得
const result = await db
  .select({
    groupId: groups.id,
    groupName: groups.name,
    memberCount: sql`COUNT(DISTINCT ${groupMembers.id})`,
    leaderName: userProfiles.displayName,
  })
  .from(groups)
  .leftJoin(groupMembers, eq(groups.id, groupMembers.groupId))
  .leftJoin(userProfiles, eq(groups.leaderId, userProfiles.id))
  .groupBy(groups.id, userProfiles.displayName)
  .limit(10);

// 1 クエリで group + member count + leader info を取得!
```

### パターン 3: Batch loading（複数 ID をまとめて処理）

```typescript
// ❌ 悪い: 各ユーザーごとにクエリ
for (const userId of userIds) {
  const user = await db.query.users.findFirst({
    where: (fields, { eq }) => eq(fields.id, userId),
  });
  // N クエリ!
}

// ✅ 良い: 全ユーザーを一度に取得
const users = await db.query.users.findMany({
  where: (fields, { inArray }) => inArray(fields.id, userIds),
});
// 1 クエリ!
```

---

## 自動 N+1 検出方法

### 方法 1: Drizzle Query Logging

```typescript
// drizzle.config.ts で logging を有効化
import { Config } from "drizzle-orm/config";

export default {
  schema: "./src/lib/db/schema.postgres.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  // ✅ ロギング有効化
  verbose: true,  // すべてのクエリをコンソール出力
  logger: true,   // Drizzle の Logger 使用
} satisfies Config;
```

### 方法 2: カスタムロギングミドルウェア

```typescript
// src/lib/db/query-logger.ts
import { sql } from "drizzle-orm";

interface QueryLog {
  timestamp: number;
  query: string;
  duration: number;
}

const queryLog: QueryLog[] = [];

/**
 * Execute query with timing and logging
 */
export async function executeWithLogging(
  query: Promise<any>,
  label: string = ""
) {
  const start = performance.now();

  try {
    const result = await query;
    const duration = performance.now() - start;

    queryLog.push({
      timestamp: Date.now(),
      query: label,
      duration,
    });

    // ⚠️ 警告: 100ms 以上かかったら警告
    if (duration > 100) {
      console.warn(
        `[SLOW_QUERY] ${label} took ${duration.toFixed(2)}ms`
      );
    }

    return result;
  } catch (error) {
    console.error(`[QUERY_ERROR] ${label}:`, error);
    throw error;
  }
}

export function getQueryLogs() {
  return queryLog;
}

export function detectN1Patterns() {
  const grouped = queryLog.reduce(
    (acc, log) => {
      if (!acc[log.query]) {
        acc[log.query] = [];
      }
      acc[log.query].push(log);
      return acc;
    },
    {} as Record<string, QueryLog[]>
  );

  const suspiciousPatterns = Object.entries(grouped)
    .filter(([_, logs]) => logs.length > 5) // 同じクエリが 5 回以上
    .map(([query, logs]) => ({
      query,
      count: logs.length,
      totalDuration: logs.reduce((sum, log) => sum + log.duration, 0),
    }));

  return suspiciousPatterns;
}
```

### 方法 3: テストで N+1 を検出

```typescript
// src/__tests__/performance/n1-queries.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { db } from "@/lib/db";
import {
  executeWithLogging,
  getQueryLogs,
  detectN1Patterns,
} from "@/lib/db/query-logger";

describe("N+1 Query Detection", () => {
  beforeEach(() => {
    // Clear logs before each test
    getQueryLogs().length = 0;
  });

  it("should not execute N+1 queries when loading groups with members", async () => {
    // ✅ Good: Single eager load query
    const groups = await executeWithLogging(
      db.query.groups.findMany({
        with: {
          members: true,
        },
        limit: 10,
      }),
      "groups_with_members"
    );

    const logs = getQueryLogs();
    expect(logs).toHaveLength(1); // Should be 1 query only
    expect(logs[0]?.duration).toBeLessThan(50); // Should be fast
  });

  it("should detect N+1 pattern in group selection", async () => {
    // ❌ Bad: This will create N+1 pattern
    const groups = await executeWithLogging(
      db.select().from(groups).limit(10),
      "groups_list"
    );

    // Then manually fetch members (simulating N+1)
    for (const group of groups) {
      await executeWithLogging(
        db.query.groupMembers.findMany({
          where: (fields, { eq }) => eq(fields.groupId, group.id),
        }),
        `members_for_group_${group.id}`
      );
    }

    const patterns = detectN1Patterns();
    expect(patterns.some((p) => p.count > 5)).toBe(true);
    console.warn("Detected N+1 pattern:", patterns);
  });
});
```

---

## パフォーマンス計測ガイド

### 方法 1: Node.js `performance` API

```typescript
import { performance } from "perf_hooks";

// クエリ実行時間を計測
const start = performance.now();

const users = await db.query.users.findMany({
  with: { profiles: true },
});

const end = performance.now();
const duration = end - start;

console.log(`Query took ${duration.toFixed(2)}ms`);
```

### 方法 2: PostgreSQL EXPLAIN ANALYZE

```bash
# ターミナルから実行
psql -d masakinihirota -c "
EXPLAIN ANALYZE
SELECT g.id, g.name, COUNT(gm.id) as member_count
FROM groups g
LEFT JOIN group_members gm ON g.id = gm.group_id
GROUP BY g.id
LIMIT 10;
"
```

出力例:
```
Seq Scan on groups g  (cost=0.00..20.50 rows=10)
  Planning Time: 0.042 ms
  Execution Time: 0.238 ms
```

### 方法 3: リアルタイムパフォーマンス監視

```typescript
// src/lib/db/performance-monitor.ts

export class PerformanceMonitor {
  private metrics: {
    queryCount: number;
    totalDuration: number;
    slowQueries: Array<{ query: string; duration: number }>;
  } = {
    queryCount: 0,
    totalDuration: 0,
    slowQueries: [],
  };

  record(query: string, duration: number) {
    this.metrics.queryCount++;
    this.metrics.totalDuration += duration;

    if (duration > 100) {
      this.metrics.slowQueries.push({ query, duration });
    }
  }

  getMetrics() {
    return {
      ...this.metrics,
      averageDuration: this.metrics.totalDuration / this.metrics.queryCount,
    };
  }

  reset() {
    this.metrics = {
      queryCount: 0,
      totalDuration: 0,
      slowQueries: [],
    };
  }
}

export const monitor = new PerformanceMonitor();
```

---

## チェックリスト

### 開発時のパフォーマンス確認

- [ ] すべてのリレーション取得に `.with()` を使用
- [ ] ループ内で１回限りのクエリ実行を避ける
- [ ] 複数 ID を取得する際は `inArray()` を使用
- [ ] ロギングを有効化して実際のクエリ数を確認
- [ ] 100ms 以上かかるクエリを特定して最適化

### Staging / 本番環境での確認

- [ ] PageSpeed Insights / Lighthouse で Core Web Vitals を測定
- [ ] データベースログで遅いクエリを特定
  ```bash
  SELECT query, mean_time, calls FROM pg_stat_statements
  ORDER BY mean_time DESC LIMIT 10;
  ```
- [ ] Connection pool が適切に設定されているか確認
- [ ] キャッシュ戦略（ブラウザキャッシュ、DB キャッシュ）を検証

---

## よくある場面での最適化パターン

### ユーザー一覧表示（ページネーション付き）

```typescript
// ✅ 最適な実装
const users = await db.query.users.findMany({
  limit: 20,
  offset: (page - 1) * 20,
  where: (fields, { lt }) => lt(fields.createdAt, since),
  orderBy: (fields, { desc }) => desc(fields.createdAt),
  with: {
    profile: true,
    settings: true,
  },
});

// 1 クエリで: ユーザー 20 件 + プロフィール + 設定を取得
```

### グループのフィード表示

```typescript
// ✅ 最適な実装
const feed = await db
  .select({
    groupId: groups.id,
    groupName: groups.name,
    postCount: sql`COUNT(DISTINCT ${posts.id})`,
    memberCount: sql`COUNT(DISTINCT ${groupMembers.id})`,
    latestPost: sql`MAX(${posts.createdAt})`,
  })
  .from(groups)
  .leftJoin(posts, eq(groups.id, posts.groupId))
  .leftJoin(groupMembers, eq(groups.id, groupMembers.groupId))
  .groupBy(groups.id, groups.name)
  .limit(20);

// 1 クエリで: グループ + 統計情報を取得
```

---

## トラブルシューティング

### 問題: 同じクエリが 10 回以上実行される

```typescript
// ❌ N+1 パターン検出
console.warn("Suspicious pattern found:", {
  query: "SELECT * FROM groups WHERE id = ?",
  count: 15,
  totalDuration: "234ms"
});

// ✅ 修正: Batch loading に変更
const groupIds = [1, 2, 3, 4, 5];
const groups = await db.query.groups.findMany({
  where: (fields, { inArray }) => inArray(fields.id, groupIds),
});
```

### 問題: クエリが 1 秒以上かかる

```typescript
// EXPLAIN ANALYZE で実行計画を確認
EXPLAIN ANALYZE
SELECT * FROM audit_logs
WHERE created_at > NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;

// インデックス不足の可能性
// → drizzle.config.ts に index 定義を追加
```

---

## 参考リンク

- [Drizzle ORM Relations & Eager Loading](https://orm.drizzle.team/docs/rqb#select-from-multiple-tables)
- [PostgreSQL EXPLAIN Documentation](https://www.postgresql.org/docs/current/sql-explain.html)
- [Core Web Vitals Guide](https://web.dev/vitals/)
- [Database Performance Tuning](./migration-naming-strategy.md)

---

## サポート

パフォーマンス問題が発生した場合：

1. **ロギング**: query-logger.ts で詳細ログを取得
2. **分析**: EXPLAIN ANALYZE で実行計画を確認
3. **フィックス**: N+1 パターンを eager load に変更
4. **検証**: テストで回帰を防止
5. **相談**: Slack #database-performance で共有

