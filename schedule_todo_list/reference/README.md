# Reference - Hono 導入の選択肢分析

このフォルダには、Hono 導入に関する詳細な選択肢分析ドキュメントが格納されています。

## 📁 ファイル一覧

### Better Auth 共存方法の選択肢分析
**ファイル:** `2026-03-01_BETTER_AUTH_HONO_OPTIONS.md`

**内容:**
- Option A: 並行運用（独立） ⭐⭐⭐⭐⭐ **【採用】**
- Option B: Hono 内で Better Auth を Middleware 化 ⭐⭐⭐
- Option C: Better Auth を Hono Router に統合 ⭐⭐
- Option D: Hono を Better Auth Plugin として実装 ⭐

**採用決定:** Option A（並行運用）
**決定ドキュメント:** `.agent/decisions/better-auth-pattern.md`

---

### RPC Client の選択肢分析
**ファイル:** `2026-03-01_RPC_CLIENT_OPTIONS.md`

**内容:**
- Option A: Hono RPC Client（公式） ⭐⭐⭐⭐⭐ **【採用】**
- Option B: 手動 fetch + Zod スキーマ検証 ⭐⭐
- Option C: tRPC への移行 ⭐
- Option D: OpenAPI 生成 + Orval/OpenAPI Generator ⭐⭐⭐

**採用決定:** Option A（Hono RPC Client）
**決定ドキュメント:** `.agent/decisions/rpc-client-pattern.md`

**PoC チェックリスト:** 本ドキュメントに含まれる

---

## 📖 使い方

### 決定を見直す場合
各選択肢の詳細なメリット・デメリット、実装例を確認できます。

### 新しい選択肢を検討する場合
既存の分析フォーマットを参考に、新しい選択肢を追加できます。

### PoC（事前検証）を実施する場合
RPC Client 選択肢分析ドキュメントに含まれる「Phase 0 PoC チェックリスト」を参照してください。

---

**最終更新:** 2026-03-01
