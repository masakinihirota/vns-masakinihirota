# ID モデル責務定義書

## 概要

本ドキュメントは、vns-masakinihirota プロジェクトにおける ID 管理の責務を明確化するために作成されました。
認証ID（auth user id）、ルートアカウントID、プロフィールIDの3階層構造について、それぞれの役割と使い分けを定義します。

## 1. 3階層IDモデルの責務

### 1.1 認証ID（Auth User ID）

**テーブル**: `users` (Better Auth標準テーブル)
**型**: `text` (Better Authが管理)
**責務**: OAuth認証の主体を識別する

- **用途**:
  - OAuth プロバイダー（Google/GitHub）による認証
  - セッション管理（session.userId → users.id）
  - Better Auth の認証フローで使用

- **特性**:
  - Better Auth が自動生成（ランダムテキスト）
  - OAuth アカウント連携の基準点
  - 直接的なアプリケーション機能には使用しない（RBAC、投稿、リレーションシップなどには不使用）

- **禁止パターン**:
  - ❌ `users.id` を直接 RBAC 判定に使用
  - ❌ `users.id` をビジネスロジック（投稿、コメント、いいね）の外部キーに使用
  - ✅ `users.id` は `root_accounts.auth_user_id` への参照のみに限定

### 1.2 ルートアカウントID（Root Account ID）

**テーブル**: `root_accounts`
**型**: `uuid` (アプリケーションが管理)
**責務**: ユーザーの単一ルートアカウントを識別する

- **用途**:
  - 認証ID（users.id）とプロフィール群の中継点
  - 現在アクティブな仮面（active_profile_id）の管理
  - データ保持期間、信頼度などのアカウント全体設定

- **特性**:
  - 1 認証ID につき 1 ルートアカウント（1:1関係）
  - 複数のプロフィール（user_profiles）の親
  - `active_profile_id` で現在被っている仮面を指定

- **使用例**:
  ```typescript
  // ✅ 正しい使い方: auth user id から active_profile_id を解決
  const rootAccount = await db
    .select({ activeProfileId: rootAccounts.activeProfileId })
    .from(rootAccounts)
    .where(eq(rootAccounts.authUserId, session.user.id))
    .limit(1);

  const activeProfileId = rootAccount?.activeProfileId ?? null;
  ```

- **禁止パターン**:
  - ❌ `root_accounts.id` を直接 RBAC 判定に使用
  - ❌ `root_accounts.id` をリレーションシップ（alliances, follows）の外部キーに使用
  - ✅ `root_accounts.id` は `user_profiles.root_account_id` への参照のみに限定

### 1.3 プロフィールID（User Profile ID）

**テーブル**: `user_profiles`
**型**: `uuid` (アプリケーションが管理)
**責務**: 仮面（Ghost/Persona）単位の活動主体を識別する

- **用途**:
  - 全ての RBAC 判定の基準点
  - ビジネスロジック（投稿、コメント、いいね、フォロー、アライアンス）の外部キー
  - ゲーミフィケーション（ポイント、レベル）の単位
  - 名刺（business_cards）の所有者

- **特性**:
  - 1 ルートアカウント につき 複数プロフィール（1:N関係）
  - 必ず1つの ghost profile（システム生成、is_default=true, mask_category='ghost'）
  - 任意で複数の persona profiles（ユーザー作成、mask_category='persona'）
  - `root_accounts.active_profile_id` で指定されたプロフィールが「現在被っている仮面」

- **使用例**:
  ```typescript
  // ✅ 正しい使い方: profile id で権限判定
  export const checkGroupRole = cache(async (
    userId: string, // auth user id
    groupId: string,
    requiredRole: "admin" | "leader" | "member"
  ): Promise<boolean> => {
    const profileId = await getUserProfileId(userId);
    if (!profileId) return false;

    // profile id で group_members を検索
    const membership = await db.select()
      .from(groupMembers)
      .where(and(
        eq(groupMembers.userProfileId, profileId),
        eq(groupMembers.groupId, groupId)
      ))
      .limit(1);

    return membership[0]?.role === requiredRole;
  });
  ```

- **禁止パターン**:
  - ❌ `users.id` を直接 `group_members.user_profile_id` と比較
  - ❌ `root_accounts.id` を `alliances.profile_a_id` と比較
  - ✅ 全てのビジネスロジックは `user_profiles.id` を使用

