---
description: ソーシャルグラフの最適化とグラフクエリのパフォーマンスチューニング
---

# Social Graph Optimization Skill

## 概要

このスキルは、VNS masakinihirotaプロジェクトにおける**ソーシャルグラフ**（ユーザー間の関係性）の最適化とパフォーマンスチューニングに関するベストプラクティスを提供します。

## 適用タイミング

以下の場合にこのスキルを使用してください:

- フォロー/フォロワー機能の実装時
- グループメンバーシップの管理時
- 「友達の友達」推薦機能の実装時
- ソーシャルグラフのクエリが遅い時

## ソーシャルグラフのモデリング

### 1. 基本的なグラフ構造

```sql
-- フォロー関係テーブル
CREATE TABLE user_follows (
  follower_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  followee_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (follower_id, followee_id),
  CONSTRAINT no_self_follow CHECK (follower_id != followee_id)
);

-- インデックス（双方向検索を高速化）
CREATE INDEX idx_user_follows_follower ON user_follows(follower_id);
CREATE INDEX idx_user_follows_followee ON user_follows(followee_id);

-- グループメンバーシップ
CREATE TABLE group_members (
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (group_id, user_id)
);

CREATE INDEX idx_group_members_user ON group_members(user_id);
CREATE INDEX idx_group_members_group ON group_members(group_id);
```

### 2. セキュリティとRLS (Row Level Security)

`database-best-practices.md` に従い、必ずRLSを有効化してください。

```sql
-- テーブルのRLS有効化
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;

-- 1. 読み取りポリシー（例: 公開プロフィールは誰でも見れる）
CREATE POLICY "Public profiles are viewable by everyone" ON user_follows
  FOR SELECT USING (true);

-- 2. 作成ポリシー（自分自身のみがフォロー操作可能）
CREATE POLICY "Users can create their own follows" ON user_follows
  FOR INSERT WITH CHECK (auth.uid() = follower_id);

-- 3. 削除ポリシー（自分自身のみがフォロー解除可能）
CREATE POLICY "Users can delete their own follows" ON user_follows
  FOR DELETE USING (auth.uid() = follower_id);
```

### 3. 隣接リスト vs 隣接行列

**隣接リスト（推奨）**:

- スパースなグラフに適している
- ストレージ効率が良い
- PostgreSQLの標準的なアプローチ

```typescript
/**
 * フォロワーを取得（隣接リスト）
 */
async function getFollowers(userId: string): Promise<User[]> {
  return await db
    .select()
    .from(userProfiles)
    .innerJoin(
      userFollows,
      eq(userFollows.followerId, userProfiles.id)
    )
    .where(eq(userFollows.followeeId, userId));
}
```

**隣接行列**:

- 密なグラフに適している
- クエリが高速（特定のエッジの存在確認）
- ストレージ効率が悪い（N×N）

## PostgreSQLでのグラフクエリ最適化

### 1. 再帰CTE（Common Table Expression）

#### 友達の友達を取得

```sql
-- 2ホップ先のユーザーを取得
WITH RECURSIVE friend_network AS (
  -- ベースケース: 直接のフォロー
  SELECT
    followee_id AS user_id,
    1 AS depth
  FROM user_follows
  WHERE follower_id = $1

  UNION

  -- 再帰ケース: 友達の友達
  SELECT
    uf.followee_id,
    fn.depth + 1
  FROM friend_network fn
  JOIN user_follows uf ON uf.follower_id = fn.user_id
  WHERE fn.depth < 2 -- 最大2ホップ
)
SELECT DISTINCT user_id, depth
FROM friend_network
WHERE user_id != $1 -- 自分自身を除外
ORDER BY depth;
```

#### 共通フォロワーを取得

```sql
-- ユーザーAとユーザーBの共通フォロワー
SELECT follower_id
FROM user_follows
WHERE followee_id = $1 -- ユーザーA

INTERSECT

SELECT follower_id
FROM user_follows
WHERE followee_id = $2; -- ユーザーB
```

### 2. マテリアライズドビュー（Materialized View）

頻繁にアクセスされるグラフクエリを事前計算

```sql
-- フォロワー数とフォロー数を事前計算
CREATE MATERIALIZED VIEW user_follow_stats AS
SELECT
  up.id AS user_id,
  COALESCE(follower_count.count, 0) AS follower_count,
  COALESCE(following_count.count, 0) AS following_count
FROM user_profiles up
LEFT JOIN (
  SELECT followee_id, COUNT(*) AS count
  FROM user_follows
  GROUP BY followee_id
) follower_count ON follower_count.followee_id = up.id
LEFT JOIN (
  SELECT follower_id, COUNT(*) AS count
  FROM user_follows
  GROUP BY follower_id
) following_count ON following_count.follower_id = up.id;

-- インデックス
CREATE UNIQUE INDEX idx_user_follow_stats_user ON user_follow_stats(user_id);

-- 定期的に更新（毎時）
REFRESH MATERIALIZED VIEW CONCURRENTLY user_follow_stats;
```

