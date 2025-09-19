"use client"

import { useState } from "react"

import MultipleChoice from "@/components/(__etc)/AI/gemini/03/MultipleChoice"

export default function Page04() {
	const [selectedValues, setSelectedValues] = useState<string[]>([])
	const options = ["選択肢A", "選択肢B", "選択肢C", "選択肢D"]
	const handleSelect = (value: string) => {
		setSelectedValues((prev) =>
			prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
		)
	}
	return (
		<main className='p-8'>
			<h1 className='text-2xl font-bold mb-4'>04ページ</h1>
			<MultipleChoice
				question='複数選択できます。該当するものを選んでください。'
				options={options}
				selectedValues={selectedValues}
				onSelect={handleSelect}
			/>
		</main>
	)
}
