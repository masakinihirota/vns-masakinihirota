// リスト別作品表示
"use client"

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

type List = {
	name: string
	works: Work[]
}

type User = {
	name: string
	lists: List[]
}

// ダミーデータ
const users: User[] = [
	{
		name: "ユーザーA",
		lists: [
			{
				name: "人生に影響を与えた作品",
				works: [
					{
						id: "1",
						title: "チ。ー地球の運動についてー",
						tier: 1,
						type: "anime"
					},
					{ id: "2", title: "ちはやふる", tier: 2, type: "anime" }
				]
			},
			{
				name: "2024夏アニメ",
				works: [
					{ id: "3", title: "夏アニメ1", tier: 3, type: "anime" },
					{ id: "4", title: "夏アニメ2", tier: 4, type: "anime" }
				]
			}
		]
	},
	{
		name: "ユーザーB",
		lists: [
			{
				name: "人生に影響を与えた作品",
				works: [
					{
						id: "1",
						title: "チ。ー地球の運動についてー",
						tier: 1,
						type: "anime"
					},
					{ id: "5", title: "進撃の巨人", tier: 1, type: "anime" }
				]
			},
			{
				name: "2024秋アニメ",
				works: [
					{ id: "6", title: "秋アニメ1", tier: 2, type: "anime" },
					{ id: "7", title: "秋アニメ2", tier: 3, type: "anime" }
				]
			}
		]
	}
]

export default function Component() {
	const [selectedList, setSelectedList] = useState<string>(
		"人生に影響を与えた作品"
	)
	const [viewMode, setViewMode] = useState<"individual" | "group">("individual")

	const getGroupList = (listName: string): Work[] => {
		const allWorks = users.flatMap(
			(user) => user.lists.find((list) => list.name === listName)?.works || []
		)
		const workCounts = allWorks.reduce(
			(acc, work) => {
				acc[work.title] = (acc[work.title] || 0) + 1
				return acc
			},
			{} as Record<string, number>
		)
		return Object.entries(workCounts)
			.map(([title, count]) => ({
				id: allWorks.find((w) => w.title === title)?.id || "",
				title,
				tier: allWorks.find((w) => w.title === title)?.tier || 0,
				type: allWorks.find((w) => w.title === title)?.type || "",
				count
			}))
			.sort((a, b) => b.count - a.count)
	}

	const renderList = (list: Work[]) => (
		<ul className='space-y-2'>
			{list.map((work) => (
				<li key={work.id} className='flex justify-between items-center'>
					<span>{work.title}</span>
					{"count" in work && <Badge variant='secondary'>{work.count}</Badge>}
				</li>
			))}
		</ul>
	)

	return (
		<div className='container mx-auto p-4'>
			<div className='flex justify-between mb-4'>
				<Button onClick={() => setViewMode("individual")}>個人表示</Button>
				<Button onClick={() => setViewMode("group")}>グループ表示</Button>
			</div>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				{viewMode === "individual" ? (
					users.map((user) => (
						<Card key={user.name}>
							<CardHeader>
								<CardTitle>{user.name}のリスト</CardTitle>
							</CardHeader>
							<CardContent>
								<select
									className='w-full p-2 mb-4 border rounded'
									onChange={(e) => setSelectedList(e.target.value)}
									value={selectedList}
								>
									{user.lists.map((list) => (
										<option key={list.name} value={list.name}>
											{list.name}
										</option>
									))}
								</select>
								{renderList(
									user.lists.find((list) => list.name === selectedList)
										?.works || []
								)}
							</CardContent>
						</Card>
					))
				) : (
					<Card>
						<CardHeader>
							<CardTitle>グループの{selectedList}</CardTitle>
						</CardHeader>
						<CardContent>{renderList(getGroupList(selectedList))}</CardContent>
					</Card>
				)}
			</div>
		</div>
	)
}
