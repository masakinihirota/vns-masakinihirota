// Value観確認ページ
import { AlertTriangle, Check, Minus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Value = {
	category: string
	topic: string
	choice: "◎" | "◯" | "ー" | "▲" | "✕"
}

type ValueProps = {
	values?: Value[]
}

function ValueIcon({ choice }: { choice: Value["choice"] }) {
	switch (choice) {
		case "◎":
			return <Check className='h-5 w-5 text-green-500' />
		case "◯":
			return <Check className='h-5 w-5 text-blue-500' />
		case "ー":
			return <Minus className='h-5 w-5 text-gray-500' />
		case "▲":
			return <AlertTriangle className='h-5 w-5 text-yellow-500' />
		case "✕":
			return <X className='h-5 w-5 text-red-500' />
	}
}

function ValueItem({ value }: { value: Value }) {
	return (
		<div className='flex items-center justify-between py-2'>
			<span className='text-sm'>{value.topic}</span>
			<ValueIcon choice={value.choice} />
		</div>
	)
}

const defaultValues: Value[] = [
	{
		category: "食事",
		topic: "バランスよく3食、決まった時間に食べる",
		choice: "◯"
	},
	{ category: "食事", topic: "1日一回1食で済ませる", choice: "✕" },
	{ category: "食事", topic: "コンビニ飯", choice: "▲" },
	{ category: "食事", topic: "毎回外食", choice: "ー" },
	{ category: "食事", topic: "時々外食", choice: "◎" },
	{ category: "食事", topic: "決まった時間に食べない", choice: "▲" },
	{ category: "食事", topic: "栄養はサプリで補給する", choice: "✕" }
]

export default function Component({ values = defaultValues }: ValueProps) {
	if (!values || values.length === 0) {
		return (
			<div className='container mx-auto p-4'>
				<h1 className='text-2xl font-bold mb-4'>登録した価値観確認</h1>
				<p>登録された価値観がありません。</p>
				<div className='mt-8 flex justify-center'>
					<Button>価値観を登録する</Button>
				</div>
			</div>
		)
	}

	const categories = [...new Set(values.map((v) => v.category))]

	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-2xl font-bold mb-4'>登録した価値観確認</h1>
			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
				{categories.map((category) => (
					<Card key={category}>
						<CardHeader>
							<CardTitle>{category}</CardTitle>
						</CardHeader>
						<CardContent>
							{values
								.filter((v) => v.category === category)
								.map((value, index) => (
									<ValueItem key={index} value={value} />
								))}
						</CardContent>
					</Card>
				))}
			</div>
			<div className='mt-8 flex justify-center'>
				<Button>価値観を編集する</Button>
			</div>
		</div>
	)
}
