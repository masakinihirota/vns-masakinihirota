# タスク完了後の実行項目

## 必須チェック項目

### 1. コード品質チェック
```powershell
# リント・フォーマット・型チェックを一括実行
pnpm check
```

### 2. ビルドテスト
```powershell
# 本番ビルドが成功するか確認
pnpm build
```

### 3. データベース整合性
```powershell
# Drizzleスキーマ生成（変更があった場合）
pnpm db:generate

# マイグレーション確認
supabase db diff
```

## 推奨チェック項目

### 4. 開発サーバーテスト
```powershell
# 開発サーバーが正常起動するか確認
pnpm dev
# http://localhost:3000 で動作確認
```

### 5. 国際化対応チェック
- 日本語（デフォルト）、英語、ドイツ語での表示確認
- `src/components/i18n/messages/` のメッセージファイル更新

### 6. 認証フローテスト
- Google OAuth ログイン
- GitHub OAuth ログイン  
- 匿名認証
- ログアウト機能

### 7. レスポンシブデザイン確認
- モバイル表示
- タブレット表示
- デスクトップ表示
- ダークモード/ライトモード切り替え

## Git操作
```powershell
# 変更をステージング（Huskyが自動でlint-stagedを実行）
git add .

# コミット（自動でpnpm checkが実行される）
git commit -m "feat: 実装内容の説明"

# プッシュ前の最終確認
git status
git log --oneline -5
```

## エラー対応
- Biomeエラー: `pnpm check`で自動修正を試行
- TypeScriptエラー: 型定義の見直し
- Supabaseエラー: `supabase status`で確認