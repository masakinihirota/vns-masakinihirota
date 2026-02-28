# Better Auth × Hono 共存方法 - 詳細な選択肢と推奨度

**作成日:** 2026-03-01
**目的:** Better Auth と Hono の共存方法を決定するための詳細な比較分析
**対象:** Hono 導入計画フェーズ A の基盤設計

---

## 📊 現在の構成（確認）

```typescript
// 現在の Better Auth 実装
// src/app/api/auth/[...all]/route.ts
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { POST, GET } = toNextJsHandler(auth);
```

```typescript
// src/lib/auth.ts
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  socialProviders: {
    google: { ... },
    github: { ... },
  },
  // ...
});
```

```typescript
// src/proxy.ts (Next.js 16 Middleware)
export async function proxy(request: NextRequest) {
  // Cookie 検証、認証チェック
  // request に userId を context として注入
}
```

---

## 🎯 選択肢の全体像

| # | パターン | 概要 | 推奨度 | 実装難易度 |
|---|---------|------|--------|----------|
| **A** | **並行運用（独立）** | Better Auth は既存のまま、Hono は別ルートで独立 | ⭐⭐⭐⭐⭐ | 易 |
| **B** | **Hono 内で Better Auth を Middleware 化** | Hono middleware として Better Auth を統合 | ⭐⭐⭐ | 中～高 |
| **C** | **Better Auth を Hono Router に統合** | Better Auth のエンドポイントも Hono で管理 | ⭐⭐ | 高 |
| **D** | **Hono を Better Auth Plugin として実装** | Better Auth の拡張として Hono を統合 | ⭐ | 極めて高 |

---

## 📋 選択肢 A: 並行運用（独立）⭐⭐⭐⭐⭐ **【最推奨】**

### 構成図

```
Browser
  ↓
[Next.js Entry Point]
  ↓
[src/proxy.ts] ← Next.js 16 Middleware（Cookie 検証）
  ├─ /api/auth/* → [src/app/api/auth/[...all]/route.ts] ← Better Auth (既存)
  │                 └─ toNextJsHandler(auth)
  │
  └─ /api/* → [src/app/api/[[...route]]/route.ts] ← Hono (新規)
                ├─ /api/admin/* (Hono Router)
                ├─ /api/groups/* (Hono Router)
                ├─ /api/nations/* (Hono Router)
                └─ /api/notifications/* (Hono Router)

Server Actions (既存)
  ├─ create-group.ts ← そのまま継続
  └─ create-nation.ts ← そのまま継続
```

### セッション検証フロー

```typescript
// 1. Proxy (Next.js Middleware) でグローバル検証
// src/proxy.ts
export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (session?.user) {
    // request に userId を context として注入（可能であれば）
  }
  return NextResponse.next();
}

// 2. Better Auth エンドポイント（既存のまま）
// src/app/api/auth/[...all]/route.ts
export const { POST, GET } = toNextJsHandler(auth);

// 3. Hono エンドポイント（新規）
// src/app/api/[[...route]]/route.ts
export const runtime = 'node';

const api = new Hono()
  .use('*', async (c, next) => {
    // Hono middleware でセッション検証
    const session = await auth.api.getSession({
      headers: c.req.raw.headers
    });

    if (!session?.user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    c.set('userId', session.user.id);
    c.set('userRole', session.user.role);
    await next();
  })
  .route('/admin', adminRouter)
  .route('/groups', groupsRouter);

export const { GET, POST, PATCH, DELETE, PUT } = toNextJsHandler(api);

// 4. Server Actions（既存のまま）
// src/app/actions/create-group.ts
export async function createGroupAction(input: unknown) {
  const session = await getSession();  // ← 既存の方法
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }
  // ...
}
```

### ✅ メリット（8点）

1. **リスク最小化** ⭐⭐⭐
   - 既存の Better Auth 実装を一切変更しない
   - 既存の OAuth フロー（Google, GitHub）が継続動作
   - 既存の Server Actions が継続動作

