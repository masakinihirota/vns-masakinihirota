// User Profile History
"use client"

import { useState } from "react"
import { Calendar, Filter, SortAsc, SortDesc } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/ui/table"

type HistoryItem = {
	id: string
	date: string
	action: string
	details: string
	category: string
}

const dummyHistory: HistoryItem[] = [
	{
		id: "1",
		date: "2024-10-22",
		action: "プロフィール更新",
		details: "ユーザープロフィールAを更新",
		category: "プロフィール"
	},
	{
		id: "2",
		date: "2024-10-21",
		action: "作品登録",
		details: "「進撃の巨人」をTier 1に登録",
		category: "アニメ"
	},
	{
		id: "3",
		date: "2024-10-20",
		action: "グループ参加",
		details: "「進撃の巨人ファン」グループに参加",
		category: "グループ"
	},
	{
		id: "4",
		date: "2024-10-19",
		action: "価値観登録",
		details: "食事に関する価値観を更新",
		category: "価値観"
	},
	{
		id: "5",
		date: "2024-10-18",
		action: "マッチング",
		details: "ユーザーBとマッチング",
		category: "マッチング"
	}
]

export default function UserHistory() {
	const [history, setHistory] = useState<HistoryItem[]>(dummyHistory)
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
	const [filter, setFilter] = useState("")

	const handleSort = () => {
		const newOrder = sortOrder === "asc" ? "desc" : "asc"
		setSortOrder(newOrder)
		setHistory(
			[...history].sort((a, b) => {
				return newOrder === "asc"
					? new Date(a.date).getTime() - new Date(b.date).getTime()
					: new Date(b.date).getTime() - new Date(a.date).getTime()
			})
		)
	}

	const handleFilter = (category: string) => {
		setFilter(category)
	}

	const filteredHistory = filter
		? history.filter((item) => item.category === filter)
		: history

	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-2xl font-bold mb-4'>ユーザー履歴</h1>
			<div className='flex justify-between items-center mb-4'>
				<div className='flex items-center space-x-2'>
					<Button onClick={handleSort} variant='outline' size='sm'>
						{sortOrder === "asc" ? (
							<SortAsc className='h-4 w-4' />
						) : (
							<SortDesc className='h-4 w-4' />
						)}
						<span className='ml-2'>日付順</span>
					</Button>
					<Select onValueChange={handleFilter} defaultValue=''>
						<SelectTrigger className='w-[180px]'>
							<SelectValue placeholder='カテゴリでフィルタ' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value=''>すべて</SelectItem>
							<SelectItem value='プロフィール'>プロフィール</SelectItem>
							<SelectItem value='アニメ'>アニメ</SelectItem>
							<SelectItem value='グループ'>グループ</SelectItem>
							<SelectItem value='価値観'>価値観</SelectItem>
							<SelectItem value='マッチング'>マッチング</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className='flex items-center space-x-2'>
					<Calendar className='h-5 w-5 text-gray-400' />
					<Input type='date' className='w-auto' />
				</div>
			</div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>日付</TableHead>
						<TableHead>アクション</TableHead>
						<TableHead>詳細</TableHead>
						<TableHead>カテゴリ</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{filteredHistory.map((item) => (
						<TableRow key={item.id}>
							<TableCell>{item.date}</TableCell>
							<TableCell>{item.action}</TableCell>
							<TableCell>{item.details}</TableCell>
							<TableCell>{item.category}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}
