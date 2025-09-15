// 問題報告管理画面
"use client"

import { useState } from "react"
import { AlertTriangle, CheckCircle, Clock, Filter } from "lucide-react"

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

type ProblemReport = {
	id: number
	title: string
	description: string
	priority: "高" | "中" | "低"
	status: "未対応" | "対応中" | "解決済み"
	createdAt: string
}

const dummyReports: ProblemReport[] = [
	{
		id: 1,
		title: "ログインできない",
		description: "パスワードを入力しても、エラーが表示されます。",
		priority: "高",
		status: "未対応",
		createdAt: "2024-10-15 09:30"
	},
	{
		id: 2,
		title: "プロフィール画像がアップロードできない",
		description: "画像を選択しても、アップロードボタンが反応しません。",
		priority: "中",
		status: "対応中",
		createdAt: "2024-10-14 14:45"
	},
	{
		id: 3,
		title: "マッチング結果が表示されない",
		description: "マッチング機能を使用しても、結果が表示されません。",
		priority: "高",
		status: "未対応",
		createdAt: "2024-10-16 11:20"
	},
	{
		id: 4,
		title: "価値観の選択肢が少ない",
		description: "もっと多様な価値観の選択肢があると良いです。",
		priority: "低",
		status: "未対応",
		createdAt: "2024-10-13 16:55"
	},
	{
		id: 5,
		title: "グループ作成ができない",
		description: "グループ作成ボタンをクリックしても反応がありません。",
		priority: "中",
		status: "解決済み",
		createdAt: "2024-10-12 10:10"
	}
]

export default function Component() {
	const [reports, setReports] = useState<ProblemReport[]>(dummyReports)
	const [sortBy, setSortBy] = useState<"priority" | "createdAt">("priority")

	const sortReports = (a: ProblemReport, b: ProblemReport) => {
		if (sortBy === "priority") {
			const priorityOrder = { 高: 3, 中: 2, 低: 1 }
			return priorityOrder[b.priority] - priorityOrder[a.priority]
		} else {
			return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
		}
	}

	const getPriorityIcon = (priority: ProblemReport["priority"]) => {
		switch (priority) {
			case "高":
				return <AlertTriangle className='h-5 w-5 text-red-500' />
			case "中":
				return <Clock className='h-5 w-5 text-yellow-500' />
			case "低":
				return <CheckCircle className='h-5 w-5 text-green-500' />
		}
	}

	const getStatusColor = (status: ProblemReport["status"]) => {
		switch (status) {
			case "未対応":
				return "text-red-500"
			case "対応中":
				return "text-yellow-500"
			case "解決済み":
				return "text-green-500"
		}
	}

	return (
		<Card className='w-full max-w-4xl'>
			<CardHeader>
				<CardTitle className='text-2xl'>問題報告管理</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='flex justify-end mb-4'>
					<Select
						value={sortBy}
						onValueChange={(value: "priority" | "createdAt") =>
							setSortBy(value)
						}
					>
						<SelectTrigger className='w-[180px]'>
							<Filter className='mr-2 h-4 w-4' />
							<SelectValue placeholder='並び替え' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='priority'>優先度順</SelectItem>
							<SelectItem value='createdAt'>日付順</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>優先度</TableHead>
							<TableHead>タイトル</TableHead>
							<TableHead>状態</TableHead>
							<TableHead>報告日時</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{reports.sort(sortReports).map((report) => (
							<TableRow key={report.id}>
								<TableCell>{getPriorityIcon(report.priority)}</TableCell>
								<TableCell>
									<div>{report.title}</div>
									<div className='text-sm text-muted-foreground'>
										{report.description}
									</div>
								</TableCell>
								<TableCell className={getStatusColor(report.status)}>
									{report.status}
								</TableCell>
								<TableCell>{report.createdAt}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	)
}
