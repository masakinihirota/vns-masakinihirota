
-- トリガー関数の作成
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.root_account (id, aud, role, email, email_confirmed_at, last_sign_in_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
  VALUES (NEW.id, NEW.aud, NEW.role, NEW.email, NEW.email_confirmed_at, NEW.last_sign_in_at, NEW.created_at, NEW.updated_at, NEW.raw_app_meta_data, NEW.raw_user_meta_data);
  RETURN NEW;
END;
$$;

-- Supabaseで利用するときはダッシュボードのSQL EDITORからトリガーのSQL文を実行してtriggerを登録すること、それ以外の方法では受け付けてもらえない。
-- トリガーの作成
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

