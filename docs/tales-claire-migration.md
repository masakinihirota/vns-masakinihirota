# Tales Claire Landing Page Migration

## 概要

`anti-supabase` リポジトリのランディングページ `/tales-claire` を `vns-masakinihirota` に移植した記録。

**採用アーキテクチャ**: Option D (ハイブリッド方式)
**移行日**: 2026-03-06 - 2026-03-07
**担当**: GitHub Copilot + Beast Mode 3.1

---

## 1. 移行の目的

- 既存機能を壊さずに新規 LP を追加
- **「1ページ = 1メインコンポーネント」+「バレルインポート」+「共有部品の明確分離」** の実現
- `/tales-claire` と `/` (既存 LP) の役割分担を明確化

---

## 2. アーキテクチャ設計 (Option D)

### 2.1 ディレクトリ構造

```text
src/components/
├─ landing-page/
│  ├─ index.ts                       # export * from "./tales-claire"
│  └─ tales-claire/
│     ├─ index.ts                    # tales-claireの公開面
│     ├─ tales-claire-lp.tsx         # 1ページのメインコンポーネント
│     ├─ sections/                   # ページ固有セクション
│     │  ├─ hero-section.tsx
│     │  ├─ concept-section.tsx
│     │  ├─ declarations-section.tsx
│     │  ├─ site-mission-section.tsx
│     │  ├─ identity-section.tsx
│     │  ├─ purpose-section.tsx
│     │  ├─ inspiration-section.tsx
│     │  ├─ final-goal-section.tsx
│     │  └─ footer.tsx
│     └─ components/                 # ページ固有部品
│        └─ background-canvas.tsx
├─ identity-visualization/           # 共有コンポーネント（独立）
│  ├─ index.ts
│  ├─ identity-visualization.container.tsx
│  └─ identity-visualization.presentation.tsx
├─ trial-entry/                      # 共有候補（再利用）
│  ├─ index.ts
│  ├─ trial-entry-section.container.tsx
│  └─ trial-entry-section.presentation.tsx
└─ ui/                               # 既存共通UI（維持）
   └─ ...
```

### 2.2 ルーティング方針

- **既存 `/`**: ホーム画面（認証後メイン）
- **新規 `/tales-claire`**: ランディングページ（コンセプト説明・トライアル誘導）
- **設定ファイル**: `src/config/routes.ts` に全ルート定義を集約
- **プロキシ**: `src/proxy.ts` は定義参照のみ（定義を持たない）

---

## 3. Phase 1: 環境準備

### 3.1 実施内容

✅ **ルート追加**
- `src/app/(public)/(static)/tales-claire/page.tsx` を作成
- `src/config/routes.ts` に `ROUTES.TALES_CLAIRE = "/tales-claire"` を追加
- `STATIC_PATHS` に `/tales-claire` を追加

✅ **バレル入口作成**
- `src/components/landing-page/index.ts` を作成
- `src/components/landing-page/tales-claire/index.ts` を作成

✅ **検証**
- `pnpm dev` で `/tales-claude` HTTP 200 確認
- 既存ルート `/`, `/home`, `/login` に回帰なし

---

## 4. Phase 2: コンポーネント移行

### 4.1 tales-claire 固有部品の移行

✅ **セクション移行** (`sections/`)
- `hero-section.tsx` - ヒーローセクション・タイトル
- `concept-section.tsx` - コンセプト説明
- `declarations-section.tsx` - 宣言セクション
- `site-mission-section.tsx` - サイトミッション
- `identity-section.tsx` - アイデンティティ可視化
- `purpose-section.tsx` - 目的・理由
- `inspiration-section.tsx` - インスピレーション源
- `final-goal-section.tsx` - 最終目標
- `footer.tsx` - フッター

✅ **コンポーネント移行** (`components/`)
- `background-canvas.tsx` - Canvas 背景アニメーション

### 4.2 共有部品の移行

✅ **identity-visualization** (独立ディレクトリ)
- Container/Presentation 分離を維持
- `src/components/identity-visualization/` に配置

✅ **trial-entry** (再利用)
- `src/components/trial-entry/` に配置
- トライアル開始セクションとして複数ページで利用

### 4.3 メイン統合

✅ **`tales-claire-lp.tsx`**
- ページ唯一のメインコンポーネント
- 全セクションを統合・レイアウト
- BackgroundCanvas + 各セクションの配置

✅ **`page.tsx`**
- 薄いラッパー（Server Component）
- `@/components/landing-page` から TalesClaireLP をインポート

### 4.4 検証

✅ **/tales-claire 全セクション表示**
- HTTP 200 応答
- 全セクションのレンダリング確認

✅ **レスポンシブ対応**
- Tailwind CSS の responsive クラス適用
  - `md:text-7xl`, `md:text-4xl`, `md:text-xl`
  - `md:hidden` (モバイルでの改行制御)
  - `max-w-5xl`, `px-6`, `gap-16`

✅ **ダークモード対応**
- `dark:*` クラスによる自動切替
- `dark:from-white`, `dark:to-indigo-300`, `dark:text-muted-foreground`

✅ **アニメーション・インタラクション**
- Canvas 背景アニメーション
- ホバー効果: `group-hover/feature:opacity-100`
- トランジション: `transition-opacity duration-300`

---

## 5. Phase 3: テスト・最適化・文書化

### 5.1 型安全性の強化