2. **実装の容易性** ⭐⭐⭐
   - Hono は新規エンドポイントのみ実装
   - Better Auth のフレームワーク統合（toNextJsHandler）をそのまま活用
   - セッション検証は既存の `auth.api.getSession()` を再利用

3. **段階的な移行が可能** ⭐⭐
   - 新規 API だけ Hono で実装
   - 既存 Server Actions は後から徐々に移行可（または継続運用）
   - 失敗時のロールバックが容易

4. **テスト戦略が明確** ⭐⭐
   - Better Auth のテストは既存のまま
   - Hono API のテストのみ新規作成
   - テストの分離が容易

5. **Cookie 管理の一貫性** ⭐⭐
   - Better Auth が発行する Cookie（session token）を Hono が読み取る
   - Cookie の発行・検証ロジックが一元化（Better Auth が担当）
   - CSRF トークンも Better Auth が管理

6. **エラー処理の分離** ⭐
   - Better Auth のエラーは Better Auth が処理
   - Hono のエラーは Hono middleware が処理
   - 責任範囲が明確

7. **デバッグの容易性** ⭐⭐
   - `/api/auth/*` へのリクエストは Better Auth のログ
   - `/api/*` へのリクエストは Hono のログ
   - どこで問題が発生したかが明確

8. **将来の拡張性** ⭐
   - Better Auth のバージョンアップが独立して可能
   - Hono のバージョンアップが独立して可能
   - 互いに影響を受けない

### ❌ デメリット（3点）

1. **セッション検証の重複** ⚠️
   - Proxy、Better Auth エンドポイント、Hono エンドポイント、Server Actions で
     それぞれセッション検証が必要
   - ただし、`auth.api.getSession()` を共通で使用するため、実装の重複は最小限

2. **エンドポイントの管理が分散** ⚠️
   - `/api/auth/*` は Better Auth
   - `/api/*` は Hono
   - Server Actions は別フォルダ
   - ただし、責任範囲が明確なので許容範囲内

3. **初期学習コストが若干増加** ⚠️
   - 開発者は Better Auth と Hono の 2 つのフレームワークを理解する必要
   - ただし、どちらも TypeScript ネイティブなので学習曲線は緩やか

### 🎯 推奨理由

**総合評価: ⭐⭐⭐⭐⭐ (10/10)**

- ✅ **リスクが最小**（既存実装を変更しない）
- ✅ **実装が最も容易**（新規エンドポイントのみ実装）
- ✅ **テスト戦略が明確**（既存テストを維持）
- ✅ **段階的な移行が可能**（失敗時のロールバック容易）
- ✅ **現在のプロジェクト構成と完全に互換**

### 📝 実装チェックリスト

```markdown
## パターン A 実装手順

### フェーズ 0: 検証（1h）
- [ ] Hono エンドポイント（/api/test）を作成
- [ ] Better Auth エンドポイント（/api/auth/session）が正常動作することを確認
- [ ] どちらも同時にアクセスできることを確認
- [ ] Cookie が正しく共有されることを確認

### フェーズ 1: Hono セットアップ（1.5h）
- [ ] src/app/api/[[...route]]/route.ts 作成
- [ ] `export const runtime = 'node';` を明記
- [ ] Hono middleware でセッション検証実装
  ```typescript
  .use('*', async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session?.user) return c.json({ error: 'Unauthorized' }, 401);
    c.set('userId', session.user.id);
    await next();
  })
  ```

### フェーズ 2: テスト（0.5h）
- [ ] /api/auth/signin にアクセス → Better Auth が正常動作
- [ ] /api/admin/users にアクセス → Hono が正常動作
- [ ] 未認証で /api/admin/users → 401 Unauthorized
- [ ] 認証済みで /api/admin/users → 200 OK

### フェーズ 3: 統合確認（0.5h）
- [ ] Server Actions (create-group) が正常動作
- [ ] Hono API (admin/users) が正常動作
- [ ] Better Auth (OAuth login) が正常動作
- [ ] すべてが同時に機能することを確認
```

---

## 📋 選択肢 B: Hono 内で Better Auth を Middleware 化 ⭐⭐⭐

