---
description: レコメンデーションシステムの実装パターンとベストプラクティス
---

# Recommendation System Patterns Skill

## 概要

このスキルは、VNS masakinihirotaプロジェクトにおける**作品推薦システム**の実装パターンとベストプラクティスを提供します。

## 適用タイミング

以下の場合にこのスキルを使用してください:

- 作品推薦機能の実装または改善時
- ユーザーの好みに基づいた作品提案が必要な時
- コールドスタート問題（新規ユーザー）への対処時
- 推薦精度の向上が必要な時

## レコメンデーションアルゴリズムの種類

### 1. 協調フィルタリング（Collaborative Filtering）

#### User-based協調フィルタリング

「似たユーザーが好きな作品を推薦」

```typescript
/**
 * User-based協調フィルタリング
 * @param userId 対象ユーザーID
 * @param k 類似ユーザー数
 * @returns 推薦作品リスト
 */
async function userBasedRecommendation(
  userId: string,
  k: number = 20
): Promise<Work[]> {
  // 1. 類似ユーザーを取得
  const similarUsers = await findSimilarUsers(userId, k);

  // 2. 類似ユーザーが高評価した作品を集計
  const workScores = new Map<string, number>();

  for (const similarUser of similarUsers) {
    const ratings = await getUserRatings(similarUser.id);

    for (const rating of ratings) {
      if (rating.tier === 1) { // Tier 1のみ
        const currentScore = workScores.get(rating.work_id) || 0;
        workScores.set(
          rating.work_id,
          currentScore + similarUser.similarity
        );
      }
    }
  }

  // 3. スコア順にソート
  const recommendations = Array.from(workScores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([workId]) => workId);

  return await getWorksByIds(recommendations);
}
```

#### Item-based協調フィルタリング（推奨）

「似た作品を推薦」

```typescript
/**
 * Item-based協調フィルタリング
 * @param userId 対象ユーザーID
 * @returns 推薦作品リスト
 */
async function itemBasedRecommendation(
  userId: string
): Promise<Work[]> {
  // 1. ユーザーが高評価した作品を取得
  const userRatings = await getUserRatings(userId);
  const likedWorks = userRatings.filter(r => r.tier === 1);

  // 2. 各作品に類似した作品を取得
  const similarWorks = new Map<string, number>();

  for (const rating of likedWorks) {
    const similar = await findSimilarWorks(rating.work_id, 10);

    for (const work of similar) {
      const currentScore = similarWorks.get(work.id) || 0;
      similarWorks.set(work.id, currentScore + work.similarity);
    }
  }

  // 3. 既に評価済みの作品を除外
  const ratedWorkIds = new Set(userRatings.map(r => r.work_id));
  const recommendations = Array.from(similarWorks.entries())
    .filter(([workId]) => !ratedWorkIds.has(workId))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([workId]) => workId);

  return await getWorksByIds(recommendations);
}
```

**Item-basedの利点**:

- スケーラビリティが高い（作品数 << ユーザー数）
- 事前計算が可能
- 説明可能性が高い（「この作品が好きなら、これもおすすめ」）

### 2. コンテンツベースフィルタリング（Content-based Filtering）

作品の属性（ジャンル、タグ、制作年など）に基づいて推薦

```typescript
interface WorkFeatures {
  workId: string;
  genres: string[];
  tags: string[];
  year: number;
  studio: string;
}

/**
 * コンテンツベースフィルタリング
 */
async function contentBasedRecommendation(
  userId: string
): Promise<Work[]> {
  // 1. ユーザーの好みプロファイルを構築
  const userProfile = await buildUserProfile(userId);

  // 2. 作品の特徴ベクトルと比較
  const allWorks = await getAllWorks();
  const scores = allWorks.map(work => ({
    work,
    score: calculateContentSimilarity(userProfile, work.features),
  }));

  // 3. スコア順にソート
  return scores
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map(s => s.work);
}

/**
 * ユーザーの好みプロファイルを構築
 */
async function buildUserProfile(userId: string): Promise<UserProfile> {
  const ratings = await getUserRatings(userId);
  const likedWorks = ratings.filter(r => r.tier === 1);

  // ジャンル、タグの出現頻度を集計
  const genreFreq = new Map<string, number>();
  const tagFreq = new Map<string, number>();

  for (const rating of likedWorks) {
    const work = await getWork(rating.work_id);

    work.genres.forEach(genre => {
      genreFreq.set(genre, (genreFreq.get(genre) || 0) + 1);
    });

    work.tags.forEach(tag => {
      tagFreq.set(tag, (tagFreq.get(tag) || 0) + 1);
    });
  }

  return {
    preferredGenres: Array.from(genreFreq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([genre]) => genre),
    preferredTags: Array.from(tagFreq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag]) => tag),
  };
}
```