## 2. `active_profile_id` の整合性方針

### 2.1 FK制約の方針

**現状**: `active_profile_id` は nullable で FK 制約なし
**方針**: FK 制約を追加し、削除時の安全性を確保

```sql
-- Migration案
ALTER TABLE root_accounts
ADD CONSTRAINT fk_root_accounts_active_profile_id
FOREIGN KEY (active_profile_id)
REFERENCES user_profiles(id)
ON DELETE SET NULL;  -- プロフィール削除時は NULL に設定（ghost に戻す）
```

### 2.2 NULL 運用の方針

- **初期化時**: `setup-root-account.ts` で ghost profile 作成後に active_profile_id を設定
- **NULL の扱い**: active_profile_id が NULL の場合、RBAC は deny-by-default（全ての権限チェックで false を返す）
- **切り替え時**: persona 追加時は active_profile_id を更新可能、削除時は ghost に戻す

### 2.3 同時更新競合の扱い

- **楽観的ロック**: `updated_at` カラムを使用した比較更新
- **トランザクション**: 仮面切替は必ずトランザクション内で実行
- **セッション同期**: active_profile_id 更新後はセッション再取得を推奨

```typescript
// ✅ 正しい仮面切替
await db.transaction(async (tx) => {
  const result = await tx.update(rootAccounts)
    .set({
      activeProfileId: newProfileId,
      updatedAt: new Date()
    })
    .where(and(
      eq(rootAccounts.authUserId, userId),
      eq(rootAccounts.updatedAt, currentUpdatedAt) // 楽観的ロック
    ))
    .returning({ success: sql`1` });

  if (result.length === 0) {
    throw new Error("Profile switch failed due to concurrent update");
  }
});
```

## 3. Ghost/Persona 切替時の更新対象

### 3.1 切替フロー

1. **ユーザーアクション**: 仮面切替ボタンをクリック
2. **Server Action**: `switchProfile(newProfileId)` を呼び出し
3. **DB更新**: `root_accounts.active_profile_id` を更新
4. **セッション更新**: session callback で自動的に新しい activeProfileId を取得
5. **UI反映**: クライアント側でセッション再取得（`useSession` の refetch）

### 3.2 更新対象

| 更新対象 | タイミング | 実装場所 |
|---------|----------|---------|
| `root_accounts.active_profile_id` | Server Action 実行時 | `switchProfile()` |
| `session.user.activeProfileId` | 次回セッション取得時 | `auth.ts` session callback |
| クライアント側セッション | UI側で明示的に refetch | `useSession()` |

### 3.3 異常系の扱い

- **存在しないプロフィールID**: Server Action で検証、エラー返却
- **他人のプロフィール**: RBAC で拒否（同一 root_account_id かチェック）
- **削除済みプロフィール**: FK制約で防止（ON DELETE SET NULL）

## 4. 正準IDの確定

### 4.1 ID変換責務

| 変換パターン | 担当層 | 実装場所 |
|------------|--------|---------|
| auth user id → profile id | RBAC Helper | `rbac-helper.ts` の `getUserProfileId()` |
| profile id → mask category | RBAC Helper | `rbac-helper.ts` の `getMaskCategory()` |
| profile id → group role | RBAC Helper | `checkGroupRole()` |
| profile id → nation role | RBAC Helper | `checkNationRole()` |

### 4.2 禁止パターン（明文化）

```typescript
// ❌ 禁止: auth user id を直接ビジネスロジックに使用
const post = await db.insert(posts).values({
  authorId: session.user.id, // NG: users.id を直接使用
  content: "Hello"
});

// ✅ 正しい: profile id を使用
const profileId = await getUserProfileId(session.user.id);
if (!profileId) throw new Error("No active profile");

const post = await db.insert(posts).values({
  authorId: profileId, // OK: user_profiles.id を使用
  content: "Hello"
});
```

```typescript
// ❌ 禁止: root account id を RBAC に使用
const canEdit = await checkGroupRole(
  rootAccountId, // NG: root_accounts.id を使用
  groupId,
  "admin"
);

// ✅ 正しい: auth user id から profile id に変換
const canEdit = await checkGroupRole(
  session.user.id, // OK: users.id を渡し、内部で profile id に変換
  groupId,
  "admin"
);
```

