# RBAC テスト仕様書

> **作成日**: 2026-02-28
> **目的**: RBAC実装の品質を担保するため、テスト駆動開発（TDD）でのテスト仕様を事前に定義する

---

## 📋 概要

このドキュメントは、**RBAC（Role-Based Access Control）**のテスト仕様を定義します。テスト駆動開発（TDD）のRed-Green-Refactorサイクルに従い、実装前にテストケースを明確にします。

---

## 🎯 テスト戦略

### テストの種類

| テスト種類 | 配置場所 | 目的 |
|-----------|---------|------|
| **システムテスト** | `src/lib/auth/__tests__/` | 認証ヘルパー関数のテスト |
| **コンポーネントテスト** | コロケーション（`page.test.tsx` を同階層に配置） | UIコンポーネントのテスト |
| **統合テスト** | `src/__tests__/integration/` | E2Eシナリオ（認証フロー、権限チェックなど） |

### TDD（テスト駆動開発）サイクル

1. **Red**: テストを書いて失敗させる
2. **Green**: 最小限の実装でテストを通す
3. **Refactor**: コードを改善する

---

## 🔴 Deny-by-defaultテストケース

### 原則

- **すべてのアクセスは既定で拒否される**
- 明示的に許可された場合のみアクセス可能

### テストケース一覧

| ID | テストケース | 入力 | 期待結果 | 実装ファイル |
|----|-------------|------|----------|-------------|
| D1 | 未認証ユーザーは全ての保護ルートでアクセス拒否される | セッション: `null`, パス: `/home` | リダイレクト: `/` | `src/__tests__/proxy.test.ts` |
| D2 | `platform_admin` でないユーザーは `/admin` にアクセス拒否される | セッション: `{ role: "member" }`, パス: `/admin` | リダイレクト: `/` | `src/__tests__/proxy.test.ts` |
| D3 | `group_leader` でないユーザーは `/nation/create` にアクセス拒否される | セッション: `{ role: "member" }`, パス: `/nation/create` | リダイレクト: `/` | `src/__tests__/proxy.test.ts` |
| D4 | 未認証でServer Actionを実行すると拒否される | セッション: `null`, Action: `updateGroupPolicy()` | エラー: `Unauthorized: Not authenticated` | `src/lib/auth/__tests__/helper.test.ts` |
| D5 | 権限のないロールでServer Actionを実行すると拒否される | セッション: `{ role: "member" }`, Action: `updateGroupPolicy()` | エラー: `Forbidden: You are not the leader of this group` | `src/lib/auth/__tests__/helper.test.ts` |

### テストコード例（D1）

```typescript
import { describe, it, expect } from "vitest";
import { proxy } from "@/src/proxy";
import { NextRequest } from "next/server";

describe("Deny-by-default: 未認証ユーザー", () => {
  it("未認証ユーザーは /home にアクセス拒否される", async () => {
    const request = new NextRequest("http://localhost:3000/home");

    // セッションをnullに設定（未認証）
    // モック: Better Auth の getSession() が null を返す

    const response = await proxy(request);

    expect(response.status).toBe(307); // リダイレクト
    expect(response.headers.get("location")).toBe("/"); // ランディングページへ
  });
});
```

---

## 🧩 コンテキスト検証テストケース

### 原則

- **リソースが属する組織/国のコンテキストを検証する**
- 組織Aのリーダーが組織Bのリソースにアクセスすることを防ぐ

### テストケース一覧

| ID | テストケース | 入力 | 期待結果 | 実装ファイル |
|----|-------------|------|----------|-------------|
| C1 | 組織Aのリーダーが組織Bのリソースにアクセス拒否される | セッション: `{ userId: "user-1" }`, groupId: `"group-B"` | エラー: `Forbidden: You are not the leader of this group` | `src/lib/auth/__tests__/helper.test.ts` |
| C2 | 国Aのメンバーが国Bのポリシー更新を拒否される | セッション: `{ userId: "user-1" }`, nationId: `"nation-B"` | エラー: `Forbidden: You are not the leader of this nation` | `src/lib/auth/__tests__/helper.test.ts` |
| C3 | 組織メンバーが自分の組織のデータを閲覧できる | セッション: `{ userId: "user-1" }`, groupId: `"group-A"` | 成功: データ取得 | `src/lib/auth/__tests__/helper.test.ts` |
| C4 | 国メンバーが自分の国のデータを閲覧できる | セッション: `{ userId: "user-1" }`, nationId: `"nation-A"` | 成功: データ取得 | `src/lib/auth/__tests__/helper.test.ts` |

