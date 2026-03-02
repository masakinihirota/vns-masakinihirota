# 組織（Group）と国（Nation）の分離モデル

> **作成日**: 2026-02-28
> **目的**: 組織と国を別エンティティとして管理し、ボトムアップとトップダウンの生成フローを明確にする

---

## 📋 概要

このドキュメントは、**組織（Group）**と**国（Nation）**を明確に分離し、それぞれ異なる目的・生成フロー・権限管理を持つ独立したエンティティとして定義します。

---

## 🏢 組織（Group）の定義

### 目的

**組織（Group）は、同じ価値観の人が集まり、一緒に何かをする実行単位です。**

- **実行単位**: 具体的なプロジェクトやタスクを遂行する
- **価値観の共有**: メンバー間で共通の価値観・目標を持つ
- **ボトムアップ**: ユーザーが自発的に作成し、メンバーを集める

### 組織の生成フロー（ボトムアップ）

```
1. ユーザーがプロフィールを作成
   ├─ 価値観マップを入力（興味・スキル・目標など）
   └─ マッチングシステムに参加

2. 他ユーザーとマッチング
   ├─ 価値観の近いユーザーを自動推薦
   └─ 相互フォロー・関係性構築（`follow`, `friend` など）

3. 価値観が合うユーザーを組織メンバーとして参加
   ├─ 組織作成者が `group_leader` になる
   ├─ 招待されたユーザーは `group_member` としてjoin
   └─ 必要に応じて `group_sub_leader` や `group_mediator` を任命

4. 組織リーダーが組織運営
   ├─ 組織ポリシーの設定（公開/非公開、参加条件など）
   ├─ メンバーの管理（招待・除名・ロール変更）
   └─ プロジェクト・タスクの管理
```

### 組織のロール

| ロール | 説明 | 権限 |
|--------|------|------|
| `group_leader` | 組織リーダー | 組織のすべてを管理（ポリシー変更、メンバー管理、国作成など） |
| `group_sub_leader` | 組織サブリーダー | リーダーの補佐、一部の管理権限（メンバー招待など） |
| `group_member` | 組織メンバー | 組織内のプロジェクト・タスクに参加 |
| `group_mediator` | 組織調停者 | メンバー間の紛争調停、フィードバック収集 |

---

## 🌍 国（Nation）の定義

### 目的

**国（Nation）は、複数組織の人たちが交流し、連携を広げる上位コミュニティ単位です。**

- **上位コミュニティ**: 組織の集合体（組織間のネットワーク）
- **交流・連携**: 異なる組織間で知識・リソースを共有
- **トップダウン**: 組織リーダーが意思決定し、国を作成

### 国の生成フロー（トップダウン）

```
1. 組織リーダーが「国を作る」意思決定
   ├─ 自分の組織が一定規模に達した
   ├─ 他組織との連携の必要性を感じた
   └─ 国を作成する権限を持つ（`group_leader`）

2. 当該リーダーが `nation_leader` として国を作成
   ├─ 国の名前・説明・ポリシーを設定
   ├─ 自分の組織を国に参加させる（初期メンバー）
   └─ 国のビジョン・ミッションを定義

3. 他組織を招待し、参加組織を増やす
   ├─ 招待された組織のリーダーが承認
   ├─ 参加組織は `nation_member` として国に参加
   └─ 国内で共通のプロジェクトやイベントを開催

4. 国は参加組織の集合体として運営
   ├─ 国ポリシーの管理（`nation_leader` のみ）
   ├─ 組織間の調整（`nation_mediator` が担当）
   └─ 国全体のイベント・プロジェクトの企画
```

### 国のロール

| ロール | 説明 | 権限 |
|--------|------|------|
| `nation_leader` | 国リーダー | 国のすべてを管理（ポリシー変更、組織招待・除名など） |
| `nation_sub_leader` | 国サブリーダー | リーダーの補佐、一部の管理権限（組織招待など） |
| `nation_member` | 国メンバー | 国内のプロジェクト・イベントに参加（各組織のリーダー・メンバーが該当） |
| `nation_mediator` | 国調停者 | 組織間の紛争調停、フィードバック収集 |

---

## 🔑 組織と国の違い

| 観点 | 組織（Group） | 国（Nation） |
|------|--------------|--------------|
| **目的** | 実行単位（プロジェクト遂行） | 上位コミュニティ（組織間連携） |
| **メンバー** | 個人（ユーザー） | 組織（Groupの集合） |
| **生成フロー** | ボトムアップ（ユーザー主導） | トップダウ（組織リーダー主導） |
| **作成権限** | 認証済みユーザー全員 | `group_leader` のみ |
| **ロール** | `group_leader`, `group_member` など | `nation_leader`, `nation_member` など |
| **エンティティ** | `groups` テーブル | `nations` テーブル |
| **中間テーブル** | `group_members` (user ↔ group) | `nation_members` (group ↔ nation) |

