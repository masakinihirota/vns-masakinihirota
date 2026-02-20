const postgres = require("postgres");

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@127.0.0.1:64322/postgres";

const sql = postgres(connectionString, { prepare: false });

async function checkAndFixRootAccounts() {
  try {
    console.log("Checking root_accounts table structure...");

    // カラム情報の取得
    const columns = await sql.unsafe(`
      SELECT column_name, data_type, udt_name
      FROM information_schema.columns
      WHERE table_name = 'root_accounts' AND column_name = 'auth_user_id';
    `);

    if (columns.length > 0) {
      console.log("Current auth_user_id type:", columns[0].data_type, columns[0].udt_name);

      if (columns[0].data_type === 'uuid') {
        console.log("Type mismatch detected! Converting auth_user_id from UUID to TEXT...");

        // 外部キー制約の確認と削除
        const fkeys = await sql.unsafe(`
          SELECT conname
          FROM pg_constraint
          WHERE conrelid = 'root_accounts'::regclass AND confrelid = 'auth.users'::regclass;
        `);

        for (const fk of fkeys) {
          console.log(`Dropping FK: ${fk.conname}`);
          await sql.unsafe(`ALTER TABLE root_accounts DROP CONSTRAINT "${fk.conname}"`);
        }

        // 型変換 (データが既にある場合は空にするか、変換を試みる)
        // ここでは安全のため、既存データを保持しつつ型変更を試みる (UUID -> TEXT は可能)
        console.log("Altering column type...");
        await sql.unsafe(`ALTER TABLE root_accounts ALTER COLUMN auth_user_id TYPE text`);

        // 新しい外部キー制約を追加 (public.user へ)
        console.log("Adding new FK to public.user...");
        await sql.unsafe(`
          ALTER TABLE root_accounts
          ADD CONSTRAINT root_accounts_auth_user_id_fkey
          FOREIGN KEY (auth_user_id) REFERENCES "user"(id) ON DELETE CASCADE
        `);

        console.log("Fix completed successfully.");
      } else {
        console.log("Column type is already correct (text/varchar).");

        // FKが正しいか確認
        const fkeys = await sql.unsafe(`
            SELECT
                kcu.constraint_name,
                ccu.table_schema AS foreign_table_schema,
                ccu.table_name AS foreign_table_name
            FROM
                information_schema.key_column_usage AS kcu
            JOIN
                information_schema.referential_constraints AS rc
                ON kcu.constraint_name = rc.constraint_name
            JOIN
                information_schema.constraint_column_usage AS ccu
                ON rc.unique_constraint_name = ccu.constraint_name
            WHERE
                kcu.table_name = 'root_accounts' AND kcu.column_name = 'auth_user_id';
        `);

        console.log("Current FKs:", fkeys);

        // もしFKが auth.users を向いていたら修正
        const badFk = fkeys.find(fk => fk.foreign_table_schema === 'auth' && fk.foreign_table_name === 'users');
        if (badFk) {
          console.log(`Bad FK detected: ${badFk.constraint_name} -> auth.users. Fixing...`);
          await sql.unsafe(`ALTER TABLE root_accounts DROP CONSTRAINT "${badFk.constraint_name}"`);
          await sql.unsafe(`
                ALTER TABLE root_accounts
                ADD CONSTRAINT root_accounts_auth_user_id_fkey
                FOREIGN KEY (auth_user_id) REFERENCES "user"(id) ON DELETE CASCADE
            `);
          console.log("FK fixed.");
        }
      }
    } else {
      console.log("root_accounts or auth_user_id not found.");
    }

  } catch (e) {
    console.error("Error:", e.message);
  } finally {
    await sql.end();
  }
}

checkAndFixRootAccounts();
