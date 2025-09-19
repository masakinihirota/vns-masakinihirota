// 価値観の質問に答えるUI
"use client"

import { useState } from "react"
import { PlusCircle, Trash2 } from "lucide-react"

import categoryData from "./23_categoryData.json"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import type React from "react"

interface Subcategory {
	id: string
	name: string
}

interface Category {
	id: string
	name: string
	subcategories: Subcategory[]
}

interface Question {
	id: string
	category: {
		large: string
		medium: string
		small: string
	}
	options: { id: string; text: string }[]
	topic?: string
	explanation?: string
	createdAt?: string // Added createdAt property
	createdBy?: string // Added createdBy property
}

interface MindMapCategoryProps {
	categoryData: Record<string, Record<string, string[]>>
	onSelect: (category: { large: string; medium: string; small: string }) => void
	question: Question
}

const MindMapCategory: React.FC<MindMapCategoryProps> = ({
	categoryData,
	onSelect,
	question
}) => {
	const [selectedLarge, setSelectedLarge] = useState<string>("")
	const [selectedMedium, setSelectedMedium] = useState<string>("")
	const [_currentQuestion, setQuestion] = useState<Question>({
		id: "",
		category: { large: "", medium: "", small: "" },
		options: []
	})

	const handleLargeClick = (category: string) => {
		setSelectedLarge(category)
		setSelectedMedium("")
		onSelect({ large: category, medium: "", small: "" })
	}

	const handleMediumClick = (category: string) => {
		setSelectedMedium(category)
		onSelect({ large: selectedLarge, medium: category, small: "" })
	}

	const handleSmallClick = (category: string) => {
		onSelect({ large: selectedLarge, medium: selectedMedium, small: category })
	}

	const _handleCategorySelect = (category: {
		large: string
		medium: string
		small: string
	}) => {
		setQuestion((prev: Question) => ({ ...prev, category }))
	}

	return (
		<div className='mindmap-container p-4 bg-gray-100 rounded-lg'>
			<div className='flex flex-nowrap overflow-x-auto pb-4'>
				{Object.keys(categoryData).map((largeCategory) => (
					<div
						key={largeCategory}
						className='mindmap-branch flex-shrink-0 mr-4'
					>
						<button
							className={`p-2 rounded-full whitespace-nowrap ${selectedLarge === largeCategory ? "bg-primary text-primary-foreground" : "bg-background"}`}
							onClick={() => handleLargeClick(largeCategory)}
						>
							{largeCategory}
						</button>
					</div>
				))}
			</div>
			{selectedLarge && (
				<div className='mt-4'>
					<div className='flex flex-wrap gap-2'>
						{Object.keys(categoryData[selectedLarge]).map((mediumCategory) => (
							<div key={mediumCategory} className='mindmap-leaf'>
								<button
									className={`p-1 rounded-full ${
										selectedMedium === mediumCategory
											? "bg-secondary text-secondary-foreground font-bold"
											: "bg-background"
									}`}
									onClick={() => handleMediumClick(mediumCategory)}
								>
									{mediumCategory}
								</button>
							</div>
						))}
					</div>
					{selectedMedium && (
						<div className='mt-2 flex flex-wrap gap-2'>
							{categoryData[selectedLarge][selectedMedium].map(
								(smallCategory) => (
									<button
										key={smallCategory}
										className={`p-1 rounded-full ${
											question.category.small === smallCategory
												? "bg-accent text-accent-foreground font-bold"
												: "bg-background hover:bg-muted"
										}`}
										onClick={() => handleSmallClick(smallCategory)}
									>
										{smallCategory}
									</button>
								)
							)}
						</div>
					)}
					<div className='mt-4 text-sm'>
						<p>選択されたカテゴリ:</p>
						<p>大カテゴリ: {selectedLarge}</p>
						<p>中カテゴリ: {selectedMedium}</p>
						<p>小カテゴリ: {question.category.small}</p>
					</div>
				</div>
			)}
		</div>
	)
}

