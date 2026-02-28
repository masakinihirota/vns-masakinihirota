# 本番デプロイ準備 TODO - VNS masakinihirota (2026-03-01)

**前提**: すべての重大な問題は解決済み ✅ (Production Ready 98%)
**参照**: [CODE_REVIEW_COMPREHENSIVE_20260301_V4.md](CODE_REVIEW_COMPREHENSIVE_20260301_V4.md)

---

## 🔴 必須項目 (本番デプロイ前に完了必須)

### [ ] 1. Legacy Schema Cleanup

**優先度**: 🔴 HIGH (本番デプロイ前)
**作業内容**:

#### ローカル環境での確認と修復

```powershell
# Step 1: 現在の状態確認
pnpm db:auth:check
# [OK] と [WARN] の状況を確認

# Step 2: 修復実行 (camelCase → snake_case 統一)
pnpm db:auth:fix-compat
# エラーが出た場合は、すでに修復済みの可能性あり

# Step 3: 再度確認
pnpm db:auth:check
# [WARN] が消えていることを確認
```

#### 本番環境での実行

```powershell
# Step 1: 本番環境変数を取得
vercel env pull .env.vercel.production --environment=production

# Step 2: 本番DBに対して修復実行
$env:ENV_FILE='.env.vercel.production'; pnpm db:auth:fix-compat; Remove-Item Env:ENV_FILE

# Step 3: 検証
$env:ENV_FILE='.env.vercel.production'; pnpm db:auth:check; Remove-Item Env:ENV_FILE
```

**期待結果**:
- `[DB_CHECK] PASSED` が表示される
- `[WARN] legacy camelCase columns` が表示されない

---

### [ ] 2. 本番環境での Smoke Test

**優先度**: 🔴 HIGH
**作業内容**:

#### 認証フロー

- [ ] Google OAuth ログイン成功
- [ ] GitHub OAuth ログイン成功
- [ ] ログアウト成功
- [ ] セッション有効期限の確認 (7日間)

#### Ghost Mode 機能

- [ ] 新規ユーザー登録時に幽霊プロフィールが自動作成される
- [ ] 幽霊状態でグループ作成を試みるとエラーが返る
- [ ] 幽霊状態で国作成を試みるとエラーが返る
- [ ] プラットフォーム管理者は幽霊でもすべて実行可能

#### RBAC 機能

- [ ] グループリーダーのみがグループ設定を変更できる
- [ ] 国リーダーのみが国設定を変更できる
- [ ] プラットフォーム管理者はすべての操作が可能

#### データベース

- [ ] RLS が有効化されている (user, session, account)
- [ ] ポリシーが正しく動作している
- [ ] Migration が正しく適用されている

---

### [ ] 3. 環境変数の確認

**優先度**: 🔴 HIGH
**作業内容**:

#### 必須環境変数

```bash
# Authentication
BETTER_AUTH_SECRET=***  # 32文字以上
BETTER_AUTH_URL=https://your-domain.com

# OAuth
GOOGLE_CLIENT_ID=***
GOOGLE_CLIENT_SECRET=***
GITHUB_CLIENT_ID=***
GITHUB_CLIENT_SECRET=***

# Database
DATABASE_URL=postgresql://***
```

#### 確認コマンド

```powershell
# ローカル
cat .env.local | Select-String "BETTER_AUTH|GOOGLE|GITHUB|DATABASE"

# 本番
vercel env ls production
```

---

### [ ] 4. CORS & Trusted Origins の確認

**優先度**: 🔴 HIGH
**作業内容**:

#### Better Auth 設定の確認

[src/lib/auth.ts](../src/lib/auth.ts) で `trustedOrigins` が正しく設定されているか確認:

```typescript
export const auth = betterAuth({
  trustedOrigins: [
    "http://localhost:3000",    // 開発環境
    "https://your-domain.com",  // 本番環境 ← 要確認
  ],
  // ...
});
```

#### 検証方法

- [ ] 本番環境のドメイン名が trustedOrigins に含まれている
- [ ] OAuth リダイレクト URI が正しく設定されている

---

### [ ] 5. Rate Limiting の確認

**優先度**: 🔴 HIGH
**作業内容**:

#### 設定の確認

[src/lib/auth/rate-limiter.ts](../src/lib/auth/rate-limiter.ts) の設定を確認:

```typescript
const RATE_LIMIT_CONFIG = {
  signin: { points: 5, duration: 15 * 60 * 1000 },    // 15分間に5回
  signup: { points: 3, duration: 60 * 60 * 1000 },    // 1時間に3回
  oauthCallback: { points: 10, duration: 5 * 60 * 1000 }, // 5分間に10回
};
```

#### 検証方法

- [ ] レート制限が適切に動作している
- [ ] メモリリークが発生していない (cleanup 動作確認)

