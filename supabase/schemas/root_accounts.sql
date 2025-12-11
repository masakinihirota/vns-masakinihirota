-- root_accounts table definition

create table if not exists public.root_accounts (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid references auth.users(id) on delete cascade not null unique,
  points integer not null default 3000 check (points >= 0),
  level integer not null default 1 check (level >= 1),
  trust_days integer not null default 0 check (trust_days >= 0),
  data_retention_days integer default 30,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.root_accounts enable row level security;

-- Policies
create policy "Users can view own root account"
  on public.root_accounts
  for select
  using (auth.uid() = auth_user_id);

create policy "Users can update own root account"
  on public.root_accounts
  for update
  using (auth.uid() = auth_user_id);

-- Trigger to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.root_accounts (auth_user_id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger creation (DROP to ensure idempotency if running manually multiple times, though usually handled by migrations)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
