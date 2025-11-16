-- Access control schema migration generated per ExecPlan milestone 1

set default_tablespace = '';
set default_table_access_method = heap;

-- Enum definitions (idempotent)
do $$
begin
  if not exists (select 1 from pg_type where typname = 'acl_permission_resource') then
    create type public.acl_permission_resource as enum (
      'account',
      'group',
      'matching',
      'transaction',
      'operations',
      'settings',
      'public'
    );
  end if;
end
$$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'acl_permission_action') then
    create type public.acl_permission_action as enum (
      'view',
      'create',
      'update',
      'delete',
      'approve',
      'export',
      'manage'
    );
  end if;
end
$$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'acl_permission_constraint') then
    create type public.acl_permission_constraint as enum (
      'none',
      'ownership',
      'segment',
      'expression'
    );
  end if;
end
$$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'acl_permission_effect') then
    create type public.acl_permission_effect as enum ('allow', 'deny');
  end if;
end
$$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'acl_permission_scope_domain') then
    create type public.acl_permission_scope_domain as enum (
      'global',
      'group',
      'country'
    );
  end if;
end
$$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'acl_membership_state') then
    create type public.acl_membership_state as enum (
      'pending',
      'active',
      'suspended',
      'revoked'
    );
  end if;
end
$$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'acl_exception_status') then
    create type public.acl_exception_status as enum (
      'pending',
      'approved',
      'rejected',
      'expired',
      'revoked'
    );
  end if;
end
$$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'acl_effective_permission_source') then
    create type public.acl_effective_permission_source as enum (
      'role',
      'exception',
      'system'
    );
  end if;
end
$$;

-- Table: acl_roles
create table if not exists public.acl_roles (
  id uuid primary key default gen_random_uuid(),
  root_account_id uuid not null references public.root_accounts(id) on delete cascade,
  code varchar(64) not null,
  name varchar(128) not null,
  description text,
  priority integer not null default 100,
  is_system boolean not null default false,
  delegatable boolean not null default false,
  created_by uuid references public.auth_users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint acl_roles_root_account_code_unique unique (root_account_id, code)
);

create index if not exists acl_roles_priority_idx on public.acl_roles (root_account_id, priority);
create index if not exists acl_roles_is_system_idx on public.acl_roles (is_system);

-- Table: acl_permissions
create table if not exists public.acl_permissions (
  id uuid primary key default gen_random_uuid(),
  resource_type acl_permission_resource not null,
  action acl_permission_action not null,
  constraint_type acl_permission_constraint not null default 'none',
  constraint_payload jsonb not null default '{}'::jsonb,
  description text,
  created_at timestamptz not null default now(),
  constraint acl_permissions_unique unique (resource_type, action, constraint_type)
);

-- Table: acl_role_permissions
create table if not exists public.acl_role_permissions (
  id uuid primary key default gen_random_uuid(),
  role_id uuid not null references public.acl_roles(id) on delete cascade,
  permission_id uuid not null references public.acl_permissions(id) on delete cascade,
  effect acl_permission_effect not null default 'allow',
  scope_domain acl_permission_scope_domain not null default 'global',
  scope_filter jsonb not null default '{}'::jsonb,
  valid_from timestamptz,
  valid_until timestamptz,
  last_updated_by uuid references public.auth_users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint acl_role_permissions_unique unique (role_id, permission_id, scope_domain, effect)
);

create index if not exists acl_role_permissions_valid_until_idx
  on public.acl_role_permissions (valid_until);

-- Table: acl_memberships
create table if not exists public.acl_memberships (
  id uuid primary key default gen_random_uuid(),
  root_account_id uuid not null references public.root_accounts(id) on delete cascade,
  user_id uuid not null references public.auth_users(id) on delete cascade,
  role_id uuid not null references public.acl_roles(id) on delete cascade,
  state acl_membership_state not null default 'pending',
  valid_from timestamptz not null default now(),
  valid_until timestamptz,
  delegation_depth integer not null default 0,
  created_by uuid references public.auth_users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint acl_memberships_delegation_depth_non_negative check (delegation_depth >= 0),
  constraint acl_memberships_delegation_depth_limit check (delegation_depth <= 5),
  constraint acl_memberships_unique unique (root_account_id, user_id, role_id)
);

create index if not exists acl_memberships_state_idx
  on public.acl_memberships (root_account_id, user_id, state);

