# Hono 導入計画 - 厳しいレビューと指摘

**レビュアー:** GitHub Copilot
**レビュー日:** 2026-03-01
**対象:** `2026-03-01_HONO_INTEGRATION_TODO.md`
**評価:** ⚠️ **複数の構造的問題があり、現在の計画では実装するべきではない段階**

---

## 🔴 重大な問題（実装前に解決が必須）

### 1. **Runtime 選択の矛盾：Edge Runtime vs Drizzle + PostgreSQL**

**問題：**
```
計画では特に Runtime を明示していないが、既存の SKILL.md では Edge Runtime が推奨されている。
しかし、プロジェクトは以下を使用している：
- Drizzle ORM (PostgreSQL フル対応)
- PostgreSQL クライアント (postgres npm パッケージ)
- DB クエリ関数は 30+ 個

➜ Edge Runtime では Node.js 標準 API が完全には提供されないため、
  PostgreSQL への直接接続が不可能な可能性が高い
```

**実装の現実**
```javascript
// src/lib/db/client.ts の接続方式
import postgres from "postgres";
const client = postgres.default(process.env.DATABASE_URL, {
  prepare: false,  // Edge では prepare が使えないかもしれない
});
```

**どちらが正解？**
- ✅ **Node Runtime**: Drizzle + PostgreSQL は完全に動作。Server Actions / Server Components も動作。RPC client も可。
- ❌ **Edge Runtime**: DB 接続に制限。Server-side only の middleware や API routes が限定される。

**レビュー結論：**
> 計画に「**runtime = 'node'（必須）**」を明記するべき。
> Edge Runtime は今後の最適化フェーズで検討（パフォーマンス測定後）。

**修正内容：**
```markdown
## A-2: `src/app/api/[[...route]]/route.ts` 作成

◎ **必ず以下を含める**
- `export const runtime = 'node';` ← Drizzle + PostgreSQL 対応必須
- Hono アプリ初期化
- handler 処理（GET, POST, PATCH, DELETE, PUT）
```

---

### 2. **Better Auth の共存方法が「決定待ち」状態**

**問題：**
```
計画は「F-1: Better Auth 共存方法の確定」で決定を遅延している。
しかし、これは：
- フェーズ A（セットアップ）の基盤に直結する
- フェーズ B・C の実装を左右する
- middleware / RPC client 設計に影響する

例えば：
- セッション検証はどこで行う？（Better Auth ミドルウェア？Hono middleware？）
- CSRF 保護はどうする？（Next.js 標準？Hono カスタム？）
- Cookie 設定は統一可能か？
```

**リスク：**
- 実装中に設計が変わる可能性
- Server Actions と API エンドポイントのセッション処理が異なる可能性
- CSRF 重複検証の可能性

**レビュー結論：**
> **フェーズ A の開始前に、Better Auth 統合方針を確定せよ。**
> 推奨は「**パターン A: 既存 /api/auth を維持、Hono は /api 配下で独立**」

**具体的な決定項目：**
```markdown
### Better Auth 共存方針（決定待ち → 決定済みに）

✅ パターン A（推奨）を採択理由：
- 既存 /api/auth/[...all] は Better Auth のフレームワーク統合なので、
  別途 route.ts を 作成すると二重定義になる可能性
- Hono は /api/{resource}/* で独立させ、
  Better Auth の nextCookies() 機構から独立
- セッション検証は Hono middleware で Proxy（/src/proxy.ts）と統一

### セッション検証フロー（統一）
1. Proxy: ブラウザ → Cookie 検証 → userId context に注入
2. Server Actions: getSession() 呼び出し（既存）
3. Hono middleware: proxy から userId 取得 or Cookie 直接検証
```

---

### 3. **Hono RPC クライアント生成パイプラインが仮説段階**