### 4.3 ID種別の型安全性

将来的に TypeScript の branded types を使用して、コンパイル時に ID 種別を区別する：

```typescript
// 提案: Branded Types の導入
type AuthUserId = string & { readonly __brand: "AuthUserId" };
type RootAccountId = string & { readonly __brand: "RootAccountId" };
type UserProfileId = string & { readonly __brand: "UserProfileId" };

// 関数シグネチャで型安全性を確保
function getUserProfileId(userId: AuthUserId): Promise<UserProfileId | null>;
function checkGroupRole(userId: AuthUserId, groupId: string, role: string): Promise<boolean>;
function createPost(authorId: UserProfileId, content: string): Promise<Post>;
```

## 5. 異常系の確定

### 5.1 `active_profile_id` 欠損

**状況**: `root_accounts.active_profile_id` が NULL
**原因**: 初期化失敗、手動削除、FK制約なしでの profile 削除

**対処**:
- RBAC: deny-by-default（全ての権限チェックで false を返す）
- UI: エラーメッセージ「プロフィールが設定されていません」を表示
- 復旧: ghost profile を再作成し、active_profile_id に設定

```typescript
// rbac-helper.ts の実装
export const getUserProfileId = cache(async (userId: string): Promise<string | null> => {
  const result = await db.select({ userProfileId: userProfiles.id })
    .from(rootAccounts)
    .innerJoin(userProfiles, and(
      eq(rootAccounts.activeProfileId, userProfiles.id),
      eq(userProfiles.rootAccountId, rootAccounts.id)
    ))
    .where(eq(rootAccounts.authUserId, userId))
    .limit(1);

  return result[0]?.userProfileId || null; // NULL なら全ての権限を拒否
});
```

### 5.2 参照切れ

**状況**: `active_profile_id` が存在するが、該当 profile が削除済み
**原因**: FK 制約がない状態での profile 削除

**対処**:
- **短期対策**: JOIN 失敗時は NULL として扱う（上記コードで対応済み）
- **長期対策**: FK 制約を追加（ON DELETE SET NULL）
- **データ修復**: Migration で不整合データを検出・修正

```sql
-- データ修復クエリ例
UPDATE root_accounts
SET active_profile_id = NULL
WHERE active_profile_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.id = root_accounts.active_profile_id
  );
```

### 5.3 同時更新競合

**状況**: 複数セッションで同時に active_profile_id を更新
**原因**: トランザクション分離レベルが READ COMMITTED（デフォルト）

**対処**:
- **楽観的ロック**: `updated_at` を使用した比較更新（上記 2.3 参照）
- **エラーハンドリング**: 競合時はユーザーに再試行を促す
- **UI設計**: 仮面切替は基本的に単一セッションでの操作を想定（複数デバイスでの同時切替は稀）

## 6. チェックリスト（実装確認用）

- [x] `setup-root-account.ts` で ghost profile 作成後に active_profile_id を設定
- [x] `rbac-helper.ts` で active_profile_id を使用した profile id 解決
- [ ] `root_accounts.active_profile_id` に FK 制約を追加（ON DELETE SET NULL）
- [ ] 既存データの整合性確認（active_profile_id が NULL または参照切れのデータを修復）
- [ ] Branded Types の導入（TypeScript型安全性の強化）
- [ ] 仮面切替 Server Action の実装（`switchProfile()`）
- [ ] 仮面切替時の楽観的ロック実装
- [ ] エラーハンドリングの統一（active_profile_id 欠損、参照切れ、競合）

## 7. 参考資料

- [Better Auth Documentation](https://www.better-auth.com/docs)
- [Drizzle ORM - Foreign Keys](https://orm.drizzle.team/docs/foreign-keys)
- [PostgreSQL - Check Constraints](https://www.postgresql.org/docs/current/ddl-constraints.html)
- スキーマ定義: `src/lib/db/schema.postgres.ts`
- 認証設定: `src/lib/auth.ts`
- RBAC実装: `src/lib/auth/rbac-helper.ts`

---

**作成日**: 2026-03-02
**最終更新**: 2026-03-02
**バージョン**: 1.0.0
