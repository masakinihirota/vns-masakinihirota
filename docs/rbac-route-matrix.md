# RBAC ルート・アクセスマトリクス

> **作成日**: 2026-02-28
> **目的**: ルート保護と権限チェックの仕様を一元管理し、実装とテストの「信頼できる唯一の情報源（SSOT）」とする

---

## 📋 概要

このドキュメントは、Next.js 16アプリケーションにおける**ルートベースのアクセス制御（Route-Based Access Control）**の完全な仕様を定義します。

### 基本原則

1. **Deny-by-default（既定は拒否）**: 明示的に許可されない限り、すべてのアクセスは拒否される
2. **階層的権限管理**: プラットフォーム管理権限 > コンテキスト権限 > 関係性権限
3. **二重防御**: Proxy（ルートガード） + Server Action（リソースガード）の両方で権限をチェック
4. **コンテキスト検証**: リソースが属する組織/国のコンテキストに基づいて権限を検証

---

## 🛡️ ルート・アクセスマトリクス（A）

### 凡例

- ✅ **アクセス許可**: そのロールでアクセス可能
- ⚠️ **条件付き許可**: 追加の権限チェック（組織/国の所属など）が必要
- ❌ **アクセス拒否**: そのロールではアクセス不可
- 🌐 **全員許可**: 認証不要、誰でもアクセス可能

### ルート別アクセス権限

| ルート | 説明 | 未認証 | `anonymous` | 認証済み | `platform_admin` | `group_leader` | `nation_leader` |
|--------|------|--------|-------------|----------|------------------|----------------|-----------------|
| `/` | ランディングページ | 🌐 | 🌐 | 🌐 | 🌐 | 🌐 | 🌐 |
| `/faq` | FAQ（静的） | 🌐 | 🌐 | 🌐 | 🌐 | 🌐 | 🌐 |
| `/help` | ヘルプ（静的） | 🌐 | 🌐 | 🌐 | 🌐 | 🌐 | 🌐 |
| `/login` | ログイン | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| `/signup` | サインアップ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| `/home` | ホーム（保護） | ❌ | ⚠️ | ✅ | ✅ | ✅ | ✅ |
| `/admin` | 管理画面 | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| `/organization/create` | 組織作成 | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| `/nation/create` | 国作成 | ❌ | ❌ | ❌ | ✅ | ⚠️ | ✅ |
| `/api/public/*` | 公開API | 🌐 | 🌐 | 🌐 | 🌐 | 🌐 | 🌐 |
| `/api/protected/*` | 保護API | ❌ | ⚠️ | ✅ | ✅ | ✅ | ✅ |

### 詳細な権限ルール

#### 1. 未認証ユーザー（Guest）

- **アクセス可能**: `/`, `/faq`, `/help`, `/login`, `/signup`, `/api/public/*`
- **アクセス不可**: すべての保護されたルート
- **リダイレクト**: 保護されたルートへのアクセス時は `/` へリダイレクト

#### 2. お試し体験（`anonymous`）

- **アクセス可能**: `/home` (制限モード、LocalStorageベース)
- **制限事項**:
  - DB書き込み不可（RLSで拒否）
  - Server Actionは一部のみ実行可能（読み取り専用操作のみ）
  - 組織/国の作成・参加は不可
  - 保存データはLocalStorageのみ
  - 書き込み系APIは `try-catch` で拒否を捕捉し `403` を返却（詳細: `docs/database/trial-db-isolation.md`）
- **移行**: `/home` で「本登録へ移行」ダイアログを表示

#### 3. 認証済みユーザー（`member`, `leader`）

- **アクセス可能**: `/home`, `/organization/create`, `/api/protected/*`
- **アクセス不可**: `/admin`, `/nation/create`（`group_leader` でない場合）
- **組織作成**: 誰でも組織を作成可能（作成者は自動的に `group_leader` になる）

#### 4. プラットフォーム管理者（`platform_admin`）

