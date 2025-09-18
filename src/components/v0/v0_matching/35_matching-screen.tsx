// マッチング画面
"use client"

import { useEffect, useState } from "react"
import { AlertCircle, Check, Save, Trash2, UserMinus } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type UserProfile = {
	id: string
	name: string
	avatar: string
	values: string[]
	favorites: { category: string; title: string }[]
}

type Group = {
	id: string
	name: string
	members: UserProfile[]
}

const dummyProfiles: UserProfile[] = [
	{
		id: "1",
		name: "田中太郎",
		avatar: "/placeholder.svg?height=40&width=40",
		values: ["誠実", "協調性", "創造性"],
		favorites: [
			{ category: "アニメ", title: "鬼滅の刃" },
			{ category: "漫画", title: "ワンピース" },
			{ category: "ゲーム", title: "ゼルダの伝説" }
		]
	},
	{
		id: "2",
		name: "山田花子",
		avatar: "/placeholder.svg?height=40&width=40",
		values: ["誠実", "積極性", "創造性"],
		favorites: [
			{ category: "アニメ", title: "進撃の巨人" },
			{ category: "映画", title: "インターステラー" },
			{ category: "小説", title: "1Q84" }
		]
	},
	{
		id: "3",
		name: "佐藤次郎",
		avatar: "/placeholder.svg?height=40&width=40",
		values: ["誠実", "協調性", "積極性"],
		favorites: [
			{ category: "ゲーム", title: "ファイナルファンタジー" },
			{ category: "漫画", title: "ドラゴンボール" },
			{ category: "アニメ", title: "ナルト" }
		]
	},
	{
		id: "4",
		name: "鈴木美香",
		avatar: "/placeholder.svg?height=40&width=40",
		values: ["協調性", "創造性", "積極性"],
		favorites: [
			{ category: "小説", title: "ハリーポッター" },
			{ category: "映画", title: "アベンジャーズ" },
			{ category: "アニメ", title: "ジブリ作品" }
		]
	}
]

