"use client"

// 「今」コンポーネント

import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Work = {
	id: string
	title: string
	tier: number
	type: string
}

type Props = {
	works: Work[]
}

export default function Component({ works = [] }: Props) {
	const [filter, setFilter] = useState<string | null>(null)

	const filteredWorks = filter
		? works.filter((work) => work.type === filter)
		: works

	const sortedWorks = filteredWorks.sort((a, b) => a.tier - b.tier)

	return (
		<Card className='w-full max-w-3xl mx-auto'>
			<CardHeader>
				<CardTitle className='text-2xl font-bold'>今のお気に入り</CardTitle>
				<div className='flex space-x-2 mt-2'>
					<Button
						variant={filter === null ? "default" : "outline"}
						onClick={() => setFilter(null)}
					>
						すべて
					</Button>
					<Button
						variant={filter === "anime" ? "default" : "outline"}
						onClick={() => setFilter("anime")}
					>
						アニメ
					</Button>
					<Button
						variant={filter === "manga" ? "default" : "outline"}
						onClick={() => setFilter("manga")}
					>
						漫画
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				<ul className='space-y-2'>
					{sortedWorks.map((work) => (
						<li
							key={work.id}
							className='flex items-center justify-between bg-secondary p-2 rounded-md'
						>
							<span className='font-medium'>{work.title}</span>
							<div className='flex items-center space-x-2'>
								<Badge variant='secondary'>Tier {work.tier}</Badge>
								<Badge>{work.type === "anime" ? "アニメ" : "漫画"}</Badge>
							</div>
						</li>
					))}
				</ul>
			</CardContent>
		</Card>
	)
}
