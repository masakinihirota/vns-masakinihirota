// ユーザープロフィール 確認画面
"use client"

import { useState } from "react"
import { BookOpen, Briefcase, Heart, Star } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// 型定義
interface TierItem {
	title: string
	tier: number
}

interface TiersData {
	now: TierItem[]
	future: TierItem[]
	life: TierItem[]
}

export default function UserProfile() {
	const [activeTab, setActiveTab] = useState("now")

	const tiers: TiersData = {
		now: [
			{ title: "進撃の巨人", tier: 1 },
			{ title: "ダンジョン飯", tier: 2 },
			{ title: "葬送のフリーレン", tier: 3 }
		],
		future: [{ title: "ダンジョン飯（映画）", tier: 1 }],
		life: [{ title: "スラムダンク", tier: 1 }]
	}

	const renderTiers = (tierList: TierItem[]) => {
		return tierList.map((item: TierItem, index: number) => (
			<div key={index} className='flex items-center justify-between py-2'>
				<span>{item.title}</span>
				<Badge
					variant={
						item.tier === 1
							? "default"
							: item.tier === 2
								? "secondary"
								: "outline"
					}
				>
					Tier {item.tier}
				</Badge>
			</div>
		))
	}

	return (
		<Card className='w-full max-w-3xl mx-auto'>
			<CardHeader>
				<div className='flex items-center space-x-4'>
					<Avatar className='w-20 h-20'>
						<AvatarImage src='/placeholder.svg' alt='User' />
						<AvatarFallback>JP</AvatarFallback>
					</Avatar>
					<div>
						<CardTitle>ユーザー123456</CardTitle>
						<CardDescription>キャラクターネーム: アニメ愛好家</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<div className='space-y-4'>
					<div>
						<h3 className='text-lg font-semibold'>目的</h3>
						<p>好きな作品について話す、一緒にアニメを見る</p>
					</div>
					<div>
						<h3 className='text-lg font-semibold'>使用言語</h3>
						<p>日本語</p>
					</div>
					<Separator />
					<div>
						<h3 className='text-lg font-semibold'>価値観リスト</h3>
						<Tabs defaultValue='now' className='w-full'>
							<TabsList>
								<TabsTrigger value='now' onClick={() => setActiveTab("now")}>
									今
								</TabsTrigger>
								<TabsTrigger
									value='future'
									onClick={() => setActiveTab("future")}
								>
									未来
								</TabsTrigger>
								<TabsTrigger value='life' onClick={() => setActiveTab("life")}>
									人生
								</TabsTrigger>
							</TabsList>
							<TabsContent value='now'>{renderTiers(tiers.now)}</TabsContent>
							<TabsContent value='future'>
								{renderTiers(tiers.future)}
							</TabsContent>
							<TabsContent value='life'>{renderTiers(tiers.life)}</TabsContent>
						</Tabs>
					</div>
				</div>
			</CardContent>
			<CardFooter className='flex justify-between'>
				<Button variant='outline' className='flex items-center'>
					<Star className='mr-2 h-4 w-4' />
					フォロー
				</Button>
				<Button variant='outline' className='flex items-center'>
					<Heart className='mr-2 h-4 w-4' />
					いいね
				</Button>
			</CardFooter>
		</Card>
	)
}
