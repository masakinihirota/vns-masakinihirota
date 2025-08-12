# プロジェクト構造

## ディレクトリ構成
```
vns-masakinihirota/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # 認証が必要なページ
│   │   ├── (unauth)/          # 認証不要なページ
│   │   ├── api/               # APIルート
│   │   ├── layout.tsx         # ルートレイアウト
│   │   └── globals.css        # グローバルCSS
│   ├── components/            # Reactコンポーネント
│   │   ├── ui/               # shadcn/uiコンポーネント
│   │   ├── shadcnui-blocks/  # 再利用可能なブロック
│   │   ├── oauth/            # 認証関連コンポーネント
│   │   └── i18n/             # 国際化コンポーネント
│   ├── hooks/                # カスタムフック
│   ├── lib/                  # ユーティリティ・設定
│   │   └── supabase/         # Supabase設定
│   └── modules/              # 機能別モジュール
├── supabase/                 # Supabase設定・マイグレーション
├── supabase_drizzle/         # Drizzleスキーマ
├── public/                   # 静的ファイル
└── _sql-test/               # SQLテストファイル
```

## 主要ファイル
- `next.config.ts`: Next.js設定（next-intl統合）
- `drizzle.config.ts`: Drizzle ORM設定
- `biome.json`: コード品質ツール設定
- `tsconfig.json`: TypeScript設定
- `supabase/config.toml`: Supabase設定

## 認証フロー
- ルートグループ `(auth)` と `(unauth)` で認証状態を分離
- OAuth（Google/GitHub）と匿名認証に対応
- `middleware.ts`で認証チェック

## データベース構造
- `root_accounts`: ユーザー詳細情報
- `languages`: 多言語対応
- Supabaseの`auth.users`と連携