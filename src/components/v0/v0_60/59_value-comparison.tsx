// 画像UIの比較機能
"use client"
import React, { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

type ValueOption = "◎" | "〇" | "ー" | "▲" | "✕"

interface ValueItem {
	topic: string
	self: ValueOption
	other: ValueOption
}

const valueItems: ValueItem[] = [
	{ topic: "人", self: "◎", other: "◎" },
	{ topic: "信頼", self: "◎", other: "◎" },
	{ topic: "お金", self: "◎", other: "◎" },
	{ topic: "筋を通す", self: "◎", other: "◎" },
	{ topic: "道徳を守る", self: "◎", other: "◎" },
	{ topic: "法律を守る", self: "◎", other: "◎" },
	{ topic: "みんなにいい顔をする。", self: "◎", other: "◎" },
	{ topic: "お金を借りない", self: "◎", other: "◎" },
	{ topic: "借りを作らない", self: "◎", other: "◎" },
	{ topic: "連帯保証人にならない", self: "◎", other: "◎" },
	{ topic: "料理を作る腕", self: "◎", other: "◎" },
	{ topic: "一人で生きていく力", self: "◎", other: "◎" },
	{ topic: "コミュニケーション力", self: "◎", other: "◎" },
	{ topic: "全部大切", self: "◎", other: "◎" }
]

const ValueIcon = ({ value }: { value: ValueOption }) => {
	const iconMap = {
		"◎": (
			<svg viewBox='0 0 24 24' fill='currentColor' className='w-6 h-6'>
				<circle
					cx='12'
					cy='12'
					r='10'
					stroke='currentColor'
					strokeWidth='2'
					fill='none'
				/>
				<circle cx='12' cy='12' r='4' />
			</svg>
		),
		〇: (
			<svg viewBox='0 0 24 24' fill='currentColor' className='w-6 h-6'>
				<circle
					cx='12'
					cy='12'
					r='10'
					stroke='currentColor'
					strokeWidth='2'
					fill='none'
				/>
			</svg>
		),
		ー: (
			<svg viewBox='0 0 24 24' fill='currentColor' className='w-6 h-6'>
				<line
					x1='4'
					y1='12'
					x2='20'
					y2='12'
					stroke='currentColor'
					strokeWidth='2'
				/>
			</svg>
		),
		"▲": (
			<svg viewBox='0 0 24 24' fill='currentColor' className='w-6 h-6'>
				<polygon
					points='12 4 4 20 20 20'
					stroke='currentColor'
					strokeWidth='2'
					fill='none'
				/>
			</svg>
		),
		"✕": (
			<svg viewBox='0 0 24 24' fill='currentColor' className='w-6 h-6'>
				<line
					x1='4'
					y1='4'
					x2='20'
					y2='20'
					stroke='currentColor'
					strokeWidth='2'
				/>
				<line
					x1='4'
					y1='20'
					x2='20'
					y2='4'
					stroke='currentColor'
					strokeWidth='2'
				/>
			</svg>
		)
	}

	return iconMap[value]
}

export default function Component() {
	const [currentTopic, setCurrentTopic] = useState("人生で大切なのは")
	const [memo, setMemo] = useState("")
	const [values, setValues] = useState<{
		[key: string]: { self: ValueOption; other: ValueOption }
	}>(
		Object.fromEntries(
			valueItems.map((item) => [
				item.topic,
				{ self: item.self, other: item.other }
			])
		)
	)

	const getBackgroundColor = (self: ValueOption, other: ValueOption) => {
		if (self === other) return "bg-green-500" // 緑色
		if (other === "▲" || other === "✕") return "bg-red-500" // 赤色
		return "bg-gray-100" // 白色
	}

	const handleValueChange = (
		topic: string,
		person: "self" | "other",
		value: ValueOption
	) => {
		setValues((prev) => ({
			...prev,
			[topic]: {
				...prev[topic],
				[person]: value
			}
		}))
	}

	return (
		<Card className='w-full max-w-4xl mx-auto bg-gray-50'> {/* カード背景色を変更 */}
			<CardContent className='p-6 bg-white'> {/* コンテンツ背景色を変更 */}
				<div className='flex justify-between items-center mb-4'>
					<Button variant='outline' size='icon' className='text-gray-700'> {/* ボタンの色を変更 */}
						<ChevronLeft className='h-4 w-4' />
					</Button>
					<h2 className='text-2xl font-bold text-gray-800'>自分</h2> {/* テキスト色を変更 */}
					<Button variant='outline' size='icon' className='text-gray-700'> {/* ボタンの色を変更 */}
						<ChevronRight className='h-4 w-4' />
					</Button>
					<Button variant='outline' size='icon' className='text-gray-700'> {/* ボタンの色を変更 */}
						<ChevronLeft className='h-4 w-4' />
					</Button>
					<h2 className='text-2xl font-bold text-gray-800'>相手</h2> {/* テキスト色を変更 */}
					<Button variant='outline' size='icon' className='text-gray-700'> {/* ボタンの色を変更 */}
						<ChevronRight className='h-4 w-4' />
					</Button>
				</div>
				<div className='flex justify-center items-center mb-4'>
					<Button variant='outline' size='icon'>
						<ChevronLeft className='h-4 w-4' />
					</Button>
					<h3 className='text-xl font-semibold mx-4 text-gray-700'>お題：{currentTopic}</h3> {/* テキスト色を変更 */}
					<Button variant='outline' size='icon'>
						<ChevronRight className='h-4 w-4' />
					</Button>
				</div>
				<div className='grid grid-cols-[1fr,auto,auto] gap-2'>
					<div></div>
					<div className='text-center font-bold text-gray-800'>自分</div> {/* テキスト色を変更 */}
					<div className='text-center font-bold text-gray-800'>相手</div> {/* テキスト色を変更 */}
					{valueItems.map((item) => (
						<React.Fragment key={item.topic}>
							<div className='flex items-center'>{item.topic}</div>
							<div
								className={`flex justify-around ${getBackgroundColor(values[item.topic].self, values[item.topic].other)}`}
							>
								{(["◎", "〇", "ー", "▲", "✕"] as ValueOption[]).map(
									(option) => (
										<Button
											key={option}
											variant='ghost'
											size='sm'
											className={`p-1 ${values[item.topic].self === option ? "bg-blue-500 text-white" : "text-gray-700"}`}
											onClick={() =>
												handleValueChange(item.topic, "self", option)
											}
										>
											<ValueIcon value={option} />
										</Button>
									)
								)}
							</div>
							<div
								className={`flex justify-around ${getBackgroundColor(values[item.topic].self, values[item.topic].other)}`}
							>
								{(["◎", "〇", "ー", "▲", "✕"] as ValueOption[]).map(
									(option) => (
										<Button
											key={option}
											variant='ghost'
											size='sm'
											className={`p-1 ${values[item.topic].other === option ? "bg-primary text-primary-foreground" : ""}`}
											onClick={() =>
												handleValueChange(item.topic, "other", option)
											}
										>
											<ValueIcon value={option} />
										</Button>
									)
								)}
							</div>
						</React.Fragment>
					))}
				</div>
			</CardContent>
			<CardFooter>
				<Textarea
					placeholder='メモ'
					value={memo}
					onChange={(e) => setMemo(e.target.value)}
					className='w-full'
				/>
			</CardFooter>
		</Card>
	)
}
