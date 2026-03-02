# スキーマ設計修正計画（VNS 複数仮面対応版）

## ⚠️ 重要な修正
**以前の統合計画は誤りでした。VNS の設計思想「1ルートアカウント = 複数の仮面」に反していました。**

## 正しい目的
users（Better Auth）→ rootAccounts → userProfiles の3層構造を**維持**し、
複数の仮面（プロフィール）を管理できる設計を実現します。

## 現在の構造（維持すべき正しい設計）
```
users (Better Auth) [text id]
  ↓ 1:1
rootAccounts [uuid id]
  ├─ authUserId: text → users.id
  ├─ activeProfileId: uuid → userProfiles.id (現在被っている仮面)
  └─ createdAt, updatedAt
  ↓ 1:N
userProfiles [uuid id]
  ├─ rootAccountId: uuid → rootAccounts.id
  ├─ maskCategory: 'ghost' | 'persona'
  ├─ displayName: text
  ├─ avatarUrl: text
  ├─ isDefault: boolean (デフォルトの幽霊かどうか)
  └─ createdAt, updatedAt
  ↓
groupMembers, nationMembers, relationships（userProfiles.id で参照）
```

## VNS コア機能の実現

### 1. 仮面の切り替え（Mask Switching）
```typescript
async function switchMask(rootAccountId: string, targetProfileId: string) {
  // 権限チェック: targetProfile が rootAccount に属しているか
  const profile = await db
    .select()
    .from(userProfiles)
    .where(
      and(
        eq(userProfiles.id, targetProfileId),
        eq(userProfiles.rootAccountId, rootAccountId)
      )
    )
    .limit(1);

  if (!profile) throw new Error('Profile not found');

  // アクティブプロフィールを更新
  await db
    .update(rootAccounts)
    .set({ activeProfileId: targetProfileId })
    .where(eq(rootAccounts.id, rootAccountId));
}
```

### 2. 幽霊状態の判定
```typescript
async function isGhostMask(session: AuthSession): Promise<boolean> {
  // session から activeProfileId を取得
  const activeProfileId = session.user.activeProfileId;

  const profile = await db
    .select({ maskCategory: userProfiles.maskCategory })
    .from(userProfiles)
    .where(eq(userProfiles.id, activeProfileId))
    .limit(1);

  return profile[0]?.maskCategory === 'ghost';
}
```

### 3. インタラクション制限（幽霊 vs ペルソナ）
```typescript
async function checkInteractionAllowed(session: AuthSession): Promise<boolean> {
  if (session.user.role === 'platform_admin') return true;

  const isGhost = await isGhostMask(session);

  // 幽霊はインタラクション不可
  if (isGhost) {
    throw new RBACError(
      '観測者は世界に干渉できません。仮面を被ってください。',
      'GHOST_MASK_INTERACTION_DENIED'
    );
  }

  return true;
}
```

## 実装ステップ

### Step 1: Schema 定義を修正 (v0.45.1 Drizzle ORM)

**修正対象**: src/lib/db/schema.postgres.ts

**追加カラム** (users テーブルに):
```typescript
users = pgTable("user", {
  // ... 既存フィールド ...

  // App層フィールド（新規）
  displayName: text("display_name").default("Anonymous"),
  avatarUrl: text("avatar_url"),
  maskCategory: text("mask_category").default("persona"), // 'ghost' | 'persona'
  points: integer("points").default(0),
  level: integer("level").default(1),

  // ... created_at, updated_at ...
});
```

**削除テーブル**:
- `rootAccounts` テーブル全削除
- `userProfiles` テーブル全削除

**参照更新**:
- `groupMembers.userProfileId` → `groupMembers.userProfileId` (text型に変更)
- `nationMembers.userProfileId` → `nationMembers.userProfileId` (text型に変更)
- `relationships.userProfileId` → `relationships.userProfileId` (text型に変更)
- `relationships.targetProfileId` → `relationships.targetProfileId` (text型に変更)

### Step 2: Migration SQL を作成

**ファイル**: drizzle/[timestamp]_schema_integration.sql

