// グループ機能_自動グループ
"use client"

import { useEffect, useState } from "react"
import { UserCircle, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

type Work = {
	id: string
	title: string
	tier: number
	type: string
}

type User = {
	name: string
	works: Work[]
}

type GroupMember = {
	name: string
	matchingWorks: Work[]
}

export default function Component() {
	const [myProfile, setMyProfile] = useState<User>({
		name: "マイリスト",
		works: [
			{ id: "1", title: "進撃の巨人 1期", tier: 1, type: "anime" },
			{ id: "2", title: "進撃の巨人 2期", tier: 1, type: "anime" },
			{ id: "3", title: "進撃の巨人 3期", tier: 2, type: "anime" },
			{ id: "4", title: "進撃の巨人 4期", tier: 2, type: "anime" },
			{ id: "5", title: "新世紀エヴァンゲリオン", tier: 1, type: "anime" },
			{ id: "19", title: "ジョジョの奇妙な冒険 3期", tier: 2, type: "anime" }
		]
	})

	const [groupMembers, setGroupMembers] = useState<GroupMember[]>([])
	const [ranking, setRanking] = useState<{ [key: string]: number }>({})

	useEffect(() => {
		// 自動グループ作成のシミュレーション
		const simulateAutoGrouping = () => {
			const newMembers: GroupMember[] = [
				{
					name: "ユーザー1",
					matchingWorks: [
						{ id: "2", title: "進撃の巨人 2期", tier: 1, type: "anime" },
						{ id: "3", title: "進撃の巨人 3期", tier: 1, type: "anime" },
						{ id: "4", title: "進撃の巨人 4期", tier: 2, type: "anime" }
					]
				},
				{
					name: "ユーザー2",
					matchingWorks: [
						{ id: "1", title: "進撃の巨人 1期", tier: 2, type: "anime" },
						{ id: "2", title: "進撃の巨人 2期", tier: 1, type: "anime" },
						{
							id: "19",
							title: "ジョジョの奇妙な冒険 3期",
							tier: 1,
							type: "anime"
						}
					]
				},
				{
					name: "ユーザー3",
					matchingWorks: [
						{ id: "3", title: "進撃の巨人 3期", tier: 1, type: "anime" },
						{ id: "4", title: "進撃の巨人 4期", tier: 2, type: "anime" },
						{ id: "5", title: "新世紀エヴァンゲリオン", tier: 1, type: "anime" }
					]
				}
			]
			setGroupMembers(newMembers)
		}

		simulateAutoGrouping()
	}, [])

	useEffect(() => {
		// ランキングの計算
		const newRanking: { [key: string]: number } = {}
		groupMembers.forEach((member) => {
			member.matchingWorks.forEach((work) => {
				if (newRanking[work.title]) {
					newRanking[work.title]++
				} else {
					newRanking[work.title] = 1
				}
			})
		})
		setRanking(newRanking)
	}, [groupMembers])

	const removeMember = (memberName: string) => {
		setGroupMembers(groupMembers.filter((member) => member.name !== memberName))
	}

	return (
		<div className='p-4 bg-background text-foreground'>
			<h1 className='text-2xl font-bold mb-4'>自動グループ機能</h1>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				<Card>
					<CardHeader>
						<CardTitle>グループメンバー</CardTitle>
					</CardHeader>
					<CardContent>
						<ScrollArea className='h-[300px]'>
							{groupMembers.map((member, index) => (
								<div
									key={index}
									className='flex items-center justify-between mb-2 p-2 bg-secondary rounded-lg'
								>
									<div className='flex items-center'>
										<UserCircle className='mr-2' />
										<span>{member.name}</span>
									</div>
									<Button
										variant='ghost'
										size='icon'
										onClick={() => removeMember(member.name)}
									>
										<X className='h-4 w-4' />
									</Button>
								</div>
							))}
						</ScrollArea>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>作品ランキング</CardTitle>
					</CardHeader>
					<CardContent>
						<ScrollArea className='h-[300px]'>
							{Object.entries(ranking)
								.sort(([, a], [, b]) => b - a)
								.map(([title, count], index) => (
									<div
										key={index}
										className='flex justify-between items-center mb-2 p-2 bg-secondary rounded-lg'
									>
										<span>{title}</span>
										<span className='font-bold'>{count}人</span>
									</div>
								))}
						</ScrollArea>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
