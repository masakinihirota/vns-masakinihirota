# 本番環境セットアップガイド

このドキュメントでは、本番環境（Vercel + Neon PostgreSQL）でのセットアップ手順を説明します。

## 概要

本番環境は以下の構成です：
- **ホスティング**: Vercel
- **データベース**: Neon Serverless PostgreSQL  
- **認証**: Better Auth + Google/GitHub OAuth

## 環境変数の設定

### 1. Vercel の Environment Variables に設定する

Vercel ダッシュボード（https://vercel.com/dashboard）で、以下の手順でプロジェクトの環境変数を設定します：

#### a. プロジェクト設定にアクセス
1. Vercel ダッシュボードで「vns-masakinihirota」プロジェクトをクリック
2. 「Settings」タブをクリック
3. 左メニューから「Environment Variables」をクリック

#### b. 環境変数を追加
以下の環境変数を追加します：

```
DATABASE_URL=postgresql://[user]:[password]@[neon-endpoint]/[database]?sslmode=require&channel_binding=require
BETTER_AUTH_SECRET=[generate-new-32-char-secret]
BETTER_AUTH_URL=https://vns-masakinihirota.vercel.app
NEXT_PUBLIC_APP_URL=https://vns-masakinihirota.vercel.app
NEXT_PUBLIC_BETTER_AUTH_URL=https://vns-masakinihirota.vercel.app
NEXT_PUBLIC_USE_REAL_AUTH=true
NEXT_PUBLIC_MOCK_DATA=false
NEXT_PUBLIC_USE_MOCK_ARTWORKS=false
GOOGLE_CLIENT_ID=your-production-google-client-id
GOOGLE_CLIENT_SECRET=your-production-google-client-secret
GITHUB_CLIENT_ID=your-production-github-client-id
GITHUB_CLIENT_SECRET=your-production-github-client-secret
```

---

## Google OAuth の設定（重要）

### 前提条件
- Google Cloud アカウント
- Google Cloud Console へのアクセス権限

### 手順

#### 1. Google Cloud Console にアクセス
https://console.cloud.google.com

#### 2. OAuth 2.0 認証情報を作成
1. 左メニューから「認証情報」を選択
2. 「認証情報を作成」 → 「OAuth クライアント ID」
3. アプリケーションタイプで「ウェブアプリケーション」を選択

#### 3. 認可済みリダイレクト URI を設定
以下のリダイレクト URI を追加します：
```
https://vns-masakinihirota.vercel.app/api/auth/callback/google
```

#### 4. クライアント ID とシークレットをコピー
作成されたクライアント ID とシークレットを Vercel の環境変数に設定します：
- `GOOGLE_CLIENT_ID` = クライアント ID
- `GOOGLE_CLIENT_SECRET` = クライアント シークレット

---

## GitHub OAuth の設定（重要）

### 前提条件
- GitHub アカウント
- GitHub リポジトリの管理者権限

### 手順

#### 1. GitHub Developer Settings にアクセス
https://github.com/settings/developers

#### 2. 新しい OAuth App を作成
1. 「New OAuth App」をクリック
2. 以下の情報を入力：
   - **Application name**: VNS masakinihirota
   - **Homepage URL**: `https://vns-masakinihirota.vercel.app`
   - **Authorization callback URL**: `https://vns-masakinihirota.vercel.app/api/auth/callback/github`

#### 3. クライアント ID とシークレットをコピー
作成されたアプリ Settings ページから：
- `GITHUB_CLIENT_ID` = Client ID
- `GITHUB_CLIENT_SECRET` = Client Secret（新しく生成）

#### 4. Vercel の環境変数に設定
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`

---

## デプロイと検証

### 環境変数設定後
1. Vercel が自動的に再デプロイされます
2. https://vns-masakinihirota.vercel.app にアクセス
3. ログインページで Google / GitHub ログインが機能するか確認

### エラーが発生した場合
- **"ネットワーク接続の問題"**: 環境変数の URL が正しく設定されているか確認
- **"認可できません"**: Google/GitHub の認可済みリダイレクト URI が正しいか確認
- **"不正なリダイレクト URI"**: `https://vns-masakinihirota.vercel.app/api/auth/callback/google` や `/api/auth/callback/github` が許可リストに追加されているか確認

---

## セキュリティに関する注意事項

### 本番環境用の BETTER_AUTH_SECRET
現在は開発用の値が設定されています。本番環境では新しいシークレットを生成してください：

```bash
# Linux/macOS
openssl rand -hex 16

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# PowerShell
[Convert]::ToHexString([byte[]]$(1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

生成された値を Vercel の環境変数に設定します。

### 環境変数の管理
- 機密情報（シークレット、トークン）は `.env.production` に保存しないこと
- すべての機密情報は Vercel ダッシュボード上で管理すること
- Git リポジトリには `.env.production` をコミットしないこと（.gitignore で無視済み）

---

## トラブルシューティング

### Google ログインが失敗する場合
1. `GOOGLE_CLIENT_ID` と `GOOGLE_CLIENT_SECRET` が正しいか確認
2. Google Cloud Console でリダイレクト URI が `https://vns-masakinihirota.vercel.app/api/auth/callback/google` に設定されているか確認
3. ブラウザの開発者ツール（F12）→ Console タブでエラーメッセージを確認

### GitHub ログインが失敗する場合
1. `GITHUB_CLIENT_ID` と `GITHUB_CLIENT_SECRET` が正しいか確認
2. GitHub OAuth App の認可コールバック URL が `https://vns-masakinihirota.vercel.app/api/auth/callback/github` に設定されているか確認
3. Vercel の環境変数が再デプロイ後に反映されているか確認（Vercel ダッシュボード → Deployments → 最新のデプロイ Status を確認）

### 環境変数が反映されない場合
1. Vercel ダッシュボード → Environment Variables で設定が保存されているか確認
2. Deployments タブで最新デプロイが「Ready」ステータスになっているか確認
3. 必要に応じて手動で再デプロイ：Deployments → 最新デプロイ → メニュー → Redeploy

---

## ローカル開発環境

ローカルで開発する場合は、`.env.local` や `.env.development` を使用します：

```
DATABASE_URL=postgresql://postgres:password@localhost:5433/neondb
BETTER_AUTH_SECRET=dev-secret-for-local-testing
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_USE_REAL_AUTH=true
GOOGLE_CLIENT_ID=your-google-dev-client-id
GOOGLE_CLIENT_SECRET=your-google-dev-client-secret
GITHUB_CLIENT_ID=your-github-dev-client-id
GITHUB_CLIENT_SECRET=your-github-dev-client-secret
```

> **Note**: 開発環境の OAuth credentials は、Google Cloud Console と GitHub OAuth App Settings で localhost 用に別途登録してください。リダイレクト URI は `http://localhost:3000/api/auth/callback/google` と `http://localhost:3000/api/auth/callback/github` を使用します。

ローカルで Docker PostgreSQL を使用する場合:
```bash
docker-compose up -d
```

---

## 参考資料

- Better Auth ドキュメント: https://www.better-auth.com
- Neon ドキュメント: https://docs.neon.tech
- Vercel ドキュメント: https://vercel.com/docs
- Google OAuth 設定: https://support.google.com/cloud/answer/6158849
- GitHub OAuth 設定: https://docs.github.com/en/developers/apps/building-oauth-apps
