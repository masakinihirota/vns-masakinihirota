// エイリアスを使わず、正しい相対パスでスキーマ集約ファイルをインポート
import { schema } from "../../../../drizzle/schema"

import RootAccountDashboard from "@/components_sample/AI/v0/v0_folder/root-accounts/root-account-dashboard"
// Drizzleクライアントとスキーマをインポート
import { db } from "@/lib/db"

import type { RootAccountDashboardData } from "@/components_sample/AI/v0/v0_folder/root-accounts/root-account-dashboard.types"

/**
 * サーバーサイドでデータを取得する関数
 */
async function getDashboardData() {
	// `schema.userProfiles` を使ってクエリを修正
	const profiles = await db.select().from(schema.userProfiles)

	// 本来は認証ユーザー情報から取得しますが、ここでは仮のデータを設定
	const hardcodedUserData = {
		id: "root_001",
		name: "田中太郎（DB接続済）",
		avatar: "/diverse-user-avatars.png"
	}

	// HOMEコンポーネントが必要とする形式にデータを整形
	const dashboardData: RootAccountDashboardData = {
		user: {
			...hardcodedUserData,
			profiles: profiles.map((p) => ({
				title: p.title,
				type: p.type,
				description: p.description || "",
				active: p.isActive,
				badgeColor: p.badgeColor || "gray"
			}))
		},
		// TODO: 以下のデータも今後DBから取得するように実装
		groups: { managed: [], joined: [] },
		alliances: { leader: [], member: [] },
		accountStatus: {
			status: "アクティブ",
			type: "プレミアム",
			days: 0,
			lastLogin: new Date().toLocaleDateString()
		},
		accountSettings: {
			tutorialDone: false,
			valuesAnswered: false,
			adsConsent: false,
			menuLevel: "基本"
		},
		warnings: { count: 0, resetCount: 0, lastReset: "" },
		oauth: {
			google: { connected: false, email: "" },
			github: { connected: false, username: "" },
			twitter: { connected: false },
			stats: { connected: 0, disconnected: 0 }
		},
		basicInfo: {
			language: { native: "日本語", available: [] },
			region: { current: "Area 1", areas: [] }
		}
	}

	return dashboardData
}

/**
 * ルートアカウント管理ページ (サーバーコンポーネント)
 */
export default async function RootAccountPage() {
	const dashboardData = await getDashboardData()

	return <RootAccountDashboard data={dashboardData} />
}
