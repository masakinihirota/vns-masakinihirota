# N+1 Query Prevention Guide

## 問題の定義

### N+1 Query Problem
```typescript
// ❌ BAD: N+1 queries
const userProfiles = await db.query.userProfiles.findMany();
for (const profile of userProfiles) {
  // ID が100個あれば、ここで101個のクエリが実行される
  const rootAccount = await db.query.rootAccounts.findFirst({
    where: eq(rootAccounts.id, profile.rootAccountId),
  });
}
// Result: 1 + 100 = 101 queries

// ✅ GOOD: Single query with eager loading
const userProfiles = await db.query.userProfiles.findMany({
  with: {
    rootAccount: true, // Eager loading
  },
});
// Result: 1 query
```

---

## Drizzle ORM での解決方法

### 1. **`.with()` で関連データを先読み**

```typescript
// ケース1: 1対1関係
const profile = await db.query.userProfiles.findFirst({
  where: eq(userProfiles.id, profileId),
  with: {
    rootAccount: true, // 同時に rootAccount を取得
    businessCards: true, // 複数関連も取得可能
  },
});

// ケース2: 1対多関係（グループのメンバー）
const group = await db.query.groups.findFirst({
  where: eq(groups.id, groupId),
  with: {
    groupMembers: {
      // ネストされた with も可能
      with: {
        userProfile: true,
      },
    },
  },
});

// ケース3: 複数レベルのネスト
const nation = await db.query.nations.findFirst({
  where: eq(nations.id, nationId),
  with: {
    nationGroups: {
      with: {
        group: {
          with: {
            groupMembers: {
              with: {
                userProfile: true,
              },
            },
          },
        },
      },
    },
    nationPosts: {
      with: {
        author: true,
        authorGroup: true,
      },
    },
  },
});
```

---

## テーブル別N+1最適化パターン

### **Group + Members**
```typescript
// 良いパターン（1クエリ）
const groups = await db.query.groups.findMany({
  limit: 20,
  offset: 0,
  with: {
    groupMembers: {
      with: {
        userProfile: {
          columns: {
            id: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
    },
  },
});
```

### **Nation Events + Participants**
```typescript
const events = await db.query.nationEvents.findMany({
  where: eq(nationEvents.nationId, nationId),
  with: {
    nationEventParticipants: {
      with: {
        userProfile: {
          columns: {
            displayName: true,
            avatarUrl: true,
          },
        },
      },
    },
  },
});
```

### **Market Items + Latest Transaction**
```typescript
// Note: Drizzle では limit in relationship がないため、別クエリが必要
const items = await db.query.marketItems.findMany({
  with: {
    seller: true,
    sellerGroup: true,
  },
});

// 最新トランザクションが必要な場合
const itemsWithTransactions = await Promise.all(
  items.map(async (item) => ({
    ...item,
    latestTransaction: await db
      .select()
      .from(marketTransactions)
      .where(eq(marketTransactions.itemId, item.id))
      .orderBy(desc(marketTransactions.createdAt))
      .limit(1)
      .then((rows) => rows[0]),
  }))
);
// → 少なくともこれはバッチ化（個別ではなく）
```

---

## パフォーマンス最適化テクニック

### 1. **Column Selection で不要なカラムを削除**
```typescript
const profiles = await db.query.userProfiles.findMany({
  with: {
    rootAccount: {
      // 必要なカラムだけに限定（ネットワーク削減）
      columns: {
        id: true,
        trustDays: true,
      },
    },
  },
  columns: {
    id: true,
    displayName: true,
    avatarUrl: true,
    // updatedAt, metadata など不要なカラムは含めない
  },
});
```

### 2. **Limit/Offset を活用したページング**
```typescript
const page = 1;
const limit = 20;

const profiles = await db.query.userProfiles.findMany({
  limit,
  offset: (page - 1) * limit,
  orderBy: [desc(userProfiles.createdAt)],
  with: {
    rootAccount: true,
  },
});
```

### 3. **Filtering で不要なデータを削除**
```typescript
// アクティブなプロフィールだけを抽出
const activeProfiles = await db.query.userProfiles.findMany({
  where: eq(userProfiles.isActive, true),
  with: {
    businessCards: {
      where: eq(businessCards.isPublished, true),
    },
  },
});
```

---

## N+1検出パターン

### ✅ パターン1：データベースログで検出
```sql
-- 短時間に同一テーブルへの同一WHERE条件のクエリが繰り返されるか確認
SELECT query, COUNT(*) as count, AVG(duration) as avg_duration
FROM pg_stat_statements
WHERE query LIKE '%WHERE id = %'
GROUP BY query
HAVING COUNT(*) > 5
ORDER BY count DESC;
```

