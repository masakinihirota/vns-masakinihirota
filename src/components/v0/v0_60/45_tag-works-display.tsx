// タグ別作品表示
"use client"

import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

type Work = {
	id: string
	title: string
	tier: number
	type: string
	tags?: string[]
}

const dummyWorks: Work[] = [
	{
		id: "1",
		title: "進撃の巨人 1期",
		tier: 1,
		type: "anime",
		tags: ["アクション", "ダーク", "レジェンド"]
	},
	{
		id: "2",
		title: "進撃の巨人 2期",
		tier: 1,
		type: "anime",
		tags: ["アクション", "ダーク", "レジェンド"]
	},
	{
		id: "5",
		title: "新世紀エヴァンゲリオン",
		tier: 1,
		type: "anime",
		tags: ["SF", "心理", "レジェンド"]
	},
	{
		id: "9",
		title: "ハンターハンター 2011年版",
		tier: 1,
		type: "anime",
		tags: ["冒険", "アクション", "レジェンド"]
	},
	{
		id: "21",
		title: "進撃の巨人",
		tier: 1,
		type: "manga",
		tags: ["アクション", "ダーク", "レジェンド"]
	},
	{
		id: "22",
		title: "寄生獣",
		tier: 2,
		type: "manga",
		tags: ["ホラー", "SF", "名作"]
	}
]

export default function Component45() {
	const [selectedTag, setSelectedTag] = useState<string>("")
	const [filteredWorks, setFilteredWorks] = useState<Work[]>(dummyWorks)

	const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const tag = e.target.value
		setSelectedTag(tag)
		if (tag) {
			setFilteredWorks(dummyWorks.filter((work) => work.tags?.includes(tag)))
		} else {
			setFilteredWorks(dummyWorks)
		}
	}

	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-2xl font-bold mb-4'>タグ別作品表示</h1>
			<div className='mb-4'>
				<Input
					type='text'
					placeholder='タグを入力してください'
					value={selectedTag}
					onChange={handleTagChange}
					className='max-w-sm'
				/>
			</div>
			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
				{filteredWorks.map((work) => (
					<Card key={work.id}>
						<CardHeader>
							<CardTitle>{work.title}</CardTitle>
						</CardHeader>
						<CardContent>
							<p>タイプ: {work.type}</p>
							<p>ティア: {work.tier}</p>
							<div className='mt-2'>
								{work.tags?.map((tag) => (
									<Badge key={tag} variant='secondary' className='mr-1'>
										{tag}
									</Badge>
								))}
							</div>
						</CardContent>
					</Card>
				))}
			</div>
			{filteredWorks.length === 0 && (
				<p className='text-center mt-4'>該当する作品が見つかりませんでした。</p>
			)}
		</div>
	)
}
