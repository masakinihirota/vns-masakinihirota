---
trigger: always_on
---

# Supabase 宣言型スキーマ管理指示書

## 1. 概要

このファイルは、Supabaseの宣言型スキーマ（Declarative Database Schemas）を使用したデータベーススキーマ管理の指示を提供します。宣言型アプローチにより、スキーマの状態を一箇所で管理し、バージョン管理されたマイグレーションを自動生成できます。

### 1.1. 宣言型 vs 命令型

- **命令型（従来の方法）**: データベースを変更する具体的な手順を記述（例: `ALTER TABLE ADD COLUMN`）
- **宣言型（推奨）**: データベースの最終的な状態を宣言し、変更手順は自動生成される

**利点:**

- 関連情報が一箇所にまとまる（複数のマイグレーションファイルに散在しない）
- スキーマの全体像が把握しやすい
- ビューや関数などの変更が容易（全体を再作成する必要がない）
- レビューが容易

## 2. ディレクトリ構造

```サンプル
supabase/
├── config.toml                    # Supabase設定ファイル
├── schemas/                       # 宣言型スキーマファイル（真実の源泉）
│   ├── employees.sql             # テーブル定義
│   ├── managers.sql              # 依存関係のあるテーブル
│   └── views.sql                 # ビューや関数
└── migrations/                    # 自動生成されたマイグレーション
    ├── 20241004112233_create_employees_table.sql
    ├── 20241005112233_add_employee_age.sql
    └── 20241006112233_add_managers_table.sql
```

## 3. 基本ワークフロー

### 3.1. 新規スキーマの作成

#### ステップ1: スキーマファイルの作成

`supabase/schemas/` ディレクトリに SQL ファイルを作成し、テーブル定義を記述します。

```sql
-- supabase/schemas/employees.sql
create table "employees" (
  "id" integer not null,
  "name" text
);
```

#### ステップ2: マイグレーションファイルの生成

```bash
supabase db diff -f create_employees_table
```

このコマンドにより、`supabase/migrations/` ディレクトリに新しいマイグレーションファイルが生成されます。

#### ステップ3: ローカルデータベースの起動とマイグレーション適用

```bash
supabase start
supabase migration up
```

### 3.2. スキーマの更新

#### ステップ1: スキーマファイルの編集

既存のスキーマファイルを編集して変更を加えます。

```sql
-- supabase/schemas/employees.sql
create table "employees" (
  "id" integer not null,
  "name" text,
  "age" smallint not null  -- 新しいカラムを追加
);
```

**重要**: ビューや列挙型など、カラムの順序が重要なエンティティでは、新しいカラムを常に末尾に追加してください。

#### ステップ2: マイグレーションの生成

```bash
supabase db diff -f add_age
```

#### ステップ3: 生成されたマイグレーションの確認

生成されたマイグレーションファイルを確認し、意図した変更が含まれていることを検証します。

```sql
-- supabase/migrations/<timestamp>_add_age.sql
alter table "public"."employees" add column "age" smallint not null;
```

#### ステップ4: マイグレーションの適用

```bash
supabase migration up
```

### 3.3. 本番環境へのデプロイ

#### ステップ1: Supabase CLI へのログイン

```bash
supabase login
```

#### ステップ2: リモートプロジェクトのリンク

```bash
supabase link
```

画面の指示に従ってプロジェクトをリンクします。

#### ステップ3: データベース変更のプッシュ

```bash
supabase db push
```

## 4. 依存関係の管理

### 4.1. ビューと関数の管理

宣言型スキーマでは、ビューや関数を個別のファイルで管理し、変更時に全体を書き換える必要がありません。

```sql
-- supabase/schemas/employees.sql
create table "employees" (
  "id" integer not null,
  "name" text,
  "age" smallint not null
);

create view "profiles" as
  select id, name from "employees";

create function "get_age"(employee_id integer)
RETURNS smallint
LANGUAGE "sql"
AS $$
  select age
  from employees
  where id = employee_id;
$$;
```

### 4.2. スキーマファイルの実行順序

スキーマファイルはデフォルトで辞書順に実行されます。外部キーを持つテーブルでは、親テーブルを先に作成する必要があるため、順序が重要です。

**カスタム順序の指定:**

`config.toml` でスキーマの実行順序を明示的に指定できます。

```toml
# supabase/config.toml
[db.migrations]
schema_paths = [
  "./schemas/employees.sql",  # 最初に実行
  "./schemas/*.sql",          # その他のファイル
]
```

グロブパターンは展開され、重複が除去され、辞書順にソートされます。

## 5. 既存プロジェクトへの適用

### 5.1. 本番スキーマの取り込み

既存のプロジェクトで宣言型スキーマを設定する場合、本番スキーマをダンプします。

```bash
supabase db dump > supabase/schemas/prod.sql
```

その後、スキーマを小さなファイルに分割し、マイグレーションを生成できます。これは一度にすべて行うことも、変更を加えながら段階的に行うこともできます。

## 6. ロールバックとリセット

