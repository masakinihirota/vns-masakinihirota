import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";

/**
 * Better-Auth 全ルート用ハンドラー
 */
export const { GET, POST } = toNextJsHandler(auth);
