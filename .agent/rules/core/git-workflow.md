---
trigger: always_on
---

# Git ワークフロー基準 (Git Workflow Standards)

VNS masakinihirota プロジェクトにおける、安全で効率的な開発のための Git 運用ルールを定義します。

## 1. ブランチ戦略

### ブランチ構成
- **`main`**: 本番環境にデプロイされる安定版ブランチ。直接プッシュ禁止。
- **`develop`**: 開発環境用ブランチ。次期リリースの統合先。
- **`feature/<name>`**: 新機能開発用。`develop` から分岐し、`develop` へマージ。
- **`fix/<name>`**: バグ修正用。
- **`hotfix/<name>`**: 本番環境の緊急修正用。`main` から分岐し、`main` と `develop` 両方にマージ。

### 命名規則
- ケバブケースを使用（例: `feature/user-profile-edit`）。
- 目的を明確にするプレフィックス（`feature/`, `fix/`, `refactor/`, `docs/`, `test/`）を付ける。

## 2. コミットメッセージ

### 言語設定
- **日本語**で記述する。

### フォーマット (Conventional Commits 準拠)
```
<type>: <subject>

<body>
```

- **Example**:
  ```
  feat: ユーザープロフィール編集機能の実装

  - プロフィール画像のアップロード処理を追加
  - ニックネームのバリデーションを強化
  ```

### Types
- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメントのみの変更
- `style`: コードの動作に影響しない変更（フォーマット等）
- `refactor`: リファクタリング
- `perf`: パフォーマンス改善
- `test`: テスト関連
- `chore`: ビルドプロセスやツールの変更

## 3. PR (Pull Request) / MR (Merge Request)

### レビュー必須
- 原則として、他者（またはAI）によるレビュー承認がないとマージできない。
- AI生成コードも、必ず人間がレビューすること。

### マージ戦略
- **Squash Merge** を推奨。機能単位でコミット履歴を綺麗に保つため。
- マージ後のブランチは自動削除する。

### CI チェック
- 以下の自動チェックが全てパスしていること：
  - ビルド (`npm run build`)
  - リント (`npm run lint`)
  - テスト (`npm run test`)
