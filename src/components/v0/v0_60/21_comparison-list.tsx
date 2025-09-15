// 比較画面2024年10月版
"use client"

import React, { useMemo, useState } from "react"
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"
import { AnimatePresence, motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select"

interface Work {
	id: string
	title: string
	tier: number
	type: "anime" | "manga" | "movie" | "game" | "novel"
}

interface List {
	name: string
	works: Work[]
}

const tierNames = {
	1: "ティア1",
	2: "ティア2",
	3: "ティア3",
	4: "普通or合わない",
	5: "未評価",
	6: "未読",
	7: "おすすめ"
}

const initialMyList: List = {
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
		{ id: "10", title: "ハンターハンター 1999年版", tier: 3, type: "anime" },
		{ id: "11", title: "宇宙よりも遠い場所", tier: 2, type: "anime" },
		{ id: "12", title: "攻殻機動隊", tier: 4, type: "anime" },
		{ id: "13", title: "めぞん一刻", tier: 4, type: "anime" },
		{ id: "14", title: "小公女セーラ", tier: 5, type: "anime" },
		{ id: "15", title: "バブルガムクライシス", tier: 5, type: "anime" },
		{ id: "16", title: "おにいさまへ", tier: 4, type: "anime" },
		{ id: "17", title: "エースを狙え！", tier: 4, type: "anime" },
		{ id: "18", title: "ジョジョの奇妙な冒険 1期", tier: 3, type: "anime" },
		{ id: "19", title: "ジョジョの奇妙な冒険 3期", tier: 2, type: "anime" },
		{ id: "20", title: "PSYCHO-PASS サイコパス 3", tier: 6, type: "anime" },
		{ id: "21", title: "進撃の巨人", tier: 1, type: "manga" },
		{ id: "22", title: "寄生獣", tier: 2, type: "manga" },
		{ id: "23", title: "Dr.クマヒゲ", tier: 3, type: "manga" },
		{ id: "24", title: "アストロノーツ", tier: 4, type: "manga" },
		{ id: "25", title: "あしたのジョー", tier: 1, type: "manga" },
		{ id: "26", title: "風のストライド", tier: 5, type: "manga" },
		{ id: "27", title: "花咲ける青少年", tier: 4, type: "manga" },
		{ id: "28", title: "狼の口 ヴォルフスムント", tier: 3, type: "manga" },
		{ id: "29", title: "数字で遊ぼ", tier: 5, type: "manga" },
		{ id: "30", title: "ベルセルク", tier: 6, type: "manga" },
		{ id: "31", title: "インターステラー", tier: 1, type: "movie" },
		{
			id: "32",
			title: "バック・トゥ・ザ・フューチャー",
			tier: 2,
			type: "movie"
		},
		{ id: "33", title: "マトリックス", tier: 1, type: "movie" },
		{
			id: "34",
			title: "ゼルダの伝説 ブレス オブ ザ ワイルド",
			tier: 1,
			type: "game"
		},
		{ id: "35", title: "ダークソウル", tier: 2, type: "game" },
		{ id: "36", title: "ポケットモンスター 赤・緑", tier: 3, type: "game" },
		{ id: "37", title: "1984年", tier: 1, type: "novel" },
		{ id: "38", title: "ハリーポッターと賢者の石", tier: 2, type: "novel" },
		{ id: "39", title: "三体", tier: 1, type: "novel" }
	]
}

const initialUserList: List = {
	name: "ユーザー",
	works: [
		{ id: "2", title: "進撃の巨人 2期", tier: 1, type: "anime" },
		{ id: "3", title: "進撃の巨人 3期", tier: 1, type: "anime" },
		{ id: "4", title: "進撃の巨人 4期", tier: 2, type: "anime" },
		{ id: "19", title: "ジョジョの奇妙な冒険 3期", tier: 1, type: "anime" },
		{ id: "9", title: "ハンターハンター 2011年版", tier: 1, type: "anime" },
		{ id: "11", title: "宇宙よりも遠い場所", tier: 2, type: "anime" },
		{ id: "1", title: "進撃の巨人 1期", tier: 2, type: "anime" },
		{ id: "101", title: "Dr.STONE", tier: 3, type: "anime" },
		{ id: "102", title: "オーバーロード 1期", tier: 3, type: "anime" },
		{ id: "18", title: "ジョジョの奇妙な冒険 1期", tier: 4, type: "anime" },
		{ id: "6", title: "ジョジョの奇妙な冒険 2期", tier: 3, type: "anime" },
		{ id: "5", title: "新世紀エヴァンゲリオン", tier: 6, type: "anime" },
		{ id: "21", title: "進撃の巨人", tier: 1, type: "manga" },
		{ id: "103", title: "ワンピース", tier: 1, type: "manga" },
		{ id: "104", title: "ドラゴンボール", tier: 2, type: "manga" },
		{ id: "105", title: "沈黙の艦隊", tier: 3, type: "manga" },
		{ id: "106", title: "MFゴースト", tier: 4, type: "manga" },
		{ id: "107", title: "数学ゴールデン", tier: 5, type: "manga" },
		{ id: "29", title: "数字で遊ぼ", tier: 5, type: "manga" },
		{ id: "108", title: "キングダム", tier: 6, type: "manga" },
		{ id: "109", title: "インセプション", tier: 1, type: "movie" },
		{ id: "110", title: "ショーシャンクの空に", tier: 2, type: "movie" },
		{ id: "111", title: "アバター", tier: 3, type: "movie" },
		{ id: "112", title: "Minecraft", tier: 1, type: "game" },
		{ id: "113", title: "The Last of Us", tier: 2, type: "game" },
		{ id: "114", title: "スーパーマリオブラザーズ", tier: 3, type: "game" },
		{ id: "115", title: "百年の孤独", tier: 1, type: "novel" },
		{ id: "116", title: "星の王子さま", tier: 2, type: "novel" },
		{ id: "117", title: "ノルウェイの森", tier: 3, type: "novel" }
	]
}

