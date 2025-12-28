# データベース設計アンチパターン判定指示書

## 概要

この指示書は、AIがデータベース設計・SQL・アプリケーションコードをレビューし、SQLアンチパターンの有無を判定するためのガイドラインです。SQLアンチパターンとは、問題を解決しようとした結果、他の問題を生じさせてしまうような技法を指します。

---

## アンチパターンの分類

アンチパターンは以下の4つのカテゴリーに分類されます：

### 1. データベース論理設計のアンチパターン
テーブル構造、列、関連（リレーションシップ）の設計に関する問題

### 2. データベース物理設計のアンチパターン
データ型、インデックス、ファイル格納方法に関する問題

### 3. クエリのアンチパターン
SELECT、UPDATE、DELETE などのSQLクエリに関する問題

### 4. アプリケーション開発のアンチパターン
SQLとアプリケーションコードの統合に関する問題

---

## チェックリスト：論理設計アンチパターン

### 1. ジェイウォーク（Jaywalking）- 信号無視
**問題パターン**: カンマ区切りのリストを1つの列に格納している

**検出ポイント**:
- VARCHAR列にカンマ区切りで複数のIDや値を格納
- 多対多の関連を交差テーブルなしで実装
- REGEXP や LIKE '%value%' での検索が必要になる設計

**危険なコード例**:
```sql
CREATE TABLE Products (
  product_id SERIAL PRIMARY KEY,
  account_id VARCHAR(100) -- カンマ区切りで '12,34,56' のように格納
);
```

**解決策**: 交差テーブル（中間テーブル）を作成し、正規化を行う

---

### 2. ナイーブツリー（Naive Trees）- 素朴な木
**問題パターン**: 階層構造を隣接リストのみで管理している

**検出ポイント**:
- 自己参照の parent_id のみで階層を表現
- 階層全体を取得するために複数回のJOINが必要
- 深い階層の取得が困難または非効率

**危険なコード例**:
```sql
CREATE TABLE Comments (
  comment_id SERIAL PRIMARY KEY,
  parent_id BIGINT,
  comment TEXT,
  FOREIGN KEY (parent_id) REFERENCES Comments(comment_id)
);
```

**解決策**:
- 経路列挙（Path Enumeration）
- 入れ子集合（Nested Sets）
- 閉包テーブル（Closure Table）
- データベースの再帰クエリ機能（CTE）

---

### 3. IDリクワイアド（ID Required）- とりあえずID
**問題パターン**: すべてのテーブルに無条件で `id` という疑似キー列を追加

**検出ポイント**:
- 自然キーが存在するのに `id` 列を別途作成
- 交差テーブルに `id` 列があり、複合キーが重複を許可
- 列名が `id` で冗長なインデックス

**危険なコード例**:
```sql
CREATE TABLE ArticleTags (
  id SERIAL PRIMARY KEY,  -- 不要な可能性
  article_id BIGINT NOT NULL,
  tag_id BIGINT NOT NULL
  -- article_id と tag_id の組み合わせの一意性が保証されない
);
```

**解決策**: 適切な複合主キーまたは自然キーを検討する

---

### 4. キーレスエントリ（Keyless Entry）- 外部キー嫌い
**問題パターン**: 外部キー制約を定義していない

**検出ポイント**:
- 関連テーブル間で FOREIGN KEY が未定義
- 参照整合性をアプリケーションコードのみで管理
- 孤立したレコードが発生している可能性

**危険なコード例**:
```sql
CREATE TABLE Bugs (
  bug_id SERIAL PRIMARY KEY,
  reported_by BIGINT  -- 外部キー制約なし
);
```

**解決策**: 適切な FOREIGN KEY 制約を定義する

---

### 5. EAV（Entity-Attribute-Value）- エンティティ・アトリビュート・バリュー
**問題パターン**: 属性を行として格納する汎用的なテーブル設計

**検出ポイント**:
- `entity_id`, `attribute_name`, `attribute_value` のような列構造
- 動的な属性追加が目的の設計
- データ型の制約が効かない

**危険なコード例**:
```sql
CREATE TABLE IssueAttributes (
  issue_id BIGINT NOT NULL,
  attr_name VARCHAR(100) NOT NULL,
  attr_value VARCHAR(100),
  PRIMARY KEY (issue_id, attr_name)
);
```

**解決策**:
- シングルテーブル継承
- 具象テーブル継承
- クラステーブル継承
- 半構造化データ（JSON型）

