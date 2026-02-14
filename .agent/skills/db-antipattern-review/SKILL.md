---
description: データベース設計・SQL・アプリケーションコードのアンチパターンを検出するためのスキル。25のSQLアンチパターンに基づく。
---

# DB Antipattern Review Skill

このスキルは、データベース設計、クエリ、およびアプリケーションコードをレビューし、25のSQLアンチパターンに基づいて潜在的な問題を検出します。

## 対象

- `schema.sql`, `migrations/*.sql` (DDL)
- `*.ts`, `*.tsx` (Supabase Client usage, API routes)
- `*.sql` (RPC, Snippets)

## アンチパターンリスト (全25項目)

### I. 論理設計のアンチパターン

#### 1. ジェイウォーク (Jaywalking)
- **問題**: カンマ区切りなどで複数の値を1つの列に格納する。
- **検出**: `tag_ids TEXT` ('1,2,3'), 配列型の安易な使用。
- **修正**: 交差テーブルを作成する。

#### 2. ナイーブツリー (Naive Trees)
- **問題**: `parent_id` のみで階層構造を管理し、再帰クエリを使用しない。
- **検出**: 階層取得のための複雑な自己結合やループ処理。
- **修正**: `WITH RECURSIVE` (CTE) を使用する。

#### 3. IDリクワイアド (ID Required)
- **問題**: すべてのテーブルに無条件で `id` 列を含める。
- **検出**: 複合主キーで十分な交差テーブルに `id` がある。
- **修正**: 複合主キーの使用を検討する。

#### 4. キーレスエントリ (Keyless Entry)
- **問題**: 外部キー制約を定義しない。
- **検出**: 関連テーブル間で `REFERENCES` がない。
- **修正**: 適切な外部キー制約を追加する。

#### 5. EAV (Entity-Attribute-Value)
- **問題**: 属性を行として格納する汎用テーブル。
- **検出**: `key`, `value` 列を持つテーブル。
- **修正**: JSONB列を使用するか、具体的な列を定義する。

#### 6. ポリモーフィック関連 (Polymorphic Associations)
- **問題**: 1つの外部キーが複数の親テーブルを参照する。
- **検出**: `parent_type`, `parent_id` のような列。
- **修正**: 交差テーブルを分けるか、共通の親テーブルを作成する。

#### 7. マルチカラムアトリビュート (Multi-Column Attributes)
- **問題**: 複数の列に同種の値を格納する。
- **検出**: `tag1`, `tag2`, `tag3`。
- **修正**: 従属テーブルを作成する。

#### 8. メタデータトリブル (Metadata Tribbles)
- **問題**: データ値に基づいてテーブルや列を分割・増殖させる。
- **検出**: `log_2024`, `log_2025`。
- **修正**: パーティショニングを使用する。

### II. 物理設計のアンチパターン

#### 9. ラウンディングエラー (Rounding Errors)
- **問題**: 精密な計算に `FLOAT` を使用する。
- **検出**: 金額やポイント等の列が `FLOAT` / `DOUBLE PRECISION`。
- **修正**: `NUMERIC` / `DECIMAL` を使用する。

#### 10. サーティワンフレーバー (31 Flavors)
- **問題**: 値を `ENUM` や `CHECK` 制約でハードコードして限定する。
- **検出**: 頻繁に変更される可能性のあるステータス値などの `ENUM`。
- **修正**: 参照テーブル（ルックアップテーブル）を使用する。

#### 11. ファントムファイル (Phantom Files)
- **問題**: ファイルデータを外部に保存し、整合性を管理しない、またはDBに直接バイナリ保存。
- **検出**: ファイルパスのみの列（非推奨）、`BYTEA` 列への直接保存（非推奨）。
- **修正**: Supabase Storageを使用し、連携を強化する。

#### 12. インデックスショットガン (Index Shotgun)
- **問題**: インデックスの過不足。
- **検出**: 全くインデックスがない、または未使用のインデックス。FKへのインデックス忘れ。
- **修正**: クエリに基づき必要なインデックスのみ作成する。**特に外部キーには明示的にインデックスを付与する。**