### テストコード例（C1）

```typescript
import { describe, it, expect } from "vitest";
import { checkGroupRole } from "@/lib/auth/helper";

describe("コンテキスト検証: 組織リーダー", () => {
  it("組織Aのリーダーが組織Bのリソースにアクセス拒否される", async () => {
    const session = {
      user: { id: "user-1", role: "group_leader" },
    };

    // user-1 は group-A のリーダーだが、group-B のリーダーではない
    const isLeaderOfGroupB = await checkGroupRole(session, "group-B", "group_leader");

    expect(isLeaderOfGroupB).toBe(false);
  });

  it("組織Aのリーダーが組織Aのリソースにアクセスできる", async () => {
    const session = {
      user: { id: "user-1", role: "group_leader" },
    };

    // user-1 は group-A のリーダー
    const isLeaderOfGroupA = await checkGroupRole(session, "group-A", "group_leader");

    expect(isLeaderOfGroupA).toBe(true);
  });
});
```

---

## 🔗 関係性境界テストケース

### 原則

- **ユーザー間の関係性に基づいてアクセス権を制御する**
- `follow` < `friend` < `partner` の順にアクセス範囲が広がる

### テストケース一覧

| ID | テストケース | 入力 | 期待結果 | 実装ファイル |
|----|-------------|------|----------|-------------|
| R1 | `follow` 関係のユーザーは詳細な価値観マップを閲覧拒否される | セッション: `{ userId: "user-1" }`, targetUserId: `"user-2"`, relationship: `"follow"` | 閲覧範囲: 基本プロフィールのみ | `src/lib/auth/__tests__/helper.test.ts` |
| R2 | `friend` 関係のユーザーは進行中の非公開リストを閲覧できる | セッション: `{ userId: "user-1" }`, targetUserId: `"user-2"`, relationship: `"friend"` | 閲覧範囲: 非公開リスト | `src/lib/auth/__tests__/helper.test.ts` |
| R3 | `partner` 関係のユーザーはすべてのデータを閲覧できる | セッション: `{ userId: "user-1" }`, targetUserId: `"user-2"`, relationship: `"partner"` | 閲覧範囲: すべて | `src/lib/auth/__tests__/helper.test.ts` |
| R4 | `unknown` 関係のユーザーは基本プロフィールのみ閲覧できる | セッション: `{ userId: "user-1" }`, targetUserId: `"user-3"`, relationship: `null` | 閲覧範囲: 基本プロフィールのみ | `src/lib/auth/__tests__/helper.test.ts` |
| R5 | 自分自身のデータは常にすべて閲覧できる | セッション: `{ userId: "user-1" }`, targetUserId: `"user-1"` | 閲覧範囲: すべて | `src/lib/auth/__tests__/helper.test.ts` |

### テストコード例（R1, R2）

```typescript
import { describe, it, expect } from "vitest";
import { checkRelationship } from "@/lib/auth/helper";

describe("関係性境界: ユーザー間の関係性", () => {
  it("follow 関係のユーザーは詳細な価値観マップを閲覧拒否される", async () => {
    const session = {
      user: { id: "user-1", role: "member" },
    };

    // user-1 と user-2 は follow 関係
    const isFriend = await checkRelationship(session, "user-2", "friend");

    expect(isFriend).toBe(false); // friend ではないので false

    const isFollow = await checkRelationship(session, "user-2", "follow");
    expect(isFollow).toBe(true); // follow 関係なので true
  });

  it("friend 関係のユーザーは進行中の非公開リストを閲覧できる", async () => {
    const session = {
      user: { id: "user-1", role: "member" },
    };

    // user-1 と user-2 は friend 関係
    const isFriend = await checkRelationship(session, "user-2", "friend");

    expect(isFriend).toBe(true);
  });
});
```

---

## 🧪 プラットフォーム管理者テストケース

