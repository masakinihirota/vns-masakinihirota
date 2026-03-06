# Sidebarの実装計画

## 概要
`/home` (ログイン後のトップ画面) に左サイドメニュー（shadcn/ui radix sidebar）を実装する。
デザインと構造は `vns-masakinihirota-auth` の `/home` の実装を参考にする。

## タスクリスト
- [x] 1. 必要なパッケージやUIコンポーネント（shadcn/ui sidebar, Lucide iconsなど）が不足していないか確認（今回は既に ui/sidebar はある模様）
- [x] 2. サンプルの `AppSidebar.tsx` や関連レイアウトコンポーネントを分析する
- [ ] 3. `src/components/layout/app-sidebar/` などを target project に作成・移植する
- [ ] 4. `src/app/(protected)/layout.tsx` を修正して、`SidebarProvider`, `AppSidebar`, `SidebarInset`, `GlobalHeader` などでラップする
- [ ] 5. `/home` 画面がサイドバー付きで正しく表示されることを確認する
- [ ] 6. 動作確認・テストの実行（vitest-axeでのアクセシビリティチェック含む）