export default function Component() {
	const [question, setQuestion] = useState<Question>({
		id: "",
		topic: "",
		options: [
			{ id: "1", text: "" },
			{ id: "2", text: "" }
		],
		explanation: "",
		category: {
			large: "",
			medium: "",
			small: ""
		},
		createdAt: new Date().toISOString().split("T")[0],
		createdBy: "現在のユーザー名" // この部分は実際のユーザー認証システムと連携する必要があります
	})

	const addOption = () => {
		setQuestion((prev) => ({
			...prev,
			options: [...prev.options, { id: Date.now().toString(), text: "" }]
		}))
	}

	const removeOption = (id: string) => {
		setQuestion((prev) => {
			if (prev.options.length <= 2) {
				// 2つ以下の場合、テキストをクリアする
				return {
					...prev,
					options: prev.options.map((option) =>
						option.id === id ? { ...option, text: "" } : option
					)
				}
			} else {
				// 3つ以上の場合、オプションを削除する
				return {
					...prev,
					options: prev.options.filter((option) => option.id !== id)
				}
			}
		})
	}

	const handleOptionChange = (id: string, text: string) => {
		setQuestion((prev) => ({
			...prev,
			options: prev.options.map((option) =>
				option.id === id ? { ...option, text } : option
			)
		}))
	}

	const handleCategorySelect = (category: {
		large: string
		medium: string
		small: string
	}) => {
		setQuestion((prev) => ({ ...prev, category }))
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		// ここで質問データを保存または送信する処理を実装します
		console.log("送信された質問:", question)
	}

	return (
		<form
			onSubmit={handleSubmit}
			className='w-full max-w-6xl mx-auto p-8 space-y-8'
		>
			<h1 className='text-3xl font-bold text-center mb-8'>価値観質問の作成</h1>

			<div className='space-y-8'>
				<div className='space-y-4'>
					<div>
						<Label htmlFor='topic' className='text-lg'>
							質問のトピック
						</Label>
						<Input
							id='topic'
							value={question.topic}
							onChange={(e) =>
								setQuestion((prev) => ({ ...prev, topic: e.target.value }))
							}
							placeholder='例: 私にとってアニメとは'
							required
							className='mt-2 text-lg'
						/>
					</div>

					<div>
						<Label className='text-lg'>カテゴリ</Label>
						<MindMapCategory
							categoryData={categoryData}
							onSelect={handleCategorySelect}
							question={question}
						/>
					</div>

					<div className='space-y-4'>
						<Label className='text-lg'>選択肢</Label>
						{question.options.map((option, index) => (
							<div key={option.id} className='flex items-center space-x-2'>
								<Input
									value={option.text}
									onChange={(e) =>
										handleOptionChange(option.id, e.target.value)
									}
									placeholder={`選択肢 ${index + 1}`}
									required
									className='text-lg'
								/>
								<Button
									type='button'
									variant='outline'
									size='icon'
									onClick={() => removeOption(option.id)}
									aria-label='選択肢を削除'
								>
									<Trash2 className='h-5 w-5' />
								</Button>
							</div>
						))}
						<Button
							type='button'
							variant='outline'
							onClick={addOption}
							className='w-full text-lg'
						>
							<PlusCircle className='mr-2 h-5 w-5' /> 選択肢を追加
						</Button>
					</div>

					<div>
						<Label htmlFor='explanation' className='text-lg'>
							解説
						</Label>
						<Textarea
							id='explanation'
							value={question.explanation}
							onChange={(e) =>
								setQuestion((prev) => ({
									...prev,
									explanation: e.target.value
								}))
							}
							placeholder='質問の解説を入力してください'
							rows={6}
							className='mt-2 text-lg'
						/>
					</div>
				</div>
			</div>

			<Button type='submit' className='w-full text-xl py-6'>
				質問を作成
			</Button>
		</form>
	)
}