### 構成図

```
Browser
  ↓
[Next.js Entry Point]
  ↓
[src/app/api/[[...route]]/route.ts] ← Hono 統合ハンドラ
  ↓
[Hono Middleware Chain]
  ├─ Better Auth Middleware ← 新規実装が必要
  ├─ Session Validation
  ├─ RBAC Check
  └─ Error Handler
  ↓
[Hono Routes]
  ├─ /auth/* → Better Auth endpoints (Hono で実装)
  ├─ /admin/* → Admin API
  ├─ /groups/* → Groups API
  └─ ...
```

### 実装例

```typescript
// src/app/api/[[...route]]/route.ts
import { Hono } from 'hono';
import { auth } from '@/lib/auth';

export const runtime = 'node';

// Better Auth を Hono Middleware として実装
const betterAuthMiddleware = () => {
  return async (c, next) => {
    // Better Auth のエンドポイントハンドリング
    if (c.req.path.startsWith('/auth/')) {
      // Better Auth のロジックを Hono コンテキストで実行
      // ※ これが複雑になる可能性が高い
      const response = await auth.handler(c.req.raw);
      return response;
    }

    // セッション検証
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (session?.user) {
      c.set('userId', session.user.id);
    }

    await next();
  };
};

const api = new Hono()
  .use('*', betterAuthMiddleware())
  .route('/admin', adminRouter)
  .route('/groups', groupsRouter);

export const { GET, POST, PATCH, DELETE, PUT } = toNextJsHandler(api);
```

### ✅ メリット（5点）

1. **統一されたエンドポイント管理** ⭐⭐
   - すべての API が Hono で管理される
   - ルーティング設定が一元化

2. **Middleware の統一** ⭐⭐
   - セッション検証、RBAC、エラーハンドリングがすべて Hono middleware
   - middleware chain が一貫している

3. **RPC Client の一元化** ⭐
   - すべての API エンドポイントが Hono RPC client で使用可能
   - `/api/auth/*` も RPC client で型安全にアクセス可能

4. **ログの一元化** ⭐
   - すべての API リクエストが Hono のロギング middleware を通過
   - デバッグが一元化される

5. **将来的な設計の一貫性** ⭐
   - 新規エンドポイントの追加が統一的
   - API 設計のベストプラクティスが統一される

### ❌ デメリット（6点）

1. **実装の複雑性が高い** 🔴🔴🔴
   - Better Auth の内部実装を Hono コンテキストで動作させる必要
   - toNextJsHandler の内部ロジックを Hono middleware として再実装
   - OAuth フローの複雑なリダイレクト処理を Hono で管理

2. **Better Auth のフレームワーク統合を捨てる** 🔴🔴
   - toNextJsHandler は使用できない
   - Better Auth の Next.js 統合の利点を失う
   - Cookie 管理、CSRF 保護を手動で実装

3. **テストの複雑性** 🔴🔴
   - Better Auth のエンドポイントを Hono でテストする必要
   - OAuth フローのテストが複雑化
   - モックの作成が困難

4. **バージョンアップリスク** 🔴
   - Better Auth のバージョンアップ時に Hono middleware も更新が必要
   - フレームワーク統合の変更に追従が必要

5. **既存実装の破棄** 🔴
   - 現在動作している `/api/auth/[...all]/route.ts` を削除
   - 既存の OAuth フローが動作しなくなるリスク

6. **デバッグの難しさ** 🔴
   - Better Auth のエラーが Hono のエラーとして現れる
   - エラーの原因特定が困難

### 🎯 評価

**総合評価: ⭐⭐⭐ (6/10)**

- ✅ 統一された設計
- ❌ 実装の複雑性が非常に高い
- ❌ Better Auth のフレームワーク統合を失う
- ❌ リスクが高い（既存実装の破棄）

**推奨度:** 🟡 中程度（特別な理由がない限り推奨しない）

---

## 📋 選択肢 C: Better Auth を Hono Router に統合 ⭐⭐

### 構成図

