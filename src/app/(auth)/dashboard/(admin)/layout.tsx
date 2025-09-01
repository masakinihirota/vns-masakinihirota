// 【Next.js】管理者用ページを Route Groups で実現する
// https://zenn.dev/chot/articles/next-layout-for-admin-page

// getLoginUser や isAdminUser は適当な関数を用意します。

"use server"
import "server-only"

export default function Layout({ children }: { children: React.ReactNode }) {
	return <>{children}</>
}
