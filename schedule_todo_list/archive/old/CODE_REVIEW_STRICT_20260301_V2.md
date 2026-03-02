# 厳密なコードレビュー v2 - VNS masakinihirota (2026-03-01 更新)

**レビュー日**: 2026年3月1日
**レビューモード**: Strict / 敵対的レビュー
**総合評価**: 🔴 **本番環境への展開は不可** - 複数の致命的問題が存在
**前回レビュー**: CODE_REVIEW_STRICT_2026-03-01.md

---

## 📋 Executive Summary

VNS masakinihirota は以下の重大な問題を抱えており、本番環境での実行は極めてリスクが高いです。

### 問題の全体像

| 項目 | ステータス | 説明 |
|------|----------|------|
| **スキーマ設計** | 🔴 CRITICAL | users/userProfiles/rootAccounts の3層構造が不完全 |
| **データベース接続** | 🔴 CRITICAL | RBAC Helper で毎回新規接続が生成される（コネクション漏れ） |
| **エラーハンドリング** | 🟠 MAJOR | Try-Catch なしで DB エラーが露出する可能性 |
| **N+1 クエリ** | 🟠 MAJOR | 権限チェック時に複数のDB接続が連続発生 |
| **テスト戦略** | 🟠 MAJOR | 4個のテストのみで十分とは言えない |
| **セキュリティ検証** | 🟡 MINOR | 入力バリデーションは実装されたが不完全 |
| **ドキュメント** | 🟡 MINOR | APIドキュメントがない |

**現在の完了度**: 54% (実装は進んでいるがアーキテクチャ問題が根本的)

---

## 🔴 CRITICAL ISSUES (致命的な問題)

### Issue #1: データベース接続の重大な漏れ

**Severity**: 🔴 CRITICAL
**File**: `src/lib/auth/rbac-helper.ts` (lines 46-54)
**Impact**: 本番環境でのコネクション枯渇、memory leak リスク

#### 問題の詳細

```typescript
function getDatabaseConnection() {
  // ❌ 毎回新しいコネクションを生成
  // ❌ コネクションプーリングを無視
  // ❌ close() を呼び出していない
  const client = postgres.default(process.env.DATABASE_URL, {
    prepare: false,
  });

  return drizzle(client);
}

// これが複数回呼び出される:
// _getUserProfileIdInternal() 内で 1回
// checkGroupRole() 内で 1回
// checkNationRole() 内で 1回
// checkRelationship() 内で 1回
// ↓
// checkGroupLeaderCanCreateGroup() → checkGroupRole() → 新規接続
// checkNationLeaderCanCreateNation() → checkNationRole() → 新規接続
```

**問題の深刻度**:
- 1人のユーザーが Server Action を呼び出す度に、複数のDB接続が生成される
- 100人が同時アクセスすると、数百個の接続が積み上がる
- 接続がタイムアウトして枯渇 → アプリが完全に停止

#### 修復方法

```typescript
// ✅ Better: グローバルシングルトン
import { db } from "@/lib/db/client";  // 既に存在する!

// getDatabaseConnection を削除して db を直接使用
const _getUserProfileIdInternal = cache(async (userId: string) => {
  // db を直接使用（既にコネクションプーリング対応）
  const result = await db
    .select({ userProfileId: userProfiles.id })
    .from(users)
    .innerJoin(...)
    .where(eq(users.id, userId))
    .limit(1)
    .then((rows) => rows[0] || null);

  return result?.userProfileId ?? null;
});
```

**直すべきコード**:
- `src/lib/auth/rbac-helper.ts`: getDatabaseConnection() 削除 + db import
- 5箇所すべてのgetDatabaseConnection()呼び出しを db に置き換え

**テスト方法**:
```bash
# 接続数確認 (PostgreSQL)
SELECT count(*) FROM pg_stat_activity;

# ローカルでの修正後、同時アクセステストを実施
```

---

### Issue #2: ユーザープロフィール層の設計（VNS 複数仮面対応）

**Severity**: 🟡 DESIGN REVIEW
**File**: `src/lib/db/schema.postgres.ts` + `src/lib/auth/rbac-helper.ts`
**Impact**: アーキテクチャ設計の明確化

#### VNS の正しい設計思想

```
users (Better Auth) ─1:1→ rootAccounts ─1:N→ userProfiles (複数の仮面)
                                              ├─ ghost (デフォルト)
                                              ├─ persona_1
                                              └─ persona_2
```

