---
description: データベース設計・SQL・アプリケーションコードのアンチパターンを検出し、Supabase/PostgreSQLのベストプラクティスに基づいた修正案を提示するスキル。
---

# DB Antipattern Review Skill

このスキルは、データベース設計、クエリ、およびデータアクセスコードをレビューし、パフォーマンス、整合性、セキュリティを脅かすアンチパターンを検出するために使用します。

## 対象

- `schema.sql`, `migrations/*.sql` (DDL)
- `*.ts`, `*.tsx` (Supabase Client usage, API routes)
- `*.sql` (RPC, Snippets)

## アンチパターン分類

### 🔴 Critical (即時修正必須)

#### 1. Naked Database (RLS無効)

Supabaseプロジェクトにおいて最も危険な状態。

- **検出**: `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;` がない、または `alter table ... enable row level security;` がマイグレーションに含まれていないテーブル作成。
- **リスク**: API経由で全世界にデータが公開される。
- **修正**: 必ずRLSを有効化し、適切なポリシーを作成する。
  ```sql
  alter table public.profiles enable row level security;
  create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
  ```

#### 2. Readable Passwords / Custom Auth Tables

- **検出**: `password`, `passwd`, `pwd` などの列を持つ独自のユーザーテーブル。ハッシュ化の有無に関わらずアンチパターン。
- **リスク**: セキュリティ実装の不備、保守コスト増大。
- **修正**: **Supabase Auth** (`auth.users`) を使用する。ユーザーデータは `public.profiles` 等に分離し、`id` で `auth.users` を参照する。

#### 3. SQL Injection (in RPC/Functions)

- **検出**: PL/pgSQL内で `EXECUTE` を使用し、引数を文字列連結している。
- **リスク**: SQLインジェクション。
- **修正**: `format()` 関数を使用するか、`USING` 句でパラメータを渡す。
  ```sql
  -- BAD
  EXECUTE 'SELECT * FROM ' || table_name || ' WHERE id = ' || id_val;
  -- GOOD
  EXECUTE format('SELECT * FROM %I WHERE id = $1', table_name) USING id_val;
  ```

### 🟠 Major (強く推奨)

#### 4. Phantom Files (DB内ファイル保存)

- **検出**: `bytea` 列に画像やファイルデータを格納している。
- **リスク**: DBサイズ肥大化、バックアップ時間増大、パフォーマンス低下。
- **修正**: **Supabase Storage** を使用し、DBにはパス（URLまたはStorage Path）のみを格納する。

#### 5. Jaywalking (カンマ区切り値)

- **検出**: `tag_ids TEXT` ('1,2,3') のように、1つの列に複数の値を格納。
- **リスク**: 検索クエリが複雑化（`LIKE` や配列演算）、結合が困難、参照整合性の欠如。
- **修正**: 交差テーブル（中間テーブル）を作成する。
  - _例外_: タグなどで参照整合性が不要かつ検索頻度が低い場合、Postgres配列型 (`text[]`, `int[]`) は許容されるが、交差テーブルが原則。

#### 6. Naive Trees (素朴な木)

- **検出**: `parent_id` のみで階層構造を表現し、再帰クエリ（CTE）を使用していないスパゲッティコード。
- **リスク**: 階層全体の取得が非効率。
- **修正**: Postgresの `WITH RECURSIVE` (CTE) を使用する。

#### 7. EAV (Entity-Attribute-Value)

- **検出**: `key`, `value` 列を持つ汎用属性テーブル。
- **リスク**: 型安全性の欠如、クエリの複雑化。
- **修正**: **JSONB** 型列を使用する。PostgresのJSONBはインデックス可能でクエリも強力。

### 🟡 Minor (要検討)

#### 8. ID Required (過剰なID)

- **検出**: 全ての交差テーブルなどに無条件に `id` (Surrogate Key) を付与。
- **文脈**: Supabase (Realtime) では PK が必要だが、複合PK（`primary key (user_id, group_id)`）で十分な場合が多い。
- **修正**: 複合主キーで一意性が担保できる場合は、冗長な `id` 列を削除検討。

#### 9. Index Shotgun (闇雲インデックス)

- **検出**:使用されない、または重複したインデックス。
- **リスク**: 書き込みパフォーマンスの低下。
- **修正**: クエリパターンに基づき必要なインデックスのみ作成する。PostgresはFKに自動でインデックスを貼らないため、JOINに使用するFKには明示的にインデックスを作成する。

## レビュープロセス

1.  **DDL解析**: テーブル定義を確認し、RLS、外部キー、適切なデータ型（`timestamptz` 推奨）、命名規則（snake_case）をチェック。
2.  **クエリ解析**: アプリケーションコード内のクエリ（`supabase-js` 呼び出し含む）を確認。`N+1` 問題や、不必要な全件取得がないか。
3.  **セキュリティ**: Auth、RLS、Injectableな箇所を最優先で確認。

## 出力フォーマット

```markdown
# DB Antipattern Implementation Report

## Summary
[全体的な評価コメント]

## Detected Antipatterns

### 🔴 [High] Naked Database
- **Location**: `migrations/20240101_init.sql` (Table: `logs`)
- **Problem**: Table created without RLS enabled.
- **Fix**: Add `ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;` and defined policies.

### 🟠 [Medium] Phantom Files
- **Location**: `src/app/upload/page.tsx`
- **Problem**: Uploading file buffer directly to `bytea` column.
- **Fix**: Use Supabase Storage and store the path string.

## Recommendations
- [改善提案]
```
