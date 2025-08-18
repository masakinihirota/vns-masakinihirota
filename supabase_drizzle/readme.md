# Supabase Drizzle Schema

このディレクトリには、SupabaseとDrizzle ORMを使用して定義されたデータベーススキーマが含まれています。以下は各スキーマファイルの説明です。

## スキーマファイル一覧

### `account_providers.ts`
- **テーブル名**: `account_providers`
- **説明**: 認証プロバイダー情報を管理します。
- **主なカラム**:
  - `id`: プライマリキー。
  - `rootAccountId`: `root_accounts`テーブルへの外部キー。
  - `provider`: 認証プロバイダーの種類（例: Google, GitHub）。
  - `providerUserId`: プロバイダー内のユーザーID。
  - `isPrimary`: プライマリプロバイダーかどうか。
  - `linkedAt`: リンクされた日時。

### `auth_events.ts`
- **テーブル名**: `auth_events`
- **説明**: 認証イベントの履歴を記録します。
- **主なカラム**:
  - `id`: プライマリキー。
  - `rootAccountId`: `root_accounts`テーブルへの外部キー。
  - `eventType`: 認証イベントの種類（例: サインイン、サインアウト）。
  - `ipAddress`: イベント発生時のIPアドレス。
  - `userAgent`: ユーザーエージェント情報。
  - `createdAt`: イベント発生日時。

### `enums.ts`
- **説明**: データベースで使用される列挙型を定義します。
- **主な列挙型**:
  - `authProviderEnum`: 認証プロバイダーの種類。
  - `pointsReasonEnum`: ポイント加減算の理由。
  - `authEventTypeEnum`: 認証イベントの種類。
  - `languageProficiencyEnum`: 言語熟練度。

### `languages.ts`
- **テーブル名**: `languages`
- **説明**: サポートされる言語を管理します。
- **主なカラム**:
  - `id`: 言語ID。
  - `name`: 言語名。
  - `nativeName`: ネイティブ言語名。

### `points_transactions.ts`
- **テーブル名**: `points_transactions`
- **説明**: ポイントの加減算履歴を記録します。
- **主なカラム**:
  - `id`: プライマリキー。
  - `rootAccountId`: `root_accounts`テーブルへの外部キー。
  - `delta`: ポイントの増減値。
  - `reason`: ポイント加減算の理由。
  - `description`: 説明。
  - `createdAt`: トランザクション日時。

### `root_accounts.ts`
- **テーブル名**: `root_accounts`
- **説明**: ユーザーのルートアカウント情報を管理します。
- **主な列挙型**:
  - `livingAreaSegmentEnum`: 居住エリアの区分。

### `user_languages.ts`
- **テーブル名**: `user_languages`
- **説明**: ユーザーが追加した言語とその熟練度を管理します。
- **主なカラム**:
  - `rootAccountId`: `root_accounts`テーブルへの外部キー。
  - `languageId`: `languages`テーブルへの外部キー。
  - `proficiency`: 言語熟練度。
  - `addedAt`: 言語が追加された日時。

---

各スキーマファイルは、`drizzle-orm`を使用して型安全に定義されています。



## Drizzleスキーマファイル作成ルール

Drizzle ORMを使用してスキーマファイルを作成する際には、以下のルールに従ってください。

### 命名規則
- **テーブル名**: スネークケース（例: `root_accounts`）
- **カラム名**: スネークケース（例: `created_at`）
- **列挙型名**: スネークケース（例: `auth_provider_enum`）
- **ファイル名**: スネークケース（例: `root_accounts.ts`）


### 型と制約
- **型安全性**: 必ずDrizzle ORMの型を使用して定義すること。
- **外部キー**: `references`を使用して明示的に定義すること。
- **デフォルト値**: 必要に応じて`default`を設定すること。
- **チェック制約**: ビジネスロジックに応じて`check`を活用すること。

### その他のルール
- **タイムスタンプ**: 作成日時や更新日時には`created_at`および`updated_at`を使用し、`defaultNow()`を設定する。
- **列挙型**: 列挙型は`pgEnum`を使用して定義し、再利用可能な形にする。
- **インデックス**: 必要に応じて`index`を設定し、パフォーマンスを最適化する。
- **コメント**: 各フィールドやテーブルの目的を明確にするため、適切なコメントを記述する。

### キャメルケースとスネークケースのルール
- **Drizzle ORM**: スキーマファイル内ではキャメルケース（例: `rawAppMetaData`）を使用します。
- **Supabase**: データベースに渡す際には自動的にスネークケース（例: `raw_app_meta_data`）に変換されます。

このルールにより、コードの一貫性を保ちながらSupabaseの仕様に適合させることができます。

### 推奨パターン
- **ファイル構成**: スキーマファイルは`schema/`ディレクトリ内に配置する。
- **関連ファイル**: 列挙型や共通の型定義は`enums.ts`などの専用ファイルにまとめる。

これらのルールを遵守することで、コードの一貫性と可読性を保つことができます。


