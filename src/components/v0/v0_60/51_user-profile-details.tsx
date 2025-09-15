// ユーザーの基本情報コンポーネント
"use client"
import {
	Briefcase,
	Calendar,
	Heart,
	Mail,
	MapPin,
	UserCircle
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

type UserProfileProps = {
	name: string
	username: string
	email: string
	avatar: string
	occupation: string
	location: string
	joinDate: string
	favoriteWorks: Array<{
		id: string
		title: string
		type: string
		tier: number
	}>
}

export default function Component({
	name = "山田 太郎",
	username = "yamada_taro",
	email = "taro@example.com",
	avatar = "/placeholder.svg?height=100&width=100",
	occupation = "ソフトウェアエンジニア",
	location = "東京都",
	joinDate = "2023年4月1日",
	favoriteWorks = [
		{ id: "1", title: "進撃の巨人", type: "anime", tier: 1 },
		{ id: "2", title: "ワンピース", type: "manga", tier: 2 },
		{ id: "3", title: "新世紀エヴァンゲリオン", type: "anime", tier: 1 }
	]
}: UserProfileProps) {
	return (
		<Card className='w-full max-w-3xl mx-auto'>
			<CardHeader className='flex flex-row items-center gap-4'>
				<Avatar className='w-20 h-20'>
					<AvatarImage alt={name} src={avatar} />
					<AvatarFallback>{name[0]}</AvatarFallback>
				</Avatar>
				<div className='flex flex-col'>
					<CardTitle className='text-2xl'>{name}</CardTitle>
					<p className='text-sm text-muted-foreground'>@{username}</p>
				</div>
			</CardHeader>
			<CardContent className='space-y-4'>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<div className='flex items-center gap-2'>
						<Mail className='w-4 h-4' />
						<span>{email}</span>
					</div>
					<div className='flex items-center gap-2'>
						<Briefcase className='w-4 h-4' />
						<span>{occupation}</span>
					</div>
					<div className='flex items-center gap-2'>
						<MapPin className='w-4 h-4' />
						<span>{location}</span>
					</div>
					<div className='flex items-center gap-2'>
						<Calendar className='w-4 h-4' />
						<span>登録日: {joinDate}</span>
					</div>
				</div>
				<Separator />
				<div>
					<h3 className='text-lg font-semibold mb-2'>お気に入り作品</h3>
					<div className='flex flex-wrap gap-2'>
						{favoriteWorks.map((work) => (
							<Badge
								key={work.id}
								variant='secondary'
								className='flex items-center gap-1'
							>
								<Heart className='w-3 h-3' />
								{work.title}
								<span className='ml-1 text-xs'>({work.type})</span>
							</Badge>
						))}
					</div>
				</div>
				<div className='flex justify-end'>
					<Button>プロフィールを編集</Button>
				</div>
			</CardContent>
		</Card>
	)
}
