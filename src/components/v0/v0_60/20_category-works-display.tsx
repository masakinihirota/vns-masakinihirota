// カテゴリ別作品表示

'use client'

import { useState } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Work = {
	id: string
	title: string
	tier: number
	type: string
}

type CategoryWorks = {
	[key: string]: Work[]
}

export default function Component() {
	const [works, setWorks] = useState<CategoryWorks>({
		anime: [
			{ id: "1", title: "進撃の巨人 1期", tier: 1, type: "anime" },
			{ id: "2", title: "進撃の巨人 2期", tier: 1, type: "anime" },
			{ id: "5", title: "新世紀エヴァンゲリオン", tier: 1, type: "anime" },
			{ id: "9", title: "ハンターハンター 2011年版", tier: 1, type: "anime" }
			// 他のアニメ作品...
		],
		manga: [
			{ id: "21", title: "進撃の巨人", tier: 1, type: "manga" },
			{ id: "22", title: "寄生獣", tier: 2, type: "manga" },
			{ id: "25", title: "あしたのジョー", tier: 1, type: "manga" },
			{ id: "30", title: "ベルセルク", tier: 6, type: "manga" }
			// 他の漫画作品...
		]
	})

	return (
		<Card className='w-full max-w-3xl mx-auto'>
			<CardHeader>
				<CardTitle className='text-2xl font-bold text-center'>
					カテゴリ別作品表示
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Tabs defaultValue='anime' className='w-full'>
					<TabsList className='grid w-full grid-cols-2'>
						<TabsTrigger value='anime'>アニメ</TabsTrigger>
						<TabsTrigger value='manga'>漫画</TabsTrigger>
					</TabsList>
					<TabsContent value='anime'>
						<ScrollArea className='h-[400px] w-full rounded-md border p-4'>
							<WorksList works={works.anime} />
						</ScrollArea>
					</TabsContent>
					<TabsContent value='manga'>
						<ScrollArea className='h-[400px] w-full rounded-md border p-4'>
							<WorksList works={works.manga} />
						</ScrollArea>
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	)
}

function WorksList({ works }: { works: Work[] }) {
	return (
		<ul className='space-y-2'>
			{works.map((work) => (
				<li
					key={work.id}
					className='flex items-center justify-between p-2 hover:bg-gray-100 rounded'
				>
					<span>{work.title}</span>
					<span className='text-sm text-gray-500'>ティア {work.tier}</span>
				</li>
			))}
		</ul>
	)
}
