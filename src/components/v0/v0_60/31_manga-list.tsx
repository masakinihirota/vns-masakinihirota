// Next.jsとSupabaseのアプリ
"use client"

import { useEffect, useState } from "react"
import { Pencil, Trash2 } from "lucide-react"

import { dummyMangas } from "@/app/(v0_60)/dummy_db"

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
	const [mangas, setMangas] = useState<Manga[]>([])
	const [newManga, setNewManga] = useState({ title: "", author: "" })
	const [editingId, setEditingId] = useState<number | null>(null)

	useEffect(() => {
		fetchMangas()
	}, [])

	// Supabaseからのフェッチを削除し、ダミーデータを使用
	async function fetchMangas() {
		setMangas(dummyMangas)
	}

	async function addManga() {
		console.warn("addManga is disabled when using dummy data.")
	}

	async function updateManga(id: number) {
		console.warn("updateManga is disabled when using dummy data.")
	}

	async function deleteManga(id: number) {
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
				<Button onClick={addManga}>漫画を追加</Button>
			</div>
			<div className='grid gap-4'>
				{mangas.map((manga) => (
					<Card key={manga.id}>
						<CardHeader>
							<CardTitle>
								{editingId === manga.id ? (
									<Input
										value={manga.title}
										onChange={(e) =>
											setMangas(
												mangas.map((m) =>
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
										setMangas(
											mangas.map((m) =>
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
										<Pencil className='mr-2 h-4 w-4' />
										編集
									</>
								)}
							</Button>
							<Button
								variant='destructive'
								onClick={() => deleteManga(manga.id)}
							>
								<Trash2 className='mr-2 h-4 w-4' />
								削除
							</Button>
						</CardFooter>
					</Card>
				))}
			</div>
		</div>
	)
}
