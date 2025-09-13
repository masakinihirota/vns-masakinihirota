// 「人生」コンポーネント
import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

type Work = {
	id: string
	title: string
	tier: number
	type: string
}

type LifeComponentProps = {
	works: Work[]
}

export default function Component({ works = [] }: LifeComponentProps) {
	const [filter, setFilter] = useState<string | null>(null)

	const filteredWorks = filter
		? works.filter((work) => work.type === filter)
		: works

	const sortedWorks = filteredWorks.sort((a, b) => a.tier - b.tier)

	const typeColors: { [key: string]: string } = {
		anime: "bg-blue-500",
		manga: "bg-green-500"
	}

	return (
		<Card className='w-full max-w-3xl mx-auto'>
			<CardHeader>
				<CardTitle className='text-2xl font-bold text-center'>
					人生の作品
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='flex justify-center space-x-2 mb-4'>
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
				<ScrollArea className='h-[400px]'>
					<div className='space-y-2'>
						{sortedWorks.map((work) => (
							<div
								key={work.id}
								className='flex items-center justify-between p-2 bg-secondary rounded-lg'
							>
								<span className='font-medium'>{work.title}</span>
								<div className='flex items-center space-x-2'>
									<Badge className={`${typeColors[work.type]} text-white`}>
										{work.type === "anime" ? "アニメ" : "漫画"}
									</Badge>
									<Badge variant='outline'>Tier {work.tier}</Badge>
								</div>
							</div>
						))}
					</div>
				</ScrollArea>
			</CardContent>
		</Card>
	)
}
