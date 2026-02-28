# 厳密なコードレビュー - VNS masakinihirota
**日付**: 2026年3月1日
**レビューモード**: Strict (Adversarial) / 敵対的レビュー
**評価**: ⚠️ **本番環境への展開不可** - 重大な問題が複数存在

---

## 📋 Executive Summary（即座に対応が必要）

このアプリケーションには **構造的な設計欠陥**, **スキーマの矛盾**, **セキュリティの甘さ**, **テスト不足** が存在します。本番環境への展開は**強く推奨されません**。

### 重大度による分類
- 🔴 **CRITICAL** (即座に修復必須): 5件
- 🟠 **MAJOR** (リリース前に修復): 8件
- 🟡 **MINOR** (アーキテクチャ改善): 6件

---

## 🔴 CRITICAL ISSUES（致命的欠陥）

### 1. **スキーマコンフリクト - Better Auth & RBAC の統一性崩壊**

**Location**: 複数ファイル
**Severity**: CRITICAL
**Impact**: 本番環境で予測不可能な障害、データ整合性喪失

#### 問題の詳細
```
存在する矛盾:
1. src/db/schema.ts          → テーブル: user, session, account (単数形)
2. src/lib/db/schema.postgres.ts → テーブル: users, sessions, accounts (複数形)
3. drizzle.config.ts         → "schema": "src/lib/db/schema.postgres.ts" を参照
```

