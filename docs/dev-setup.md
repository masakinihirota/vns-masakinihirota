# 開発環境セットアップガイド

## セットアップ手順

### 1. 環境変数設定（`.env.local`）

```bash
# データベース
DATABASE_URL="postgresql://user:password@localhost:5432/vns_masakinihirota"

# OAuth - Google
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# OAuth - GitHub
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Better Auth
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:3000"

# 本物認証を使用するか（開発時のみ）
# ⚠️ 本番環境では必ず true に設定してください
USE_REAL_AUTH=false  # false: ダミー認証（開発）、 true: OAuth認証（本番）

# ダミーデータ設定
NEXT_PUBLIC_MOCK_DATA=true      # ダミーデータを使用するか
NEXT_PUBLIC_USE_MOCK_ARTWORKS=true  # 作品リストのダミーデータを使用するか

# デバッグログ（オプション）
# PROXY_DEBUG=true              # proxy.ts のログを有効化
```

### 2. 依存関係のインストール

```bash
pnpm install
```

### 3. データベース初期化（Drizzle）

```bash
# マイグレーション実行
pnpm drizzle:migrate

# DB 確認（PostgreSQL cli）
psql $DATABASE_URL -l
```

### 4. 管理者ユーザー作成

```bash
# デフォルト管理者を作成
pnpm admin:create

# カスタム認証情報で管理者を作成
ADMIN_EMAIL=admin@myapp.com \
ADMIN_PASSWORD=MySecurePass123! \
ADMIN_NAME="System Admin" \
pnpm admin:create
```

### 5. 開発サーバー起動

```bash
# 認証スキップ有効（開発時推奨）
USE_REAL_AUTH=false pnpm dev

# または .env.local で USE_REAL_AUTH=false に設定してから
pnpm dev

# デバッグ情報（proxy.ts ログ）を表示する場合
PROXY_DEBUG=true pnpm dev
```

### 6. ブラウザでアクセス

- http://localhost:3000 → ランディングページ
- http://localhost:3000/home → ユーザーダッシュボード（USE_REAL_AUTH=false 時）
- http://localhost:3000/admin → 管理者ページ

---

## 重要な環境変数

| 環境変数 | 値 | 用途 | 本番 |
|----------|---|------|------|
| `USE_REAL_AUTH` | `true` \| `false` | OAuth認証使用よう粗OAuth／ダミー | `true` |
| `NEXT_PUBLIC_MOCK_DATA` | `true` \| `false` | ダミーデータを使用するか | `false` |
| `NEXT_PUBLIC_USE_MOCK_ARTWORKS` | `true` \| `false` | 作品リストのダミーデータを使用するか | `false` |
| `PROXY_DEBUG` | `true` \| `false` | proxy.ts のログを有効化 | ⚠️ `false` |
| `BETTER_AUTH_SECRET` | ランダム文字列 | Better Auth のシークレットキー | 必須 |
| `NODE_ENV` | `development` | 開発環境の自動設定 | 自動 |

### ⚠️ セキュリティ警告

- **`USE_REAL_AUTH=false` は開発環境でのみ使用してください**。本番環境では必ず `true` に設定
- `.env.local` は `.gitignore` に登録済み（Git にコミットされない）
- OAuth 認証情報（CLIENT_ID/SECRET）と `BETTER_AUTH_SECRET` は絶対に Git にコミットしない
- 本番環境では `USE_REAL_AUTH=true`、`NEXT_PUBLIC_MOCK_DATA=false`

---

## 開発時の認証フロー

### USE_REAL_AUTH=false の場合（推奨）

```
ユーザーがアクセス
  ↓
proxy.ts で USE_REAL_AUTH をチェック
  ↓
createDummySession() でダミーユーザーを作成
  ↓
全ページにアクセス可能（ダミー認証）
```

**メリット:**
- DB セットアップ不要
- OAuth 認証情報不要
- 高速な開発・テスト
- 全機能を即座に検証可能

### USE_REAL_AUTH=true の場合（本番環境と同じ）

```
ユーザーがアクセス
  ↓
proxy.ts で Better Auth をチェック
  ↓
OAuth (Google/GitHub) ログインが必要
  ↓
セッション作成 → DB に保存
```

**用途:**
- OAuth 統合テスト
- セッション管理のテスト
- 本番環境との動作確認

---

## ダミーユーザー情報

**USE_REAL_AUTH=false の場合:**

| ユーザータイプ | ID | メール | ロール |
|--------------|-----|--------|--------|
| 通常ユーザー | dev-user-001 | user@example.com | user |
| 管理者 | dev-admin-001 | admin@example.com | admin |

これらの情報は [src/lib/dev-auth.ts](src/lib/dev-auth.ts) で定義されています。

---

## よくある問題と解決策

### 1. `USE_REAL_AUTH=false` でセットアップしたが、ログイン画面が表示される

**原因:** 環境変数が正しく読み込まれていない

**解決:**
```bash
# .env.local に設定を追加
echo "USE_REAL_AUTH=false" >> .env.local

# サーバーを再起動
pnpm dev
```

### 2. 「Admin user not found」エラーが表示される

**原因:** admin ユーザーが DB に存在しない

**解決:**
```bash
pnpm admin:create
```

### 3. PostgreSQL に接続できない

**原因:** DATABASE_URL が正しくない、または PostgreSQL が起動していない

**解決:**
```bash
# .env.local の DATABASE_URL を確認
cat .env.local | grep DATABASE_URL

# PostgreSQL が起動しているか確認 (macOS/Linux)
pg_isready

# または Docker で PostgreSQL を起動
docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres
```

### 4. Google/GitHub OAuth でコールバック URL エラー

**原因:** OAuth settings で Redirect URI が正しくない

**解決:**
```
Google Console / GitHub Settings で許可 URL を設定:
  http://localhost:3000/api/auth/callback/google
  http://localhost:3000/api/auth/callback/github
```

---

## パフォーマンスモニタリング

```bash
# ログを有効化して DB アクセスパターンを確認
PROXY_DEBUG=true pnpm dev

# 出力例:
# [Proxy][2026-02-28T...] 🔓 AUTH DISABLED: Using dummy user {user: "user@example.com"}
# [Proxy][2026-02-28T...] info Authenticated user accessing public path
```

---

## Next.js 16 重要なポイント

### Async Request APIs

```typescript
// ❌ 間違い（sync）
import { headers } from 'next/headers';
const h = headers().get('cookie');

// ✅ 正しい（async）
import { headers } from 'next/headers';
const h = (await headers()).get('cookie');
```

### Proxy 命名

```typescript
// ❌ 間違い（Next.js 15 以前）
export async function middleware(request: NextRequest) {}

// ✅ 正しい（Next.js 16）
export async function proxy(request: NextRequest) {}
```

### Dynamic Rendering

```typescript
// headers() を使う場合マストで以下を設定
export const dynamic = 'force-dynamic';

// または
export const revalidate = 0;
```

---

## デバッグのコツ

### コンソール出力を確認

```bash
# ターミナル での proxy.ts ログ
PROXY_DEBUG=true pnpm dev

# ブラウザコンソール
F12 → Console タブ
```

### DB を直接確認

```bash
# psql で直接確認
psql $DATABASE_URL

\dt                           # テーブル一覧
SELECT * FROM "user";        # ユーザー一覧
SELECT * FROM "session";     # セッション一覧
```

### React DevTools で コンポーネント状態を確認

1. Chrome に [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools/) をインストール
2. `F12 → Components タブ` を開く
3. コンポーネントツリーで props/state を確認
