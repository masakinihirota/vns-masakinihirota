import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

// ブラウザ環境用のMSWワーカーセットアップ
export const worker = setupWorker(...handlers);

// ブラウザ環境でのワーカー制御用のヘルパー関数
export const mswWorker = {
  // ワーカーを開始
  start: async () => {
    if (typeof window !== "undefined") {
      await worker.start({
        onUnhandledRequest: "warn",
        serviceWorker: {
          url: "/mockServiceWorker.js",
        },
      });
    }
  },

  // ワーカーを停止
  stop: () => {
    if (typeof window !== "undefined") {
      worker.stop();
    }
  },

  // リクエストハンドラーをリセット
  reset: () => {
    if (typeof window !== "undefined") {
      worker.resetHandlers();
    }
  },

  // 新しいハンドラーを追加
  use: (...newHandlers: Parameters<typeof worker.use>) => {
    if (typeof window !== "undefined") {
      worker.use(...newHandlers);
    }
  },

  // ハンドラーをリセットして新しいハンドラーを設定
  resetHandlers: (...newHandlers: Parameters<typeof worker.resetHandlers>) => {
    if (typeof window !== "undefined") {
      worker.resetHandlers(...newHandlers);
    }
  },
};

// 開発環境でのMSW有効化（オプション）
export const enableMswInDevelopment = async () => {
  if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
    const { worker } = await import("./browser");
    await worker.start();
    console.log("MSW enabled in development mode");
  }
};
