---
description: Supabaseマイグレーションファイル作成時のバリデーションとベストプラクティス。構文エラー、デバッグコードの残骸、セキュリティ問題を防止します。
---

# Migration Validation Skill

このスキルは、Supabaseマイグレーションファイルを作成・変更する際に、よくあるエラーを防ぎ、品質を保証するために使用します。

## 使用タイミング

以下の場合に**必ず**このスキルを参照してください：

- 新規マイグレーションファイルを作成する時
- 既存マイグレーションファイルを修正する時
- PL/pgSQL関数を含むマイグレーションを作成する時
- `npx supabase db reset` が失敗した時

---

## マイグレーション作成の黄金律

### 1. 作成後は必ず全体検証

マイグレーションファイルを作成・変更したら、**必ず** `db reset` で全マイグレーションを再適用して検証してください。

```bash
# マイグレーション作成後、必ず実行
npx supabase db reset

# 成功することを確認
# Exit code: 0 であることを確認
```

**理由**:

- 新規マイグレーションだけでなく、既存マイグレーションとの整合性も確認できる
- 構文エラーを早期に発見できる
- 他の開発者が同じエラーに遭遇するのを防げる

### 2. デバッグコードは残さない

開発中に追加したデバッグ用のコードは、必ず削除してください。

```sql
-- ❌ BAD: デバッグコードの残骸
v_item.seller_id; -- NOTE: This line does nothing

-- ✅ GOOD: 必要なログは RAISE NOTICE を使用
RAISE NOTICE 'Processing item: %', v_item.seller_id;

-- ✅ GOOD: デバッグが不要なら削除
-- (何も書かない)
```

### 3. 無効な文を含めない

特にPL/pgSQL関数内では、無効な文（何もしない式）を含めないでください。

```sql
-- ❌ BAD: 単独の式（構文エラー）
variable_name;
record.field;

-- ✅ GOOD: 代入文
variable_name := value;

-- ✅ GOOD: 関数呼び出し
PERFORM function_name(args);

-- ✅ GOOD: ログ出力
RAISE NOTICE 'Debug: %', variable_name;
```

---

## よくあるエラーパターンと修正方法

### エラー1: 単独の式（無効な文）

**症状**: `syntax error at or near "variable"`

```sql
-- ❌ BAD
CREATE FUNCTION example() RETURNS void AS $$
BEGIN
    some_variable; -- これは何もしない無効な文
END;
$$ LANGUAGE plpgsql;
```

**修正**:

```sql
-- ✅ GOOD: 必要な処理を追加
CREATE FUNCTION example() RETURNS void AS $$
BEGIN
    -- 変数を使う処理を書く
    RAISE NOTICE 'Value: %', some_variable;

    -- または、不要なら削除する
END;
$$ LANGUAGE plpgsql;
```

### エラー2: SQLインジェクション（動的SQL）

**症状**: セキュリティ脆弱性、潜在的なSQLインジェクション

```sql
-- ❌ BAD: 文字列連結（SQLインジェクションリスク）
EXECUTE 'SELECT * FROM ' || table_name || ' WHERE id = ' || id_value;
```

**修正**:

```sql
-- ✅ GOOD: format() と USING を使用
EXECUTE format('SELECT * FROM %I WHERE id = $1', table_name) USING id_value;
```

### エラー3: セミコロンの欠落

**症状**: `syntax error`

```sql
-- ❌ BAD
SELECT * INTO record FROM table
RETURN record;
```

**修正**:

```sql
-- ✅ GOOD: 各文の最後にセミコロン
SELECT * INTO record FROM table;
RETURN record;
```

### エラー4: RETURNの欠落

**症状**: `control reached end of function without RETURN`

```sql
-- ❌ BAD
CREATE FUNCTION get_value() RETURNS integer AS $$
BEGIN
    SELECT 42;
END;
$$ LANGUAGE plpgsql;
```

**修正**:

```sql
-- ✅ GOOD: RETURN文を追加
CREATE FUNCTION get_value() RETURNS integer AS $$
BEGIN
    RETURN 42;
END;
$$ LANGUAGE plpgsql;
```

### エラー5: 認証チェックの欠落（SECURITY DEFINER関数）

**症状**: セキュリティ脆弱性、なりすまし攻撃のリスク

```sql
-- ❌ BAD: 認証チェックなし
CREATE FUNCTION transfer_points(from_user UUID, to_user UUID, amount INT)
RETURNS void AS $$
BEGIN
    -- 誰でも他人のポイントを移動できてしまう
    UPDATE root_accounts SET points = points - amount WHERE auth_user_id = from_user;
    UPDATE root_accounts SET points = points + amount WHERE auth_user_id = to_user;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**修正**:

```sql
-- ✅ GOOD: 認証チェックを追加
CREATE FUNCTION transfer_points(from_user UUID, to_user UUID, amount INT)
RETURNS void AS $$
BEGIN
    -- 認証チェック: 自分自身のポイントのみ移動可能
    IF from_user != auth.uid() THEN
        RAISE EXCEPTION 'Unauthorized: You can only transfer your own points.';
    END IF;

    UPDATE root_accounts SET points = points - amount WHERE auth_user_id = from_user;
    UPDATE root_accounts SET points = points + amount WHERE auth_user_id = to_user;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## マイグレーション作成チェックリスト

