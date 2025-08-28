// Template API route - minimal sample
// このファイルが空だと Next.js 型生成側で "not a module" エラーになるため
// 最小の GET ハンドラを定義してモジュール化する
import { NextResponse } from "next/server"

export const runtime = "edge" // 参考: 省略可

export async function GET() {
	return NextResponse.json({
		status: "ok",
		scope: "template",
		timestamp: Date.now()
	})
}

// 将来 POST などを追加する場合はここに追記
