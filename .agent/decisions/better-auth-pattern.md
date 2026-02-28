# Better Auth × Hono 共存方法の決定

**決定日:** 2026-03-01
**決定者:** プロジェクトチーム
**ステータス:** ✅ 確定

---

## 📋 決定内容

**選択肢 A（並行運用・独立運用）を採用**

### 構成

```
Browser
  ↓
[Next.js Entry Point]
  ↓
[src/proxy.ts] ← Next.js 16 Middleware
  ↓
┌─────────────────────────────────────┐
│ /api/auth/*                         │ ← Better Auth（既存のまま維持）
│ [src/app/api/auth/[...all]/route.ts]│
│ toNextJsHandler(auth)               │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ /api/*                              │ ← Hono（新規実装）
│ [src/app/api/[[...route]]/route.ts]│
│ Hono Router                         │
│   ├─ /api/admin/*                   │
│   ├─ /api/groups/*                  │
│   ├─ /api/nations/*                 │
│   └─ /api/notifications/*           │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Server Actions                      │ ← 既存のまま維持
│ src/app/actions/                    │
│   ├─ create-group.ts                │
│   └─ create-nation.ts               │
└─────────────────────────────────────┘
```

---

## ✅ 採用理由

| 評価軸 | スコア | 詳細 |
|--------|--------|------|
| **実装の容易性** | 5/5 | 新規エンドポイントのみ実装、既存を変更しない |
| **リスクの低さ** | 5/5 | 既存の Better Auth を一切変更しない |
| **セキュリティ** | 5/5 | Better Auth の実装をそのまま活用 |
| **テストの容易性** | 5/5 | 既存テストを維持、新規テストのみ追加 |
| **段階的移行** | 5/5 | 失敗時のロールバックが容易 |
| **将来の拡張性** | 4/5 | 両フレームワークが独立してバージョンアップ可能 |
| **メンテナンス性** | 5/5 | 責任範囲が明確（認証 = Better Auth、API = Hono） |
| **実装時間** | 5/5 | 1～2h で完了可能 |

**合計評価: 39/40 点** ⭐⭐⭐⭐⭐

---

## 🎯 実装方針

### セッション検証の統一

```typescript
// src/lib/api/middleware/auth.ts
import { auth } from '@/lib/auth';

/**
 * Hono Middleware: セッション検証
 * Better Auth の getSession() を再利用
 */
export const authMiddleware = () => {
  return async (c, next) => {
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
  };
};
```

### エンドポイント責任分離

| エンドポイント | 担当 | 実装 |
|--------------|------|------|
| `/api/auth/*` | Better Auth | 既存のまま（toNextJsHandler） |
| `/api/admin/*` | Hono | 新規実装 |
| `/api/groups/*` | Hono | 新規実装 |
| `/api/nations/*` | Hono | 新規実装 |
| `/api/notifications/*` | Hono | 新規実装 |
| `/api/users/*` | Hono | 新規実装 |
| Server Actions | Next.js | 既存のまま（段階的に移行可） |

---

## 📝 実装チェックリスト

### フェーズ 0: 検証（1h）
- [x] 決定を `.agent/decisions/better-auth-pattern.md` に記録
- [ ] Hono テストエンドポイント（/api/health）を作成
- [ ] Better Auth エンドポイント（/api/auth/session）が正常動作確認
- [ ] 両エンドポイントが同時にアクセス可能か確認
- [ ] Cookie が正しく共有されるか確認

### フェーズ 1: Hono セットアップ（1.5h）
- [ ] `pnpm add hono` 実行
- [ ] `src/app/api/[[...route]]/route.ts` 作成
  - `export const runtime = 'node';` を明記
  - Hono アプリ初期化
  - toNextJsHandler でエクスポート
- [ ] `src/lib/api/middleware/auth.ts` 作成
  - Better Auth のセッション検証を再利用
  - userId, userRole を context に注入
- [ ] `src/lib/api/middleware/error-handler.ts` 作成
- [ ] ビルド確認（`pnpm build`）

### フェーズ 2: 統合テスト（0.5h）
- [ ] `/api/auth/signin` にアクセス → Better Auth が正常動作
- [ ] `/api/health` にアクセス → Hono が正常動作
- [ ] 未認証で `/api/admin/users` → 401 Unauthorized
- [ ] 認証済みで `/api/admin/users` → 200 OK（または実装済みエンドポイント）
- [ ] Server Actions（create-group）が正常動作
- [ ] すべてが同時に機能することを確認

---

## 🔒 セキュリティ考慮事項

### Cookie 管理
- ✅ Better Auth が Cookie の発行・検証を担当
- ✅ Hono は Cookie を読み取るのみ（変更しない）
- ✅ httpOnly, secure, sameSite 設定は Better Auth が管理

### CSRF 保護
- ✅ Better Auth が CSRF トークンを管理
- ✅ Hono エンドポイントは state-changing 操作時に CSRF チェック（オプション）

### セッション管理
- ✅ Better Auth がセッションの作成・検証・削除を担当
- ✅ Hono は既存セッションを検証するのみ

---

## 🚫 却下した選択肢

### 選択肢 B: Hono 内で Better Auth を Middleware 化
- ❌ 実装の複雑性が高い（toNextJsHandler を捨てる）
- ❌ Better Auth のフレームワーク統合を失う
- ❌ OAuth フローの再実装が必要

### 選択肢 C: Better Auth を Hono Router に統合
- ❌ 実装コストが極めて高い（20～40h+）
- ❌ セキュリティリスクが高い（自前実装）
- ❌ Better Auth の全機能を失う

### 選択肢 D: Hono を Better Auth Plugin として実装
- ❌ Better Auth Plugin API の用途と異なる
- ❌ 実装が極めて困難
- ❌ メリットがほぼない

---

## 📚 参考ドキュメント

- 詳細な選択肢比較: `schedule_todo_list/2026-03-01_BETTER_AUTH_HONO_OPTIONS.md`
- 修正版実装計画: `schedule_todo_list/2026-03-01_HONO_IMPLEMENTATION_REVISED.md`
- レビュー報告書: `schedule_todo_list/2026-03-01_HONO_REVIEW_CRITIQUE.md`

---

**決定者署名:** プロジェクトチーム
**最終更新:** 2026-03-01
**ステータス:** ✅ 確定・実装準備完了