マイグレーションファイルを作成・変更したら、以下をチェックしてください：

### 構文チェック

- [ ] **単独の式がないか**（`variable;` 形式）
- [ ] **全ての文がセミコロンで終わっているか**
- [ ] **RETURN文があるか**（RETURNS指定の関数の場合）
- [ ] **文字列連結でEXECUTEを使用していないか**（`format()` を使用すべき）

### セキュリティチェック

- [ ] **SECURITY DEFINER関数に認証チェックがあるか**（`auth.uid()` でチェック）
- [ ] **SQLインジェクションのリスクがないか**
- [ ] **RLSが有効化されているか**（新規テーブルの場合）
- [ ] **適切なポリシーが設定されているか**

### コード品質チェック

- [ ] **デバッグコードが残っていないか**
- [ ] **不要なコメントが削除されているか**
- [ ] **命名規則に従っているか**（snake_case）
- [ ] **コメントが適切か**（日本語OK）

### 検証チェック

- [ ] **`npx supabase db reset` が成功するか**
- [ ] **Supabase Studio で関数が正しく表示されるか**
- [ ] **関数の動作をテストしたか**

---

## マイグレーション作成ワークフロー

### ステップ1: マイグレーションファイル作成

```bash
# 新規マイグレーションを作成
npx supabase migration new <migration_name>

# または、手動で作成
# supabase/migrations/YYYYMMDDHHMMSS_<migration_name>.sql
```

### ステップ2: SQL記述

- テーブル作成、変更、削除
- インデックス追加
- 関数作成
- RLS有効化とポリシー設定

**重要**: このスキルのチェックリストを参照しながら記述

### ステップ3: 検証

```bash
# 全マイグレーションを再適用
npx supabase db reset

# エラーがないことを確認
# Exit code: 0 を確認
```

### ステップ4: 関数テスト（該当する場合）

```sql
-- Supabase Studio または psql で実行
SELECT function_name(test_args);

-- 期待通りの結果が返ることを確認
```

### ステップ5: コミット

```bash
git add supabase/migrations/
git commit -m "feat: マイグレーションの説明"
```

---

## PL/pgSQL関数作成のベストプラクティス

### 1. 認証チェック（SECURITY DEFINER関数）

```sql
CREATE FUNCTION secure_function(user_id UUID) RETURNS void AS $$
BEGIN
    -- 必ず最初に認証チェック
    IF user_id != auth.uid() THEN
        RAISE EXCEPTION 'Unauthorized';
    END IF;

    -- 以降の処理...
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 2. エラーハンドリング

```sql
CREATE FUNCTION safe_function() RETURNS void AS $$
BEGIN
    -- 処理...

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Record not found';
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error: %', SQLERRM;
        RAISE;
END;
$$ LANGUAGE plpgsql;
```

### 3. トランザクション（アトミック性）

```sql
CREATE FUNCTION atomic_operation() RETURNS void AS $$
BEGIN
    -- 複数のINSERT/UPDATEは自動的にトランザクション内で実行される
    INSERT INTO table1 (...) VALUES (...);
    INSERT INTO table2 (...) VALUES (...);

    -- エラーが発生すると、全て ROLLBACK される
END;
$$ LANGUAGE plpgsql;
```

### 4. 動的SQL（必要な場合のみ）

```sql
CREATE FUNCTION dynamic_query(table_name text) RETURNS void AS $$
BEGIN
    -- %I でテーブル名をエスケープ
    -- %L で文字列値をエスケープ
    -- $1, $2 でパラメータを渡す
    EXECUTE format('SELECT * FROM %I WHERE status = $1', table_name)
    USING 'active';
END;
$$ LANGUAGE plpgsql;
```

---

## トラブルシューティング

### `db reset` が失敗する場合

1. **エラーメッセージを確認**

   ```
   syntax error at or near "..."
   Line XX: ...
   ```

2. **該当するマイグレーションファイルを開く**
   - エラーメッセージの行番号を確認
   - 該当箇所を修正

3. **再度 `db reset` を実行**

   ```bash
   npx supabase db reset
   ```

4. **成功するまで繰り返す**

### デバッグ方法

```sql
-- RAISE NOTICE でデバッグログを出力
RAISE NOTICE 'Variable value: %', my_variable;

-- RAISE EXCEPTION でエラーを発生させる
RAISE EXCEPTION 'Debug point reached';

-- RETURN QUERY EXECUTE でクエリ結果を確認
RETURN QUERY EXECUTE format('SELECT * FROM %I', table_name);
```

---

## まとめ

### マイグレーション作成の3原則

1. **必ず `db reset` で検証する**
2. **無効な文を含めない**
3. **SECURITY DEFINER関数には認証チェックを追加**

### チェックリストを活用

- 構文チェック
- セキュリティチェック
- コード品質チェック
- 検証チェック

### エラーを恐れない

- エラーは早期に発見するべき
- `db reset` は開発の標準フロー
- チェックリストを使って品質を保証

---

**このスキルを参照することで、マイグレーションファイルの品質が向上し、同じエラーを繰り返さずに済みます。**