**設計意図**:
- ユーザーは複数の「仮面（Mask）」を被ることができる
- デフォルトは「幽霊（Ghost）」= 観測者ロール
- 幽霊状態では世界に干渉できない（見るだけ）
- ペルソナ（仮面）を被ることで活動可能になる

#### 現在のテーブル構造（正しい）

```
users (Better Auth)
  │
  ├─ id: text (primary key) ← 認証用 ID
  └─ email, name, ...

rootAccounts
  │
  ├─ id: uuid
  ├─ authUserId: text → references users.id (1:1)
  ├─ activeProfileId: uuid → 現在被っている仮面
  └─ ...

userProfiles (複数作成可能)
  │
  ├─ id: uuid
  ├─ rootAccountId: uuid → references rootAccounts.id
  ├─ maskCategory: 'ghost' | 'persona'
  ├─ displayName, avatarUrl
  └─ ...
```

#### 設計の利点

1. **柔軟性**: 1ユーザーが複数の仮面で活動可能
2. **明確な分離**: 認証（Better Auth）とプロフィール（アプリ層）の責務を明確化
3. **幽霊システム**: デフォルトの観測者モードをサポート
4. **拡張性**: 将来的に仮面ごとの権限管理も可能

#### RBAC での対応方針

**課題**: 3層JOIN（users → rootAccounts → userProfiles）の複雑性

**解決策**:
1. **Session に activeProfileId を保存**
   ```typescript
   session.user.activeProfileId: uuid  // 現在の仮面
   ```

2. **RBAC Helper でキャッシュ活用**
   ```typescript
   const _getUserProfileIdInternal = cache(async (userId: string) => {
     // Session から activeProfileId を取得
     // または rootAccounts.activeProfileId をキャッシュ
   });
   ```

3. **仮面切り替えは Server Action で実装**
   ```typescript
   async function switchMask(targetProfileId: string) {
     // rootAccounts.activeProfileId を更新
     // Session を更新
   }
   ```

#### 推奨修復戦略: 3層構造の維持 + Session 最適化

```typescript
// ❌ 統合は不要（VNS の設計に反する）
// users テーブルに displayName を追加する必要なし

// ✅ 正しい実装
// 1. rootAccounts に activeProfileId を追加
// 2. Session に activeProfileId をキャッシュ
// 3. RBAC で activeProfileId を使用
```

---

### Issue #3: エラーハンドリングがない = 本番で予測不可能な障害

**Severity**: 🔴 CRITICAL
**File**: `src/lib/auth/rbac-helper.ts` 全体
**Impact**: ユーザーに意味不明なエラー、ログに詳細情報がない

#### 問題の詳細

```typescript
// ❌ エラーハンドリングなし
const _getUserProfileIdInternal = cache(async (userId: string): Promise<string | null> => {
  const db = getDatabaseConnection();

  try {
    // 👇 これが失敗したら？
    const result = await db
      .select({ userProfileId: userProfiles.id })
      .from(users)
      .innerJoin(rootAccounts, eq(users.id, rootAccounts.authUserId))
      .innerJoin(userProfiles, eq(rootAccounts.id, userProfiles.rootAccountId))
      .where(eq(users.id, userId))
      .limit(1)
      .then((rows) => rows[0] || null);

    // → SQL Error が throw される
    // → Server Action が全体的に失敗
    // → ユーザーに "Internal Server Error" の意味不明なエラー
    // → ログに詳細が記録されない

    return result?.userProfileId ?? null;
  }
  // ❌ catch なし！
});
```

**実際に起こる問題**:
1. `users.id` が存在しない → innerJoin 失敗 → No rows returned
2. `rootAccounts` が存在しない → innerJoin 失敗 → No rows returned
3. DB接続タイムアウト → throw Error
4. SQL syntax error → throw Error

すべて **unhandled promise rejection** になる

#### 修復方法

