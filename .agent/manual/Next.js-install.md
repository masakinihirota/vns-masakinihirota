


npx drizzle-kit push



----------------------------------------
----------------------------------------

Next.js 16
Drizzle
Docker Postgre local版
Better Auth

/.env
lib/auth.ts

----------------------------------------

# Next.js 16 インストール

pnpm dlx create-next-app@latest . --yes

秘密鍵の作成
https://www.better-auth.com/docs/installation
で作成ボタンが有る

.env 作成

```.env
BETTER_AUTH_SECRET=*32文字以上のランダム文字列* # Better Auth 署名鍵（必須）
BETTER_AUTH_URL=http://localhost:3000 # Base URL of your app

DATABASE_URL=

```


DockerでPostgresの作成
docker-compose.yml

docker compose up -d で DB を起動
Drizzle のマイグレーションを pnpm db:generate → pnpm db:migrate で適用


## Better Auth インストール

インストール | Better Auth
https://www.better-auth.com/docs/installation

```terminal
pnpm add better-auth

```

## auth.ts の作成

src\lib\auth.ts

Drizzleを使用

```auth.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db"; // your drizzle instance

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
});

```



## Better Auth CLI

CLI | Better Auth
https://www.better-auth.com/docs/concepts/cli

```terminal
Better Auth に必要なスキーマを生成するには、次のコマンドを実行します。
pnpm dlx @better-auth/cli@latest generate

移行を生成して適用するには、次のコマンドを実行します。
pnpm dlx drizzle-kit generate # generate the migration file

```

生成: このコマンドは、ORM スキーマまたは SQL 移行ファイルを生成します。

### Drizzle

https://www.better-auth.com/docs/adapters/drizzle


#### Drizzle ORMのインストール

始める前に、Drizzleがインストールされ、設定されていることを確認してください。

Drizzle ORM - Why Drizzle?
https://orm.drizzle.team/docs/overview

📦 <project root>
 ├ 📂 drizzle
 ├ 📂 src
 │   ├ 📂 db
 │   │  └ 📜 schema.ts
 │   └ 📜 index.ts
 ├ 📜 .env
 ├ 📜 drizzle.config.ts
 ├ 📜 package.json
 └ 📜 tsconfig.json



パッケージをインストールする

```terminla
pnpm add drizzle-orm pg dotenv
pnpm add -D drizzle-kit tsx @types/pg

```



DBに接続の基本形

```??? (base)
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
const db = drizzle(process.env.DATABASE_URL!);

const result = await db.execute('select 1');

```

テーブルの作成

src/db

src/db/schema.ts

```サンプル
import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});

```

drizzle.config.ts

```drizzle.config.ts
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});

```

### ⚠️ このリポジトリ固有の重要ルール（Authスキーマ同期）

- `auth.ts` が参照する Better Auth スキーマ（`src/db/schema.ts`）と、
  `drizzle.config.ts` が参照するスキーマ（現行: `src/lib/db/schema.postgres.ts`）で、
  **auth4テーブル（`user` / `session` / `account` / `verification`）の列名を必ず一致**させること。
- 特に列命名（`snake_case` / `camelCase`）が不一致だと、
  `POST /api/auth/sign-in/social` で 500 (`column ... does not exist`) を引き起こします。
- 変更時は、`information_schema.columns` を使って本番DBの実カラム名を検証してからデプロイすること。

適用する

```terminl
直接適用(マイグレーション作成せず)
npx drizzle-kit push

マイグレーションの作成
npx drizzle-kit generate

マイグレーションの適用
npx drizzle-kit migrate

```

データベースのシードとクエリ

```src/index.ts
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { usersTable } from './db/schema';

const db = drizzle(process.env.DATABASE_URL!);

async function main() {
  const user: typeof usersTable.$inferInsert = {
    name: 'John',
    age: 30,
    email: 'john@example.com',
  };

  await db.insert(usersTable).values(user);
  console.log('New user created!')

  const users = await db.select().from(usersTable);
  console.log('Getting all users from the database: ', users)
  /*
  const users: {
    id: number;
    name: string;
    age: number;
    email: string;
  }[]
  */

  await db
    .update(usersTable)
    .set({
      age: 31,
    })
    .where(eq(usersTable.email, user.email));
  console.log('User info updated!')

  await db.delete(usersTable).where(eq(usersTable.email, user.email));
  console.log('User deleted!')
}

main();

```



#### テーブル名の変更

Drizzleアダプタは、定義したスキーマがテーブル名と一致することを前提としています。例えば、Drizzleスキーマがuserテーブルを にマッピングしている場合users、スキーマを手動で渡して user テーブルにマッピングする必要があります。

上記の例のように提供されたスキーマ値を変更するか、認証設定のmodelNameプロパティを直接変更することができます。



#### フィールド名の変更

Drizzleスキーマに渡されたプロパティに基づいてフィールド名をマッピングします。例えば、フィールドemailを に変更したい場合はemail_address、Drizzleスキーマを次のように変更するだけです。

上記の例のようにDrizzleスキーマを変更するか、認証設定のfieldsプロパティを直接変更することもできます。例えば：



#### 複数のテーブル名の使用
すべてのテーブルで複数形を使用している場合は、usePluralオプションを渡すだけです。

```テーブル名が複数形のオプション
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    ...
    usePlural: true,
  }),
});

```



----------------------------------------

#


## AI

https://www.better-auth.com/llms.txt






##





##





----------------------------------------

# NeonDB

Connect your app to Neon with a single command
! npx neonctl@latest --force-auth init --agent copilot



# keep Neon credentials secure: do not expose them to client-side code

DATABASE_URL='postgresql://neondb_owner:npg_Nqr2lFXLva3m@ep-spring-resonance-a1kmgeez-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'



##





##





----------------------------------------

#

## 📋 Vercel 環境変数セットアップガイド

Vercel Dashboard（https://vercel.com/dashboard）で以下の手順を実行してください：

1. **プロジェクト選択**: `vns-masakinihirota`
2. **Settings → Environment Variables** を開く
3. **本番環境（Production）に以下を追加**:

| キー | 値 | 説明 |
|------|-----|------|
| `BETTER_AUTH_SECRET` | *32文字以上のランダム文字列* | Better Auth 署名鍵（必須） |
| `BETTER_AUTH_URL` | `https://vns-masakinihirota.vercel.app` | Better Auth ベース URL |
| `NEXT_PUBLIC_APP_URL` | `https://vns-masakinihirota.vercel.app` | フロントエンド URL |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | `https://vns-masakinihirota.vercel.app` | 公開 Better Auth URL |
| `DATABASE_URL` | *.env.production の値* | Neon PostgreSQL 接続文字列 |
| `GOOGLE_CLIENT_ID` | *Google Console の値* | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | *Google Console の値* | Google OAuth Client Secret |
| `GITHUB_CLIENT_ID` | *GitHub App の値* | GitHub OAuth Client ID |
| `GITHUB_CLIENT_SECRET` | *GitHub App の値* | GitHub OAuth Client Secret |

4. **Save** をクリック
5. **Deployments → Latest → Redeploy** をクリック（または自動再デプロイを待つ）
6. ステータスが **Ready** になったら、本番環境テストを実行

環境変数をセットアップしたら、ここで報告してください。その後、Vercel 本番環境でのテストを実行します！🚀

Made changes.



##





##





----------------------------------------

#





##





##





----------------------------------------

#





##





##





----------------------------------------

#





##





##





----------------------------------------

#





##





##





----------------------------------------

#





##





##





----------------------------------------

#





##





##





----------------------------------------
----------------------------------------