**問題：**
```
計画では「A-5: Hono RPC クライアント生成スクリプト作成」としているが：

① RPC client のジェネレーション方法
   - hono/client でどうやって自動生成するのか明記されていない
   - ビルド時か実行時か？

② TypeScript の型推論
   - Hono 型定義がサーバー側に正しくエクスポートされているか？
   - Next.js app router の型制約との相互作用は？

③ 既存のバリデーション Zod スキーマとの связь
   - API リクエスト/レスポンスの型定義を二重管理する必要があるか？
   - 既存 src/lib/validation/schemas.ts との統合は？
```

**例：実装時に発生しそうな問題**
```typescript
// Hono ルータ定義
export const groupsRouter = hono.post('/groups', async (c) => {
  const body = c.req.json();
  // ✗ Zod スキーマ検証必須か？それとも Hono の zValidator を使う？
});

// クライアント側
const client = hc<typeof groupsRouter>('/api');
// ← 型が正しく推論されるのか？バリデーションエラーはどう扱う？
```

**レビュー結論：**
> **RPC client ジェネレーション戦略を事前に PoC（Proof of Concept）として検証せよ。**
> 実装計画に含め、フェーズ A の最後に必ずテストする。

**修正案：**
```markdown
## A-5: Hono RPC Client 検証（PoC）

前提：
- hono/client の実装方法を事前検証（サンプル実装）
- 既存 Zod バリデーションとの関連付け方法を決定

実装：
1. src/lib/api/routes/test-route.ts で簡単な endpoint を作成
2. hc<typeof router> でクライアント生成テスト
3. レスポンス型の推論が正しく動作することを確認
4. エラーレスポンスの型定義をテスト
```

---

## 🟠 アーキテクチャ上の懸念事項

### 4. **既存の Server Actions と Hono エンドポイントの設計の重複**

**問題：**
```
計画では Server Actions（create-group, create-nation）を Hono に移行する予定だが：

①現在の Server Actions の設計は優れている：
  - Zod バリデーション
  - session 検証（getSession()）
  - RBAC チェック（checkGroupRole）
  - 明示的なエラーハンドリング（CreateGroupResponse インターフェース）

② Hono に移行すると：
  - 同じバリデーション・RBAC ロジックを Hono middleware として再実装が必要
  - 型定義が分散：Server Actions の Response interface と
    Hono エンドポイントの response 型が別々
  - 既存のテスト（create-group.test.ts など）を書き換える必要
```

**比較表**
```
機能                    Server Actions              Hono API
─────────────────────────────────────────────────────────────
セッション取得          session = await getSession() | Proxy から context
入力値バリデーション    ✅ Zod (既存)               | ✅ Hono zValidator
RBAC チェック           ✅ checkGroupRole (既存)    | ✅ middleware として再実装
エラーレスポンス        ✅ 型付きレスポンス         | ⚠️ HTTP ステータスコード
DB 関数呼び出し         ✅ createGroup()            | ✅ 同じ関数使用可
テスト方法              ✅ vitest で実装テスト   | ⚠️ integration test 必要？
クライアント側          `'use client'` で呼び出し  | ✅ RPC client / fetch
```

**レビュー結論：**
> **Server Actions と Hono API の責任を明確に分けるべき。**
> ただし両方を並行運用すると「いつどちらを使う？」の混乱が生じます。

**推奨戦略：**
```markdown
### Server Actions vs Hono API の責任分離

改めて定義：

A. Server Actions（keep existing）
   - UI に密結合した UX 最適化フロー（"いますぐ実行"型）
   - Form submission で async/await 可能
   - セッション検証・RBAC は既存通り

B. Hono API（新規）
   - Admin 画面のリソース CRUD
   - 将来の第三者 API 統合対応
   - 宮を組織化した API ドキュメント要件

C. 対象外：
   - create-group / create-nation は Server Actions で継続運用
   - 管理画面（Admin Panel）のみ Hono に移行
```

---

### 5. **RBAC Middleware 再実装の実行可能性が不明**

