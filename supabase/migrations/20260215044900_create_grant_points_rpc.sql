-- Create grant_points RPC for secure point transactions
create or replace function grant_points(
  p_user_id uuid,
  p_amount int,
  p_type text,
  p_description text default null
) returns jsonb
language plpgsql
security definer -- Execute with privileges of the creator (bypassing RLS for point updates)
as $$
declare
  v_root_account_id uuid;
  v_current_points int;
  v_new_points int;
begin
  -- 1. Get Root Account
  select id, points into v_root_account_id, v_current_points
  from root_accounts
  where auth_user_id = p_user_id;

  if not found then
    return jsonb_build_object('success', false, 'message', 'Root account not found');
  end if;

  -- 2. Duplicate Check (specific logic for daily_login)
  if p_type = 'daily_login' then
    if exists (
      select 1 from point_transactions
      where root_account_id = v_root_account_id
      and type = 'daily_login'
      and date(created_at) = current_date
    ) then
      return jsonb_build_object('success', false, 'message', 'Already claimed daily bonus today');
    end if;
  end if;

  -- 3. Insert Transaction
  insert into point_transactions (root_account_id, amount, type, description)
  values (v_root_account_id, p_amount, p_type, p_description);

  -- 4. Update Points
  update root_accounts
  set points = points + p_amount,
      updated_at = now()
  where id = v_root_account_id
  returning points into v_new_points;

  return jsonb_build_object('success', true, 'new_balance', v_new_points);
end;
$$;
