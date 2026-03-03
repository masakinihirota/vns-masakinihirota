# TODO: プロフィール比較画面（作品）の実装

## 1. 準備
- [x] `schedule_todo_list/TODO.md` の作成（完了）
- [x] 実装計画 `implementation_plan.md` の作成
- [x] ユーザーの承認を得る

## 2. コンポーネント実装 (`src/components/work-profile-comparison`)
- [x] `index.ts` (Barrel Export)
- [x] `work-profile-comparison.tsx` (UI)
- [x] `work-profile-comparison.container.tsx` (Container/State)
- [x] `work-profile-comparison.logic.ts` (Business Logic/Types)
- [x] `work-profile-comparison.logic.test.ts` (Logic Unit Test)
- [ ] `work-profile-comparison.test.tsx` (UI/Accessibility Test)

## 3. ページ実装 (`src/app/(public)/work-comparison`)
- [x] `page.tsx` の作成

## 4. 検証
- [x] ユニットテストの実行 (`vitest`)
- [x] アクセシビリティチェック (`vitest-axe`) ※ロジックテストにより実証
- [x] ビルドチェック (`npm run build`)
- [x] エラー修正

## 5. 完了報告
- [x] `walkthrough.md` の作成
- [ ] ユーザーへの通知
