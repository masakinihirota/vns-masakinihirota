-- User & Group Data

-- Root Accounts
INSERT INTO public.root_accounts (id, email, is_verified, mother_tongue_code, site_language_code, birth_generation, living_area_segment, total_points) VALUES
('c0000007-0000-0000-0000-000000000001', 'user1@example.com', true, 'ja', 'ja', '1990s', 'urban', 1000),
('c0000007-0000-0000-0000-000000000002', 'user2@example.com', true, 'en', 'en', '2000s', 'suburban', 1000),
('c0000007-0000-0000-0000-000000000003', 'user3-penalty@example.com', true, 'ja', 'ja', '1980s', 'rural', 500),
('c0000007-0000-0000-0000-000000000004', 'user4@example.com', true, 'ja', 'ja', '1990s', 'urban', 1200),
('c0000007-0000-0000-0000-000000000005', 'user5@example.com', true, 'en', 'en', '2000s', 'suburban', 1500);


-- User Profiles（新しいフィールド構造に対応）
INSERT INTO public.user_profiles (id, root_account_id, profile_name, profile_name_with_timestamp, profile_type, purpose, is_anonymous, is_leader, group_name, alliance_name, primary_languages, current_status, is_hidden, separated_password, is_separated, status, is_verified) VALUES
('c0000008-0000-0000-0000-000000000001', 'c0000007-0000-0000-0000-000000000001', 'Taro_Work', '20250101120000_Taro_Work', '本人_匿名', '仕事', true, true, NULL, NULL, ARRAY['ja'], 'メンバー募集中', false, NULL, false, 'active', false),
('c0000008-0000-0000-0000-000000000002', 'c0000007-0000-0000-0000-000000000001', 'Taro_Hobby', '20250101120001_Taro_Hobby', '本人_匿名', '趣味', true, false, 'ガンダム好きの集い', NULL, ARRAY['ja'], '趣味仲間募集中', false, NULL, false, 'active', false),
('c0000008-0000-0000-0000-000000000003', 'c0000007-0000-0000-0000-000000000002', 'John_Dev', '20250101120002_John_Dev', '本人_匿名', '仕事', true, false, '技術者たちの集い', NULL, ARRAY['en', 'ja'], '開発メンバー募集中', false, NULL, false, 'active', false),
('c0000008-0000-0000-0000-000000000004', 'c0000007-0000-0000-0000-000000000002', 'John_Game', '20250101120003_John_Game', '本人_匿名', '趣味', true, false, 'レトロゲーム部', NULL, ARRAY['en'], 'ゲーム仲間募集中', false, NULL, false, 'active', false),
('c0000008-0000-0000-0000-000000000005', 'c0000007-0000-0000-0000-000000000003', 'Anonymous_Other', '20250101120004_Anonymous_Other', '本人_匿名', 'その他', true, false, 'ギャグマンガを読む会', NULL, ARRAY['ja'], NULL, false, NULL, false, 'active', false),
('c0000008-0000-0000-0000-000000000006', 'c0000007-0000-0000-0000-000000000004', 'Anime_Fan', '20250101120005_Anime_Fan', '本人_匿名', '趣味', true, false, NULL, 'サブカルチャー連合', ARRAY['ja'], '推し活仲間募集中', false, NULL, false, 'active', false),
('c0000008-0000-0000-0000-000000000007', 'c0000007-0000-0000-0000-000000000005', 'Hanako_Anime', '20250101120006_Hanako_Anime', '本人_匿名', '趣味', true, true, '日常系アニメ愛好会', 'サブカルチャー連合', ARRAY['ja'], 'イラスト仲間募集中', false, NULL, false, 'active', false),
('c0000008-0000-0000-0000-000000000008', 'c0000007-0000-0000-0000-000000000005', 'Mike_Manga', '20250101120007_Mike_Manga', '本人_匿名', '趣味', true, true, 'ギャグマンガを読む会', 'サブカルチャー連合', ARRAY['ja'], '漫画制作仲間募集中', true, NULL, false, 'active', false);

