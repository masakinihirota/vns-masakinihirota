# Hono 導入計画 - レビュー結果の要約

**レビュー日:** 2026-03-01
**レビュアー:** GitHub Copilot
**対象ドキュメント:** `2026-03-01_HONO_INTEGRATION_TODO.md`

---

## 🎯 レビュー結論

**現在の計画は「大筋で正しいが、複数の構造的問題があり、このままの実装は推奨しません。」**

| 項目 | 評価 | 理由 |
|-----|------|------|
| **スコープ定義** | ✅ 良好 | 統一すべき領域の把握は正確 |
| **アーキテクチャ設計** | 🔴 要改善 | Runtime、Better Auth 共存、RPC client が未決定 |
| **実装順序** | ⚠️ 中程度 | 並列可能な項目が混在し、依存関係が不明確 |
| **見積もり（15h）** | 🔴 楽観的 | 実際は 20～30h が現実的。特に既存テスト改修が過小評価 |
| **リスク管理** | 🔴 不十分 | PoC（事前検証）がない。実装中に設計変更の可能性が高い |
| **テスト戦略** | 🔴 不明 | Unit / Integration / E2E の定義がない |

---

## 🚨 致命的な 3 つの問題

### 1️⃣ Runtime 選択が曖昧

**問題：**
- 計画には Runtime が明記されていない
- 既存の SKILL.md では「Edge Runtime 推奨」
  - しかし Drizzle ORM + PostgreSQL で Edge Runtime は接続に制限がある
  - Node Runtime が実質 必須

**リスク：** 実装途中に runtime を変更する可能性

**対応：** フェーズ 0（事前検証）で Node Runtime を確定し、document に記載

---

### 2️⃣ Better Auth 共存方法が「決定待ち」のまま

**問題：**
- 計画は「F-1: Better Auth 共存方法の確定」で決定を遅延
  - しかしこれは **フェーズ A（セットアップ）の基盤に直結**
  - フェーズ B・C の実装設計を左右する

**現在の該当部分：**
```markdown
- [ ] F-1: Better Auth 共存方法の確定
  - [ ] オプションA: 既存 /api/auth/[...all] 維持、Hono は /api 配下で独立
  - [ ] オプションB: Better Auth も Hono Middleware に統合
```

**リスク：**
- 実装開始後に「セッション検証はどこで行う?」という基本設計が変わる
- Server Actions と API エンドポイントの実装方針が異なる可能性

**対応：** フェーズ A の実装前に **必ず決定** （推奨は「パターン A」）

---

### 3️⃣ RPC Client ジェネレーション方法が仮説段階

**問題：**
- 計画では「A-5: Hono RPC クライアント生成スクリプト作成」
  - しかし **具体的な実装方法が削記されていない**
  - hono/client の ジェネレーション方法は？
  - 既存の Zod バリデーション スキーマとの関連付けは？

**例：実装時に発生しそうな問題**
```typescript
// サーバー側
export const groupsRouter = hono.post('/groups', async (c) => {
  const body = c.req.json();
  // ✗ Zod スキーマ検証はここで？middleware で？
});

// クライアント側
const client = hc<typeof groupsRouter>('/api');
// ← 型推論は正しい？エラーハンドリングのレベルは？
```

**リスク：** PoC なしで実装開始すると、クライアント側の設計が失敗する可能性

**対応：** フェーズ 0 で RPC Client の PoC を実施し、動作確認

---

## ⚠️ アーキテクチャ上の 3 つの懸念

### 4️⃣ Server Actions と Hono エンドポイントの責任が曖昧

**現状：**
- create-group / create-nation は Server Actions（既存、実装済み）
  - セッション検証 ✅
  - Zod バリデーション ✅
  - RBAC チェック ✅
  - Response 型定義 ✅

**計画：** これらを Hono API に移行する予定

**問題：**
- そのためには **同じロジックを Hono で再実装** が必要
- 既存のテスト（create-group.test.ts など）の書き換えが必要
- 「UI → Server Actions」と「UI → RPC Client → API」の 2 つの実装パターンが共存

**改善案：**
- Server Actions と Hono API の責任を明確に分ける
- 推奨：Server Actions は UI に密結合（future の「即時実行」機能）
- Hono は Admin / API 統合向け（第三者統合対応）
- **create-group / create-nation は Server Actions のまま継続運用**

---

### 5️⃣ RBAC Middleware 再実装の複雑性が過小評価

**現状：**
- `src/lib/auth/rbac-helper.ts`（426 行）
  - 4層評価（platform_admin → context role → relationship → deny）
  - React cache() による最適化
  - Server Action コンテキスト前提

