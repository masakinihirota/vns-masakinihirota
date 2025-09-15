// グループ機能_手動グループ
"use client"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Work = {
	id: string
	title: string
	tier: number
	type: string
}

type UserProfile = {
	name: string
	works: Work[]
}

const myProfile: UserProfile = {
	name: "マイリスト",
	works: [
		{ id: "1", title: "進撃の巨人 1期", tier: 1, type: "anime" },
		{ id: "2", title: "進撃の巨人 2期", tier: 1, type: "anime" },
		{ id: "3", title: "進撃の巨人 3期", tier: 2, type: "anime" },
		{ id: "4", title: "進撃の巨人 4期", tier: 2, type: "anime" },
		{ id: "5", title: "新世紀エヴァンゲリオン", tier: 1, type: "anime" },
		{ id: "6", title: "ジョジョの奇妙な冒険 2期", tier: 3, type: "anime" },
		{ id: "7", title: "ミスター味っ子", tier: 3, type: "anime" },
		{ id: "8", title: "サイコパス 1期", tier: 2, type: "anime" },
		{ id: "9", title: "ハンターハンター 2011年版", tier: 1, type: "anime" },
		{ id: "10", title: "ハンターハンター 1999年版", tier: 3, type: "anime" },
		{ id: "11", title: "宇宙よりも遠い場所", tier: 2, type: "anime" },
		{ id: "12", title: "攻殻機動隊", tier: 4, type: "anime" },
		{ id: "13", title: "めぞん一刻", tier: 4, type: "anime" },
		{ id: "14", title: "小公女セーラ", tier: 5, type: "anime" },
		{ id: "15", title: "バブルガムクライシス", tier: 5, type: "anime" },
		{ id: "16", title: "おにいさまへ", tier: 4, type: "anime" },
		{ id: "17", title: "エースを狙え！", tier: 4, type: "anime" },
		{ id: "18", title: "ジョジョの奇妙な冒険 1期", tier: 3, type: "anime" },
		{ id: "19", title: "ジョジョの奇妙な冒険 3期", tier: 2, type: "anime" },
		{ id: "20", title: "PSYCHO-PASS サイコパス 3", tier: 6, type: "anime" },
		{ id: "21", title: "進撃の巨人", tier: 1, type: "manga" },
		{ id: "22", title: "寄生獣", tier: 2, type: "manga" },
		{ id: "23", title: "Dr.クマヒゲ", tier: 3, type: "manga" },
		{ id: "24", title: "アストロノーツ", tier: 4, type: "manga" },
		{ id: "25", title: "あしたのジョー", tier: 1, type: "manga" },
		{ id: "26", title: "風のストライド", tier: 5, type: "manga" },
		{ id: "27", title: "花咲ける青少年", tier: 4, type: "manga" },
		{ id: "28", title: "狼の口 ヴォルフスムント", tier: 3, type: "manga" },
		{ id: "29", title: "数字で遊ぼ", tier: 5, type: "manga" },
		{ id: "30", title: "ベルセルク", tier: 6, type: "manga" }
	]
}

const otherProfile: UserProfile = {
	name: "ユーザー",
	works: [
		{ id: "2", title: "進撃の巨人 2期", tier: 1, type: "anime" },
		{ id: "3", title: "進撃の巨人 3期", tier: 1, type: "anime" },
		{ id: "4", title: "進撃の巨人 4期", tier: 2, type: "anime" },
		{ id: "19", title: "ジョジョの奇妙な冒険 3期", tier: 1, type: "anime" },
		{ id: "9", title: "ハンターハンター 2011年版", tier: 1, type: "anime" },
		{ id: "11", title: "宇宙よりも遠い場所", tier: 2, type: "anime" },
		{ id: "1", title: "進撃の巨人 1期", tier: 2, type: "anime" },
		{ id: "101", title: "Dr.STONE", tier: 3, type: "anime" },
		{ id: "102", title: "オーバーロード 1期", tier: 3, type: "anime" },
		{ id: "18", title: "ジョジョの奇妙な冒険 1期", tier: 4, type: "anime" },
		{ id: "6", title: "ジョジョの奇妙な冒険 2期", tier: 3, type: "anime" },
		{ id: "5", title: "新世紀エヴァンゲリオン", tier: 6, type: "anime" },
		{ id: "21", title: "進撃の巨人", tier: 1, type: "manga" },
		{ id: "103", title: "ワンピース", tier: 1, type: "manga" },
		{ id: "104", title: "ドラゴンボール", tier: 2, type: "manga" },
		{ id: "105", title: "沈黙の艦隊", tier: 3, type: "manga" },
		{ id: "106", title: "MFゴースト", tier: 4, type: "manga" },
		{ id: "107", title: "数学ゴールデン", tier: 5, type: "manga" },
		{ id: "29", title: "数字で遊ぼ", tier: 5, type: "manga" },
		{ id: "108", title: "キングダム", tier: 6, type: "manga" }
	]
}

const categories = ["価値観", "人生", "今", "未来"]

export default function UserComparison() {
	const [selectedCategories, setSelectedCategories] = useState<string[]>([])
	const [currentTab, setCurrentTab] = useState("価値観")

	const handleCategoryChange = (category: string) => {
		setSelectedCategories((prev) =>
			prev.includes(category)
				? prev.filter((c) => c !== category)
				: [...prev, category]
		)
	}

	const handleAddToGroup = () => {
		alert("ユーザーをグループに追加しました。")
	}

	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-2xl font-bold mb-4'>ユーザー比較</h1>

			<div className='mb-4'>
				<h2 className='text-lg font-semibold mb-2'>カテゴリ選択：</h2>
				{categories.map((category) => (
					<Checkbox
						key={category}
						id={category}
						checked={selectedCategories.includes(category)}
						onCheckedChange={() => handleCategoryChange(category)}
					/>
				))}
			</div>

			<Tabs value={currentTab} onValueChange={setCurrentTab}>
				<TabsList>
					{categories.map((category) => (
						<TabsTrigger key={category} value={category}>
							{category}
						</TabsTrigger>
					))}
				</TabsList>

				{categories.map((category) => (
					<TabsContent key={category} value={category}>
						<div className='grid grid-cols-2 gap-4'>
							<Card>
								<CardHeader>
									<CardTitle>{myProfile.name}</CardTitle>
								</CardHeader>
								<CardContent>
									<ScrollArea className='h-[300px]'>
										{myProfile.works.map((work) => (
											<div key={work.id} className='mb-2'>
												<span className='font-semibold'>{work.title}</span>
												<span className='ml-2 text-sm text-gray-500'>
													Tier: {work.tier}
												</span>
											</div>
										))}
									</ScrollArea>
								</CardContent>
							</Card>
							<Card>
								<CardHeader>
									<CardTitle>{otherProfile.name}</CardTitle>
								</CardHeader>
								<CardContent>
									<ScrollArea className='h-[300px]'>
										{otherProfile.works.map((work) => (
											<div key={work.id} className='mb-2'>
												<span className='font-semibold'>{work.title}</span>
												<span className='ml-2 text-sm text-gray-500'>
													Tier: {work.tier}
												</span>
											</div>
										))}
									</ScrollArea>
								</CardContent>
							</Card>
						</div>
					</TabsContent>
				))}
			</Tabs>

			<div className='mt-4'>
				<Button onClick={handleAddToGroup}>グループに追加</Button>
			</div>
		</div>
	)
}
