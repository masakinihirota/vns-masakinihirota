-- user_profiles table definition

create table if not exists public.user_profiles (
  id uuid primary key default gen_random_uuid(),
  root_account_id uuid references public.root_accounts(id) on delete cascade not null,
  display_name text not null,
  purpose text,
  role_type text not null default 'member',
  is_active boolean not null default true,
  last_interacted_record_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint role_type_check check (role_type in ('leader', 'member', 'admin', 'moderator')) -- Adding basic check
);

create index idx_user_profiles_root_account_id on public.user_profiles(root_account_id);

alter table public.user_profiles enable row level security;

-- Policies
create policy "Users can view own profiles"
  on public.user_profiles
  for select
  using (
    root_account_id in (
      select id from public.root_accounts where auth_user_id = auth.uid()
    )
  );

create policy "Users can insert own profiles"
  on public.user_profiles
  for insert
  with check (
    root_account_id in (
      select id from public.root_accounts where auth_user_id = auth.uid()
    )
  );

create policy "Users can update own profiles"
  on public.user_profiles
  for update
  using (
    root_account_id in (
      select id from public.root_accounts where auth_user_id = auth.uid()
    )
  );

create policy "Users can delete own profiles"
  on public.user_profiles
  for delete
  using (
    root_account_id in (
      select id from public.root_accounts where auth_user_id = auth.uid()
    )
  );