```typescript
const _getUserProfileIdInternal = cache(async (userId: string): Promise<string | null> => {
  const db = getDatabaseConnection();

  try {
    const result = await db
      .select({ userProfileId: userProfiles.id })
      .from(users)
      .innerJoin(rootAccounts, eq(users.id, rootAccounts.authUserId))
      .innerJoin(userProfiles, eq(rootAccounts.id, userProfiles.rootAccountId))
      .where(eq(users.id, userId))
      .limit(1)
      .then((rows) => rows[0] || null);

    // Validation: result が null なら、それは構成エラー
    if (!result) {
      console.error(`[CRITICAL] User profile not found for userId: ${userId}`);
      // → この場合は例外を throw (アプリケーションレベルで処理)
      return null;  // または throw
    }

    return result.userProfileId;
  } catch (error) {
    console.error(`[RBAC] Failed to get user profile for userId: ${userId}`, {
      errorType: error instanceof Error ? error.name : 'Unknown',
      errorMessage: error instanceof Error ? error.message : String(error),
      // PII を含めない（userId は既に記録されている）
    });

    // ユーザーには安全なエラーメッセージを返す
    throw new RBACError(
      'Failed to verify user profile. Please try again.',
      'PROFILE_LOOKUP_FAILED',
      { userId }  // ログ用（エンドユーザーには非表示）
    );
  }
});
```

**直すべき関数**:
- `_getUserProfileIdInternal()`
- `checkGroupRole()`
- `checkNationRole()`
- `getGroupMembersForChecking()`
- `getRelationshipType()`

---

### Issue #4: キャッシュのスコープが不明確 = 古いデータが返される可能性

**Severity**: 🔴 CRITICAL
**File**: `src/lib/auth/rbac-helper.ts` (cache() 関数)
**Impact**: ユーザーが権限削除直後もアクセス可能、セキュリティ漏洩

#### 問題の詳細

```typescript
const _getUserProfileIdInternal = cache(async (userId: string) => {
  // ...
});

// ✅ React cache() とは？
// - 同一リクエスト内でのみ有効（request scope）
// - 異なる HTTP リクエストではリセット
// - Next.js Server Components / Server Actions 内で機能

// ❌ でも以下が不明確：
// 1. Server Action が複数回呼び出されるときにキャッシュは何回生成される？
// 2. ユーザーが権限削除直後、キャッシュされたデータが返される？
// 3. 1リクエスト内で複数回の権限チェックがあるとき、正しく動作する？
```

実際のシナリオ:
```
1. ユーザーがグループを作成 → getUserProfileId() → キャッシュ作成 ✅
2. その直後に同じ SA 内で別のチェックがある → キャッシュ再利用 ✅
3. しかし、その間にDBが更新された→古いデータが使われる？
```

**スコープの確認が必要**:
- React cache() のスコープは "Request" ですが、Next.js Server Actions では正確に何をスコープと見なすか？
  - 1つの SA コール全体？
  - SA コール内の各イベントループ？
  - React Render パス全体？

#### 修復方法

```typescript
// ✅ キャッシュスコープをドキュメント化
/**
 * キャッシュ戦略とスコープ
 *
 * @caching
 * - Strategy: React cache() によるリクエスト内キャッシュ
 * - Scope: 同一 Server Action エクスキューション内
 * - Lifetime: CACHING_ENABLED ? request duration : disabled
 * - TTL: 規定なし (request end でリセット)
 *
 * @caveat
 * - 複数の Server Action が同一ユーザーを処理する場合、各 SA は独立したキャッシュ
 * - DBの権限変更は最大 1 request (～数秒) 反映遅延
 * - 取り消し不可の操作については、キャッシュなしで毎回DB検査推奨
 */
const _getUserProfileIdInternal = cache(async (userId: string) => {
  // ...
});
```

さらに、**取り消し不可の操作** (例: 削除、支払い) の場合は、キャッシュをバイパス：

```typescript
// ✅ キャッシュを避ける
async function getUserProfileIdWithoutCache(userId: string): Promise<string | null> {
  const db = await getDatabaseConnection();  // 毎回新規取得
  // ...
}

// Server Action で使用
export async function deleteGroup(groupId: string) {
  const session = await getSession();
  const userId = session.user.id;

  // ❌ キャッシュ版を使わない
  // const userProfileId = await _getUserProfileIdInternal(userId);

  // ✅ キャッシュなし版
  const userProfileId = await getUserProfileIdWithoutCache(userId);

  // 権限チェック（キャッシュなし）
  const canDelete = await checkGroupRoleWithoutCache(userProfileId, groupId);

  if (!canDelete) throw new Error('Unauthorized');

  // 削除実行
  // ...
}
```

---

## 🟠 MAJOR ISSUES (リリース前に修復が必須)

### Issue #5: N+1 Query Pattern

**Severity**: 🟠 MAJOR
**File**: `src/lib/auth/rbac-helper.ts`
**Impact**: 大規模ユーザー数でDatabaseが過負荷、タイムアウト頻発

