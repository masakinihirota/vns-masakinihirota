delete_at カラムは通常、アクティブなレコードに対してNULL値を持ちます。

ユーザーがユーザーデータを削除ご一定期間後に、Webアプリ側でも削除します。10年後とか？
これは余裕がある場合は削除しません。

コピーする項目

```sql
create table public.root_accounts (
  id uuid not null,
--   raw_app_meta_data jsonb null,
--   raw_user_meta_data jsonb null,
--   is_anonymous boolean not null default false,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
--   constraint auth_users_pkey primary key (id),
) TABLESPACE pg_default;

```
