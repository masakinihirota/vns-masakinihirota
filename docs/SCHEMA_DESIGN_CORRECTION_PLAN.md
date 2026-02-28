# スキーマ統合案の撤回と正しいアーキテクチャの確認

## 状況確認

### ✅ 実装した修正を完全に取り消しました
1. `src/lib/db/schema.postgres.ts` を git から復元
2. `drizzle/0003_unify_user_profile_schema.sql` を削除
3. ビルド成功を確認

## 正しい理解：3層アーキテクチャ

アプリケーションは以下の3層で設計されるべき：

### Layer 1: 認証インフラ（Better Auth ）
| 要素 | 説明 | ID型 |
|------|------|------|
| `users` | OAuth/Emailログイン | TEXT |
| `sessions` | セッション管理 | TEXT |
| `accounts` | OAuth 外部連携 | TEXT |
| `verifications` | メール確認 | TEXT |

**責務**: ログイン・認証のみ。プロフィール情報は持たない。

### Layer 2: ビジネスロジック中心（RBAC基盤）
| テーブル | 説明 | ID型 | 関係性 |
|---------|------|------|--------|
| `rootAccounts` | **1ユーザーの基本単位** | UUID | authUserId → users.id |

**責務**: ポイント、レベル、信頼度。RBAC の起点。

**重要**: `1 users.id : 1 rootAccounts.id` (1対1関係)

### Layer 3: プロフィール・拡張層
| テーブル | 説明 | ID型 | 関係性 |
|---------|------|------|--------|
| `userProfiles` | プロフィール詳細 | UUID | rootAccountId → rootAccounts.id |

**責務**: 表示名、プロフィール情報、メタデータ。

## RBAC テーブル群（Layer 2から展開）

全て UUID ベース（rootAccounts.id → userProfiles.id）：
- groupMembers (userProfileId)
- relationships (userProfileId)
- businessCards (userProfileId)
- alliances (profileAId, profileBId)
- groups (leaderId)
- notifications (userProfileId)
- nationEvents (organizerId)
- nationPosts (authorId)

## 現在の実装状況

### ✅ 正しい点
- ビルドが成功
- rootAccounts テーブルが存在
- userProfiles テーブルが存在
- users テーブルは認証用

### ⚠️ 確認が必要な点
1. users テーブルに不要なプロフィール情報が含まれていないか
2. RBAC 参照が一貫して UUID ベースか
3. rootAccounts と users の 1対1 制約が適切か

## 次のアクション

### Phase 1: 現在のスキーマの正確性を確認
- users テーブルの定義を確認（認証用のみであるか）
- rootAccounts テーブルの定義を確認
- userProfiles テーブルの定義を確認

### Phase 2: RBAC コード層の修正（もし必要）
- src/lib/auth/rbac-helper.ts：rootAccountId または userProfileId (uuid) を使用
- userId (text) ではなく uuid ベースのアプローチ

### Phase 3: テスト・ビルド
- ビルド成功を確認
- RBAC テスト実行

## 設計変更が不要な理由

❌ **スキーマ統合案を取り下げた理由**：
1. users を RBAC の中心にしようとした（誤り）
2. UUID と TEXT の無理な統一（誤り）
3. rootAccounts の廃止提案（誤り）

✅ **正しいアーキテクチャ**：
1. users：認証インフラのみ（Better Auth の要件）
2. rootAccounts：RBAC の中心（ビジネスロジック）
3. userProfiles：プロフィール拡張層
4. UUID の統一：RBAC 内では一貫
5. TEXT と UUID の分離：受け入れる（両者は異なるID体系）

## 修正作業計画（新方針）

### 必要な修正
1. **users テーブル確認**：プロフィール情報を削除すべきか確認
2. **rootAccounts 1対1 制約**：uniqueness を確保
3. **RBAC コード**：userId → (rootAccountId | userProfileId) の修正

### 不要な修正
1. ❌ テーブル統合
2. ❌ ID型の統一強制
3. ❌ マイグレーションの実行

## 結論

このアプリケーションは**正しい3層設計**を実装している。ユーザーの指摘通り、`rootAccounts` が RBAC の基本単位であり、これは適切な設計である。

次のステップ：
1. 現在のスキーマが本当に正しいかを検証
2. コード層の修正が必要かを確認
3. ビルド・テストで最終確認
