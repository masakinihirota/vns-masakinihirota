# Root Accounts Component

ルートアカウント（ユーザーの基本情報、活動エリア、使用言語など）の管理を行うコンポーネント群です。

## Directory Structure

```
src/components/root-accounts/
├── root-account-dashboard/     # メインダッシュボード機能
│   ├── __tests__/              # 単体テスト
│   ├── point-management.tsx    # ポイント管理セクション
│   ├── root-account-dashboard.dummyData.ts
│   ├── root-account-dashboard.logic.ts # 抽出されたビジネスロジック
│   ├── root-account-dashboard.tsx      # メインビュー
│   └── root-account-dashboard.types.ts
```

## Refactoring Summary (Boy Scout Rule)

- **ロジックの抽出**:
  - `root-account-dashboard.tsx` 内の巨大な保存処理 (`handleSave*`) や履歴計算処理を `root-account-dashboard.logic.ts` に抽出しました。
  - これにより、コンポーネントが UI と状態管理に集中できるようになり、テストの容易性が向上しました。
- **try/catch の制限対応**:
  - React コンポーネント内での `try/catch` 構文を避け、`.then().catch()` パターンに書き換えることで、ESLint ルールに適合させました。
- **型安全性の向上**:
  - テストコード内の `any` 型を具体的な型に置き換えました。
  - Next.js の `Image` コンポーネントのモックを改善しました。
- **重複コードの削減**:
  - `setOriginalData(formData)` などの二重呼び出しを整理しました。
