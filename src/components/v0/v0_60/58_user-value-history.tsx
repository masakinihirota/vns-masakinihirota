// ユーザー価値観履歴
"use client"

import { useState } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

type ValueOption = {
	id: string
	label: string
	count: number
	isSelected: boolean
}

type ValueQuestion = {
	id: string
	question: string
	options: ValueOption[]
}

export default function Component() {
	const [valueQuestions, setValueQuestions] = useState<ValueQuestion[]>([
		{
			id: "1",
			question: "あなたは人間ですか？",
			options: [
				{ id: "1-1", label: "はい", count: 10, isSelected: false },
				{ id: "1-2", label: "いいえ", count: 11, isSelected: true }
			]
		},
		{
			id: "2",
			question: "あなたは妻子持ちですか？",
			options: [
				{ id: "2-1", label: "はい", count: 1, isSelected: true },
				{ id: "2-2", label: "いいえ", count: 1, isSelected: false }
			]
		},
		{
			id: "3",
			question: "子育ては",
			options: [
				{ id: "3-1", label: "女の役目", count: 1, isSelected: false },
				{ id: "3-2", label: "男女共同作業", count: 1, isSelected: true },
				{ id: "3-3", label: "男の役目", count: 0, isSelected: false }
			]
		}
	])

	const handleOptionChange = (questionId: string, optionId: string) => {
		setValueQuestions((prevQuestions) =>
			prevQuestions.map((question) =>
				question.id === questionId
					? {
							...question,
							options: question.options.map((option) =>
								option.id === optionId
									? { ...option, isSelected: true, count: option.count + 1 }
									: { ...option, isSelected: false }
							)
						}
					: question
			)
		)
	}

	return (
		<div className='w-full max-w-3xl mx-auto space-y-6 p-4'>
			<h1 className='text-2xl font-bold text-center mb-6'>
				ユーザー価値観履歴
			</h1>
			{valueQuestions.map((question) => (
				<Card key={question.id}>
					<CardHeader>
						<CardTitle>{question.question}</CardTitle>
					</CardHeader>
					<CardContent>
						<RadioGroup
							onValueChange={(value) => handleOptionChange(question.id, value)}
							defaultValue={question.options.find((o) => o.isSelected)?.id}
						>
							{question.options.map((option) => (
								<div key={option.id} className='flex items-center space-x-2'>
									<RadioGroupItem value={option.id} id={option.id} />
									<Label htmlFor={option.id} className='flex-grow'>
										{option.isSelected && "◯"}
										{option.label}
									</Label>
									<span className='text-sm text-muted-foreground'>
										{option.count}回
									</span>
								</div>
							))}
						</RadioGroup>
					</CardContent>
				</Card>
			))}
		</div>
	)
}