### 3. グラフアルゴリズムの実装

#### 最短経路（Shortest Path）

```sql
-- ユーザーAからユーザーBへの最短経路
WITH RECURSIVE shortest_path AS (
  -- ベースケース
  SELECT
    followee_id AS user_id,
    ARRAY[$1, followee_id] AS path,
    1 AS depth
  FROM user_follows
  WHERE follower_id = $1

  UNION

  -- 再帰ケース
  SELECT
    uf.followee_id,
    sp.path || uf.followee_id,
    sp.depth + 1
  FROM shortest_path sp
  JOIN user_follows uf ON uf.follower_id = sp.user_id
  WHERE
    sp.depth < 6 -- 最大6ホップ（Six Degrees of Separation）
    AND NOT (uf.followee_id = ANY(sp.path)) -- サイクル防止
)
SELECT path, depth
FROM shortest_path
WHERE user_id = $2 -- ユーザーB
ORDER BY depth
LIMIT 1;
```

#### コミュニティ検出（Louvain法の簡易版）

```typescript
/**
 * モジュラリティベースのコミュニティ検出
 */
async function detectCommunities(groupId: string): Promise<Community[]> {
  // 1. グループメンバー間のインタラクションを取得
  const interactions = await db
    .select({
      userId1: interactions.userId1,
      userId2: interactions.userId2,
      weight: count(interactions.id),
    })
    .from(interactions)
    .where(
      and(
        inArray(interactions.userId1, groupMembers),
        inArray(interactions.userId2, groupMembers)
      )
    )
    .groupBy(interactions.userId1, interactions.userId2);

  // 2. グラフを構築
  const graph = buildGraph(interactions);

  // 3. Louvain法でコミュニティ検出
  const communities = louvainAlgorithm(graph);

  return communities;
}
```

## スケーラビリティ戦略

### 1. シャーディング（Sharding）

```typescript
/**
 * ユーザーIDベースのシャーディング
 */
function getShardId(userId: string): number {
  const hash = crypto.createHash("md5").update(userId).digest("hex");
  const hashInt = parseInt(hash.substring(0, 8), 16);
  return hashInt % SHARD_COUNT;
}

/**
 * シャード別にフォロー関係を保存
 */
async function followUser(followerId: string, followeeId: string): Promise<void> {
  const shardId = getShardId(followerId);
  const db = getShardDatabase(shardId);

  await db.insert(userFollows).values({
    followerId,
    followeeId,
  });
}
```

### 2. キャッシング戦略

```typescript
import { Redis } from "ioredis";

const redis = new Redis(process.env.REDIS_URL);

/**
 * フォロワー数をキャッシュ
 */
async function getFollowerCount(userId: string): Promise<number> {
  const cacheKey = `follower_count:${userId}`;

  // キャッシュチェック
  const cached = await redis.get(cacheKey);
  if (cached) {
    return parseInt(cached, 10);
  }

  // データベースから取得
  const count = await db
    .select({ count: count() })
    .from(userFollows)
    .where(eq(userFollows.followeeId, userId));

  // キャッシュに保存（1時間）
  await redis.setex(cacheKey, 3600, count[0].count.toString());

  return count[0].count;
}

/**
 * フォロー時にキャッシュを無効化
 */
async function followUserWithCache(
  followerId: string,
  followeeId: string
): Promise<void> {
  await db.insert(userFollows).values({
    followerId,
    followeeId,
  });

  // キャッシュ無効化
  await redis.del(`follower_count:${followeeId}`);
  await redis.del(`following_count:${followerId}`);
}
```

### 3. 読み取りレプリカ

```typescript
/**
 * 読み取り専用クエリはレプリカから実行
 */
async function getFollowersReadOnly(userId: string): Promise<User[]> {
  const replicaDb = getReplicaDatabase();

  return await replicaDb
    .select()
    .from(userProfiles)
    .innerJoin(
      userFollows,
      eq(userFollows.followerId, userProfiles.id)
    )
    .where(eq(userFollows.followeeId, userId));
}
```

## グラフデータベースの活用（オプション）

### Neo4j統合