---

## 🟡 推奨項目 (MVP リリース後に実装)

### [ ] 6. Ghost Mode UI の実装

**優先度**: 🟡 MEDIUM
**内容**: ユーザーが幽霊⇄ペルソナを切り替える UI

**実装例**:

```tsx
// components/profile/mask-switcher.tsx
export function MaskSwitcher({ session }: { session: AuthSession }) {
  const isGhost = await isGhostMask(session);

  return (
    <div className="mask-status">
      {isGhost ? (
        <>
          <Badge variant="ghost">👻 観測者モード</Badge>
          <Button onClick={switchToPersona}>仮面を被る</Button>
        </>
      ) : (
        <>
          <Badge variant="persona">🎭 仮面モード</Badge>
          <Button onClick={switchToGhost}>仮面を外す</Button>
        </>
      )}
    </div>
  );
}
```

**実装タスク**:

- [ ] 仮面状態表示コンポーネント作成
- [ ] 仮面切り替え Server Action 実装
- [ ] UI/UX デザイン作成
- [ ] ユーザーフィードバック収集

---

### [ ] 7. 監視・アラートの設定

**優先度**: 🟡 MEDIUM
**内容**: エラー監視、パフォーマンス監視

**推奨ツール**:

- **Vercel Analytics**: パフォーマンス監視
- **Sentry**: エラートラッキング
- **Better Uptime**: ダウンタイム監視

**実装タスク**:

- [ ] Sentry 設定
- [ ] Vercel Analytics 有効化
- [ ] アラート閾値の設定
- [ ] ダッシュボード構築

---

### [ ] 8. パフォーマンステスト

**優先度**: 🟡 MEDIUM
**内容**: 負荷テスト、レスポンス時間測定

**ツール**:

- **k6**: 負荷テスト
- **Lighthouse**: Web パフォーマンス測定

**実施項目**:

- [ ] 100 同時ユーザーでの負荷テスト
- [ ] DB クエリパフォーマンス測定
- [ ] Next.js ビルドサイズの確認
- [ ] Core Web Vitals の確認

---

### [ ] 9. セキュリティスキャン

**優先度**: 🟡 MEDIUM
**内容**: 脆弱性スキャン、依存関係チェック

**実施項目**:

```powershell
# npm audit
pnpm audit

# Snyk スキャン
npx snyk test

# OWASP ZAP (Web アプリケーションスキャン)
# 手動で実施
```

- [ ] `pnpm audit` 実行 (HIGH/CRITICAL の修正)
- [ ] Snyk スキャン実行
- [ ] OWASP ZAP スキャン実行

---

## 🟢 将来の拡張 (優先度低)

### [ ] 10. TODO Items の完了

**優先度**: 🟢 LOW
**内容**: コード内の TODO コメント対応

#### Notification System

[src/lib/notifications/schema.ts](../src/lib/notifications/schema.ts#L85-L120):
```typescript
// TODO: Drizzle ORM insert を実装
// TODO: Drizzle ORM update を実装
// TODO: Drizzle ORM select を実装
```

**実装**: Phase 4 (通知機能実装) で対応

#### Helper Tests

[src/lib/__tests__/helper.test.ts](../src/lib/__tests__/helper.test.ts):
```typescript
// TODO: セッションなし
// TODO: 有効なセッション
// TODO: ユーザーに Google と匿名ログイン
```

**実装**: 統合テスト実装時に対応

#### RBAC Integration Tests

[src/lib/auth/__tests__/rbac-helper.test.ts](../src/lib/auth/__tests__/rbac-helper.test.ts#L392-L421):
```typescript
describe.todo("RBAC Helper Functions - Integration Tests", () => {
  // TODO: 実装時にDB固有のセットアップを記述
});
```

**実装**: 現在の単体テストで十分カバーされているため、低優先度

---

## 📊 進捗管理

### 完了チェック

```
必須項目 (5/5 完了後、本番デプロイ可能):
[ ] 1. Legacy Schema Cleanup
[ ] 2. 本番環境での Smoke Test
[ ] 3. 環境変数の確認
[ ] 4. CORS & Trusted Origins の確認
[ ] 5. Rate Limiting の確認

推奨項目 (MVP リリース後):
[ ] 6. Ghost Mode UI の実装
[ ] 7. 監視・アラートの設定
[ ] 8. パフォーマンステスト
[ ] 9. セキュリティスキャン

将来の拡張:
[ ] 10. TODO Items の完了
```

---

**作成日**: 2026年3月1日
**参照**: [CODE_REVIEW_COMPREHENSIVE_20260301_V4.md](CODE_REVIEW_COMPREHENSIVE_20260301_V4.md)
**ステータス**: Production Ready (98%) - 必須項目完了後 100%