-- Table: acl_exception_grants
create table if not exists public.acl_exception_grants (
  id uuid primary key default gen_random_uuid(),
  membership_id uuid not null references public.acl_memberships(id) on delete cascade,
  resource_type acl_permission_resource not null,
  resource_id uuid,
  action acl_permission_action not null,
  expires_at timestamptz not null,
  approval_chain jsonb not null default '[]'::jsonb,
  status acl_exception_status not null default 'pending',
  reason text,
  created_by uuid references public.auth_users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists acl_exception_grants_membership_status_idx
  on public.acl_exception_grants (membership_id, status);

create index if not exists acl_exception_grants_expires_at_idx
  on public.acl_exception_grants (expires_at);

-- Root accounts default role linkage
alter table public.root_accounts
  add column if not exists default_role_id uuid;

alter table public.root_accounts
  add constraint root_accounts_default_role_fk
  foreign key (default_role_id) references public.acl_roles(id)
  on delete set null;

-- Auth users role refresh audit column
alter table public.auth_users
  add column if not exists last_role_refresh_at timestamptz;

-- Materialized view (logical view) for effective permissions
create or replace view public.vw_effective_permissions as
with active_memberships as (
  select
    m.id,
    m.user_id,
    m.root_account_id,
    m.role_id
  from public.acl_memberships m
  where m.state = 'active'
    and (m.valid_from is null or m.valid_from <= now())
    and (m.valid_until is null or m.valid_until >= now())
)
select
  am.user_id,
  am.root_account_id,
  rp.permission_id,
  p.resource_type,
  p.action,
  rp.effect,
  rp.scope_domain,
  coalesce(rp.scope_filter, '{}'::jsonb) as scope_filter,
  rp.valid_from,
  rp.valid_until,
  null::uuid as resource_id,
  'role'::acl_effective_permission_source as source,
  rp.updated_at
from active_memberships am
  join public.acl_role_permissions rp on rp.role_id = am.role_id
  join public.acl_permissions p on p.id = rp.permission_id
where (rp.valid_from is null or rp.valid_from <= now())
  and (rp.valid_until is null or rp.valid_until >= now())
union all
select
  am.user_id,
  am.root_account_id,
  null as permission_id,
  eg.resource_type,
  eg.action,
  'allow'::acl_permission_effect as effect,
  'global'::acl_permission_scope_domain as scope_domain,
  '{}'::jsonb as scope_filter,
  null as valid_from,
  eg.expires_at as valid_until,
  eg.resource_id,
  'exception'::acl_effective_permission_source as source,
  eg.updated_at
from active_memberships am
  join public.acl_exception_grants eg on eg.membership_id = am.id
where eg.status = 'approved'
  and eg.expires_at >= now();

-- Permission evaluation function
create or replace function public.check_permission(
  p_user_id uuid,
  p_root_account_id uuid,
  p_resource_type acl_permission_resource,
  p_action acl_permission_action,
  p_resource_id uuid default null,
  p_context jsonb default '{}'::jsonb
) returns boolean
language plpgsql
security definer
as $$
declare
  context jsonb := coalesce(p_context, '{}'::jsonb);
  allow_exists boolean := false;
  perm record;
  scope_matches boolean;
  constraint_matches boolean;
begin
  if exists (
    select 1
    from public.acl_exception_grants eg
      join public.acl_memberships m on m.id = eg.membership_id
    where m.user_id = p_user_id
      and m.root_account_id = p_root_account_id
      and m.state = 'active'
      and (m.valid_from is null or m.valid_from <= now())
      and (m.valid_until is null or m.valid_until >= now())
      and eg.status = 'approved'
      and eg.expires_at >= now()
      and eg.resource_type = p_resource_type
      and eg.action = p_action
      and (
        (eg.resource_id is not null and p_resource_id is not null and eg.resource_id = p_resource_id)
        or eg.resource_id is null
      )
  ) then
    return true;
  end if;

  for perm in
    select
      rp.effect,
      rp.scope_domain,
      coalesce(rp.scope_filter, '{}'::jsonb) as scope_filter,
      p.constraint_type,
      coalesce(p.constraint_payload, '{}'::jsonb) as constraint_payload
    from public.acl_memberships m
      join public.acl_role_permissions rp on rp.role_id = m.role_id
      join public.acl_permissions p on p.id = rp.permission_id
    where m.user_id = p_user_id
      and m.root_account_id = p_root_account_id
      and m.state = 'active'
      and (m.valid_from is null or m.valid_from <= now())
      and (m.valid_until is null or m.valid_until >= now())
      and (rp.valid_from is null or rp.valid_from <= now())
      and (rp.valid_until is null or rp.valid_until >= now())
      and p.resource_type = p_resource_type
      and p.action = p_action
  loop
    scope_matches := false;

    if perm.scope_domain = 'global' then
      scope_matches := true;
    elsif perm.scope_domain = 'group' then
      if context ? 'group_id' then
        if perm.scope_filter ? 'group_id' then
          scope_matches := (context ->> 'group_id') = (perm.scope_filter ->> 'group_id');
        else
          scope_matches := true;
        end if;
      end if;
    elsif perm.scope_domain = 'country' then
      if context ? 'country_id' then
        if perm.scope_filter ? 'country_id' then
          scope_matches := (context ->> 'country_id') = (perm.scope_filter ->> 'country_id');
        else
          scope_matches := true;
        end if;
      end if;
    end if;

    if scope_matches and perm.scope_filter ? 'resource_id' then
      scope_matches :=
        p_resource_id is not null
        and (perm.scope_filter ->> 'resource_id') = p_resource_id::text;
    end if;

    if not scope_matches then
      continue;
    end if;

    constraint_matches := false;
    case perm.constraint_type
      when 'none' then
        constraint_matches := true;
      when 'ownership' then
        if context ? 'owner_user_id' then
          constraint_matches := (context ->> 'owner_user_id') = p_user_id::text;
        elsif context ? 'is_owner' then
          constraint_matches := lower(context ->> 'is_owner') in ('true', 't', '1');
        end if;
      when 'segment' then
        if (perm.constraint_payload ? 'segment') and (context ? 'segment') then
          constraint_matches := (perm.constraint_payload ->> 'segment') = (context ->> 'segment');
        end if;
      when 'expression' then
        if context ? 'expression_result' then
          constraint_matches := lower(context ->> 'expression_result') in ('true', 't', '1');
        end if;
    end case;

    if not constraint_matches then
      continue;
    end if;

    if perm.effect = 'deny' then
      return false;
    elsif perm.effect = 'allow' then
      allow_exists := true;
    end if;
  end loop;

  return allow_exists;
end;
$$;

comment on function public.check_permission is 'Returns true when the given user is allowed to perform the requested action against the specified resource within the provided root account context.';

