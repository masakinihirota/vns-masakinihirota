---
description: 新しいページ（Route）が作成された際、開発リンク集（Roadmap）を自動的に更新するための命令
---

# Roadmap Sync Hook

新しいページ（Next.js の `/app` 配下の `page.tsx` など）を作成した際は、必ず以下の手順を実行してください。

## 1. 開発リンク集への追加

`u:\2026src\vns-masakinihirota.worktrees\anti\src\components\dev-dashboard\portal-dashboard.logic.tsx` を開き、`ALL_SECTIONS` 配下の適切なセクションに、新しく作成したページの情報を追加してください。

### 追加する情報の例:
```typescript
{
  title: "ページ名",
  path: "/path/to/page",
  desc: "ページの説明",
  badge: "New", // 必要に応じて
},
```

## 2. 整合性の確認

追加後、開発リンク集（Roadmap）画面で正しく表示されるか、リンクが有効かを確認してください。

## 3. ユーザーへの報告

「開発リンク集に〇〇ページを追加しました」とユーザーに報告してください。
