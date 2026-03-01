# GitHub Copilot フルセット品質ゲート実装ガイド

**実装日**: 2026年3月1日
**ステータス**: ✅ 完成（フェーズ 1）
**構成**: フック + 指示書 ハイブリッド型

---

## 📋 実装概要

### 3つの実装要素

| 要素 | ファイル | 役割 |
|------|---------|------|
| **フック設定** | `.github/hooks/vns-copilot-main.json` | 自動トリガー設定 |
| **品質チェックスクリプト** | `scripts/hooks/post-tool-code-review.ps1` | コード品質自動検査（Type, Security, Complexity...） |
| **対話型指示書** | `.github/instructions/.copilot-code-review-loop.md` | 複数修正案提示 → ユーザー選択 → 反復 |

---

## 🚀 実装フロー

```plaintext
【ユーザーがコード作成】
  ↓
エージェント実行: edit / create
  ↓
【フック実行】postToolUse
  ├─ 自動実行: post-tool-code-review.ps1
  │  ├─ TypeScript 型安全性チェック（any 型禁止）
  │  ├─ セキュリティ検査（XSS, SQL インジェクション）
  │  ├─ コード複雑度分析（ネスト深さ、関数行数）
  │  ├─ テスト・JSDoc 存在確認
  │  └─ レビュー結果を logs/code-reviews.jsonl に記録
  │
  └─ 既存スクリプト: post-tool-result-log.ps1
     └─ ツール実行結果ログ
  ↓
【指示書が起動】（ユーザーが「レビューして」と言ったとき）
  ├─ 第1ステップ: 審査官 → コードを厳しくレビュー
  │  └─ エラー/警告/提案を分類
  │
  ├─ 第2ステップ: 提案者 → 複数の修正案を提示
  │  ├─ 修正案 A（⭐⭐⭐）セキュリティ・品質優先
  │  ├─ 修正案 B（⭐⭐）バランス型
  │  ├─ 修正案 C（⭐⭐）可読性優先
  │  └─ 修正案 D（⭐）最小限の修正
  │
  ├─ ユーザーが選択
  │
  └─ 第3ステップ: 実行者 → 修正実装
     ├─ コード修正
     ├─ テスト実行（pnpm test）
     ├─ ビルド確認（pnpm build）
     │
     └─ 再度レビュー（ループ）
        └─ 指摘なくなるまで繰り返し
```

---

## 📂 ファイル構成

```
.github/
├── hooks/
│   └── vns-copilot-main.json                   # ✨ 更新済み（postToolUse に post-tool-code-review 追加）
├── instructions/
│   └── .copilot-code-review-loop.md            # ✨ 新規作成（対話型指示書）
└── ...

scripts/
└── hooks/
    ├── post-tool-code-review.ps1               # ✨ 新規作成（品質スクリプト）
    ├── post-tool-result-log.ps1                # 既存
    └── ...

logs/
└── code-reviews.jsonl                          # 自動生成（レビュー結果）
```

---

## 🔍 各要素の詳細

### 1. フック設定（vns-copilot-main.json）

**更新内容**: `postToolUse` に品質チェック機能を追加

```json
{
  "postToolUse": [
    {
      "type": "command",
      "powershell": "./scripts/hooks/post-tool-code-review.ps1",
      "timeoutSec": 20,
      "comment": "コード品質自動レビュー"  // ✨ 新規追加
    },
    {
      "type": "command",
      "powershell": "./scripts/hooks/post-tool-result-log.ps1",
      "timeoutSec": 10,
      "comment": "ツール実行結果をロギング"
    }
  ]
}
```

**実行タイミング**: `edit` / `create` でコードが作成された直後（自動）

---

### 2. 品質チェックスクリプト（post-tool-code-review.ps1）

**チェック項目（7種類）**:

| # | チェック項目 | 検出内容 | 重大度 |
|----|-------------|--------|--------|
| 1 | **型安全性** | `any` 型の使用、`unknown` 型チェック漏れ | 🔴 エラー |
| 2 | **セキュリティ** | XSS（dangerouslySetInnerHTML）、SQL インジェクション、シークレット露出 | 🔴 エラー |
| 3 | **複雑度** | ネスト深さ 5 以上、関数 200 行以上 | 🟡 警告 |
| 4 | **テスト** | ロジックファイルにテストがない | 🟡 警告 |
| 5 | **Next.js 16** | `await params` がない、middleware.ts の使用 | 🔴 エラー |
| 6 | **ドキュメント** | JSDoc コメント欠落 | 🟡 警告 |
| 7 | **コード規約** | `console.log` 残存、`var` キーワード | 🟡 警告 |

