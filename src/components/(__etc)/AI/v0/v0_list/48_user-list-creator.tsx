// ユーザーリスト作成画面
"use client"

import { useState } from "react"
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// 型定義
type Work = {
	id: string
	title: string
	tier: number
	type: string
}

type List = {
	name: string
	works: Work[]
}

export default function Component() {
	// 状態管理
	const [userList, setUserList] = useState<List>({
		name: "マイリスト",
		works: []
	})
	const [registeredWorks, setRegisteredWorks] = useState<List>({
		name: "登録作品",
		works: [
			{ id: "1", title: "進撃の巨人 1期", tier: 1, type: "anime" },
			{ id: "2", title: "進撃の巨人 2期", tier: 1, type: "anime" },
			{ id: "3", title: "進撃の巨人 3期", tier: 2, type: "anime" },
			{ id: "4", title: "進撃の巨人 4期", tier: 2, type: "anime" },
			{ id: "5", title: "新世紀エヴァンゲリオン", tier: 1, type: "anime" },
			{ id: "21", title: "進撃の巨人", tier: 1, type: "manga" },
			{ id: "22", title: "寄生獣", tier: 2, type: "manga" },
			{ id: "23", title: "Dr.クマヒゲ", tier: 3, type: "manga" }
		]
	})

	// ドラッグ終了時の処理
	const onDragEnd = (result: any) => {
		if (!result.destination) return

		const sourceList =
			result.source.droppableId === "userList" ? userList : registeredWorks
		const destList =
			result.destination.droppableId === "userList" ? userList : registeredWorks

		const [reorderedItem] = sourceList.works.splice(result.source.index, 1)
		destList.works.splice(result.destination.index, 0, reorderedItem)

		setUserList({ ...userList })
		setRegisteredWorks({ ...registeredWorks })
	}

	return (
		<div className='flex h-screen bg-gray-200 dark:bg-gray-900'>
			<DragDropContext onDragEnd={onDragEnd}>
				{/* 左側：ユーザーリスト作成画面 */}
				<div className='w-1/2 p-4 shadow-md overflow-y-auto'>
					<h2 className='text-2xl font-bold mb-4 text-sky-900 dark:text-sky-100'>
						ユーザーリスト作成
					</h2>
					<div className='mb-4'>
						<Label
							htmlFor='list-name'
							className='text-sky-900 dark:text-sky-100'
						>
							リスト名
						</Label>
						<Input
							id='list-name'
							value={userList.name}
							className='text-sky-900 dark:text-sky-100 bg-white dark:bg-gray-800'
							onChange={(e) =>
								setUserList({ ...userList, name: e.target.value })
							}
						/>
					</div>
					<Droppable droppableId='userList'>
						{(provided) => (
							<ul
								{...provided.droppableProps}
								ref={provided.innerRef}
								className='space-y-2'
							>
								{userList.works.map((work, index) => (
									<Draggable key={work.id} draggableId={work.id} index={index}>
										{(provided) => (
											<li
												ref={provided.innerRef}
												{...provided.draggableProps}
												{...provided.dragHandleProps}
												className='p-2 bg-gray-200 dark:bg-gray-800 rounded text-sky-900 dark:text-sky-100'
											>
												{work.title}
											</li>
										)}
									</Draggable>
								))}
								{provided.placeholder}
							</ul>
						)}
					</Droppable>
				</div>

				{/* 右側：カテゴリ別登録作品リスト */}
				<div className='w-1/2 p-4  shadow-md overflow-y-auto'>
					<h2 className='text-2xl font-bold mb-4 text-sky-900 dark:text-sky-100'>
						登録作品リスト
					</h2>
					<Tabs defaultValue='anime'>
						<TabsList>
							<TabsTrigger value='anime'>アニメ</TabsTrigger>
							<TabsTrigger value='manga'>漫画</TabsTrigger>
						</TabsList>
						<TabsContent value='anime'>
							<Droppable droppableId='registeredWorks'>
								{(provided) => (
									<ul
										{...provided.droppableProps}
										ref={provided.innerRef}
										className='space-y-2'
									>
										{registeredWorks.works
											.filter((work) => work.type === "anime")
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
															className='p-2 bg-gray-200 dark:bg-gray-800 rounded text-sky-900 dark:text-sky-100'
														>
															{work.title}
														</li>
													)}
												</Draggable>
											))}
										{provided.placeholder}
									</ul>
								)}
							</Droppable>
						</TabsContent>
						<TabsContent value='manga'>
							<Droppable droppableId='registeredWorks'>
								{(provided) => (
									<ul
										{...provided.droppableProps}
										ref={provided.innerRef}
										className='space-y-2'
									>
										{registeredWorks.works
											.filter((work) => work.type === "manga")
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
															className='p-2 bg-gray-200 dark:bg-gray-800 rounded text-sky-900 dark:text-sky-100'
														>
															{work.title}
														</li>
													)}
												</Draggable>
											))}
										{provided.placeholder}
									</ul>
								)}
							</Droppable>
						</TabsContent>
					</Tabs>
				</div>
			</DragDropContext>
		</div>
	)
}