**問題：**
```
現在の RBAC 実装：
- src/lib/auth/rbac-helper.ts が 426 行
- 4層評価（platform_admin → context role → relationship → deny）
- React cache() による最適化
- Server Action コンテキストで動作

Hono middleware として実装する際：
① React cache() はサーバーサイド middleware では機能しない
   ➜ 代わりに hono Context に情報を付加する必要

② RBAC ロジック（checkGroupRole など）は Server Action 前提で書かれている
   ➜ Hono handler で再利用、ただし DB 接続が統一されるか不確実

③ middleware chains の複雑性
   ➜ 認証 → RBAC → レート制限 → ロギング の順序が正しいか？
   ➜ middleware エラーの precedence は？（401 vs 403 vs 429）
```

**現在の RBAC 関数の例**
```typescript
// 現在：Server Action で呼び出し
export async function checkGroupRole(
  authSession,
  groupId,
  requiredRole,
): Promise<boolean> {
  // DB から groupMembers テーブル検索
  // RBAC_HIERARCHY と照合
  // 複数の権限レベルをチェック
}
```

**Hono で実装する場合**
```typescript
// Hono middleware として：
export const checkGroupRoleMiddleware = (requiredRole) => {
  return async (c, next) => {
    const userId = c.get('userId');  // Proxy から取得
    const groupId = c.req.param('id');

    const hasRole = await checkGroupRole(
      { user: { id: userId } },
      groupId,
      requiredRole,
    );

    if (!hasRole) {
      return c.json({ error: 'Forbidden' }, 403);
    }

    await next();
  };
};
```

**レビュー結論：**
> **RBAC middleware の複雑性は過小評価されている。**
> 既存の checkGroupRole / checkNationRole を Hono コンテキストで再利用できるか
> の検証が必須。フェーズ G で実装すると言っているが、
> 実装中に設計変更が必要になる可能性が高い。

---

### 6. **テスト戦略が曖昧：Unit + Integration + E2E の境界が不明**

**問題：**
```
計画では以下のテスト段階が想定されている：
- フェーズ B「ビルド & ユニットテスト」
- フェーズ C「統合テスト（e2e）」
- フェーズ H「統合テスト」

しかし：
① ユニットテスト対象は何か？
   - Hono handler の単体テスト？
   - middleware の単体テスト？
   - DB クエリ関数の単体テスト？

② Integration テストの定義
   - API endpoint の最初から最後までのフロー？
   - UI component の画面描画テスト？

③ 既存のテストフレームワーク（vitest + happy-dom）でカバーできるか？
   - Hono の handler テストに happy-dom は不要
   - Node.js ネイティブの API routes テストが必要

④ 既存テストの互換性
   - Server Actions のテスト（create-group.test.ts など）は有効か？
   - API に移行後も同じテストロジックを使用できるか？
```

**現在のテスト構成**
```
src/__tests__/
├── proxy.test.ts              ← Proxy (middleware) のテスト
└── integration/
    ├── auth-flow.integration.test.ts  ← Auth フロー
```

**レビュー結論：**
> **テスト戦略が計画に含まれていない。**
> Hono API のテストを vitest で書く方法を決めてから
> 実装を開始すべき。

---

## 🟡 スケジュールと見積もりの問題

### 7. **15時間見積もりは楽観的すぎる**

**計画の見積もり**
```
フェーズ A: 1～2h
フェーズ B: 1h
フェーズ C: 2～3h
...
合計: 約 15h
```

