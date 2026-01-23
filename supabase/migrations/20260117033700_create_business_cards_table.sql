create table if not exists business_cards (
  id uuid primary key default gen_random_uuid(),
  user_profile_id uuid not null references user_profiles(id) on delete cascade unique,
  is_published boolean default false not null,
  display_config jsonb default '{}'::jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table business_cards enable row level security;

-- Policy: View cards
-- 1. Owners can view their own cards (via user_profile -> root_account)
-- 2. Anyone can view if is_published is true (Public access)
-- Note: 'auth.uid()' in Supabase corresponds to the user's ID in auth.users.
-- We assume root_accounts is linked to auth.users 1:1.
-- However, checking ownership via join in RLS might be expensive or complex without helper functions.
-- For simplicity in this project context, users usually access their data via server-side logic where we can verify ownership before query,
-- OR we trust the RLS.
-- Let's rely on a common pattern: if the user can see the profile, they can see the card, OR if published.

create policy "Owners can view their own business card"
  on business_cards for select
  using (
    exists (
      select 1 from user_profiles
      join root_accounts on user_profiles.root_account_id = root_accounts.id
      where user_profiles.id = business_cards.user_profile_id
      and root_accounts.auth_user_id = auth.uid()
    )
  );

create policy "Public can view published business cards"
  on business_cards for select
  using (is_published = true);

-- Policy: Update cards
-- Owners can update their own cards
create policy "Owners can update their own business card"
  on business_cards for update
  using (
    exists (
      select 1 from user_profiles
      join root_accounts on user_profiles.root_account_id = root_accounts.id
      where user_profiles.id = business_cards.user_profile_id
      and root_accounts.auth_user_id = auth.uid()
    )
  );

-- Policy: Insert cards
-- Owners can insert cards for their own profiles
create policy "Owners can create their own business card"
  on business_cards for insert
  with check (
    exists (
      select 1 from user_profiles
      join root_accounts on user_profiles.root_account_id = root_accounts.id
      where user_profiles.id = business_cards.user_profile_id
      and root_accounts.auth_user_id = auth.uid()
    )
  );

-- Indexes
create index business_cards_user_profile_id_idx on business_cards(user_profile_id);