---

### 6. ポリモーフィック関連（Polymorphic Associations）
**問題パターン**: 1つの外部キー列で複数の親テーブルを参照

**検出ポイント**:
- `issue_type` のような列で参照先テーブルを指定
- 外部キー制約が定義できない
- 結合時に動的なテーブル切り替えが必要

**危険なコード例**:
```sql
CREATE TABLE Comments (
  comment_id SERIAL PRIMARY KEY,
  issue_type VARCHAR(20),  -- 'Bugs' または 'FeatureRequests'
  issue_id BIGINT NOT NULL
  -- 外部キー制約が定義できない
);
```

**解決策**:
- 共通の親テーブル（スーパータイプ）を作成
- 交差テーブルを複数作成

---

### 7. マルチカラムアトリビュート（Multi-Column Attributes）- 複数列属性
**問題パターン**: 同じ属性のために複数の列を定義

**検出ポイント**:
- `tag1`, `tag2`, `tag3` のような連番列
- `phone1`, `phone2`, `phone3` のような同種の列
- 検索時にすべての列を OR で結合

**危険なコード例**:
```sql
CREATE TABLE Bugs (
  bug_id SERIAL PRIMARY KEY,
  tag1 VARCHAR(20),
  tag2 VARCHAR(20),
  tag3 VARCHAR(20)
);
```

**解決策**: 従属テーブルを作成し、1対多の関連として正規化

---

### 8. メタデータトリブル（Metadata Tribbles）- メタデータ大増殖
**問題パターン**: データ値に基づいてテーブルや列を分割

**検出ポイント**:
- `Bugs_2021`, `Bugs_2022`, `Bugs_2023` のようなテーブル
- `revenue2021`, `revenue2022` のような年ごとの列
- 新しいデータのためにスキーマ変更が必要

**危険なコード例**:
```sql
CREATE TABLE Bugs_2021 (...);
CREATE TABLE Bugs_2022 (...);
CREATE TABLE Bugs_2023 (...);
```

**解決策**:
- 単一テーブルに統合し、日付列で区別
- 必要に応じてパーティショニング機能を利用

---

## チェックリスト：物理設計アンチパターン

### 9. ラウンディングエラー（Rounding Errors）- 丸め誤差
**問題パターン**: 金額や精密な数値に FLOAT/DOUBLE を使用

**検出ポイント**:
- 金額計算に FLOAT または DOUBLE 型を使用
- 等価比較（=）で期待通りに動作しない
- 累積計算で誤差が発生

**危険なコード例**:
```sql
CREATE TABLE Accounts (
  hourly_rate FLOAT  -- 丸め誤差が発生
);
```

**解決策**: NUMERIC または DECIMAL 型を使用（例: `NUMERIC(9,2)`）

---

### 10. サーティワンフレーバー（31 Flavors）- 限定値の列定義
**問題パターン**: ENUM や CHECK 制約で値を限定

**検出ポイント**:
- ENUM 型で値を制限
- CHECK 制約で IN リストを指定
- 値の追加・変更でスキーマ変更が必要

**危険なコード例**:
```sql
CREATE TABLE Bugs (
  status TEXT CHECK (status IN ('NEW', 'IN PROGRESS', 'FIXED'))
);
```

**解決策**: 参照テーブル（ルックアップテーブル）を作成し、外部キーで参照

---

### 11. ファントムファイル（Phantom Files）- 幻のファイル
**問題パターン**: 画像などのファイルをDB外に保存し、パスのみを格納

**検出ポイント**:
- ファイルパスを VARCHAR で格納
- 外部ファイルとDBの同期が取れない可能性
- バックアップ・トランザクション・削除の整合性問題

**危険なコード例**:
```sql
CREATE TABLE Screenshots (
  screenshot_path TEXT  -- ファイルシステム上のパス
);
```

**解決策**:
- BYTEA型でDB内に格納（要件による）
- クラウドストレージとの整合性管理を実装
- 削除・更新時の同期処理を確実に実装

---

### 12. インデックスショットガン（Index Shotgun）- 闇雲インデックス
**問題パターン**: インデックスの過不足

**検出ポイント**:
- インデックスがまったく定義されていない
- すべての列にインデックスが定義されている
- 主キーに対する冗長なインデックス
- 使用されないインデックス

