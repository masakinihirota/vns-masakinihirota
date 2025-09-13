import { useState } from "react"
import { ChevronRight, Heart, Star, Users } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Work = {
	id: string
	title: string
	tier: number
	type: string
}

type UserProfile = {
	name: string
	works: Work[]
}

export default function Component() {
	const [currentUser, setCurrentUser] = useState<UserProfile>({
		name: "マイリスト",
		works: [
			{ id: "1", title: "進撃の巨人 1期", tier: 1, type: "anime" },
			{ id: "2", title: "進撃の巨人 2期", tier: 1, type: "anime" },
			{ id: "3", title: "進撃の巨人 3期", tier: 2, type: "anime" },
			{ id: "4", title: "進撃の巨人 4期", tier: 2, type: "anime" },
			{ id: "5", title: "新世紀エヴァンゲリオン", tier: 1, type: "anime" },
			{ id: "21", title: "進撃の巨人", tier: 1, type: "manga" },
			{ id: "22", title: "寄生獣", tier: 2, type: "manga" }
		]
	})

	const [otherUser, setOtherUser] = useState<UserProfile>({
		name: "ユーザー",
		works: [
			{ id: "2", title: "進撃の巨人 2期", tier: 1, type: "anime" },
			{ id: "3", title: "進撃の巨人 3期", tier: 1, type: "anime" },
			{ id: "4", title: "進撃の巨人 4期", tier: 2, type: "anime" },
			{ id: "19", title: "ジョジョの奇妙な冒険 3期", tier: 1, type: "anime" },
			{ id: "21", title: "進撃の巨人", tier: 1, type: "manga" },
			{ id: "103", title: "ワンピース", tier: 1, type: "manga" }
		]
	})

	const relationOptions = [
		{ label: "ウォッチャー", icon: <ChevronRight className='w-4 h-4' /> },
		{ label: "フォロー", icon: <Star className='w-4 h-4' /> },
		{ label: "メンバー", icon: <Users className='w-4 h-4' /> },
		{ label: "パートナー", icon: <Heart className='w-4 h-4' /> }
	]

	const [selectedRelation, setSelectedRelation] = useState("ウォッチャー")

	const renderWorksList = (works: Work[], type: string) => (
		<ScrollArea className='h-[300px]'>
			{works
				.filter((work) => work.type === type)
				.map((work) => (
					<div key={work.id} className='flex items-center justify-between py-2'>
						<span>{work.title}</span>
						<Badge variant={work.tier <= 3 ? "default" : "secondary"}>
							Tier {work.tier}
						</Badge>
					</div>
				))}
		</ScrollArea>
	)

	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-2xl font-bold mb-4'>手動マッチング</h1>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				<Card>
					<CardHeader>
						<CardTitle>あなたのプロフィール</CardTitle>
					</CardHeader>
					<CardContent>
						<Tabs defaultValue='anime'>
							<TabsList>
								<TabsTrigger value='anime'>アニメ</TabsTrigger>
								<TabsTrigger value='manga'>漫画</TabsTrigger>
							</TabsList>
							<TabsContent value='anime'>
								{renderWorksList(currentUser.works, "anime")}
							</TabsContent>
							<TabsContent value='manga'>
								{renderWorksList(currentUser.works, "manga")}
							</TabsContent>
						</Tabs>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<div className='flex items-center space-x-4'>
							<Avatar>
								<AvatarImage src='/placeholder.svg' />
								<AvatarFallback>UN</AvatarFallback>
							</Avatar>
							<CardTitle>{otherUser.name}のプロフィール</CardTitle>
						</div>
					</CardHeader>
					<CardContent>
						<Tabs defaultValue='anime'>
							<TabsList>
								<TabsTrigger value='anime'>アニメ</TabsTrigger>
								<TabsTrigger value='manga'>漫画</TabsTrigger>
							</TabsList>
							<TabsContent value='anime'>
								{renderWorksList(otherUser.works, "anime")}
							</TabsContent>
							<TabsContent value='manga'>
								{renderWorksList(otherUser.works, "manga")}
							</TabsContent>
						</Tabs>
					</CardContent>
				</Card>
			</div>
			<div className='mt-4'>
				<h2 className='text-xl font-semibold mb-2'>関係を選択</h2>
				<div className='flex space-x-2'>
					{relationOptions.map((option) => (
						<Button
							key={option.label}
							variant={
								selectedRelation === option.label ? "default" : "outline"
							}
							onClick={() => setSelectedRelation(option.label)}
						>
							{option.icon}
							<span className='ml-2'>{option.label}</span>
						</Button>
					))}
				</div>
			</div>
			<Button
				className='mt-4'
				onClick={() =>
					alert(
						`${otherUser.name}との関係を${selectedRelation}に設定しました。`
					)
				}
			>
				関係を確定
			</Button>
		</div>
	)
}
