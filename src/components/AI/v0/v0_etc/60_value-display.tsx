// 価値観表示コンポーネント

import { AlertTriangle, CheckCircle2, Circle, Minus, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type ValueOption = "◎" | "◯" | "ー" | "▲" | "✕"

interface ValueItem {
	category: string
	option: string
	value: ValueOption
}

interface ValueDisplayProps {
	values?: ValueItem[]
}

const ValueIcon = ({ value }: { value: ValueOption }) => {
	switch (value) {
		case "◎":
			return (
				<span role='img' aria-label='とても良い'>
					<svg
						className='w-5 h-5 text-green-500'
						viewBox='0 0 24 24'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
					>
						<title>とても良い</title>
						<CheckCircle2 />
					</svg>
				</span>
			)
		case "◯":
			return (
				<span role='img' aria-label='良い'>
					<svg
						className='w-5 h-5 text-blue-500'
						viewBox='0 0 24 24'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
					>
						<title>良い</title>
						<Circle />
					</svg>
				</span>
			)
		case "ー":
			return (
				<span role='img' aria-label='普通'>
					<svg
						className='w-5 h-5 text-gray-500'
						viewBox='0 0 24 24'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
					>
						<title>普通</title>
						<Minus />
					</svg>
				</span>
			)
		case "▲":
			return (
				<span role='img' aria-label='注意'>
					<svg
						className='w-5 h-5 text-yellow-500'
						viewBox='0 0 24 24'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
					>
						<title>注意</title>
						<AlertTriangle />
					</svg>
				</span>
			)
		case "✕":
			return (
				<span role='img' aria-label='悪い'>
					<svg
						className='w-5 h-5 text-red-500'
						viewBox='0 0 24 24'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
					>
						<title>悪い</title>
						<X />
					</svg>
				</span>
			)
	}
}

const ValueBadge = ({ value }: { value: ValueOption }) => {
	const colorMap: Record<ValueOption, string> = {
		"◎": "bg-green-100 text-green-800",
		"◯": "bg-blue-100 text-blue-800",
		ー: "bg-gray-100 text-gray-800",
		"▲": "bg-yellow-100 text-yellow-800",
		"✕": "bg-red-100 text-red-800"
	}

	return <Badge className={`ml-2 ${colorMap[value]}`}>{value}</Badge>
}

// ダミーデータの作成
const dummyValues: ValueItem[] = [
	{ category: "健康", option: "運動", value: "◎" },
	{ category: "仕事", option: "効率", value: "◯" },
	{ category: "趣味", option: "読書", value: "ー" },
	{ category: "家族", option: "時間", value: "▲" },
	{ category: "友人", option: "信頼", value: "✕" }
]

export default function ValueDisplay() {
	return (
		<Card className='w-full max-w-2xl'>
			<CardHeader>
				<CardTitle>価値観一覧</CardTitle>
			</CardHeader>
			<CardContent>
				{dummyValues.length > 0 ? (
					<div className='grid gap-4'>
						{dummyValues.map((item, index) => (
							<div
								key={`${item.category}-${item.option}`}
								className='flex items-center justify-between p-2 border rounded'
							>
								<div className='flex items-center space-x-2'>
									<ValueIcon value={item.value} />
									<span className='font-medium'>{item.category}</span>
								</div>
								<div className='flex items-center'>
									<span className='text-sm text-gray-600'>{item.option}</span>
									<ValueBadge value={item.value} />
								</div>
							</div>
						))}
					</div>
				) : (
					<p className='text-center text-gray-500'>
						価値観が登録されていません。
					</p>
				)}
			</CardContent>
		</Card>
	)
}
