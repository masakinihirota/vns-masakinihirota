-- Relational Data
-- Relationships
INSERT INTO public.relationships (source_user_profile_id, target_user_profile_id, relationship_type) VALUES
('c0000008-0000-0000-0000-000000000002', 'c0000008-0000-0000-0000-000000000007', 'following');

-- Penalties
INSERT INTO public.penalties (id, target_root_account_id, penalty_type, reason, warning_count) VALUES
(extensions.uuid_generate_v4(), 'c0000007-0000-0000-0000-000000000003', 'warning', '不適切な発言', 1);

-- MandalaSheets (Expanded & Progression-style)
INSERT INTO public.mandala_sheets (id, user_profile_id, title, description) VALUES
('c0000011-0000-0000-0000-000000000001', 'c0000008-0000-0000-0000-000000000004', 'TypeScript習熟ロードマップ', 'John_DevのTypeScript学習計画'),
('c0000011-0000-0000-0000-000000000002', 'c0000008-0000-0000-0000-000000000001', 'マネジメント能力向上', 'Taro_Workのキャリアプラン'),
('c0000011-0000-0000-0000-000000000003', 'c0000008-0000-0000-0000-000000000007', '背景イラスト上達', 'Hanako_Animeの練習計画'),
('c0000011-0000-0000-0000-000000000004', 'c0000008-0000-0000-0000-000000000008', '新作ストーリー構成', 'Mike_Mangaのプロット作成シート'),
('c0000011-0000-0000-0000-000000000005', 'c0000008-0000-0000-0000-000000000002', '動画編集スキル習得', 'Taro_Hobbyの新しい趣味計画');

-- MandalaSheet_Cells (Expanded & Progression-style)
-- Sheet 1: John_Dev TypeScript習熟ロードマップ
INSERT INTO public.mandala_sheet_cells (id, mandala_sheet_id, row_index, column_index, content_type, content_skill_id, content_text) VALUES
(extensions.uuid_generate_v4(), 'c0000011-0000-0000-0000-000000000001', 1, 1, 'skill', 'c0000003-0000-0000-0000-000000000008', NULL), -- Center: TypeScript
(extensions.uuid_generate_v4(), 'c0000011-0000-0000-0000-000000000001', 2, 1, 'text', NULL, 'Step1: 環境構築 (tsc, tsconfig)'),
(extensions.uuid_generate_v4(), 'c0000011-0000-0000-0000-000000000001', 1, 0, 'text', NULL, 'Step2: 基本的な型 (string, number)'),
(extensions.uuid_generate_v4(), 'c0000011-0000-0000-0000-000000000001', 0, 1, 'text', NULL, 'Step3: 複雑な型 (array, union)'),
(extensions.uuid_generate_v4(), 'c0000011-0000-0000-0000-000000000001', 1, 2, 'text', NULL, 'Step4: 関数と型'),
(extensions.uuid_generate_v4(), 'c0000011-0000-0000-0000-000000000001', 2, 0, 'text', NULL, 'Step5: クラスとインターフェース'),
(extensions.uuid_generate_v4(), 'c0000011-0000-0000-0000-000000000001', 0, 0, 'text', NULL, 'Step6: ジェネリクス'),
(extensions.uuid_generate_v4(), 'c0000011-0000-0000-0000-000000000001', 0, 2, 'text', NULL, 'Step7: 非同期処理と型'),
(extensions.uuid_generate_v4(), 'c0000011-0000-0000-0000-000000000001', 2, 2, 'text', NULL, 'Step8: Reactプロジェクトへ導入');

