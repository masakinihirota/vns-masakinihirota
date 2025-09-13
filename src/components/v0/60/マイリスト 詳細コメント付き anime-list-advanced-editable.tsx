"use client"

import { useEffect, useState } from "react"
import { Edit, Save, ThumbsUp, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

const myList = {
	name: "マイリスト",
	works: [
		{
			id: "1",
			title: "進撃の巨人 1期",
			tier: 1,
			type: "anime",
			comment:
				"巨人の脅威に立ち向かうエレンたちの姿は、見る者の心を掴み、続きが気になる展開の連続です。"
		},
		{
			id: "2",
			title: "進撃の巨人 2期",
			tier: 1,
			type: "anime",
			comment:
				"1期で明かされた謎が少しずつ解き明かされ、物語はますます深みを増していきます。"
		},
		{
			id: "3",
			title: "進撃の巨人 3期",
			tier: 2,
			type: "anime",
			comment: "物語は大きく動き出し、衝撃的な展開の連続に目が離せません。"
		},
		{
			id: "4",
			title: "進撃の巨人 4期",
			tier: 2,
			type: "anime",
			comment:
				"シリーズの最終章。これまでの謎が明かされ、壮大なスケールで物語が完結します。"
		},
		{
			id: "5",
			title: "新世紀エヴァンゲリオン",
			tier: 1,
			type: "anime",
			comment:
				"人類の存亡をかけた壮絶な戦いを、心理描写と哲学的なテーマを交えながら描く傑作。メカと人間の関係性を深く掘り下げています。"
		},
		{
			id: "6",
			title: "ジョジョの奇妙な冒険 2期",
			tier: 3,
			type: "anime",
			comment:
				"個性あふれるキャラクターたちが繰り広げる、独特な能力バトル漫画。スタイリッシュな演出と熱い展開が魅力です。"
		},
		{
			id: "7",
			title: "ミスター味っ子",
			tier: 3,
			type: "anime",
			comment:
				"料理を通じて成長していく少年の物語。味覚描写がとにかくリアルで、見ていると食べたくなるような作品です。"
		},
		{
			id: "8",
			title: "サイコパス 1期",
			tier: 2,
			type: "anime",
			comment:
				"近未来社会を舞台に、犯罪者を事前に予測し、その芽を摘み取るシステム「シビュラシステム」を描いたSFクライム作品。"
		},
		{
			id: "9",
			title: "ハンターハンター 2011年版",
			tier: 1,
			type: "anime",
			comment:
				"広大な世界を舞台に、ハンターと呼ばれる職業を目指す少年の冒険を描いた作品。個性豊かなキャラクターと緻密な世界観が魅力です。"
		},
		{
			id: "10",
			title: "ハンターハンター 1999年版",
			tier: 3,
			type: "anime",
			comment:
				"2011年版とは異なる魅力を持つ、ハンターハンターのアニメ版。よりコミカルな演出やキャラクターデザインが特徴的です。"
		}
	]
}

const tierNames = {
	1: "ティア1",
	2: "ティア2",
	3: "ティア3",
	4: "普通もしくは自分に合わなかった",
	5: "未評価",
	6: "未読",
	7: "おすすめ"
}

const DAILY_LIKE_LIMIT = 5

export default function Component() {
	const [displayMode, setDisplayMode] = useState("full")
	const [category, setCategory] = useState("all")
	const [showEvaluated, setShowEvaluated] = useState(true)
	const [works, setWorks] = useState(myList.works)
	const [likes, setLikes] = useState({})
	const [dailyLikes, setDailyLikes] = useState(0)
	const [editingComment, setEditingComment] = useState(null)
	const [editedComment, setEditedComment] = useState("")

	useEffect(() => {
		const storedLikes = JSON.parse(localStorage.getItem("likes") || "{}")
		const storedDailyLikes = parseInt(localStorage.getItem("dailyLikes") || "0")
		const lastLikeDate = localStorage.getItem("lastLikeDate")

		if (lastLikeDate !== new Date().toDateString()) {
			setDailyLikes(0)
			localStorage.setItem("dailyLikes", "0")
			localStorage.setItem("lastLikeDate", new Date().toDateString())
		} else {
			setDailyLikes(storedDailyLikes)
		}

		setLikes(storedLikes)
	}, [])

	const filteredWorks = works.filter((work) => {
		if (category !== "all" && work.type !== category) return false
		if (!showEvaluated && work.tier > 3) return false
		return true
	})

	const handleTierChange = (id, newTier) => {
		setWorks(
			works.map((work) => (work.id === id ? { ...work, tier: newTier } : work))
		)
	}

	const handleLike = (id) => {
		if (dailyLikes >= DAILY_LIKE_LIMIT) {
			alert("1日のいいね上限に達しました。")
			return
		}

		const newLikes = { ...likes, [id]: (likes[id] || 0) + 1 }
		setLikes(newLikes)
		setDailyLikes(dailyLikes + 1)

		localStorage.setItem("likes", JSON.stringify(newLikes))
		localStorage.setItem("dailyLikes", (dailyLikes + 1).toString())
		localStorage.setItem("lastLikeDate", new Date().toDateString())
	}

	const handleEditComment = (id, comment) => {
		setEditingComment(id)
		setEditedComment(comment)
	}

	const handleSaveComment = (id) => {
		setWorks(
			works.map((work) =>
				work.id === id ? { ...work, comment: editedComment } : work
			)
		)
		setEditingComment(null)
	}

	const handleCancelEdit = () => {
		setEditingComment(null)
		setEditedComment("")
	}

	return (
		<div className='p-4 max-w-4xl mx-auto'>
			<h1 className='text-2xl font-bold mb-4'>{myList.name}</h1>

			<div className='mb-4 space-y-2'>
				<div className='flex items-center justify-between'>
					<span>表示方式:</span>
					<Select value={displayMode} onValueChange={setDisplayMode}>
						<SelectTrigger className='w-[180px]'>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='comments'>コメントのみ</SelectItem>
							<SelectItem value='full'>すべて表示</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className='flex items-center justify-between'>
					<span>カテゴリ:</span>
					<Select value={category} onValueChange={setCategory}>
						<SelectTrigger className='w-[180px]'>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='all'>全カテゴリ</SelectItem>
							<SelectItem value='anime'>アニメ</SelectItem>
							<SelectItem value='manga'>漫画</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className='flex items-center justify-between'>
					<span>評価済み表示:</span>
					<Switch checked={showEvaluated} onCheckedChange={setShowEvaluated} />
				</div>
			</div>

			<div className='space-y-4'>
				{filteredWorks.map((work) => (
					<div key={work.id} className='border p-4 rounded-lg'>
						{displayMode === "full" && (
							<div className='mb-2 flex justify-between items-center'>
								<div>
									<Select
										value={work.tier.toString()}
										onValueChange={(value) =>
											handleTierChange(work.id, parseInt(value))
										}
									>
										<SelectTrigger className='w-[180px]'>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{Object.entries(tierNames).map(([tier, name]) => (
												<SelectItem key={tier} value={tier}>
													{name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<span className='ml-2'>
										{work.type} - {work.title}
									</span>
								</div>
								<Button
									variant='outline'
									size='sm'
									onClick={() => handleLike(work.id)}
									disabled={dailyLikes >= DAILY_LIKE_LIMIT}
								>
									<ThumbsUp className='w-4 h-4 mr-2' />
									{likes[work.id] || 0}
								</Button>
							</div>
						)}
						{editingComment === work.id ? (
							<div className='mt-2'>
								<Textarea
									value={editedComment}
									onChange={(e) => setEditedComment(e.target.value)}
									className='w-full mb-2'
								/>
								<div className='flex justify-end space-x-2'>
									<Button size='sm' onClick={() => handleSaveComment(work.id)}>
										<Save className='w-4 h-4 mr-2' />
										保存
									</Button>
									<Button
										size='sm'
										variant='outline'
										onClick={handleCancelEdit}
									>
										<X className='w-4 h-4 mr-2' />
										キャンセル
									</Button>
								</div>
							</div>
						) : (
							<div className='flex justify-between items-start'>
								<p>{work.comment}</p>
								<Button
									size='sm'
									variant='ghost'
									onClick={() => handleEditComment(work.id, work.comment)}
								>
									<Edit className='w-4 h-4' />
								</Button>
							</div>
						)}
					</div>
				))}
			</div>
			<div className='mt-4 text-sm text-muted-foreground'>
				本日の残りいいね回数: {DAILY_LIKE_LIMIT - dailyLikes}
			</div>
		</div>
	)
}
