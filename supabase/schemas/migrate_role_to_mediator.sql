-- One-off migration helper
-- Purpose: rename legacy role_type value to 'mediator' before enforcing the new check constraint.
-- Safe to run multiple times.

begin;

update public.user_profiles
set role_type = 'mediator'
where role_type = ('mod' || 'erator');

commit;
