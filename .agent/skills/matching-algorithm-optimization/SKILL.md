---
description: マッチングアルゴリズムの最適化とパフォーマンスチューニング
---

# Matching Algorithm Optimization Skill

## 概要

このスキルは、VNS masakinihirotaプロジェクトのコア機能である**価値観マッチングアルゴリズム**の最適化とパフォーマンスチューニングに関するベストプラクティスを提供します。

## 適用タイミング

以下の場合にこのスキルを使用してください:

- マッチングアルゴリズムの実装または改善時
- マッチング処理のパフォーマンス問題が発生した時
- ユーザー数の増加に伴うスケーラビリティ対策時
- マッチング精度の向上が必要な時

## マッチングアルゴリズムの基本原則

### 1. ベクトル類似度計算

価値観マッチングは、ユーザーの価値観をベクトルとして表現し、類似度を計算します。

#### コサイン類似度（推奨）

```typescript
/**
 * コサイン類似度を計算
 * @param vectorA ユーザーAの価値観ベクトル
 * @param vectorB ユーザーBの価値観ベクトル
 * @returns 類似度 (0-1)
 */
function cosineSimilarity(vectorA: number[], vectorB: number[]): number {
  if (vectorA.length !== vectorB.length) {
    throw new Error("Vectors must have the same length");
  }

  const dotProduct = vectorA.reduce((sum, a, i) => sum + a * vectorB[i], 0);
  const magnitudeA = Math.sqrt(vectorA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vectorB.reduce((sum, b) => sum + b * b, 0));

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / (magnitudeA * magnitudeB);
}
```

**利点**:

- ベクトルの大きさに依存しない
- 方向性（価値観の傾向）を重視
- 計算効率が良い

#### ユークリッド距離

```typescript
/**
 * ユークリッド距離を計算（類似度に変換）
 * @param vectorA ユーザーAの価値観ベクトル
 * @param vectorB ユーザーBの価値観ベクトル
 * @returns 類似度 (0-1)
 */
function euclideanSimilarity(vectorA: number[], vectorB: number[]): number {
  const distance = Math.sqrt(
    vectorA.reduce((sum, a, i) => sum + Math.pow(a - vectorB[i], 2), 0)
  );

  // 距離を類似度に変換（0-1の範囲）
  const maxDistance = Math.sqrt(vectorA.length * Math.pow(5, 2)); // 最大距離（5段階評価の場合）
  return 1 - distance / maxDistance;
}
```

**利点**:

- 直感的
- 絶対的な差を重視

### 2. 重み付けマッチング

価値観カテゴリごとに重みを設定し、重要度を反映します。

```typescript
interface ValueCategory {
  id: string;
  name: string;
  weight: number; // 0-1の範囲
  values: number[]; // 各価値観の評価値
}

/**
 * 重み付きコサイン類似度を計算
 */
function weightedCosineSimilarity(
  categoriesA: ValueCategory[],
  categoriesB: ValueCategory[]
): number {
  let totalSimilarity = 0;
  let totalWeight = 0;

  for (let i = 0; i < categoriesA.length; i++) {
    const catA = categoriesA[i];
    const catB = categoriesB[i];

    if (catA.weight === 0) continue; // 無効なカテゴリはスキップ

    const similarity = cosineSimilarity(catA.values, catB.values);
    totalSimilarity += similarity * catA.weight;
    totalWeight += catA.weight;
  }

  return totalWeight > 0 ? totalSimilarity / totalWeight : 0;
}
```

### 3. PostgreSQLでのベクトル検索最適化

#### pgvector拡張の使用

```sql
-- pgvector拡張をインストール
CREATE EXTENSION IF NOT EXISTS vector;

-- 価値観ベクトルを格納するテーブル
CREATE TABLE user_value_vectors (
  user_profile_id UUID PRIMARY KEY REFERENCES user_profiles(id),
  value_vector vector(100), -- 100次元ベクトル
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- IVFFlatインデックスを作成（高速な近似検索）
CREATE INDEX ON user_value_vectors
USING ivfflat (value_vector vector_cosine_ops)
WITH (lists = 100);

-- コサイン類似度で類似ユーザーを検索
SELECT
  user_profile_id,
  1 - (value_vector <=> $1::vector) AS similarity
FROM user_value_vectors
WHERE user_profile_id != $2
ORDER BY value_vector <=> $1::vector
LIMIT 20;
```

**パフォーマンスチューニング**:

- `lists`パラメータ: `sqrt(行数)`が目安
- 定期的な`VACUUM ANALYZE`実行
- インデックスの再構築（`REINDEX`）

## キャッシング戦略

### 1. Redisでのマッチング結果キャッシュ

