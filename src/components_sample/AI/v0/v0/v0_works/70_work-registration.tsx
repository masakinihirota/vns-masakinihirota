// 作品登録画面
"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Component() {
	const [title, setTitle] = useState("")
	const [category, _setCategory] = useState("anime")
	const [tier, setTier] = useState("1")

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		// ここで作品登録のロジックを実装します
		console.log("登録:", { title, category, tier })
		// 登録後にフォームをリセット
		setTitle("")
		setTier("1")
	}

	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-2xl font-bold mb-4'>作品登録</h1>
			<Tabs defaultValue='anime'>
				<TabsList className='grid w-full grid-cols-4'>
					<TabsTrigger value='anime'>アニメ</TabsTrigger>
					<TabsTrigger value='manga'>漫画</TabsTrigger>
					<TabsTrigger value='movie'>映画</TabsTrigger>
					<TabsTrigger value='game'>ゲーム</TabsTrigger>
				</TabsList>
				{["anime", "manga", "movie", "game"].map((cat) => (
					<TabsContent key={cat} value={cat}>
						<form onSubmit={handleSubmit} className='space-y-4'>
							<div>
								<Label htmlFor='title'>タイトル</Label>
								<Input
									id='title'
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									required
								/>
							</div>
							<div>
								<Label htmlFor='tier'>ティア</Label>
								<Select value={tier} onValueChange={setTier}>
									<SelectTrigger>
										<SelectValue placeholder='ティアを選択' />
									</SelectTrigger>
									<SelectContent>
										{[1, 2, 3, 4, 5, 6].map((t) => (
											<SelectItem key={t} value={t.toString()}>
												{t}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<Button type='submit'>登録</Button>
						</form>
					</TabsContent>
				))}
			</Tabs>
		</div>
	)
}
