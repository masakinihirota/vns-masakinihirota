import Link from "next/link"
import { useTranslations } from "next-intl"

import V0_60 from "../../../(___sample)/v0_60"

import GeminiComponents from "@/app/(___sample)/(gemini)/gemini"
// V0_folder
import V0_folder from "@/app/(___sample)/v0_folder"
import { ModeToggle } from "@/app/(public)/ModeTogglePage/mode-toggle"
import LocaleSwitcher from "@/components/i18n/LocaleSwitcher"

// v0_folder.tsx

export default function Home() {
	// 翻訳
	const t = useTranslations("HomePage")
	const t2 = useTranslations("AppLayout")

	return (
		<>
			■ランディングページ
			<br></br>
			{/* ランディングページへのリンク */}
			<Link href='/landing1'>ランディングページ1</Link>
			<br></br>
			{/* ランディングページ2へのリンク */}
			<Link href='/landing2'>ランディングページ2</Link>
			<br></br>
			{/* ランディングページ3へのリンク */}
			<Link href='/landing3'>ランディングページ3</Link>
			<br></br>
			<br></br>
			■GeminiComponents
			<br></br>
			<GeminiComponents />
			<br></br>
			{/* v0_60のコンポーネントを使うページへのリンク */}
			V0_60
			<br></br>
			<V0_60 />
			{/* V0_folderのコンポーネントを使うページへのリンク */}
			V0_folder
			<br></br>
			<V0_folder />
			<br></br>
			{/* メインページへのリンク */}
			<Link href='/main-pages'>メインページへのリンク</Link>
			<br />
			{/* 価格のページ */}
			<Link href='/pricing'>価格のページ</Link>
			{/* 認証のページ */}
			<main className=''>
				{/* 認証ページへ */}
				<div className='w-full max-w-sm'>
					<h1>TOPページ</h1>
					{/* 言語スイッチ */}
					<div className='mb-4'>
						<LocaleSwitcher />
					</div>
					{/* 挨拶文(言語変更の確認) */}
					<h2>{t("title")}</h2>
					<h2>{t2("home")}</h2>
					{/* ダークモードボタン */}
					<Link href='./ModeTogglePage'>ModeTogglePage</Link>
					<div />
					{/* ToggleButton */}
					<ModeToggle />
					<p>認証 ログインページへ</p>
					<Link href='/login'>ログインページへ</Link>
					<div />
					{/* ログアウト */}
					<Link href='/logout'>ログアウトページへ</Link>
					<div />
					{/* 言語ページ */}
					<Link href='/lang'>言語ページ</Link>
					<div />
					{/* プロテクトページへ */}
					<Link href='/protected'>プロテクトページへ</Link>
				</div>
				{/* Hono */}
				<Link href='/hono'>Honoページへ </Link>
				<br />
				{/* Team */}
				<Link href='/team-03'>Teamページへ</Link>
				<br />
				{/* Root Accounts */}
				<Link href='/root_accounts'>Root Accountsページへ</Link>
				<br />
				{/* template:コンポーネント */}
				<Link href='/template'>コンポーネントのTemplateページへ</Link>
			</main>
			<footer className=''>footer</footer>
		</>
	)
}
