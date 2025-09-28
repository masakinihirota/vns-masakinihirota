// digital-agency-design-system
// japanese-cms
// mandala-chart
// manga-list
// manga-register
// math-correlation-diagram
// newsletter
// newsletter-signup
// next-supabase-drizzle-crud
// sidebar
// supabase-nextjs
// todo-app
// vns-root-account

import Link from "next/link"

export default function V0_folder() {
	return (
		<div>
			{/* TOPページに置くリンクの一部をv0_60用に設定 */}
			<br />
			<Link href='/digital-agency-design-system'>
				Digital Agency Design System
			</Link>
			<br />
			<Link href='/japanese-cms'>価値観の入力 Japanese CMS</Link>
			<br />
			<Link href='/mandala-chart'>マンダラチャート Mandala Chart</Link>
			<br />
			<Link href='/manga-register'>漫画登録 Manga Register</Link>
			<br />
			<Link href='/newsletter'>ログインカード Newsletter</Link>
			<br />
			<Link href='/newsletter-signup'>ログインカード Newsletter Signup</Link>
			<br />
			<Link href='/vns-root-account'>
				VNS Root Account ルートアカウント管理
			</Link>
			<br />
			<Link href='/supabase-nextjs'>Supabase Next.js</Link>
			<br />
			<Link href='/values-screen'>価値観一覧 Values Screen</Link>
			<br />
		</div>
	)
}
