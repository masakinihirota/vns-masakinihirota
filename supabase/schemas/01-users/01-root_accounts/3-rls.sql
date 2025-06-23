-- Row Level Security（RLS）有効化
-- ALTER TABLE public.root_accounts ENABLE ROW LEVEL SECURITY;

-- -- 自分自身のデータだけを取得できるRLSポリシー
-- CREATE POLICY "Users can select only their own root_accounts row" ON public.root_accounts
--   FOR SELECT
--   USING (auth.uid() = id);

-- -- 自分自身のデータだけを更新できるRLSポリシー
-- CREATE POLICY "Users can update only their own root_accounts row" ON public.root_accounts
--   FOR UPDATE
--   USING (auth.uid() = id);

-- -- 自分自身のデータだけを削除できるRLSポリシー
-- CREATE POLICY "Users can delete only their own root_accounts row" ON public.root_accounts
--   FOR DELETE
--   USING (auth.uid() = id);

-- -- 自分自身のデータだけを挿入できるRLSポリシー（必要に応じて）
-- CREATE POLICY "Users can insert only their own root_accounts row" ON public.root_accounts
--   FOR INSERT
--   WITH CHECK (auth.uid() = id);



-- ALL
-- -- Row Level Security（RLS）有効化
-- ALTER TABLE public.root_accounts ENABLE ROW LEVEL SECURITY;

-- -- 自分自身のデータだけアクセス可能なRLSポリシー
-- CREATE POLICY "Users can select only their own root_accounts row"
-- ON public.root_accounts
-- FOR ALL
-- USING (auth.uid() = id);