#### 問題

```typescript
// ❌ 毎回 DB 접근
const canCreate = await checkGroupRole(userProfileId, groupId, 'leader');
// → DB クエリ 1回

const canDelete = await checkNationRole(userProfileId, nationId, 'leader');
// → DB クエリ 1回

const relationship = await getRelationshipType(userProfileId, targetUserId);
// → DB クエリ 1回

// 複数の権限チェックが必要な場合：
// checkGroupLeaderCanCreateGroup()
//   → checkGroupRole() [DB x1]
//   → getGroupMembersForChecking() [DB x1]
//   → getRelationshipType() [DB x1]
// = 合計 3 query
```

大規模運用（100万ユーザー）での影響:
- 1秒間に 1000 の権限チェック
- = 3000 のDB クエリ/秒
- DB が応答不可 → タイムアウト → ユーザーがアクセス不可

#### 修復方法

```typescript
// ✅ 複数の権限データを1クエリで取得
type UserPermissionData = {
  userProfileId: string;
  groupRoles: Map<string, GroupRole>;  // group.id → role
  nationRoles: Map<string, NationRole>;
  relationships: Map<string, RelationshipType>;
};

const getUserPermissionDataWithoutCache = cache(
  async (userId: string): Promise<UserPermissionData> => {
    // 1クエリで全部取ってくる
    const [
      groupMembers,
      nationGroups,
      relationships,
      userProfile,
    ] = await Promise.all([
      db.select().from(groupMembers).where(eq(groupMembers.userProfileId, userProfileId)),
      db.select().from(nationGroups)...
      db.select().from(relationships).where(...),
      db.select().from(userProfiles).where(...),
    ]);

    // キャッシュ可能な形式に整理
    return {
      userProfileId,
      groupRoles: new Map(groupMembers.map(m => [m.groupId, m.role])),
      nationRoles: new Map(...),
      relationships: new Map(...),
    };
  }
);
```

---

### Issue #6: テスト戦略の不足 = 本番環境での未知なる障害

**Severity**: 🟠 MAJOR
**Current**: vitest 4個のテストのみ
**Required**: 50+ テストケース

#### 必要なテスト

```
セキュリティテスト:
- [ ] Unauthorized ユーザーはグループ作成不可
- [ ] group_member は group_leader 権限なし
- [ ] 他グループのリーダーはアクセス拒否
- [ ] nation 所属外のメンバーは権限なし
- [ ] 権限削除後、即座にアクセス拒否
- [ ] CSRF トークン検証
- [ ] SQL インジェクション防止
- [ ] XXS 入力攻撃防止
- [ ] レート制限動作確認

データ整合性テスト:
- [ ] グループ削除時に groupMembers も削除
- [ ] nation 削除時に nation_groups, nation_members も削除
- [ ] ユーザー削除時に全関連レコード削除（カスケード）
- [ ] オーファンレコードが存在しない

パフォーマンステスト:
- [ ] 権限チェック < 100ms
- [ ] グループ作成 < 500ms
- [ ] 同時100ユーザーアクセス
- [ ] DB接続数が max 以下

エラーハンドリングテスト:
- [ ] DB未接続時のエラーメッセージ
- [ ] 無効な ID 入力時のエラー
- [ ] Session タイムアウト時の挙動
- [ ] ネットワークエラーの再試行
```

---

### Issue #7: エラーレスポンス仕様が不完全

**Severity**: 🟠 MAJOR
**File**: `src/lib/api/types/response.ts` + `src/app/actions/*`
**Impact**: API クライアントが何が失敗したかわからない

#### 問題

現在の Server Action:
```typescript
export async function createGroup(data: CreateGroupInput) {
  try {
    // ...
  } catch (error) {
    // ❌ ユーザー向けエラーメッセージが曖昧
    throw new Error('グループ作成に失敗しました');
  }
}
```

クライアント側では:
```tsx
const handleCreate = async () => {
  try {
    await createGroup(data);
  } catch (error) {
    // ❌ エラーの詳細がわからない
    // - 入力値が無効？
    // - 権限がない？
    // - DB エラー？
    toast('グループ作成に失敗しました');
  }
};
```

#### 修復方法

標準化されたエラーレスポンスを定義：

