import { toNextJsHandler } from "better-auth/next-js";

import { auth } from "@/lib/auth";

/**
 * Better-Auth 全ルート用ハンドラー
 */
const handler = toNextJsHandler(auth);

/**
 *
 * @param request
 */
export async function GET(request: Request) { return handler.GET(request); }
/**
 *
 * @param request
 */
export async function POST(request: Request) { return handler.POST(request); }
