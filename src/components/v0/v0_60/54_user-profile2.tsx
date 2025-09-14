// ユーザーの基本情報
import { Heart, Star } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Work = {
	id: string
	title: string
	tier: number
	type: string
}

type UserProfile = {
	name: string
	avatar: string
	bio: string
	works: Work[]
}

const tierColors: { [key: number]: string } = {
	1: "bg-red-500",
	2: "bg-orange-500",
	3: "bg-yellow-500",
	4: "bg-green-500",
	5: "bg-blue-500",
	6: "bg-purple-500"
}

const ValueIcon = ({ value }: { value: string }) => {
	switch (value) {
		case "◎":
			return <span className='text-green-500'>◎</span>
		case "◯":
			return <span className='text-blue-500'>◯</span>
		case "ー":
			return <span className='text-gray-500'>ー</span>
		case "▲":
			return <span className='text-yellow-500'>▲</span>
		case "✕":
			return <span className='text-red-500'>✕</span>
		default:
			return null
	}
}

const defaultUserProfile: UserProfile = {
	name: "ゲストユーザー",
	avatar: "/placeholder.svg?height=80&width=80",
	bio: "プロフィールはまだ設定されていません。",
	works: []
}

export default function Component({
	userProfile = defaultUserProfile
}: {
	userProfile?: UserProfile
}) {
	const { name, avatar, bio, works } = userProfile

	return (
		<Card className='w-full max-w-3xl mx-auto'>
			<CardHeader className='flex flex-row items-center gap-4'>
				<Avatar className='w-20 h-20'>
					<AvatarImage src={avatar} alt={name} />
					<AvatarFallback>{name[0]}</AvatarFallback>
				</Avatar>
				<div>
					<CardTitle>{name}</CardTitle>
					<CardDescription>{bio}</CardDescription>
				</div>
			</CardHeader>
			<CardContent>
				<Tabs defaultValue='works'>
					<TabsList className='grid w-full grid-cols-3'>
						<TabsTrigger value='works'>好きな作品</TabsTrigger>
						<TabsTrigger value='values'>価値観</TabsTrigger>
						<TabsTrigger value='actions'>アクション</TabsTrigger>
					</TabsList>
					<TabsContent value='works' className='space-y-4'>
						<h3 className='text-lg font-semibold mt-4'>好きな作品</h3>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							{works.map((work) => (
								<div key={work.id} className='flex items-center gap-2'>
									<Badge
										variant='secondary'
										className={tierColors[work.tier] || "bg-gray-500"}
									>
										Tier {work.tier}
									</Badge>
									<span>{work.title}</span>
									<Badge variant='outline'>{work.type}</Badge>
								</div>
							))}
						</div>
					</TabsContent>
					<TabsContent value='values' className='space-y-4'>
						<h3 className='text-lg font-semibold mt-4'>価値観</h3>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div className='flex items-center gap-2'>
								<ValueIcon value='◎' />{" "}
								<span>食事: バランスよく3食、決まった時間に食べる</span>
							</div>
							<div className='flex items-center gap-2'>
								<ValueIcon value='◯' /> <span>趣味: アニメ鑑賞</span>
							</div>
							<div className='flex items-center gap-2'>
								<ValueIcon value='ー' /> <span>仕事: フルタイム</span>
							</div>
							<div className='flex items-center gap-2'>
								<ValueIcon value='▲' /> <span>休日: 外出</span>
							</div>
							<div className='flex items-center gap-2'>
								<ValueIcon value='✕' /> <span>生活: 夜型</span>
							</div>
						</div>
					</TabsContent>
					<TabsContent value='actions' className='space-y-4'>
						<h3 className='text-lg font-semibold mt-4'>アクション</h3>
						<div className='flex flex-wrap gap-4'>
							<Button variant='outline' className='flex items-center gap-2'>
								<Heart className='w-4 h-4' /> フォロー
							</Button>
							<Button variant='outline' className='flex items-center gap-2'>
								<Star className='w-4 h-4' /> お気に入り
							</Button>
							<Button variant='default'>メッセージを送る</Button>
						</div>
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	)
}
