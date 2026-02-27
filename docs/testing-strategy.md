# テスト戦略

## テストの種類

### 1. ユニットテスト (`*.test.tsx` / `*.test.ts`)
各コンポーネント、関数の近くにコロケーション配置します。

**対象:**
- UI コンポーネント (`src/components/ui/*.test.tsx`)
- 認証ヘルパー (`src/lib/auth/helper.test.ts`)
- データベースクエリ (`src/lib/db/*.test.ts`)

**実行:**
```bash
pnpm test:unit
```

### 2. 統合テスト (`src/__tests__/integration/`)
システム全体の振る舞いを検証します。

**対象:**
- 認証フロー全体 (`auth-flow.integration.test.ts`)
- データベース操作 (`db-integration.test.ts`)
- API エンドポイント (`api-integration.test.ts`)

**実行:**
```bash
pnpm test:integration
```

### 3. E2Eテスト (`tests/e2e/`)
実際のブラウザでユーザーシナリオをテストします。

**対象:**
- ログイン・サインアップフロー
- ページナビゲーション
- 権限チェック

**実行:**
```bash
pnpm test:e2e
```

## テストカバレッジ目標

- **ユニットテスト:** 80%以上
- **統合テスト:** 主要なユーザーフロー全てカバー
- **E2Eテスト:** クリティカルパス全てカバー

## TDD サイクル

1. **Red**: テストを書く（失敗する）
2. **Green**: 最小限の実装でテストを通す
3. **Refactor**: コードをリファクタリング

## テスト実行コマンド

```bash
# 全テスト実行
pnpm test

# ユニットテストのみ
pnpm test:unit

# 統合テストのみ
pnpm test:integration

# E2Eテストのみ
pnpm test:e2e

# カバレッジ付きで実行
pnpm test:coverage

# ウォッチモード
pnpm test:watch
```

## テストデータ管理

- テスト用のDBは必ず分離（`DATABASE_URL_TEST` 環境変数）
- テスト前に必ずDBをクリーンアップ
- ファクトリーパターンでテストデータ生成

## モックとスタブ

- 外部API呼び出しは必ずモック
- DBアクセスは統合テスト以外はモック推奨
- `vitest.mock()` を使用してモジュールをモック

## CI/CD パイプライン

```yaml
# GitHub Actions例
- name: Run Tests
  run: |
    pnpm test:unit
    pnpm test:integration
    pnpm test:e2e
```

## 参考リンク

- [Vitest公式ドキュメント](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright (E2E)](https://playwright.dev/)
