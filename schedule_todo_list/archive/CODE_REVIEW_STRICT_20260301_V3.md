# 厳密なコードレビュー v3 - VNS masakinihirota (2026-03-01 第2回)

**レビュー日**: 2026年3月1日 14:00
**レビューモード**: Strict / 敵対的レビュー
**前回レビュー**: CODE_REVIEW_STRICT_20260301_V2.md
**修復完了**: Issue #1, #3, #4, #5, #7 および Issue #2 (スキーマ設計)

---

## 📋 Executive Summary

前回レビューで指摘された6つの重大な問題は修正されましたが、**新たな設計思想（幽霊と仮面）が Server Actions に反映されていない**という致命的な欠陥が発見されました。

### 問題の全体像

| 項目 | ステータス | 説明 |
|------|----------|------|
| **幽霊モード制限** | 🔴 CRITICAL | Server Actions で幽霊チェックが未実装 |
| **スキーマ設計** | ✅ FIXED | users → rootAccounts → userProfiles 3層構造完成 |
| **DB接続管理** | ✅ FIXED | シングルトンパターン実装済み |
| **エラーハンドリング** | ✅ FIXED | RBACError + try-catch 実装済み |
| **テスト不足** | 🟠 MAJOR | 幽霊モードテストが存在しない |
| **activeProfileId 未使用** | 🟡 MINOR | Session に activeProfileId が含まれていない |

**現在の完了度**: 68% (基盤は完成したがビジネスロジックが未適用)

---

## 🔴 CRITICAL ISSUES (致命的な問題)

### Issue #8: 幽霊モード制限が Server Actions に未実装

**Severity**: 🔴 CRITICAL
**Files**:
- `src/app/actions/create-group.ts` (NO GHOST CHECK)
- `src/app/actions/create-nation.ts` (NO GHOST CHECK)
**Impact**: 幽霊状態のユーザーが世界に干渉できる（設計思想の根本的違反）

#### 問題の詳細

VNS の設計思想「幽霊は観測のみ可能、世界への干渉は不可」が Server Actions で実装されていません。

**現在のコード (create-group.ts)**:
```typescript
export async function createGroupAction(input: CreateGroupInput) {
  // ✅ 認証チェックあり
  const session = await getSession();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  // ❌ 幽霊チェックなし！
  // 幽霊状態でもグループ作成が可能になってしまう

  // グループ作成処理...
  const result = await createGroup({...});
  return { success: true, data: result };
}
```

**問題の深刻度**:
- 幽霊は「他者との相互作用」を禁止されているはずが、グループ作成・国作成ができてしまう
- 組織参加時の仮面切り替え UX が機能しない（幽霊のまま参加できるため）
- データの整合性問題: 幽霊が `groupMembers` に登録される

#### 正しい実装

```typescript
import { checkInteractionAllowed } from "@/lib/auth/rbac-helper";

export async function createGroupAction(input: CreateGroupInput) {
  // 1. 認証チェック
  const session = await getSession();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  // 2. 幽霊チェック（NEW!）
  const canInteract = await checkInteractionAllowed(session);
  if (!canInteract) {
    return {
      success: false,
      error: "GHOST_MASK_INTERACTION_DENIED",
      message: "観測者は組織の作成ができません。仮面を被ってください。",
    };
  }

  // 3. グループ作成処理
  const result = await createGroup({...});
  return { success: true, data: result };
}
```

#### 影響範囲の調査

**幽霊チェックが必要な Server Actions**:
- ✅ `isGhostMask()`, `checkInteractionAllowed()` は実装済み (rbac-helper.ts)
- ❌ `create-group.ts`: グループ作成
- ❌ `create-nation.ts`: 国作成
- ❌ 未実装の Server Actions:
  - 作品評価 (tierRating 付与)
  - コメント投稿
  - グループ参加申請
  - 国参加申請
  - リレーションシップ作成 (follow, friend など)

#### 修復計画

**Phase 1: 既存 Server Actions への適用** (優先度: 🔴 CRITICAL)
```bash
# checkInteractionAllowed() を追加
- src/app/actions/create-group.ts
- src/app/actions/create-nation.ts
```

**Phase 2: 新規 Server Actions の実装** (優先度: 🟠 MAJOR)
```bash
# 幽霊チェックを含めて作成
- src/app/actions/submit-rating.ts (作品評価)
- src/app/actions/post-comment.ts (コメント)
- src/app/actions/join-group.ts (グループ参加)
- src/app/actions/join-nation.ts (国参加)
- src/app/actions/create-relationship.ts (フォロー等)
```

**Phase 3: テストの追加** (優先度: 🟠 MAJOR)
```typescript
// src/app/actions/__tests__/ghost-restrictions.test.ts
describe('Ghost Mask Restrictions', () => {
  it('should deny group creation when in ghost mode', async () => {
    // Mock session with ghost mask
    const result = await createGroupAction({ name: 'Test Group' });
    expect(result.success).toBe(false);
    expect(result.error).toBe('GHOST_MASK_INTERACTION_DENIED');
  });

  it('should allow group creation when in persona mode', async () => {
    // Mock session with persona mask
    const result = await createGroupAction({ name: 'Test Group' });
    expect(result.success).toBe(true);
  });
});
```

---

## 🟡 MINOR ISSUES (軽微な問題)

### Issue #9: Session に activeProfileId が未設定

