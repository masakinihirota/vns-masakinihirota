# スキーマ設計の再検討：正しいアーキテクチャ

## ユーザー指摘の重要性

> "Better Authをベースにする。そしてrootAccountsテーブルは使い続ける 1ユーザーに付き１ルートアカウントでRBACをつかう。usersは逆にどのような立ち位置なのか？ このusersは不要ではないのか？ このアプリではrootAccountが一人のユーザーの基本単位だ"

**この指摘は完全に正しい。**

## 現在の設計における3つのレイヤー

### 1. 認証レイヤー（Better Auth）
- **テーブル**: `users`, `sessions`, `accounts`, `verifications`
- **責務**: ログイン・セッション管理、OAuth連携
- **必須**: yes（Better Auth フレームワークの要件）
- **立ち位置**: 認証インフラ（ビジネスロジックとは分離）

### 2. ビジネスロジックレイヤー（RBAC の中心）
- **テーブル**: `rootAccounts`
- **責務**: ユーザーの基本属性（ポイント、レベル、信頼度、保有期間）
- **立ち位置**: **1ユーザーの基本単位** ← ここが重要
- **関係性**:
  ```
  users.id (text)
    ↓
  rootAccounts.authUserId (外部キー)
  ```

### 3. プロフィール・拡張レイヤー
- **テーブル**: `userProfiles`
- **責務**: 表示名、プロフィール情報、メタデータ
- **立ち位置**: rootAccounts の拡張情報
- **関係性**:
  ```
  rootAccounts.id (uuid)
    ↓
  userProfiles.rootAccountId (外部キー)
  ```

## 問題の本質：スキーマ矛盾の原因

### 実際の矛盾
- `users.id` は認証用（text）
- `rootAccounts.id` はビジネス用（uuid）
- RBAC の基準単位が曖昧になっている

### 誤った仮定（提案者の過ち）
「users テーブルを RBAC の中心にしよう」という提案は、アーキテクチャの本質を見落としていました。

## 正しい設計：users を認証基盤に特化

### 原則
1. **users テーブル**: 認証・セッション管理に特化。プロフィール情報は持たない
2. **rootAccounts テーブル**: RBAC の基本単位。全ビジネスロジックはここから開始
3. **userProfiles テーブル**: rootAccounts の詳細情報
4. **UUID の統一**: RBAC 関連するすべてのテーブルは uuid ベース（rootAccounts.id → userProfiles.id）

### テーブル関係図
```
┌─────────────────────────────────────────────────┐
│ Better Auth (認証レイヤー)                       │
├─────────────────────────────────────────────────┤
│ users                                           │
│   id: TEXT (authUserId)                         │
│   email, name, image                            │
│   role, banned, ...                             │
│                                                 │
│   ※ プロフィール情報は持たない                    │
└─────────────────────────────────────────────────┘
                      ↓
              rootAccounts.authUserId
                      ↓
┌─────────────────────────────────────────────────┐
│ ビジネスロジックレイヤー (RBAC中心)               │
├─────────────────────────────────────────────────┤
│ rootAccounts                                    │
│   id: UUID (← RBAC基本単位)                      │
│   authUserId: TEXT (users参照)                  │
│   points, level, trustDays                      │
│   dataRetentionDays                             │
│                                                 │
│   ※ 1ユーザー = 1ルートアカウント                 │
└─────────────────────────────────────────────────┘
                      ↓
              userProfiles.rootAccountId
                      ↓
┌─────────────────────────────────────────────────┐
│ プロフィール・拡張レイヤー                        │
├─────────────────────────────────────────────────┤
│ userProfiles                                    │
│   id: UUID (rootAccount拡張)                    │
│   displayName, purpose, roleType                │
│   avatar, externalLinks, ...                    │
│                                                 │
│   ※ rootAccounts の上に積み重ねられる             │
└─────────────────────────────────────────────────┘
                      ↓
              RBAC 全テーブルが参照
                      ↓
┌─────────────────────────────────────────────────┐
│ RBAC テーブル群                                  │
├─────────────────────────────────────────────────┤
│ groupMembers                                    │
│   userProfileId: UUID (← userProfiles)          │
│                                                 │
│ relationships                                   │
│   userProfileId: UUID                           │
│   targetProfileId: UUID                         │
│                                                 │
│ businessCards, alliances, notifications, ...    │
│   ※ すべて UUID で統一（rootAccounts厳選）      │
└─────────────────────────────────────────────────┘
```

## 現在のスキーマ矛盾の真因

### ❌ 誤り：users を RBAC の中心にしようとした
- users.id (text) を全体の基準にしようとした
- users にプロフィール情報を統合しようとした
- これにより users の責務が曖昧になる

### ✅ 正解：users は認証の境界線
- users：Better Auth の要件を満たすのみ
- rootAccounts.authUserId からの一方向参照で十分
- ビジネスロジックの全体は rootAccounts.id (uuid) ベース

## 修正方針（提案の完全な取り下げ）

### 現在の計画をキャンセル
1. `SCHEMA_UNIFICATION_PLAN.md` の提案は廃止
2. `0003_unify_user_profile_schema.sql` は実行しない
3. Drizzle スキーマ修正を元に戻す

### 正しい方針：current state を保守
1. **rootAccounts テーブルは保持** → RBAC の基本単位として維持
2. **userProfiles テーブルは保持** → rootAccounts の拡張として維持
3. **users テーブルは保持** → 認証用に最小限のメタデータのみ
4. **UUID の一貫性を確保** → RBAC 全テーブルで uuid ベース（users.id との混在を避ける）

## UUID vs TEXT の統一戦略

### 問題点
- users.id: TEXT（Better Auth の要件）
- rootAccounts.id: UUID（RBAC基本単位）
- 両者を無理に統一しようとしたのが矛盾の原因

### 解決策
- **分離を受け入れる**：users と rootAccounts は異なるID体系で良い
- **明確な関係性**：`rootAccounts.authUserId TEXT REFERENCES users.id`
- **ビジネスロジックは UUID ベース**：RBAC関連は全て UUID

## Phase 1: スキーマ修正の元戻し

実装された Drizzle スキーマ修正は完全に取り消す必要があります。

### キャンセルする修正
1. ❌ users テーブル フィールド追加（displayName, purpose, roleType など）
2. ❌ rootAccounts テーブルの削除
3. ❌ userProfiles テーブルの削除
4. ❌ 外部キー参照の UUID → TEXT への変更

### 復帰するスキーマ
- `src/lib/db/schema.postgres.ts` を git から復元
- または複製作成時のバージョンに戻す

## Phase 2: UUID の一貫性確認（実の問題）

RBAC 内での UUID の一貫性を検証：
- groupMembers.userProfileId：UUID ✅
- relationships.userProfileId：UUID ✅
- businessCards.userProfileId：UUID ✅
- alliances.profileAId/profileBId：UUID ✅
- groups.leaderId：UUID → 要確認
- notifications.userProfileId：UUID ✅
- nationEvents.organizerId：UUID → 要確認
- nationPosts.authorId：UUID → 要確認

## Phase 3: コード修正（改めて）

RBAC ヘルパーや各種サービスで、userId ではなく rootAccountId または userProfileId (uuid) を使う。

## 改訂版の成功基準
- ✅ rootAccounts が RBAC の基本単位として明確
- ✅ UUID の一貫性（RBAC内）
- ✅ TEXT（users.id）と UUID（rootAccounts.id）の明確な分離
- ✅ users テーブルの責務が明確（認証のみ）
- ✅ Better Auth とのシームレスな統合
