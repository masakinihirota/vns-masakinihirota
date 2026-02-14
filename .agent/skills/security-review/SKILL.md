---
name: security-review
description: 認証の追加、ユーザー入力の処理、シークレットの操作、APIエンドポイントの作成、または決済/機密機能の実装時にこのスキルを使用します。包括的なセキュリティチェックリストとパターンを提供します。
---

# Security Review Skill

このスキルは、すべてのコードがセキュリティのベストプラクティスに従っていることを保証し、潜在的な脆弱性を特定します。

## 適用タイミング (When to Activate)

- 認証または認可の実装時
- ユーザー入力またはファイルアップロードの処理時
- 新しいAPIエンドポイントの作成時
- シークレットまたは認証情報の操作時
- 決済機能の実装時
- 機密データの保存または送信時
- サードパーティAPIの統合時

## セキュリティチェックリスト (Security Checklist)

### 1. シークレット管理 (Secrets Management)

#### ❌ NEVER Do This

```typescript
const apiKey = "sk-proj-xxxxx"  // ハードコードされたシークレット
const dbPassword = "password123" // ソースコード内にある
```

#### ✅ ALWAYS Do This

```typescript
const apiKey = process.env.OPENAI_API_KEY
const dbUrl = process.env.DATABASE_URL

// シークレットの存在確認
if (!apiKey) {
  throw new Error('OPENAI_API_KEY not configured')
}
```

#### 検証ステップ

- [ ] APIキー、トークン、パスワードがハードコードされていない
- [ ] すべてのシークレットが環境変数にある
- [ ] `.env.local` が .gitignore に含まれている
- [ ] git履歴にシークレットが含まれていない
- [ ] 本番用シークレットがホスティングプラットフォーム (Vercel, Railway) に設定されている

### 2. 入力バリデーション (Input Validation)

#### 常にユーザー入力を検証する

```typescript
import { z } from 'zod'

// バリデーションスキーマの定義
const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  age: z.number().int().min(0).max(150)
})

// 処理前のバリデーション
export async function createUser(input: unknown) {
  try {
    const validated = CreateUserSchema.parse(input)
    return await db.users.create(validated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.errors }
    }
    throw error
  }
}
```

#### ファイルアップロードのバリデーション

```typescript
function validateFileUpload(file: File) {
  // サイズチェック (最大 5MB)
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    throw new Error('File too large (max 5MB)')
  }

  // タイプチェック
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type')
  }

  // 拡張子チェック
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif']
  const extension = file.name.toLowerCase().match(/\.[^.]+$/)?.[0]
  if (!extension || !allowedExtensions.includes(extension)) {
    throw new Error('Invalid file extension')
  }

  return true
}
```

#### 検証ステップ

- [ ] すべてのユーザー入力がスキーマで検証されている
- [ ] ファイルアップロードが制限されている（サイズ、タイプ、拡張子）
- [ ] クエリでユーザー入力が直接使用されていない
- [ ] ホワイトリスト形式のバリデーション（ブラックリストではない）
- [ ] エラーメッセージが機密情報を漏洩していない

### 3. SQLインジェクション対策 (SQL Injection Prevention)

#### ❌ NEVER Concatenate SQL

```typescript
// 危険 - SQLインジェクションの脆弱性あり
const query = `SELECT * FROM users WHERE email = '${userEmail}'`
await db.query(query)
```

#### ✅ ALWAYS Use Parameterized Queries

```typescript
// 安全 - パラメータ化されたクエリ
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('email', userEmail)

// または生のSQLを使用する場合
await db.query(
  'SELECT * FROM users WHERE email = $1',
  [userEmail]
)
```

#### 検証ステップ

- [ ] すべてのデータベースクエリでパラメータ化されたクエリを使用している
- [ ] SQL内で文字列結合を行っていない
- [ ] ORM/クエリビルダーを正しく使用している
- [ ] Supabaseクエリが適切にサニタイズされている

### 4. 認証と認可 (Authentication & Authorization)

#### JWTトークンの取り扱い

```typescript
// ❌ WRONG: localStorage (XSSに対して脆弱)
localStorage.setItem('token', token)

// ✅ CORRECT: httpOnly cookies
res.setHeader('Set-Cookie',
  `token=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`)
```

#### 認可チェック

```typescript
export async function deleteUser(userId: string, requesterId: string) {
  // 必ず最初に認可を確認する
  const requester = await db.users.findUnique({
    where: { id: requesterId }
  })

  if (requester.role !== 'admin') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 403 }
    )
  }

  // 削除を実行
  await db.users.delete({ where: { id: userId } })
}
```

