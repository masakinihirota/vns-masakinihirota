-- Row Level Security（RLS）有効化
-- ALTER TABLE public.root_account ENABLE ROW LEVEL SECURITY;

-- 自分自身のデータだけを取得できるRLSポリシー
CREATE POLICY "Users can select only their own root_account row" ON public.root_account
  FOR SELECT
  USING (auth.uid() = id);

-- 自分自身のデータだけを更新できるRLSポリシー
CREATE POLICY "Users can update only their own root_account row" ON public.root_account
  FOR UPDATE
  USING (auth.uid() = id);

-- 自分自身のデータだけを削除できるRLSポリシー
CREATE POLICY "Users can delete only their own root_account row" ON public.root_account
  FOR DELETE
  USING (auth.uid() = id);

-- 自分自身のデータだけを挿入できるRLSポリシー（必要に応じて）
CREATE POLICY "Users can insert only their own root_account row" ON public.root_account
  FOR INSERT
  WITH CHECK (auth.uid() = id);



-- ALL
-- -- Row Level Security（RLS）有効化
-- ALTER TABLE public.root_account ENABLE ROW LEVEL SECURITY;

-- -- 自分自身のデータだけアクセス可能なRLSポリシー
-- CREATE POLICY "Users can select only their own root_account row"
-- ON public.root_account
-- FOR ALL
-- USING (auth.uid() = id);