```
Browser
  ↓
[src/app/api/[[...route]]/route.ts]
  ↓
[Hono Router]
  ├─ /auth/signin → 手動実装（Better Auth の代わり）
  ├─ /auth/signup → 手動実装
  ├─ /auth/signout → 手動実装
  ├─ /admin/* → Admin API
  └─ ...
```

### 実装例

```typescript
// src/lib/api/routes/auth.ts
import { Hono } from 'hono';
import { db } from '@/lib/db/client';
import bcrypt from 'bcrypt';

export const authRouter = new Hono()
  .post('/signin', async (c) => {
    const { email, password } = await c.req.json();

    // 手動でユーザー検証
    const user = await db.query.user.findFirst({
      where: eq(user.email, email)
    });

    if (!user || !await bcrypt.compare(password, user.password)) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    // セッション作成（手動実装）
    const sessionToken = generateSessionToken();
    await db.insert(session).values({
      userId: user.id,
      token: sessionToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    // Cookie 設定（手動実装）
    setCookie(c, 'session_token', sessionToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
    });

    return c.json({ success: true, user });
  })
  .post('/signup', async (c) => {
    // 手動実装
  })
  .get('/session', async (c) => {
    // 手動実装
  });
```

### ✅ メリット（3点）

1. **完全な制御** ⭐⭐
   - 認証フローのすべてを完全に制御
   - カスタマイズの自由度が最大

2. **統一された設計** ⭐
   - すべてが Hono で統一

3. **依存関係の削減** ⭐
   - Better Auth パッケージを削除可能（理論上）

### ❌ デメリット（8点）

1. **実装コストが極めて高い** 🔴🔴🔴🔴
   - OAuth フロー（Google, GitHub）を手動実装
   - セッション管理を手動実装
   - CSRF 保護を手動実装
   - パスワードリセットフローを手動実装
   - Email 検証フローを手動実装

2. **セキュリティリスク** 🔴🔴🔴
   - Better Auth の既存のセキュリティ対策を失う
   - 自前実装のセキュリティホールの可能性

3. **既存実装の完全破棄** 🔴🔴
   - Better Auth の全機能を捨てる
   - 既存の OAuth 統合を再実装

4. **テストの複雑性** 🔴🔴
   - すべての認証フローを手動でテスト
   - OAuth モックの作成が困難

5. **メンテナンスコスト** 🔴🔴
   - 認証ロジックのバグ修正を自分で行う
   - セキュリティアップデートを自分で対応

6. **開発時間** 🔴🔴
   - 実装に 20～40h 以上必要（認証システム全体）

7. **プロジェクトのリスク** 🔴🔴
   - 認証システムの失敗は致命的
   - ユーザーデータの漏洩リスク

8. **Better Auth の利点を失う** 🔴
   - 多要素認証（2FA）を手動実装
   - Organization 機能を手動実装

### 🎯 評価

**総合評価: ⭐⭐ (3/10)**

- ❌ 実装コストが極めて高い
- ❌ セキュリティリスクが高い
- ❌ Better Auth の全機能を失う
- ❌ プロジェクトのリスクが極めて高い

**推奨度:** 🔴 非推奨（特別な理由がない限り選択すべきでない）

---

## 📋 選択肢 D: Hono を Better Auth Plugin として実装 ⭐

### 概要

Better Auth の Plugin API を使用して、Hono を Better Auth の拡張として統合する方法。

**ただし、Better Auth の Plugin API は認証関連機能の拡張を想定しており、
一般的な API エンドポイントの実装には適していません。**

### 🎯 評価

**総合評価: ⭐ (1/10)**

- ❌ Better Auth Plugin API の用途と異なる
- ❌ 実装が極めて困難
- ❌ ドキュメントが不足
- ❌ メリットがほぼない

**推奨度:** 🔴 非推奨（選択すべきでない）

---

## 🏆 最終推奨：選択肢 A（並行運用）

### 決定理由

