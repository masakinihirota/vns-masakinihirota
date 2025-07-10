-- スキーマの追加用、-- 既存のデータベースに新しいテーブルやカラムを追加するためのSQLスクリプト。
-- 多言語対応: ユーザーの選択した言語に応じて、UIに表示されるテキストを切り替える。
-- データの国際化: データベース内の情報を複数の言語で管理し、グローバルなユーザーに対応する。

-- 英語 (en): Animation
-- 日本語 (ja): アニメーション
-- 中国語 (zh): 动画
-- スペイン語 (es): Animación

-- Translations
INSERT INTO public."translations" (id, table_name, column_name, row_id, language_code, translation_text) VALUES
(extensions.uuid_generate_v4(), 'Categories', 'name', 'c0000001-0000-0000-0000-000000000001', 'en', 'Animation'),
(extensions.uuid_generate_v4(), 'Categories', 'name', 'c0000001-0000-0000-0000-000000000001', 'ja', 'アニメーション'),
(extensions.uuid_generate_v4(), 'Categories', 'name', 'c0000001-0000-0000-0000-000000000001', 'zh', '动画'),
(extensions.uuid_generate_v4(), 'Categories', 'name', 'c0000001-0000-0000-0000-000000000001', 'es', 'Animación');

