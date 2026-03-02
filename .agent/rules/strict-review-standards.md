---
trigger: always_on
---

# Strict Code Review Standards (厳格なコード審査基準)

レビュー「現在のアプリを厳しくレビューしてください」の指摘内容に基づくコーディングルールです。

## 1. Environment Variable Validation (環境変数検証)

### 1.1 OAuth 認証情報の検証

**Critical**: アプリケーション起動時に OAuth credentials をチェック。Empty String Fallback による Silent Failure を防止。

```typescript
// src/lib/auth.ts
function validateOAuthCredentials() {
  const providers = [
    { name: 'Google', idVar: 'GOOGLE_CLIENT_ID', secretVar: 'GOOGLE_CLIENT_SECRET' },
    { name: 'GitHub', idVar: 'GITHUB_CLIENT_ID', secretVar: 'GITHUB_CLIENT_SECRET' },
  ];

  const errors: string[] = [];
  for (const provider of providers) {
    const clientId = process.env[provider.idVar];
    const clientSecret = process.env[provider.secretVar];

    if (!clientId || !clientSecret) {
      errors.push(`${provider.name}: ${provider.idVar} and ${provider.secretVar} are required`);
    }
  }

  if (errors.length > 0) {
    throw new Error(
      `[AUTH] OAuth credential validation failed:\n${errors.join('\n')}\n` +
      `Please set all OAuth credentials in your .env.local or production environment.`
    );
  }
}

// 起動時に検証を実行
validateOAuthCredentials();
```

**ルール**:
- ✅ OAuth credentials は `||""` でフォールバックしない
- ✅ 検証失敗時は起動時に `throw` で例外を投げる（Silent Failure 防止）
- ✅ 検証後は Non-null Assertion `!` で型安全性を強化

### 1.2 本番環境での認証方式の強制

**Critical**: 本番環境でダミー認証が有効にならないよう強制

```typescript
// src/proxy.ts
function validateProductionAuth() {
  if (process.env.NODE_ENV === 'production' &&
      process.env.USE_REAL_AUTH !== 'true') {
    throw new Error(
      '[SECURITY] USE_REAL_AUTH must be explicitly set to "true" in production environment. ' +
      'Dummy authentication is not allowed in production.'
    );
  }
}

// 起動時に検証を実行
validateProductionAuth();
```

**ルール**:
- ✅ 本番環境では `USE_REAL_AUTH=true` を明示的に設定（デフォルト値なし）
- ✅ 完全一致 (`=== 'true'`) のみを許可
- ✅ 起動時の検証で開発用設定が本番に進出するのを防止

## 2. Database Schema Design Rules

### 2.1 Row Level Security (RLS) ポリシー実装

**Critical**: 全テーブルで RLS を有効化し、ユーザーは自分のデータのみにアクセス可能に

```sql
-- drizzle/rls-policies.sql
ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "account" ENABLE ROW LEVEL SECURITY;  -- OAuth tokens を含む
ALTER TABLE "verification" ENABLE ROW LEVEL SECURITY;

-- ポリシー定義例
CREATE POLICY "user_read_own" ON "user"
  FOR SELECT
  USING (id = auth.uid());
```

**ルール**:
- ✅ 初期セットアップ: `psql -d $DATABASE_URL -f drizzle/rls-policies.sql`
- ✅ RLS ポリシーは `drizzle/rls-policies.sql` に一元管理
- ✅ 個人情報・トークンが含まれるテーブルは必ず RLS を有効化

### 2.2 インデックス戦略

**Major**: パフォーマンス向上と Query Optimization のためインデックスを明示的に定義

```typescript
export const user = pgTable("user", { /* ... */ }, (table) => [
  index("user_email_idx").on(table.email),  // 検索用
]);

export const session = pgTable("session", { /* ... */ }, (table) => [
  index("session_userId_idx").on(table.userId),  // 外部キー
]);

export const account = pgTable("account", { /* ... */ }, (table) => [
  index("account_userId_idx").on(table.userId),  // RLS where 句用
]);
```