```typescript
import neo4j from "neo4j-driver";

const driver = neo4j.driver(
  process.env.NEO4J_URI!,
  neo4j.auth.basic(
    process.env.NEO4J_USER!,
    process.env.NEO4J_PASSWORD!
  )
);

/**
 * Neo4jでフォロー関係を作成
 */
async function createFollowRelationship(
  followerId: string,
  followeeId: string
): Promise<void> {
  const session = driver.session();

  try {
    await session.run(
      `
      MATCH (follower:User {id: $followerId})
      MATCH (followee:User {id: $followeeId})
      CREATE (follower)-[:FOLLOWS]->(followee)
      `,
      { followerId, followeeId }
    );
  } finally {
    await session.close();
  }
}

/**
 * 友達の友達を取得（Neo4j）
 */
async function getFriendsOfFriends(userId: string): Promise<User[]> {
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (user:User {id: $userId})-[:FOLLOWS]->(friend)-[:FOLLOWS]->(fof)
      WHERE fof.id <> $userId
      RETURN DISTINCT fof
      LIMIT 20
      `,
      { userId }
    );

    return result.records.map(record => record.get("fof").properties);
  } finally {
    await session.close();
  }
}
```

## パフォーマンス最適化

### 1. バッチ処理

```typescript
/**
 * 複数ユーザーのフォロワー数を一括取得
 */
async function getFollowerCountsBatch(
  userIds: string[]
): Promise<Map<string, number>> {
  const counts = await db
    .select({
      userId: userFollows.followeeId,
      count: count(),
    })
    .from(userFollows)
    .where(inArray(userFollows.followeeId, userIds))
    .groupBy(userFollows.followeeId);

  return new Map(counts.map(c => [c.userId, c.count]));
}
```

### 2. データローダー（DataLoader）

```typescript
import DataLoader from "dataloader";

/**
 * フォロワー数のDataLoader
 */
const followerCountLoader = new DataLoader(async (userIds: string[]) => {
  const counts = await getFollowerCountsBatch(userIds);
  return userIds.map(id => counts.get(id) || 0);
});

/**
 * 使用例
 */
async function getUserWithFollowerCount(userId: string) {
  const [user, followerCount] = await Promise.all([
    getUser(userId),
    followerCountLoader.load(userId),
  ]);

  return { ...user, followerCount };
}
```

## 推薦アルゴリズム

### 1. 共通フォロワーベース推薦

```sql
-- 共通フォロワーが多いユーザーを推薦
SELECT
  uf2.followee_id AS recommended_user_id,
  COUNT(*) AS common_followers
FROM user_follows uf1
JOIN user_follows uf2 ON uf1.follower_id = uf2.follower_id
WHERE
  uf1.followee_id = $1 -- 対象ユーザー
  AND uf2.followee_id != $1 -- 自分自身を除外
  AND uf2.followee_id NOT IN (
    -- 既にフォロー済みのユーザーを除外
    SELECT followee_id FROM user_follows WHERE follower_id = $1
  )
GROUP BY uf2.followee_id
ORDER BY common_followers DESC
LIMIT 10;
```

### 2. グループベース推薦

```typescript
/**
 * 同じグループのメンバーを推薦
 */
async function recommendGroupMembers(userId: string): Promise<User[]> {
  // 1. ユーザーが所属するグループを取得
  const userGroups = await db
    .select({ groupId: groupMembers.groupId })
    .from(groupMembers)
    .where(eq(groupMembers.userId, userId));

  const groupIds = userGroups.map(g => g.groupId);

  // 2. 同じグループのメンバーを取得
  const recommendations = await db
    .select({
      userId: groupMembers.userId,
      commonGroups: count(),
    })
    .from(groupMembers)
    .where(
      and(
        inArray(groupMembers.groupId, groupIds),
        ne(groupMembers.userId, userId)
      )
    )
    .groupBy(groupMembers.userId)
    .orderBy(desc(count()))
    .limit(10);

  return await getUsersByIds(recommendations.map(r => r.userId));
}
```

## ベストプラクティス

### ✅ DO

- **インデックス**を適切に設定（双方向検索）
- **再帰CTE**でグラフクエリを実装
- **マテリアライズドビュー**で頻繁なクエリを事前計算
- **キャッシング**でパフォーマンスを向上
- **バッチ処理**で複数ユーザーのデータを一括取得
- **DataLoader**でN+1問題を回避

### ❌ DON'T

- **深い再帰**（6ホップ以上）を避ける
- **サイクル検出なし**で再帰クエリを実行しない
- **全ユーザー**とのグラフ計算を避ける
- **リアルタイム計算のみ**に依存しない

## トラブルシューティング

### 問題: グラフクエリが遅い

**原因**:

- インデックスが不足
- 再帰が深すぎる
- キャッシュが機能していない

**解決策**:

1. インデックスを追加
2. 再帰の深さを制限
3. マテリアライズドビューを使用
4. キャッシュ戦略を見直す

### 問題: メモリ不足

**原因**:

- 大規模なグラフを一度に処理
- サイクル検出が不十分

**解決策**:

1. ページネーションを実装
2. サイクル検出を追加
3. バッチサイズを小さくする

## 参考資料

- [PostgreSQL Recursive Queries](https://www.postgresql.org/docs/current/queries-with.html)
- [Graph Algorithms](https://en.wikipedia.org/wiki/Graph_algorithm)
- [Neo4j Graph Database](https://neo4j.com/)
