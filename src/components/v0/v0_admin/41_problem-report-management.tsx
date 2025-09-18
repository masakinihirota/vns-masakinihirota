// Priority Issue Display
"use client"

import { useState } from "react"
import {
	AlertTriangle,
	ArrowUpDown,
	Bug,
	HelpCircle,
	Lightbulb
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

type Report = {
	id: number
	title: string
	category: string
	priority: number
	createdAt: string
}

const dummyReports: Report[] = [
	{
		id: 1,
		title: "ログインできない",
		category: "バグ",
		priority: 3,
		createdAt: "2024-10-20T10:30:00"
	},
	{
		id: 2,
		title: "新機能の提案",
		category: "提案",
		priority: 1,
		createdAt: "2024-10-20T11:45:00"
	},
	{
		id: 3,
		title: "UIが使いにくい",
		category: "改善",
		priority: 2,
		createdAt: "2024-10-20T09:15:00"
	},
	{
		id: 4,
		title: "アプリがクラッシュする",
		category: "バグ",
		priority: 5,
		createdAt: "2024-10-20T14:20:00"
	},
	{
		id: 5,
		title: "ヘルプドキュメントの誤り",
		category: "その他",
		priority: 1,
		createdAt: "2024-10-20T16:00:00"
	}
]

export default function Component() {
	const [reports, setReports] = useState<Report[]>(dummyReports)
	const [sortBy, setSortBy] = useState<"priority" | "createdAt">("priority")
	const [filterCategory, setFilterCategory] = useState<string>("all")

	const sortReports = (a: Report, b: Report) => {
		if (sortBy === "priority") {
			return b.priority - a.priority
		} else {
			return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
		}
	}

	const filteredReports = reports
		.filter(
			(report) => filterCategory === "all" || report.category === filterCategory
		)
		.sort(sortReports)

	const increasePriority = (id: number) => {
		setReports(
			reports.map((report) =>
				report.id === id ? { ...report, priority: report.priority + 1 } : report
			)
		)
	}

	const getCategoryIcon = (category: string) => {
		switch (category) {
			case "バグ":
				return <Bug className='h-4 w-4' />
			case "提案":
				return <Lightbulb className='h-4 w-4' />
			case "改善":
				return <AlertTriangle className='h-4 w-4' />
			default:
				return <HelpCircle className='h-4 w-4' />
		}
	}

	return (
		<Card className='w-full max-w-4xl'>
			<CardHeader>
				<CardTitle>問題報告管理</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='flex justify-between mb-4'>
					<Select
						value={sortBy}
						onValueChange={(value: "priority" | "createdAt") =>
							setSortBy(value)
						}
					>
						<SelectTrigger className='w-[180px]'>
							<SelectValue placeholder='並び替え' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='priority'>優先度順</SelectItem>
							<SelectItem value='createdAt'>時系列順</SelectItem>
						</SelectContent>
					</Select>
					<Select value={filterCategory} onValueChange={setFilterCategory}>
						<SelectTrigger className='w-[180px]'>
							<SelectValue placeholder='カテゴリフィルター' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='all'>すべて</SelectItem>
							<SelectItem value='バグ'>バグ</SelectItem>
							<SelectItem value='提案'>提案</SelectItem>
							<SelectItem value='改善'>改善</SelectItem>
							<SelectItem value='その他'>その他</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>タイトル</TableHead>
							<TableHead>カテゴリ</TableHead>
							<TableHead>優先度</TableHead>
							<TableHead>報告日時</TableHead>
							<TableHead>アクション</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredReports.map((report) => (
							<TableRow key={report.id}>
								<TableCell>{report.title}</TableCell>
								<TableCell>
									<div className='flex items-center gap-2'>
										{getCategoryIcon(report.category)}
										{report.category}
									</div>
								</TableCell>
								<TableCell>{report.priority}</TableCell>
								<TableCell>
									{new Date(report.createdAt).toLocaleString("ja-JP")}
								</TableCell>
								<TableCell>
									<Button onClick={() => increasePriority(report.id)} size='sm'>
										優先度上げる
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	)
}