### 原則

- **`platform_admin` はすべてのリソースにアクセス可能**
- RLSポリシーをバイパス

### テストケース一覧

| ID | テストケース | 入力 | 期待結果 | 実装ファイル |
|----|-------------|------|----------|-------------|
| P1 | `platform_admin` は `/admin` にアクセスできる | セッション: `{ role: "platform_admin" }`, パス: `/admin` | アクセス許可 | `src/__tests__/proxy.test.ts` |
| P2 | `platform_admin` は全組織のデータを閲覧できる | セッション: `{ role: "platform_admin" }`, groupId: `"group-B"` | 成功: データ取得 | `src/lib/auth/__tests__/helper.test.ts` |
| P3 | `platform_admin` は全国のデータを編集できる | セッション: `{ role: "platform_admin" }`, nationId: `"nation-B"` | 成功: データ更新 | `src/lib/auth/__tests__/helper.test.ts` |
| P4 | `platform_admin` は他ユーザーのプライベートデータを閲覧できる | セッション: `{ role: "platform_admin" }`, targetUserId: `"user-2"` | 成功: データ閲覧 | `src/lib/auth/__tests__/helper.test.ts` |

### テストコード例（P2）

```typescript
import { describe, it, expect } from "vitest";
import { checkGroupRole } from "@/lib/auth/helper";

describe("プラットフォーム管理者: フル権限", () => {
  it("platform_admin は全組織のデータを閲覧できる", async () => {
    const session = {
      user: { id: "admin-1", role: "platform_admin" },
    };

    // platform_admin はどの組織のリソースにもアクセス可能
    const isLeaderOfGroupB = await checkGroupRole(session, "group-B", "group_leader");

    expect(isLeaderOfGroupB).toBe(true); // プラットフォーム管理者は常に true
  });
});
```

---

## 🎨 UIガードテストケース

### 原則

- **コンポーネントレベルでの権限チェック**
- `<RequireAuth>`, `<RequireRole>`, `<RequireGroupRole>` などのUIガードコンポーネント

### テストケース一覧

| ID | テストケース | 入力 | 期待結果 | 実装ファイル |
|----|-------------|------|----------|-------------|
| U1 | `<RequireAuth>` は未認証ユーザーにコンテンツを非表示 | セッション: `null` | コンテンツ: 非表示 | `src/lib/auth-guard.test.tsx` |
| U2 | `<RequireRole role="platform_admin">` は管理者のみ表示 | セッション: `{ role: "platform_admin" }` | コンテンツ: 表示 | `src/lib/auth-guard.test.tsx` |
| U3 | `<RequireRole role="platform_admin">` は一般ユーザーに非表示 | セッション: `{ role: "member" }` | コンテンツ: 非表示 | `src/lib/auth-guard.test.tsx` |
| U4 | `<RequireGroupRole groupId="group-A" role="group_leader">` は組織リーダーのみ表示 | セッション: `{ userId: "user-1" }`, groupId: `"group-A"` | コンテンツ: 表示 | `src/lib/auth-guard.test.tsx` |

### テストコード例（U1, U2）

```typescript
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RequireAuth, RequireRole } from "@/lib/auth-guard";

describe("UIガード: RequireAuth", () => {
  it("未認証ユーザーにコンテンツを非表示", () => {
    // セッション: null
    render(
      <RequireAuth fallback={<div>Please login</div>}>
        <div>Protected content</div>
      </RequireAuth>
    );

    expect(screen.queryByText("Protected content")).toBeNull();
    expect(screen.getByText("Please login")).toBeInTheDocument();
  });
});

describe("UIガード: RequireRole", () => {
  it("platform_admin は管理者専用コンテンツを表示", () => {
    // セッション: { role: "platform_admin" }
    render(
      <RequireRole role="platform_admin" fallback={<div>Access denied</div>}>
        <div>Admin panel</div>
      </RequireRole>
    );

    expect(screen.getByText("Admin panel")).toBeInTheDocument();
    expect(screen.queryByText("Access denied")).toBeNull();
  });

  it("一般ユーザーは管理者専用コンテンツを非表示", () => {
    // セッション: { role: "member" }
    render(
      <RequireRole role="platform_admin" fallback={<div>Access denied</div>}>
        <div>Admin panel</div>
      </RequireRole>
    );

    expect(screen.queryByText("Admin panel")).toBeNull();
    expect(screen.getByText("Access denied")).toBeInTheDocument();
  });
});
```

