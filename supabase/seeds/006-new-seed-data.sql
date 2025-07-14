-- 新規Seedデータ

-- User Profiles
INSERT INTO public.user_profiles (id, root_account_id, profile_name, profile_name_with_timestamp, profile_type, purpose, is_anonymous, is_leader, current_status, is_hidden, created_at, updated_at) VALUES
('c0000008-0000-0000-0000-000000000017', 'c0000007-0000-0000-0000-000000000006', 'New_Profile_1', '20250101120016_New_Profile_1', '本人_匿名', '趣味', true, false, '趣味仲間募集中', false, NOW(), NOW()),
('c0000008-0000-0000-0000-000000000018', 'c0000007-0000-0000-0000-000000000007', 'New_Profile_2', '20250101120017_New_Profile_2', '本人_認証済実名', '仕事', false, true, '仕事仲間募集中', false, NOW(), NOW());

-- User Profile Purposes
INSERT INTO public.user_profile_purposes (id, user_profile_id, purpose, is_primary, created_at) VALUES
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000017', '趣味', true, NOW()),
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000018', '仕事', true, NOW());

-- User Profile Skills
INSERT INTO public.user_profile_skills (id, user_profile_id, skill_id, skill_level, collaboration_desire, display_type, mandala_position, created_at, updated_at) VALUES
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000017', 'c0000003-0000-0000-0000-000000000002', 3, 4, 'list', NULL, NOW(), NOW()),
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000018', 'c0000003-0000-0000-0000-000000000004', 5, 5, 'mandala', 1, NOW(), NOW());

-- User Profile Favorite Works
INSERT INTO public.user_profile_favorite_works (user_profile_id, work_id, category, tier_rating, my_evaluation, personal_note, evaluation_tier, time_segment, created_at, updated_at) VALUES
('c0000008-0000-0000-0000-000000000017', 'c0000004-0000-0000-0000-000000000001', '趣味', 'Tier1', 5, '趣味で最も好きな作品', 'S', 'recent', NOW(), NOW()),
('c0000008-0000-0000-0000-000000000018', 'c0000004-0000-0000-0000-000000000002', '仕事', 'Tier2', 4, '仕事に役立つ作品', 'A', 'life', NOW(), NOW());

-- User Profile Value Evaluations
INSERT INTO public.user_profile_value_evaluations (id, evaluated_profile_id, evaluator_profile_id, value_question_id, selected_choice_id, evaluation_comment, created_at) VALUES
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000017', 'c0000008-0000-0000-0000-000000000018', 'c0000005-0000-0000-0000-000000000001', 'c0000006-0000-0000-0000-000000000002', '趣味に関する価値観が素晴らしい', NOW()),
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000018', 'c0000008-0000-0000-0000-000000000017', 'c0000005-0000-0000-0000-000000000002', 'c0000006-0000-0000-0000-000000000005', '仕事に関する価値観が非常に良い', NOW());

-- User Profile Mandala Charts
INSERT INTO public.user_profile_mandala_charts (id, user_profile_id, chart_name, center_goal, position_1, position_2, position_3, position_4, markdown_content, created_at, updated_at) VALUES
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000017', '趣味向けマンダラチャート', '趣味を充実させる', '趣味仲間を増やす', '趣味のスキルを磨く', '趣味の時間を確保する', '趣味の情報を収集する', '# 趣味向けマンダラチャート\n\n## 中央目標\n趣味を充実させる\n\n## 取り組み\n1. 趣味仲間を増やす\n...', NOW(), NOW()),
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000018', '仕事向けマンダラチャート', '仕事の効率を上げる', 'チームメンバーを増やす', 'スキルを磨く', '時間管理を改善する', '情報収集を効率化する', '# 仕事向けマンダラチャート\n\n## 中央目標\n仕事の効率を上げる\n\n## 取り組み\n1. チームメンバーを増やす\n...', NOW(), NOW());
