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
			return <CheckCircle2 className='w-5 h-5 text-green-500' />
		case "◯":
			return <Circle className='w-5 h-5 text-blue-500' />
		case "ー":
			return <Minus className='w-5 h-5 text-gray-500' />
		case "▲":
			return <AlertTriangle className='w-5 h-5 text-yellow-500' />
		case "✕":
			return <X className='w-5 h-5 text-red-500' />
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

export default function ValueDisplay({ values = [] }: ValueDisplayProps) {
	return (
		<Card className='w-full max-w-2xl'>
			<CardHeader>
				<CardTitle>価値観一覧</CardTitle>
			</CardHeader>
			<CardContent>
				{values.length > 0 ? (
					<div className='grid gap-4'>
						{values.map((item, index) => (
							<div
								key={index}
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
