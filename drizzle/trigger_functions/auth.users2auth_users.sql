-- authスキーマ関連の場合
-- Supabaseで利用するときはダッシュボードのSQL EDITORからトリガーのSQL文を実行してtriggerを登録すること、それ以外の方法では受け付けてもらえない。
-- Drizzleのトリガーとトリガー関数はSLQ文で直接SupabaseのGUI SQL Editor に貼り付けます。

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
  RETURN NEW;
END;
$$;


-- トリガーの作成
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

---

-- AIに聞いた
-- カスタムクレームが変更された時同期されないのではないか？



-- このトリガーでは新規作成（INSERT）イベントしか扱っていないため、ユーザー情報の更新（UPDATE）や削除（DELETE）には対応できません。

-- このコードは、auth.users テーブルに新しい行が追加されたとき（つまり、新規ユーザーが登録されたとき）にのみ、public.auth_users テーブルにデータをコピーします。

-- 新規作成（INSERT）: on_auth_user_created トリガーが発動し、handle_new_user() 関数が実行されます。

-- 更新（UPDATE）: このトリガーはAFTER UPDATEが定義されていないため、何も実行されません。

-- 削除（DELETE）: このトリガーはAFTER DELETEが定義されていないため、何も実行されません。

-- 完全な同期を実現するには
-- データの不整合を防ぐためには、INSERTだけでなく、UPDATEとDELETEのイベントにも対応するトリガーを設定する必要があります。

-- 以下に、より完全な同期を実現するためのトリガーの例を示します。

-- SQL

-- -- トリガー関数の作成
-- CREATE OR REPLACE FUNCTION public.handle_user_changes()
-- RETURNS trigger
-- LANGUAGE plpgsql
-- SECURITY DEFINER
-- SET search_path = ''
-- AS $$
-- BEGIN
--   IF TG_OP = 'INSERT' THEN
--     -- 新規ユーザー作成時に public.users に挿入
--     INSERT INTO public.users (id, email)
--     VALUES (NEW.id, NEW.email);
--     RETURN NEW;
--   ELSIF TG_OP = 'UPDATE' THEN
--     -- ユーザー情報更新時に public.users も更新
--     UPDATE public.users
--     SET email = NEW.email
--     WHERE id = NEW.id;
--     RETURN NEW;
--   ELSIF TG_OP = 'DELETE' THEN
--     -- ユーザー削除時に public.users からも削除
--     DELETE FROM public.users
--     WHERE id = OLD.id;
--     RETURN OLD;
--   END IF;
-- END;
-- $$;

-- ---

-- -- トリガーの作成
-- -- INSERT, UPDATE, DELETEの各イベントに対応
-- CREATE TRIGGER on_auth_user_changes
-- AFTER INSERT OR UPDATE OR DELETE ON auth.users
-- FOR EACH ROW
-- EXECUTE FUNCTION public.handle_user_changes();
-- このコードでは、IF TG_OP = '...' THEN という条件分岐を使って、どの操作（INSERT、UPDATE、DELETE）が実行されたかに応じて異なる処理を行います。

-- INSERT: NEWという特別な変数から新しいユーザーの情報を取得し、public.usersに挿入します。

-- UPDATE: NEWから更新後の情報を取得し、public.usersの該当レコードを更新します。

-- DELETE: OLDという特別な変数から削除されるユーザーの情報を取得し、public.usersから削除します。

-- このように、すべてのイベントに対応するトリガーを設定することで、auth.users と public.users の間での完全なデータ同期が実現でき、データの不整合を回避できます。