### 3. ハイブリッドアプローチ（推奨）

複数のアルゴリズムを組み合わせて精度を向上

```typescript
/**
 * ハイブリッド推薦システム
 */
async function hybridRecommendation(userId: string): Promise<Work[]> {
  // 1. 各アルゴリズムで推薦を取得
  const [itemBased, contentBased, userBased] = await Promise.all([
    itemBasedRecommendation(userId),
    contentBasedRecommendation(userId),
    userBasedRecommendation(userId),
  ]);

  // 2. スコアを統合（重み付け平均）
  const weights = {
    itemBased: 0.5,
    contentBased: 0.3,
    userBased: 0.2,
  };

  const combinedScores = new Map<string, number>();

  // Item-based
  itemBased.forEach((work, index) => {
    const score = (itemBased.length - index) * weights.itemBased;
    combinedScores.set(work.id, score);
  });

  // Content-based
  contentBased.forEach((work, index) => {
    const score = (contentBased.length - index) * weights.contentBased;
    const current = combinedScores.get(work.id) || 0;
    combinedScores.set(work.id, current + score);
  });

  // User-based
  userBased.forEach((work, index) => {
    const score = (userBased.length - index) * weights.userBased;
    const current = combinedScores.get(work.id) || 0;
    combinedScores.set(work.id, current + score);
  });

  // 3. スコア順にソート
  const recommendations = Array.from(combinedScores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([workId]) => workId);

  return await getWorksByIds(recommendations);
}
```

## コールドスタート問題への対処

### 新規ユーザー（User Cold Start）

```typescript
/**
 * 新規ユーザー向け推薦
 */
async function coldStartRecommendation(userId: string): Promise<Work[]> {
  const userRatings = await getUserRatings(userId);

  if (userRatings.length === 0) {
    // 評価がない場合: 人気作品を推薦
    return await getPopularWorks(10);
  } else if (userRatings.length < 5) {
    // 評価が少ない場合: コンテンツベース + 人気作品
    const contentBased = await contentBasedRecommendation(userId);
    const popular = await getPopularWorks(5);

    return [...contentBased.slice(0, 5), ...popular];
  } else {
    // 通常の推薦
    return await hybridRecommendation(userId);
  }
}

/**
 * 人気作品を取得
 */
async function getPopularWorks(limit: number): Promise<Work[]> {
  return await db
    .select()
    .from(works)
    .leftJoin(workRatings, eq(works.id, workRatings.workId))
    .groupBy(works.id)
    .orderBy(desc(count(workRatings.id)))
    .limit(limit);
}
```

### 新規作品（Item Cold Start）

```typescript
/**
 * 新規作品の推薦への組み込み
 */
async function incorporateNewWork(workId: string): Promise<void> {
  const work = await getWork(workId);

  // 1. コンテンツベースで類似作品を計算
  const similarWorks = await findSimilarWorksByContent(work);

  // 2. 類似作品を高評価したユーザーに推薦
  for (const similarWork of similarWorks) {
    const users = await getUsersWhoLiked(similarWork.id);

    for (const user of users) {
      await addToRecommendationQueue(user.id, workId);
    }
  }
}
```

## 評価の正規化とバイアス除去

### 評価の正規化

```typescript
/**
 * ユーザーの評価傾向を正規化
 */
function normalizeRatings(ratings: Rating[]): Rating[] {
  const mean = ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length;
  const std = Math.sqrt(
    ratings.reduce((sum, r) => sum + Math.pow(r.score - mean, 2), 0) / ratings.length
  );

  return ratings.map(r => ({
    ...r,
    normalizedScore: (r.score - mean) / (std || 1),
  }));
}
```

### ポピュラリティバイアスの除去

```typescript
/**
 * 人気作品のバイアスを除去
 */
async function diversifyRecommendations(
  recommendations: Work[]
): Promise<Work[]> {
  const popularityScores = await getPopularityScores(
    recommendations.map(w => w.id)
  );

  // 人気度でペナルティを適用
  const diversified = recommendations.map((work, index) => {
    const popularity = popularityScores.get(work.id) || 0;
    const penaltyFactor = 1 / (1 + Math.log(popularity + 1));

    return {
      work,
      score: (recommendations.length - index) * penaltyFactor,
    };
  });

  return diversified
    .sort((a, b) => b.score - a.score)
    .map(d => d.work);
}
```

