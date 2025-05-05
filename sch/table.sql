create table users (
  id uuid primary key not null,
  user_id uuid,
  user_name text,
  created_at timestamp ,
  updated_at timestamp
);


create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (user_id, user_name)
  values (new.id, new.raw_app_meta_data ->>'user_name');
  return new;
end;
$$;sss

-- trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