#### 行レベルセキュリティ (Supabase RLS)

```sql
-- 全テーブルでRLSを有効化
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- ユーザーは自分のデータのみ閲覧可能
CREATE POLICY "Users view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- ユーザーは自分のデータのみ更新可能
CREATE POLICY "Users update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);
```

#### 検証ステップ

- [ ] トークンがhttpOnly cookieに保存されている（localStorageは不可）
- [ ] 機密操作の前に認可チェックを行っている
- [ ] SupabaseでRLSが有効になっている
- [ ] ロールベースのアクセス制御が実装されている
- [ ] セッション管理が安全である

### 5. XSS対策 (XSS Prevention)

#### HTMLのサニタイズ

```typescript
import DOMPurify from 'isomorphic-dompurify'

// ユーザー提供のHTMLは常にサニタイズする
function renderUserContent(html: string) {
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p'],
    ALLOWED_ATTR: []
  })
  return <div dangerouslySetInnerHTML={{ __html: clean }} />
}
```

#### コンテンツセキュリティポリシー (CSP)

```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https:;
      font-src 'self';
      connect-src 'self' https://api.example.com;
    `.replace(/\s{2,}/g, ' ').trim()
  }
]
```

#### 検証ステップ

- [ ] ユーザー提供のHTMLがサニタイズされている
- [ ] CSPヘッダーが設定されている
- [ ] 検証されていない動的コンテンツのレンダリングがない
- [ ] Reactの組み込みXSS保護が使用されている

### 6. CSRF保護 (CSRF Protection)

#### CSRFトークン

```typescript
import { csrf } from '@/lib/csrf'

export async function POST(request: Request) {
  const token = request.headers.get('X-CSRF-Token')

  if (!csrf.verify(token)) {
    return NextResponse.json(
      { error: 'Invalid CSRF token' },
      { status: 403 }
    )
  }

  // リクエストを処理
}
```

#### SameSite Cookie

```typescript
res.setHeader('Set-Cookie',
  `session=${sessionId}; HttpOnly; Secure; SameSite=Strict`)
```

#### 検証ステップ

- [ ] 状態を変更する操作にCSRFトークンがある
- [ ] すべてのCookieにSameSite=Strictが設定されている
- [ ] Double-submit cookieパターンが実装されている

### 7. レート制限 (Rate Limiting)

#### APIレート制限

```typescript
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  max: 100, // ウィンドウごとに100リクエスト
  message: 'Too many requests'
})

// ルートに適用
app.use('/api/', limiter)
```

#### 高負荷操作

```typescript
// 検索に対する攻撃的なレート制限
const searchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1分
  max: 10, // 1分間に10リクエスト
  message: 'Too many search requests'
})

app.use('/api/search', searchLimiter)
```

#### 検証ステップ

- [ ] すべてのAPIエンドポイントでレート制限が行われている
- [ ] 高負荷な操作にはより厳しい制限がある
- [ ] IPベースのレート制限
- [ ] ユーザーベースのレート制限（認証済み）

### 8. 機密情報の露出 (Sensitive Data Exposure)

#### ログ出力

```typescript
// ❌ WRONG: 機密データをログ出力
console.log('User login:', { email, password })
console.log('Payment:', { cardNumber, cvv })

// ✅ CORRECT: 機密データを伏せ字にする
console.log('User login:', { email, userId })
console.log('Payment:', { last4: card.last4, userId })
```

#### エラーメッセージ

```typescript
// ❌ WRONG: 内部詳細を露出
catch (error) {
  return NextResponse.json(
    { error: error.message, stack: error.stack },
    { status: 500 }
  )
}

// ✅ CORRECT: 汎用的なエラーメッセージ
catch (error) {
  console.error('Internal error:', error)
  return NextResponse.json(
    { error: 'An error occurred. Please try again.' },
    { status: 500 }
  )
}
```

#### 検証ステップ

- [ ] ログにパスワード、トークン、シークレットが含まれていない
- [ ] ユーザー向けエラーメッセージが汎用的である
- [ ] 詳細なエラーはサーバーログのみにある
- [ ] スタックトレースがユーザーに露出していない

### 9. ブロックチェーンセキュリティ (Solana)

#### ウォレット検証

```typescript
import { verify } from '@solana/web3.js'

