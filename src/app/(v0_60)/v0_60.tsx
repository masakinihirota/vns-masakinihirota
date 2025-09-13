// v0_60.tsx: v0_60コンポーネント群の動作確認用ページ

import Link from "next/link"

export default function V0_60Page() {
	return (
		<div>
			TOPページに置くリンクの一部をv0_60用に設定
			<br />
			<Link href='/01_now-favorites'>01_now-favorites</Link>
			<br />
			<Link href='/02_life-component'>02_life-component</Link>
			<br />
			<Link href='/03_future-works'>03_future-works</Link>
			<br />
			{/* 03以降もここにリンクを置く */}
		</div>
	)
}
