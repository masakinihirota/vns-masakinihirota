# Multiple UserProfiles 対応の RBAC 設計

## 現在の構造確認

### スキーマ関係
```
users.id (text, "user_xyz")
    ↓ authUserId (unique制約有り)
rootAccounts.id (uuid, 1ユーザー1つ)
    ↓ rootAccountId (複数可)
userProfiles.id (uuid, 複数可)
```

## 対応が必要な問題

### 問題：複数のuserProfilesがある場合、どれを使うか？

`getUserProfileId(userId)` が **複数の結果**を返す可能性がある：

```typescript
// 例：ユーザー "user_xyz" が以下の複数のプロフィールを持つ場合
rootAccounts {
  id: "root-abc",
  authUserId: "user_xyz"
}

userProfiles {
  id: "profile-1", rootAccountId: "root-abc", displayName: "Alice"
  id: "profile-2", rootAccountId: "root-abc", displayName: "Bob (alt)"
  id: "profile-3", rootAccountId: "root-abc", displayName: "Eve (dev)"
}

// どれを使う?
```

## ユースケース別の戦略

### Strategy A: 「メイン」プロフィールのみを使う（推奨）

**設計**：
- userProfiles テーブルにカラムを追加: `isMain BOOLEAN DEFAULT false`
- 1つのrootAccountに対して最大1つの `isMain: true` プロフィール
- RBAC操作では常に `isMain: true` のプロフィールを使用

**利点**：
- シンプル（1対1のように動作）
- 権限チェックが明確
- 複数プロフィール対応（ただしメインのみ権限有り）

**実装**：
```typescript
// isMain プロフィールを取得
const userProfileId = await db
  .select({ id: userProfiles.id })
  .from(users)
  .innerJoin(rootAccounts, eq(users.id, rootAccounts.authUserId))
  .innerJoin(userProfiles,
    and(
      eq(rootAccounts.id, userProfiles.rootAccountId),
      eq(userProfiles.isMain, true)  // メインのみ
    )
  )
  .where(eq(users.id, userId))
  .limit(1);
```

### Strategy B: セッションで「現在のプロフィール」を指定

**設計**：
- セッションデータに `currentProfileId` を保持
- ユーザーが複数プロフィール間で切り替え可能
- RBAC操作は常に `currentProfileId` を使用

**利点**：
- 複数プロフィール対応（ユーザーが選択可）
- キャラクター切り替えが可能

**実装**：
```typescript
// セッションから currentProfileId を取得
const userProfileId = session.currentProfileId;
if (!userProfileId) throw new Error("No active profile");
```

### Strategy C: 「最初のプロフィール／最後に更新されたプロフィール」

**設計**：
- 複数プロフィール存在時は、最初に作成されたもの または 最後に使用されたもの を使用

**利点**：
- 追加実装不要（ソート順で対応）

**欠点**：
- ユーザーの意図と異なる可能性がある

## 推奨案（Strategy A + Strategy B の組み合わせ）

### Step 1: デフォルトプロフィール（isMain）の実装
ほぼすべてのユーザーは「メイン」プロフィール1つを持つ。

### Step 2: 複数プロフィール対応（将来用）
高度なユースケース（複数キャラ、複数アバター）では、セッションで `currentProfileId` を指定可能にする。

### Step 3: RBAC ロジック
```typescript
// デフォルト動作：メインプロフィールを使用
const userProfileId = await getMainUserProfileId(userId);

// または、セッションで明示的に指定
const userProfileId = session.currentProfileId ||
                      await getMainUserProfileId(userId);
```

## 実装候補

### 修正1：userProfiles テーブルに isMain カラムを追加
```sql
ALTER TABLE user_profiles
ADD COLUMN is_main BOOLEAN DEFAULT false NOT NULL;

-- 各rootAccountに対して、最初の1つをメインにする
UPDATE user_profiles up1 SET is_main = true
WHERE id = (
  SELECT id FROM user_profiles up2
  WHERE up2.root_account_id = up1.root_account_id
  ORDER BY created_at ASC
  LIMIT 1
);

-- ユニーク制約：各rootAccount に対してメインは最大1つ
CREATE UNIQUE INDEX idx_user_profiles_root_account_is_main
ON user_profiles(root_account_id)
WHERE is_main = true;
```

### 修正2：Drizzleスキーマに isMain を追加
```typescript
export const userProfiles = pgTable("user_profiles", {
  // ... 既存フィールド ...
  isMain: boolean("is_main").default(false).notNull(),
  // ... その他 ...
}, (table) => [
  // 既存の foreign key, check制約...
  // ユニーク制約：各rootAccountに対して isMain: true は最大1つ
  sql`CREATE UNIQUE INDEX idx_user_profiles_root_account_is_main ON ${table} (root_account_id) WHERE is_main = true`,
]);
```

### 修正3：RBAC ヘルパーで getMainUserProfileId を実装
```typescript
const _getMainUserProfileIdInternal = cache(async (userId: string): Promise<string | null> => {
  const db = getDatabaseConnection();
  try {
    const result = await db
      .select({ userProfileId: userProfiles.id })
      .from(users)
      .innerJoin(rootAccounts, eq(users.id, rootAccounts.authUserId))
      .innerJoin(userProfiles,
        and(
          eq(rootAccounts.id, userProfiles.rootAccountId),
          eq(userProfiles.isMain, true)
        )
      )
      .where(eq(users.id, userId))
      .limit(1)
      .then(rows => rows[0] || null);

    return result?.userProfileId ?? null;
  } catch (error) {
    console.error("getMainUserProfileId error:", error);
    return null;
  }
});
```

## 決定が必要な項目

1. **複数プロフィール機能は将来使う予定か？**
   - YES → Strategy B も準備（セッションにcurrentProfileIdを追加）
   - NO → Strategy A のみ（isMain カラムで十分）

2. **既存データの isMain の初期化方は？**
   - 最初に作成されたプロフィールを isMain にする
   - または、RBAC ヘルパーで初期化時に1つを選ぶ

## 次のステップ

ユーザーの決定を待つ：
- 複数プロフィール機能は使う予定か？
- 使う場合：セッションあたりのプロフィール切り替え機能を実装するか？
