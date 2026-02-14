---
name: safe-release-protocol
description: Protocol for safely releasing code changes, including branch management, pre-release checks, and handling git hook failures.
---

# Safe Release Protocol

This protocol defines the standard workflow for releasing changes to production (`main` branch) and managing version tags.

## 1. Pre-Release Checklist

Before merging to `main`, ensure the `anti` (development) branch is clean and verified.

1.  **Static Analysis**:
    ```bash
    pnpm run lint:fix
    pnpm run format:fix
    pnpm audit --audit-level=moderate
    ```
2.  **Type Check**:
    ```bash
    pnpm run check  # or tsc --noEmit
    ```
3.  **Build Verification** (Crucial):
    ```bash
    pnpm run build
    ```
    _If build fails, DO NOT PROCEED. Fix the build on `anti` first._

## 2. Release Workflow

1.  **Merge to Main**:
    ```bash
    git checkout main
    git pull origin main
    git merge anti
    ```
2.  **Version Bump**:
    ```bash
    npm version minor # or patch/major
    # This creates a package.json update and a git tag
    ```
3.  **Push to Remote**:
    ```bash
    git push origin main --tags
    ```

## 3. Post-Release Sync

Keep the development branch in sync.

1.  **Sync Anti**:
    ```bash
    git checkout anti
    git merge main
    ```
2.  **Push Anti**:
    ```bash
    git push origin anti
    ```

## 4. Troubleshooting

### Pre-push Hook Failures (Husky/Oxlint)

If `git push` fails due to a pre-push hook (e.g., exit code 139, segfault, or timeout), and you have **already verified** the build and linting manually in Step 1:

1.  **Retry**: Sometimes it's a transient issue.
2.  **Bypass**: If the issue persists and you are confident in the code quality (because Step 1 passed):
    ```bash
    git push origin anti --no-verify
    ```
    _Note: Do not use `--no-verify` to bypass legitimate lint errors. Only use it if the hook tool itself is crashing._

### Build Errors in `route.ts`

If `next build` fails on type errors in API routes:

- Check for `Context` type imports.
- Temporarily use `any` if strictly necessary to unblock a critical release, then create a follow-up task to fix types.

### Editor Corruptions

If syntax errors appear that don't make sense (e.g., invisible characters, broken strings):

- Use `view_file` to inspect the raw content.
- `write_to_file` (overwrite) the entire file with clean code rather than trying to patch it repeatedly.
