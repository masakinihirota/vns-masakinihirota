-- Seedデータ挿入用サンプル sql
-- INSERT INTO "public"."movies" ("id", "name", "description")
-- VALUES
--   (1, 'The Empire Strikes Back', 'After the Rebels are brutally overpowered by the Empire on the ice planet Hoth, Luke Skywalker begins Jedi training with Yoda.'),
--   (12, 'name', 'description'),
--
-- Seed for root_accounts related tables: languages, auth_users, root_accounts
-- This file adds a small, referentially-consistent dataset useful for local development.
-- Adjust UUIDs and timestamps as needed for your environment.

-- Languages
INSERT INTO public.languages (id, name, native_name) VALUES
	('en', 'English', 'English'),
	('ja', 'Japanese', '日本語')
ON CONFLICT (id) DO NOTHING;

-- Auth users (minimal fields to satisfy references)
-- Note: ids are UUIDs. If your auth system (Supabase) manages users, prefer linking real user ids.
INSERT INTO public.auth_users (
	id, aud, role, email, is_anonymous, created_at, updated_at
) VALUES
	('00000000-0000-0000-0000-000000000001', 'authenticated', 'user', 'alice@example.test', false, now(), now()),
	('00000000-0000-0000-0000-000000000002', 'authenticated', 'user', 'bob@example.test', false, now(), now()),
	('00000000-0000-0000-0000-000000000003', 'authenticated', 'user', NULL, true, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Root accounts
-- oauth_providers is a text[] and oauth_count must match the array length (business rule check)
INSERT INTO public.root_accounts (
	id, auth_user_id, created_at, updated_at,
	is_verified, mother_tongue_code, site_language_code, birth_generation,
	total_points, max_points, last_point_recovery_at, total_consumed_points,
	activity_points, click_points, consecutive_days, trust_score,
	oauth_providers, oauth_count, account_status
) VALUES
	(
		'11111111-1111-1111-1111-111111111111',
		'00000000-0000-0000-0000-000000000001',
		now(), now(),
		true, 'en', 'ja', '1990s',
		120, 1000, now(), 10,
		50, 5, 7, 80,
		ARRAY['google']::text[], 1, 'active'
	),
	(
		'22222222-2222-2222-2222-222222222222',
		'00000000-0000-0000-0000-000000000002',
		now(), now(),
		false, 'ja', 'ja', '1980s',
		500, 1500, now(), 200,
		300, 20, 30, 60,
		ARRAY['github','google']::text[], 2, 'active'
	),
	(
		'33333333-3333-3333-3333-333333333333',
		'00000000-0000-0000-0000-000000000003',
		now(), now(),
		false, 'ja', 'en', '2000s',
		0, 500, now(), 0,
		0, 0, 0, 10,
		ARRAY[]::text[], 0, 'pending'
	)
ON CONFLICT (id) DO NOTHING;




