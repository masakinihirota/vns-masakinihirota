// ユーザー評価履歴
"use client"

import { useState } from "react"
import {
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis
} from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select"

// 評価履歴のダミーデータ
const ratingHistory = [
	{ date: "2023-01-01", tier: 3 },
	{ date: "2023-02-15", tier: 2 },
	{ date: "2023-04-01", tier: 2 },
	{ date: "2023-05-20", tier: 1 },
	{ date: "2023-07-10", tier: 1 }
]

const works = [
	{ id: "1", title: "進撃の巨人" },
	{ id: "2", title: "新世紀エヴァンゲリオン" },
	{ id: "3", title: "ハンターハンター" }
]

export default function Component() {
	const [selectedWork, setSelectedWork] = useState(works[0].id)

	return (
		<Card className='w-full max-w-3xl mx-auto'>
			<CardHeader>
				<CardTitle>ユーザー評価履歴</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='mb-4'>
					<Select onValueChange={setSelectedWork} defaultValue={selectedWork}>
						<SelectTrigger className='w-[180px]'>
							<SelectValue placeholder='作品を選択' />
						</SelectTrigger>
						<SelectContent>
							{works.map((work) => (
								<SelectItem key={work.id} value={work.id}>
									{work.title}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className='h-[300px] sm:h-[400px]'>
					<ResponsiveContainer width='100%' height='100%'>
						<LineChart
							data={ratingHistory}
							margin={{
								top: 5,
								right: 30,
								left: 20,
								bottom: 5
							}}
						>
							<CartesianGrid strokeDasharray='3 3' />
							<XAxis dataKey='date' />
							<YAxis domain={[1, 6]} ticks={[1, 2, 3, 4, 5, 6]} />
							<Tooltip />
							<Legend />
							<Line
								type='stepAfter'
								dataKey='tier'
								stroke='#8884d8'
								activeDot={{ r: 8 }}
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>
				<p className='mt-4 text-sm text-muted-foreground'>
					グラフは選択された作品の評価履歴を表示しています。縦軸はティアを、横軸は日付を示しています。
				</p>
			</CardContent>
		</Card>
	)
}
