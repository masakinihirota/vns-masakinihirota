"use client"

import { useState } from "react"
import { Minus, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

export default function ValueRegistrationForm() {
	const [topic, setTopic] = useState("")
	const [options, setOptions] = useState([""])
	const [isMultipleChoice, setIsMultipleChoice] = useState(true)

	const addOption = () => {
		if (options.length < 20) {
			setOptions([...options, ""])
		}
	}

	const removeOption = (index: number) => {
		const newOptions = options.filter((_, i) => i !== index)
		setOptions(newOptions)
	}

	const updateOption = (index: number, value: string) => {
		const newOptions = [...options]
		newOptions[index] = value
		setOptions(newOptions)
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		// ここでフォームデータを処理します（例：APIに送信するなど）
		console.log({ topic, options, isMultipleChoice })
	}

	return (
		<form
			onSubmit={handleSubmit}
			className='space-y-6 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md'
		>
			<h2 className='text-2xl font-bold mb-4'>価値観の登録</h2>

			<div className='space-y-2'>
				<Label htmlFor='topic'>お題（最大400文字）</Label>
				<Textarea
					id='topic'
					value={topic}
					onChange={(e) => setTopic(e.target.value)}
					maxLength={400}
					placeholder='お題を入力してください'
					className='w-full'
				/>
			</div>

			<div className='space-y-2'>
				<Label>選択肢（最大20個）</Label>
				{options.map((option, index) => (
					<div key={index} className='flex items-center space-x-2'>
						<Input
							value={option}
							onChange={(e) => updateOption(index, e.target.value)}
							placeholder={`選択肢 ${index + 1}`}
							className='flex-grow'
						/>
						<Button
							type='button'
							variant='outline'
							size='icon'
							onClick={() => removeOption(index)}
						>
							<Minus className='h-4 w-4' />
						</Button>
					</div>
				))}
				{options.length < 20 && (
					<Button type='button' onClick={addOption} className='mt-2'>
						<Plus className='h-4 w-4 mr-2' /> 選択肢を追加
					</Button>
				)}
			</div>

			<div className='flex items-center space-x-2'>
				<Switch
					id='multiple-choice'
					checked={isMultipleChoice}
					onCheckedChange={setIsMultipleChoice}
				/>
				<Label htmlFor='multiple-choice'>複数選択を許可する</Label>
			</div>

			<Button type='submit' className='w-full'>
				登録
			</Button>
		</form>
	)
}
