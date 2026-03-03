[x] Hono RPC の活用: フロントエンド（Next.js）から Hono の型をインポートして hc (Hono Client) で型安全に通信できているか。

[x] Zod によるバリデーション:

[x] リクエスト（Body/Query/Param）のバリデーション。

[x] Drizzle の Schema から Zod の型を自動生成（drizzle-zod）しているか。

[x] Seed データの作成: 開発開始時に npm run seed でテストユーザーや初期設定を投入できる仕組み。

セキュリティ (Security)
[x] CORS 設定: Hono の cors ミドルウェアで許可するドメインを制限しているか。

[x] CSRF 対策: Next.js の Server Actions を使う場合は標準で備わっていますが、Hono API を直接叩く場合の対策（Token 等）。

[x] 環境変数の型安全: .env の内容を Zod でパースし、アプリケーション起動時に不足があればエラーを出す仕組み（env.ts 等）。

[x] セキュリティヘッダー: helmet 等のミドルウェアの導入。

[x] Health Check: /api/health など、DB接続やサーバーが生きているか確認するエンドポイント。


