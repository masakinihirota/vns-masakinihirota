# DB Antipattern Implementation Report

## Summary

全体的なデータベース設計とセキュリティ実装をレビューしました。
概ね適切に設計されていますが、**重大なセキュリティ脆弱性**が `complete_transaction` 関数に見つかりました。また、いくつかのパフォーマンス上の懸念点も見受けられます。これらはリリース前に修正することを強く推奨します。

## Detected Antipatterns

### 🔴 [Critical] Insecure RPC (Authorization Bypass)

- **Location**: `supabase/migrations/20260209000100_create_community_functions.sql` (Function: `complete_transaction`)
- **Problem**: `complete_transaction` 関数が `SECURITY DEFINER` で定義されていますが、実行者 (`auth.uid()`) の権限チェックが行われていません。
  - 引数 `p_user_id` を受け取っていますが、これが正当な呼び出し元かどうか検証されていません。
  - 悪意のあるユーザーが任意の `transaction_id` を指定してこの関数を呼び出すことで、他人の取引を勝手に完了させたり、不正に売上を発生させたりすることが可能です。
- **Fix**: 関数内で `auth.uid()` を使用し、実行者がそのトランザクションの正当な権限保有者（例: 購入者、またはシステム管理者）であることを確認するロジックを追加してください。

```sql
-- 修正案イメージ
IF auth.uid() != v_tx.buyer_id THEN
  RAISE EXCEPTION 'Unauthorized';
END IF;
```

### 🔴 [Critical] Missing RLS Policies

- **Location**: `supabase/migrations/20260210000000_add_community_policies.sql`
- **Problem**: `groups` テーブルなどのRLSは有効化されていますが、ポリシー定義が不十分な可能性があります。
  - `group_members` への `INSERT` は `auth.uid() = user_profile_id` で自分自身の追加は許可されていますが、招待制や承認制の場合、これでは誰でも勝手にグループに参加できてしまう可能性があります（仕様次第ですが要確認）。
  - `nation_citizens` や `market_items` など、他のテーブルに対する詳細なポリシー（誰がUPDATE/DELETEできるか）が `20260210000000_add_community_policies.sql` には見当たりません（`groups` と `group_members` 以外）。基本ポリシー (`USING (true)`) だけでは書き込み制御が不十分です。
- **Fix**: 各テーブルに対して、INSERT/UPDATE/DELETE の権限を厳密に定義したポリシーを追加してください。

### 🟠 [Major] Phantom Files (Potential)

- **Location**: `migrations/20260209000000_create_community_schema.sql`
- **Problem**: 定義上は `avatar_url`, `cover_url` (TEXT) となっており問題ありませんが、実装時に画像をBase64などでDBに保存しないよう注意が必要です（現状のコードを見る限りはURL保存のようでOKですが、念のため）。
- **Fix**: 確実に Storage Bucket を使用し、DBにはパスのみを保存する実装を維持してください。

### 🟡 [Minor] Index Shotgun (Missing Indexes)

- **Location**: `migrations/20260209000000_create_community_schema.sql`
- **Problem**: 外部キー (`REFERENCES`) カラムに対して、明示的なインデックス作成が見当たりません。
  - `group_members(user_profile_id)`
  - `nation_posts(nation_id)`
  - `market_transactions(item_id)`
  - など、JOINやフィルタリングで頻繁に使われる外部キーにはインデックスがないと、データ量が増えた際に急激にパフォーマンスが低下します。
- **Fix**: 参照される外部キーカラムに `CREATE INDEX` を追加してください。

## Recommendations

1. **`complete_transaction` の即時修正**: 最優先で修正してください。
2. **RLSポリシーの網羅**: 全テーブルに対して `INSERT/UPDATE/DELETE` のポリシーを明示的に記述してください。
3. **インデックスの追加**: 外部キーカラムへのインデックス作成用マイグレーションを追加してください。
