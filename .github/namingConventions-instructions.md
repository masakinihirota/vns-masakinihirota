---
applyTo: "**"
---

# 命名規則指示書（Naming Conventions）

## 1. 基本方針
- すべての名前は「役割や目的が明確に分かる」具体的で説明的な名前にしてください。
- 英語（小文字）を基本とし、略語や省略形は避けます。
- 一貫性を重視し、同じ種類のものは同じルールで命名します。

---

## 2. 命名規則一覧

### 2.1. ディレクトリ・ファイル名
- **ケバブケース（kebab-case）**
 例: `user-profile`, `main-header`, `login-form.tsx`
root-accounts

### 2.2. コンポーネント名・型・インターフェース
- **パスカルケース（PascalCase）**
 例: `UserProfile`, `MainHeader`, `LoginForm`, `UserProfileProps`

### 2.3. 変数名・関数名・メソッド名
- **キャメルケース（camelCase）**
 例: `userProfile`, `fetchUserData`, `handleLogin`

### 2.4. 定数
- **全て大文字+アンダースコア（ALL_CAPS）**
 例: `MAX_USER_COUNT`, `DEFAULT_TIMEOUT`

### 2.5. 状態を表す変数
- **補助動詞＋説明的な名前**
 例: `isLoading`, `hasError`, `isAuthenticated`

### 2.6. データベース（Supabase）テーブル・カラム名
- **スネークケース（snake_case）・複数形**
 例: `user_profiles`, `root_accounts`, `created_at`

## 2.7. Drizzle ORMのテーブル・カラム名

### 使用ルール

スネークケース すべて小文字で単語をアンダースコア（`_`）で区切ります。

キャメルケース 先頭の文字は必ず小文字で、以降の単語の先頭は大文字です。

### 命名規則

- **テーブル名**: コード上（Drizzle ORM）ではキャメルケース、Supabase上ではスネークケース・複数形を使います。
  例: コード上は `userProfiles`、Supabaseでは `user_profiles`

Drizzle ORMでは、
コードのテーブル名はキャメルケースを使います。。

- **カラム名**: コード上（Drizzle ORM）ではキャメルケース（camelCase）、Supabase上ではスネークケース（snake_case）を使います。
  例: コード上は `firstName`、Supabaseでは `first_name`



```drizzle命名規則サンプル
import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { categories } from "./categories";

/**
 * ジャンルテーブル
 * カテゴリの詳細分類を管理
 */
export const genres = pgTable("genres", {
  id: uuid("id").primaryKey().defaultRandom(),
  categoryId: uuid("category_id")
    .references(() => categories.id)
    .notNull(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

```


---

## 4. その他のルール
- プライベートなクラスメンバーにはアンダースコア（`_`）をプレフィックス（例: `_privateValue`）
  ※ただしクラスの使用は原則避け、関数型を優先します。
- 略語や意味不明な短縮形は使わず、誰が見ても分かる名前にします。
- 型やPropsには`Props`や`Type`などのサフィックスを付けます（例: `UserProfileProps`）。

未使用のファイル、使用予定ファイルなどはアンダースコア（`_`）をプレフィックス（例: `_UserProfile`）を付けます。


