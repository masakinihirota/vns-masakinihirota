"use client"

import { useState } from "react"

import SingleChoice from "@/components/AI/gemini/03/SingleChoice"

export default function Page03() {
	const [selected, setSelected] = useState<string | null>(null)
	return (
		<main className='p-8'>
			<h1 className='text-2xl font-bold mb-4'>03ページ</h1>
			<SingleChoice
				question='AI Geminiのシングル選択例です。どれか1つ選んでください。'
				options={["選択肢A", "選択肢B", "選択肢C"]}
				selectedValue={selected}
				onSelect={setSelected}
			/>
		</main>
	)
}
