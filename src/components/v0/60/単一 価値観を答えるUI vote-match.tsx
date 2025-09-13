import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

type Question = {
	id: number
	category: string
	text: string
	choices: string[]
}

const questions: Question[] = [
	{
		id: 1,
		category: "防衛力強化",
		text: "日本の防衛力はもっと強化すべきだ",
		choices: [
			"賛成",
			"どちらかと言えば賛成",
			"どちらとも言えない",
			"どちらかと言えば反対",
			"反対"
		]
	},
	{
		id: 2,
		category: "経済政策",
		text: "消費税を引き下げるべきだ",
		choices: [
			"賛成",
			"どちらかと言えば賛成",
			"どちらとも言えない",
			"どちらかと言えば反対",
			"反対"
		]
	},
	{
		id: 3,
		category: "環境政策",
		text: "再生可能エネルギーの導入をさらに推進すべきだ",
		choices: [
			"賛成",
			"どちらかと言えば賛成",
			"どちらとも言えない",
			"どちらかと言えば反対",
			"反対"
		]
	}
]

export default function Component() {
	const [currentQuestion, setCurrentQuestion] = useState(0)
	const [answers, setAnswers] = useState<(string | null)[]>(
		new Array(questions.length).fill(null)
	)
	const [showNextButton, setShowNextButton] = useState(false)

	useEffect(() => {
		setShowNextButton(
			currentQuestion < questions.length - 1 &&
				answers[currentQuestion] !== null
		)
	}, [currentQuestion, answers])

	const handleAnswer = (choice: string) => {
		const newAnswers = [...answers]
		newAnswers[currentQuestion] = choice
		setAnswers(newAnswers)

		if (currentQuestion < questions.length - 1) {
			setCurrentQuestion(currentQuestion + 1)
		}
	}

	const goToPrevious = () => {
		if (currentQuestion > 0) {
			setCurrentQuestion(currentQuestion - 1)
			setShowNextButton(true)
		}
	}

	const goToNext = () => {
		if (currentQuestion < questions.length - 1) {
			setCurrentQuestion(currentQuestion + 1)
		}
	}

	const progress = ((currentQuestion + 1) / questions.length) * 100

	return (
		<Card className='w-full max-w-2xl mx-auto'>
			<CardHeader className='bg-primary text-primary-foreground'>
				<CardTitle className='text-2xl font-bold text-center'>
					衆議院選2024 ボートマッチ
				</CardTitle>
			</CardHeader>
			<CardContent className='p-6'>
				<Progress value={progress} className='mb-4' />
				<p className='text-right mb-4'>
					{currentQuestion + 1} / {questions.length}
				</p>
				<h2 className='text-4xl font-bold mb-4 text-center'>
					Q{questions[currentQuestion].id}
				</h2>
				<h3 className='text-xl font-semibold mb-4 text-center'>
					{questions[currentQuestion].category}
				</h3>
				<p className='text-lg mb-6 text-center'>
					{questions[currentQuestion].text}
				</p>
				<div className='space-y-4 mb-6'>
					{questions[currentQuestion].choices.map((choice, index) => (
						<Button
							key={index}
							variant={
								answers[currentQuestion] === choice ? "default" : "outline"
							}
							className='w-full text-left justify-start h-auto py-3 px-4'
							onClick={() => handleAnswer(choice)}
						>
							{choice}
						</Button>
					))}
				</div>
				<div className='flex justify-between'>
					<Button
						onClick={goToPrevious}
						disabled={currentQuestion === 0}
						variant='outline'
					>
						<ChevronLeft className='mr-2 h-4 w-4' /> 前へ
					</Button>
					{showNextButton && (
						<Button onClick={goToNext} variant='outline'>
							次へ <ChevronRight className='ml-2 h-4 w-4' />
						</Button>
					)}
				</div>
			</CardContent>
		</Card>
	)
}