---

## 🗂️ DBスキーマ設計

### 現状確認

- ✅ `user`, `session`, `account`, `verification` テーブルは既存（Better Auth）
- ❌ `groups` テーブル: **未作成**（月曜日以降のタスク）
- ❌ `nations` テーブル: **未作成**（月曜日以降のタスク）
- ❌ `group_members` 中間テーブル: **未作成**（月曜日以降のタスク）
- ❌ `nation_members` 中間テーブル: **未作成**（月曜日以降のタスク）

### 提案スキーマ（実装は月曜日以降）

#### 1. `groups` テーブル

```typescript
export const groups = pgTable(
  "groups",
  {
    id: text("id").primaryKey(), // UUID
    name: text("name").notNull(), // 組織名
    description: text("description"), // 組織説明
    createdBy: text("created_by")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }), // 作成者（最初の group_leader）
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    isPublic: boolean("is_public").default(true), // 公開/非公開
    policy: text("policy"), // 組織ポリシー（JSON）
  },
  (table) => [
    index("groups_createdBy_idx").on(table.createdBy),
  ]
);
```

#### 2. `group_members` 中間テーブル

```typescript
export const groupMembers = pgTable(
  "group_members",
  {
    id: text("id").primaryKey(), // UUID
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    groupId: text("group_id")
      .notNull()
      .references(() => groups.id, { onDelete: "cascade" }),
    role: text("role").notNull(), // 'group_leader', 'group_member', etc.
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
  },
  (table) => [
    index("group_members_userId_idx").on(table.userId),
    index("group_members_groupId_idx").on(table.groupId),
    index("group_members_role_idx").on(table.role),
  ]
);
```

#### 3. `nations` テーブル

```typescript
export const nations = pgTable(
  "nations",
  {
    id: text("id").primaryKey(), // UUID
    name: text("name").notNull(), // 国名
    description: text("description"), // 国説明
    createdBy: text("created_by")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }), // 作成者（最初の nation_leader）
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    isPublic: boolean("is_public").default(true), // 公開/非公開
    policy: text("policy"), // 国ポリシー（JSON）
  },
  (table) => [
    index("nations_createdBy_idx").on(table.createdBy),
  ]
);
```

#### 4. `nation_members` 中間テーブル

```typescript
export const nationMembers = pgTable(
  "nation_members",
  {
    id: text("id").primaryKey(), // UUID
    groupId: text("group_id")
      .notNull()
      .references(() => groups.id, { onDelete: "cascade" }), // 参加組織
    nationId: text("nation_id")
      .notNull()
      .references(() => nations.id, { onDelete: "cascade" }), // 国
    role: text("role").notNull(), // 'nation_leader', 'nation_member', etc.
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
  },
  (table) => [
    index("nation_members_groupId_idx").on(table.groupId),
    index("nation_members_nationId_idx").on(table.nationId),
    index("nation_members_role_idx").on(table.role),
  ]
);
```

---

## 🔒 RLSポリシー設計

### 組織（groups）のRLSポリシー

```sql
-- メンバーのみ自組織データ閲覧可
CREATE POLICY "group_members_read_own_group" ON groups
  FOR SELECT
  USING (
    -- プラットフォーム管理者はすべて閲覧可能
    auth.uid() IN (SELECT id FROM user WHERE role = 'platform_admin')
    OR
    -- 自分が所属する組織のみ閲覧可能
    id IN (
      SELECT group_id FROM group_members WHERE user_id = auth.uid()
    )
  );

-- リーダーのみ自組織データ更新可
CREATE POLICY "group_leaders_update_own_group" ON groups
  FOR UPDATE
  USING (
    -- プラットフォーム管理者はすべて更新可能
    auth.uid() IN (SELECT id FROM user WHERE role = 'platform_admin')
    OR
    -- 自分がリーダーを務める組織のみ更新可能
    id IN (
      SELECT group_id FROM group_members
      WHERE user_id = auth.uid() AND role = 'group_leader'
    )
  );
```

### 国（nations）のRLSポリシー

