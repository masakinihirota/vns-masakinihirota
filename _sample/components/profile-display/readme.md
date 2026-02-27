# Profile Display Component

プロフィールの詳細（実績、好きな作品、価値観、スキル）を表示・編集するためのコンポーネント群です。

## Directory Structure

```
src/components/profile-display/
├── features/                  # メイン機能ロジック
│   ├── profile-dashboard.container.tsx
│   ├── profile-dashboard.hook.ts
│   ├── profile-dashboard.tsx
│   └── profile-dashboard.types.ts
├── sections/                  # 各セクション単位のコンポーネント
│   ├── favorites-section.tsx
│   ├── skills-section.tsx
│   ├── values-section.tsx
│   └── works-section.tsx
└── ui/                        # コンポーネント専用UI部品
    ├── add-button.tsx
    ├── delete-confirm-modal.tsx
    ├── editable-cell.tsx
    ├── rating-cell.tsx
    ├── section-header.tsx
    ├── sort-header.tsx
    ├── theme-toggle.tsx
    └── visibility-toggle.tsx
```

## Refactoring Summary (Boy Scout Rule)

- **型安全性の向上**:
  - `any` 型を排除し、`Work`, `Favorite`, `CoreValue`, `Skill` などの具体的な型を適用しました。
  - `useProfileDashboard` フック内のソート処理 (`getSortedData`) のジェネリクスを改善しました。
- **Immutability**:
  - Props インターフェースに `readonly` 修飾子を付加し、不変性を確保しました。
- **コード品質**:
  - `ProfileDashboard` コンポーネント内の不要な型キャスト (`as any`) を削除しました。
