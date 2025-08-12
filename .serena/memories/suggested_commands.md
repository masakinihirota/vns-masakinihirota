# 推奨開発コマンド（Windows環境）

## 開発サーバー
```powershell
# 開発サーバー起動（Turbopack使用）
pnpm dev

# 本番ビルド
pnpm build

# 本番サーバー起動
pnpm start
```

## データベース操作
```powershell
# データベースセットアップ
pnpm db:setup

# データベースシード実行
pnpm db:seed

# Drizzleスキーマ生成
pnpm db:generate

# マイグレーション実行
pnpm db:migrate

# Drizzle Studio起動
pnpm db:studio
```

## コード品質
```powershell
# リンター実行（自動修正付き）
pnpm lint

# フォーマッター実行
pnpm format

# リント・フォーマット・型チェック実行
pnpm check
```

## Supabase関連
```powershell
# Supabaseローカル環境起動
supabase start

# Supabaseローカル環境停止
supabase stop

# マイグレーション生成
supabase db diff -f <migration_name>

# マイグレーション適用
supabase db push
```

## Git操作（Windows）
```powershell
# ファイル一覧
Get-ChildItem

# ディレクトリ移動
Set-Location <path>

# テキスト検索
Select-String -Pattern "pattern" -Path "*.ts"

# ファイル検索
Get-ChildItem -Recurse -Name "*.tsx"
```

## Huskyによる自動実行
- コミット時: `lint-staged`が自動実行
- `*.{ts,tsx}`ファイルに対して `pnpm check` が実行される