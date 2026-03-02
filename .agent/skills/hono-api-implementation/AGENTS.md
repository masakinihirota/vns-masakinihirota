# Hono API Implementation Skill

## 概要

このスキルは、プロジェクト内のすべてのAPIエンドポイント実装にHonoフレームワークの使用を強制します。

## 適用タイミング

以下のタスクを実行する際に、自動的にこのスキルが適用されます：

- 新規APIエンドポイントの作成
- REST APIの実装
- CRUD操作のAPI化
- `/api/*` パス配下の実装依頼
- Server ActionsからAPIへの移行
- データ取得・更新APIの実装

## 主要ルール

### 強制事項

1. **Honoフレームワーク必須**
   - すべてのAPIは`src/lib/api/routes/`配下にHonoルーターとして実装
   - Next.js Route Handlerの直接使用禁止

2. **統一エラーフォーマット**
   - `ApiErrorResponse`/`ApiSuccessResponse`型を使用
   - `success: true/false`による一貫したレスポンス

3. **RBAC Middleware**
   - 権限チェックは必ずミドルウェアで実装
   - `requirePlatformAdmin`, `requireGroupRole`等を使用

4. **Zodバリデーション**
   - すべてのリクエストボディは`zValidator`でバリデーション
   - スキーマは`src/lib/api/schemas/`に配置

5. **RPC Client型安全性**
   - `AppType`を必ず型エクスポート
   - クライアント側で完全な型推論を実現

6. **セキュリティ対策**
   - CSRF保護（POST/PATCH/DELETE）
   - レート制限（重要なエンドポイント）
   - セッション検証（Better Auth統合）

### 禁止事項

- ❌ Next.js Route Handlerの直接作成
- ❌ Server ActionsでのREST API的な使用
- ❌ 手動でのエラーハンドリング（middlewareに任せる）
- ❌ 型定義なしのレスポンス

## 実装パターン

すべてのAPIエンドポイントは以下のパターンに従います：

1. **Zodスキーマ定義** → `src/lib/api/schemas/`
2. **サービス層実装** → `src/lib/api/services/`
3. **Honoルート実装** → `src/lib/api/routes/`
4. **ルーター登録** → `src/app/api/[[...route]]/route.ts`
5. **テスト実装** → `src/__tests__/api/`

詳細は`SKILL.md`を参照してください。

## 参考実装

- `src/lib/api/routes/admin.ts` (906行) - 完全実装の例
- `src/lib/api/routes/poc.ts` (181行) - RPC Client検証
- `src/lib/api/routes/users.ts` (65行) - シンプルな例

## 既存インフラ

Phase 0-2が完了済み：

- ✅ Honoメインルーター（route.ts）
- ✅ 8つのMiddleware（auth, rbac, error-handler等）
- ✅ Admin API完全実装（906行）
- ✅ RPC Clientセットアップ
- ✅ テスト環境（vitest + hono/testing）

## 関連ドキュメント

- `.agent/decisions/error-response-spec.md`
- `.agent/decisions/rpc-client-pattern.md`
- `.agent/decisions/rbac-middleware-strategy.md`
- `schedule_todo_list/2026-03-01_HONO_MASTER_PLAN.md`