```sql
-- 参加組織のみ自国データ閲覧可
CREATE POLICY "nation_members_read_own_nation" ON nations
  FOR SELECT
  USING (
    -- プラットフォーム管理者はすべて閲覧可能
    auth.uid() IN (SELECT id FROM user WHERE role = 'platform_admin')
    OR
    -- 自分が所属する組織が参加する国のみ閲覧可能
    id IN (
      SELECT nation_id FROM nation_members
      WHERE group_id IN (
        SELECT group_id FROM group_members WHERE user_id = auth.uid()
      )
    )
  );

-- 国リーダーのみ自国データ更新可
CREATE POLICY "nation_leaders_update_own_nation" ON nations
  FOR UPDATE
  USING (
    -- プラットフォーム管理者はすべて更新可能
    auth.uid() IN (SELECT id FROM user WHERE role = 'platform_admin')
    OR
    -- 自分がリーダーを務める国のみ更新可能
    id IN (
      SELECT nation_id FROM nation_members
      WHERE group_id IN (
        SELECT group_id FROM group_members
        WHERE user_id = auth.uid() AND role = 'group_leader'
      )
      AND role = 'nation_leader'
    )
  );
```

---

## 🧪 Better Auth スキーマ整合性確認

### 確認コマンド

```bash
# Better Auth スキーマ整合性確認
pnpm db:auth:check

# 不整合がある場合は修復
pnpm db:auth:fix-compat

# Drizzle migration を生成（スキーマ作成後）
pnpm db:generate

# マイグレーション実行（既存DBは安全ラッパー経由）
pnpm db:migrate
```

### 注意事項

- Better Authのスキーマ（`user`, `session`, `account`, `verification`）と、アプリケーション固有のスキーマ（`groups`, `nations`）は**命名規則を統一**する必要があります。
- 特に `snake_case` と `camelCase` の混在を禁止します（混在すると OAuth で `column does not exist` エラーが発生）。

---

## 🚀 実装ステップ（月曜日以降）

### ステップ1: DBスキーマ作成

- [ ] `src/db/schema.ts` に `groups` テーブルを定義
- [ ] `src/db/schema.ts` に `group_members` 中間テーブルを定義
- [ ] `src/db/schema.ts` に `nations` テーブルを定義
- [ ] `src/db/schema.ts` に `nation_members` 中間テーブルを定義

### ステップ2: RLSポリシー定義

- [ ] `drizzle/rls-policies.sql` を更新
- [ ] groups テーブルのRLSポリシーを追加
- [ ] nations テーブルのRLSポリシーを追加
- [ ] group_members, nation_members のRLSポリシーを追加

### ステップ3: マイグレーション実行

- [ ] `pnpm db:generate` でマイグレーションファイル生成
- [ ] `pnpm db:migrate`（既存DBは安全ラッパー）でマイグレーション実行
- [ ] `pnpm db:auth:check` でBetter Authスキーマ整合性確認

### ステップ4: クエリ関数作成

- [ ] `src/lib/db/group-queries.ts` を作成
  - `createGroup(userId, name, description)`
  - `getGroupsByUser(userId)`
  - `updateGroupPolicy(groupId, policy)`
- [ ] `src/lib/db/nation-queries.ts` を作成
  - `createNation(groupLeaderId, name, description)`
  - `getNationsByGroup(groupId)`
  - `updateNationPolicy(nationId, policy)`

### ステップ5: テスト作成

- [ ] `src/lib/db/__tests__/group-queries.test.ts`
- [ ] `src/lib/db/__tests__/nation-queries.test.ts`

---

## 📚 関連ドキュメント

- [ルート・アクセスマトリクス](./rbac-route-matrix.md)（TODO#2で作成済み）
- [Server Action権限チェック仕様](./rbac-server-action-guard.md)（TODO#3で作成済み）
- [RBACテスト仕様](./test-specs/rbac-test-spec.md)（TODO#7で作成予定）
- [RoleType/RelationshipType型定義](../src/lib/auth/auth-types.ts)

---

## 💡 Tips

### 組織と国の分離理由

- **組織**: ユーザー自身が作り、メンバーを集めて活動する（実行単位）
- **国**: 組織リーダーが作り、組織間で連携する（コミュニティ単位）
- この分離により、スケーラブルで柔軟な組織管理が可能になる

### ボトムアップ vs トップダウン

- **ボトムアップ（組織）**: ユーザー主導、自発的な参加、価値観マッチング
- **トップダウン（国）**: 組織リーダー主導、意思決定、戦略的連携
- この二重構造により、草の根活動とトップレベルの連携を両立できる

### コンテキスト検証の重要性

- 組織Aのリーダーが組織Bのリソースにアクセスすることを防ぐ
- 国Aのメンバーが国Bのポリシーを変更することを防ぐ
- Server Actionで `groupId` / `nationId` を必ず検証する

---

**GitHub Copilot より**: 組織と国を明確に分離することで、ユーザーが自分の活動範囲を理解しやすくなります。また、RLSポリシーとServer Actionの二重防御により、不正なアクセスを確実に防止できます。
