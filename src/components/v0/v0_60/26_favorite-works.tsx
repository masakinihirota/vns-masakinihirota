// Favorite Work Components
'use client'


import { useState } from "react"
import { Book, Film, Star } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import dummyWorks from "./26_dummyData.json"

export type Work = {
	id: string
	title: string
	tier: number
	type: "anime" | "manga"
}

type WorksListProps = {
	name: string
	works: Work[]
}


const TierBadge = ({ tier }: { tier: number }) => {
	const colors = [
		"bg-red-500",
		"bg-orange-500",
		"bg-yellow-500",
		"bg-green-500",
		"bg-blue-500",
		"bg-indigo-500"
	]
	return (
		<Badge className={`${colors[tier - 1]} text-white`}>ティア {tier}</Badge>
	)
}

const WorkItem = ({ work }: { work: Work }) => (
	<Card className='mb-2'>
		<CardContent className='flex items-center justify-between p-4'>
			<div className='flex items-center space-x-2'>
				{work.type === "anime" ? (
					<Film className='h-4 w-4' />
				) : (
					<Book className='h-4 w-4' />
				)}
				<span>{work.title}</span>
			</div>
			<TierBadge tier={work.tier} />
		</CardContent>
	</Card>
)


// JSONデータの型チェック
const validateWorks = (data: any): Work[] => {
    if (!Array.isArray(data)) {
        throw new Error("Invalid data format: Expected an array.")
    }
    return data.map((item) => {
        if (typeof item.id !== "string" || typeof item.title !== "string" || typeof item.tier !== "number" || !["anime", "manga"].includes(item.type)) {
            throw new Error("Invalid data format: Work item is malformed.")
        }
        return item as Work
    })
}

const validatedDummyWorks = validateWorks(dummyWorks)

export default function FavoriteWorks(
	{ name, works }: WorksListProps = {
		name: "マイリスト",
		works: validatedDummyWorks
	}
) {
	const [filter, setFilter] = useState<"all" | "anime" | "manga">("all")

	const filteredWorks = works.filter((work) =>
		filter === "all" ? true : work.type === filter
	)

	return (
		<Card className='w-full max-w-3xl'>
			<CardHeader>
				<CardTitle className='flex items-center justify-between'>
					<span>{name}の好きな作品</span>
					<Star className='h-6 w-6 text-yellow-500' />
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Tabs defaultValue='all' className='w-full'>
					<TabsList className='grid w-full grid-cols-3'>
						<TabsTrigger value='all' onClick={() => setFilter("all")}>
							すべて
						</TabsTrigger>
						<TabsTrigger value='anime' onClick={() => setFilter("anime")}>
							アニメ
						</TabsTrigger>
						<TabsTrigger value='manga' onClick={() => setFilter("manga")}>
							漫画
						</TabsTrigger>
					</TabsList>
					<TabsContent value='all' className='mt-4'>
						{filteredWorks.map((work) => (
							<WorkItem key={work.id} work={work} />
						))}
					</TabsContent>
					<TabsContent value='anime' className='mt-4'>
						{filteredWorks.map((work) => (
							<WorkItem key={work.id} work={work} />
						))}
					</TabsContent>
					<TabsContent value='manga' className='mt-4'>
						{filteredWorks.map((work) => (
							<WorkItem key={work.id} work={work} />
						))}
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	)
}
