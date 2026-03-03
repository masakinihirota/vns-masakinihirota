# Data Dictionary: VNS Masakinihirota Database Schema

> **バージョン**: 1.0
> **更新日**: 2026-03-03
> **対象**: PostgreSQL public schema

---

## 目次

1. [root_accounts](#root_accounts) - 認証ユーザー
2. [user_profiles](#user_profiles) - ユーザープロフィール
3. [user_preferences](#user_preferences) - ユーザー設定
4. [groups](#groups) - グループ
5. [group_members](#group_members) - グループメンバーシップ
6. [nations](#nations) - 国
7. [sessions](#sessions) - ログインセッション
8. [accounts](#accounts) - OAuth アカウント
9. [verifications](#verifications) - メール認証・リセット
10. [two_factor_secrets](#two_factor_secrets) - 2FA シークレット
11. [audit_logs](#audit_logs) - 監査ログ

---

## root_accounts

**説明**: Better Auth による認証ユーザーベーステーブル。メールアドレス、パスワードハッシュ、認証状態を管理します。

**RLS**: ✅ 有効。本人のみがレコード をアクセス可能

**行数目安**: 数千～数万

| カラム | 型 | 制約 | 初期値 | 説明 |
|--------|-----|------|--------|------|
| `id` | `varchar(191)` | PRIMARY KEY | (auto-generated) | Better Auth により自動生成される UUID |
| `email` | `varchar(255)` | UNIQUE, NOT NULL | - | ログインメールアドレス（一意） |
| `password_hash` | `varchar(255)` | - | NULL | バージョン。ハッシュ化されたパスワード |
| `active_profile_id` | `varchar(191)` | FOREIGN KEY → user_profiles.id | NULL | アクティブなプロフィール ID（SELECT 時に利用） |
| `created_at` | `timestamptz` | NOT NULL | CURRENT_TIMESTAMP | アカウント作成日時 |
| `updated_at` | `timestamptz` | NOT NULL | CURRENT_TIMESTAMP | 最終更新日時 |
| `is_deleted` | `boolean` | DEFAULT false | false | 論理削除フラグ |

**インデックス**:
- PRIMARY KEY: `id`
- UNIQUE: `email`（重複アカウント防止）
- FOREIGN KEY: `active_profile_id`

**セキュリティ**:
- RLS: 本人（session user = root_account.id）のみ SELECT/UPDATE 可能
- DELETE 禁止（論理削除で対応）
- OAuth ログインはアプリケーション層で制御（ここでは管理しない）

**関連テーブル**:
- `user_profiles` (1:1 or 1:N)
- `sessions` (1:N)
- `accounts` (1:N)
- `verifications` (1:N)
- `two_factor_secrets` (1:1)

---

## user_profiles

**説明**: ユーザーの公開プロフィール情報（表示名、アバター、経歴等）。複数プロフィールを持つことで、ユーザーが異なるペルソナでアクティビティできる設計。

**RLS**: ✅ 有効。全員 SELECT 可、本人のみ INSERT/UPDATE/DELETE

**行数目安**: 数千～数万

| カラム | 型 | 制約 | 初期値 | 説明 |
|--------|-----|------|--------|------|
| `id` | `varchar(191)` | PRIMARY KEY | (auto-generated) | プロフィール ID |
| `root_account_id` | `varchar(191)` | FOREIGN KEY → root_accounts.id, UNIQUE, NOT NULL | - | 所有者の root account ID。UNIQUE→現在 1:1 |
| `username` | `varchar(255)` | UNIQUE, NOT NULL | - | 表示名（ユーザー名）。@username で参照可能 |
| `display_name` | `varchar(255)` | - | NULL | フルネーム（表示目的） |
| `bio` | `text` | - | NULL | 自己紹介文 |
| `avatar_url` | `varchar(255)` | - | NULL | プロフィール画像 URL |
| `cover_url` | `varchar(255)` | - | NULL | カバー画像 URL |
| `is_official` | `boolean` | DEFAULT false | false | 公式アカウントフラグ |
| `created_at` | `timestamptz` | NOT NULL | CURRENT_TIMESTAMP | プロフィール作成日時 |
| `updated_at` | `timestamptz` | NOT NULL | CURRENT_TIMESTAMP | 最終更新日時 |

**インデックス**:
- PRIMARY KEY: `id`
- UNIQUE: `username`（ユーザー名検索）
- UNIQUE: `root_account_id`（ユーザーのアクティブプロフィール取得）
- FOREIGN KEY: `root_account_id`

**セキュリティ**:
- SELECT: 全員可能（ただし is_deleted=true なら フィルタ）
- INSERT/UPDATE/DELETE: 本人 = root_account.id のみ
- avatar_url, cover_url は信頼できるメディアストレージからのみ

**関連テーブル**:
- `root_accounts` (N:1)
- `user_preferences` (1:1)
- `groups` (N:1 as leader)
- `group_members` (1:N)
- `audit_logs` (1:N)

---

## user_preferences

**説明**: ユーザーの UI 設定（ダークモード、言語、広告表示等）。ユーザーが複数デバイスから同じ設定で使用できるよう DB に保存。

**RLS**: ✅ 有効。本人のみ 全操作可能

**行数目安**: 数千～数万

| カラム | 型 | 制約 | 初期値 | 説明 |
|--------|-----|------|--------|------|
| `id` | `varchar(191)` | PRIMARY KEY | (auto-generated) | 設定 ID |
| `user_profile_id` | `varchar(191)` | FOREIGN KEY → user_profiles.id, UNIQUE, NOT NULL | - | ユーザープロフィール ID |
| `theme` | `varchar(20)` | CHECK (theme IN ('light', 'dark', 'auto')) | 'auto' | テーマ設定 |
| `language` | `varchar(10)` | CHECK (language IN ('ja', 'en')) | 'ja' | UI 言語 |
| `show_ads` | `boolean` | - | true | 広告表示フラグ |
| `created_at` | `timestamptz` | NOT NULL | CURRENT_TIMESTAMP | 作成日時 |
| `updated_at` | `timestamptz` | NOT NULL | CURRENT_TIMESTAMP | 最終更新日時 |

**インデックス**:
- PRIMARY KEY: `id`
- UNIQUE: `user_profile_id`（プロフィール = 設定との 1:1 マッピング）
- FOREIGN KEY: `user_profile_id`

**セキュリティ**:
- RLS: 本人のみアクセス
- show_ads フラグは UI 層で尊重（API 層では無視しない）

**関連テーブル**:
- `user_profiles` (1:1)

---

## groups

**説明**: コミュニティ・グループ。所属する国別、リーダーによって管理されます。公開/シークレットの設定あり。

**RLS**: ✅ 有効。是非シークレット=false のグループのみ全員 SELECT、シークレット グループはメンバーのみ SELECT

**行数目安**: 数百～数千

| カラム | 型 | 制約 | 初期値 | 説明 |
|--------|-----|------|--------|------|
| `id` | `varchar(191)` | PRIMARY KEY | (auto-generated) | グループ ID |
| `name` | `varchar(255)` | NOT NULL | - | グループ名 |
| `description` | `text` | - | NULL | グループの説明 |
| `avatar_url` | `varchar(255)` | - | NULL | グループ アイコン URL |
| `cover_url` | `varchar(255)` | - | NULL | グループ カバー URL |
| `leader_id` | `varchar(191)` | FOREIGN KEY → user_profiles.id | - | グループリーダー（所有者） |
| `nation_id` | `varchar(191)` | FOREIGN KEY → nations.id, NOT NULL | - | 所属国 ID |
| `is_private` | `boolean` | DEFAULT false | false | シークレット グループフラグ |
| `is_official` | `boolean` | DEFAULT false | false | 公式グループフラグ |
| `created_at` | `timestamptz` | NOT NULL | CURRENT_TIMESTAMP | 作成日時 |
| `updated_at` | `timestamptz` | NOT NULL | CURRENT_TIMESTAMP | 更新日時 |

**インデックス**:
- PRIMARY KEY: `id`
- FOREIGN KEY: `leader_id`（リーダー検索）
- FOREIGN KEY: `nation_id`（国別グループ検索）
- INDEX: `(nation_id, created_at DESC)`（国別・新着順）

**セキュリティ**:
- RLS: 公開グループ = 全員 SELECT、シークレット = メンバー + リーダー
- UPDATE/DELETE: リーダー + グループ管理者のみ
- avatar_url, cover_url は信頼できるストレージから

**関連テーブル**:
- `user_profiles` (N:1 as leader)
- `groups` (1:N as members)
- `nations` (N:1)

---

## group_members

**説明**: グループのメンバーシップ。ユーザーがグループに属する際のレコード。ロール（member, moderator, admin）で権限を管理。

**RLS**: ✅ 有効。全員 SELECT（公開グループ限定）、管理者のみ INSERT/UPDATE/DELETE

**行数目安**: 数千～数万

| カラム | 型 | 制約 | 初期値 | 説明 |
|--------|-----|------|--------|------|
| `id` | `varchar(191)` | PRIMARY KEY | (auto-generated) | メンバーシップ ID |
| `user_profile_id` | `varchar(191)` | FOREIGN KEY → user_profiles.id, NOT NULL | - | ユーザープロフィール ID |
| `group_id` | `varchar(191)` | FOREIGN KEY → groups.id, NOT NULL | - | グループ ID |
| `role` | `varchar(20)` | CHECK (role IN ('member', 'moderator', 'admin')), DEFAULT 'member' | 'member' | グループ内ロール |
| `joined_at` | `timestamptz` | NOT NULL | CURRENT_TIMESTAMP | 参加日時 |

**インデックス**:
- PRIMARY KEY: `id`
- UNIQUE: `(user_profile_id, group_id)`（同一ユーザーが同一グループに複数参加を防止）
- FOREIGN KEY: `user_profile_id`
- FOREIGN KEY: `group_id`
- INDEX: `(group_id, role)` WHERE role IN ('admin', 'moderator')（管理者検索）

**セキュリティ**:
- SELECT: 条件付き（公開グループならメンバー一覧表示、シークレットならメンバーのみ）
- INSERT: グループ管理者のみ
- UPDATE: グループ管理者 + ユーザー本人（ストレージ更新は禁止）
- DELETE: グループ管理者 + ユーザー本人（退機）

**関連テーブル**:
- `user_profiles` (N:1)
- `groups` (N:1)

---

## nations

**説説**: グループの分類となる「国」。階層構造をサポート（親国を持つ可能性）。マスターデータ。

**RLS**: ✅ 有効。全員 SELECT、管理者のみ INSERT/UPDATE/DELETE

**行数目安**: 200～1000

| カラム | 型 | 制約 | 初期値 | 説明 |
|--------|-----|------|--------|------|
| `id` | `varchar(191)` | PRIMARY KEY | (auto-generated) | 国 ID |
| `code` | `varchar(10)` | UNIQUE, NOT NULL | - | 国コード（ISO 3166-1 など） |
| `name` | `varchar(255)` | UNIQUE, NOT NULL | - | 国名 |
| `description` | `text` | - | NULL | 国の説明 |
| `parent_id` | `varchar(191)` | FOREIGN KEY → nations.id | NULL | 親国（階層構造向け） |
| `order` | `int` | DEFAULT 0 | 0 | 表示順序 |
| `created_at` | `timestamptz` | NOT NULL | CURRENT_TIMESTAMP | 作成日時 |
| `updated_at` | `timestamptz` | NOT NULL | CURRENT_TIMESTAMP | 更新日時 |
| `is_deleted` | `boolean` | DEFAULT false | false | 論理削除フラグ |

**インデックス**:
- PRIMARY KEY: `id`
- UNIQUE: `code`（コード検索）
- UNIQUE: `name`（名称検索）
- FOREIGN KEY: `parent_id`（親子関係）
- INDEX: `order ASC`（ソート用）

**セキュリティ**:
- SELECT: 全員可（削除済みを除外）
- INSERT/UPDATE/DELETE: 管理者のみ

**関連テーブル**:
- `groups` (1:N)
- `nations` (自己参照、1:N as parent)

---

## sessions

**説明**: ユーザーのログインセッション。Better Auth によって管理。期限切れセッションは定期削除。

**RLS**: ✅ 有効。本人のみ SELECT

**行数目安**: 数千（TTL管理）

| カラム | 型 | 制約 | 初期値 | 説明 |
|--------|-----|------|--------|------|
| `id` | `varchar(191)` | PRIMARY KEY | (auto-generated) | セッション ID |
| `root_account_id` | `varchar(191)` | FOREIGN KEY → root_accounts.id, NOT NULL | - | ユーザー ID |
| `user_agent` | `varchar(500)` | - | NULL | ブラウザ・ユーザーエージェント |
| `ip_address` | `varchar(50)` | - | NULL | ログイン元 IP アドレス |
| `expires_at` | `timestamptz` | NOT NULL | - | セッション有効期限 |
| `created_at` | `timestamptz` | NOT NULL | CURRENT_TIMESTAMP | セッション作成日時 |

**インデックス**:
- PRIMARY KEY: `id`
- FOREIGN KEY: `root_account_id`
- INDEX: `expires_at` (期限切れセッション定期削除用)

**セキュリティ**:
- SELECT: 本人のみ（セッション一覧表示）
- UPDATE: set expires_at = NULL で早期終了（ログアウト）
- DELETE: 自動削除（TTL または ユーザー削除時）
- user_agent, ip_address は監査ログに記録すべき（分析用）

**関連テーブル**:
- `root_accounts` (N:1)

---

## accounts

**説明**: OAuth アカウント（Google, GitHub など）。1 つの root_account が複数の OAuth プロバイダーを持つことをサポート。

**RLS**: ✅ 有効。本人のみ SELECT

**行数目安**: 数千～数万

| カラム | 型 | 制約 | 初期値 | 説明 |
|--------|-----|------|--------|------|
| `id` | `varchar(191)` | PRIMARY KEY | (auto-generated) | OAuth アカウント ID |
| `root_account_id` | `varchar(191)` | FOREIGN KEY → root_accounts.id, NOT NULL | - | Better Auth ユーザー ID |
| `provider` | `varchar(50)` | NOT NULL | - | OAuth プロバイダー（google, github など） |
| `provider_account_id` | `varchar(255)` | NOT NULL | - | プロバイダー側のユーザー ID |
| `access_token` | `varchar(500)` | - | NULL | アクセストークン（必要に応じて暗号化） |
| `refresh_token` | `varchar(500)` | - | NULL | リフレッシュトークン（必要に応じて暗号化） |
| `created_at` | `timestamptz` | NOT NULL | CURRENT_TIMESTAMP | 連携日時 |

**インデックス**:
- PRIMARY KEY: `id`
- UNIQUE: `(provider, provider_account_id)`（プロバイダー = プロバイダーID は一意）
- FOREIGN KEY: `root_account_id`

**セキュリティ**:
- トークンは環境変数で暗号化推奨（Better Auth のプラクティス参照）
- SELECT: 本人のみ（OAuth 接続管理）
- DELETE: ユーザー本人（OAuth 連携解除）

**関連テーブル**:
- `root_accounts` (N:1)

---

## verifications

**説明**: メール確認トークン・パスワードリセットトークン。有効期限付き。

**RLS**: ✅ 有効。本人のみ SELECT（通常はサーバー側で確認）

**行数目安**: 数百（TTL管理）

| カラム | 型 | 制約 | 初期値 | 説明 |
|--------|-----|------|--------|------|
| `id` | `varchar(191)` | PRIMARY KEY | (auto-generated) | 検証トークン ID |
| `root_account_id` | `varchar(191)` | FOREIGN KEY → root_accounts.id, NOT NULL | - |対象ユーザー ID |
| `token` | `varchar(255)` | UNIQUE, NOT NULL | - | ワンタイムトークン（メール内リンク） |
| `created_at` | `timestamptz` | NOT NULL | CURRENT_TIMESTAMP | 生成日時 |
| `expires_at` | `timestamptz` | NOT NULL | - | 有効期限（通常 15 分～1 時間） |

**インデックス**:
- PRIMARY KEY: `id`
- UNIQUE: `token`（トークン検証高速化）
- FOREIGN KEY: `root_account_id`
- INDEX: `expires_at` (期限切れトークン定期削除用)

**セキュリティ**:
- 複雑に思えば token は SHA256 ハッシュ化（ただし検証時は ハッシュ値で一致判定）
- SELECT: Better Auth API により本人のみ
- DELETE: 自動削除（有効期限切れ、使用後）

**関連リテーブル**:
- `root_accounts` (N:1)

---

## two_factor_secrets

**説明**: 2FA シークレット（Google Authenticator 用 QR コード、バックアップコード等）。

**RLS**: ✅ 有効。本人のみ SELECT

**行数目安**: 数百～千

| カラム | 型 | 制約 | 初期値 | 説明 |
|--------|-----|------|--------|------|
| `id` | `varchar(191)` | PRIMARY KEY | (auto-generated) | 2FA シークレット ID |
| `root_account_id` | `varchar(191)` | FOREIGN KEY → root_accounts.id, UNIQUE, NOT NULL | - | ユーザー ID（1 ユーザー = 1 シークレット） |
| `secret` | `varchar(255)` | NOT NULL | - | TOTP シークレット（Base32 エンコード） |
| `enabled` | `boolean` | DEFAULT false | false | 2FA 有効フラグ |
| `created_at` | `timestamptz` | NOT NULL | CURRENT_TIMESTAMP | 生成日時 |

**インデックス**:
- PRIMARY KEY: `id`
- UNIQUE: `root_account_id`（1 ユーザー = 1 シークレット）
- FOREIGN KEY: `root_account_id`

**セキュリティ**:
- secret カラムは **最高機密**。環境変数で暗号化すべき
- SELECT/UPDATE/DELETE: 本人のみ
- secret の復号化は API 層でリクエスト毎に処理

**関連テーブル**:
- `root_accounts` (N:1)

---

## audit_logs

**説明**: ユーザーアクションの監査ログ。CRUD 操作、変更内容を記録。コンプライアンス。

**RLS**: ✅ 有効。本人のログのみ SELECT あるいは 管理者が全ログ SELECT

**行数目安**: 数千～数万（成長に応じてパーティション検討）

| カラム | 型 | 制約 | 初期値 | 説明 |
|--------|-----|------|--------|------|
| `id` | `varchar(191)` | PRIMARY KEY | (auto-generated) | ログ ID |
| `user_profile_id` | `varchar(191)` | FOREIGN KEY → user_profiles.id | - | アクション実行者（NULL= 匿名 / システム） |
| `entity_type` | `varchar(100)` | NOT NULL | - | 対象エンティティ（examples: 'group', 'group_member...）） |
| `entity_id` | `varchar(191)` | NOT HTTP NULL | - | 対象エンティティ ID |
| `action` | `varchar(20)` | CHECK (action IN ('CREATE', 'READ', 'UPDATE', 'DELETE')), NOT NULL | - | アクションタイプ |
| `changes` | `jsonb` | - | NULL | 変更前後の値（UPDATE時に記録） |
| `created_at` | `timestamptz` | NOT NULL | CURRENT_TIMESTAMP | ログ記録日時 |

**インデックス**:
- PRIMARY KEY: `id`
- FOREIGN KEY: `user_profile_id`
- INDEX: `(entity_type, entity_id, created_at DESC)` (あるエンティティの操作履歴検索)
- INDEX: `(user_profile_id, created_at DESC)` (ユーザーのアクション履歴)
- INDEX: `created_at DESC` (最新ログから検索)

**セキュリティ**:
- RLS: 本人のログのみ、または 管理者が全ログ
- 削除: 保持期間（例：1年）を過ぎたら自動削除（admin 権限でも手動削除なし推奨）
- changes は敏感情報マスク（パスワード、秘密キー等は記録しない）

**関連テーブル**:
- `user_profiles` (N:1)

---

## 列の型一覧

| 型 | Drizzle 定義 | 説明 | 例 |
|-----|-------------|------|-----|
| `varchar(n)` | `varchar({ length: n })` | テキスト（最大長制限） | email,  username |
| `text` | `text()` | 可変長テキスト（制限なし） | bio, description |
| `timestamptz` | `timestamp({ withTimezone: true })` | タイムゾーン付きタイムスタンプ | created_at |
| `boolean` | `boolean()` | 真偽値 | is_deleted, enabled |
| `int` | `integer()` | 整数 | order |
| `jsonb` | `jsonb()` | JSON（バイナリ形式） | changes |

---

## 命名規則

- テーブル名: **スネークケース、複数形** (`user_profiles`, `group_members`)
- カラム名: **スネークケース** (`avatar_url`, `created_at`, `is_deleted`)
- インデックス名: **自動**。Drizzle が生成
- 制約名: **自動**。Drizzle / PostgreSQL が生成

---

## チェックリスト

- [ ] すべてのテーブルが RLS 有効化されているか確認
- [ ] すべてのタイムスタンプが `timestamptz` か確認
- [ ] 重要なカラムに CHECK 制約が設定されているか確認
- [ ] インデックスが適切に設定されているか確認
- [ ] 外部キーの CASCADE/RESTRICT が設計通りか確認

---

## 参考

- [ER Diagram](./er-diagram.md) - ビジュアル表現
- [RLS Policy Specification](./rls-policy-specification.md) - セキュリティポリシー詳細
- [Database Schema Design](./database-security-foundation.md) - スキーマ設計背景