**実際の工数（現実的な見積もり）**
```
A. セットアップ & 基盤: 3～4h
   - Hono インストール （10分）
   - [[...route]]/route.ts の正確な実装 （30分）
   - Better Auth との共存確認・テスト （1h）
   - middleware skeleton 実装 （1h）
   - RPC client PoC （1～2h）
   - build & 動作確認 （1h）

B. Server Actions → Hono 化: 2～3h
   - create-group の Hono 化 （1h）
   - create-nation の Hono 化 （1h）
   - 既存テスト改修 （1h）
   - クライアント統合テスト （0.5h）

C. Admin API: 4～5h
   - User CRUD endpoints × 4 （2h）
   - Group / Nation endpoints × 4 （1.5h）
   - RBAC middleware 統合 （1h）
   - エラーハンドリングの標準化 （0.5h）

D～E: 同様に 3～4h 程度

F. Better Auth 統合: 2～3h （共存確認は複雑）
G. middleware・RPC: 4～5h （複雑性が高い）
H. クライアント統合: 2～3h
I. クリーンアップ: 1h

合計：20～30h が現実的
```

**理由：**
- ✅「最初の Hono endpoint 作成」（1h）は単純
- ❌「Error handling 標準化」（計画に記載なし、0.5～1h）
- ❌「既存テストの改修」（フェーズごとに 0.5～1h 隠れている）
- ❌「RBAC middleware の再実装」（複雑性過小評価）
- ❌「RPC client のジェネレーション PoC」（1～2h、失敗リスク高い）
- ❌「Better Auth の共存テスト」（セッション管理は繊細）

**レビュー結論：**
> **計画は楽観的。実装難度を高めと見積もり、段階的アプローチに変更すべき。**
> 一度に全カテゴリー API を実装するのではなく、
> **1つのドメイン（Admin API）に集中し、成功パターンを確立してから拡張する。**

---

## 🔵 設計上の改善提案

### 8. **フェーズ A の「Route Handler 設計」が不足**

**計画の問題：**
```
「A-2: src/app/api/[[...route]]/route.ts 作成」と言っているが：

Q1. Catch-all route の使い方は正しいか？
    - [[...route]] は全パスをキャッチするが、
    - /api/auth/[...all] との relationship は？

Q2. Hono の app.get() vs app.post() の構造
    - Hono では router = hono.Hono() で
      router.get('/groups', ...) のように定義
    - これを [[...route]]/route.ts の中に全部入れるのか？
    - それとも別ファイルで define して import するのか？
```

**推奨設計：**
```typescript
// src/app/api/[[...route]]/route.ts

import { Hono } from 'hono';
import { toNextJsHandler } from '@hono/next-js';

// ルータインポート
import { groupsRouter } from '@/lib/api/routes/groups';
import { nationsRouter } from '@/lib/api/routes/nations';
import { adminRouter } from '@/lib/api/routes/admin';

export const runtime = 'node';

const api = new Hono()
  .basePath('/api')
  .route('/groups', groupsRouter)
  .route('/nations', nationsRouter)
  .route('/admin', adminRouter);

export const { GET, POST, PATCH, DELETE, PUT } = toNextJsHandler(api);
```

**計画が曖昧な点：**
- ルータの分割方法
- import/export の構成
- Error handling の Global wrapper が必要か？

---

### 9. **既存の Proxy（Next.js 16 Middleware）との関係を明記すべき**

**現状：**
```
- src/proxy.ts が既に存在（Next.js 16 Middleware）
- ブラウザ → Cookie 検証 → userId context に注入

**計画では一言も触れていない**
```

**改めて定義すべき：**
```markdown
### Proxy / Middleware / Hono の関係図

ブラウザ
   ↓ HTTP request with Cookie
[src/proxy.ts] ← Next.js 16 Middleware
   ↓ Cookie 検証 → request.userId = xxx （context に注入）
[src/app/api/[[...route]]/route.ts] ← Hono Handler
   ↓ userId を使用してさらに RBAC 検証
[Hono middleware] ← Authentication / RBAC チェック
   ↓ 許可したら handler 実行
[handler] ← actual API logic
   ↓ Response をブラウザへ

このフロー図を計画に含めるべき。
```

---

## 📊 修正版の提案フェーズ設計

**現在の計画（9 フェーズ + 15h）は実装に不適切。**
**以下の修正版を提案します：**