- **アクセス可能**: **すべてのルート**（制限なし）
- **特権**:
  - 全ユーザー・全組織・全国のデータにアクセス可能
  - RLSポリシーをバイパス（`role = 'platform_admin'` 条件で許可）
  - 管理画面（`/admin`）へのアクセス

#### 5. 組織リーダー（`group_leader`）

- **追加権限**: `/nation/create`（組織リーダーのみが国を作成可能） ⚠️
- **コンテキスト検証**: 自分がリーダーを務める組織に関するリソースのみ編集可能
- **RLS適用**: 所属組織のデータのみ閲覧・編集可能

#### 6. 国リーダー（`nation_leader`）

- **追加権限**: `/nation/create`, 国ポリシーの編集
- **コンテキスト検証**: 自分がリーダーを務める国に関するリソースのみ編集可能
- **RLS適用**: 所属国のデータのみ閲覧・編集可能

---

## 🔒 Proxy（`src/proxy.ts`）での実装

### 既存のルート保護ロジック

現在の `src/proxy.ts` は以下のケースをカバーしています：

1. **ケース1**: ランディングページへのアクセス → 常に許可
2. **ケース1.5**: 静的ページ（FAQ、HELP）へのアクセス → 常に許可
3. **ケース2**: ログイン済み + ログイン・登録系ページにアクセス → `/home` へリダイレクト（逆流防止）
4. **ケース3**: 未ログイン + 保護されたパスにアクセス → `/` へリダイレクト
5. **ケース4**: Admin専用パス + 管理者以外がアクセス → `/` へリダイレクト

### 必要な変更点

#### 変更1: `role === "admin"` → `role === "platform_admin"`

現在のコードでは `session?.user?.role !== "admin"` でチェックしていますが、新しいRBAC型定義では `platform_admin` を使用するため、以下のように変更します：

```typescript
// ❌ 旧コード
if (isAdminPath && session?.user?.role !== "admin") {
  // ...
}

// ✅ 新コード
if (isAdminPath && session?.user?.role !== "platform_admin") {
  // ...
}
```

#### 変更2: `/nation/create` への `group_leader` チェック（将来実装）

`/nation/create` ルートは `group_leader` のみアクセス可能にする必要があります。これは将来的に以下のように実装されます：

```typescript
const isNationCreatePath = pathname === "/nation/create";

// ケース5: Nation作成パス + group_leader 以外がアクセス
if (isNationCreatePath && !hasGroupLeaderRole(session)) {
  log('warn', `[UNAUTHORIZED_NATION_CREATE] User ${session?.user?.email} is not a group_leader`);
  return NextResponse.redirect(new URL(ROUTES.LANDING, request.url));
}
```

ただし、`group_leader` ロールの検証は、コンテキスト（どの組織のリーダーか）を含むため、Server Actionでの詳細なチェックが推奨されます。Proxyでは基本的な権限のみをチェックし、詳細はServer Actionに委ねます。

---

## 🎯 Server Actionでの権限チェック

### 原則

- **Proxyはルートレベルの保護**: 「このルートにアクセスできるか？」
- **Server Actionはリソースレベルの保護**: 「このリソースを操作できるか？」

### 例: 組織編集のServer Action

```typescript
"use server";

import { getSession } from "@/lib/auth/helper";
import { checkGroupRole } from "@/lib/auth/helper";

export async function updateGroupPolicy(groupId: string, policy: object) {
  const session = await getSession();

  // 1. 認証チェック
  if (!session) {
    throw new Error("Unauthorized: Not authenticated");
  }

  // 2. プラットフォーム管理者はすべて許可
  if (session.user.role === "platform_admin") {
    // プラットフォーム管理者は無条件で許可
    return db.groups.update({ id: groupId, policy });
  }

  // 3. コンテキスト検証: この組織のリーダーか？
  const isLeader = await checkGroupRole(session, groupId, "group_leader");
  if (!isLeader) {
    throw new Error("Forbidden: You are not the leader of this group");
  }

  // 4. 実行
  return db.groups.update({ id: groupId, policy });
}
```

