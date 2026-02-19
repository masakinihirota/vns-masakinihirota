import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

/**
 * Better-Auth 全ルート用ハンドラー
 */
export const { GET, POST } = toNextJsHandler(auth);