```markdown
# 修正版：段階的 Hono 統合計画

## フェーズ 0: 事前検証（新規、2～3h）

目的：リスク検証と設計確定

- [ ] 0-1: Runtime 検証
  - Edge Runtime と Node Runtime の Drizzle ORM 両立可否をテスト
  - `pnpm build` で エラーが出ないか確認
  - **決定：Node Runtime 採取**

- [ ] 0-2: Better Auth + Hono 共存テスト
  - Hono エンドポイント 1 行実装
  - Better Auth の nextCookies() と Hono handler の cookie 取り扱いを検証
  - Session cookie （httpOnly）がアクセスできるか確認

- [ ] 0-3: RPC Client ジェネレーション PoC
  - hono/client のドキュメント読破
  - サンプル endpoint → RPC client の完全フロー実装
  - 型推論が正しく動作することを確認

- [ ] 0-4: RBAC + Hono middleware の互換性検証
  - 既存 checkGroupRole() を Hono middleware で使用可能か確認
  - middleware chaining の順序でテスト

- [ ] 0-5: テスト戦略決定
  - Hono handler テストを vitest で書く方法を決定
  - test file 名規約を決定（handler.test.ts？）

## フェーズ 1: Hono セットアップ（1～2h）

前提：フェーズ 0 が完了し、すべての設計決定が確定している

- [ ] 1-1: pnpm add hono
- [ ] 1-2: src/app/api/[[...route]]/route.ts 作成
  - `export const runtime = 'node'`
  - Hono app 初期化、basePath = '/api' 設定
- [ ] 1-3: src/lib/api/routes/ フォルダ作成
- [ ] 1-4: src/lib/api/middleware/ フォルダ作成
  - auth.ts （セッション）
  - rbac.ts （ロール検証）
  - error-handler.ts
- [ ] 1-5: 基本的なテスト endpoint 実装 & テスト
  - GET /api/health → { status: 'ok' }
  - テスト実行で 200 OK 確認

## フェーズ 2: Admin API（3～4h）

優先度を管理画面用 API に集中。User/Group/Nation の CRUD を完全実装。

- [ ] 2-1: User admin endpoints
  - GET /api/admin/users
  - GET /api/admin/users/:id
  - PATCH /api/admin/users/:id
  - DELETE /api/admin/users/:id

- [ ] 2-2: RBAC middleware 統合テスト
  - platform_admin のみアクセス可能か確認
  - 権限不足ユーザーは 403 を返すか確認

- [ ] 2-3: Group / Nation endpoints
  - GET /api/admin/groups、DELETE
  - GET /api/admin/nations、DELETE

- [ ] 2-4: エラーハンドリング標準化
  - すべての endpoint で統一的な エラーレスポンス
  - 401、403、404、500 の区別

- [ ] 2-5: Admin UI をテスト endpoint から RPC client に移行
  - AdminGroupPanel コンポーネント更新

- [ ] 2-6: integration test 作成
  - User 作成 → 検索 → 削除 の完全フロー

## フェーズ 3: User/Group/Nation API（2～3h）

前提：フェーズ 2 で Hono の実装パターンが確立

- [ ] 3-1: ユーザー情報 API
- [ ] 3-2: Group API（自分のグループ一覧、詳細）
- [ ] 3-3: Nation API（自分の国一覧、詳細）
- [ ] 3-4: 既存 UI コンポーネント更新

## フェーズ 4: 通知 API（1h）

## フェーズ 5: Better Auth 統合の最終確認（1h）

## フェーズ 6: クリーンアップ（1h）

---

**合計見積もり：**
- フェーズ 0 (事前検証): 2～3h ⭐ **新規、複雑性を下げるために必須**
- フェーズ 1 (セットアップ): 1～2h
- フェーズ 2 (Admin API): 3～4h
- フェーズ 3～6: 5～7h
- **合計：12～16h （現計画と同等だが、リスク軽減）**
```

---

## 📌 計画を実装する前にすべき決定事項

