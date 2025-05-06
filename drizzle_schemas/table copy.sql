-- profiles テーブルの作成
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY,
  aud TEXT,
  role TEXT
);

-- トリガー関数の作成
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, aud, role)
  VALUES (NEW.id, NEW.aud, NEW.role);
  RETURN NEW;
END;
$$;