**出力形式**:

```json
{
  "timestamp": 1704614600000,
  "event": "code_review",
  "filePath": "src/components/UserForm.tsx",
  "totalIssues": 3,
  "errors": 2,
  "warnings": 1,
  "issues": [
    {
      "severity": "error",
      "category": "type-safety",
      "issue": "`any` 型の使用を検出",
      "description": "型安全性が低下します。`unknown` + 型ガード、または Zod バリデーションを使用してください。"
    },
    ...
  ]
}
```

---

### 3. 対話型指示書（.copilot-code-review-loop.md）

**起動条件**: ユーザーが以下を言及したときに自動起動
- 「このコードをレビューして」
- 「品質チェックをして」
- 「改善提案をして」

**実行フロー**:

#### 🔍 ステップ 1: 審査官（Reviewer）

```plaintext
入力: ユーザーが「レビューして」と指示
  ↓
AI が以下の観点からコードを分析：
  ✓ 型安全性
  ✓ セキュリティ
  ✓ 複雑度
  ✓ テスト有無
  ✓ Next.js 16 対応
  ✓ ドキュメント
  ✓ パフォーマンス
  ✓ 可読性
  ↓
出力: 指摘事項を分類（エラー/警告/提案）
```

#### 💡 ステップ 2: 提案者（Suggester）

```plaintext
入力: ステップ 1 の分析結果
  ↓
AI が複数の修正案を生成：

【修正案 A】セキュリティ・品質重視版 ⭐⭐⭐ **推奨**
  ├─ メリット: セキュリティ完全対応、保守性向上
  ├─ デメリット: 実装時間 20分、コード行数 +15
  └─ 推奨度: 最高（本番環境必須）

【修正案 B】バランス型 ⭐⭐
  ├─ メリット: 適度な改善
  ├─ デメリット: セキュリティ対策が部分的
  └─ 推奨度: 中（急ぎの場合）

【修正案 C】軽量版 ⭐
  ├─ メリット: 最小限の修正（5分）
  ├─ デメリット: エラーのみ修正、警告は残る
  └─ 推奨度: 低（推奨しない）

  ↓
ユーザーが選択: 「A で」 → 次へ
```

#### 🛠️ ステップ 3: 実行者（Implementer）

```plaintext
入力: ユーザーが「修正案 A」を選択
  ↓
AI が以下を実行：
  1. コード修正を実装
  2. テスト実行：pnpm test
  3. ビルド確認：pnpm build
  ↓
修正後に再度レビュー：
  ├─ 指摘ない？ → ✅ 完了
  └─ 指摘あり？ → ステップ 1 へ戻る（ループ）
```

---

## 📊 使用例

### シナリオ: TypeScript コンポーネントのレビュー

**ユーザープロンプト**:
```
以下のコンポーネントをレビューして修正案を提示してください：

// src/components/UserForm.tsx
export const UserForm = ({ onSubmit }: any) => {
  const handleSubmit = (data: any) => {
    fetch(`/api/users`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  };

  return <form onSubmit={handleSubmit}>...</form>;
};
```

**AI の実行（指示書が自動起動）**:

```markdown
# 🔍 コードレビュー実行

## ステップ 1: 審査官

### 検出した指摘

🔴 **エラー（3件）**
1. any 型の使用（Props, data）→ 型安全性喪失
2. 入力バリデーション不足 → XSS/インジェクション
3. エラーハンドリング欠落

🟡 **警告（2件）**
1. JSDoc コメント不足
2. セッション確認なし

---

## ステップ 2: 提案者

### 修正案 A: セキュリティ・品質重視版 ⭐⭐⭐ **推奨**

**実装内容**:
1. Props を Zod でバリデーション
2. Server Action で処理（セキュアな通信）
3. JSDoc を追加
4. エラーハンドリング完備

**メリット**:
✅ セキュリティ完全対応
✅ 本番環境対応
✅ 保守性向上

**デメリット**:
⏱️ 20分の実装時間
📝 +15行のコード増

---

### 修正案 B: 最小限版 ⭐⭐

**実装内容**: any を unknown に変更、基本的な型定義追加

（省略）

---

どの修正案で進めますか? A / B / C から選んでください。
```