**ルール**:
- ✅ 外部キーには常にインデックスを定義
- ✅ RLS `WHERE userId = ?` で使用されるカラムはインデックス必須
- ✅ 検索頻度が高いカラム（email など）にはインデックスを定義
- ❌ **Index Shotgun 回避**: すべてのカラムにインデックスを張らない

### 2.3 タイムスタンプ型の統一

**Major**: PostgreSQL のタイムスタンプはタイムゾーン対応型を使用

```typescript
// ❌ 間違い（ローカル時間のため、マルチリージョン展開で問題）
createdAt: timestamp("created_at").defaultNow().notNull(),

// ✅ 正しい（UTC with timezone）
createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
```

**ルール**:
- ✅ すべてのタイムスタンプカラムに `{ withTimezone: true }` を指定
- ✅ マルチリージョン展開時の時間ズレ防止

### 2.4 N+1 クエリ防止

**Major**: ループ内での DB 再クエリを禁止。Eager Loading を活用

```typescript
// ❌ 危険（N+1 クエリ）
const users = await db.select().from(user);
for (const u of users) {
  const sessions = await db.select().from(session).where(eq(session.userId, u.id));
}

// ✅ 正しい（Eager Loading）
const usersWithSessions = await db.query.user.findMany({
  with: {
    sessions: true,
    accounts: true,
  },
});
```

**ルール**:
- ✅ Drizzle ORM の `.with()` / `.leftJoin()` を活用
- ✅ リレーション定義は `src/db/schema.ts` で事前に定義
- ✅ Better Auth の4テーブル（`user` / `session` / `account` / `verification`）は、`auth.ts` 側スキーマと `drizzle.config.ts` 側スキーマで列名（snake_case/camelCase）を厳密一致させる
- ❌ ループ内でのクエリ発行は原則禁止

## 3. Error Handling & Logging

### 3.1 エラーハンドリング強化

**Major**: エラーメッセージの詳細化。スタックトレース出力で本番デバッグを容易に

```typescript
// ❌ 不十分
catch (error) {
  log('error', 'Session retrieval failed');
}

// ✅ 詳細でセキュリティ意識的
catch (error) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;

  log('error', `[AUTH_ERROR] Session retrieval failed: ${errorMessage}`);

  // 開発環境でのみスタックトレース出力
  if (process.env.DEBUG_LOGGING === 'true' && errorStack) {
    console.error('[Proxy][Stack Trace]', errorStack);
  }
}
```

**ルール**:
- ✅ エラーメッセージには具体的な情報を含める
- ✅ 開発環境でスタックトレースを出力
- ❌ エラーオブジェクトを無視する

### 3.2 セキュリティイベントの記録

**Critical**: 権限チェック失敗、不正アクセス試行などを記録

```typescript
// セキュリティイベント: 権限なしで管理画面アクセス
if (isAdminPath && session?.user?.role !== "admin") {
  const userEmail = session?.user?.email || "unknown";
  const userRole = session?.user?.role || "unauthenticated";

  log('error',
    `[SECURITY_EVENT] Unauthorized admin access attempt - ` +
    `User: ${userEmail}, Role: ${userRole}, Path: ${pathname}`
  );

  return NextResponse.redirect(new URL(ROUTES.LANDING, request.url));
}
```

**ルール**:
- ✅ セキュリティイベント（権限昇格試行、認証失敗）は `error` レベルで記録
- ✅ ユーザー情報（メール、ロール）とアクセス対象を記録
- ✅ 監査ログとして本番環境で集約・監視

## 4. Testing & TDD Requirements

### 4.1 テスト実装の必須化

**Critical**: 認証、認可、データ操作などのクリティカルな機能にはテストを必須

