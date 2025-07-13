-- 拡張ユーザープロフィールデータ
-- 要件定義書に基づく「千の仮面」機能のデモデータ

-- 相互フォロー関係のシードデータ
INSERT INTO public.mutual_follows (id, follower_root_account_id, following_root_account_id, is_mutual, followed_at) VALUES
(extensions.uuid_generate_v4(), 'c0000007-0000-0000-0000-000000000001', 'c0000007-0000-0000-0000-000000000002', true, NOW()),
(extensions.uuid_generate_v4(), 'c0000007-0000-0000-0000-000000000002', 'c0000007-0000-0000-0000-000000000001', true, NOW()),
(extensions.uuid_generate_v4(), 'c0000007-0000-0000-0000-000000000004', 'c0000007-0000-0000-0000-000000000005', true, NOW()),
(extensions.uuid_generate_v4(), 'c0000007-0000-0000-0000-000000000005', 'c0000007-0000-0000-0000-000000000004', true, NOW()),
(extensions.uuid_generate_v4(), 'c0000007-0000-0000-0000-000000000001', 'c0000007-0000-0000-0000-000000000003', false, NOW());

-- 隠しプロフィールのデモデータ
-- 妊活相談用の隠しプロフィール
INSERT INTO public.user_profiles (id, root_account_id, profile_name, profile_name_with_timestamp, profile_type, purpose, is_anonymous, is_leader, current_status, is_hidden) VALUES
('c0000008-0000-0000-0000-000000000009', 'c0000007-0000-0000-0000-000000000004', 'Hidden_Counseling', '20250101120008_Hidden_Counseling', '本人_匿名', '相活', true, false, '悩み相談相手募集中', true),
('c0000008-0000-0000-0000-000000000010', 'c0000007-0000-0000-0000-000000000005', 'Hidden_Support', '20250101120009_Hidden_Support', '本人_匿名', '妊活', true, false, '同じ悩み仲間募集中', true);

-- 隠しプロフィール用の目的設定（修正版）
INSERT INTO public.user_profile_purposes (id, user_profile_id, purpose, is_primary) VALUES
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000009', '相活', true),
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000009', '悩み相談', false),
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000010', '妊活', true),
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000010', '相活', false);

-- 「シュレディンガー猫主義」のデモデータ
-- 他人から見たプロフィール
INSERT INTO public.user_profiles (id, root_account_id, profile_name, profile_name_with_timestamp, profile_type, purpose, is_anonymous, is_leader) VALUES
('c0000008-0000-0000-0000-000000000011', 'c0000007-0000-0000-0000-000000000002', 'Taro_from_John_view', '20250101120010_Taro_from_John_view', '他人', 'John_Devから見たTaro_Work', true, false),
('c0000008-0000-0000-0000-000000000012', 'c0000007-0000-0000-0000-000000000001', 'John_from_Taro_view', '20250101120011_John_from_Taro_view', '他人', 'Taro_Workから見たJohn_Dev', true, false);

-- 他人視点での価値観評価（テーブル名を修正）
INSERT INTO public.user_profile_values (user_profile_id, value_question_id, selected_choice_id, value_category, evaluator_profile_id) VALUES
-- John_DevがTaro_Workをどう見ているか
('c0000008-0000-0000-0000-000000000001', 'c0000005-0000-0000-0000-000000000001', 'c0000006-0000-0000-0000-000000000002', '基本', 'c0000008-0000-0000-0000-000000000003'),
-- Taro_WorkがJohn_Devをどう見ているか
('c0000008-0000-0000-0000-000000000003', 'c0000005-0000-0000-0000-000000000001', 'c0000006-0000-0000-0000-000000000002', '基本', 'c0000008-0000-0000-0000-000000000001');

-- 分離されたプロフィールのデモデータ（purpose値を修正）
INSERT INTO public.user_profiles (id, root_account_id, profile_name, profile_name_with_timestamp, profile_type, purpose, is_anonymous, is_leader, separated_password, is_separated) VALUES
('c0000008-0000-0000-0000-000000000013', 'c0000007-0000-0000-0000-000000000003', 'Separated_Profile', '20250101120012_Separated_Profile', '本人_匿名', '特別な活動', true, false, 'hashed_password_example', true);

-- 分離プロフィール用の独立したSNSアカウント
INSERT INTO public.user_profile_sns_accounts (id, user_profile_id, platform, account_url, account_name, is_verified) VALUES
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000013', 'Twitter', 'https://twitter.com/separated_account', '@separated_account', false);

-- 作成数制限のデモ用データ
-- 無料アカウントの制限デモ（5つまで）
INSERT INTO public.user_profiles (id, root_account_id, profile_name, profile_name_with_timestamp, profile_type, purpose, is_anonymous) VALUES
('c0000008-0000-0000-0000-000000000014', 'c0000007-0000-0000-0000-000000000004', 'Profile_4th', '20250101120013_Profile_4th', '本人_匿名', '4つ目のプロフィール', true),
('c0000008-0000-0000-0000-000000000015', 'c0000007-0000-0000-0000-000000000004', 'Profile_5th', '20250101120014_Profile_5th', '本人_匿名', '5つ目のプロフィール（制限ギリギリ）', true);

-- 政治活動用プロフィール（purpose値を修正）
INSERT INTO public.user_profiles (id, root_account_id, profile_name, profile_name_with_timestamp, profile_type, purpose, is_anonymous, is_verified) VALUES
('c0000008-0000-0000-0000-000000000016', 'c0000007-0000-0000-0000-000000000005', 'Political_Activity', '20250101120015_Political_Activity', '本人_認証済実名', '政治活動', false, true);

-- 政治活動用の目的設定
INSERT INTO public.user_profile_purposes (id, user_profile_id, purpose, is_primary) VALUES
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000016', '政活_政治', true);

-- 政治活動用の連絡先（実名での活動）
INSERT INTO public.user_profile_contact_methods (id, user_profile_id, contact_type, contact_value, is_copied_from_root) VALUES
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000016', 'email', 'political.activity@example.com', false),
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000016', 'other', '政治活動用連絡先: 03-1234-5678', false);
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000016', 'other', '政治活動用連絡先: 03-1234-5678', false);
