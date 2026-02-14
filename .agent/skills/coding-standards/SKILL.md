---
name: coding-standards
description: TypeScript, JavaScript, React, Node.js開発のための普遍的なコーディング標準、ベストプラクティス、およびパターン。
---

# コーディング標準とベストプラクティス (Coding Standards & Best Practices)

全プロジェクトに適用される普遍的なコーディング標準です。

## コード品質の原則

### 1. 可読性第一 (Readability First)

- コードは書く回数より読む回数の方が圧倒的に多い
- 明確な変数名と関数名を使用する
- コメントよりも「自己文書化されたコード」を優先する
- 一貫したフォーマット

### 2. KISS (Keep It Simple, Stupid)

- 動作する最も単純な解決策を選ぶ
- 過剰なエンジニアリングを避ける
- 早すぎる最適化を行わない
- 賢いコードよりも理解しやすいコードを優先する

### 3. DRY (Don't Repeat Yourself)

- 共通のロジックを関数に抽出する
- 再利用可能なコンポーネントを作成する
- モジュール間でユーティリティを共有する
- コピペプログラミングを避ける

### 4. YAGNI (You Aren't Gonna Need It)

- 必要になるまで機能を作らない
- 推測に基づく汎用化を避ける
- 必要になった時に初めて複雑さを追加する
- まずシンプルに始め、必要に応じてリファクタリングする

## TypeScript/JavaScript 標準

### 変数命名

```typescript
// ✅ GOOD: 説明的な名前
const marketSearchQuery = 'election'
const isUserAuthenticated = true
const totalRevenue = 1000

// ❌ BAD:不明瞭な名前
const q = 'election'
const flag = true
const x = 1000
```

### 関数命名

```typescript
// ✅ GOOD: 「動詞 + 名詞」のパターン
async function fetchMarketData(marketId: string) { }
function calculateSimilarity(a: number[], b: number[]) { }
function isValidEmail(email: string): boolean { }

// ❌ BAD: 不明瞭、または名詞のみ
async function market(id: string) { }
function similarity(a, b) { }
function email(e) { }
```

### イミュータビリティ（不変性）パターン (重要)

```typescript
// ✅ ALWAYS: スプレッド構文を使用する
const updatedUser = {
  ...user,
  name: 'New Name'
}

const updatedArray = [...items, newItem]

// ❌ NEVER: 直接変更（ミューテート）する
user.name = 'New Name'  // BAD
items.push(newItem)     // BAD
```

### エラーハンドリング

```typescript
// ✅ GOOD: 包括的なエラーハンドリング
async function fetchData(url: string) {
  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Fetch failed:', error)
    throw new Error('Failed to fetch data')
  }
}

// ❌ BAD: エラーハンドリングなし
async function fetchData(url) {
  const response = await fetch(url)
  return response.json()
}
```

### Async/Await ベストプラクティス

```typescript
// ✅ GOOD: 可能な限り並列実行
const [users, markets, stats] = await Promise.all([
  fetchUsers(),
  fetchMarkets(),
  fetchStats()
])

// ❌ BAD: 不要な直列実行
const users = await fetchUsers()
const markets = await fetchMarkets()
const stats = await fetchStats()
```

### 型安全性 (Type Safety)

```typescript
// ✅ GOOD: 適切な型定義
interface Market {
  id: string
  name: string
  status: 'active' | 'resolved' | 'closed'
  created_at: Date
}

function getMarket(id: string): Promise<Market> {
  // 実装
}

// ❌ BAD: 'any' の使用
function getMarket(id: any): Promise<any> {
  // 実装
}
```

## React ベストプラクティス

### コンポーネント構造

```typescript
// ✅ GOOD: 型定義された関数コンポーネント
interface ButtonProps {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary'
}

export function Button({
  children,
  onClick,
  disabled = false,
  variant = 'primary'
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {children}
    </button>
  )
}

// ❌ BAD: 型がなく、構造が不明瞭
export function Button(props) {
  return <button onClick={props.onClick}>{props.children}</button>
}
```

