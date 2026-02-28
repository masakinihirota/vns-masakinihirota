# RBAC 層と users 層の接続問題の正確な理解

## 現状の構造

### Level 1: セッション（Better Auth）
```typescript
// プロキシまたはセッション取得時
const session = await getSession();
// session.user.id: text （例："user_xyz123"）
```

### Level 2: ビジネスロジック
```typescript
const userId: string = session.user.id; // text型

// 次にグループメンバーを確認したい
const isMember = await checkGroupRole(userId, groupId, 'member');
```

### Level 3: RBAC テーブルの参照図
```
用途: checkGroupRole(userId: string, groupId: string, role: GroupRole)

userId (text) "user_xyz123"
    ↓
    ❌ groupMembers.userProfileId (uuid) と直接マッチできない！

正しい変換パス:
userId (text) "user_xyz123"
    ↓
rootAccounts.authUserId を検索 → rootAccounts.id (uuid) を取得
    ↓
userProfiles.rootAccountId で取得 → userProfiles.id (uuid) を取得
    ↓
groupMembers.userProfileId (uuid) とマッチ ✅
```

## 現在の実装の問題

### ❌ `rbac-helper.ts` での不正な型キャスト
```typescript
const member = await db
  .select()
  .from(groupMembers)
  .where(
    and(
      eq(groupMembers.userProfileId, userId as any),  // ← TEXT を UUID と比較！
      eq(groupMembers.groupId, groupId as any),
    ),
  )
  .first();
```

**問題**: `userId (text)` を `groupMembers.userProfileId (uuid)` と直接比較している。
- 型安全性を失う
- SQL で実際にマッチしない可能性
- `as any` で強制実行

## 正しい実装方針

### オプション A: userId → userProfileId への明示的な変換（推奨）
```typescript
async function getUserProfileId(userId: string): Promise<string | null> {
  const db = getDatabaseConnection();
  const result = await db
    .select({
      userProfileId: userProfiles.id,
    })
    .from(users)
    .innerJoin(
      rootAccounts,
      eq(users.id, rootAccounts.authUserId)
    )
    .innerJoin(
      userProfiles,
      eq(rootAccounts.id, userProfiles.rootAccountId)
    )
    .where(eq(users.id, userId))
    .first();

  return result?.userProfileId ?? null;
}

// 使用時
const userProfileId = await cache(() => getUserProfileId(userId))();
const member = await db
  .select()
  .from(groupMembers)
  .where(
    and(
      eq(groupMembers.userProfileId, userProfileId),  //  正しい！
      eq(groupMembers.groupId, groupId),
    ),
  )
  .first();
```

### オプション B: JOIN での一度に取得
```typescript
const member = await db
  .select()
  .from(groupMembers)
  .innerJoin(
    userProfiles,
    eq(groupMembers.userProfileId, userProfiles.id)
  )
  .innerJoin(
    rootAccounts,
    eq(userProfiles.rootAccountId, rootAccounts.id)
  )
  .where(
    and(
      eq(rootAccounts.authUserId, userId),  // users.id (text) で取得
      eq(groupMembers.groupId, groupId),
    ),
  )
  .first();
```

## ユーザーの指摘の本質

> "このアプリではrootAccountが一人のユーザーの基本単位だ"

**これは完全に正しい。**意味：
1. セッションから得られる userId (text) は、単に認証トークン
2. ビジネスロジック上の「1ユーザー」は rootAccount (uuid) で識別される
3. RBAC は全て rootAccounts を中心に構築されるべき（経由してuserProfiles）

## 修正が必要なコード

### src/lib/auth/rbac-helper.ts
1. userId (text) から userProfileId (uuid) への変換を明示化
2. `as any` の削除
3. キャッシュされた変換関数の追加

### 影響を受ける関数
- `checkGroupRole()` - グループロール確認
- `checkNationRole()` - 国ロール確認
- `_checkGroupRoleInternal()` - 内部ヘルパー
- `_checkNationRoleInternal()` - 内部ヘルパー

##実装順序

1. ✅ スキーマは正しい（users, rootAccounts, userProfiles すべて存在）
2. 🔴 RBAC ヘルパーの修正が必要（userId → userProfileId の明示的な変換）
3. ✅ ビルドは通る（型チェックは `as any` で回避中）
4. ❓ 実行時の動作確認が必要（DBクエリが実際にマッチするか）

## 結論

**ユーザーの指摘は完全に正しい。では、コード層で正しい変換を実装する必要があります。**
