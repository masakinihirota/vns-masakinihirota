# VNS 正しいスキーマ設計書（複数仮面対応版）

**作成日**: 2026-03-01
**設計方針**: VNS の「1ルートアカウント = 複数の仮面」を実現

---

## 📋 設計思想

### コア概念
1. **Better Auth User**: 認証情報のみを管理（メール、パスワード等）
2. **Root Account**: ユーザーの「魂の本体」、複数の仮面を管理
3. **User Profile (仮面)**: ルートアカウントが被る役割、複数作成可能
4. **Ghost (幽霊)**: デフォルトの仮面、観測者ロール

### 権限モデル
```
幽霊（Ghost）:
  - 自己管理: ✅ ルートアカウント設定編集可
  - 世界干渉: ❌ 他者評価、コメント、作品投稿不可

ペルソナ（Persona）:
  - 自己管理: ✅ プロフィール編集可
  - 世界干渉: ✅ すべてのインタラクション可能
```

---

## 🗄️ テーブル構造

### 1. users (Better Auth)
```typescript
users {
  id: text (PK)              // Better Auth が生成
  email: text (UNIQUE)
  name: text
  emailVerified: boolean
  image: text
  role: text                 // platform_admin | null
  createdAt: timestamp
  updatedAt: timestamp
}
```

**責務**: 認証情報のみ

---

### 2. rootAccounts
```typescript
rootAccounts {
  id: uuid (PK)
  authUserId: text (FK → users.id, UNIQUE)      // 1:1 関係
  activeProfileId: uuid (FK → userProfiles.id)  // 現在被っている仮面
  createdAt: timestamp
  updatedAt: timestamp
}
```

**責務**:
- Better Auth User とアプリ層の橋渡し
- 複数の仮面を管理
- 現在アクティブな仮面を追跡

**制約**:
- UNIQUE(authUserId): 1 user = 1 rootAccount
- activeProfileId は必ず rootAccount に属する userProfile を指す

---

### 3. userProfiles (複数の仮面)
```typescript
userProfiles {
  id: uuid (PK)
  rootAccountId: uuid (FK → rootAccounts.id)  // 1:N 関係

  // 仮面の種類
  maskCategory: text ('ghost' | 'persona')    // デフォルト: 'persona'
  isDefault: boolean                          // システム生成の幽霊かどうか

  // プロフィール情報
  displayName: text
  avatarUrl: text
  bio: text

  // ゲーミフィケーション
  points: integer (DEFAULT 0)
  level: integer (DEFAULT 1)

  createdAt: timestamp
  updatedAt: timestamp
}
```

**責務**:
- ユーザーの「顔」を表現
- グループ、国、関係性の主体

**制約**:
- rootAccountId ごとに複数の userProfile が存在可能
- isDefault = true の profile は rootAccount につき1つのみ（幽霊）

**インデックス**:
```sql
CREATE INDEX idx_userprofiles_rootaccountid ON user_profiles(root_account_id);
CREATE INDEX idx_userprofiles_maskcategory ON user_profiles(mask_category);
```

---

### 4. groupMembers, nationMembers, relationships

```typescript
groupMembers {
  groupId: uuid (FK → groups.id)
  userProfileId: uuid (FK → userProfiles.id)  // ← 仮面で参加
  role: text ('leader' | 'sub_leader' | 'mediator' | 'member')
  joinedAt: timestamp

  PRIMARY KEY (groupId, userProfileId)
}

relationships {
  userProfileId: uuid (FK → userProfiles.id)      // 主体の仮面
  targetProfileId: uuid (FK → userProfiles.id)    // 対象の仮面
  relationship: text ('friend' | 'follow' | 'mute' | 'block')
  createdAt: timestamp

  PRIMARY KEY (userProfileId, targetProfileId, relationship)
}
```

**設計意図**:
- グループへの参加は「仮面単位」
- 仮面Aと仮面Bは別人として扱われる
- 同じユーザー（rootAccount）が別の仮面で同じグループに参加可能

---

## 🔄 データフロー

### 1. 新規ユーザー登録時
```typescript
// Step 1: Better Auth がユーザー作成
const user = await betterAuth.createUser({ email, password });

// Step 2: rootAccount 作成
const rootAccount = await db.insert(rootAccounts).values({
  authUserId: user.id,
}).returning();

// Step 3: デフォルトの幽霊プロフィール作成
const ghostProfile = await db.insert(userProfiles).values({
  rootAccountId: rootAccount.id,
  maskCategory: 'ghost',
  displayName: '観測者',
  isDefault: true,
}).returning();

// Step 4: activeProfileId を幽霊に設定
await db.update(rootAccounts)
  .set({ activeProfileId: ghostProfile.id })
  .where(eq(rootAccounts.id, rootAccount.id));
```