export default function Component() {
	const [myList, setMyList] = useState<List>(initialMyList)
	const [userList, setUserList] = useState<List>(initialUserList)
	const [showCentralList, setShowCentralList] = useState(true)
	const [typeFilter, setTypeFilter] = useState<string[]>([
		"anime",
		"manga",
		"movie",
		"game",
		"novel"
	])
	const [sortOrder, setSortOrder] = useState<"abc" | "rating">("abc")
	const [valueFilter, setValueFilter] = useState<
		"all" | "same" | "different" | "other"
	>("all")

	const onDragEnd = (result: any) => {
		const { source, destination } = result

		if (!destination) {
			return
		}

		const sourceList = source.droppableId === "myList" ? myList : userList
		const destList = destination.droppableId === "myList" ? myList : userList

		const sourceWorks = Array.from(sourceList.works)
		const destWorks = Array.from(destList.works)
		const [movedWork] = sourceWorks.splice(source.index, 1)

		if (source.droppableId === destination.droppableId) {
			sourceWorks.splice(destination.index, 0, movedWork)
			const newList = { ...sourceList, works: sourceWorks }
			source.droppableId === "myList"
				? setMyList(newList)
				: setUserList(newList)
		} else {
			const newWork = { ...movedWork }
			if (destination.droppableId === "myList") {
				newWork.tier = 5 // Set to '未評価' when moving to myList
			} else {
				newWork.tier = 7 // Set to 'おすすめ' when recommending to user's list
			}
			destWorks.splice(destination.index, 0, newWork)
			const newSourceList = { ...sourceList, works: sourceWorks }
			const newDestList = { ...destList, works: destWorks }
			if (source.droppableId === "myList") {
				setMyList(newSourceList)
				setUserList(newDestList)
			} else {
				setUserList(newSourceList)
				setMyList(newDestList)
			}
		}
	}

	const filteredAndSortedWorks = useMemo(() => {
		const filterWorks = (works: Work[]) => {
			return works
				.filter((work) => typeFilter.includes(work.type))
				.filter((work) => {
					const myWork = myList.works.find((w) => w.id === work.id)
					const userWork = userList.works.find((w) => w.id === work.id)

					if (valueFilter === "all") return true
					if (valueFilter === "same")
						return myWork && userWork && myWork.tier === userWork.tier
					if (valueFilter === "different")
						return myWork && userWork && myWork.tier !== userWork.tier
					if (valueFilter === "other")
						return (!myWork && userWork) || (myWork && !userWork)

					return true
				})
				.sort((a, b) => {
					if (sortOrder === "abc") {
						return a.title.localeCompare(b.title)
					} else {
						return a.tier - b.tier
					}
				})
		}

		return {
			myWorks: filterWorks(myList.works),
			userWorks: filterWorks(userList.works)
		}
	}, [myList, userList, typeFilter, sortOrder, valueFilter])

	const handleTypeFilterChange = (type: string) => {
		setTypeFilter((prev) =>
			prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
		)
	}

	return (
		<div className='container mx-auto p-4'>
			<div className='flex flex-wrap justify-between mb-4'>
				<Button
					onClick={() => setShowCentralList(!showCentralList)}
					className='mb-2'
				>
					評価・カテゴリ {showCentralList ? "OFF" : "ON"}
				</Button>
				<div className='flex flex-wrap items-center space-x-4 mb-2'>
					{["anime", "manga", "movie", "game", "novel"].map((type) => (
						<div key={type} className='flex items-center space-x-2'>
							<Checkbox
								id={type}
								checked={typeFilter.includes(type)}
								onCheckedChange={() => handleTypeFilterChange(type)}
							/>
							<label htmlFor={type}>
								{type === "anime"
									? "アニメ"
									: type === "manga"
										? "マンガ"
										: type === "movie"
											? "映画"
											: type === "game"
												? "ゲーム"
												: "小説"}
							</label>
						</div>
					))}
				</div>
				<Select
					value={sortOrder}
					onValueChange={(value: any) => setSortOrder(value)}
				>
					<SelectTrigger className='w-[180px]'>
						<SelectValue placeholder='ソート順' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='abc'>ABC順</SelectItem>
						<SelectItem value='rating'>評価順</SelectItem>
					</SelectContent>
				</Select>
				<Select
					value={valueFilter}
					onValueChange={(value: any) => setValueFilter(value)}
				>
					<SelectTrigger className='w-[180px]'>
						<SelectValue placeholder='価値観フィルター' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>すべての価値観</SelectItem>
						<SelectItem value='same'>同じ価値観</SelectItem>
						<SelectItem value='different'>違う価値観</SelectItem>
						<SelectItem value='other'>その他の価値観</SelectItem>
					</SelectContent>
				</Select>
			</div>
			<DragDropContext onDragEnd={onDragEnd}>
				<div className='flex justify-between'>
					<motion.div
						className={`w-${showCentralList ? "1/3" : "5/12"} bg-gray-100 p-4 rounded transition-all duration-300`}
						layout
					>
						<Droppable droppableId='myList'>
							{(provided) => (
								<div {...provided.droppableProps} ref={provided.innerRef}>
									<h2 className='text-xl font-bold mb-4'>{myList.name}</h2>
									{filteredAndSortedWorks.myWorks.map((work, index) => (
										<Draggable
											key={work.id}
											draggableId={work.id}
											index={index}
										>
											{(provided) => (
												<div
													ref={provided.innerRef}
													{...provided.draggableProps}
													{...provided.dragHandleProps}
													className='bg-white p-2 mb-2 rounded shadow'
												>
													<div>{work.title}</div>
													<div className='text-sm text-gray-600'>
														{work.type}
													</div>
													<div className='text-sm font-bold'>
														{tierNames[work.tier as keyof typeof tierNames]}
													</div>
												</div>
											)}
										</Draggable>
									))}
									{provided.placeholder}
								</div>
							)}
						</Droppable>
					</motion.div>
					<AnimatePresence>
						{showCentralList && (
							<motion.div
								className='w-1/4'
								initial={{ width: 0, opacity: 0 }}
								animate={{ width: "25%", opacity: 1 }}
								exit={{ width: 0, opacity: 0 }}
								transition={{ duration: 0.3 }}
							>
								<h2 className='text-xl font-bold mb-4'>評価リスト</h2>
								{Object.entries(tierNames).map(([key, value]) => (
									<div key={key} className='bg-gray-200 p-2 mb-2 rounded'>
										{value}
									</div>
								))}
								<h2 className='text-xl font-bold mt-4 mb-2'>
									タグ (ティア1のみ)
								</h2>
								<div className='bg-gray-200 p-2 mb-2 rounded'>覇権候補</div>
								<div className='bg-gray-200 p-2 mb-2 rounded'>覇権</div>
								<div className='bg-gray-200 p-2 rounded'>レジェンド</div>
							</motion.div>
						)}
					</AnimatePresence>
					<motion.div
						className={`w-${showCentralList ? "1/3" : "5/12"} bg-gray-100 p-4 rounded transition-all duration-300`}
						layout
					>
						<Droppable droppableId='userList'>
							{(provided) => (
								<div {...provided.droppableProps} ref={provided.innerRef}>
									<h2 className='text-xl font-bold mb-4'>{userList.name}</h2>
									{filteredAndSortedWorks.userWorks.map((work, index) => (
										<Draggable
											key={work.id}
											draggableId={work.id}
											index={index}
										>
											{(provided) => (
												<div
													ref={provided.innerRef}
													{...provided.draggableProps}
													{...provided.dragHandleProps}
													className='bg-white p-2 mb-2 rounded shadow'
												>
													<div>{work.title}</div>
													<div className='text-sm text-gray-600'>
														{work.type}
													</div>
													<div className='text-sm font-bold'>
														{tierNames[work.tier as keyof typeof tierNames]}
													</div>
												</div>
											)}
										</Draggable>
									))}
									{provided.placeholder}
								</div>
							)}
						</Droppable>
					</motion.div>
				</div>
			</DragDropContext>
		</div>
	)
}
