// アニメ評価表示リスト
"use client"

import { useEffect, useState } from "react"
import { Heart, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog"
import { dummyAnimeWorks } from "@/app/(v0_60)/dummy_db"

type AnimeWork = {
	id: string
	title: string
	tier: number
	type: string
	likes?: number
	lastAccessed?: string
}

type AnimeListProps = {
	works?: AnimeWork[]
	userPoints?: number
}

export default function AnimeRatingList({
	works = dummyAnimeWorks, // デフォルトでダミーデータを使用
	userPoints = 0
}: AnimeListProps) {
	const [animeList, setAnimeList] = useState<AnimeWork[]>([])
	const [points, setPoints] = useState(userPoints)
	const [openDialogId, setOpenDialogId] = useState<string | null>(null)

	useEffect(() => {
		if (works.length > 0) {
			setAnimeList(works.filter((work) => work.type === "anime"))
		}
	}, [works])

	const handleLike = (id: string) => {
		if (points > 0) {
			setAnimeList((prevList) =>
				prevList.map((anime) =>
					anime.id === id
						? {
								...anime,
								likes: (anime.likes || 0) + 1,
								lastAccessed: new Date().toISOString()
							}
						: anime
				)
			)
			setPoints((prevPoints) => prevPoints - 1)
		}
	}

	const handleUnlike = (id: string) => {
		setAnimeList((prevList) =>
			prevList.map((anime) =>
				anime.id === id
					? { ...anime, likes: 0, lastAccessed: new Date().toISOString() }
					: anime
			)
		)
		setOpenDialogId(null)
	}

	if (animeList.length === 0) {
		return <div className='text-center p-4'>アニメリストが空です。</div>
	}

	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-2xl font-bold mb-4'>アニメ評価リスト</h1>
			<p className='mb-4'>残りポイント: {points}</p>
			<ul className='space-y-4'>
				{animeList.map((anime) => (
					<li key={anime.id} className='border p-4 rounded-lg shadow-sm'>
						<div className='flex justify-between items-center'>
							<h2 className='text-lg font-semibold'>{anime.title}</h2>
							<span className='text-sm'>評価: {anime.tier}</span>
						</div>
						<div className='flex justify-between items-center mt-2'>
							<div className='flex items-center space-x-2'>
								<Button
									size='sm'
									variant='outline'
									onClick={() => handleLike(anime.id)}
									disabled={points === 0}
								>
									<Heart className='mr-2 h-4 w-4' />
									いいね ({anime.likes || 0})
								</Button>
								<Dialog
									open={openDialogId === anime.id}
									onOpenChange={(isOpen) =>
										setOpenDialogId(isOpen ? anime.id : null)
									}
								>
									<DialogTrigger asChild>
										<Button size='sm' variant='outline'>
											<X className='mr-2 h-4 w-4' />
											取り消し
										</Button>
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>いいねを取り消しますか？</DialogTitle>
											<DialogDescription>
												「{anime.title}
												」のいいねをすべて取り消します。この操作は元に戻せません。
											</DialogDescription>
										</DialogHeader>
										<DialogFooter>
											<Button
												variant='outline'
												onClick={() => setOpenDialogId(null)}
											>
												キャンセル
											</Button>
											<Button
												variant='destructive'
												onClick={() => handleUnlike(anime.id)}
											>
												取り消す
											</Button>
										</DialogFooter>
									</DialogContent>
								</Dialog>
							</div>
							<span className='text-sm text-gray-500'>
								最終アクセス:{" "}
								{anime.lastAccessed
									? new Date(anime.lastAccessed).toLocaleString("ja-JP")
									: "未アクセス"}
							</span>
						</div>
					</li>
				))}
			</ul>
		</div>
	)
}
