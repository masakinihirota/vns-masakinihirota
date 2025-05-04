create policy "All root_account are public"
on root_account for select
using (true);
