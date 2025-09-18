// リスト＆タグ」コンポーネント
"use client"

import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Work = {
	id: string
	title: string
	tier: number
	type: string
}

type List = {
	name: string
	works: Work[]
}

export default function Component() {
	const [lists, setLists] = useState<List[]>([
		{
			name: "マイリスト",
			works: [
				{ id: "1", title: "進撃の巨人 1期", tier: 1, type: "anime" },
				{ id: "2", title: "進撃の巨人 2期", tier: 1, type: "anime" },
				{ id: "5", title: "新世紀エヴァンゲリオン", tier: 1, type: "anime" },
				{ id: "21", title: "進撃の巨人", tier: 1, type: "manga" },
				{ id: "22", title: "寄生獣", tier: 2, type: "manga" }
			]
		}
	])
	const [tags, setTags] = useState<string[]>([
		"最高傑作",
		"勉強になる本",
		"天文、宇宙の物語"
	])
	const [newTag, setNewTag] = useState("")
	const [selectedTags, setSelectedTags] = useState<string[]>([])

	const addTag = () => {
		if (newTag && !tags.includes(newTag)) {
			setTags([...tags, newTag])
			setNewTag("")
		}
	}

	const toggleTag = (tag: string) => {
		setSelectedTags(
			selectedTags.includes(tag)
				? selectedTags.filter((t) => t !== tag)
				: [...selectedTags, tag]
		)
	}

	const filteredWorks = lists[0].works.filter((work) =>
		selectedTags.length === 0 ? true : selectedTags.includes(work.title)
	)

	return (
		<Card className='w-full max-w-3xl'>
			<CardHeader>
				<CardTitle>リスト＆タグ</CardTitle>
			</CardHeader>
			<CardContent>
				<Tabs defaultValue='list' className='w-full'>
					<TabsList>
						<TabsTrigger value='list'>リスト</TabsTrigger>
						<TabsTrigger value='tags'>タグ</TabsTrigger>
					</TabsList>
					<TabsContent value='list'>
						<ScrollArea className='h-[300px] w-full rounded-md border p-4'>
							{filteredWorks.map((work) => (
								<div
									key={work.id}
									className='flex items-center justify-between py-2'
								>
									<span>{work.title}</span>
									<Badge variant='secondary'>{work.type}</Badge>
								</div>
							))}
						</ScrollArea>
					</TabsContent>
					<TabsContent value='tags'>
						<div className='flex flex-wrap gap-2 mb-4'>
							{tags.map((tag) => (
								<Badge
									key={tag}
									variant={selectedTags.includes(tag) ? "default" : "outline"}
									className='cursor-pointer'
									onClick={() => toggleTag(tag)}
								>
									{tag}
								</Badge>
							))}
						</div>
						<div className='flex gap-2'>
							<Input
								placeholder='新しいタグを追加'
								value={newTag}
								onChange={(e) => setNewTag(e.target.value)}
							/>
							<Button onClick={addTag}>追加</Button>
						</div>
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	)
}
