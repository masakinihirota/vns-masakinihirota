---
name: tdd-workflow
description: 新機能開発、バグ修正、リファクタリング時に使用するスキル。ユニットテスト、統合テスト、E2Eテストを含む80%以上のカバレッジを伴うテスト駆動開発を強制します。
---

# Test-Driven Development Workflow (TDDワークフロー)

このスキルは、すべてのコード開発が包括的なテストカバレッジを伴うTDDの原則に従うことを保証します。

## 適用タイミング (When to Activate)

- 新機能や機能性の実装時
- バグや問題の修正時
- 既存コードのリファクタリング時
- APIエンドポイントの追加時
- 新しいコンポーネントの作成時

## 基本原則 (Core Principles)

### 1. コードの前にテスト (Tests BEFORE Code)

常にテストを最初に書き、その後テストに通るようにコードを実装してください。

### 2. カバレッジ要件 (Coverage Requirements)

- 最小 80% のカバレッジ (ユニット + 統合 + E2E)
- すべてのエッジケースをカバー
- エラーシナリオのテスト
-境界条件の検証

### 3. テストの種類 (Test Types)

#### ユニットテスト (Unit Tests)

- 個々の関数とユーティリティ
- コンポーネントロジック
- 純粋関数
- ヘルパーとユーティリティ

#### 統合テスト (Integration Tests)

- APIエンドポイント
- データベースロジック
- サービス間の相互作用
- 外部API呼び出し

#### E2Eテスト (Playwright)

- クリティカルなユーザーフロー
- 完全なワークフロー
- ブラウザ自動化
- UIインタラクション

## TDDワークフロー手順 (TDD Workflow Steps)

### ステップ 1: ユーザージャーニーの記述

```
[役割]として、[アクション]をしたい。それによって[メリット]が得られるからだ。

例:
ユーザーとして、意味的な検索でマーケットを探したい。
そうすれば、正確なキーワードがわからなくても関連するマーケットを見つけられるからだ。
```

### ステップ 2: テストケースの生成

各ユーザージャーニーについて、包括的なテストケースを作成します:

```typescript
describe('Semantic Search', () => {
  it('returns relevant markets for query', async () => {
    // テスト実装
  })

  it('handles empty query gracefully', async () => {
    // エッジケースのテスト
  })

  it('falls back to substring search when Redis unavailable', async () => {
    // フォールバック動作のテスト
  })

  it('sorts results by similarity score', async () => {
    // ソートロジックのテスト
  })
})
```

### ステップ 3: テストの実行（失敗を確認）

```bash
npm test
# テストは失敗するはずです（まだ実装していないため）
```

### ステップ 4: コードの実装

テストを通すための最小限のコードを書きます:

```typescript
// テストに導かれた実装
export async function searchMarkets(query: string) {
  // ここに実装
}
```

### ステップ 5: テストの再実行

```bash
npm test
# テストは今度は通るはずです
```

### ステップ 6: リファクタリング

テストがグリーンの状態でコード品質を向上させます:

- 重複の排除
- 命名の改善
- パフォーマンスの最適化
- 可読性の向上

### ステップ 7: カバレッジの検証

```bash
npm run test:coverage
# 80%以上のカバレッジ達成を確認
```

## テストパターン (Testing Patterns)