**内容**:
```sql
-- Step 1: users テーブルに新しいカラムを追加
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "display_name" TEXT DEFAULT 'Anonymous';
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "avatar_url" TEXT;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "mask_category" TEXT DEFAULT 'persona';
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "points" INTEGER DEFAULT 0;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "level" INTEGER DEFAULT 1;

-- Step 2: userProfiles のデータを users に migrate
UPDATE "user" u
SET
  display_name = COALESCE(up.display_name, 'Anonymous'),
  avatar_url = up.avatar_url,
  mask_category = COALESCE(up.mask_category, 'persona'),
  points = COALESCE(up.points, 0),
  level = COALESCE(up.level, 1)
FROM "user_profiles" up
JOIN "root_accounts" ra ON up.root_account_id = ra.id
WHERE u.id = ra.auth_user_id;

-- Step 3: groupMembers, nationMembers, relationships の FK を text型に更新
ALTER TABLE "group_members"
  ALTER COLUMN "user_profile_id" TYPE text USING user_profile_id::text;

-- FK 制約を users.id に変更
ALTER TABLE "group_members"
  DROP CONSTRAINT IF EXISTS "group_members_user_profile_id_fky";
ALTER TABLE "group_members"
  ADD CONSTRAINT "group_members_user_id_fky"
  FOREIGN KEY ("user_profile_id") REFERENCES "user"(id) ON DELETE CASCADE;

-- 同様に nationMembers も更新
ALTER TABLE "nation_members"
  ALTER COLUMN "user_profile_id" TYPE text USING user_profile_id::text;
ALTER TABLE "nation_members"
  DROP CONSTRAINT IF EXISTS "nation_members_user_profile_id_fky";
ALTER TABLE "nation_members"
  ADD CONSTRAINT "nation_members_user_id_fky"
  FOREIGN KEY ("user_profile_id") REFERENCES "user"(id) ON DELETE CASCADE;

-- Step 4: relationships テーブルの FK を更新
ALTER TABLE "relationships"
  ALTER COLUMN "user_profile_id" TYPE text;
ALTER TABLE "relationships"
  ALTER COLUMN "target_profile_id" TYPE text;

ALTER TABLE "relationships"
  DROP CONSTRAINT IF EXISTS "relationships_user_profile_id_fky";
ALTER TABLE "relationships"
  DROP CONSTRAINT IF EXISTS "relationships_target_profile_id_fky";

ALTER TABLE "relationships"
  ADD CONSTRAINT "relationships_user_id_fky"
  FOREIGN KEY ("user_profile_id") REFERENCES "user"(id) ON DELETE CASCADE;
ALTER TABLE "relationships"
  ADD CONSTRAINT "relationships_target_user_id_fky"
  FOREIGN KEY ("target_profile_id") REFERENCES "user"(id) ON DELETE CASCADE;

-- Step 5: 古いテーブルを削除（または非推奨化）
DROP TABLE IF EXISTS "user_profiles" CASCADE;
DROP TABLE IF EXISTS "root_accounts" CASCADE;
```

### Step 3: 型定義を更新

**ファイル**: src/lib/auth/types.ts

修正対象の型:
- `AuthSession` - userProfiles 参照の削除
- `RBACContext` - userProfileId → userId に変更
- その他すべての userProfileId 参照を userId に変更

### Step 4: RBAC ヘルパーを簡略化

**ファイル**: src/lib/auth/rbac-helper.ts

修正:
- `_getUserProfileIdInternal()` → 不要（userId が直接使用可能）
- `groupMembers` クエリの JOIN 削除
- `nationMembers` クエリの JOIN 削除
- `relationships` クエリの型チェック簡略化

**修正後の getUserProfileId**:
```typescript
// ✅ 簡略化版（このファイルは削除可能）
export async function getUserProfileId(userId: string): Promise<string | null> {
  // ユーザーIDは users.id そのもの
  // 存在確認のみが必要な場合は DB 確認
  return userId;  // または DB接続確認を実施
}
```

### Step 5: データベースファイルを更新

**ファイル**: drizzle/relations.ts

修正:
- userProfiles relations 削除
- rootAccounts relations 削除
- groupMembers.user 参照を直接 users に変更
- etc.

---

## 実装の注意点

### ⚠️ マイグレーション前にバックアップ

```bash
# 本番環境前に必ずバックアップ
pg_dump vns_db > backup_$(date +%Y%m%d_%H%M%S).sql
```

### 🚀 段階的実装

1. **マイグレーション前**: スキーマ定義を先に修正
2. **マイグレーション実行**: 慎重に実施
3. **検証**: すべてのテストが通ることを確認
4. **デプロイ**: 本番環境に適用

### ✅ テスト戦略

```typescript
// 修正後のテストは以下を確認
1. users.displayName が正しく設定される
2. groupMembers.userProfileId が text型で users.id を参照
3. relationships が users.id で正引用
4. RBAC 権限チェックが正常に動作
5. キャッシュが正しく機能
```

---

## 予想される影響

| 項目 | 現在 | 修正後 |
|------|------|--------|
| **3層JOIN** | users → rootAccounts → userProfiles | users（直接） |
| **クエリ数** | 毎回3層JOIN | 1層JOIN or 0 |
| **ID型の混在** | text (users) vs uuid (userProfiles) | text で統一 |
| **テーブル数** | 25+ | 23 (2削除) |
| **FK制約** | 複雑 | 簡潔 |

---

## 予想完了時間

- スキーマ修正: 1h
- Migration作成: 1h
- テスト・検証: 1h
- **合計: 3時間**