```typescript
// src/__tests__/proxy.test.ts
describe('proxy (Next.js 16 Middleware)', () => {
  it('should redirect unauthenticated users to landing', async () => {
    const request = new NextRequest(new URL('http://localhost:3000/protected'));
    (auth.api.getSession as any).mockResolvedValue(null);

    const response = await proxy(request);

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toContain('/');
  });

  it('should allow admin access to /admin', async () => {
    const request = new NextRequest(new URL('http://localhost:3000/admin'));
    (auth.api.getSession as any).mockResolvedValue({
      user: { id: '1', email: 'admin@example.com', role: 'admin' },
    });

    const response = await proxy(request);

    expect(response.status).toBe(200);
  });
});
```

**実装チェックリスト**:
- ✅ Proxy テスト: 認証チェック、管理者権限、エラーハンドリング
- ✅ Auth Flow テスト: セッション管理、状態遷移
- ✅ API Route テスト: 入力バリデーション、権限チェック

### 4.2 テストシナリオ生成ガイドライン

テスト実装前に、以下の観点でシナリオをリストアップ:

1. **正常系 (Happy Path)**: 基本的な成功パターン
2. **異常系 (Error Handling)**: バリデーションエラー、API エラー、ネットワーク切断
3. **境界値 (Boundary)**: 0, 負数, 最大文字数, 空リスト
4. **状態遷移**: ローディング中、空データ表示、成功メッセージ、エラーメッセージ
5. **セキュリティ**: 権限チェック、不正アクセス、CSRF/XSS 対策

### 4.3 テスト環境設定

```typescript
// vitest.config.ts
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './vitest.setup.ts',
  },
});
```

**ルール**:
- ✅ フレームワーク: Vitest + React Testing Library
- ✅ 実行環境: `happy-dom`
- ✅ 実行コマンド: `pnpm test`

## 5. Code Quality Standards (コード品質基準)

### 5.1 Tailwind CSS v4 対応

**Minor**: Tailwind CSS v4 の新しいクラス名を使用

```typescript
// ❌ 旧クラス名（Tailwind v4 では deprecated）
// 例: gradient クラスや shrink クラスは新名称に変更

// ✅ 新クラス名
className="bg-linear-to-b from-gray-50"
className="shrink-0"
```

**ルール**:
- ✅ ESLint の Tailwind CSS ルールに従う
- ✅ `bg-gradient-*` → `bg-linear-*` に統一
- ✅ `flex-shrink-*` → `shrink-*` に統一

### 5.2 型安全性強化

**Major**: `any` 型の禁止、Non-null Assertion の活用

```typescript
// ❌ 型安全性が低い
const clientId: any = process.env.GOOGLE_CLIENT_ID || "";

// ✅ 型安全
const clientId = process.env.GOOGLE_CLIENT_ID!;
```

**ルール**:
- ✅ 検証後は `!` (Non-null Assertion) で型安全性を強化
- ✅ `any` 型は原則禁止

## 6. Production Readiness Checklist

本番デプロイ前に以下をチェック:

- [ ] **Security**: OAuth 認証情報が `.env.production` に設定
- [ ] **Security**: `USE_REAL_AUTH=true` を設定
- [ ] **Security**: `NODE_ENV=production` で起動テスト
- [ ] **Security**: RLS ポリシーが PostgreSQL に適用
- [ ] **Testing**: 全テストが成功 (`pnpm test`)
- [ ] **Build**: `pnpm build` が成功して型エラーなし
- [ ] **Database**: インデックス戦略が適用
- [ ] **Logging**: エラーハンドリング・監査ログ設定確認
- [ ] **Performance**: N+1 クエリがないか確認
- [ ] **Monitoring**: Sentry/DataDog などの監視ツール統合
- [ ] **Documentation**: 環境変数リストを確認

---

**参考**:
- `.agent/rules/security-architecture.md` - セキュリティアーキテクチャ全般
- `.agent/rules/coding-standards.md` - 基本的なコーディング標準
- `.agent/skills/test-workflow/SKILL.md` - テストワークフロー
