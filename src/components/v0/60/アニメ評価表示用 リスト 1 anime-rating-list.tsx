"use client"

import { useState } from "react"
import { Heart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type AnimeWork = {
	id: string
	title: string
	tier: number
	type: string
}

type UserProfile = {
	name: string
	works: AnimeWork[]
}

// ダミーデータ
const userProfile: UserProfile = {
	name: "マイリスト",
	works: [
		{ id: "1", title: "進撃の巨人 1期", tier: 1, type: "anime" },
		{ id: "2", title: "進撃の巨人 2期", tier: 1, type: "anime" },
		{ id: "3", title: "進撃の巨人 3期", tier: 2, type: "anime" },
		{ id: "4", title: "進撃の巨人 4期", tier: 2, type: "anime" },
		{ id: "5", title: "新世紀エヴァンゲリオン", tier: 1, type: "anime" },
		{ id: "6", title: "ジョジョの奇妙な冒険 2期", tier: 3, type: "anime" },
		{ id: "7", title: "ミスター味っ子", tier: 3, type: "anime" },
		{ id: "8", title: "サイコパス 1期", tier: 2, type: "anime" },
		{ id: "9", title: "ハンターハンター 2011年版", tier: 1, type: "anime" },
		{ id: "10", title: "ハンターハンター 1999年版", tier: 3, type: "anime" }
	]
}

export default function AnimeRatingList() {
	const [points, setPoints] = useState(100) // 初期ポイント
	const [likedAnimes, setLikedAnimes] = useState<string[]>([])

	const handleLike = (animeId: string) => {
		if (points > 0 && !likedAnimes.includes(animeId)) {
			setPoints(points - 1)
			setLikedAnimes([...likedAnimes, animeId])
		}
	}

	const getTierColor = (tier: number) => {
		const colors = [
			"bg-red-500",
			"bg-orange-500",
			"bg-yellow-500",
			"bg-green-500",
			"bg-blue-500",
			"bg-indigo-500"
		]
		return colors[tier - 1] || "bg-gray-500"
	}

	return (
		<Card className='w-full max-w-2xl mx-auto'>
			<CardHeader>
				<CardTitle>{userProfile.name}のアニメ評価</CardTitle>
				<p className='text-sm text-muted-foreground'>残りポイント: {points}</p>
			</CardHeader>
			<CardContent>
				<ul className='space-y-2'>
					{userProfile.works
						.filter((work) => work.type === "anime")
						.map((anime) => (
							<li
								key={anime.id}
								className='flex items-center justify-between p-2 bg-muted rounded-md'
							>
								<div className='flex items-center space-x-2'>
									<span
										className={`w-6 h-6 flex items-center justify-center text-white font-bold rounded-full ${getTierColor(anime.tier)}`}
									>
										{anime.tier}
									</span>
									<span>{anime.title}</span>
								</div>
								<Button
									variant='ghost'
									size='icon'
									onClick={() => handleLike(anime.id)}
									disabled={points === 0 || likedAnimes.includes(anime.id)}
								>
									<Heart
										className={`w-5 h-5 ${likedAnimes.includes(anime.id) ? "fill-current text-red-500" : ""}`}
									/>
								</Button>
							</li>
						))}
				</ul>
			</CardContent>
		</Card>
	)
}
