# 🔴 CRITICAL CODE REVIEW - 本番デプロイ前最終チェック (2026-03-01)

## 概要

Production Ready 100% の報告の後、敵対的レビュー（Strict Mode）を実施
以下の **CRITICAL** 問題を発見しました

---

## 🔴 CRITICAL ISSUES (本番デプロイ前に修正必須)

### 1️⃣ Ghost Mode Check が DB エラー時に無視される 【SEVERITY: CRITICAL】

**Location**: `src/lib/auth/rbac-helper.ts` (Line 218-233)

```typescript
export async function isGhostMask(session: AuthSession | null): Promise<boolean> {
  if (!session?.user?.id) return false;

  try {
    const maskCategory = await _getMaskCategoryInternal(session.user.id);
    return maskCategory === "ghost";
  } catch (error) {
    // ❌ DB接続エラー時に `false` を返す
    if (error instanceof RBACError) {
      console.error('[RBAC] Ghost mask check failed', error.context);
    }
    return false;  // ❌ VERY DANGEROUS: DB fail → ペルソナ扱い
  }
}
```

**問題**:
- DB接続エラーが発生した場合、`false`（ペルソナ）を返す
- つまり、**幽霊ユーザーのチェックが完全にスキップされる**
- 幽霊ユーザーがグループ/国を作成できる可能性がある

**影響範囲**:
- Ghost Mode テスト: ✅ 通る（モック環境だから）
- 本番環境でDB接続が遅延 → 幽霊ユーザーが操作可能
- Security exposure: **MEDIUM**

**修正方法**:
```typescript
export async function isGhostMask(session: AuthSession | null): Promise<boolean> {
  if (!session?.user?.id) return false;

  try {
    const maskCategory = await _getMaskCategoryInternal(session.user.id);
    return maskCategory === "ghost";
  } catch (error) {
    // ✅ 修正: DB エラー時は安全側に倒す（false ではなく throw）
    console.error('[RBAC] Ghost mask check failed - SAFE DEFAULT', error.context);
    throw new RBACError(
      'Failed to verify ghost mask status.',
      'GHOST_CHECK_FAILED',
      { userId: session?.user?.id }
    );
  }
}
```

**PR Required**: YES - must fix before production

---

### 2️⃣ checkInteractionAllowed() も同じ問題を持つ

**Location**: `src/lib/auth/rbac-helper.ts` (Line 251-272)

```typescript
export async function checkInteractionAllowed(session: AuthSession | null): Promise<boolean> {
  // ...
  try {
    const ghostMask = await isGhostMask(session);
    return !ghostMask;
  } catch (error) {
    // ❌ エラーハンドリングが甘い
    if (error instanceof RBACError) {
      throw error;
    }
    throw new RBACError(
      'Unable to verify interaction permissions.',
      'INTERACTION_CHECK_FAILED',
      { userId: session.user.id }
    );
  }
}
```

**問題**:
- `isGhostMask()` が throw するようになると、ここがキャッチして再度 throw する
- その結果、Server Action `createGroupAction()` で error が捕捉される可能性
- error が捕捉されると、クライアントに generic "Failed to create group" エラーが返される
- 幽霊ユーザーが失敗することは分かるが、なぜ失敗したか曖昧

**修正方法**: ✅ isGhostMask() の修正で解決

---

### 3️⃣ Session Callback で型安全性がない【SEVERITY: MAJOR】

**Location**: `src/lib/auth.ts` (Line 126-147)

```typescript
async callback({ session, user }: { session: any; user: any }) {
  //                                           ^^^    ^^^
  // ❌ `any` を使用している!
```

**問題**:
- Better Auth の `Session` 型と `User` 型を使用すべし
- TypeScript の型チェックが全くされていない
- Runtime error が本番環境で発生する可能性

**修正方法**:
```typescript
import type { Session, User } from "better-auth/types";

async callback({ session, user }: { session: Session; user: User }) {
  // ✅ 型安全！
```

**PR Required**: YES

---

### 4️⃣ Session Callback が毎回 DB クエリを実行【SEVERITY: MAJOR】

**Location**: `src/lib/auth.ts` (Line 126-147)

```typescript
async callback({ session, user }: { session: any; user: any }) {
  try {
    // セッション更新のたびにこのクエリが実行される
    const rootAccount = await db
      .select({ activeProfileId: schema.rootAccounts.activeProfileId })
      .from(schema.rootAccounts)
      .where(eq(schema.rootAccounts.authUserId, user.id))
      .limit(1)
      .then((rows) => rows[0]);

    return {
      ...session,
      user: {
        ...session.user,
        activeProfileId: rootAccount?.activeProfileId ?? null,
      },
    };
  } catch (error) {
    console.error('[AUTH] Failed to get activeProfileId', error);
    return session;  // ❌ エラー時に activeProfileId が undefined
  }
}
```