## PostgreSQLでの効率的な実装

### 作品類似度の事前計算

```sql
-- 作品間の類似度を事前計算して保存
CREATE TABLE work_similarities (
  work_id_a UUID REFERENCES works(id),
  work_id_b UUID REFERENCES works(id),
  similarity FLOAT NOT NULL,
  PRIMARY KEY (work_id_a, work_id_b)
);

CREATE INDEX idx_work_similarities_a ON work_similarities(work_id_a, similarity DESC);

-- 類似作品を取得
SELECT
  w.*,
  ws.similarity
FROM work_similarities ws
JOIN works w ON w.id = ws.work_id_b
WHERE ws.work_id_a = $1
ORDER BY ws.similarity DESC
LIMIT 10;
```

### 推薦結果のキャッシュ

```sql
-- 推薦結果をキャッシュ
CREATE TABLE recommendation_cache (
  user_profile_id UUID PRIMARY KEY REFERENCES user_profiles(id),
  recommended_work_ids UUID[] NOT NULL,
  algorithm VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_recommendation_cache_expires ON recommendation_cache(expires_at);

-- 期限切れキャッシュを削除（定期実行）
DELETE FROM recommendation_cache WHERE expires_at < NOW();
```

## A/Bテストとメトリクス

### 推薦アルゴリズムのA/Bテスト

```typescript
/**
 * A/Bテスト用の推薦
 */
async function abTestRecommendation(userId: string): Promise<Work[]> {
  const variant = await getABTestVariant(userId);

  switch (variant) {
    case "A":
      return await itemBasedRecommendation(userId);
    case "B":
      return await hybridRecommendation(userId);
    default:
      return await contentBasedRecommendation(userId);
  }
}

/**
 * 推薦のクリック率を記録
 */
async function trackRecommendationClick(
  userId: string,
  workId: string,
  position: number
): Promise<void> {
  await db.insert(recommendationClicks).values({
    userId,
    workId,
    position,
    variant: await getABTestVariant(userId),
    timestamp: new Date(),
  });
}
```

### 評価メトリクス

```typescript
/**
 * 推薦精度の評価メトリクス
 */
async function evaluateRecommendations(): Promise<Metrics> {
  // Precision@K: 上位K件の推薦のうち、実際に高評価された割合
  const precisionAtK = await calculatePrecisionAtK(10);

  // Recall@K: 高評価作品のうち、上位K件に含まれる割合
  const recallAtK = await calculateRecallAtK(10);

  // NDCG (Normalized Discounted Cumulative Gain)
  const ndcg = await calculateNDCG();

  // CTR (Click-Through Rate)
  const ctr = await calculateCTR();

  return { precisionAtK, recallAtK, ndcg, ctr };
}
```

## ベストプラクティス

### ✅ DO

- **ハイブリッドアプローチ**を使用して精度を向上
- **Item-based協調フィルタリング**を優先（スケーラビリティ）
- **事前計算**で類似度を保存
- **キャッシュ**で推薦結果を保存
- **多様性**を確保（人気作品のバイアス除去）
- **A/Bテスト**で効果を測定

### ❌ DON'T

- **リアルタイム計算**のみに依存しない
- **単一アルゴリズム**のみを使用しない
- **コールドスタート問題**を無視しない
- **メトリクス測定**を怠らない

## トラブルシューティング

### 問題: 推薦精度が低い

**原因**:

- データが不足している
- アルゴリズムの重みが不適切
- バイアスが強い

**解決策**:

1. データ収集を強化
2. ハイブリッドアプローチの重みを調整
3. 多様性を確保

### 問題: 推薦が遅い

**原因**:

- リアルタイム計算が多い
- インデックスが不足
- キャッシュが機能していない

**解決策**:

1. 事前計算を増やす
2. インデックスを追加
3. キャッシュ戦略を見直す

## 参考資料

- [Recommender Systems Handbook](https://www.springer.com/gp/book/9780387858203)
- [Collaborative Filtering](https://en.wikipedia.org/wiki/Collaborative_filtering)
- [Content-based Filtering](https://en.wikipedia.org/wiki/Recommender_system#Content-based_filtering)
