# アプリケーション基本アーキテクチャ：3層ユーザーモデル

**バージョン**: 1.0  
**最終更新**: 2026年3月1日  
**ステータス**: ✅ 確定・本番対応

---

## 🎯 基本原則

このアプリケーションのユーザー体系は、以下の3層に厳密に分離することで、
**認証・ビジネスロジック・プロフィール管理**の関心事を完全に独立させます。

```
┌─────────────────────────────────────────────────────┐
│ Layer 1: Authentication (Better Auth)               │
│ users (id: text)                                    │
│ - email, name, image                                │
│ - role (platform_admin | user)                      │
│ - 認証・セッション管理                              │
└─────────────────────────────────────────────────────┘
           │ 1:1 unique
           ↓
┌─────────────────────────────────────────────────────┐
│ Layer 2: RBAC Foundation (Business Logic)           │
│ rootAccounts (id: uuid, authUserId: text UNIQUE)    │
│ - points, level, trustDays                          │
│ - RBAC の基本単位                                   │
│ - 1ユーザー = 1 rootAccount                         │
└─────────────────────────────────────────────────────┘
           │ 1:many
           ↓
┌─────────────────────────────────────────────────────┐
│ Layer 3: Profile & Manifestation                    │
│ userProfiles (id: uuid, rootAccountId: uuid)        │
│ - displayName, avatar, bio等                        │
│ - mask_category: "ghost" | "persona"                │
│ - 1 rootAccount = N(複数) userProfiles              │
│ - デフォルト: 幽霊の仮面（ghost）                   │
└─────────────────────────────────────────────────────┘
```

---

## 📋 各層の責務

### Layer 1: Users（認証層）

**DB テーブル**: `user` (Better Auth standard)

**カラム**:
- `id` (text, PK): ユーザーの一意識別子（Better Auth管理）
- `email` (text, unique): ログイン用メールアドレス
- `name` (text): 表示名（基本）
- `image` (text): プロフィール画像 URL
- `role` (text): プラットフォームロール
  - `"user"`: 通常ユーザー
  - `"platform_admin"`: プラットフォーム管理者
- `emailVerified` (boolean): メール検証済みフラグ
- `banned` (boolean): ユーザーバンフラグ
- `isAnonymous` (boolean): 匿名ユーザーフラグ

**責務**:
- ✅ OAuth 認証（Google, GitHub）
- ✅ セッション管理
- ✅ メールアドレス一意性管理
- ❌ ビジネスロジック（RBAC等）
- ❌ プロフィール情報（userProfiles で管理）

**設計の意図**:
- Better Auth が提供する標準スキーマに準拠
- 認証とビジネスロジックの関心事分離
- users テーブルは拡張しない（カラムを追加しない）

---

### Layer 2: Root Accounts（RBAC 基礎層）

**DB テーブル**: `root_accounts`

**カラム**:
- `id` (uuid, PK): rootAccount の一意識別子
- `authUserId` (text, FK to users.id, UNIQUE): Better Auth ユーザー ID
  - UNIQUE 制約: 1ユーザー = 1 rootAccount
- `points` (integer, default: 3000): ユーザーの基本ポイント
- `level` (integer, default: 1): ユーザーレベル
- `trustDays` (integer, default: 0): 信頼スコア（日数）
- `dataRetentionDays` (integer, default: 30): データ保持期間
- `createdAt`, `updatedAt`: タイムスタンプ

**責務**:
- ✅ RBAC（Role-Based Access Control）の基本単位
- ✅ ユーザーの経済指標（ポイント、レベル）
- ✅ ユーザー信頼スコア
- ❌ プロフィール情報（userProfiles で管理）
- ❌ 認証（users に委譲）

**設計の意図**:
- Better Auth の users と ビジネスロジックの「つなぎ役」
- authUserId で users と連携（1:1）
- userProfiles の親テーブル（1:many）

---

### Layer 3: User Profiles（プロフィール層）

**DB テーブル**: `user_profiles`

**カラム**:
- `id` (uuid, PK): userProfile の一意識別子
- `rootAccountId` (uuid, FK to rootAccounts.id, non-unique): 所属する rootAccount
  - ⚠️ 非 UNIQUE: 1 rootAccount が複数のプロフィールを持つ可能
