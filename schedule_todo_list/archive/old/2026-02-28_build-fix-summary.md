# 2026-02-28 ビルドエラー修正サマリー

> **修正日時**: 2026-02-28 18:47完了
> **目的**: 実装チケット3の完了確認後に発見されたビルドエラーを全て修正

---

## 🎯 修正概要

実装チケット3が「完了」とマークされていたが、実際には **pnpm build が失敗する** 状態でした。
本日、以下のビルドエラーをすべて修正し、**ビルド成功**を達成しました。

---

## 🐛 発見されたエラー一覧

### 1. 依存関係の欠落

**エラー**:
```
Module not found: Can't resolve '@paralleldrive/cuid2'
```

**原因**:
- `src/db/schema.ts` で `@paralleldrive/cuid2` を使用しているが、`package.json` に追加されていなかった

**修正**:
- `package.json` に `"@paralleldrive/cuid2": "^2.2.2"` を追加
- `pnpm install` でインストール

**ファイル**:
- ✅ [package.json](../package.json)

---

### 2. Server Action "use server" 制約違反

**エラー**:
```
Only async functions are allowed to be exported in a "use server" file.
```

**原因**:
- `src/lib/auth/rbac-helper.ts` が `"use server"` ディレクティブを持つファイル
- `withAuth` Higher-Order Function（非async関数）を同ファイルでエクスポートしようとした
- `rbacHelpers` オブジェクトをエクスポートしようとした（Next.js 16 では禁止）

**修正**:
1. `withAuth` を別ファイル (`src/lib/auth/with-auth.ts`) に分離
2. 必要な箇所で `with-auth.ts` から直接インポート
3. `rbacHelpers` オブジェクトのエクスポートを削除（個別の関数エクスポートのみ残す）

**ファイル**:
- ✅ [src/lib/auth/with-auth.ts](../src/lib/auth/with-auth.ts)（新規作成）
- ✅ [src/lib/auth/rbac-helper.ts](../src/lib/auth/rbac-helper.ts)（修正）
- ✅ [src/lib/auth/index.ts](../src/lib/auth/index.ts)（修正）
- ✅ [src/lib/auth/helper.ts](../src/lib/auth/helper.ts)（インポート修正）

---

### 3. スキーマフィールド名の不一致

**エラー**:
```
Property 'userProfileId' does not exist on type 'groupMembers'
Property 'targetProfileId' does not exist on type 'relationships'
```

**原因**:
- `src/db/schema.ts` では `userId` を使用
- `src/lib/auth/rbac-helper.ts` では `userProfileId` を使用（古いフィールド名）
- 同様に `targetUserId` vs `targetProfileId` の不一致

**修正**:
- `rbac-helper.ts` のフィールド名をスキーマに合わせて修正
  - `groupMembers.userProfileId` → `groupMembers.userId`
  - `relationships.targetProfileId` → `relationships.targetUserId`

**ファイル**:
- ✅ [src/lib/auth/rbac-helper.ts](../src/lib/auth/rbac-helper.ts)（3箇所修正）

---

### 4. 重複ファイル（auth-guard.ts と auth-guard.tsx）

**エラー**:
```
Type error: Type expected. (JSX構文エラー)
```

**原因**:
- `auth-guard.ts` と `auth-guard.tsx` の両方が存在
- `.ts` ファイルがビルド時に優先されたが、JSXを含むため型エラー

**修正**:
- `src/lib/auth-guard.ts` を削除（`.tsx` のみ残す）

**ファイル**:
- ✅ [src/lib/auth-guard.tsx](../src/lib/auth-guard.tsx)（保持）
- ❌ `src/lib/auth-guard.ts`（削除）

---

### 5. 重複エクスポート（TypeScript エラー）

**エラー**:
```
Type error: Cannot redeclare exported variable 'checkPlatformAdmin'.
```

**原因**:
- 関数定義時に `export async function checkPlatformAdmin()` を使用
- さらにファイル末尾で `export { checkPlatformAdmin }` を追加
- 二重エクスポートでTypeScriptエラー

**修正**:
- ファイル末尾の個別エクスポート文を削除
- 関数定義時のエクスポートのみ使用