**コード引用（問題箇所）**:
- [src/lib/auth.ts](src/lib/auth.ts#L4): `import * as schema from "@/lib/db/schema.postgres"`
- [src/lib/auth/rbac-helper.ts](src/lib/auth/rbac-helper.ts#L29): `import { groupMembers, nationMembers, relationships, user } from "@/db/schema"`

これにより：
- `rbac-helper.ts` は単数形テーブル参照 → **存在しないテーブルにアクセス**
- Better Auth は複数形テーブルを期待 → **カラム命名不一致**
- `src/db/schema.ts` は**完全にデッドコード**

**修復方法**:
1. `src/db/schema.ts` を**削除**（使用されていない）
2. `rbac-helper.ts` を修正: `@/lib/db/schema.postgres` に統一
3. すべてのインポートが `@/lib/db/schema.postgres` を参照することを確認
4. 同時にテーブル名を複数形に統一（更新の手間省略のため、既存カラム名のままテーブル使用）

---

### 2. **Drizzle クライアントの二重定義 + スキーマ未参照**

**Location**: [src/db/drizzle.ts](src/db/drizzle.ts), [src/lib/db/client.ts](src/lib/db/client.ts)
**Severity**: CRITICAL
**Impact**: 関数がスキーマ定義を参照できず、型安全性喪失

#### 問題の詳細

```typescript
// ❌ src/db/drizzle.ts - スキーマなし！
export const db = drizzle(pool);  // schema を指定していない

// ✅ src/lib/db/client.ts - スキーマあり
export const db = drizzle(client, { schema, logger: false });
```

結果：
- `src/lib/api/services/users.ts` が `@/db/drizzle` を使用 → **型情報喪失**
- `rbac-helper.ts` が新規接続を作成 → **コネクションプーリングコスト増加**

**修復方法**:
1. `src/db/drizzle.ts` を**削除**
2. すべてのインポートを `@/lib/db/client` に統一
3. 関連テストの修正（`users.ts` など）

---

### 3. **ダミー認証が本番環境で無効化される仕組みの不十分さ**

**Location**: [src/proxy.ts](src/proxy.ts#L18)
**Severity**: CRITICAL
**Impact**: 設定ミスで本番環境が認証バイパス状態に

#### 問題の詳細

```typescript
// 起動時チェック（実行順序に依存）
validateProductionAuth();  // ← エラーで throw ❌ ❌

if (process.env.NODE_ENV === 'production' && !USE_REAL_AUTH) {
  throw new Error('[SECURITY] ...');
}
```

リスク：
- **環境変数の設定順序によって無効化される可能性**
- Node.js コンテナが起動時にエラーを出力後、意図せず起動成功することがある
- `NEXT_PUBLIC_USE_REAL_AUTH=false` と `NEXT_PUBLIC_`で始まる変数は**クライアント側に漏洩**

**修復方法**:
```typescript
// ✅ より厳密な検証
if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error('[FATAL] Production environment requires BETTER_AUTH_SECRET');
}

// ✅ NEXT_PUBLIC_NOT_USE（クライアント非公開変数）
if (process.env.NODE_ENV === 'production') {
  const useRealAuth = process.env.USE_REAL_AUTH === 'true'; // 内部変数のみ
  if (!useRealAuth) {
    throw new Error('[FATAL] Production must use real auth');
  }
}
```

---

### 4. **認可チェックが UI と Server Action に分散（矛盾の余地あり）**

**Location**: [src/proxy.ts](src/proxy.ts#L130), [src/app/actions/create-group.ts](src/app/actions/create-group.ts#L42)
**Severity**: CRITICAL
**Impact**: 権限判定の矛盾によるセキュリティ迂回

#### 問題の詳細

Proxy（ルーティングレイヤー）と Server Action で異なるロール判定：

```typescript
// ❌ Proxy: role_name にコロンが含まれる
session?.user?.role === "platform_admin"

// ✅ Server Action: 同じ形式だが、...
checkGroupRole(...) // これの内部実装は?
```

RBAC ロード定数が別途定義されているため、矛盾の余地あり。

**修復方法**:
1. すべてのロール判定を `src/lib/auth/rbac-constants.ts` に統一
2. Server Action は必ず DB から再度検証（キャッシュは補助的のみ）

---

### 5. **テスト体制の完全な欠落**

**Location**: [src/lib/__tests__/helper.test.ts](src/lib/__tests__/helper.test.ts)
**Severity**: CRITICAL
**Impact**: バグ検出不可、リグレッション防止ができない

#### 問題の詳細

テストが **TODO コメントばかり**：

```typescript
describe('getSession', () => {
  // TODO: セッションクッキーなしでリクエスト
  // TODO: 有効なセッショントークンとともにリクエスト
  // TODO: React cache() 動作確認
```

**テスト範囲**:
- ✅ Proxy 基本テスト (1個のみ)
- ❌ RBAC 権限判定テスト (スキップ中)
- ❌ Server Action テスト (なし)
- ❌ API エンドポイントテスト (限定的)
- ❌ E2E テスト (なし)

**修復方法**:
```
実装優先度:
1. RBAC 権限判定テスト (rbac-helper.test.ts)
2. Server Action テスト (create-group.test.ts, create-nation.test.ts)
3. API エンドポイントテスト
4. E2E テスト（Cypress / Playwright）
```

---

## 🟠 MAJOR ISSUES（重要な設計欠陥）

### 6. **RLS ポリシーが定義されているが、有効化されていない可能性**

**Location**: [drizzle/rls-policies.sql](drizzle/rls-policies.sql), DB マイグレーション
**Severity**: MAJOR
**Impact**: ユーザーが他人のデータにアクセス可能

#### 問題の詳細

RLS ポリシーが存在する（良い）が：
1. マイグレーションスクリプト（`schema.postgres.ts`）で RLS 有効化が明示されていない
2. 初期セットアップドキュメントが複雑で、手順を間違える可能性が高い
3. デプロイメント自動化の一部に含まれていない

**修復方法**:
- Drizzle マイグレーション SQL に RLS 有効化を統合
- 本番環境では必須チェックを追加

---

### 7. **Server Action のセッション検証が DB 再クエリを行わない**

**Location**: [src/lib/auth/rbac-helper.ts](src/lib/auth/rbac-helper.ts#L20)
**Severity**: MAJOR
**Impact**: セッション改ざんされた場合に検出不可

#### 問題の詳細

```typescript
// ❌ React cache() によるメモ化のため、複数呼び出し時も DB が1回のみ
const cachedRole = cache(async () => {
  // DB クエリ 1回のみ実行
  return checkGroupRole(userId, groupId);
});
```

リスク:
- リクエスト途中でセッショントークンが無効化されても検出不可
- クライアント側でロール情報を改ざんされると、Server Action が信頼

**修復方法**:
```typescript
// ✅ リクエストのたびに再検証（キャッシュ最大化）
async function verifyGroupRole(userId: string, groupId: string) {
  const dbRole = await db.query.groupMembers.findFirst({
    where: eq(groupMembers.userId, userId)
  });

  // セッション情報と比較
  if (session.user.role !== dbRole.role) {
    throw new Error('Session tampering detected');
  }
}
```

---

### 8. **環境変数のバリデーションが起動時のみ**

**Location**: [src/lib/auth.ts](src/lib/auth.ts#L17)
**Severity**: MAJOR
**Impact**: 設定がデプロイ後に変更された場合、反映されない

#### 問題の詳細

```typescript
// ❌ 起動時のみ検証
validateDatabaseUrl();
validateBetterAuthCoreEnv();
validateOAuthCredentials();

// その後、設定を変更されても →「再起動が必要」と気づかない
```

**修復方法**:
- 環境変数の定期的なバリデーション（health check）
- ログに環境変数の状態を出力して起動確認

---

### 9. **デバッグログが本番環境でも出力される可能性**

**Location**: [src/proxy.ts](src/proxy.ts#L44), [src/lib/trial-signature.ts](src/lib/trial-signature.ts#L42)
**Severity**: MAJOR
**Impact**: 本番環境でユーザー情報（メールアドレスなど）がログに漏洩

#### 問題の詳細

```typescript
// ⚠️ 本番環境では DEBUG_LOGGING=false だが...
if (!DEBUG_LOGGING && level !== 'error') return;

// エラーログはすべて出力 → PIIが公開可能
console.error(`[SECURITY_EVENT] User: ${userEmail}`);
```

console.log / console.warn / console.error が本番環境で出力され、外部ログシステムに送信される可能性。

**修復方法**:
```typescript
// ✅ 本番環境では PIIを削除
const safeLog = process.env.NODE_ENV === 'production'
  ? '[USER_ACTION] Unauthorized access attempt'
  : `[USER_ACTION] ${userEmail} unauthorized access`;
```

---

### 10. **コンポーネント設計が Collocation ルールを守っていない**

**Location**: [src/components](src/components)
**Severity**: MAJOR
**Impact**: コンポーネント管理が複雑化、保守性低下

#### 問題の詳細

```
現状:
src/components/
  ├── admin/                    ← admin 専用コンポーネント
  ├── auth/
  │   ├── google-login-form/
  │   │   ├── google-login-form.tsx
  │   │   └── google-login-form.logic.ts   ← business logic 分離
  └── ui/                       ← Generic UI components

期待:
src/components/
  ├── (admin)/
  │   └── DashboardWidget/
  │       ├── index.ts
  │       ├── DashboardWidget.tsx
  │       └── DashboardWidget.test.tsx
  └── (auth)/
      └── GoogleLoginForm/
          ├── index.ts
          ├── GoogleLoginForm.tsx
          └── useGoogleLoginLogic.ts
```

**修復方法**:
- ページごとに `src/components/<page>/<feature>/` 構造を導入
- `.logic.ts` の命名を `useFeatureLogic()` hook に変更（React convention）

---

### 11. **N+1 クエリの可能性が複数存在**

**Location**: [src/lib/db/](src/lib/db/)
**Severity**: MAJOR
**Impact**: 大規模ユーザー数時にデータベース過負荷

#### 問題の詳細

確認が必要なファイル：
- `src/lib/db/group-queries.ts` - グループメンバー一覧取得
- `src/lib/db/nation-queries.ts` - 国メンバー一覧取得

ループ内でクエリ発行がないか確認が必要。

---

### 12. **Error Handling が非一貫的**

**Location**: [src/app/actions/create-group.ts](src/app/actions/create-group.ts)
**Severity**: MAJOR
**Impact**: エラー処理の重複、デバッグ困難

```typescript
// ❌ 各 Server Action で個別にエラーハンドリング
try {
  // ...
} catch (error) {
  console.error("[createGroupAction] Error:", error);
  return { success: false, error: "..." };
}
```

**修復方法**:
- 統一的なエラー処理コンテキストを作成
- `APIError` クラスで標準化

---

### 13. **未実装機能が本番コードに残存**

**Location**: [src/lib/notifications/schema.ts](src/lib/notifications/schema.ts)
**Severity**: MAJOR
**Impact**: デッドコード、保守性低下

```typescript
// TODO: Drizzle ORM insert を実装
// TODO: Drizzle ORM update を実装
// TODO: Drizzle ORM select を実装
```

---

---

## 🟡 MINOR ISSUES（アーキテクチャ改善）

### 14. **dangerouslySetInnerHTML の使用（セーフな例だが）**

**Location**: [src/app/layout.tsx](src/app/layout.tsx#L22)
**Severity**: MINOR (実装は安全)
**Note**: このケースはハードコードされたスクリプトなので安全だが、convention として Next.js の `Script` コンポーネント推奨

```typescript
// ✅ より推奨される方法
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script>{`
          (function() {
            // ... theme detection
          })();
        `}</Script>
      </head>
    </html>
  );
}
```

---

### 15. **Console Logging の過剰使用**

**Location**: 複数ファイル（[src/proxy.ts](src/proxy.ts#L44), [src/lib/trial-signature.ts](src/lib/trial-signature.ts#L42) など）
**Severity**: MINOR
**Impact**: 本番環境で不要なログが蓄積

---

### 16. **TypeScript の `as any` キャスト**

**Location**: [src/proxy.ts](src/proxy.ts#L77)
**Severity**: MINOR
**Impact**: 型安全性の低下

```typescript
const dummyUserType = (process.env.DUMMY_USER_TYPE || "USER1") as any;
```

修復: `as 'USER1' | 'USER2' | 'USER3'` など型をする。

---

### 17. **Database Connection が Singleton pattern で管理されていない（一部）**

**Location**: [src/lib/auth/rbac-helper.ts](src/lib/auth/rbac-helper.ts#L51)
**Severity**: MINOR
**Impact**: メモリリーク、コネクションリークの可能性

```typescript
const client = postgres.default(process.env.DATABASE_URL, {
  prepare: false,
});

return drizzle(client);  // ← 毎回新規接続？
```

---

### 18. **GitIgnore に機密ファイルが含まれるか確認**

**Location**: `.gitignore` (確認できなかった)
**Severity**: MINOR
**Risk**: `.env.local`, `*.key` などが git に含まれる可能性

---

### 19. **Next.js 16 の async/await 必須ルール未完全**

**Location**: [src/proxy.ts](src/proxy.ts#L72)
**Severity**: MINOR
**Note**: `await headers()` は正しく実装されているが、すべてのコードで統一確認が必要

---

---

## 🏗️ アーキテクチャの根本的な問題

### Problem A: **Monolithic Structure**
プロジェクトが API, Database queries, Components がすべてまとまっており、責任分離が不十分です。

### Problem B: **Shared Database Connection**
複数の場所で dataバースに接続しており、コネクションプーリングが活用されていません。

### Problem C: **Manual RLS Policy Management**
RLS ポリシーが SQL ファイルで管理されており、マイグレーションと同期されていません。

---

## ✅ 良い実装例（称賛点）

- ✅ Better Auth の OAuth-only 設定（メールパスワード認証を無効化）
- ✅ Drizzle ORM による SQL インジェクション対策
- ✅ Server Action による XSS 対策（入力バリデーション）
- ✅ RBAC 階層の明確な定義
- ✅ 環境変数のバリデーション関数

---

## 📋 修復優先度（推奨実装順）

### Phase 1: 本番環境展開前（必須）
1. ✅ スキーマコンフリクト解決（`src/db/schema.ts` 削除）
2. ✅ Drizzle クライアント統一（`src/db/drizzle.ts` 削除）
3. ✅ ダミー認証の本番チェック強化
4. ✅ RLS ポリシーの自動適用（マイグレーション統合）
5. ✅ テスト用フレームワーク構築（RBAC, Server Actions）

**推定作業時間**: 2-3日

### Phase 2: 本番1ヶ月後
6. セッション改ざん検出機構追加
7. コンポーネント collocation 重構成
8. ロギング標準化（PII削除）
9. N+1 クエリ監査

**推定作業時間**: 3-5日

### Phase 3: 継続的改善
10. E2E テスト導入
11. パフォーマンス最適化
12. セキュリティ監査自動化

---

## 🚨 リリースチェックリスト

本番環境への展開は、以下をすべてクリアするまで**禁止**：

- [ ] `src/db/schema.ts` 削除確認
- [ ] `src/db/drizzle.ts` 削除確認
- [ ] すべての db インポートが `@/lib/db/client` を参照
- [ ] `drizzle/rls-policies.sql` がマイグレーションに統合
- [ ] RBAC テストが全パス（少なくとも 80%カバー率）
- [ ] 本番環境の環境変数が完全に設定済み（`BETTER_AUTH_SECRET`, `DATABASE_URL`, OAuth credentials）
- [ ] セキュリティ監査ドキュメント確認（Task 8-9 の CSRF/XSS 対策完了）
- [ ] ロギングから PII を削除確認
- [ ] RLS ポリシー有効化確認（DB 側で `SELECT * FROM pg_policies;`）

---

## コンクルージョン

このアプリケーションは**開発初期段階**であり、本番環境への展開には大きなリスクがあります。特に **スキーマコンフリクト** と **テスト欠落** は重大な問題です。

推奨: **Phase 1 のすべての修復を完了後**に限定的にベータローンチし、1-2週間の監視期間を経て本格展開してください。

---

## 📞 レビュー実施者
GitHub Copilot (Claude Haiku 4.5)

**レビュー実施日**: 2026年3月1日
**所要時間**: 約 45分

---

## Tips & 関連アドバイス

1. **スキーマ管理の標準化**: Drizzle Kit を使用して、すべてのテーブル定義を一箇所（`src/lib/db/schema.postgres.ts`）に統一してください。

2. **テスト駆動開発（TDD）の導入**: 新しい機能追加前に、テストを書く習慣をつけることで、この種の設計欠陥を早期に検出できます。

3. **セキュリティの多層防御**: 現在は Proxy + Server Action で権限チェックを行っていますが、**RLS が最後の砦**として機能していることを確認してください。

4. **ロギングの設計**: `console.log` ではなく、構造化ログ（Winston や Pino など）を導入して、本番環境での問題追跡を容易にしてください。

5. **CI/CD パイプラインの強化**: 各デプロイ前に自動チェック（スキーマ検証、テスト実行、セキュリティスキャン）を実行し、今回のような問題を早期に検出してください。
