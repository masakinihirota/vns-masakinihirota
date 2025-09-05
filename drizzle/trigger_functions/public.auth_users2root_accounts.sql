-- TODO 後で一つにまとめる
-- 最初は1つでの動作確認をしてから

-- カスケードの設定をあとで行う
-- 既存のトリガー関数に追加（または別ファイルで定義）

-- root_accountsテーブルの外部キー制約にカスケードを追加
-- 注: これはDrizzle ORMのスキーマ定義で設定することを推奨（Supabaseのマイグレーションで適用）
-- ALTER TABLE root_accounts
-- ADD CONSTRAINT fk_root_accounts_user_id
-- FOREIGN KEY (user_id) REFERENCES public.auth_users(id)
-- ON DELETE CASCADE  -- 親削除時に子も削除
-- ON UPDATE CASCADE; -- 親更新時に子も更新（必要に応じて）



-- public.auth_users
-- から
-- root_accounts
-- へ、必要なカラムをコピーする

-- public.auth_users＜＜認証チェックするテーブル
-- root_accounts ＜＜Webアプリのでユーザー管理、認証はチェックしないテーブル

-- auth_usersのこの項目もコピー
-- root_accountsのページで認証状況を表示するため

--   raw_app_meta_data jsonb null,
--   raw_user_meta_data jsonb null,
--   is_anonymous boolean not null default false,


-- トリガー関数を作成
-- 認証ユーザーごとにroot_accountを1つ作成
CREATE OR REPLACE FUNCTION copy_to_root_accounts()
RETURNS TRIGGER AS $$
BEGIN
  -- 条件: public.auth_usersにユーザーが追加されたら、常にroot_accountsに1人分のユーザーを追加
  INSERT INTO root_accounts (user_id, created_at, updated_at)
  VALUES (NEW.id, NOW(), NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- トリガーを作成（public.auth_usersのINSERT時に発火）
CREATE TRIGGER trigger_copy_to_root_accounts
AFTER INSERT ON public.auth_users
FOR EACH ROW
EXECUTE FUNCTION copy_to_root_accounts();
