"use client"

import { useState } from "react"

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
	type: "anime" | "manga"
}

type Props = {
	works?: Work[]
}

export default function Component({ works = [] }: Props) {
	const [filter, setFilter] = useState<"all" | "anime" | "manga">("all")
	const [tierFilter, setTierFilter] = useState<number | null>(null)

	const filteredWorks = works.filter(
		(work) =>
			(filter === "all" || work.type === filter) &&
			(tierFilter === null || work.tier === tierFilter)
	)

	const sortedWorks = [...filteredWorks].sort((a, b) => a.tier - b.tier)

	return (
		<Card className='w-full max-w-3xl mx-auto'>
			<CardHeader>
				<CardTitle>好きな作品</CardTitle>
				<div className='flex justify-between items-center'>
					<Select
						onValueChange={(value) =>
							setFilter(value as "all" | "anime" | "manga")
						}
					>
						<SelectTrigger className='w-[180px]'>
							<SelectValue placeholder='タイプで絞り込み' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='all'>全て</SelectItem>
							<SelectItem value='anime'>アニメ</SelectItem>
							<SelectItem value='manga'>漫画</SelectItem>
						</SelectContent>
					</Select>
					<div className='flex gap-2'>
						{[1, 2, 3, 4, 5, 6].map((tier) => (
							<Button
								key={tier}
								variant={tierFilter === tier ? "default" : "outline"}
								size='sm'
								onClick={() => setTierFilter(tierFilter === tier ? null : tier)}
							>
								{tier}
							</Button>
						))}
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
					{sortedWorks.map((work) => (
						<Card key={work.id}>
							<CardHeader>
								<CardTitle className='text-lg'>{work.title}</CardTitle>
							</CardHeader>
							<CardContent>
								<p>ティア: {work.tier}</p>
								<p>タイプ: {work.type === "anime" ? "アニメ" : "漫画"}</p>
							</CardContent>
						</Card>
					))}
				</div>
			</CardContent>
		</Card>
	)
}
