--ユーザープロフィール

-- UserProfile_FavoriteWorks (既存データを拡張)
INSERT INTO public.user_profile_favorite_works (user_profile_id, work_id, category, tier_rating, my_evaluation, personal_note, evaluation_tier, time_segment) VALUES
('c0000008-0000-0000-0000-000000000002', 'c0000004-0000-0000-0000-000000000001', '人生', 'Tier1', 5, '人生で最も影響を受けた作品の一つ', 'S', 'life'),
('c0000008-0000-0000-0000-000000000007', 'c0000004-0000-0000-0000-000000000005', '今', 'Tier2', 4, '現在進行形で楽しんでいる', 'A', 'recent'),
('c0000008-0000-0000-0000-000000000001', 'c0000004-0000-0000-0000-000000000003', '今', 'Tier1', 5, 'エヴァは永遠の名作', NULL, NULL),
('c0000008-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000002', '人生', 'Tier2', 4, '少年時代の思い出', NULL, NULL),
('c0000008-0000-0000-0000-000000000003', 'c0000004-0000-0000-0000-000000000006', '未来', 'Tier3', 3, '今度見てみたい作品', NULL, NULL);

-- UserProfile_SelectedValues（テーブル名を正しく修正）
INSERT INTO public.user_profile_values (user_profile_id, value_question_id, selected_choice_id, value_category, evaluator_profile_id) VALUES
('c0000008-0000-0000-0000-000000000001', 'c0000005-0000-0000-0000-000000000001', 'c0000006-0000-0000-0000-000000000002', '基本', NULL),
('c0000008-0000-0000-0000-000000000002', 'c0000005-0000-0000-0000-000000000002', 'c0000006-0000-0000-0000-000000000005', '基本', NULL),
('c0000008-0000-0000-0000-000000000003', 'c0000005-0000-0000-0000-000000000001', 'c0000006-0000-0000-0000-000000000002', '仕事用', NULL),
('c0000008-0000-0000-0000-000000000004', 'c0000005-0000-0000-0000-000000000002', 'c0000006-0000-0000-0000-000000000005', '趣味用', NULL),
-- 他人評価の例
('c0000008-0000-0000-0000-000000000001', 'c0000005-0000-0000-0000-000000000002', 'c0000006-0000-0000-0000-000000000005', '基本', 'c0000008-0000-0000-0000-000000000002');

-- UserProfile_Skills（既存のskill_levelカラム名をselfLevelに合わせる）
INSERT INTO public.user_profile_skills (user_profile_id, skill_id, self_level, collaboration_desire, display_type, mandala_position) VALUES
('c0000008-0000-0000-0000-000000000004', 'c0000003-0000-0000-0000-000000000008', 3, 4, 'list', NULL),
('c0000008-0000-0000-0000-000000000001', 'c0000003-0000-0000-0000-000000000004', 4, 5, 'mandala', 1),
('c0000008-0000-0000-0000-000000000002', 'c0000003-0000-0000-0000-000000000003', 2, 3, 'list', NULL),
('c0000008-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000001', 5, 4, 'mandala', 5),
('c0000008-0000-0000-0000-000000000007', 'c0000003-0000-0000-0000-000000000002', 3, 3, 'list', NULL),
('c0000008-0000-0000-0000-000000000008', 'c0000003-0000-0000-0000-000000000005', 2, 4, 'mandala', 3);

-- 新規テーブル: UserProfile_Purposes (プロフィール目的)
INSERT INTO public.user_profile_purposes (id, user_profile_id, purpose, is_primary) VALUES
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000001', '仕事', true),
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000001', 'プロジェクト管理', false),
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000002', '趣味', true),
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000002', '友活', false),
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000003', '仕事', true),
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000004', '趣味', true),
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000004', 'ゲーム', false),
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000005', 'その他', true),
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000006', '趣味', true),
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000006', '推し活', false),
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000007', '趣味', true),
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000008', '趣味', true);

-- 新規テーブル: UserProfile_SnsAccounts (SNSアカウント)
INSERT INTO public.user_profile_sns_accounts (id, user_profile_id, platform, account_url, account_name, is_verified) VALUES
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000001', 'Twitter', 'https://twitter.com/taro_work', '@taro_work', false),
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000001', 'LinkedIn', 'https://linkedin.com/in/taro-work', 'Taro Work', true),
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000002', 'Twitter', 'https://twitter.com/taro_hobby', '@taro_hobby', false),
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000002', 'YouTube', 'https://youtube.com/@taro_hobby', 'Taro Hobby Channel', false),
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000004', 'GitHub', 'https://github.com/john_dev', 'john_dev', true),
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000004', 'Twitter', 'https://twitter.com/john_dev', '@john_dev', false),
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000007', 'Pixiv', 'https://pixiv.net/users/hanako_anime', 'Hanako_Anime', false),
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000007', 'Instagram', 'https://instagram.com/hanako_anime', '@hanako_anime', false),
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000008', 'Twitter', 'https://twitter.com/mike_manga', '@mike_manga', false);

-- 新規テーブル: UserProfile_ContactMethods (連絡先)
INSERT INTO public.user_profile_contact_methods (id, user_profile_id, contact_type, contact_value, is_copied_from_root) VALUES
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000001', 'email', 'taro.work@example.com', true),
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000001', 'zoom', 'taro.work.zoom', false),
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000002', 'email', 'taro.hobby@example.com', false),
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000002', 'line', 'taro_hobby_line', false),
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000004', 'email', 'john.dev@example.com', true),
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000004', 'other', 'Discord: john_dev#1234', false),
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000007', 'email', 'hanako.anime@example.com', false),
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000008', 'email', 'mike.manga@example.com', false);

