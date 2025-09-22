import Link from "next/link"

export default function GeminiComponents() {
	return (
		<div>
			{/* TOPページに置くリンクの一部をGemini コンポーネント用に設定 */}
			<br />
			<h2>Gemini コンポーネント用のリンク集</h2>
			<br />
			{/* 価値観の選択肢の画面 */}
			{/* 01ページへのリンク */}
			<Link href='/01'>01 価値観の選択肢の画面ページへ</Link>
			<br />
			<Link href='/02'>02 作品リストページへ</Link>
			<br />
			{/* 価値観選択 コンポーネント */}
			<Link href='/03'>03 価値観選択 シングル コンポーネントページへ</Link>
			<br />
			<Link href='/04'>04 価値観選択 マルチ コンポーネントページへ</Link>
			<br />
			{/* 料金コンポーネント */}
			<Link href='/05'>05 料金コンポーネントページへ</Link>
			<br />
			{/* ルートアカウント */}
			<Link href='/06'>06 ルートアカウントページへ</Link>
			<br />
			<Link href='/07'>07 ルートアカウント管理画面ページへ 静的UI</Link>
			<br />
		</div>
	)
}