async function verifyWalletOwnership(
  publicKey: string,
  signature: string,
  message: string
) {
  try {
    const isValid = verify(
      Buffer.from(message),
      Buffer.from(signature, 'base64'),
      Buffer.from(publicKey, 'base64')
    )
    return isValid
  } catch (error) {
    return false
  }
}
```

#### トランザクション検証

```typescript
async function verifyTransaction(transaction: Transaction) {
  // 受信者の検証
  if (transaction.to !== expectedRecipient) {
    throw new Error('Invalid recipient')
  }

  // 金額の検証
  if (transaction.amount > maxAmount) {
    throw new Error('Amount exceeds limit')
  }

  // ユーザーの残高確認
  const balance = await getBalance(transaction.from)
  if (balance < transaction.amount) {
    throw new Error('Insufficient balance')
  }

  return true
}
```

#### 検証ステップ

- [ ] ウォレットの署名が検証されている
- [ ] トランザクションの詳細が検証されている
- [ ] トランザクション前に残高チェックを行っている
- [ ] 内容を確認せずにトランザクション署名を求めていない

### 10. 依存関係のセキュリティ (Dependency Security)

#### 定期的な更新

```bash
# 脆弱性のチェック
npm audit

# 自動修正可能な問題を修正
npm audit fix

# 依存関係の更新
npm update

# パッケージの更新確認
npm outdated
```

#### ロックファイル

```bash
# ロックファイルは必ずコミットする
git add package-lock.json

# CI/CDでは再現可能なビルドのためにこれを使用
npm ci  # npm install の代わり
```

#### 検証ステップ

- [ ] 依存関係が最新である
- [ ] 既知の脆弱性がない (npm audit clean)
- [ ] ロックファイルがコミットされている
- [ ] GitHubでDependabotが有効になっている
- [ ] 定期的なセキュリティアップデート

## セキュリティテスト (Security Testing)

### 自動セキュリティテスト

```typescript
// 認証のテスト
test('requires authentication', async () => {
  const response = await fetch('/api/protected')
  expect(response.status).toBe(401)
})

// 認可のテスト
test('requires admin role', async () => {
  const response = await fetch('/api/admin', {
    headers: { Authorization: `Bearer ${userToken}` }
  })
  expect(response.status).toBe(403)
})

// 入力バリデーションのテスト
test('rejects invalid input', async () => {
  const response = await fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify({ email: 'not-an-email' })
  })
  expect(response.status).toBe(400)
})

// レート制限のテスト
test('enforces rate limits', async () => {
  const requests = Array(101).fill(null).map(() =>
    fetch('/api/endpoint')
  )

  const responses = await Promise.all(requests)
  const tooManyRequests = responses.filter(r => r.status === 429)

  expect(tooManyRequests.length).toBeGreaterThan(0)
})
```

## デプロイ前セキュリティチェックリスト (Pre-Deployment Security Checklist)

**すべての** 本番デプロイの前に:

- [ ] **シークレット**: ハードコードされたシークレットがなく、すべて環境変数にある
- [ ] **入力バリデーション**: すべてのユーザー入力が検証されている
- [ ] **SQLインジェクション**: すべてのクエリがパラメータ化されている
- [ ] **XSS**: ユーザーコンテンツがサニタイズされている
- [ ] **CSRF**: 保護が有効になっている
- [ ] **認証**: トークン処理が適切である
- [ ] **認可**: ロールチェックが行われている
- [ ] **レート制限**: すべてのエンドポイントで有効になっている
- [ ] **HTTPS**: 本番環境で強制されている
- [ ] **セキュリティヘッダー**: CSP, X-Frame-Options が設定されている
- [ ] **エラーハンドリング**: エラーに機密データが含まれていない
- [ ] **ログ**: 機密データがログ出力されていない
- [ ] **依存関係**: 最新であり、脆弱性がない
- [ ] **RLS**: Supabaseで有効になっている
- [ ] **CORS**: 適切に設定されている
- [ ] **ファイルアップロード**: 検証されている（サイズ、タイプ）
- [ ] **ウォレット署名**: 検証されている（ブロックチェーンの場合）

## リソース (Resources)

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/security)
- [Supabase Security](https://supabase.com/docs/guides/auth)
- [Web Security Academy](https://portswigger.net/web-security)

---

**覚えておいてください**: セキュリティはオプションではありません。1つの脆弱性がプラットフォーム全体を危険にさらす可能性があります。疑わしい場合は、安全側に倒してください。
