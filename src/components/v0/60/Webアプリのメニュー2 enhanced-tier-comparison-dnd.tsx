import { useMemo, useState } from "react"
import {
	DragDropContext,
	Draggable,
	Droppable,
	type DropResult
} from "react-beautiful-dnd"
import { motion } from "framer-motion"

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select"

type Tier = 1 | 2 | 3 | 4 | 5 | 6
type WorkType = "anime" | "manga"

type Work = {
	id: string
	title: string
	tier: Tier
	type: WorkType
}

type UserList = {
	name: string
	works: Work[]
}

const tierNames: Record<Tier, string> = {
	1: "ティア1",
	2: "ティア2",
	3: "ティア3",
	4: "普通もしくはそれ以下",
	5: "未評価",
	6: "未読"
}

const tierColors: Record<Tier, string> = {
	1: "bg-red-100 text-red-800",
	2: "bg-orange-100 text-orange-800",
	3: "bg-yellow-100 text-yellow-800",
	4: "bg-green-100 text-green-800",
	5: "bg-gray-100 text-gray-800",
	6: "bg-blue-100 text-blue-800"
}

export default function Component() {
	const [viewMode, setViewMode] = useState<"all" | "same" | "different">("all")
	const [category, setCategory] = useState<"all" | "anime" | "manga">("all")
	const [sortMode, setSortMode] = useState<"normal" | "tier">("normal")
	const [myList, setMyList] = useState<UserList>({
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
			{ id: "30", title: "ベルセルク", tier: 6, type: "manga" }
		]
	})

	const [userAList, setUserAList] = useState<UserList>({
		name: "ユーザーA",
		works: [
			{ id: "31", title: "進撃の巨人 2期", tier: 1, type: "anime" },
			{ id: "32", title: "進撃の巨人 3期", tier: 1, type: "anime" },
			{ id: "33", title: "進撃の巨人 4期", tier: 2, type: "anime" },
			{ id: "34", title: "ジョジョの奇妙な冒険 3期", tier: 1, type: "anime" },
			{ id: "35", title: "ハンターハンター 2011年版", tier: 1, type: "anime" },
			{ id: "36", title: "宇宙よりも遠い場所", tier: 2, type: "anime" },
			{ id: "37", title: "進撃の巨人 1期", tier: 2, type: "anime" },
			{ id: "38", title: "Dr.STONE", tier: 3, type: "anime" },
			{ id: "39", title: "オーバーロード 1期", tier: 3, type: "anime" },
			{ id: "40", title: "ジョジョの奇妙な冒険 1期", tier: 4, type: "anime" },
			{ id: "41", title: "ジョジョの奇妙な冒険 2期", tier: 3, type: "anime" },
			{ id: "42", title: "新世紀エヴァンゲリオン", tier: 6, type: "anime" },
			{ id: "43", title: "進撃の巨人", tier: 1, type: "manga" },
			{ id: "44", title: "ワンピース", tier: 1, type: "manga" },
			{ id: "45", title: "ドラゴンボール", tier: 2, type: "manga" },
			{ id: "46", title: "沈黙の艦隊", tier: 3, type: "manga" },
			{ id: "47", title: "MFゴースト", tier: 4, type: "manga" },
			{ id: "48", title: "数学ゴールデン", tier: 5, type: "manga" },
			{ id: "49", title: "数字で遊ぼ", tier: 5, type: "manga" },
			{ id: "50", title: "キングダム", tier: 6, type: "manga" }
		]
	})

	const filterWorks = (myWorks: Work[], userAWorks: Work[]) => {
		const myTitles = new Set(myWorks.map((w) => w.title))
		const userATitles = new Set(userAWorks.map((w) => w.title))

		const filterByCategory = (works: Work[]) =>
			category === "all" ? works : works.filter((w) => w.type === category)

		if (viewMode === "same") {
			return {
				myFiltered: filterByCategory(
					myWorks.filter((w) => userATitles.has(w.title))
				),
				userAFiltered: filterByCategory(
					userAWorks.filter((w) => myTitles.has(w.title))
				)
			}
		} else if (viewMode === "different") {
			return {
				myFiltered: filterByCategory(
					myWorks.filter((w) => !userATitles.has(w.title))
				),
				userAFiltered: filterByCategory(
					userAWorks.filter((w) => !myTitles.has(w.title))
				)
			}
		} else {
			return {
				myFiltered: filterByCategory(myWorks),
				userAFiltered: filterByCategory(userAWorks)
			}
		}
	}

	const sortWorks = (works: Work[]) => {
		return [...works].sort((a, b) => {
			if (sortMode === "normal") {
				return a.title.localeCompare(b.title, "ja")
			} else {
				return a.tier - b.tier || a.title.localeCompare(b.title, "ja")
			}
		})
	}

	const { myFiltered, userAFiltered } = useMemo(
		() => filterWorks(myList.works, userAList.works),
		[myList.works, userAList.works, viewMode, category]
	)

	const onDragEnd = (result: DropResult) => {
		const { source, destination } = result

		if (!destination) {
			return
		}

		const sourceList = source.droppableId === "myList" ? myList : userAList
		const destList = destination.droppableId === "myList" ? myList : userAList

		const [removed] = sourceList.works.splice(source.index, 1)
		destList.works.splice(destination.index, 0, removed)

		if (source.droppableId === "myList") {
			setMyList({ ...myList, works: [...myList.works] })
			setUserAList({ ...userAList, works: [...userAList.works] })
		} else {
			setUserAList({ ...userAList, works: [...userAList.works] })
			setMyList({ ...myList, works: [...myList.works] })
		}
	}

	const renderList = (
		list: UserList,
		works: Work[],
		color: string,
		droppableId: string
	) => {
		const sortedWorks = useMemo(() => sortWorks(works), [works, sortMode])

		return (
			<motion.div
				className={`w-1/2 p-4 rounded-lg shadow-lg ${color === "red" ? "bg-gradient-to-br from-red-100 to-pink-100" : "bg-gradient-to-br from-blue-100 to-purple-100"}`}
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<h2
					className={`text-2xl font-bold mb-4 ${color === "red" ? "text-red-600" : "text-blue-600"}`}
				>
					{list.name}
				</h2>
				<Droppable droppableId={droppableId}>
					{(provided) => (
						<div {...provided.droppableProps} ref={provided.innerRef}>
							{sortMode === "tier" ? (
								Object.entries(tierNames).map(([tier, tierName]) => (
									<motion.div
										key={tier}
										className='mb-4'
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ duration: 0.5, delay: Number(tier) * 0.1 }}
									>
										<h3
											className={`text-xl font-semibold mb-2 ${color === "red" ? "text-red-500" : "text-blue-500"}`}
										>
											{tierName}
										</h3>
										<ul className='space-y-2'>
											{sortedWorks
												.filter((work) => work.tier === (Number(tier) as Tier))
												.map((work, index) => (
													<Draggable
														key={work.id}
														draggableId={work.id}
														index={index}
													>
														{(provided) => (
															<li
																ref={provided.innerRef}
																{...provided.draggableProps}
																{...provided.dragHandleProps}
																className={`p-2 rounded ${work.type === "anime" ? "bg-yellow-100" : "bg-green-100"} ${tierColors[work.tier]} ${color === "red" ? "border-red-200" : "border-blue-200"} border`}
															>
																{work.title}
															</li>
														)}
													</Draggable>
												))}
										</ul>
									</motion.div>
								))
							) : (
								<ul className='space-y-2'>
									{sortedWorks.map(
										(
											work,

											index
										) => (
											<Draggable
												key={work.id}
												draggableId={work.id}
												index={index}
											>
												{(provided) => (
													<li
														ref={provided.innerRef}
														{...provided.draggableProps}
														{...provided.dragHandleProps}
														className={`p-2 rounded ${work.type === "anime" ? "bg-yellow-100" : "bg-green-100"} ${tierColors[work.tier]} ${color === "red" ? "border-red-200" : "border-blue-200"} border`}
													>
														{work.title}
													</li>
												)}
											</Draggable>
										)
									)}
								</ul>
							)}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</motion.div>
		)
	}

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<div className='max-w-4xl mx-auto p-4 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-xl shadow-2xl'>
				<div className='flex justify-between mb-4 bg-white bg-opacity-80 p-4 rounded-lg shadow-inner'>
					<Select
						value={viewMode}
						onValueChange={(value: "all" | "same" | "different") =>
							setViewMode(value)
						}
					>
						<SelectTrigger className='w-[180px] bg-white'>
							<SelectValue placeholder='View mode' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='all'>すべての価値観</SelectItem>
							<SelectItem value='same'>同じ価値観</SelectItem>
							<SelectItem value='different'>違う価値観</SelectItem>
						</SelectContent>
					</Select>
					<Select
						value={category}
						onValueChange={(value: "all" | "anime" | "manga") =>
							setCategory(value)
						}
					>
						<SelectTrigger className='w-[180px] bg-white'>
							<SelectValue placeholder='Category' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='all'>全てのカテゴリ</SelectItem>
							<SelectItem value='anime'>アニメ</SelectItem>
							<SelectItem value='manga'>漫画</SelectItem>
						</SelectContent>
					</Select>
					<Select
						value={sortMode}
						onValueChange={(value: "normal" | "tier") => setSortMode(value)}
					>
						<SelectTrigger className='w-[180px] bg-white'>
							<SelectValue placeholder='Sort mode' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='normal'>ノーマル</SelectItem>
							<SelectItem value='tier'>ティア評価</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className='flex space-x-4'>
					{renderList(myList, myFiltered, "red", "myList")}
					{renderList(userAList, userAFiltered, "blue", "userAList")}
				</div>
			</div>
		</DragDropContext>
	)
}
