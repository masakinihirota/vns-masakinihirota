-- userはPostgreSQLの予約名なのでテーブル名に使用する場合は「""」で囲む必要があります。
create policy "All user are public"
on "user" for select
using (true);