export function MatchingScreen() {
	const [groups, setGroups] = useState<Group[]>([])
	const [points, setPoints] = useState(1000)
	const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)
	const [matchingHistory, setMatchingHistory] = useState<Group[][]>([])
	const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0)
	const [blockedUsers, setBlockedUsers] = useState<string[]>([])
	const [savedGroups, setSavedGroups] = useState<Group[]>([])

	const performMatching = () => {
		if (points < 100) {
			alert("ポイントが不足しています。")
			return
		}

		setPoints((prevPoints) => prevPoints - 100)

		const newGroups: Group[] = []
		const usedProfiles: Set<string> = new Set()

		dummyProfiles.forEach((profile) => {
			if (!usedProfiles.has(profile.id) && !blockedUsers.includes(profile.id)) {
				const group: Group = {
					id: `group-${newGroups.length + 1}`,
					name: `グループ ${newGroups.length + 1}`,
					members: [profile]
				}

				dummyProfiles.forEach((otherProfile) => {
					if (
						profile.id !== otherProfile.id &&
						!usedProfiles.has(otherProfile.id) &&
						!blockedUsers.includes(otherProfile.id)
					) {
						const commonValues = profile.values.filter((value) =>
							otherProfile.values.includes(value)
						)
						const commonFavorites = profile.favorites.filter((fav) =>
							otherProfile.favorites.some(
								(otherFav) =>
									otherFav.category === fav.category &&
									otherFav.title === fav.title
							)
						)
						if (commonValues.length >= 2 || commonFavorites.length >= 1) {
							group.members.push(otherProfile)
							usedProfiles.add(otherProfile.id)
						}
					}
				})

				newGroups.push(group)
				usedProfiles.add(profile.id)
			}
		})

		setGroups(newGroups)
		setMatchingHistory((prevHistory) => [...prevHistory, newGroups])
		setCurrentHistoryIndex((prevIndex) => prevIndex + 1)
	}

	useEffect(() => {
		performMatching()
	}, [])

	useEffect(() => {
		const timer = setInterval(() => {
			setPoints((prevPoints) => Math.min(prevPoints + 1000, 1000))
		}, 86400000)

		return () => clearInterval(timer)
	}, [])

	const handleDeleteGroup = (groupId: string) => {
		setGroups((prevGroups) =>
			prevGroups.filter((group) => group.id !== groupId)
		)
	}

	const handleBlockUser = (userId: string) => {
		setBlockedUsers((prevBlockedUsers) => [...prevBlockedUsers, userId])
		setGroups((prevGroups) =>
			prevGroups
				.map((group) => ({
					...group,
					members: group.members.filter((member) => member.id !== userId)
				}))
				.filter((group) => group.members.length > 0)
		)
	}

	const handleSaveGroup = (group: Group) => {
		setSavedGroups((prevSavedGroups) => [...prevSavedGroups, group])
	}

	const handleHistoryNavigation = (index: number) => {
		if (index >= 0 && index < matchingHistory.length) {
			setGroups(matchingHistory[index])
			setCurrentHistoryIndex(index)
		}
	}

	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-2xl font-bold mb-4'>マッチング画面</h1>

			<div className='mb-4'>
				<Progress value={(points / 1000) * 100} className='w-full' />
				<p className='text-sm text-gray-600 mt-1'>残りポイント: {points}</p>
			</div>

			<div className='flex justify-between items-center mb-4'>
				<Button onClick={performMatching} disabled={points < 100}>
					マッチングをやり直す（100ポイント）
				</Button>
				<div className='flex gap-2'>
					<Button
						onClick={() => handleHistoryNavigation(currentHistoryIndex - 1)}
						disabled={currentHistoryIndex === 0}
					>
						前のマッチング
					</Button>
					<Button
						onClick={() => handleHistoryNavigation(currentHistoryIndex + 1)}
						disabled={currentHistoryIndex === matchingHistory.length - 1}
					>
						次のマッチング
					</Button>
				</div>
			</div>

			<Tabs defaultValue='current'>
				<TabsList>
					<TabsTrigger value='current'>現在のマッチング</TabsTrigger>
					<TabsTrigger value='saved'>保存されたグループ</TabsTrigger>
				</TabsList>
				<TabsContent value='current'>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4'>
						{groups.map((group) => (
							<Card key={group.id} className='relative'>
								<CardHeader>
									<CardTitle>{group.name}</CardTitle>
								</CardHeader>
								<CardContent>
									<div className='flex flex-wrap gap-2 mb-2'>
										{group.members.map((member) => (
											<Avatar key={member.id}>
												<AvatarImage src={member.avatar} alt={member.name} />
												<AvatarFallback>{member.name[0]}</AvatarFallback>
											</Avatar>
										))}
									</div>
									<div className='flex justify-between mt-2'>
										<Button
											variant='outline'
											size='sm'
											onClick={() => setSelectedGroup(group)}
										>
											詳細を見る
										</Button>
										<div className='flex gap-2'>
											<Button
												variant='outline'
												size='icon'
												onClick={() => handleDeleteGroup(group.id)}
											>
												<Trash2 className='h-4 w-4' />
												<span className='sr-only'>グループを削除</span>
											</Button>
											<Button
												variant='outline'
												size='icon'
												onClick={() => handleSaveGroup(group)}
											>
												<Save className='h-4 w-4' />
												<span className='sr-only'>グループを保存</span>
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</TabsContent>
				<TabsContent value='saved'>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4'>
						{savedGroups.map((group) => (
							<Card key={group.id}>
								<CardHeader>
									<CardTitle>{group.name}</CardTitle>
								</CardHeader>
								<CardContent>
									<div className='flex flex-wrap gap-2'>
										{group.members.map((member) => (
											<Avatar key={member.id}>
												<AvatarImage src={member.avatar} alt={member.name} />
												<AvatarFallback>{member.name[0]}</AvatarFallback>
											</Avatar>
										))}
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</TabsContent>
			</Tabs>

			{selectedGroup && (
				<Card className='mt-8'>
					<CardHeader>
						<CardTitle>{selectedGroup.name}の詳細</CardTitle>
					</CardHeader>
					<CardContent>
						<ScrollArea className='h-[300px]'>
							<h3 className='font-semibold mb-2'>メンバー</h3>
							{selectedGroup.members.map((member) => (
								<div key={member.id} className='flex items-start gap-2 mb-4'>
									<Avatar>
										<AvatarImage src={member.avatar} alt={member.name} />
										<AvatarFallback>{member.name[0]}</AvatarFallback>
									</Avatar>
									<div className='flex-1'>
										<div className='flex justify-between items-center'>
											<span className='font-medium'>{member.name}</span>
											<Button
												variant='outline'
												size='icon'
												onClick={() => handleBlockUser(member.id)}
											>
												<UserMinus className='h-4 w-4' />
												<span className='sr-only'>ユーザーをブロック</span>
											</Button>
										</div>
										<div className='mt-1'>
											<h4 className='text-sm font-semibold'>価値観:</h4>
											<div className='flex flex-wrap gap-1 mt-1'>
												{member.values.map((value) => (
													<Badge key={value} variant='secondary'>
														{value}
													</Badge>
												))}
											</div>
										</div>
										<div className='mt-2'>
											<h4 className='text-sm font-semibold'>好きな作品:</h4>
											<ul className='list-disc list-inside text-sm'>
												{member.favorites.map((fav, index) => (
													<li key={index}>
														{fav.category}: {fav.title}
													</li>
												))}
											</ul>
										</div>
									</div>
								</div>
							))}
						</ScrollArea>
						<h3 className='font-semibold mt-4 mb-2'>共通の価値観</h3>
						<div className='flex flex-wrap gap-1'>
							{Array.from(
								new Set(
									selectedGroup.members.flatMap((member) => member.values)
								)
							).map((value) => (
								<Badge key={value}>{value}</Badge>
							))}
						</div>
						<h3 className='font-semibold mt-4 mb-2'>共通の好きな作品</h3>
						<ul className='list-disc list-inside'>
							{Array.from(
								new Set(
									selectedGroup.members.flatMap((member) =>
										member.favorites.map(
											(fav) => `${fav.category}: ${fav.title}`
										)
									)
								)
							).map((fav, index) => (
								<li key={index}>{fav}</li>
							))}
						</ul>
					</CardContent>
				</Card>
			)}

			{blockedUsers.length > 0 && (
				<Alert className='mt-8'>
					<AlertCircle className='h-4 w-4' />
					<AlertTitle>ブロックされたユーザー</AlertTitle>
					<AlertDescription>
						以下のユーザーはマッチングから除外されています：
						<ul className='list-disc list-inside mt-2'>
							{blockedUsers.map((userId) => {
								const user = dummyProfiles.find(
									(profile) => profile.id === userId
								)
								return user ? <li key={userId}>{user.name}</li> : null
							})}
						</ul>
					</AlertDescription>
				</Alert>
			)}
		</div>
	)
}
