import Link from "next/link"

import { AnonymousLoginForm } from "@/components/oauth/oauth-anonymous/anonymous-login-form"
import { GitHubLoginForm } from "@/components/oauth/oauth-github/github-login-form"
import { GoogleLoginForm } from "@/components/oauth/oauth-google/google-login-form"

export default function Page() {
	return (
		<div className='min-h-screen flex flex-col items-center justify-center bg-black text-white px-4 py-8'>
			{/* 開発者情報ヘッダー */}
			<div className='text-center mb-8'>
				<h2 className='text-lg font-bold'>開発中 masakinihirota</h2>
				<p className='text-sm text-gray-400'>現在の環境: development</p>
				<p className='text-sm text-gray-400 mt-2'>
					昨日僕が感動したことを、今日の君はまだ知らない。
				</p>
				<p className='text-sm text-gray-400'>ログインしていません</p>
			</div>

			<h1 className='text-2xl font-bold mb-8'>
				ユーザーの認証方法を選択してください
			</h1>

			{/* ログインフォーム */}
			<div className='flex flex-col md:flex-row gap-6 w-full max-w-5xl justify-center'>
				<AnonymousLoginForm className='flex-1 min-w-0' />
				<GoogleLoginForm className='flex-1 min-w-0' />
				<GitHubLoginForm className='flex-1 min-w-0' />
			</div>

			<Link
				href='/'
				className='text-sm text-blue-500 mt-8 hover:text-blue-400 transition-colors'
			>
				TOPページに戻る
			</Link>
		</div>
	)
}