**問題**:
- セッション更新のたびに DB クエリが実行される
- 頻繁なセッション更新（API リクエスト毎）が DB load を増加させる
- Connection pool exhaustion のリスク

**改善方法**:
1. **Option A**: activeProfileId をセッション作成時に一度だけ取得
2. **Option B**: rootAccounts テーブルに activeProfileId キャッシュ（実装済み？）
3. **Option C**: OAuth callback でだけ実行、その後のリクエストではスキップ

**PR Required**: YES (Performance optimization)

---

### 5️⃣ Session Callback で Error Handling が甘い【SEVERITY: MAJOR】

```typescript
catch (error) {
  console.error('[AUTH] Failed to get activeProfileId', error);
  return session;  // ❌ activeProfileId がない状態で返される
}
```

**問題**:
- エラーが発生した場合、activeProfileId が undefined のセッションが返される
- これにより、ghost mode チェックが失敗する可能性
- ユーザーが「幽霊でも何でもない不確定状態」になる

**影響**:
- Ghost mode restriction が無視される可能性

**修正方法**:
```typescript
catch (error) {
  console.error('[AUTH] Failed to get activeProfileId', error);
  // activeProfileId がない場合、デフォルトで ghost を設定
  return {
    ...session,
    user: {
      ...session.user,
      activeProfileId: null,  // Ghost as default
    },
  };
}
```

**PR Required**: YES

---

## 🟡 MAJOR ISSUES (デプロイ前に検討)

### 6️⃣ Input Validation が Zod を使用していない

**Location**: `src/app/actions/create-group.ts` (Line 68-96)

```typescript
// ❌ 手動バリデーション
if (!input.name || input.name.trim().length === 0) {
  return {
    success: false,
    error: "Group name is required",
  };
}

if (input.name.length < 3) {
  return {
    success: false,
    error: "Group name must be at least 3 characters",
  };
}
```

**問題**:
- Zod のようなスキーマバリデーションが使用されていない
- 複数の Server Action で同じバリデーション逻辑が重複している可能性
- バリデーションエラーと実行エラーの区別が曖昧

**推奨**:
```typescript
import { z } from "zod";

const createGroupSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
});

export async function createGroupAction(
  input: z.infer<typeof createGroupSchema>,
): Promise<CreateGroupResponse> {
  const validated = createGroupSchema.safeParse(input);
  if (!validated.success) {
    return { success: false, error: validated.error.message };
  }
  // ...
}
```

**PR Required**: OPTIONAL (but recommended for maintainability)

---

### 7️⃣ Rate Limiter の最初の試行カウントが 0 から 1 に変更されたが、テストカバレッジが不十分

**Location**: `src/lib/auth/rate-limiter.ts` (Line 59)

```typescript
export function checkRateLimit(
  key: string,
  maxAttempts: number = RATE_LIMIT_CONFIG.AUTH_MAX_ATTEMPTS,
  windowMs: number = RATE_LIMIT_CONFIG.AUTH_WINDOW_MS,
): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(key, {
      count: 1,  // ✅ 修正: 0 → 1
      resetTime: now + windowMs,
    });
    return true;
  }

  entry.count++;

  if (entry.count > maxAttempts) {
    return false;
  }

  return true;
}
```

**問題**:
- 修正は正しいが、メモリベースのレート制限は本番環境で不安定
- 複数サーバーがある場合、各サーバーが独立したレート制限ストアを持つ
- 分散システムでは Redis を使用すべき

**状況**:
- 現在: メモリベース（ローカル開発向け）
- 本番環境: Vercel または Redis ベースを推奨

**PR Required**: NO (for MVP), but plan Redis integration for production scale

---

## 🟢 GOOD PRACTICES

✅ Deny-by-default パターンが正しく実装されている
✅ Ghost Mode テストが包括的（15/15 passing）
✅ RBAC階層が明確に定義されている
✅ 環境変数バリデーションが厳密

---

## 📋 修正リスト (Priority Order)

| Priority | Issue | Fix Time | Blocker |
|----------|-------|----------|---------|
| 🔴 P0 | isGhostMask() の error handling | 15分 | YES |
| 🔴 P0 | Session callback 型安全性 | 10分 | YES |
| 🔴 P0 | Session callback error handling | 10分 | YES |
| 🟡 P1 | Session callback DB optimization | 30分 | NO |
| 🟡 P2 | Input validation (Zod) | 1時間 | NO |

---

## ✅ Next Steps

1. **CRITICAL 3 issues を修正** (合計 35分)
2. **テストを再実行** - Ghost Mode tests が全てパス確認
3. **本番環境シミュレーション** - DB slow/down をシミュレート
4. **デプロイ前セキュリティレビュー** - OWASP Top 10

**Estimated Time**: 2-3時間

---

**Report Generated**: 2026-03-01 07:42:00 UTC
**Reviewer**: GitHub Copilot (Beast Mode 3.1 - Adversarial Review)
**Status**: 🔴 3 CRITICAL issues must be fixed before production

