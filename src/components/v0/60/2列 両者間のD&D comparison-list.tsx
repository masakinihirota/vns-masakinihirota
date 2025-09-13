"use client"

import React, { useCallback, useState } from "react"
import {
	closestCorners,
	DndContext,
	DragOverlay,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors
} from "@dnd-kit/core"
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select"

type Work = {
	id: string
	title: string
	tier: number
	type: "anime" | "manga"
}

type List = {
	name: string
	works: Work[]
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

const myList: List = {
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
}

const userList: List = {
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
		{ id: "108", title: "キングダム", tier: 6, type: "manga" }
	]
}

const SortableItem = ({ id, work }: { id: string; work: Work }) => {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: id })

	const style = {
		transform: CSS.Transform.toString(transform),
		transition
	}

	return (
		<div ref={setNodeRef} style={style} {...attributes} {...listeners}>
			<Card className='mb-2'>
				<CardContent className='p-2'>
					<Badge
						variant={work.type === "anime" ? "default" : "secondary"}
						className='mb-1'
					>
						{work.type}
					</Badge>
					<p>{work.title}</p>
					<Badge variant='outline'>
						{tierNames[work.tier as keyof typeof tierNames]}
					</Badge>
				</CardContent>
			</Card>
		</div>
	)
}

export default function Component() {
	const [lists, setLists] = useState<List[]>([myList, userList])
	const [activeId, setActiveId] = useState<string | null>(null)
	const [valueFilter, setValueFilter] = useState<"all" | "same" | "different">(
		"all"
	)
	const [categories, setCategories] = useState<string[]>(["anime", "manga"])
	const [sortBy, setSortBy] = useState<"tier" | "abc">("tier")

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates
		})
	)

	const handleDragStart = (event: any) => {
		const { active } = event
		setActiveId(active.id)
	}

	const handleDragEnd = (event: any) => {
		const { active, over } = event

		if (active.id !== over.id) {
			setLists((prevLists) => {
				const oldIndex = active.data.current.sortable.index
				const newIndex = over.data.current?.sortable.index || 0
				const sourceListIndex = parseInt(
					active.data.current.sortable.containerId.split("-")[1]
				)
				const destListIndex = parseInt(
					over.data.current?.sortable.containerId.split("-")[1] ||
						sourceListIndex.toString()
				)

				if (sourceListIndex === destListIndex) {
					// Moving within the same list
					const newWorks = arrayMove(
						prevLists[sourceListIndex].works,
						oldIndex,
						newIndex
					)
					return prevLists.map((list, index) =>
						index === sourceListIndex ? { ...list, works: newWorks } : list
					)
				} else {
					// Copying to the other list
					const sourceList = [...prevLists[sourceListIndex].works]
					const destList = [...prevLists[destListIndex].works]
					const [workToAdd] = sourceList.splice(oldIndex, 1)

					// Set tier based on the direction of the copy
					workToAdd.tier = sourceListIndex === 0 ? 7 : 6

					// Check if the work already exists in the destination list
					const existingIndex = destList.findIndex(
						(work) => work.id === workToAdd.id
					)
					if (existingIndex === -1) {
						destList.splice(newIndex, 0, { ...workToAdd })
					}

					return prevLists.map((list, index) => {
						if (index === sourceListIndex) return { ...list, works: sourceList }
						if (index === destListIndex) return { ...list, works: destList }
						return list
					})
				}
			})
		}
		setActiveId(null)
	}

	const filterWorks = useCallback(
		(works: Work[], otherWorks: Work[]) => {
			let filteredWorks = works.filter((work) => categories.includes(work.type))

			if (valueFilter === "same") {
				filteredWorks = filteredWorks.filter((work) =>
					otherWorks.some((otherWork) => otherWork.id === work.id)
				)
			} else if (valueFilter === "different") {
				filteredWorks = filteredWorks.filter(
					(work) => !otherWorks.some((otherWork) => otherWork.id === work.id)
				)
			}

			if (sortBy === "tier") {
				filteredWorks.sort((a, b) => a.tier - b.tier)
			} else {
				filteredWorks.sort((a, b) => a.title.localeCompare(b.title))
			}

			return filteredWorks
		},
		[valueFilter, categories, sortBy]
	)

	return (
		<div className='p-4'>
			<div className='mb-4 flex space-x-4'>
				<Select
					onValueChange={(value) =>
						setValueFilter(value as "all" | "same" | "different")
					}
				>
					<SelectTrigger className='w-[180px]'>
						<SelectValue placeholder='価値観選択' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>すべての価値観</SelectItem>
						<SelectItem value='same'>同じ価値観</SelectItem>
						<SelectItem value='different'>違う価値観</SelectItem>
					</SelectContent>
				</Select>

				<div className='flex items-center space-x-2'>
					<Checkbox
						id='anime'
						checked={categories.includes("anime")}
						onCheckedChange={(checked) =>
							setCategories((prev) =>
								checked ? [...prev, "anime"] : prev.filter((c) => c !== "anime")
							)
						}
					/>
					<Label htmlFor='anime'>アニメ</Label>

					<Checkbox
						id='manga'
						checked={categories.includes("manga")}
						onCheckedChange={(checked) =>
							setCategories((prev) =>
								checked ? [...prev, "manga"] : prev.filter((c) => c !== "manga")
							)
						}
					/>
					<Label htmlFor='manga'>漫画</Label>
				</div>

				<Select onValueChange={(value) => setSortBy(value as "tier" | "abc")}>
					<SelectTrigger className='w-[180px]'>
						<SelectValue placeholder='並び順' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='tier'>評価順</SelectItem>
						<SelectItem value='abc'>ABC順</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className='flex gap-4'>
				<DndContext
					sensors={sensors}
					collisionDetection={closestCorners}
					onDragStart={handleDragStart}
					onDragEnd={handleDragEnd}
				>
					{lists.map((list, listIndex) => (
						<Card key={listIndex} className='w-1/2'>
							<CardHeader>
								<CardTitle>{list.name}</CardTitle>
							</CardHeader>
							<CardContent>
								<ScrollArea className='h-[600px]'>
									<SortableContext
										items={filterWorks(
											list.works,
											lists[1 - listIndex].works
										).map((work) => work.id)}
										strategy={verticalListSortingStrategy}
									>
										{filterWorks(list.works, lists[1 - listIndex].works).map(
											(work) => (
												<SortableItem
													key={work.id}
													id={`${work.id}-${listIndex}`}
													work={work}
												/>
											)
										)}
									</SortableContext>
								</ScrollArea>
							</CardContent>
						</Card>
					))}
					<DragOverlay>
						{activeId ? (
							<Card className='mb-2'>
								<CardContent className='p-2'>
									<p>
										{
											lists
												.flatMap((list) => list.works)
												.find(
													(work) =>
														`${work.id}-0` === activeId ||
														`${work.id}-1` === activeId
												)?.title
										}
									</p>
								</CardContent>
							</Card>
						) : null}
					</DragOverlay>
				</DndContext>
			</div>
		</div>
	)
}
