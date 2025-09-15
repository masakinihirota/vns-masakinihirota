// 漫画評価表示用 リスト
"use client"

import { useState } from "react"
import { AlertTriangle, Heart } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog"
import { dummyAnimeWorks } from "@/app/(v0_60)/dummy_db2"

type Work = {
	id: string
	title: string
	tier: number
	type: string
	likes: number
	lastAccessed: string
}

interface Props {
	works?: Work[]
	userPoints: number
	onLike: (id: string) => void
	onUnlike: (id: string) => void
}

export default function MangaRatingList({
	works = dummyAnimeWorks,
	userPoints,
	onLike,
	onUnlike
}: Props) {
	const [openDialog, setOpenDialog] = useState<string | null>(null)

	const handleLike = (id: string) => {
		if (userPoints > 0) {
			onLike(id)
		}
	}

	const handleUnlike = (id: string) => {
		onUnlike(id)
		setOpenDialog(null)
	}

	if (works.length === 0) {
		return (
			<div className='flex items-center justify-center p-4 bg-gray-100 rounded-md'>
				<p>登録された作品がありません。</p>
			</div>
		)
	}

	return (
		<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
			{works.map((work) => (
				<Card key={work.id}>
					<CardHeader>
						<CardTitle>{work.title}</CardTitle>
					</CardHeader>
					<CardContent>
						<p>評価: {work.tier}</p>
						<p>いいね数: {work.likes}</p>
						<p>最終アクセス: {work.lastAccessed}</p>
					</CardContent>
					<CardFooter className='flex justify-between'>
						<Button
							variant='outline'
							size='icon'
							onClick={() => handleLike(work.id)}
							disabled={userPoints === 0}
						>
							<Heart
								className={work.likes > 0 ? "fill-red-500 text-red-500" : ""}
							/>
						</Button>
						{work.likes > 0 && (
							<Dialog
								open={openDialog === work.id}
								onOpenChange={(isOpen) =>
									setOpenDialog(isOpen ? work.id : null)
								}
							>
								<DialogTrigger asChild>
									<Button variant='outline'>いいねを取り消す</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>いいねの取り消し確認</DialogTitle>
										<DialogDescription>
											「{work.title}
											」のいいねを取り消しますか？この操作は元に戻せません。
										</DialogDescription>
									</DialogHeader>
									<DialogFooter>
										<Button
											variant='outline'
											onClick={() => setOpenDialog(null)}
										>
											キャンセル
										</Button>
										<Button onClick={() => handleUnlike(work.id)}>
											取り消す
										</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						)}
					</CardFooter>
				</Card>
			))}
			{userPoints === 0 && (
				<div className='col-span-full flex items-center justify-center p-4 bg-yellow-100 rounded-md'>
					<AlertTriangle className='text-yellow-500 mr-2' />
					<p>ポイントがなくなりました。いいねを押すにはポイントが必要です。</p>
				</div>
			)}
		</div>
	)
}