-- Sheet 2: Taro_Work マネジメント能力向上
INSERT INTO public.mandala_sheet_cells (id, mandala_sheet_id, row_index, column_index, content_type, content_skill_id, content_text) VALUES
(extensions.uuid_generate_v4(), 'c0000011-0000-0000-0000-000000000002', 1, 1, 'skill', 'c0000003-0000-0000-0000-000000000004', NULL), -- Center: プロジェクト管理
(extensions.uuid_generate_v4(), 'c0000011-0000-0000-0000-000000000002', 0, 1, 'text', NULL, 'リーダーシップ論を学ぶ'),
(extensions.uuid_generate_v4(), 'c0000011-0000-0000-0000-000000000002', 1, 0, 'text', NULL, 'WBSの作成'),
(extensions.uuid_generate_v4(), 'c0000011-0000-0000-0000-000000000002', 1, 2, 'text', NULL, '予実管理'),
(extensions.uuid_generate_v4(), 'c0000011-0000-0000-0000-000000000002', 2, 1, 'text', NULL, '1on1ミーティング実践');

-- Sheet 3: Hanako_Anime 背景イラスト上達
INSERT INTO public.mandala_sheet_cells (id, mandala_sheet_id, row_index, column_index, content_type, content_skill_id, content_text) VALUES
(extensions.uuid_generate_v4(), 'c0000011-0000-0000-0000-000000000003', 1, 1, 'skill', 'c0000003-0000-0000-0000-000000000002', NULL), -- Center: イラスト制作
(extensions.uuid_generate_v4(), 'c0000011-0000-0000-0000-000000000003', 0, 1, 'text', NULL, '一点透視図法の練習'),
(extensions.uuid_generate_v4(), 'c0000011-0000-0000-0000-000000000003', 1, 0, 'text', NULL, '補色・対比色を学ぶ'),
(extensions.uuid_generate_v4(), 'c0000011-0000-0000-0000-000000000003', 1, 2, 'text', NULL, '三分割法の構図'),
(extensions.uuid_generate_v4(), 'c0000011-0000-0000-0000-000000000003', 2, 1, 'text', NULL, '雲・木・水の質感表現');

-- Sheet 4: Mike_Manga 新作ストーリー構成
INSERT INTO public.mandala_sheet_cells (id, mandala_sheet_id, row_index, column_index, content_type, content_skill_id, content_text) VALUES
(extensions.uuid_generate_v4(), 'c0000011-0000-0000-0000-000000000004', 1, 1, 'skill', 'c0000003-0000-0000-0000-000000000005', NULL), -- Center: シナリオライティング
(extensions.uuid_generate_v4(), 'c0000011-0000-0000-0000-000000000004', 0, 1, 'text', NULL, '魅力的な主人公の作り方'),
(extensions.uuid_generate_v4(), 'c0000011-0000-0000-0000-000000000004', 1, 0, 'text', NULL, '舞台設定の深掘り'),
(extensions.uuid_generate_v4(), 'c0000011-0000-0000-0000-000000000004', 1, 2, 'text', NULL, '起承転結のプロット作成'),
(extensions.uuid_generate_v4(), 'c0000011-0000-0000-0000-000000000004', 2, 1, 'text', NULL, '読者を引き込むセリフ術');

-- Sheet 5: Taro_Hobby 動画編集スキル習得
INSERT INTO public.mandala_sheet_cells (id, mandala_sheet_id, row_index, column_index, content_type, content_skill_id, content_text) VALUES
(extensions.uuid_generate_v4(), 'c0000011-0000-0000-0000-000000000005', 1, 1, 'skill', 'c0000003-0000-0000-0000-000000000003', NULL), -- Center: 動画編集
(extensions.uuid_generate_v4(), 'c0000011-0000-0000-0000-000000000005', 0, 1, 'text', NULL, 'ジャンプカットの練習'),
(extensions.uuid_generate_v4(), 'c0000011-0000-0000-0000-000000000005', 1, 0, 'text', NULL, 'キーフレームアニメーション'),
(extensions.uuid_generate_v4(), 'c0000011-0000-0000-0000-000000000005', 1, 2, 'text', NULL, 'フリー音源サイトの活用'),
(extensions.uuid_generate_v4(), 'c0000011-0000-0000-0000-000000000005', 2, 1, 'text', NULL, 'LUTを使った色調補正');