### カスタムフック

```typescript
// ✅ GOOD: 再利用可能なカスタムフック
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

// 使用例
const debouncedQuery = useDebounce(searchQuery, 500)
```

### 状態管理 (State Management)

```typescript
// ✅ GOOD: 適切な状態更新
const [count, setCount] = useState(0)

// 前の状態に基づく関数型更新
setCount(prev => prev + 1)

// ❌ BAD: 直接的な状態参照
setCount(count + 1)  // 非同期シナリオで古い値になる可能性がある
```

### 条件付きレンダリング

```typescript
// ✅ GOOD: 明確な条件付きレンダリング
{isLoading && <Spinner />}
{error && <ErrorMessage error={error} />}
{data && <DataDisplay data={data} />}

// ❌ BAD: 三項演算子のネスト（Ternary hell）
{isLoading ? <Spinner /> : error ? <ErrorMessage error={error} /> : data ? <DataDisplay data={data} /> : null}
```

## API 設計標準

### REST API 規約

```
GET    /api/markets              # 全マーケット一覧取得
GET    /api/markets/:id          # 特定マーケット取得
POST   /api/markets              # 新規マーケット作成
PUT    /api/markets/:id          # マーケット更新（全置換）
PATCH  /api/markets/:id          # マーケット更新（部分更新）
DELETE /api/markets/:id          # マーケット削除

# フィルタリング用クエリパラメータ
GET /api/markets?status=active&limit=10&offset=0
```

### レスポンスフォーマット

```typescript
// ✅ GOOD: 一貫性のあるレスポンス構造
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  meta?: {
    total: number
    page: number
    limit: number
  }
}

// 成功レスポンス
return NextResponse.json({
  success: true,
  data: markets,
  meta: { total: 100, page: 1, limit: 10 }
})

// エラーレスポンス
return NextResponse.json({
  success: false,
  error: '不正なリクエストです'
}, { status: 400 })
```

### 入力バリデーション

```typescript
import { z } from 'zod'

// ✅ GOOD: スキーマバリデーション
const CreateMarketSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  endDate: z.string().datetime(),
  categories: z.array(z.string()).min(1)
})

export async function POST(request: Request) {
  const body = await request.json()

  try {
    const validated = CreateMarketSchema.parse(body)
    // バリデーション済みのデータで処理を進める
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'バリデーションに失敗しました',
        details: error.errors
      }, { status: 400 })
    }
  }
}
```

## ファイル構成

### プロジェクト構造

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── markets/           # Market pages
│   └── (auth)/           # Auth pages (route groups)
├── components/            # React components
│   ├── ui/               # Generic UI components
│   ├── forms/            # Form components
│   └── layouts/          # Layout components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and configs
│   ├── api/             # API clients
│   ├── utils/           # Helper functions
│   └── constants/       # Constants
├── types/                # TypeScript types
└── styles/              # Global styles
```

### ファイル命名

```
components/Button.tsx          # コンポーネントは PascalCase
hooks/useAuth.ts              # 'use' プレフィックス付きの camelCase
lib/formatDate.ts             # ユーティリティは camelCase
types/market.types.ts         # camelCase と .types 接尾辞
```

## コメントとドキュメンテーション

### コメントすべき時

```typescript
// ✅ GOOD: 「何を」ではなく「なぜ」を説明する
// 障害時にAPIに負荷をかけないよう、指数バックオフを使用する
const delay = Math.min(1000 * Math.pow(2, retryCount), 30000)

// 配列が大きい場合のパフォーマンスのために、意図的にミューテーションを使用する
items.push(newItem)

// ❌ BAD: 明らかなことを説明している
// カウンタを1増やす
count++