**問題：**
- Hono middleware として実装する際
  - React cache() は Hono で使えない（別の快適化が必要）
  - middleware chaining で 401 vs 403 の precedence をどう決めるのか？
  - 既存の checkGroupRole() は再利用できるか？

**リスク：** フェーズ G で実装すると言っているが、実装中に設計変更の可能性が高い

**対応：** フェーズ 0 で RBAC + Hono middleware の互換性検証を実施

---

### 6️⃣ テスト戦略が計画に含まれていない

**問題：**
```markdown
計画では以下のテスト段階が想定：
- フェーズ B「ビルド & ユニットテスト」
- フェーズ C「統合テスト（e2e）」
- フェーズ H「統合テスト」

しかし：
① ユニットテスト対象は何か（明記なし）
② Integration テストの定義が不明
③ 既存の vitest + happy-dom で Hono handler テストをどう書くのか（不明）
④ 既存テストとの互換性はどうなるのか（不明）
```

**対応：** フェーズ 0 で「Hono handler テストの方法」を決定

---

## 📊 正しい実装パス

現在の計画を「修正版」に変更することを強く推奨します。

### 修正版の重要な変更点：

1. **フェーズ 0（新規、2～4h）: 事前検証と設計確定**
   - Runtime 検証（Node Runtime に決定）
   - Better Auth 共存テスト（パターン A に決定）
   - RPC Client PoC（動作確認）
   - RBAC + middleware 互換性テスト
   - テスト戦略決定

2. **フェーズ 1～5: 実装（段階的、11h）**
   - フェーズ 1: Hono セットアップ（2h）
   - フェーズ 2: Admin API（3.5h）
   - フェーズ 3: User/Group/Nation API（2.5h）
   - フェーズ 4: 通知 API（1h）
   - フェーズ 5: UI 統合（2h）

3. **責任分離の明確化**
   - Server Actions：UI に密結合、「いますぐ実行」型
   - Hono API：リソース CRUD、Admin 画面、API 統合対応

---

## ✅ 次のステップ

1. **本レビュー報告書を理解する**
   - 3 つの致命的問題を確認
   - 3 つの懸念事項を確認

2. **修正版計画を確認する**
   - `2026-03-01_HONO_IMPLEMENTATION_REVISED.md` を読む
   - フェーズ 0 の内容を理解する

3. **フェーズ 0 を実施する（4h）**
   - Runtime 検証
   - Better Auth テスト
   - RPC Client PoC
   - RBAC + middleware 互換性テスト
   - テスト戦略決定

4. **決定事項を `.agent/decisions/` に document として記録**
   - runtime-decision.md
   - better-auth-pattern.md
   - rpc-client-strategy.md
   - test-strategy.md

5. **フェーズ 0 成功後、修正版フェーズ 1 から実装開始**

---

## 📁 本レビューで作成されたドキュメント

```
schedule_todo_list/
├── 2026-03-01_HONO_INTEGRATION_TODO.md           （元の計画）
├── 2026-03-01_HONO_REVIEW_CRITIQUE.md            ✅ 詳しいレビュー（40 page）
├── 2026-03-01_HONO_IMPLEMENTATION_REVISED.md     ✅ 修正版実装計画
└── 2026-03-01_HONO_REVIEW_SUMMARY.md             ✅ このファイル（要約）
```

---

## 💡 Tips & アドバイス

### Hono 導入を成功させるための重要なポイント

1. **「決定」を先延ばしにしない**
   - Runtime、Better Auth パターン、RPC client の 3 つは
   - フェーズ 1 の実装前に **必ず決定・確定** すること
   - 実装中に変更すると、全体が崩壊する可能性

2. **段階的なアプローチを採用**
   - 一気に全 API を実装せず、Admin API（フェーズ 2）に集中
   - 成功パターンを確立してから、他の API に拡張
   - 各フェーズ終了時に必ず `pnpm build && pnpm test` で検証

3. **テスト駆動で実装**
   - Hono handler テストの方法を先に決定
   - 各エンドポイント実装時にテストを同時に書く
   - プルリクエスト時点でテストカバレッジ 80% 以上

4. **既存実装の活用**
   - Zod バリデーション スキーマは再利用
   - DB クエリ関数（group-queries.ts など）はそのまま使用
   - RBAC ロジック（rbac-helper.ts）は Hono middleware で活用

5. **エラーハンドリングを後付けしない**
   - Hono 導入時に global error handler middleware を実装
   - すべての endpoint で統一的なエラーレスポンス
   - 後付けすると二重実装になる

6. **Better Auth との共存をテストする早期段階で**
   - Server Actions + Hono API + Better Auth が同時に動作するか
   - セッション Cookie の互換性確認
   - CSRF 保護の重複がないか確認

---

**作成者:** GitHub Copilot
**評価:** ⚠️ 修正版での実装を強く推奨