---

## 📂 テストファイル配置方針

### システムテスト（認証ヘルパー関数）

- **配置場所**: `src/lib/auth/__tests__/`
- **ファイル名**: `helper.test.ts`, `auth-guard.test.tsx`
- **目的**: 認証ヘルパー関数、UIガードコンポーネントのテスト

### コンポーネントテスト（コロケーション方式）

- **配置場所**: コンポーネントと同階層（例: `src/app/(protected)/admin/page.test.tsx`）
- **ファイル名**: `page.test.tsx`, `layout.test.tsx`
- **目的**: ページコンポーネントのアクセス権限テスト

### 統合テスト（E2Eシナリオ）

- **配置場所**: `src/__tests__/integration/`
- **ファイル名**: `auth-flow.integration.test.ts`, `rbac-flow.integration.test.ts`
- **目的**: 認証フロー、権限チェックフローのE2Eテスト

---

## 🚀 実装ステップ（月曜日朝）

### ステップ1: テスト環境のセットアップ

- [ ] Vitest の設定確認（`vitest.config.ts`）
- [ ] Testing Library のセットアップ確認
- [ ] モックデータの準備

### ステップ2: Red - テストを書いて失敗させる

- [ ] Deny-by-defaultテストを作成（5件）
- [ ] コンテキスト検証テストを作成（4件）
- [ ] 関係性境界テストを作成（5件）
- [ ] プラットフォーム管理者テストを作成（4件）
- [ ] UIガードテストを作成（4件）
- [ ] すべてのテストが失敗することを確認（Red）

### ステップ3: Green - 最小限の実装でテストを通す

- [ ] ヘルパー関数を実装（`checkPlatformAdmin`, `checkGroupRole`, `checkNationRole`, `checkRelationship`, `withAuth`）
- [ ] UIガードコンポーネントを実装（`<RequireAuth>`, `<RequireRole>`, `<RequireGroupRole>`）
- [ ] すべてのテストがパスすることを確認（Green）

### ステップ4: Refactor - コードを改善する

- [ ] コードの重複を削除
- [ ] 型安全性を向上
- [ ] キャッシュ戦略を最適化
- [ ] すべてのテストがパスすることを再確認

---

## 📚 関連ドキュメント

- [ルート・アクセスマトリクス](../rbac-route-matrix.md)（TODO#2で作成済み）
- [Server Action権限チェック仕様](../rbac-server-action-guard.md)（TODO#3で作成済み）
- [組織/国分離モデル](../rbac-group-nation-separation.md)（TODO#4で作成済み）
- [アカウント入力MVP仕様](../account-input-mvp.md)（TODO#5で作成済み）
- [RoleType/RelationshipType型定義](../../src/lib/auth/auth-types.ts)

---

## 💡 Tips

### TDDの利点

- **仕様が明確**: テストケースが仕様書になる
- **リファクタリングが安全**: テストがあるので安心して改善できる
- **バグが早期発見**: 実装前にエッジケースを洗い出せる

### Deny-by-defaultのテスト戦略

- **すべてのアクセスは既定で拒否**: テストでは「許可されるケース」と「拒否されるケース」の両方を確認
- **境界値テスト**: 権限の境界（leader vs member）を重点的にテスト
- **エラーメッセージの確認**: エラーメッセージが具体的かをテスト

### コンテキスト検証のテスト戦略

- **組織Aと組織Bの分離**: 組織Aのリーダーが組織Bのリソースにアクセスできないことを確認
- **自分の組織へのアクセス**: 自分の組織のリソースにはアクセスできることを確認
- **プラットフォーム管理者の特権**: プラットフォーム管理者はすべてにアクセスできることを確認

---

**GitHub Copilot より**: TDD（テスト駆動開発）は、実装前にテストを書くことで、仕様の曖昧さを排除し、高品質なコードを実現します。また、テストがあることで、リファクタリングを安全に行えます。RBACのような複雑な権限管理では、TDDが特に有効です。