---

## 🧪 テストケース

### Proxyテストケース

| テストケース | 説明 | 期待結果 |
|-------------|------|----------|
| `未認証ユーザーが /home にアクセス` | 未認証でホームページにアクセス | `/` へリダイレクト |
| `認証済みユーザーが /login にアクセス` | 認証済みでログインページにアクセス | `/home` へリダイレクト |
| `platform_admin が /admin にアクセス` | プラットフォーム管理者が管理画面にアクセス | アクセス許可 |
| `一般ユーザーが /admin にアクセス` | 一般ユーザーが管理画面にアクセス | `/` へリダイレクト |
| `anonymous が /home にアクセス` | お試しユーザーがホームにアクセス | アクセス許可（制限モード） |

### Server Actionテストケース

| テストケース | 説明 | 期待結果 |
|-------------|------|----------|
| `platform_admin が全組織を閲覧` | プラットフォーム管理者が全組織データを取得 | 成功 |
| `group_leader が自分の組織を編集` | 組織リーダーが自分の組織を編集 | 成功 |
| `group_leader が他組織を編集` | 組織リーダーが他組織を編集しようとする | エラー: Forbidden |
| `member が組織ポリシーを編集` | 一般メンバーが組織ポリシーを編集しようとする | エラー: Forbidden |

---

## 🚀 実装ステップ

### ステップ1: Proxyの修正（今日実施）

- [ ] `session?.user?.role !== "admin"` を `session?.user?.role !== "platform_admin"` に変更

### ステップ2: Server Actionヘルパー関数の作成（月曜日実施）

- [ ] `checkPlatformAdmin(session): boolean`
- [ ] `checkGroupRole(session, groupId, role): boolean`
- [ ] `checkNationRole(session, nationId, role): boolean`
- [ ] `checkRelationship(session, targetUserId, relationship): boolean`

### ステップ3: UIガードコンポーネントの作成（月曜日実施）

- [ ] `<RequireAuth>` コンポーネント（認証済み必須）
- [ ] `<RequireRole role="platform_admin">` コンポーネント
- [ ] `<RequireGroupRole groupId={...} role="group_leader">` コンポーネント

### ステップ4: テストの作成（月曜日実施）

- [ ] Proxyテスト（`src/__tests__/proxy.test.ts`）
- [ ] Server Actionテスト（各ヘルパー関数のテスト）
- [ ] 統合テスト（E2Eシナリオ）

---

## 📚 関連ドキュメント

- [Server Action権限チェック仕様](./rbac-server-action-guard.md)（TODO#3で作成予定）
- [組織/国分離モデル](./rbac-group-nation-separation.md)（TODO#4で作成予定）
- [RBACテスト仕様](./test-specs/rbac-test-spec.md)（TODO#7で作成予定）
- [RoleType/RelationshipType型定義](../src/lib/auth/auth-types.ts)

---

## 💡 Tips

### Deny-by-defaultの実現方法

1. **Proxyでの実装**: デフォルトでリダイレクト、明示的な許可のみ通過
2. **Server Actionでの実装**: 冒頭で認証チェック、失敗時はエラーをthrow
3. **RLSでの実装**: PostgreSQL RLSポリシーで、明示的に許可された行のみ閲覧可能

### コンテキスト検証の重要性

- ルートレベルのチェック（Proxy）だけでは不十分
- リソースが属する組織/国のコンテキストを検証する必要がある
- Server Actionで `groupId` や `nationId` を検証し、ユーザーがその組織/国に所属しているかをチェック

---

**GitHub Copilot より**: ルート保護とServer Action保護の「二重防御」により、たとえProxyをバイパスされても、Server Actionレベルで権限をチェックできます。これにより、防御を多層化し、セキュリティを向上させます。