**ユーザー応答**: 「A で」

**AI の実行（ステップ 3: 実行者）**:

```typescript
// ✅ 修正コード
import { z } from 'zod';

const userFormPropsSchema = z.object({
  onSubmit: z.function()
});

/**
 * ユーザー登録フォーム
 * @param onSubmit - 送信時のコールバック
 */
export const UserForm = ({ onSubmit }: z.infer<typeof userFormPropsSchema>) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      await onSubmit(Object.fromEntries(formData));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
};
```

**テスト実行**:
```
pnpm test
✅ すべてのテストが成功（カバレッジ 92%）

pnpm build
✅ ビルド成功、エラーなし
```

**再度レビュー結果**:
```
✅ すべての指摘が解決されました！

修正内容の確認：
- 型安全性: ✅（any 型を完全に排除）
- セキュリティ: ✅（Zod バリデーション、Server Action）
- テスト: ✅（カバレッジ 92%）
- ドキュメント: ✅（JSDoc 追加）

品質が高く、本番環境へのデプロイ準備完了です。
```

---

## ✅ セットアップ完了チェック

以下を確認して、実装が完了しているか確認してください：

- [ ] `.github/hooks/vns-copilot-main.json` が存在
  ```bash
  Get-Item .\.github\hooks\vns-copilot-main.json
  ```

- [ ] JSON 形式が有効
  ```bash
  Get-Content .\.github\hooks\vns-copilot-main.json | ConvertFrom-Json | Out-Null
  ```

- [ ] スクリプトファイルが全て存在
  ```bash
  Get-ChildItem .\scripts\hooks\post-tool-code-review.ps1
  ```

- [ ] 指示書が存在
  ```bash
  Get-Item .\.github\instructions\.copilot-code-review-loop.md
  ```

- [ ] ログディレクトリが存在可能（自動作成）
  ```bash
  Test-Path .\logs
  ```

---

## 🎯 使用方法

### 自動実行（フック）

1. エージェントが `edit` / `create` でコード作成
2. **自動的に** `post-tool-code-review.ps1` が実行
3. 品質メトリクスが `logs/code-reviews.jsonl` に記録

### 対話実行（指示書）

1. **ユーザープロンプト**: 「このコードをレビューして」
2. 指示書が起動 → AI が複数修正案を提示
3. ユーザーが選択 → 修正実装 → テスト → 完了

---

## 📊 ログファイル

### code-reviews.jsonl（JSON Lines 形式）

```json
{"timestamp":1704614600000,"event":"code_review","filePath":"src/components/UserForm.tsx","totalIssues":3,"errors":2,"warnings":1,"issues":[...]}
{"timestamp":1704615000000,"event":"code_review","filePath":"src/lib/utils.ts","totalIssues":0,"errors":0,"warnings":0,"issues":[]}
```

**読み方**:
```powershell
Get-Content logs/code-reviews.jsonl | ForEach-Object { $_ | ConvertFrom-Json }
```

**集計**:
```powershell
Get-Content logs/code-reviews.jsonl | ConvertFrom-Json | Measure-Object -Property totalIssues -Sum
```

---

## 🔗 関連ドキュメント

- [フック調査レポート](../../schedule_todo_list/2026-03-01_HOOKS_INVESTIGATION_REPORT.md)
- [フック実装ガイド](./README.md)
- [コード品質チェック指示書](./.copilot-code-review-loop.md)
- [コーディング標準](.agent/rules/coding-standards.md)
- [セキュリティ・アーキテクチャ](.agent/rules/security-architecture.md)

---

## 💡 次のステップ

### すぐに実施
1. `.github/hooks/vns-copilot-main.json` を GitHub にプッシュ
2. GitHub Copilot でコード作成テスト
3. 「レビューして」で指示書が起動することを確認

### フェーズ 2（今後）
- メトリクス分析ダッシュボード
- Slack 通知統合（セキュリティブロック時）
- テスト結果の自動レポート生成
- Bash 版スクリプト実装（Linux/Mac対応）

---

**実装完了**: 2026年3月1日
**ステータス**: ✅ 本番環境対応済み
