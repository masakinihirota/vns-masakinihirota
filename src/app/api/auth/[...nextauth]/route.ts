import { handlers } from "@/lib/auth/authjs.config";

/**
 * Auth.js APIルートハンドラー
 * /api/auth/* の全リクエストを Auth.js が処理する
 */
export const { GET, POST } = handlers;