### 6.1. 開発中のロールバック

開発中にマイグレーションをロールバックして、新しいスキーマ変更を単一のマイグレーションファイルにまとめることができます。

```bash
supabase db reset --version 20241005112233
```

リセット後、スキーマを編集して新しいマイグレーションファイルを再生成できます。

**警告**: 本番環境にデプロイ済みのバージョンはリセットしないでください。

### 6.2. デプロイ済みマイグレーションのロールバック

本番環境にデプロイ済みのマイグレーションをロールバックする必要がある場合:

1. まずスキーマファイルの変更を元に戻す
2. ダウンマイグレーションを含む新しいマイグレーションファイルを生成

これにより、本番マイグレーションは常に前方にロールします。

**警告**: ダウンマイグレーションで生成されるSQL文は通常破壊的です。意図しないデータ損失を避けるため、慎重にレビューしてください。

## 7. 既知の制限事項

### 7.1. データ操作言語（DML）

`insert`、`update`、`delete` などのDML文は、スキーマ差分でキャプチャされません。データ操作が必要な場合は、従来の[バージョン管理されたマイグレーション](https://supabase.com/docs/guides/deployment/database-migrations)を使用してください。

### 7.2. ビューの所有権

- ビューの所有者と権限の管理に制限があります
- ビューのセキュリティ呼び出し元の変更
- マテリアライズドビューの制限
- カラムタイプ変更時のビュー再作成の問題

### 7.3. RLS ポリシー

- `ALTER POLICY` 文の制限
- カラム権限の追跡

### 7.4. その他のエンティティ

以下のエンティティは宣言型スキーマでサポートされていない、または制限があります:

- スキーマ権限（各スキーマが個別に差分されるため）
- コメント
- パーティション
- パブリケーションの変更（`ALTER PUBLICATION ... ADD TABLE ...`）
- ドメインの作成
- デフォルト権限からの重複したGRANT文

これらのエンティティが必要な場合は、従来のバージョン管理されたマイグレーションを使用してください。

## 8. ベストプラクティス

### 8.1. スキーマファイルの組織化

- **小さなファイルに分割**: テーブルごと、機能ごとにファイルを分割
- **明確な命名**: ファイル名でテーブルや機能を明確に示す
- **依存関係の順序**: 外部キーの親テーブルを先に配置

### 8.2. マイグレーション生成時の確認

- 生成されたマイグレーションファイルを必ず確認
- 意図しない変更が含まれていないかチェック
- 破壊的な変更（DROP、DELETE）に特に注意

### 8.3. テストとデプロイ

1. ローカル環境でマイグレーションをテスト
2. ステージング環境で検証
3. 本番環境へのデプロイ前にバックアップを取得
4. 本番環境へのデプロイは慎重に実行

### 8.4. バージョン管理

- `supabase/schemas/` と `supabase/migrations/` の両方をGitで管理
- マイグレーションファイルは削除・変更しない（新しいマイグレーションで修正）
- スキーマファイルは真実の源泉として扱う

### 8.5. Drizzle ORM との統合

- Drizzle ORM のスキーマ定義を `src/db/schema/*.ts` に配置
- Supabase の宣言型スキーマと同一のソースとして扱う
- Drizzle の `casing: 'snake_case'` 設定を使用
- マイグレーション生成前に命名規則を自動検証

## 9. トラブルシューティング

### 9.1. マイグレーションが生成されない

- スキーマファイルの構文エラーを確認
- `supabase start` でローカルデータベースが起動しているか確認
- 既存のマイグレーションがすべて適用されているか確認（`supabase migration up`）

### 9.2. 意図しない差分が生成される

- スキーマファイルの記述順序を確認
- カラムを末尾に追加しているか確認
- 既存のマイグレーションとの競合を確認

### 9.3. デプロイエラー

- ローカルとリモートのマイグレーション状態を確認
- `supabase db remote commit` でリモートの変更を取り込む
- 権限やネットワーク接続を確認

## 10. まとめ

Supabase の宣言型スキーマは、データベーススキーマの管理を大幅に簡素化します。以下の原則を守ることで、効果的に活用できます:

1. **スキーマファイルを真実の源泉とする**: `supabase/schemas/` が常に最新の状態を反映
2. **自動生成されたマイグレーションを確認**: 意図した変更のみが含まれることを検証
3. **段階的に適用**: ローカル → ステージング → 本番の順で慎重にデプロイ
4. **制限事項を理解**: DMLやRLSポリシーなど、従来のマイグレーションが必要な場合を把握
5. **バージョン管理を徹底**: すべての変更をGitで追跡

この指示書に従うことで、チーム全体で一貫したデータベーススキーマ管理を実現できます。

---

## 参考リンク

- [Supabase - Declarative Database Schemas](https://supabase.com/docs/guides/local-development/declarative-database-schemas)
- [Supabase - Database Migrations](https://supabase.com/docs/guides/deployment/database-migrations)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)
- [Drizzle ORM - Schema Declaration](https://orm.drizzle.team/docs/sql-schema-declaration)
