// Vercel Design Specification
"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Supabaseクライアントの初期化（実際の値に置き換えてください）
const supabase = createClient("YOUR_SUPABASE_URL", "YOUR_SUPABASE_ANON_KEY")

export default function UserProfile() {
	const [user, setUser] = useState(null)
	const [name, setName] = useState("")
	const [email, setEmail] = useState("")

	useEffect(() => {
		fetchUserProfile()
	}, [])

	async function fetchUserProfile() {
		const {
			data: { user }
		} = await supabase.auth.getUser()
		if (user) {
			const { data, error } = await supabase
				.from("users")
				.select("*")
				.eq("id", user.id)
				.single()

			if (error) console.error("Error fetching user profile:", error)
			else {
				setUser(data)
				setName(data.name)
				setEmail(data.email)
			}
		}
	}

	async function handleUpdate(e) {
		e.preventDefault()
		const { data, error } = await supabase
			.from("users")
			.update({ name, email })
			.eq("id", user.id)

		if (error) console.error("Error updating user profile:", error)
		else {
			console.log("Profile updated successfully:", data)
			fetchUserProfile() // 更新後にプロフィールを再取得
		}
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