###✅ パターン2：アプリケーションログで検出
```typescript
// logger を使ってDB クエリをカウント
logger.debug(`[Query Count] Finding profile: ${profileId}`);
const profile = await db.query.userProfiles.findFirst({
  where: eq(userProfiles.id, profileId),
});
logger.debug(`[Query Count] Fetching root account...`);
const rootAccount = await db.query.rootAccounts.findFirst({
  where: eq(rootAccounts.id, profile.rootAccountId),
});
// 改善後は with を使用して2つのクエリを1つに統合
```

### ✅ パターン3：APMツールでの検出（DatadogやNewRelic）
```
Dashboard Alert:
  - Consecutive queries to same table
  - Waterfall chart で sequential dependencies 検出
```

---

## 危険な実装パターン集

### ❌ パターン1：ループ内でDB接続
```typescript
// BAD❌
const groups = await db.query.groups.findMany();
for (const group of groups) {
  const members = await db.query.groupMembers.findMany({
    where: eq(groupMembers.groupId, group.id),
  });
  // → 各グループごとに1クエリ = N+1
}

// GOOD✅
const groups = await db.query.groups.findMany({
  with: {
    groupMembers: true,
  },
});
```

### ❌ パターン2：Promise.all() の過剰使用
```typescript
// BAD❌ (個別の非同期クエリ)
const profiles = await db.query.userProfiles.findMany();
const profilesWithRootAccounts = await Promise.all(
  profiles.map((p) =>
    db.query.rootAccounts.findFirst({
      where: eq(rootAccounts.id, p.rootAccountId),
    })
  )
);
// → 100個のプロフィール = 100個の同時クエリ

// GOOD✅
const profiles = await db.query.userProfiles.findMany({
  with: {
    rootAccount: true,
  },
});
```

### ❌ パターン3：Transaction 内での逐次クエリ
```typescript
// BAD❌
await db.transaction(async (tx) => {
  const user = await tx.query.users.findFirst({...});
  const profiles = await tx.query.userProfiles.findMany({
    where: eq(userProfiles.rootAccountId, user.rootAccountId),
  });
  // ...
});

// GOOD✅
const user = await db.query.users.findFirst({
  with: {
    rootAccount: {
      with: {
        userProfiles: true,
      },
    },
  },
});
```

---

## テーブル別 with() ガイド

| テーブル | 推奨 with() 構成 | 注意点 |
|---------|---------------|-------|
| `userProfiles` | `rootAccount`, `businessCards` | 大量の businessCards は limit 必須 |
| `groups` | `groupMembers.userProfile` | ネストが深い場合、query cost up |
| `nations` | `nationGroups.group`, `nationPosts` | nationPosts 多い場合は pagination |
| `marketItems` | `seller`, `sellerGroup` | 最新 transaction は別クエリ |
| `nationEvents` | `nationEventParticipants.userProfile` | 参加者多数は batch fetch |

---

## 実装チェックリスト

- [ ] 全API endpoints で `with()` の使用を確認
- [ ] ループ内での DB接続がないか検査
- [ ] Promise.all() で N個のクエリが実行されていないか確認
- [ ] データベースログから N+1 パターンを検出
- [ ] performance test で query count を測定
- [ ] 大規模データセット（> 100件）での動作確認
- [ ] pagination を実装し、無制限に大量データを fetch しない

---

## Tips & Tricks

### DataLoader パターン（複雑な関連データ）
```typescript
// キャッシュしながら batch fetch
import DataLoader from 'dataloader';

const rootAccountLoader = new DataLoader(async (accountIds) => {
  const results = await db.select().from(rootAccounts)
    .where(inArray(rootAccounts.id, accountIds));
  return accountIds.map(id =>
    results.find(r => r.id === id)
  );
});

// 使用
const profile = await db.query.userProfiles.findFirst({...});
const rootAccount = await rootAccountLoader.load(profile.rootAccountId);
```

### 複数テーブルからの参照（複雑な join）
```typescript
// market_transactions の buyer と seller を同時に取得
const transactions = await db
  .select({
    transaction: marketTransactions,
    buyerProfile: userProfiles,
    // seller の場合は別の userProfiles インスタンスが必要
  })
  .from(marketTransactions)
  .leftJoin(
    userProfiles,
    eq(marketTransactions.buyerId, userProfiles.id)
  );
  // seller も必要な場合は複雑...
  // → この場合は with() + post-processing が簡単
```

---

## まとめ

**ルール：**
1. **Eager Loading は デフォルト** → `with()` を多用
2. **Loop + Query は禁止** → batch fetch or with()
3. **Large Dataset は Pagination** → limit + offset
4. **定期的な監査** → APM ツールで監視
5. **テスト時に Query Count を測定** → query logger で確認