// 名前をユーザー名に設定する
name = user.name
```

### 公開APIのためのJSDoc

````typescript
/**
 * 意味的な類似性を使用してマーケットを検索します。
 *
 * @param query - 自然言語の検索クエリ
 * @param limit - 結果の最大数（デフォルト: 10）
 * @returns 類似度スコア順のマーケット配列
 * @throws {Error} OpenAI APIが失敗した場合、またはRedisが利用できない場合
 *
 * @example
 * ```typescript
 * const results = await searchMarkets('election', 5)
 * console.log(results[0].name) // "Trump vs Biden"
 * ```
 */
export async function searchMarkets(
  query: string,
  limit: number = 10
): Promise<Market[]> {
  // 実装
}
````

## パフォーマンスのベストプラクティス

### メモ化 (Memoization)

```typescript
import { useMemo, useCallback } from 'react'

// ✅ GOOD: コストの高い計算をメモ化する
const sortedMarkets = useMemo(() => {
  return markets.sort((a, b) => b.volume - a.volume)
}, [markets])

// ✅ GOOD: コールバックをメモ化する
const handleSearch = useCallback((query: string) => {
  setSearchQuery(query)
}, [])
```

### 遅延読み込み (Lazy Loading)

```typescript
import { lazy, Suspense } from 'react'

// ✅ GOOD: 重いコンポーネントを遅延読み込みする
const HeavyChart = lazy(() => import('./HeavyChart'))

export function Dashboard() {
  return (
    <Suspense fallback={<Spinner />}>
      <HeavyChart />
    </Suspense>
  )
}
```

### データベースクエリ

```typescript
// ✅ GOOD: 必要なカラムのみを選択する
const { data } = await supabase
  .from('markets')
  .select('id, name, status')
  .limit(10)

// ❌ BAD: 全てを選択する
const { data } = await supabase
  .from('markets')
  .select('*')
```

## テスト標準

### テスト構造 (AAAパターン)

```typescript
test('calculates similarity correctly', () => {
  // Arrange (準備)
  const vector1 = [1, 0, 0]
  const vector2 = [0, 1, 0]

  // Act (実行)
  const similarity = calculateCosineSimilarity(vector1, vector2)

  // Assert (検証)
  expect(similarity).toBe(0)
})
```

### テスト命名

```typescript
// ✅ GOOD: 説明的なテスト名
test('returns empty array when no markets match query', () => { })
test('throws error when OpenAI API key is missing', () => { })
test('falls back to substring search when Redis unavailable', () => { })

// ❌ BAD: 曖昧なテスト名
test('works', () => { })
test('test search', () => { })
```

## コードのにおい（Code Smell）の検出

これらのアンチパターンに注意してください：

### 1. 長い関数

```typescript
// ❌ BAD: 50行を超える関数
function processMarketData() {
  // 100行のコード
}

// ✅ GOOD: 小さな関数に分割する
function processMarketData() {
  const validated = validateData()
  const transformed = transformData(validated)
  return saveData(transformed)
}
```

### 2. 深いネスト

```typescript
// ❌ BAD: 5レベル以上のネスト
if (user) {
  if (user.isAdmin) {
    if (market) {
      if (market.isActive) {
        if (hasPermission) {
          // 何か処理
        }
      }
    }
  }
}

// ✅ GOOD: アーリーリターン（早期リターン）
if (!user) return
if (!user.isAdmin) return
if (!market) return
if (!market.isActive) return
if (!hasPermission) return

// 何か処理
```

### 3. マジックナンバー

```typescript
// ❌ BAD: 説明のない数値
if (retryCount > 3) { }
setTimeout(callback, 500)

// ✅ GOOD: 名前付き定数
const MAX_RETRIES = 3
const DEBOUNCE_DELAY_MS = 500

if (retryCount > MAX_RETRIES) { }
setTimeout(callback, DEBOUNCE_DELAY_MS)
```

**覚えておいてください**: コード品質は交渉の余地がありません。明確で保守しやすいコードは、迅速な開発と自信を持ったリファクタリングを可能にします。
