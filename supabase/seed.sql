-- テスト用のルートアカウントを1件作成（存在しない場合のみ）
-- UUIDは固定で、この後のプロフィール作成で参照します
INSERT INTO public.root_accounts (id) VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11')
ON CONFLICT (id) DO NOTHING;

-- 上記ルートアカウントに紐づくユーザープロフィールを3件作成
-- ON CONFLICT (id) DO NOTHING を使い、再実行してもエラーにならないようにします
INSERT INTO public.user_profiles (id, root_account_id, title, type, description, is_active, is_public, badge_color) VALUES
('c1f7b8f0-3b7a-4c1e-8e0a-8a9a8b9c0d1e', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '田中太郎（ビジネス）', '仕事用', 'DBから投入されたデータ', true, true, 'blue'),
('d2e8c9a1-4c8b-5d2f-9f1b-9b0b9c0d1f2a', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'T.Tanaka（学習者）', '学習用', 'DBから投入されたデータ', true, true, 'purple'),
('e3f9d0a2-5d9c-6e3a-0a2c-0c1c0d1f2a3a', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'たなか（アニメ好き）', '遊び用', 'DBから投入されたデータ', false, false, 'green')
ON CONFLICT (id) DO NOTHING;
