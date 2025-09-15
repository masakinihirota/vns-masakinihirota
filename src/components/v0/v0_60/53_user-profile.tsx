// Vercel Design Specification
"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// ダミーデータのインポート
import dummyUserData from "./53_user-profile.dummyData.json"

// ユーザーの型定義
interface User {
	id: string
	name: string
	email: string
	avatar: string | null
	created_at: string
	updated_at: string
}

// Supabaseクライアントの初期化（実際の値に置き換えてください）
// const supabase = createClient("YOUR_SUPABASE_URL", "YOUR_SUPABASE_ANON_KEY")

export default function UserProfile() {
	const [user, setUser] = useState<User | null>(null)
	const [name, setName] = useState("")
	const [email, setEmail] = useState("")

	useEffect(() => {
		fetchUserProfile()
	}, [])

	async function fetchUserProfile() {
		// ダミーデータを使用
		setUser(dummyUserData)
		setName(dummyUserData.name)
		setEmail(dummyUserData.email)
	}

	async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()

		// ダミーデータの更新（実際のアプリケーションではAPI呼び出し）
		const updatedUser = {
			...dummyUserData,
			name,
			email,
			updated_at: new Date().toISOString()
		}

		// 状態を更新
		setUser(updatedUser)
		console.log("Profile updated successfully:", updatedUser)
	}

	if (!user) return <div>ログインしてください</div>

	return (
		<Card className='w-full max-w-md mx-auto'>
			<CardHeader>
				<CardTitle>ユーザープロフィール</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleUpdate} className='space-y-4'>
					<div>
						<Label htmlFor='name'>名前</Label>
						<Input
							id='name'
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
						/>
					</div>
					<div>
						<Label htmlFor='email'>メールアドレス</Label>
						<Input
							id='email'
							type='email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>
					<Button type='submit'>プロフィールを更新</Button>
				</form>
			</CardContent>
		</Card>
	)
}
