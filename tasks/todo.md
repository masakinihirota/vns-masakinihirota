# Strict Review Round 2 Fixes

## 1. Accessibility Guidelines (vitest-axe)
- [ ] `vitest-axe`のインストール (`pnpm add -D vitest-axe`)
- [ ] `vitest.setup.ts`に`vitest-axe`のマッチャーを追加
- [ ] 既存のUIコンポーネントテスト(`*.test.tsx`)に、`toHaveNoViolations`のアクセシビリティチェックを追加
  - 例: `src/components/error-boundary.tsx` のテストがあれば修正（なければ作成）
  - 例: `src/app/auth/setup-root-account/page.tsx` など、その他のUIテスト

## 2. TypeScript Typing (`any`の排除)
- [ ] `src/lib/api/services/users.ts` の `any` を `unknown` 等に修正
- [ ] `src/lib/api/routes/users.ts` の 引数 `c: any` を `Context` に修正
- [ ] `src/lib/api/middleware/zod-validator.ts` の `any` を正しい型に修正
- [ ] `src/lib/api/middleware/rate-limit.ts` の `any` を正しい型に修正
- [ ] その他のプロダクションコードの `any` を適宜修正（テストは今回は保留または可能な範囲で修正）

## 3. 完了チェック
- [ ] `pnpm lint` で Lintエラーがないか確認
- [ ] `pnpm build` で TypeScriptとビルドエラーがないか確認
- [ ] `pnpm test run` で すべてのテストがパスするか確認