### ユニットテストパターン (Jest/Vitest)

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './Button'

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click</Button>)

    fireEvent.click(screen.getByRole('button'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

### API統合テストパターン

```typescript
import { NextRequest } from 'next/server'
import { GET } from './route'

describe('GET /api/markets', () => {
  it('returns markets successfully', async () => {
    const request = new NextRequest('http://localhost/api/markets')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(Array.isArray(data.data)).toBe(true)
  })

  it('validates query parameters', async () => {
    const request = new NextRequest('http://localhost/api/markets?limit=invalid')
    const response = await GET(request)

    expect(response.status).toBe(400)
  })

  it('handles database errors gracefully', async () => {
    // データベース障害のモック
    const request = new NextRequest('http://localhost/api/markets')
    // エラーハンドリングのテスト
  })
})
```

### E2Eテストパターン (Playwright)

```typescript
import { test, expect } from '@playwright/test'

test('user can search and filter markets', async ({ page }) => {
  // マーケットページへ移動
  await page.goto('/')
  await page.click('a[href="/markets"]')

  // ページの読み込み確認
  await expect(page.locator('h1')).toContainText('Markets')

  // マーケット検索
  await page.fill('input[placeholder="Search markets"]', 'election')

  // デバウンスと結果待ち
  await page.waitForTimeout(600)

  // 検索結果の表示確認
  const results = page.locator('[data-testid="market-card"]')
  await expect(results).toHaveCount(5, { timeout: 5000 })

  // 結果に検索語句が含まれるか確認
  const firstResult = results.first()
  await expect(firstResult).toContainText('election', { ignoreCase: true })

  // ステータスでフィルタリング
  await page.click('button:has-text("Active")')

  // フィルタ結果の確認
  await expect(results).toHaveCount(3)
})

test('user can create a new market', async ({ page }) => {
  // まずログイン
  await page.goto('/creator-dashboard')

  // マーケット作成フォーム入力
  await page.fill('input[name="name"]', 'Test Market')
  await page.fill('textarea[name="description"]', 'Test description')
  await page.fill('input[name="endDate"]', '2025-12-31')

  // フォーム送信
  await page.click('button[type="submit"]')

  // 成功メッセージ確認
  await expect(page.locator('text=Market created successfully')).toBeVisible()

  // マーケットページへのリダイレクト確認
  await expect(page).toHaveURL(/\/markets\/test-market/)
})
```

## テストファイルの構成 (Test File Organization)

```
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx          # ユニットテスト
│   │   └── Button.stories.tsx       # Storybook
│   └── MarketCard/
│       ├── MarketCard.tsx
│       └── MarketCard.test.tsx
├── app/
│   └── api/
│       └── markets/
│           ├── route.ts
│           └── route.test.ts         # 統合テスト
└── e2e/
    ├── markets.spec.ts               # E2Eテスト
    ├── trading.spec.ts
    └── auth.spec.ts
```

## 外部サービスのモック (Mocking External Services)

### Supabaseのモック

```typescript
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({
          data: [{ id: 1, name: 'Test Market' }],
          error: null
        }))
      }))
    }))
  }
}))
```

### Redisのモック

```typescript
jest.mock('@/lib/redis', () => ({
  searchMarketsByVector: jest.fn(() => Promise.resolve([
    { slug: 'test-market', similarity_score: 0.95 }
  ])),
  checkRedisHealth: jest.fn(() => Promise.resolve({ connected: true }))
}))
```

### OpenAIのモック

```typescript
jest.mock('@/lib/openai', () => ({
  generateEmbedding: jest.fn(() => Promise.resolve(
    new Array(1536).fill(0.1) // 1536次元の埋め込みモック
  ))
}))
```

## テストカバレッジの検証 (Test Coverage Verification)

### カバレッジレポートの実行

```bash
npm run test:coverage
```

### カバレッジしきい値

```json
{
  "jest": {
    "coverageThresholds": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

## 避けるべき一般的なテストの間違い (Common Testing Mistakes to Avoid)

### ❌ WRONG: 実装詳細のテスト

```typescript
// 内部状態をテストしてはいけない
expect(component.state.count).toBe(5)
```

### ✅ CORRECT: ユーザーに見える振る舞いのテスト

```typescript
// ユーザーが見るものをテストする
expect(screen.getByText('Count: 5')).toBeInTheDocument()
```

### ❌ WRONG: 壊れやすいセレクタ

```typescript
// 簡単に壊れる
await page.click('.css-class-xyz')
```

### ✅ CORRECT: 意味的なセレクタ

```typescript
// 変更に強い
await page.click('button:has-text("Submit")')
await page.click('[data-testid="submit-button"]')
```

### ❌ WRONG: テストの分離欠如

```typescript
// テストが互いに依存している
test('creates user', () => { /* ... */ })
test('updates same user', () => { /* 前のテストに依存 */ })
```

### ✅ CORRECT: 独立したテスト

```typescript
// 各テストが独自のデータをセットアップする
test('creates user', () => {
  const user = createTestUser()
  // テストロジック
})

test('updates user', () => {
  const user = createTestUser()
  // 更新ロジック
})
```

## 継続的テスト (Continuous Testing)

### 開発中のウォッチモード

```bash
npm test -- --watch
# ファイル変更時に自動的にテストが実行される
```

### Pre-Commit Hook

```bash
# コミットごとに実行
npm test && npm run lint
```

### CI/CD統合

```yaml
# GitHub Actions
- name: Run Tests
  run: npm test -- --coverage
- name: Upload Coverage
  uses: codecov/codecov-action@v3
```

## ベストプラクティス (Best Practices)

1. **テストを最初に書く** - 常にTDD
2. **1テスト1アサーション** - 1つの振る舞いに集中する
3. **説明的なテスト名** - 何がテストされているか説明する
4. **Arrange-Act-Assert** - 明確なテスト構造
5. **外部依存のモック** - ユニットテストを分離する
6. **エッジケースのテスト** - Null, undefined, empty, large
7. **エラーパスのテスト** - ハッピーパスだけでなく
8. **テストを高速に保つ** - 各ユニットテスト < 50ms
9. **テスト後のクリーンアップ** - 副作用を残さない
10. **カバレッジレポートのレビュー** - ギャップを特定する

## 成功指標 (Success Metrics)

- 80%以上のコードカバレッジ達成
- すべてのテストがパス（グリーン）
- スキップまたは無効化されたテストがない
- 高速なテスト実行（ユニットテスト < 30秒）
- E2Eテストがクリティカルなユーザーフローをカバー
- 本番前にテストがバグを検出する

---

**覚えておいてください**: テストはオプションではありません。自信を持ったリファクタリング、迅速な開発、本番の信頼性を可能にするセーフティネットです。
