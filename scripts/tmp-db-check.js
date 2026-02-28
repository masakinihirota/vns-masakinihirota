require('dotenv').config({ path: '.env.local' });
const postgres = require('postgres');

(async () => {
    const sql = postgres(process.env.DATABASE_URL, { prepare: false });
    try {
        const cols = await sql`
      select table_name, column_name, data_type
      from information_schema.columns
      where table_schema = 'public' and table_name in ('user', 'session', 'account', 'verification')
      order by table_name, ordinal_position
    `;

        const rls = await sql`
      select relname as table_name, relrowsecurity as rls_enabled, relforcerowsecurity as rls_forced
      from pg_class
      where relname in ('user', 'session', 'account', 'verification') and relkind = 'r'
      order by relname
    `;

        const policies = await sql`
      select tablename, policyname, permissive, roles, cmd
      from pg_policies
      where schemaname = 'public' and tablename in ('user', 'session', 'account', 'verification')
      order by tablename, policyname
    `;

        console.log('auth columns:', cols);
        console.log('rls status:', rls);
        console.log('policies:', policies);
    } catch (error) {
        console.error(error);
        process.exitCode = 1;
    } finally {
        await sql.end();
    }
})();
