-- (重要)
-- ※authスキーマ関連の場合
-- Supabaseで利用するときはダッシュボードのSQL EDITORからトリガーのSQL文を実行してtriggerを登録すること、それ以外の方法では受け付けてもらえない。
-- 方法：Drizzleのトリガーとトリガー関数はSQL文で直接SupabaseのGUI SQL Editor に貼り付けます。

-- TODO
-- RLSの設定を後で考える
-- auth.usersとカスケード接続をする。
-- auth.usersで、編集、削除した時このデータも編集、削除する

-- トリガー関数の作成
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.auth_users (
    id,
    aud,
    role,
    email,
    email_confirmed_at,
    phone,
    phone_confirmed_at,
    last_sign_in_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    encrypted_password,
    invited_at,
    confirmation_token,
    confirmation_sent_at,
    recovery_token,
    recovery_sent_at,
    email_change_token_new,
    email_change,
    email_change_sent_at,
    email_change_token_current,
    email_change_confirm_status,
    banned_until,
    reauthentication_token,
    reauthentication_sent_at,
    is_super_admin,
    is_sso_user,
    deleted_at,
    is_anonymous,
    confirmed_at
  )
  VALUES (
    NEW.id,
    NEW.aud,
    NEW.role,
    NEW.email,
    NEW.email_confirmed_at,
    NEW.phone,
    NEW.phone_confirmed_at,
    NEW.last_sign_in_at,
    NEW.created_at,
    NEW.updated_at,
    NEW.raw_app_meta_data,
    NEW.raw_user_meta_data,
    NEW.encrypted_password,
    NEW.invited_at,
    NEW.confirmation_token,
    NEW.confirmation_sent_at,
    NEW.recovery_token,
    NEW.recovery_sent_at,
    NEW.email_change_token_new,
    NEW.email_change,
    NEW.email_change_sent_at,
    NEW.email_change_token_current,
    NEW.email_change_confirm_status,
    NEW.banned_until,
    NEW.reauthentication_token,
    NEW.reauthentication_sent_at,
    NEW.is_super_admin,
    NEW.is_sso_user,
    NEW.deleted_at,
    NEW.is_anonymous,
    NEW.confirmed_at
  );
  INSERT INTO public.root_accounts (
    id,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.created_at,
    NEW.updated_at
  );
  RETURN NEW;
END;
$$;

-- 既存トリガーを削除（安全のため）
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- RLSは後でRBAC(role base access control)の時に一緒に考える
-- ALTER TABLE public.root_accounts ENABLE ROW LEVEL SECURITY;

-- トリガーの作成
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

---

-- このトリガーでは新規作成（INSERT）イベントしか扱っていないため、ユーザー情報の更新（UPDATE）や削除（DELETE）には対応できません。

-- このコードは、auth.users テーブルに新しい行が追加されたとき（つまり、新規ユーザーが登録されたとき）にのみ、public.auth_users テーブルにデータをコピーします。

-- 新規作成（INSERT）: on_auth_user_created トリガーが発動し、handle_new_user() 関数が実行されます。

-- 更新（UPDATE）: このトリガーはAFTER UPDATEが定義されていないため、何も実行されません。

-- 削除（DELETE）: このトリガーはAFTER DELETEが定義されていないため、何も実行されません。

-- 完全な同期を実現するには
-- データの不整合を防ぐためには、INSERTだけでなく、UPDATEとDELETEのイベントにも対応するトリガーを設定する必要があります。
