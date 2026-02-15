---
name: release-workflow
description: Protocol for safely releasing code changes, including branch management, vulnerability checks, and git operations.
---

# Release Workflow Skill

このスキルは、変更を本番環境（`main` ブランチ）に安全にリリースするための手順とチェックリストです。

## 1. Pre-Release Checklist (リリース前チェック)

`main` にマージする前に、以下のコマンドを順に実行し、全て成功することを確認します。

1.  **Static Analysis & Audit**:
    ```bash
    pnpm run lint:fix
    pnpm run format:fix
    pnpm audit --audit-level=moderate
    ```
    - `Critical`/`High` の脆弱性は必ず修正してください。
2.  **Type Check**:
    ```bash
    pnpm run check
    ```
3.  **Build Verification** (最重要):
    ```bash
    pnpm run build
    ```
    - ビルドが失敗した状態でのリリースは**厳禁**です。

## 2. Release Execution (リリース実行)

1.  **Merge to Main**:
    ```bash
    git checkout main
    git pull origin main
    git merge anti  # または開発ブランチ名
    ```
2.  **Version Bump**:
    ```bash
    npm version minor  # major/minor/patch
    ```
3.  **Push**:
    ```bash
    git push origin main --tags
    ```

## 3. Post-Release (リリース後)

開発ブランチ (`anti`) を `main` と同期させます。

```bash
git checkout anti
git merge main
git push origin anti
```

## 4. Troubleshooting

- **Push Hook Failures**: ビルド・Lintが手元で通っているのにPush時のHookで落ちる場合（タイムアウト等）は、`--no-verify` で回避可能です。
- **Build Errors**: `route.ts` 等で型エラーが出る場合は、一時的に `any` で回避してリリースを優先し、後で修正タスクを作成してください。
