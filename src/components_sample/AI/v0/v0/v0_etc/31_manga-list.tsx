// Next.jsとSupabaseのアプリ
"use client"
import React, { useEffect, useState } from "react"
import { Pencil, Trash2 } from "lucide-react"

import { dummyManages } from "@/app/(___sample)/dummy_db2"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

type Manga = {
	id: number
	title: string
	author: string
}

export default function MangaList() {
	const [manages, setManages] = useState<Manga[]>([])
	const [newManga, setNewManga] = useState({ title: "", author: "" })
	const [editingId, setEditingId] = useState<number | null>(null)

	const fetchManages = React.useCallback(async () => {
		setManages(dummyManages)
	}, [])

	useEffect(() => {
		fetchManages()
	}, [fetchManages])

	async function addManga() {
		console.warn("addManga is disabled when using dummy data.")
	}

	async function updateManga(_id: number) {
		console.warn("updateManga is disabled when using dummy data.")
	}

	async function deleteManga(_id: number) {
		console.warn("deleteManga is disabled when using dummy data.")
	}

	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-2xl font-bold mb-4'>私の漫画コレクション</h1>
			<div className='grid gap-4 mb-4'>
				<Input
					placeholder='タイトル'
					value={newManga.title}
					onChange={(e) => setNewManga({ ...newManga, title: e.target.value })}
				/>
				<Input
					placeholder='作者'
					value={newManga.author}
					onChange={(e) => setNewManga({ ...newManga, author: e.target.value })}
				/>
				<Button type='button' onClick={addManga}>
					漫画を追加
				</Button>
			</div>
			<div className='grid gap-4'>
				{manages.map((manga) => (
					<Card key={manga.id}>
						<CardHeader>
							<CardTitle>
								{editingId === manga.id ? (
									<Input
										value={manga.title}
										onChange={(e) =>
											setManages(
												manages.map((m) =>
													m.id === manga.id
														? { ...m, title: e.target.value }
														: m
												)
											)
										}
									/>
								) : (
									manga.title
								)}
							</CardTitle>
						</CardHeader>
						<CardContent>
							{editingId === manga.id ? (
								<Input
									value={manga.author}
									onChange={(e) =>
										setManages(
											manages.map((m) =>
												m.id === manga.id ? { ...m, author: e.target.value } : m
											)
										)
									}
								/>
							) : (
								<p>{manga.author}</p>
							)}
						</CardContent>
						<CardFooter className='flex justify-between'>
							<Button
								type='button'
								onClick={() =>
									editingId === manga.id
										? updateManga(manga.id)
										: setEditingId(manga.id)
								}
							>
								{editingId === manga.id ? (
									"更新"
								) : (
									<>
										<svg className='mr-2 h-4 w-4' aria-label='編集' role='img'>
											<title>編集</title>
											<Pencil />
										</svg>
										編集
									</>
								)}
							</Button>
							<Button
								type='button'
								variant='destructive'
								onClick={() => deleteManga(manga.id)}
							>
								<svg className='mr-2 h-4 w-4' aria-label='削除' role='img'>
									<title>削除</title>
									<Trash2 />
								</svg>
								削除
							</Button>
						</CardFooter>
					</Card>
				))}
			</div>
		</div>
	)
}