- `displayName` (text): 表示名（プロフィール個別）
- `purpose` (text): プロフィールの目的（例：「ビジネスパートナー募集」）
- `roleType` (text, enum: leader|member|admin|mediator): ロールタイプ
- `isActive` (boolean, default: true): アクティブフラグ
- **`maskCategory`** (enum: "ghost" | "persona", default: "persona"):
  - **"ghost"** (幽霊の仮面):
    - 📍 デフォルトプロフィール（サインアップ時に自動作成）
    - 👁️ 観測者ロール（読み取り専用）
    - ✅ 自身のルートアカウント設定編集
    - ❌ インタラクション禁止:
      - ❌ 他者への評価（ティア付与）
      - ❌ コメント投稿
      - ❌ 作品投稿
      - ❌ グループ/国参加
  - **"persona"** (ペルソナ):
    - 🎭 複数化可能（ユーザーが作成）
    - 🎬 受肉ロール（フル機能）
    - ✅ すべてのインタラクション可能
- `avatarUrl`, `externalLinks`, `purposes` 等: プロフィールカスタマイズ

**責務**:
- ✅ ユーザープロフィール情報
- ✅ 仮面（マスク）の区分
- ✅ プロフィール個別設定
- ❌ 認証（users に委譲）
- ❌ RBAC 親管理（rootAccounts に委譲）

**設計の意図**:
- 1ユーザーが複数のプロフィール（仮面）を持ち、活動を使い分ける
- 幽霊の仮面：観察メインのユーザー向け
- ペルソナ：能動的な活動向け

---

## 🔑 主要な関連性

### Foreign Key Chains

```
users.id (text)
  ↓ FK: rootAccounts.authUserId (UNIQUE)
rootAccounts.id (uuid)
  ↓ FK: userProfiles.rootAccountId (non-unique)
userProfiles.id (uuid)
  ↓ Referenced by: (すべての RBAC テーブル)
    ├─ groupMembers.userProfileId
    ├─ relationships.userProfileId / targetProfileId
    ├─ businessCards.userProfileId
    ├─ notifications.userProfileId
    └─ その他
```

### データフロー

```
サインアップ → users 作成 → rootAccounts 作成 → userProfiles 作成（ghost）
       ↓
ログイン → users.id で認証 → セッション生成
       ↓
アクション → Session.user.id → rootAccounts へのルックアップ → userProfiles へのルックアップ
       ↓
RBAC チェック → mask_category チェック → インタラクション許可/拒否
```

---

## ⚙️ 実装ルール

### 絶対に守ること

1. **users テーブルの拡張禁止**
   - ❌ ビジネスロジックカラムを追加しない
   - ✅ userProfiles に追加する

2. **ID 型の混在禁止**
   - ❌ users.id (text) を直接 groupMembers.userProfileId (uuid) に参照させない
   - ✅ 必ず rootAccounts → userProfiles を経由
   - ✅ `getUserProfileId(userId: string)` 変換関数を使用

3. **幽霊の仮面の特別扱い**
   - ✅ サインアップ時に自動作成（maskCategory = "ghost"）
   - ✅ すべての Server Action でインタラクション時に `checkInteractionAllowed()` 実行
   - ❌ Proxy では認可チェック実施しない

4. **認可ロジックの一元化**
   - ✅ Server Action でのみ RBAC チェック実施
   - ✅ Proxy はルーティング + 認証チェックのみ
   - ❌ Proxy で `checkGroupRole()` 等を実行しない

5. **キャッシュの活用**
   - ✅ React `cache()` で userId → userProfileId 変換をキャッシュ
   - ✅ 同一リクエスト内での DB 重複発行を防止
   - ✅ `_getUserProfileIdInternal()`, `getMaskCategory()` をタイプキャッシュ関数として使用

---

## 📊 スキーマ仕様

### users
```sql
CREATE TABLE "user" (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  email_verified BOOLEAN DEFAULT false NOT NULL,
  image TEXT,
  role TEXT,
  banned BOOLEAN DEFAULT false,
  ban_reason TEXT,
  ban_expires TIMESTAMP,
  is_anonymous BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

### rootAccounts
```sql
CREATE TABLE root_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id TEXT NOT NULL,
  points INTEGER DEFAULT 3000 NOT NULL,
  level INTEGER DEFAULT 1 NOT NULL,
  trust_days INTEGER DEFAULT 0 NOT NULL,
  data_retention_days INTEGER DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  
  UNIQUE(auth_user_id),
  FOREIGN KEY (auth_user_id) REFERENCES "user"(id) ON DELETE CASCADE,
  CHECK (points >= 0),
  CHECK (level >= 1),
  CHECK (trust_days >= 0)
);
```

### userProfiles
```sql
CREATE TYPE mask_category AS ENUM('ghost', 'persona');

CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  root_account_id UUID NOT NULL,
  display_name TEXT NOT NULL,
  purpose TEXT,
  role_type TEXT DEFAULT 'member' NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  mask_category mask_category DEFAULT 'persona' NOT NULL,
  last_interacted_record_id UUID,
  profile_format TEXT DEFAULT 'profile',
  role TEXT DEFAULT 'member',
  purposes TEXT[] DEFAULT '{}',
  profile_type TEXT DEFAULT 'self',
  avatar_url TEXT,
  external_links JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  
  FOREIGN KEY (root_account_id) REFERENCES root_accounts(id) ON DELETE CASCADE,
  CHECK (role_type = ANY (ARRAY['leader'::text, 'member'::text, 'admin'::text, 'mediator'::text]))
);

CREATE INDEX idx_user_profiles_root_account_id ON user_profiles(root_account_id);
```

---

## 🔐 セキュリティガイドライン

### 認証 vs 認可

| 層 | 責務 | 実装場所 |
|---|------|---------|
| **認証** | ユーザーが本人か検証 | Proxy + Server Action |
| **認可** | ユーザーが操作権を持つか検証 | **Server Action のみ** |

### RBAC チェック順序

1. **セッション確認**: `if (!session?.user?.id) return false;`
2. **プラットフォーム管理者チェック**: `if (session.user.role === 'platform_admin') return true;`
3. **幽霊の仮面チェック**: `await checkInteractionAllowed(session)` ← インタラクション時は必須
4. **ビジネスロジック**: `await checkGroupRole(session, groupId, 'leader')`

### 幽霊の仮面チェック関数

```typescript
// src/lib/auth/rbac-helper.ts
export async function checkInteractionAllowed(session: AuthSession | null): Promise<boolean>
// - true: インタラクション可能（ペルソナ）
// - false: インタラクション禁止（幽霊）
```

**使用例**:
```typescript
export async function createComment(content: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  
  // 幽霊の仮面はコメント投稿不可
  const canInteract = await checkInteractionAllowed(session);
  if (!canInteract) {
    throw new Error('Ghost masks can only observe. Cannot create comment.');
  }
  
  // ... コメント作成ロジック
}
```

---

## 📝 よくある実装パターン

### パターン 1: 所有権チェック

```typescript
export async function editUserProfile(profileId: string, displayName: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  
  // Step 1: 認証確認
  if (!session?.user?.id) throw new Error('Unauthorized');
  
  // Step 2: プロフィール取得
  const profile = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.id, profileId))
    .limit(1)
    .then(rows => rows[0]);
  
  if (!profile) throw new Error('Profile not found');
  
  // Step 3: 所有権確認（userId → rootAccountId → userProfileId）
  const userProfileId = await getUserProfileId(session.user.id);
  if (profile.id !== userProfileId) {
    throw new Error('Unauthorized: not your profile');
  }
  
  // Step 4: 更新実行
  await db.update(userProfiles).set({ displayName }).where(eq(userProfiles.id, profileId));
}
```

### パターン 2: インタラクション禁止チェック

```typescript
export async function rateUser(targetUserId: string, rating: number) {
  const session = await auth.api.getSession({ headers: await headers() });
  
  // 幽霊の仮面は他者評価不可
  const canInteract = await checkInteractionAllowed(session);
  if (!canInteract) {
    throw new Error('Ghost masks cannot rate other users.');
  }
  
  // ... 評価ロジック
}
```

### パターン 3: グループロール チェック

```typescript
export async function deleteGroup(groupId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  
  // Step 1: 削除権限チェック（leader のみ）
  const isLeader = await checkGroupRole(session, groupId, 'leader');
  if (!isLeader) {
    throw new Error('Unauthorized: leader role required');
  }
  
  // ... 削除ロジック
}
```

---

## 🚀 デプロイ前チェックリスト

- [ ] users テーブルにビジネスロジックカラムが追加されていない
- [ ] すべての RBAC テーブルが userProfiles.id を参照している
- [ ] Proxy に `checkGroupRole()` 等の RBAC チェック機能が存在しない
- [ ] すべてのインタラクション Server Action が `checkInteractionAllowed()` を実行
- [ ] `getUserProfileId()` 変換関数を使用している
- [ ] テスト: `src/__tests__/rbac-authorization.test.ts` が全パス
- [ ] ビルド: `pnpm build` が成功

---

## 📚 関連ドキュメント

- [RBAC 設計書](./rbac-group-nation-separation.md)
- [セッション管理](./auth-session-design.md)
- [テスト戦略](./testing-strategy.md)

---

## 版履歴

| バージョン | 日付 | 変更内容 |
|-----------|------|---------|
| 1.0 | 2026-03-01 | 初版：3層アーキテクチャ確定 |
