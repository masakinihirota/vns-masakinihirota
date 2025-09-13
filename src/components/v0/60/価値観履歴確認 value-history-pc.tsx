"use client"

import { useState } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ValueCount {
	[key: string]: number
}

interface ValueHistory {
	topic: string
	counts: ValueCount
}

interface UserValueHistory {
	userId: string
	username: string
	history: ValueHistory[]
}

const mockData: UserValueHistory[] = [
	{
		userId: "1",
		username: "ユーザー1",
		history: [
			{
				topic: "タバコ",
				counts: { 吸う: 5, 吸わない: 4 }
			},
			{
				topic: "食事について",
				counts: { バランスよく3食: 7, "1日一回1食": 2, コンビニ飯: 1 }
			},
			{
				topic: "仕事の優先度",
				counts: { 仕事優先: 3, プライベート優先: 6, バランス重視: 1 }
			}
		]
	},
	{
		userId: "2",
		username: "ユーザー2",
		history: [
			{
				topic: "タバコ",
				counts: { 吸う: 2, 吸わない: 8 }
			},
			{
				topic: "食事について",
				counts: { バランスよく3食: 4, "1日一回1食": 5, コンビニ飯: 1 }
			},
			{
				topic: "仕事の優先度",
				counts: { 仕事優先: 7, プライベート優先: 2, バランス重視: 1 }
			}
		]
	}
]

export default function Component() {
	const [selectedUser, setSelectedUser] = useState<string>(mockData[0].userId)

	const renderValueCounts = (counts: ValueCount) => {
		return Object.entries(counts).map(([option, count]) => (
			<div key={option} className='flex justify-between items-center mb-2'>
				<span className='font-medium'>{option}</span>
				<span className='bg-primary text-primary-foreground px-2 py-1 rounded'>
					{count}
				</span>
			</div>
		))
	}

	return (
		<Card className='w-full max-w-6xl mx-auto'>
			<CardHeader>
				<CardTitle className='text-3xl'>価値観の履歴確認</CardTitle>
			</CardHeader>
			<CardContent>
				<Tabs defaultValue={selectedUser} onValueChange={setSelectedUser}>
					<TabsList className='grid w-full grid-cols-2 mb-6'>
						{mockData.map((user) => (
							<TabsTrigger
								key={user.userId}
								value={user.userId}
								className='text-lg'
							>
								{user.username}
							</TabsTrigger>
						))}
					</TabsList>
					{mockData.map((user) => (
						<TabsContent key={user.userId} value={user.userId}>
							<h2 className='text-2xl font-semibold mb-4'>
								{user.username}の価値観履歴
							</h2>
							<div className='grid grid-cols-3 gap-6'>
								{user.history.map((item, index) => (
									<Card key={index}>
										<CardHeader>
											<CardTitle>{item.topic}</CardTitle>
										</CardHeader>
										<CardContent>
											<ScrollArea className='h-[200px]'>
												{renderValueCounts(item.counts)}
											</ScrollArea>
										</CardContent>
									</Card>
								))}
							</div>
						</TabsContent>
					))}
				</Tabs>
			</CardContent>
		</Card>
	)
}