**危険なコード例**:
```sql
CREATE TABLE Bugs (
  bug_id SERIAL PRIMARY KEY,
  summary VARCHAR(80),
  CREATE INDEX ON Bugs (bug_id);     -- 主キーと重複
  CREATE INDEX ON Bugs (summary);    -- 長い文字列へのインデックス
  CREATE INDEX ON Bugs (bug_id, date_reported, status);  -- 使用頻度が低い複合インデックス
);
```

**解決策**:
- クエリパターンを分析してインデックスを設計
- EXPLAIN で実行計画を確認
- MENTOR原則に従う

---

## チェックリスト：クエリのアンチパターン

### 13. フィア・オブ・ジ・アンノウン（Fear of the Unknown）- NULLの誤用
**問題パターン**: NULLを不適切に扱う

**検出ポイント**:
- `WHERE column = NULL` （正しくは `IS NULL`）
- NULLを含む演算で予期しない結果
- NULLを避けるために不適切なデフォルト値を使用

**危険なコード例**:
```sql
SELECT * FROM Bugs WHERE assigned_to = NULL;  -- 結果が返らない
SELECT first_name || ' ' || middle_initial || ' ' || last_name FROM Accounts;  -- NULLがあると全体がNULL
```

**解決策**:
- `IS NULL` / `IS NOT NULL` を使用
- COALESCE 関数でデフォルト値を設定

---

### 14. アンビギュアスグループ（Ambiguous Groups）- 曖昧なグループ
**問題パターン**: GROUP BY に含まれない非集約列を SELECT

**検出ポイント**:
- GROUP BY 句にない列を SELECT で指定
- 集約関数なしで GROUP BY を使用
- 単一値の原則に違反

**危険なコード例**:
```sql
SELECT product_id, MAX(date_reported), bug_id  -- bug_id は曖昧
FROM Bugs
GROUP BY product_id;
```

**解決策**:
- サブクエリで最大値の行を特定
- ウィンドウ関数を使用
- 相関サブクエリを使用

---

### 15. ランダムセレクション（Random Selection）
**問題パターン**: ランダムな行取得の非効率な実装

**検出ポイント**:
- `ORDER BY RANDOM()` でソート
- 大量データでのパフォーマンス問題

**危険なコード例**:
```sql
SELECT * FROM Bugs ORDER BY RANDOM() LIMIT 1;  -- 全行をソート
```

**解決策**:
- 主キーの範囲からランダム選択
- アプリケーション側でランダム値を生成

---

### 16. プアマンズサーチエンジン（Poorman's Search Engine）- 貧者の検索
**問題パターン**: LIKE や正規表現での全文検索

**検出ポイント**:
- `LIKE '%keyword%'` での検索
- `REGEXP` での検索
- インデックスが使用されない検索

**危険なコード例**:
```sql
SELECT * FROM Bugs WHERE description LIKE '%crash%';
```

**解決策**:
- データベースの全文検索機能を使用
- 検索エンジン（Elasticsearch等）の導入

---

### 17. スパゲッティクエリ（Spaghetti Query）
**問題パターン**: 複雑すぎる単一クエリ

**検出ポイント**:
- 多数のテーブルを結合
- デカルト積が発生
- 1つのクエリで複数の集計を試みる

**危険なコード例**:
```sql
SELECT
  COUNT(bp.product_id) AS how_many_products,
  COUNT(dev.account_id) AS how_many_developers,
  COUNT(b.bug_id) / COUNT(dev.account_id) AS avg_bugs_per_developer
FROM Bugs b
JOIN BugsProducts bp ON (b.bug_id = bp.bug_id)
JOIN Accounts dev ON (b.assigned_to = dev.account_id)
JOIN Accounts cust ON (b.reported_by = cust.account_id);
```

**解決策**: クエリを分割し、必要に応じてアプリケーション側で結合

---

### 18. インプリシットカラム（Implicit Columns）- 暗黙の列
**問題パターン**: SELECT * やINSERTでの列省略

**検出ポイント**:
- `SELECT *` の多用
- INSERT で列名を省略
- 列追加時に既存コードが壊れる可能性

**危険なコード例**:
```sql
SELECT * FROM Bugs;
INSERT INTO Accounts VALUES (123, 'billkarwin', ...);
```

**解決策**: 列名を明示的に指定

---

## チェックリスト：アプリケーション開発アンチパターン

### 19. リーダブルパスワード（Readable Passwords）- 読み取り可能パスワード
**問題パターン**: パスワードを平文で格納

