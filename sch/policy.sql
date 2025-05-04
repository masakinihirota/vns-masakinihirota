create policy "All root_account are public"
on root_account for select
using (true);

-- 指定したテーブル（例: your_table_name）のRLSを有効にします。
-- ALTER TABLE your_table_name ENABLE ROW LEVEL SECURITY;

-- 指定したテーブル（例: your_table_name）のRLSを無効にします。
-- ALTER TABLE your_table_name DISABLE ROW LEVEL SECURITY;