| 評価軸 | 選択肢 A | 選択肢 B | 選択肢 C | 選択肢 D |
|--------|---------|---------|---------|---------|
| **実装の容易性** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐ | ⭐ |
| **リスクの低さ** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐ | ⭐ |
| **既存実装の活用** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐ | ⭐ |
| **テストの容易性** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐ | ⭐ |
| **段階的移行の可能性** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐ | ⭐ |
| **将来の拡張性** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐ |
| **セキュリティ** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐ |
| **メンテナンス性** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐ |
| **合計** | **40/40** | **21/40** | **10/40** | **8/40** |

### ✅ 決定事項

**選択肢 A（並行運用）を採用します。**

理由：
1. ✅ **リスクが最小**（既存実装を変更しない）
2. ✅ **実装が最も容易**（1～2h で完了）
3. ✅ **セキュリティが最も高い**（Better Auth の実装をそのまま活用）
4. ✅ **テストが最も容易**（既存テストを維持）
5. ✅ **段階的な移行が可能**（失敗時のロールバック容易）

---

## 📝 実装ガイド（選択肢 A）

### セッション検証の統一方法

```typescript
// src/lib/api/middleware/auth.ts
import { auth } from '@/lib/auth';

/**
 * Hono Middleware: セッション検証
 *
 * Better Auth の getSession() を使用してセッションを検証し、
 * Hono context に userId と userRole を注入する
 */
export const authMiddleware = () => {
  return async (c, next) => {
    try {
      // Better Auth のセッション検証を再利用
      const session = await auth.api.getSession({
        headers: c.req.raw.headers
      });

      if (!session?.user) {
        return c.json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required'
          }
        }, 401);
      }

      // Hono context にセッション情報を注入
      c.set('userId', session.user.id);
      c.set('userEmail', session.user.email);
      c.set('userRole', session.user.role);
      c.set('session', session);

      await next();
    } catch (error) {
      console.error('[Auth Middleware] Error:', error);
      return c.json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Authentication failed'
        }
      }, 500);
    }
  };
};

/**
 * Optional Middleware: 認証が任意のエンドポイント用
 */
export const optionalAuthMiddleware = () => {
  return async (c, next) => {
    try {
      const session = await auth.api.getSession({
        headers: c.req.raw.headers
      });

      if (session?.user) {
        c.set('userId', session.user.id);
        c.set('userRole', session.user.role);
      }

      await next();
    } catch (error) {
      // エラーでも続行（認証が任意のため）
      await next();
    }
  };
};
```

### 使用例

```typescript
// src/lib/api/routes/admin/users.ts
import { Hono } from 'hono';
import { authMiddleware } from '@/lib/api/middleware/auth';
import { checkPlatformAdmin } from '@/lib/auth/rbac-helper';

export const usersRouter = new Hono()
  // すべてのエンドポイントで認証必須
  .use('*', authMiddleware())

  // GET /api/admin/users
  .get('/', async (c) => {
    const userId = c.get('userId');  // ← authMiddleware で注入された値
    const userRole = c.get('userRole');

    // RBAC: platform_admin のみ
    if (userRole !== 'platform_admin') {
      return c.json({ error: 'Forbidden' }, 403);
    }

    // 既存の DB クエリ関数を使用
    const users = await searchUsers();
    return c.json({ success: true, data: users }, 200);
  });
```

---

## 📋 次のステップ

1. **この決定を `.agent/decisions/better-auth-pattern.md` に記録**
   ```markdown
   # Better Auth × Hono 共存方法の決定

   **決定日:** 2026-03-01
   **選択肢:** A（並行運用）
   **推奨度:** ⭐⭐⭐⭐⭐

   理由：
   - 既存実装を変更しない（リスク最小）
   - 実装が最も容易（1～2h）
   - Better Auth の利点を最大限活用
   ```

2. **フェーズ 0 の検証を実施**
   - Hono テストエンドポイントを作成
   - Better Auth と並行動作することを確認
   - セッション検証が正常動作することを確認

3. **フェーズ 1 の実装開始**
   - `src/app/api/[[...route]]/route.ts` 作成
   - authMiddleware 実装
   - 最初のエンドポイントをテスト

---

**作成者:** GitHub Copilot
**決定:** ✅ 選択肢 A（並行運用）を採用