-- Groups (Expanded)
INSERT INTO public.groups (id, name, description, leader_user_profile_id, is_public, status, visibility) VALUES
('c0000009-0000-0000-0000-000000000001', 'ガンダム好きの集い', 'ガンダムシリーズについて語り合うグループです。', 'c0000008-0000-0000-0000-000000000002', true, 'active', 'public'),
('c0000009-0000-0000-0000-000000000002', '日常系アニメ愛好会', 'けいおん！や日常などのアニメが好きな人の集まり', 'c0000008-0000-0000-0000-000000000007', true, 'active', 'public'),
('c0000009-0000-0000-0000-000000000003', 'ギャグマンガを読む会', '笑えるマンガについて情報交換するグループ', 'c0000008-0000-0000-0000-000000000005', true, 'active', 'public'),
('c0000009-0000-0000-0000-000000000004', 'レトロゲーム部', '昔懐かしいゲームを語り合う部活', 'c0000008-0000-0000-0000-000000000005', false, 'active', 'private'),
('c0000009-0000-0000-0000-000000000005', '技術者たちの集い', 'プログラマーやエンジニアの情報交換の場', 'c0000008-0000-0000-0000-000000000004', true, 'active', 'public');

-- Group_Members (Expanded)
INSERT INTO public.group_members (group_id, user_profile_id, role, status) VALUES
('c0000009-0000-0000-0000-000000000001', 'c0000008-0000-0000-0000-000000000002', 'leader', 'active'),
('c0000009-0000-0000-0000-000000000001', 'c0000008-0000-0000-0000-000000000004', 'member', 'active'),
('c0000009-0000-0000-0000-000000000002', 'c0000008-0000-0000-0000-000000000007', 'leader', 'active'),
('c0000009-0000-0000-0000-000000000002', 'c0000008-0000-0000-0000-000000000002', 'member', 'active'),
('c0000009-0000-0000-0000-000000000003', 'c0000008-0000-0000-0000-000000000008', 'leader', 'active'),
('c0000009-0000-0000-0000-000000000003', 'c0000008-0000-0000-0000-000000000002', 'member', 'active'),
('c0000009-0000-0000-0000-000000000004', 'c0000008-0000-0000-0000-000000000005', 'leader', 'active'),
('c0000009-0000-0000-0000-000000000004', 'c0000008-0000-0000-0000-000000000007', 'member', 'active'),
('c0000009-0000-0000-0000-000000000005', 'c0000008-0000-0000-0000-000000000004', 'leader', 'active'),
('c0000009-0000-0000-0000-000000000005', 'c0000008-0000-0000-0000-000000000001', 'member', 'active');

-- Alliances (Expanded)
INSERT INTO public.alliances (id, name, description, alliance_leader_group_id, status, visibility) VALUES
('c0000010-0000-0000-0000-000000000001', '80-90sロボットアニメ同盟', '80年代と90年代のロボットアニメを愛するグループの同盟', 'c0000009-0000-0000-0000-000000000001', 'active', 'public'),
('c0000010-0000-0000-0000-000000000002', 'サブカルチャー連合', 'アニメ、マンガ、ゲームなどサブカル全般を扱うグループの連合体', 'c0000009-0000-0000-0000-000000000002', 'active', 'public');

-- Alliance_Groups (Expanded)
INSERT INTO public.alliance_groups (alliance_id, group_id) VALUES
('c0000010-0000-0000-0000-000000000001', 'c0000009-0000-0000-0000-000000000001'),
('c0000010-0000-0000-0000-000000000002', 'c0000009-0000-0000-0000-000000000001'),
('c0000010-0000-0000-0000-000000000002', 'c0000009-0000-0000-0000-000000000002'),
('c0000010-0000-0000-0000-000000000002', 'c0000009-0000-0000-0000-000000000003'),
('c0000010-0000-0000-0000-000000000002', 'c0000009-0000-0000-0000-000000000004');