**ファイル**:
- ✅ [src/lib/auth/rbac-helper.ts](../src/lib/auth/rbac-helper.ts)

---

## ✅ 修正結果

### ビルド成功

```bash
pnpm build
```

**出力**:
```
▲ Next.js 16.1.6 (Turbopack)
- Environments: .env.local, .env.production, .env

  Creating an optimized production build ...
✓ Compiled successfully in 9.0s
✓ Finished TypeScript in 10.4s
✓ Collecting page data using 11 workers in 1799.8ms
✓ Generating static pages using 11 workers (9/9) in 568.6ms
✓ Finalizing page optimization in 9.6ms

Route (app)
┌ ○ /
├ ○ /_not-found
├ ƒ /admin
├ ƒ /api/auth/[...all]
├ ○ /faq
├ ○ /help
├ ƒ /home
├ ƒ /login
└ ○ /signup

ƒ Proxy (Middleware)

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

✅ **全エラー解消、ビルド成功**

---

## 📋 修正ファイル一覧

| ファイル | 変更内容 |
|---------|---------|
| [package.json](../package.json) | `@paralleldrive/cuid2` 追加 |
| [src/lib/auth/with-auth.ts](../src/lib/auth/with-auth.ts) | ✨ 新規作成（withAuth分離） |
| [src/lib/auth/rbac-helper.ts](../src/lib/auth/rbac-helper.ts) | スキーマフィールド名修正、withAuth削除、重複エクスポート削除 |
| [src/lib/auth/index.ts](../src/lib/auth/index.ts) | withAuthのインポート元変更、rbacHelpers削除 |
| [src/lib/auth/helper.ts](../src/lib/auth/helper.ts) | withAuthのインポート元変更 |
| ~~src/lib/auth-guard.ts~~ | 🗑️ 削除（.tsxのみ保持） |

---

## 🎯 完了条件チェック

| 条件 | 状態 |
|------|------|
| ヘルパー関数が実装されている | ✅ YES |
| すべての関数に対するテストが作成されている | ❌ NO（スケルトンのみ） |
| ESLintエラーがない | ✅ YES |
| TypeScriptコンパイルエラーがない | ✅ YES |
| pnpm build が成功する | ✅ YES |
| `src/lib/auth/index.ts` で再エクスポートされている | ✅ YES |
| 実装ガイド・使用例が充実している | ✅ YES |

---

## 🚨 残りのタスク

### 高優先度

- [ ] **テストケースの実装**（`src/lib/auth/__tests__/rbac-helper.test.ts`）
  - 現在はスケルトンのみ（41行）
  - モックセッションデータの定義
  - 各関数の単体テスト実装
  - エッジケーステスト実装

### 中優先度

- [ ] **実際の動作検証**
  - 開発環境でのServer Action実行テスト
  - 権限チェック動作の検証

### 低優先度（月曜日以降）

- [ ] **Drizzleマイグレーション実行**
  - `pnpm db:generate`
  - `pnpm db:migrate`
- [ ] **RLSポリシー適用**
  - `scripts/apply-rls-policies.js` 実行

---

## 🎓 学んだこと

### Next.js 16 の "use server" 制約

- `"use server"` ディレクティブを持つファイルは、**async関数のみ**エクスポート可能
- オブジェクトや非async関数は別ファイルに分離する必要がある
- この制約は Turbopack の厳格な検証によるもの

### スキーマ整合性の重要性

- Drizzle ORM のスキーマとクエリコードのフィールド名は厳密に一致させる
- スキーマ変更時は、すべての参照箇所を更新する必要がある
- TypeScript の型チェックで早期に発見できる

### ファイル拡張子の正確性

- JSXを含む場合は必ず `.tsx` を使用
- `.ts` と `.tsx` が混在すると、ビルド時に優先順位の問題が発生する

---

## 📝 メモ

このビルド修正により、実装チケット3は「一部完了」に更新されました。
コードは実装され、ビルドは成功しますが、**テストが未実装**のため、完全な「完了」とは言えません。

次のステップは、**テストケースの実装**と**実際の動作検証**です。
