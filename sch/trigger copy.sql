-- 既存のトリガー関数を削除（存在する場合）
drop function if exists public.handle_new_user();

-- 新しいユーザーが auth.users に挿入されたときに public.root_account に行を挿入する関数
create function public.handle_new_user()
  returns trigger
  language plpgsql
  security definer
  set search_path = public
as $$
begin
  insert into public.root_account (
    id, aud, role, email, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, confirmed_at,
    is_sso_user, is_anonymous, provider,
    name, avatar_url, created_at, updated_at
  ) values (
    new.id, new.aud, new.role, new.email, new.email_confirmed_at,
    new.raw_app_meta_data, new.raw_user_meta_data, new.confirmed_at,
    new.is_sso_user, new.is_anonymous,
    (select provider from jsonb_array_elements(new.identities) limit 1),
    new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'avatar_url',
    new.created_at, new.updated_at
  );
  return new;
end;
$$;

-- 既存のトリガーを削除（存在する場合）
drop trigger if exists on_auth_user_created on auth.users;

-- auth.users テーブルに新しい行が挿入された後に関数を実行するトリガーを作成します
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute procedure public.handle_new_user();