```typescript
import { Redis } from "ioredis";

const redis = new Redis(process.env.REDIS_URL);

/**
 * マッチング結果をキャッシュ
 */
async function cacheMatchingResults(
  userId: string,
  matches: MatchResult[],
  ttl: number = 3600 // 1時間
): Promise<void> {
  const key = `matching:${userId}`;
  await redis.setex(key, ttl, JSON.stringify(matches));
}

/**
 * キャッシュからマッチング結果を取得
 */
async function getCachedMatchingResults(
  userId: string
): Promise<MatchResult[] | null> {
  const key = `matching:${userId}`;
  const cached = await redis.get(key);
  return cached ? JSON.parse(cached) : null;
}

/**
 * キャッシュを無効化（価値観更新時）
 */
async function invalidateMatchingCache(userId: string): Promise<void> {
  const key = `matching:${userId}`;
  await redis.del(key);
}
```

### 2. 段階的キャッシュ戦略

```typescript
/**
 * 段階的マッチング処理
 * 1. キャッシュチェック
 * 2. 高速な近似検索（pgvector）
 * 3. 詳細な計算（必要な場合のみ）
 */
async function getMatches(userId: string): Promise<MatchResult[]> {
  // Step 1: キャッシュチェック
  const cached = await getCachedMatchingResults(userId);
  if (cached) {
    return cached;
  }

  // Step 2: pgvectorで近似検索（候補を絞る）
  const candidates = await findCandidatesWithPgVector(userId, 100);

  // Step 3: 詳細な計算（上位20件のみ）
  const detailedMatches = await calculateDetailedMatches(
    userId,
    candidates.slice(0, 20)
  );

  // キャッシュに保存
  await cacheMatchingResults(userId, detailedMatches);

  return detailedMatches;
}
```

## バッチ処理とリアルタイム処理

### バッチ処理（推奨）

```typescript
/**
 * 夜間バッチでマッチングスコアを事前計算
 */
async function batchCalculateMatchingScores(): Promise<void> {
  const users = await getAllActiveUsers();

  for (const user of users) {
    const matches = await calculateMatches(user.id);
    await savePrecomputedMatches(user.id, matches);
  }
}
```

**利点**:

- リアルタイムのレスポンス時間が短い
- データベース負荷を分散

**欠点**:

- 最新の価値観変更が即座に反映されない

### ハイブリッドアプローチ

```typescript
/**
 * ハイブリッドマッチング
 * - 事前計算された結果を基本とする
 * - 価値観更新後24時間以内のユーザーは再計算
 */
async function getHybridMatches(userId: string): Promise<MatchResult[]> {
  const user = await getUser(userId);
  const lastUpdate = user.values_updated_at;
  const hoursSinceUpdate = (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60);

  if (hoursSinceUpdate < 24) {
    // 最近更新されたユーザーはリアルタイム計算
    return await calculateMatchesRealtime(userId);
  } else {
    // それ以外は事前計算結果を使用
    return await getPrecomputedMatches(userId);
  }
}
```

## パフォーマンスメトリクス

### 監視すべき指標

1. **レスポンス時間**
   - 目標: p95 < 500ms
   - 測定: APM（Application Performance Monitoring）

2. **スループット**
   - 目標: 100 req/sec
   - 測定: サーバーメトリクス

3. **キャッシュヒット率**
   - 目標: > 80%
   - 測定: Redisメトリクス

4. **データベースクエリ時間**
   - 目標: < 100ms
   - 測定: PostgreSQLスロークエリログ

### モニタリングコード例

```typescript
import { performance } from "perf_hooks";

async function monitoredMatching(userId: string): Promise<MatchResult[]> {
  const start = performance.now();

  try {
    const results = await getMatches(userId);
    const duration = performance.now() - start;

    // メトリクス送信
    await sendMetric("matching.duration", duration, {
      userId,
      cacheHit: results.length > 0,
    });

    return results;
  } catch (error) {
    // エラーメトリクス
    await sendMetric("matching.error", 1, {
      userId,
      error: error.message,
    });
    throw error;
  }
}
```

## ベストプラクティス

### ✅ DO

- **pgvectorを使用**してベクトル検索を高速化
- **キャッシュ戦略**を実装してレスポンス時間を短縮
- **バッチ処理**で事前計算を行う
- **段階的計算**で必要な精度のみ計算
- **メトリクス監視**でパフォーマンスを追跡

### ❌ DON'T

- **全ユーザーとの類似度**をリアルタイムで計算しない
- **複雑な計算**をクライアントサイドで行わない
- **キャッシュなし**でマッチング結果を返さない
- **インデックスなし**でベクトル検索を行わない

## トラブルシューティング

### 問題: マッチング処理が遅い

**原因**:

- pgvectorインデックスが作成されていない
- キャッシュが機能していない
- 全ユーザーとの計算を行っている

**解決策**:

1. pgvectorインデックスを作成
2. Redisキャッシュを実装
3. 候補を絞ってから詳細計算

### 問題: マッチング精度が低い

**原因**:

- ベクトル正規化が不適切
- 重み付けが適切でない
- データの偏りがある

**解決策**:

1. ベクトル正規化を確認
2. カテゴリ重みを調整
3. データ分布を分析

## 参考資料

- [pgvector Documentation](https://github.com/pgvector/pgvector)
- [Cosine Similarity Explained](https://en.wikipedia.org/wiki/Cosine_similarity)
- [Redis Caching Best Practices](https://redis.io/docs/manual/patterns/)
