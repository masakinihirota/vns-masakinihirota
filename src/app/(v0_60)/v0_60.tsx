import Link from "next/link"

import type React from "react"

const V0_60: React.FC<{ children?: React.ReactNode }> = () => {
	return (
		<>
			{/* v0のコンポーネントのリンクを並べる。 */}
			v0_60 開始
			<br />
			<br />
			<Link href='/01_now-favorites'>01 今のお気に入り コンポーネント</Link>
			<br />
			<br />
			{/* src\components\v0\60\02_life-component.tsx */}
			<br />
			<br />
			<br /> v0_60 終わり
			<br />
		</>
	)
}

export default V0_60