✅ **Logger 型修正**
- `logger.error()` の全パターンを型安全な形式に統一
- 修正ファイル:
  - `src/lib/api/routes/admin.ts` (15箇所)
  - `src/lib/api/routes/groups.ts` (4箇所)
  - `src/lib/api/routes/nations.ts` (3箇所)
  - `src/lib/db/admin-queries.ts` (1箇所)
  - `src/lib/api/middleware/error-handler.ts` (1箇所)
  - `src/lib/db/local-storage-adapter.ts` (1箇所)
  - `src/lib/trial-signature.ts` (1箇所)
  - `src/lib/db/groups.ts` - GroupMember型定義修正

### 5.2 ビルド安定化

✅ **環境変数追加**
- `TRUSTED_ORIGINS=http://localhost:3000`
- `CORS_ALLOWED_ORIGINS=http://localhost:3000`

✅ **ビルド成功**
- `pnpm build` 完全成功 (exit code: 0)
- TypeScript コンパイル通過
- Next.js 16.1.6 (Turbopack) ビルド完了

### 5.3 ESLint/型整備

✅ **Tailwind CSS クラス名修正**
- `bg-gradient-to-r` → `bg-linear-to-r`
- `bg-gradient-to-br` → `bg-linear-to-br`
- `dark:bg-white/[0.01]` → `dark:bg-white/1`
- `dark:bg-white/[0.02]` → `dark:bg-white/2`

### 5.4 パフォーマンス最適化

✅ **負荷測定を実施**
- Lighthouse 計測結果: Performance **59** / Accessibility **100**
- 本番モード (`pnpm build` + `pnpm start`) で測定

✅ **分割読み込みを適用**
- `tales-claire-lp.tsx` で `IdentitySection` / `InspirationSection` を `next/dynamic` 化

✅ **再レンダリング抑制を適用**
- `HeroSection` / `PurposeSection` に `React.memo` を適用

### 5.5 テスト実装

✅ **コンポーネントテストを追加**
- コロケーション配置 (*.test.tsx)
- React Testing Library + Vitest
- 追加: `hero-section.test.tsx`, `purpose-section.test.tsx`, `tales-claire-lp.test.tsx`

✅ **ページ統合テストを追加**
- 追加: `tales-claire-page.integration.test.tsx`

✅ **アクセシビリティテストを追加**
- `vitest-axe` による主要 a11y チェックを実装
- 追加した4ファイルのテストは全てパス

### 5.6 アセット移行

⏸️ **画像最適化** (後続タスク)
- next/image による最適化
- 遅延読み込み適用

---

## 6. 実装時のルール (実施済み)

✅ **ルート定義の集約**
- `src/config/routes.ts` に全定義を集約
- `src/proxy.ts` は参照のみ

✅ **1ページ = 1メインコンポーネント**
- `tales-claire-lp.tsx` がページの唯一のメインコンポーネント
- セクションは `sections/` に分離

✅ **バレル経由 import**
- `@/components/landing-page` 経由でインポート
- 公開面を固定

✅ **Logger の使用**
- `console.log` は使用せず `logger.*` を使用

✅ **既存ページの維持**
- `/` (ホーム画面) は移行完了まで維持

---

## 7. 完了条件 (Definition of Done)

### 7.1 完了済み項目

✅ `/tales-claire` が本番相当で動作
✅ 既存ルートに回帰なし
✅ バレル構造が固定され、import規約が守られている
✅ ビルドが全て通過
✅ 移行ドキュメントが更新済み (本ドキュメント)

### 7.2 残タスク

⏸️ 本番画像への差し替え（現状は placehold.co）
⏸️ Lighthouse Performance 90+ の達成（現状: 59、Accessibility: 100）
⏸️ 必要に応じた E2E 追加

---

## 8. 既存 LP との役割分担

### 8.1 `/` (既存ホーム画面)

- **用途**: 認証後のメイン画面
- **対象**: 既存ユーザー
- **機能**: ダッシュボード、ナビゲーション

### 8.2 `/tales-claire` (新規 LP)

- **用途**: コンセプト説明・トライアル誘導
- **対象**: 初回訪問者・未登録ユーザー
- **機能**: サービス紹介、価値提案、トライアル開始

---

## 9. 今後の運用方針

### 9.1 機能追加時のルール

- `/tales-claire` 固有の機能は `src/components/landing-page/tales-claire/` 配下に配置
- 複数ページで再利用する部品は `src/components/` 直下に独立ディレクトリとして配置
- バレル (`index.ts`) を必ず作成し、公開面を固定

### 9.2 テストの配置

- コンポーネント近接テスト (コロケーション)
- `*.test.tsx` をコンポーネントと同じディレクトリに配置
- システムテストは `tests` 専用ディレクトリに配置

### 9.3 継続的改善

- Lighthouse スコアの定期測定
- Canvas パフォーマンス最適化
- a11y 改善

---

## 10. Lessons Learned

### 10.1 成功した点

- **Option D の採用**: 既存コードを壊さずに新規機能を追加できた
- **バレル構造**: import パスが安定し、公開面の管理が容易
- **型安全性の強化**: Logger 修正により TypeScript エラーを一掃
- **環境変数の整備**: ビルド安定化に貢献

### 10.2 改善点

- **ESLint ルールの調整**: Tailwind CSS クラス名の警告が残存
- **テストの追加**: コンポーネントテストが未実装
- **パフォーマンス測定**: Canvas 負荷の定量評価が必要

---

## 11. 関連ドキュメント

- [プロジェクト全体アーキテクチャ](./ARCHITECTURE_FOUNDATION.md)
- [RBAC 設計](./rbac-route-matrix.md)
- [テスト戦略](./testing-strategy.md)
- [パフォーマンス最適化](./performance-optimization-complete.md)

---

**最終更新**: 2026-03-07
**ステータス**: Phase 2 完了 / Phase 3 進行中
**次のステップ**: テスト実装・パフォーマンス最適化