実装開始前に以下を**明確に決定**し、document に記載すること：

```markdown
### 決定待ちリスト（フェーズ 0 で検証・決定）

1. [ ] Runtime は Node Runtime か Edge Runtime か？
   → **設定例：**
   ```
   次のいずれかを select:
   A. Node Runtime（推奨、Drizzle + PostgreSQL 完全対応）
   B. Edge Runtime（性能優先、DB 接続に制限）

   **決定:** A を採取
   実装: export const runtime = 'node';
   ```

2. [ ] Better Auth 共存パターンはどちら？
   ```
   A. /api/auth はそのまま（Better Auth フレームワーク統合）
      /api/{resource}/* は Hono で独立実装
      セッション検証は Proxy/Hono がそれぞれで行う

   B. /api/auth も Hono に統合
      （More unified、但し Better Auth の integ. level が変わる）

   **決定:** A を採取
   理由：既存フレームワーク統合を活かす、リスク最小化
   ```

3. [ ] RPC Client を使用するか？
   ```
   A. YES：hono/client で自動型生成（TypeScript best practice）
   B. NO：手動 fetch（従来方法、型安全性が低い）

   **決定:** A を採取、フェーズ 0-3 で検証
   ```

4. [ ] テストフレームワークのStrategy
   ```
   Hono handler テスト：
   - vitest （既存）で書く
   - または hono/test フレームワーク使用？

   **決定:** vitest を継続使用、test helper 作成
   ```

5. [ ] Error Response 仕様の統一
   ```
   Hono API の error response フォーマット：

   ✅ 統一案（推奨）
   {
     "success": false,
     "error": {
       "code": "FORBIDDEN",
       "message": "Only group_leader can perform this action",
       "details": { /* optional context */ }
     }
   }

   またはシンプル案：
   {
     "error": "Forbidden"
   }

   **決定:** 統一案を採取
   ```
```

---

## ✅ 最終レビュー結論

### **カテゴリー別の評価**

| カテゴリー | 評価 | 理由 |
|----------|------|------|
| **計画概要** | ⚠️ 中程度 | スコープは適切だが、レイアウトが雑 |
| **Architecture 設計** | 🔴 要改善 | Runtime、Better Auth 共存、RPC client が決定されていない |
| **見積もり** | 🔴 楽観的 | 15h は過小評価。20～30h が現実的 |
| **テスト戦略** | 🔴 不明 | Unit / Integration / E2E の境界が不明 |
| **リスク管理** | ?? 事前検証なし | PoC や事前テストが計画から抜けている |

### **実装前の行動計画**

```
1️⃣ 本レビュー報告書を読んで、設計決定事項を確認する
   → 「決定待ちリスト」を埋める（意思決定）

2️⃣ フェーズ 0（事前検証）を実施する
   - Runtime 検証（Edge vs Node）
   - Better Auth 共存テスト
   - RPC client PoC
   - RBAC middleware compat 確認
   - テスト戦略決定

   ✨ **このフェーズが最も重要。ここでリスク 7 割軽減可能**

3️⃣ 検証結果に基づき、修正版フェーズ計画を update する
   → 現計画を捨てる（本計画に更新）

4️⃣ 修正版フェーズ 1 から実装開始
```

### **赤い信号 🚩**

実装を開始してはいけない以下の状態：
- [ ] Better Auth 共存方法が未決定 → **決定してから開始**
- [ ] Runtime が Edge Runtime に設定されている → **Node に変更が必須**
- [ ] RPC client ジェネレーションが実装前に検証されていない → **PoC 必須**
- [ ] テスト戦略が計画に明記されていない → **決定してから開始**
- [ ] Proxy / Middleware との関係が曖昧 → **アーキテクチャ図を作成してから開始**

---

**作成者:** GitHub Copilot
**最終評価:** ⚠️ **計画は大筋で良いが、複数の構造的問題があるため修正版タイプの実装が必須**
