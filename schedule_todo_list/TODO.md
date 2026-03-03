# お試し星座匿名選択ページ 実装 TODO

## 1. 準備・設計
- [x] 実装計画の作成と承認
- [x] `schedule_todo_list/TODO.md` の初期化

## 2. ロジックの実装 (TDD)
- [x] `onboarding-flow.logic.ts` の作成
    - [x] ステップ管理ロジックの定義
    - [x] 名前生成（`anonymous-name-generator`）との連携
    - [x] `localStorage` 保存・復元ロジック
- [ ] `onboarding-flow.logic.test.ts` による検証 (相対パス修正中)

## 3. コンポーネントの実装
- [ ] `steps/` 配下の各UIコンポーネント作成
    - [ ] `zodiac-step.tsx`
    - [ ] `generate-step.tsx`
    - [ ] `confirm-step.tsx`
    - [ ] `experience-step.tsx`
- [ ] `onboarding-flow.tsx` (UI) の作成
- [ ] `onboarding-flow.container.tsx` (State) の作成
- [ ] `onboarding-flow.test.tsx` でのUI（表示・アクセシビリティ）検証

## 4. 統合・最終確認
- [ ] `src/app/(trial)/onboarding-trial/page.tsx` の作成
- [ ] 手動での動作確認（ステップ遷移、データ永続化）
- [ ] ビルドチェックと型エラー修正
- [ ] `tasks/lessons.md` への記録（必要に応じて）

## レビューセクション
| 日付 | 内容 | 結果 |
|------|------|------|
| 2026-03-03 | 実装計画の策定 | 承認待ち |
