# コードスタイル・規約

## TypeScript設定
- **Strict mode**: 有効
- **Target**: ES2017
- **Module resolution**: bundler
- **Path mapping**: `@/*` → `./src/*`

## ネーミング規約
- **ファイル名**: kebab-case（例: `user-profile.tsx`）
- **コンポーネント**: PascalCase（例: `UserProfile`）
- **関数・変数**: camelCase（例: `getUserProfile`）
- **定数**: UPPER_SNAKE_CASE（例: `API_BASE_URL`）

## コンポーネント構成
- shadcn/uiコンポーネントは `src/components/ui/` に配置
- カスタムコンポーネントは機能別ディレクトリに配置
- Blocksコンポーネントは `src/components/shadcnui-blocks/` に配置

## インポート順序
1. React/Next.js関連
2. サードパーティライブラリ
3. 内部モジュール（@/から始まる）
4. 相対パス

## 禁止事項
- `any`型の明示的使用（基本的に禁止、一部例外あり）