**検出ポイント**:
- パスワード列が TEXT で暗号化なし
- ハッシュ化されていないパスワード
- 復号可能な暗号化

**危険なコード例**:
```sql
INSERT INTO Accounts (password) VALUES ('xyzzy');  -- 平文
```

**解決策**:
- 安全なハッシュ関数（Argon2, bcrypt等）を使用
- ソルトを付与してハッシュ化

---

### 20. SQLインジェクション（SQL Injection）
**問題パターン**: 動的SQLの文字列連結

**検出ポイント**:
- ユーザー入力を直接SQL文字列に連結
- プレースホルダー（パラメータ化クエリ）未使用
- エスケープ処理の不備

**危険なコード例**:
```python
query = f"SELECT * FROM Bugs WHERE bug_id = {bugid}"  -- 危険
```

**解決策**:
- プリペアドステートメント（パラメータ化クエリ）を使用
- 入力値のバリデーション

---

### 21. シュードキー・ニートフリーク（Pseudokey Neat Freak）- 疑似キー潔癖症
**問題パターン**: 主キーの欠番を埋めようとする

**検出ポイント**:
- 連番の欠番を検出・補填するコード
- 主キー値の再割り当て
- 外部システムとのID同期問題

**解決策**: 欠番は無視し、新しい行には新しいIDを割り当てる

---

### 22. シー・ノー・エビル（See No Evil）- 臭いものに蓋
**問題パターン**: エラー処理の欠如

**検出ポイント**:
- API戻り値のチェックなし
- 例外処理の不備
- SQLエラーメッセージの無視

**危険なコード例**:
```python
cursor.execute(query, parameters)  # エラーチェックなし
for row in cursor:
    print(row)
```

**解決策**: 適切なエラーハンドリングとログ出力

---

### 23. ディプロマティック・イミュニティ（Diplomatic Immunity）- 外交特権
**問題パターン**: データベースへのベストプラクティス非適用

**検出ポイント**:
- データベースのバージョン管理がない
- テストデータ・テストコードがない
- ドキュメントがない
- コードレビューの対象外

**解決策**:
- データベースマイグレーションツールを使用
- データベース変更もバージョン管理対象に
- テストを作成

---

### 24. スタンダード・オペレーティング・プロシージャ（Standard Operating Procedure）
**問題パターン**: 常にストアドプロシージャを使用する（または使用しない）

**検出ポイント**:
- すべてのSQLをストアドプロシージャに
- 柔軟性のないアーキテクチャ
- デバッグ・テストの困難さ

**解決策**: 状況に応じて適切な方法を選択

---

### 25. 外部キーの誤った使い方
**問題パターン**: 外部キー制約の設計ミス

**検出ポイント**:
- 参照方向の逆転（1対多の「1」側に外部キー）
- 作成前のテーブルを参照
- データ型の不一致
- NULLを許可した外部キー列での参照整合性問題

**危険なコード例**:
```sql
-- 親テーブル（Parent）に外部キーを定義（逆）
CREATE TABLE Parent (
  parent_id INT PRIMARY KEY,
  child_id INT NOT NULL,
  FOREIGN KEY (child_id) REFERENCES Child(child_id)
);
```

**解決策**: 外部キーは「多」側のテーブルに定義

---

## 判定フロー

### Step 1: スキーマ確認
1. テーブル定義を確認
2. 列のデータ型を確認
3. 主キー・外部キーを確認
4. インデックスを確認

### Step 2: 関連（リレーションシップ）確認
1. テーブル間の関連を確認
2. 1対多、多対多の関連が適切か確認
3. 外部キー制約が定義されているか確認

### Step 3: クエリ確認
1. SELECT * の使用を確認
2. GROUP BY と SELECT の整合性を確認
3. NULL の扱いを確認
4. LIKE/REGEXP での検索を確認

### Step 4: アプリケーションコード確認
1. SQL構築方法を確認（文字列連結 vs プレースホルダー）
2. エラーハンドリングを確認
3. パスワード処理を確認

---

## レビュー出力フォーマット

```markdown
## DBアンチパターンレビュー結果

### 検出されたアンチパターン

#### 1. [アンチパターン名]
- **重大度**: 高/中/低
- **該当箇所**: `テーブル名` / `列名` / `クエリ`
- **問題点**: 具体的な問題の説明
- **推奨対応**: 具体的な修正案

### 推奨事項
- ...

### 問題なしの項目
- ...

```
