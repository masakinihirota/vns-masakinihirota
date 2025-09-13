"use client"

import { useState } from "react"
import { CheckCircle, PlusCircle, RefreshCw, Save, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

type Question = {
	text: string
	options: string[]
	category: string
}

export default function Component() {
	const [questions, setQuestions] = useState<Question[]>([
		{ text: "", options: [""], category: "趣味活動" }
	])
	const [points, setPoints] = useState(100) // 初期ポイントを100とする
	const [isSaving, setIsSaving] = useState(false)
	const [showConfirmButton, setShowConfirmButton] = useState(false)

	const addQuestion = () => {
		setQuestions([
			...questions,
			{ text: "", options: [""], category: "趣味活動" }
		])
	}

	const removeQuestion = (index: number) => {
		setQuestions(questions.filter((_, i) => i !== index))
	}

	const updateQuestion = (index: number, text: string) => {
		const newQuestions = [...questions]
		newQuestions[index].text = text
		setQuestions(newQuestions)
	}

	const addOption = (questionIndex: number) => {
		const newQuestions = [...questions]
		newQuestions[questionIndex].options.push("")
		setQuestions(newQuestions)
	}

	const updateOption = (
		questionIndex: number,
		optionIndex: number,
		text: string
	) => {
		const newQuestions = [...questions]
		newQuestions[questionIndex].options[optionIndex] = text
		setQuestions(newQuestions)
	}

	const removeOption = (questionIndex: number, optionIndex: number) => {
		const newQuestions = [...questions]
		newQuestions[questionIndex].options = newQuestions[
			questionIndex
		].options.filter((_, i) => i !== optionIndex)
		setQuestions(newQuestions)
	}

	const saveQuestions = async () => {
		if (isFormValid() && points >= 10 && !isSaving) {
			setIsSaving(true)
			// 保存処理をシミュレート
			await new Promise((resolve) => setTimeout(resolve, 2000))
			setPoints((prevPoints) => Math.max(0, prevPoints - 10))
			console.log("保存されたデータ:", questions)
			toast({
				title: "保存完了",
				description:
					"価値観のお題と選択肢が正常に保存されました。10ポイント消費しました。"
			})
			setIsSaving(false)
			setShowConfirmButton(true)
			// フォームをリセット
			resetForm()
		}
	}

	const resetForm = () => {
		setQuestions([{ text: "", options: [""], category: "趣味活動" }])
		setShowConfirmButton(false)
	}

	const isFormValid = () => {
		return questions.every(
			(q) => q.text.trim() !== "" && q.options.every((o) => o.trim() !== "")
		)
	}

	const handleRemoveQuestion = (index: number) => {
		if (questions.length === 1) {
			resetForm()
		} else {
			removeQuestion(index)
		}
	}

	return (
		<div className='flex flex-col md:flex-row gap-8 p-6'>
			<div className='w-full md:w-1/2 space-y-6'>
				<div className='mb-4 text-lg font-semibold'>所持ポイント: {points}</div>
				<h2 className='text-2xl font-bold'>価値観登録フォーム</h2>
				{questions.map((question, questionIndex) => (
					<div key={questionIndex} className='space-y-4 p-4 border rounded-lg'>
						<div className='flex items-center gap-2'>
							<Label htmlFor={`question-${questionIndex}`}>
								お題 {questionIndex + 1}
							</Label>
							<Button
								variant='ghost'
								size='icon'
								onClick={() => handleRemoveQuestion(questionIndex)}
							>
								<Trash2 className='h-4 w-4' />
							</Button>
						</div>
						<div className='flex items-center gap-2 mb-2'>
							<Label htmlFor={`category-${questionIndex}`}>カテゴリ</Label>
							<select
								id={`category-${questionIndex}`}
								value={question.category}
								onChange={(e) => {
									const newQuestions = [...questions]
									newQuestions[questionIndex].category = e.target.value
									setQuestions(newQuestions)
								}}
								className='border rounded p-1'
							>
								<option value='趣味活動'>趣味活動</option>
								<option value='ワークライフバランス'>
									ワークライフバランス
								</option>
								<option value='パートナー'>パートナー</option>
								<option value='他人'>他人</option>
							</select>
						</div>
						<Input
							id={`question-${questionIndex}`}
							value={question.text}
							onChange={(e) => updateQuestion(questionIndex, e.target.value)}
							placeholder='お題を入力してください'
						/>
						<div className='space-y-2'>
							<Label>選択肢</Label>
							{question.options.map((option, optionIndex) => (
								<div key={optionIndex} className='flex items-center gap-2'>
									<Input
										value={option}
										onChange={(e) =>
											updateOption(questionIndex, optionIndex, e.target.value)
										}
										placeholder={`選択肢 ${optionIndex + 1}`}
									/>
									<Button
										variant='ghost'
										size='icon'
										onClick={() => removeOption(questionIndex, optionIndex)}
									>
										<Trash2 className='h-4 w-4' />
									</Button>
								</div>
							))}
							<Button
								variant='outline'
								onClick={() => addOption(questionIndex)}
							>
								<PlusCircle className='h-4 w-4 mr-2' />
								選択肢を追加
							</Button>
						</div>
					</div>
				))}
				<Button onClick={addQuestion}>
					<PlusCircle className='h-4 w-4 mr-2' />
					お題を追加
				</Button>
				<div className='flex gap-4'>
					<Button
						onClick={saveQuestions}
						className='flex-1'
						disabled={!isFormValid() || points < 10 || isSaving}
					>
						<Save className='h-4 w-4 mr-2' />
						{isSaving ? "保存中..." : "保存"}
					</Button>
					<Button onClick={resetForm} variant='outline' className='flex-1'>
						<RefreshCw className='h-4 w-4 mr-2' />
						リセット
					</Button>
				</div>
				{showConfirmButton && (
					<Button
						onClick={() => console.log("登録済み価値観の確認画面へ遷移")}
						className='w-full mt-4'
					>
						<CheckCircle className='h-4 w-4 mr-2' />
						登録済み価値観を確認する
					</Button>
				)}
			</div>
			<div className='w-full md:w-1/2'>
				<h2 className='text-2xl font-bold mb-4'>プレビュー</h2>
				<div className='space-y-6 p-4 border rounded-lg'>
					{questions.map((question, questionIndex) => (
						<div key={questionIndex} className='space-y-2'>
							<h3 className='text-lg font-semibold'>
								【{question.category}】{" "}
								{question.text || `お題 ${questionIndex + 1}`}
							</h3>
							{question.options.map((option, optionIndex) => (
								<div key={optionIndex} className='flex items-center gap-2'>
									<input
										type='radio'
										id={`q${questionIndex}-o${optionIndex}`}
										name={`question-${questionIndex}`}
									/>
									<label htmlFor={`q${questionIndex}-o${optionIndex}`}>
										{option || `選択肢 ${optionIndex + 1}`}
									</label>
								</div>
							))}
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