-- 新規テーブル: UserProfile_Works (自分の作品)
INSERT INTO public.user_profile_works (id, user_profile_id, work_type, title, description, url, sales_url, blog_url, youtube_url, my_position) VALUES
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000001', '自分の作品', 'プロジェクト管理ツール Ver.2', '社内で使用するプロジェクト管理システムの改良版', 'https://github.com/taro/pm-tool-v2', NULL, 'https://taro-work.blog/pm-tool-v2', NULL, 'プロジェクトマネージャー・開発者'),
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000002', '自分の作品', '趣味の動画編集集', '個人的な趣味で作成した動画作品集', 'https://youtube.com/playlist?list=hobby_videos', NULL, NULL, 'https://youtube.com/playlist?list=hobby_videos', '動画制作者'),
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000004', '自分の作品', 'TypeScript学習アプリ', 'TypeScript初心者向けの学習支援アプリ', 'https://github.com/john/ts-learning-app', 'https://ts-learning.example.com', 'https://john-dev.blog/ts-app', NULL, 'フルスタック開発者'),
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000007', '自分の作品', 'アニメ背景イラスト集', 'オリジナルアニメ風背景イラストのポートフォリオ', 'https://pixiv.net/artworks/hanako_bg', 'https://hanako-anime.booth.pm/', 'https://hanako-anime.blog/', NULL, 'イラストレーター'),
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000008', '自分の作品', 'オリジナル4コマ漫画', '日常をテーマにした4コマ漫画シリーズ', 'https://manga-site.example.com/mike', NULL, 'https://mike-manga.blog/', NULL, '漫画家'),
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000001', 'グループ作品', '社内業務効率化システム', 'チーム3人で開発した業務効率化システム', 'https://company-internal.example.com', NULL, NULL, NULL, 'プロジェクトリーダー');

-- 新規テーブル: UserProfile_SkillEvaluations (スキル評価)
INSERT INTO public.user_profile_skill_evaluations (id, evaluated_profile_id, evaluator_profile_id, skill_id, level_evaluation, collaboration_desire, evaluation_comment) VALUES
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000001', 'c0000008-0000-0000-0000-000000000004', 'c0000003-0000-0000-0000-000000000004', 5, 5, 'プロジェクト管理能力が非常に高く、チームを上手くまとめてくれます'),
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000004', 'c0000008-0000-0000-0000-000000000001', 'c0000003-0000-0000-0000-000000000008', 4, 4, 'TypeScriptの知識が豊富で、コードレビューでいつも勉強になります'),
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000007', 'c0000008-0000-0000-0000-000000000002', 'c0000003-0000-0000-0000-000000000002', 4, 3, '背景イラストのクオリティが高く、構図のセンスが素晴らしいです'),
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000002', 'c0000008-0000-0000-0000-000000000007', 'c0000003-0000-0000-0000-000000000003', 3, 4, '動画編集の基本はしっかりしているので、一緒に勉強したいです'),
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000008', 'c0000008-0000-0000-0000-000000000007', 'c0000003-0000-0000-0000-000000000005', 3, 4, 'ストーリー構成のアイデアが豊富で、キャラクター作りが上手です');

-- 新規テーブル: UserProfile_MandalaCharts (マンダラチャート)
INSERT INTO public.user_profile_mandala_charts (id, user_profile_id, chart_name, center_goal, position_1, position_2, position_3, position_4, position_5, position_6, position_7, position_8, markdown_content) VALUES
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000001', 'リーダーシップ向上計画', 'チームリーダーとしてのスキル向上', '1on1ミーティングの改善', 'メンバーのモチベーション管理', 'プロジェクト計画の精度向上', '意思決定の速度向上', 'コーチングスキル習得', 'ファシリテーション能力向上', 'フィードバック技術習得', 'チームビルディング強化', '# リーダーシップ向上計画\n\n## 中央目標\nチームリーダーとしてのスキル向上\n\n## 8つの取り組み\n1. 1on1ミーティングの改善\n2. メンバーのモチベーション管理\n...'),
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000004', 'TypeScript習熟ロードマップ', 'TypeScriptエキスパートになる', '基本的な型システム理解', '関数と型の活用', 'ジェネリクスの習得', 'ユーティリティ型の活用', 'コンディショナル型の理解', 'モジュール解決の理解', 'パフォーマンス最適化', 'プロジェクト設計への応用', '# TypeScript習熟ロードマップ\n\n## 目標\nTypeScriptエキスパートになる\n\n## 学習項目\n- 型システムの理解\n- 実践的な活用\n...'),
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000007', '背景イラスト上達計画', '商業レベルの背景イラスト制作', '一点透視図法の習得', '色彩理論の理解', '二点透視図法の習得', '構図とレイアウト', '質感表現の習得', 'ライティング技法', 'デジタルツール習熟', 'ポートフォリオ充実', '# 背景イラスト上達計画\n\n## 目標\n商業レベルの背景イラスト制作\n\n## スキル項目\n- パース理解\n- 色彩設計\n- 質感表現\n...');

-- 新規テーブル: UserProfile_Lists (リスト選択)
INSERT INTO public.user_profile_lists (id, user_profile_id, list_id, list_type) VALUES
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '公式リスト'),
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000002', '公式リスト'),
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000003', '公式リスト'),
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000004', 'ユーザーリスト'),
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000005', 'ユーザーリスト'),
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000008', 'ユーザーリスト'),
(extensions.uuid_generate_v4(), 'c0000008-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000009', 'ユーザーリスト');
