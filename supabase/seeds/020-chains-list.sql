
-- chain_nodes
INSERT INTO chain_nodes (id, chain_id, work_id, parent_node_id, depth, display_order, relation_label, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'c0000004-0000-0000-0000-000000000001', NULL, 1, 1, 'Root Node', NOW(), NOW()),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'c0000004-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 2, 2, 'Child Node A', NOW(), NOW()),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'c0000004-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 2, 3, 'Child Node B', NOW(), NOW());

-- chains
INSERT INTO chains (id, title, description, creator_type, user_profile_id, is_public, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000000001', '仕事チェーン', '仕事に関連する作品を繋げたチェーン', 'admin', 'c0000008-0000-0000-0000-000000000001', true, NOW(), NOW()),
('00000000-0000-0000-0000-000000000002', '趣味チェーン', '趣味に関連する作品を繋げたチェーン', 'user', 'c0000008-0000-0000-0000-000000000002', false, NOW(), NOW()),
('00000000-0000-0000-0000-000000000003', '開発チェーン', '開発に関連する作品を繋げたチェーン', 'user', 'c0000008-0000-0000-0000-000000000003', true, NOW(), NOW()),
('00000000-0000-0000-0000-000000000004', 'ゲームチェーン', 'ゲームに関連する作品を繋げたチェーン', 'user', 'c0000008-0000-0000-0000-000000000004', false, NOW(), NOW()),
('00000000-0000-0000-0000-000000000005', 'その他チェーン', 'その他のテーマに関連する作品を繋げたチェーン', 'user', 'c0000008-0000-0000-0000-000000000005', true, NOW(), NOW()),
('00000000-0000-0000-0000-000000000006', 'アニメチェーン', 'アニメに関連する作品を繋げたチェーン', 'user', 'c0000008-0000-0000-0000-000000000006', true, NOW(), NOW()),
('00000000-0000-0000-0000-000000000007', 'マンガチェーン', 'マンガに関連する作品を繋げたチェーン', 'user', 'c0000008-0000-0000-0000-000000000007', false, NOW(), NOW()),
('00000000-0000-0000-0000-000000000008', '新規チェーン', '新規テーマに関連する作品を繋げたチェーン', 'user', 'c0000008-0000-0000-0000-000000000008', true, NOW(), NOW());

-- deleted_works_log
INSERT INTO deleted_works_log (id, deleted_at, deleted_by, data) VALUES
('00000000-0000-0000-0000-000000000001', NOW(), '11111111-1111-1111-1111-111111111111', 'Duplicate entry for work ID 22222222'),
('00000000-0000-0000-0000-000000000002', NOW(), '22222222-2222-2222-2222-222222222222', 'Outdated content for work ID 33333333'),
('00000000-0000-0000-0000-000000000003', NOW(), '33333333-3333-3333-3333-333333333333', 'User request for work ID 44444444');

-- lists
INSERT INTO lists (id, title, description, creator_type, user_profile_id, is_public, list_type, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000000001', '2025冬アニメ', '2025年冬に放送されるアニメのリスト', 'admin', 'c0000008-0000-0000-0000-000000000001', true, 'custom', NOW(), NOW()),
('00000000-0000-0000-0000-000000000002', 'SFアニメ', 'SFジャンルのアニメをまとめた公式リスト', 'admin', 'c0000008-0000-0000-0000-000000000001', true, 'custom', NOW(), NOW()),
('00000000-0000-0000-0000-000000000003', 'ロボットアニメ', 'ロボットが登場するアニメの公式リスト', 'admin', 'c0000008-0000-0000-0000-000000000001', true, 'custom', NOW(), NOW()),
('00000000-0000-0000-0000-000000000004', '旅作品', '旅をテーマにした作品を集めたリスト', 'user', 'c0000008-0000-0000-0000-000000000002', false, 'custom', NOW(), NOW()),
('00000000-0000-0000-0000-000000000005', '感動作品', '感動的なストーリーを持つ作品のリスト', 'user', 'c0000008-0000-0000-0000-000000000002', true, 'favorite', NOW(), NOW()),
('00000000-0000-0000-0000-000000000006', '深いシナリオ', '深いシナリオを持つ作品を集めたリスト', 'user', 'c0000008-0000-0000-0000-000000000003', false, 'watchlist', NOW(), NOW()),
('00000000-0000-0000-0000-000000000007', 'サッカー作品', 'サッカーをテーマにした作品のリスト', 'user', 'c0000008-0000-0000-0000-000000000004', true, 'completed', NOW(), NOW()),
('00000000-0000-0000-0000-000000000008', '推し活リスト', '推しを応援するための作品リスト', 'user', 'c0000008-0000-0000-0000-000000000005', false, 'custom', NOW(), NOW()),
('00000000-0000-0000-0000-000000000009', 'React学習リスト', 'React学習に役立つリソースをまとめたリスト', 'user', 'c0000008-0000-0000-0000-000000000006', false, 'custom', NOW(), NOW());

-- notifications
INSERT INTO notifications (id, recipient_user_profile_id, notification_type, content, is_read, link_url, read_at, created_at) VALUES
('00000000-0000-0000-0000-000000000001', 'c0000008-0000-0000-0000-000000000001', 'welcome', 'Welcome to the platform!', false, NULL, NULL, NOW()),
('00000000-0000-0000-0000-000000000002', 'c0000008-0000-0000-0000-000000000002', 'update', 'Your profile has been updated.', false, NULL, NULL, NOW()),
('00000000-0000-0000-0000-000000000003', 'c0000008-0000-0000-0000-000000000003', 'feature', 'New features added!', false, NULL, NULL, NOW());


-- point_transactions
INSERT INTO point_transactions (id, root_account_id, user_profile_id, transaction_type, points_amount, description, transaction_date) VALUES
('00000000-0000-0000-0000-000000000001', 'c0000007-0000-0000-0000-000000000001', 'c0000008-0000-0000-0000-000000000001', 'credit', 100, 'Initial bonus points', NOW()),
('00000000-0000-0000-0000-000000000002', 'c0000007-0000-0000-0000-000000000002', 'c0000008-0000-0000-0000-000000000002', 'debit', -50, 'Purchase of premium content', NOW()),
('00000000-0000-0000-0000-000000000003', 'c0000007-0000-0000-0000-000000000003', 'c0000008-0000-0000-0000-000000000003', 'credit', 200, 'Referral bonus', NOW());


-- skill_progress_history
INSERT INTO skill_progress_history (id, user_profile_id, skill_id, level, updated_at, previous_level) VALUES
('00000000-0000-0000-0000-000000000001', 'c0000008-0000-0000-0000-000000000001', 'c0000003-0000-0000-0000-000000000001', 3, NOW(), 2),
('00000000-0000-0000-0000-000000000002', 'c0000008-0000-0000-0000-000000000002', 'c0000003-0000-0000-0000-000000000002', 1, NOW(), NULL),
('00000000-0000-0000-0000-000000000003', 'c0000008-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000003', 5, NOW(), 4);

-- value_selection_history
INSERT INTO value_selection_history (id, user_profile_id, value_id, selected_option, selected_at, previous_option) VALUES
('00000000-0000-0000-0000-000000000001', 'c0000008-0000-0000-0000-000000000001', 'c0000005-0000-0000-0000-000000000001', 'Option A', NOW(), NULL),
('00000000-0000-0000-0000-000000000002', 'c0000008-0000-0000-0000-000000000002', 'c0000005-0000-0000-0000-000000000001', 'Option B', NOW(), 'Option A'),
('00000000-0000-0000-0000-000000000003', 'c0000008-0000-0000-0000-000000000003', 'c0000005-0000-0000-0000-000000000001', 'Option C', NOW(), 'Option B');

-- value_theme_tags
INSERT INTO value_theme_tags (value_theme_id, tag_id, created_at) VALUES
('c0000005-0000-0000-0000-000000000001', 'c0000013-0000-0000-0000-000000000001', NOW()),
('c0000005-0000-0000-0000-000000000001', 'c0000013-0000-0000-0000-000000000002', NOW()),
('c0000005-0000-0000-0000-000000000001', 'c0000013-0000-0000-0000-000000000003', NOW());

-- work_authors
INSERT INTO work_authors (id, work_id, author_name, role, display_order, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000000001', 'c0000004-0000-0000-0000-000000000001', 'Author A', 'Writer', 1, NOW(), NOW()),
('00000000-0000-0000-0000-000000000002', 'c0000004-0000-0000-0000-000000000001', 'Author B', 'Editor', 2, NOW(), NOW()),
('00000000-0000-0000-0000-000000000003', 'c0000004-0000-0000-0000-000000000001', 'Author C', 'Illustrator', 3, NOW(), NOW());

-- work_evaluation_history
INSERT INTO work_evaluation_history (id, user_profile_id, work_id, tier, evaluated_at, previous_tier) VALUES
('00000000-0000-0000-0000-000000000001', 'c0000008-0000-0000-0000-000000000001', 'c0000004-0000-0000-0000-000000000001', 5, NOW(), 4),
('00000000-0000-0000-0000-000000000002', 'c0000008-0000-0000-0000-000000000001', 'c0000004-0000-0000-0000-000000000001', 3, NOW(), NULL),
('00000000-0000-0000-0000-000000000003', 'c0000008-0000-0000-0000-000000000001', 'c0000004-0000-0000-0000-000000000001', 4, NOW(), 3);

-- work_tags
-- 作品に付与されたタグを管理するシードデータ

INSERT INTO work_tags (work_id, tag_id, created_at) VALUES
('c0000004-0000-0000-0000-000000000001', 'c0000013-0000-0000-0000-000000000001', NOW()),
('c0000004-0000-0000-0000-000000000001', 'c0000013-0000-0000-0000-000000000002', NOW()),
('c0000004-0000-0000-0000-000000000002', 'c0000013-0000-0000-0000-000000000002', NOW()),
('c0000004-0000-0000-0000-000000000002', 'c0000013-0000-0000-0000-000000000003', NOW()),
('c0000004-0000-0000-0000-000000000003', 'c0000013-0000-0000-0000-000000000003', NOW()),
('c0000004-0000-0000-0000-000000000003', 'c0000013-0000-0000-0000-000000000005', NOW()),
('c0000004-0000-0000-0000-000000000005', 'c0000013-0000-0000-0000-000000000005', NOW()),
('c0000004-0000-0000-0000-000000000005', 'c0000013-0000-0000-0000-000000000007', NOW()),
('c0000004-0000-0000-0000-000000000006', 'c0000013-0000-0000-0000-000000000001', NOW()),
('c0000004-0000-0000-0000-000000000006', 'c0000013-0000-0000-0000-000000000006', NOW());
