import { setupServer } from "msw/node";
import { handlers } from "./handlers";

// MSW サーバーのセットアップ
export const server = setupServer(...handlers);

// テスト環境でのサーバー制御用のヘルパー関数
export const mswServer = {
  // サーバーを開始
  start: () => {
    server.listen({
      onUnhandledRequest: "warn",
    });
  },

  // サーバーを停止
  stop: () => {
    server.close();
  },

  // リクエストハンドラーをリセット
  reset: () => {
    server.resetHandlers();
  },

  // 新しいハンドラーを追加
  use: (...newHandlers: Parameters<typeof server.use>) => {
    server.use(...newHandlers);
  },

  // ハンドラーをリセットして新しいハンドラーを設定
  resetHandlers: (...newHandlers: Parameters<typeof server.resetHandlers>) => {
    server.resetHandlers(...newHandlers);
  },
};

// デバッグ用のヘルパー
export const enableMswLogging = () => {
  server.events.on("request:start", ({ request }) => {
    console.log("MSW intercepted:", request.method, request.url);
  });

  server.events.on("request:match", ({ request }) => {
    console.log("MSW matched:", request.method, request.url);
  });

  server.events.on("request:unhandled", ({ request }) => {
    console.log("MSW unhandled:", request.method, request.url);
  });
};

// テスト用のカスタムハンドラー作成ヘルパー
export { http, HttpResponse } from "msw";