### 2. 仮面の作成
```typescript
async function createPersonaMask(
  rootAccountId: string,
  displayName: string,
  avatarUrl?: string
) {
  // 仮面数制限チェック（例: 最大5個）
  const existingMasks = await db
    .select({ count: sql`count(*)` })
    .from(userProfiles)
    .where(eq(userProfiles.rootAccountId, rootAccountId));

  if (existingMasks[0].count >= 5) {
    throw new Error('Maximum 5 masks per account');
  }

  // ペルソナ作成
  return await db.insert(userProfiles).values({
    rootAccountId,
    maskCategory: 'persona',
    displayName,
    avatarUrl,
    isDefault: false,
  }).returning();
}
```

### 3. 仮面の切り替え
```typescript
async function switchMask(
  session: AuthSession,
  targetProfileId: string
) {
  // rootAccount 取得
  const rootAccount = await db
    .select()
    .from(rootAccounts)
    .where(eq(rootAccounts.authUserId, session.user.id))
    .limit(1);

  if (!rootAccount) throw new Error('Root account not found');

  // targetProfile が rootAccount に属しているか検証
  const profile = await db
    .select()
    .from(userProfiles)
    .where(
      and(
        eq(userProfiles.id, targetProfileId),
        eq(userProfiles.rootAccountId, rootAccount.id)
      )
    )
    .limit(1);

  if (!profile) throw new Error('Profile not found or unauthorized');

  // activeProfileId 更新
  await db
    .update(rootAccounts)
    .set({ activeProfileId: targetProfileId })
    .where(eq(rootAccounts.id, rootAccount.id));

  // Session 更新（Next.js 16 の session API で実装）
  // session.update({ activeProfileId: targetProfileId });
}
```

### 4. RBAC での権限チェック
```typescript
// Session に activeProfileId を含める
type AuthSession = {
  user: {
    id: string;              // users.id (Better Auth)
    email: string;
    role: string;
    activeProfileId: string; // 現在の仮面
  };
};

// 権限チェック（簡略化版）
async function checkGroupRole(
  session: AuthSession,
  groupId: string,
  requiredRole: GroupRole
): Promise<boolean> {
  // activeProfileId で直接検索（3層JOIN 不要）
  const member = await db
    .select()
    .from(groupMembers)
    .where(
      and(
        eq(groupMembers.userProfileId, session.user.activeProfileId),
        eq(groupMembers.groupId, groupId)
      )
    )
    .limit(1);

  if (!member) return false;

  return hasRoleOrHigher(member.role, requiredRole);
}
```

---

## 🛡️ セキュリティと制約

### 1. 幽霊状態の制限
```typescript
async function checkInteractionAllowed(session: AuthSession): Promise<boolean> {
  // activeProfileId から maskCategory を取得
  const profile = await db
    .select({ maskCategory: userProfiles.maskCategory })
    .from(userProfiles)
    .where(eq(userProfiles.id, session.user.activeProfileId))
    .limit(1);

  if (profile[0]?.maskCategory === 'ghost') {
    throw new RBACError(
      '観測者は世界に干渉できません。',
      'GHOST_MASK_INTERACTION_DENIED'
    );
  }

  return true;
}

// Server Actions で使用
export async function createGroup(data: CreateGroupInput) {
  const session = await getSession();

  // 幽霊チェック
  await checkInteractionAllowed(session);  // ← ここで弾く

  // グループ作成処理...
}
```

### 2. 仮面の削除制限
```typescript
async function deletePersonaMask(profileId: string) {
  // デフォルトの幽霊は削除不可
  const profile = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.id, profileId))
    .limit(1);

  if (profile[0]?.isDefault) {
    throw new Error('Cannot delete default ghost profile');
  }

  // 関連データのクリーンアップ（CASCADE で自動削除）
  await db.delete(userProfiles).where(eq(userProfiles.id, profileId));
}
```

---

## 📊 パフォーマンス最適化

### 1. Session キャッシュの活用
```typescript
// Session に activeProfileId を含めることで、
// 毎回 rootAccounts テーブルを検索する必要がなくなる
session.user.activeProfileId;  // ← これを使う
```

### 2. React cache() の活用
```typescript
const _getActiveProfile = cache(async (activeProfileId: string) => {
  return await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.id, activeProfileId))
    .limit(1);
});

// 同一リクエスト内で何度呼び出してもDB接続は1回のみ
```

---

## ✅ 実装チェックリスト

### Phase 1: スキーマ修正
- [ ] users テーブルから displayName, maskCategory 等を削除（誤った拡張を修正）
- [ ] rootAccounts に activeProfileId カラムを追加
- [ ] userProfiles に isDefault カラムを追加

### Phase 2: Session 拡張
- [ ] AuthSession 型に activeProfileId を追加
- [ ] Better Auth callbacks で activeProfileId を session に保存

### Phase 3: RBAC 簡略化
- [ ] _getUserProfileIdInternal() を session.user.activeProfileId に置き換え
- [ ] checkGroupRole 等で 3層JOIN を削除

### Phase 4: 幽霊システム実装
- [ ] checkInteractionAllowed() の実装
- [ ] 幽霊判定ロジックの実装
- [ ] Server Actions に幽霊チェックを追加

---

**設計レビュー**: GitHub Copilot
**更新日**: 2026-03-01
