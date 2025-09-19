// ユーザープロフィール比較機能

"use client"
import { useState } from "react"
import { ThumbsUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select"

type Work = {
	id: string
	title: string
	tier: number
	type: string
}

type Profile = {
	name: string
	works: Work[]
}

export default function Component() {
	const [myProfile, _setMyProfile] = useState<Profile>({
		name: "マイリスト",
		works: [
			{ id: "1", title: "進撃の巨人 1期", tier: 1, type: "anime" },
			{ id: "2", title: "進撃の巨人 2期", tier: 1, type: "anime" },
			{ id: "3", title: "進撃の巨人 3期", tier: 2, type: "anime" },
			{ id: "4", title: "進撃の巨人 4期", tier: 2, type: "anime" },
			{ id: "5", title: "新世紀エヴァンゲリオン", tier: 1, type: "anime" }
			// ... 他の作品
		]
	})

	const [otherProfile, _setOtherProfile] = useState<Profile>({
		name: "ユーザー",
		works: [
			{ id: "2", title: "進撃の巨人 2期", tier: 1, type: "anime" },
			{ id: "3", title: "進撃の巨人 3期", tier: 1, type: "anime" },
			{ id: "4", title: "進撃の巨人 4期", tier: 2, type: "anime" },
			{ id: "19", title: "ジョジョの奇妙な冒険 3期", tier: 1, type: "anime" },
			{ id: "9", title: "ハンターハンター 2011年版", tier: 1, type: "anime" }
			// ... 他の作品
		]
	})

	const [relationship, setRelationship] = useState("ウォッチャー")

	const commonWorks = myProfile.works.filter((myWork) =>
		otherProfile.works.some((otherWork) => otherWork.id === myWork.id)
	)

	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-2xl font-bold mb-4'>評価比較画面</h1>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				<Card>
					<CardHeader>
						<CardTitle>{myProfile.name}のプロフィール</CardTitle>
					</CardHeader>
					<CardContent>
						<ul>
							{myProfile.works.map((work) => (
								<li key={work.id} className='mb-2'>
									{work.title} (Tier: {work.tier})
									<Button variant='outline' size='sm' className='ml-2'>
										<ThumbsUp className='w-4 h-4 mr-1' />
										いいね
									</Button>
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>{otherProfile.name}のプロフィール</CardTitle>
					</CardHeader>
					<CardContent>
						<ul>
							{otherProfile.works.map((work) => (
								<li key={work.id} className='mb-2'>
									{work.title} (Tier: {work.tier})
									<span className='ml-2 text-sm text-gray-500'>
										登録者数: {Math.floor(Math.random() * 1000)}
									</span>
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
			</div>
			<Card className='mt-4'>
				<CardHeader>
					<CardTitle>共通の作品</CardTitle>
				</CardHeader>
				<CardContent>
					<ul>
						{commonWorks.map((work) => (
							<li key={work.id} className='mb-2'>
								{work.title}
							</li>
						))}
					</ul>
				</CardContent>
			</Card>
			<div className='mt-4 flex items-center gap-4'>
				<Select value={relationship} onValueChange={setRelationship}>
					<SelectTrigger className='w-[200px]'>
						<SelectValue placeholder='関係を選択' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='ウォッチャー'>ウォッチャー</SelectItem>
						<SelectItem value='フォロー'>フォロー</SelectItem>
						<SelectItem value='プレパートナー'>プレパートナー</SelectItem>
						<SelectItem value='パートナー'>パートナー</SelectItem>
					</SelectContent>
				</Select>
				<Button>関係を更新</Button>
				<Button variant='secondary'>グループに招待</Button>
			</div>
		</div>
	)
}