**Severity**: 🟡 MINOR
**File**: `src/lib/auth/helper.ts`, `src/lib/auth.ts`
**Impact**: 仮面切り替え機能が実装できない（将来的な機能拡張の障害）

#### 問題の詳細

`rootAccounts.activeProfileId` がスキーマに追加されましたが、Session オブジェクトに含まれていません。

**現在の Session 型**:
```typescript
type AuthSession = {
  user: {
    id: string;        // users.id
    email: string;
    role: string;
    // ❌ activeProfileId がない
  };
  session: {
    token: string;
    expiresAt: Date;
  };
};
```

**正しい Session 型**:
```typescript
type AuthSession = {
  user: {
    id: string;
    email: string;
    role: string;
    activeProfileId: string; // ✅ 現在被っている仮面
  };
  session: {
    token: string;
    expiresAt: Date;
  };
};
```

#### 修復方法

Better Auth の session callback で activeProfileId を追加:
```typescript
// src/lib/auth.ts
export const auth = betterAuth({
  // ...
  session: {
    // ...
    callbacks: {
      async session({ session, user }) {
        // rootAccount から activeProfileId を取得
        const rootAccount = await db
          .select({ activeProfileId: rootAccounts.activeProfileId })
          .from(rootAccounts)
          .where(eq(rootAccounts.authUserId, user.id))
          .limit(1)
          .then(rows => rows[0]);

        return {
          ...session,
          user: {
            ...session.user,
            activeProfileId: rootAccount?.activeProfileId ?? null,
          },
        };
      },
    },
  },
});
```

---

## 🟠 MAJOR ISSUES (重大な問題)

### Issue #10: 幽霊モードのテストが存在しない

**Severity**: 🟠 MAJOR
**File**: `src/lib/auth/__tests__/rbac-helper.test.ts`
**Impact**: 幽霊制限の動作が保証されていない

#### 問題の詳細

`isGhostMask()` と `checkInteractionAllowed()` は実装されていますが、テストが存在しません。

**テストすべき項目**:
```typescript
describe('Ghost Mask Functionality', () => {
  describe('isGhostMask()', () => {
    it('should return true for ghost mask', async () => {
      const session = createMockSession({ maskCategory: 'ghost' });
      const result = await isGhostMask(session);
      expect(result).toBe(true);
    });

    it('should return false for persona mask', async () => {
      const session = createMockSession({ maskCategory: 'persona' });
      const result = await isGhostMask(session);
      expect(result).toBe(false);
    });

    it('should return false when session is null', async () => {
      const result = await isGhostMask(null);
      expect(result).toBe(false);
    });
  });

  describe('checkInteractionAllowed()', () => {
    it('should deny interaction for ghost mask', async () => {
      const session = createMockSession({ maskCategory: 'ghost' });
      const result = await checkInteractionAllowed(session);
      expect(result).toBe(false);
    });

    it('should allow interaction for persona mask', async () => {
      const session = createMockSession({ maskCategory: 'persona' });
      const result = await checkInteractionAllowed(session);
      expect(result).toBe(true);
    });

    it('should allow all interactions for platform_admin', async () => {
      const session = createMockSession({
        maskCategory: 'ghost',
        role: 'platform_admin',
      });
      const result = await checkInteractionAllowed(session);
      expect(result).toBe(true); // admin は幽霊でも操作可能
    });
  });
});
```

---

## 🟢 POSITIVE FINDINGS (良い実装)

### ✅ スキーマ設計が正しく修正された

- `users` テーブル: Better Auth 標準フィールドのみ
- `rootAccounts` テーブル: activeProfileId を含む
- `userProfiles` テーブル: maskCategory, isDefault, points, level を含む
- `pointTransactions` テーブル: userProfileId ベースに変更

### ✅ RBAC ヘルパーが堅牢

- `isGhostMask()`: 幽霊判定関数が実装済み
- `checkInteractionAllowed()`: インタラクション許可チェック実装済み
- エラーコード `GHOST_MASK_INTERACTION_DENIED` 定義済み

### ✅ エラーハンドリングが包括的

- `RBACError` クラス with context
- try-catch ブロック完備
- 適切なログ出力

---

## 📊 修復優先度マトリックス

| Issue ID | Severity | Impact | Effort | Priority |
|----------|----------|--------|--------|----------|
| #8 | 🔴 CRITICAL | 設計思想違反 | 2時間 | **P0** |
| #10 | 🟠 MAJOR | テスト不足 | 3時間 | **P1** |
| #9 | 🟡 MINOR | 機能拡張阻害 | 1時間 | **P2** |

---

## 🎯 次回アクション

### Immediate (今すぐ)
1. ✅ **Issue #8**: create-group.ts, create-nation.ts に幽霊チェック追加
2. ✅ **Issue #10**: 幽霊モードテスト実装

### Short-term (1週間以内)
3. **Issue #9**: Session に activeProfileId 追加
4. 新規 Server Actions 実装（作品評価、コメント等）with 幽霊チェック

### Long-term (1ヶ月以内)
5. 仮面切り替え UI 実装
6. 幽霊状態での UX 最適化（「仮面を被る」誘導）

---

## 📝 結論

**本番環境への展開**: 🔴 **不可**
**理由**: VNS の根幹である「幽霊と仮面」の制限が Server Actions に実装されていない

**修復後の展開可否**: 🟢 **可能** (Issue #8 修復後)

---

**レビュアー**: Beast Mode 3.1 (日本語版)
**次回レビュー予定**: 2026年3月1日 16:00 (Issue #8 修復後)