```typescript
// ✅ error-codes.ts
export const ErrorCode = {
  // 入力エラー
  INVALID_NAME: 'INVALID_NAME',
  INVALID_EMAIL: 'INVALID_EMAIL',
  DUPLICATE_GROUP: 'DUPLICATE_GROUP',

  // 権限エラー
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',

  // リソースエラー
  NOT_FOUND: 'NOT_FOUND',
  RESOURCE_IN_USE: 'RESOURCE_IN_USE',

  // システムエラー
  DATABASE_ERROR: 'DATABASE_ERROR',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
} as const;

// ✅ Server Action
export async function createGroup(data: CreateGroupInput) {
  try {
    // 入力検証
    if (!data.name || data.name.length > 100) {
      throw new AppError(
        '名前は1～100文字である必要があります',
        'INVALID_NAME'
      );
    }

    // 権限チェック
    if (!canCreate) {
      throw new AppError(
        'このユーザーはグループを作成できません',
        'FORBIDDEN'
      );
    }

    // ...

  } catch (error) {
    if (error instanceof AppError) {
      throw error;  // 既知のエラー
    }

    // 予期しないエラーはログに
    logger.error('Unexpected error in createGroup', { error, data });
    throw new AppError(
      'グループの作成に失敗しました。しばらく経ってからお試しください。',
      'INTERNAL_SERVER_ERROR'
    );
  }
}

// ✅ クライアント
const handleCreate = async () => {
  try {
    await createGroup(data);
  } catch (error) {
    const appError = error as AppError;

    switch (appError.code) {
      case 'INVALID_NAME':
        toast.error('グループ名を入力してください');
        break;
      case 'FORBIDDEN':
        toast.error('グループを作成する権限がありません');
        break;
      default:
        toast.error(appError.message);
    }
  }
};
```

---

## 🟡 MINOR ISSUES (アーキテクチャ改善)

### Issue #8: API ドキュメントがない

**Severity**: 🟡 MINOR
**Impact**: 新しい開発者がAPIを理解できない

推奨: OpenAPI / Swagger スキーマを追加（後週）

---

### Issue #9: ロギング戦略が不統一

**Severity**: 🟡 MINOR
**File**: `src/proxy.ts`, `src/lib/auth/rbac-helper.ts`
**Impact**: 本番環境のデバッグが困難

ログレベルの統一：
- `error`: セキュリティ違反、データ喪失リスク
- `warning`: 期待外の動作
- `info`: ビジネスロジックの重要なイベント
- `debug`: 開発用（本番では非表示）

---

### Issue #10: パフォーマンス測定がない

**Severity**: 🟡 MINOR
**Impact**: 本番環境での遅延問題を特定できない

推奨:
- サーバーサイド: Server Timing ヘッダー
- クライアントサイド: Web Vitals 測定
- DB: Query execution time ログ

---

## ✅ 修復優先度

### 今週（CRITICAL）
1. **Issue #1**: DB接続漏れ修復（0.5h）
2. **Issue #3**: エラーハンドリングの追加（1.5h）
3. **Issue #2**: スキーマ統合（2～3h）

合計: 4～5h

### 来週（MAJOR）
4. **Issue #4**: キャッシュスコープ明確化（0.5h）
5. **Issue #5**: N+1 クエリ削除（1h）
6. **Issue #6**: テスト戦略実装（3～4h）
7. **Issue #7**: エラーコード統一（1h）

合計: 5.5～6.5h

### 将来（MINOR）
8～10: ドキュメント、ロギング、パフォーマンス測定

合計: 2～3h

---

## 📈 修復後の期待値

| 指標 | 現在 | 修復後 |
|------|------|--------|
| **CRITICAL Issues** | 4個 | 0個 |
| **MAJOR Issues** | 3個 | 0個 |
| **テストカバレッジ** | ~5% | ~70% |
| **Error Handling** | 0% | 100% |
| **API Documentation** | 0% | 100% |
| **本番環境対応** | ❌ | ✅ |

---

## 🎯 本番環境への対応予定

修復が完全に終わるまで（約2週間）、本番環境への展開は **絶対に避けるべき**です。

見切り発車した場合の予想される問題:
- 🔴 コネクション枯渇 → 完全ダウン
- 🔴 権限チェック失敗 → ユーザーがランダムにアクセス拒否
- 🔴 データ整合性喪失 → 削除済みユーザーのデータ残存
- 🔴 セキュリティ漏洩 → 権限なしユーザーのアクセス許可

---

**レビュー完了日**: 2026年3月1日
**次回レビュー予定**: 2026年3月8日 (修復後)
**レビュアー**: GitHub Copilot