### III. クエリのアンチパターン

#### 13. フィア・オブ・ジ・アンノウン (Fear of the Unknown)
- **問題**: NULLを不適切に扱う。
- **検出**: `= NULL`, `<> NULL` の使用。
- **修正**: `IS NULL`, `IS NOT NULL` を使用する。

#### 14. アンビギュアスグループ (Ambiguous Groups)
- **問題**: `GROUP BY` に含まれない非集約列を `SELECT` する。
- **検出**: PostgreSQL以外のDBからの移行時によくあるエラー。
- **修正**: 集約関数を使用するか、`GROUP BY` に含める。

#### 15. ランダムセレクション (Random Selection)
- **問題**: `ORDER BY RANDOM()` で行を取得する。
- **検出**: 大量データに対する `ORDER BY RANDOM()`。
- **修正**: `TABLESAMPLE` やID範囲指定を使用する。

#### 16. プアマンズサーチエンジン (Poorman's Search Engine)
- **問題**: `LIKE '%...%'` で全文検索を行う。
- **検出**: 前方一致しない `LIKE` 検索。
- **修正**: Full Text Search (Gina/GiST index, `tsvector`) を使用する。

#### 17. スパゲッティクエリ (Spaghetti Query)
- **問題**: 複雑すぎる単一クエリ。
- **検出**: 過度な結合、ネスト、ロジックの混在。
- **修正**: クエリを分割するか、ビュー/関数を使用する。

#### 18. インプリシットカラム (Implicit Columns)
- **問題**: `SELECT *` や列指定なしの `INSERT`。
- **検出**: `SELECT *` の多用。
- **修正**: 具体的な列名を指定する。

### IV. アプリケーション開発のアンチパターン

#### 19. リーダブルパスワード (Readable Passwords)
- **問題**: パスワードを平文または可逆暗号で保存。
- **検出**: `password` 列の平文保存。
- **修正**: Supabase Authを使用する（自前実装しない）。

#### 20. SQLインジェクション (SQL Injection)
- **問題**: ユーザー入力をSQLに直接連結する。
- **検出**: PL/pgSQLの `EXECUTE` での文字列連結。
- **修正**: `format()` や `USING` 句、プレースホルダを使用する。

#### 21. シュードキー・ニートフリーク (Pseudokey Neat Freak)
- **問題**: IDの欠番を埋めようとする。
- **検出**: IDの再利用ロジック。
- **修正**: 欠番は許容する。

#### 22. シー・ノー・エビル (See No Evil)
- **問題**: データベースエラーを無視する。
- **検出**: クライアント側でのエラーハンドリング欠如。
- **修正**: 適切なエラーチェックとログ出力を実装する。

#### 23. ディプロマティック・イミュニティ (Diplomatic Immunity)
- **問題**: DBをバージョン管理やテストから除外する。
- **検出**: マイグレーションの不使用、直接DB変更。
- **修正**: マイグレーションツールを徹底する。

#### 24. スタンダード・オペレーティング・プロシージャ (Standard Operating Procedure)
- **問題**: 全てをストアドプロシージャにする（または全くしない）。
- **検出**: 極端なロジックの偏り。
- **修正**: 適材適所。

#### 25. 外部キーの誤った使い方
- **問題**: 参照方向の逆転など。
- **検出**: 親テーブルに外部キーがある。
- **修正**: 正規化を見直す。

## レビュー出力フォーマット

```markdown
# DB Antipattern Implementation Report

## Summary
[全体的な評価コメント]

## Detected Antipatterns

### 🔴 [High] Naked Database (RLS Disabled)
- **Location**: `migrations/xxxx.sql`
- **Problem**: RLS not enabled for table `users`.
- **Fix**: Add `ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;`.

### 🟡 [Minor] Index Shotgun (Missing FK Index)
- **Location**: `migrations/xxxx.sql`
- **Problem**: No index on foreign key column `group_id`.
- **Fix**: `CREATE INDEX ON public.group_members (group_id);`

## Recommendations
- ...
```
