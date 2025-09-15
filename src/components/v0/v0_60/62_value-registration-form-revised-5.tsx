// 価値観登録UI 2
"use client"

import { useState } from "react"
import {
	Circle,
	CircleDot,
	Minus,
	PlusCircle,
	Triangle,
	X,
	XIcon
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

type ChoiceType = "通常" | "数字" | "金額" | "時間"
type IconType = "◎" | "◯" | "ー" | "▲" | "✕"
type NumberType = "通常" | "金額"
type Condition = "以上" | "以下" | "未満" | "非表示"

interface BaseChoice {
	icon: IconType
}

interface NormalChoice extends BaseChoice {
	text: string
}

interface NumberChoice extends BaseChoice {
	value: number
	unit: string
	condition: Condition
}

interface AmountChoice extends BaseChoice {
	value: number
	unit?: "千" | "万" | "億" | "兆" | "京"
	condition: Condition
}

interface TimeChoice extends BaseChoice {
	time: number
	unit: "分" | "時間"
	condition: Condition
}

type Choice = NormalChoice | NumberChoice | AmountChoice | TimeChoice

const japaneseUnits = [
	"個",
	"枚",
	"匹",
	"本",
	"人",
	"体",
	"回",
	"冊",
	"組",
	"束",
	"度",
	"キロメートル",
	"メートル",
	"センチメートル",
	"ミリメートル",
	"トン",
	"キログラム",
	"グラム"
]

export default function Component() {
	const [topic, setTopic] = useState<string>("")
	const [choiceType, setChoiceType] = useState<ChoiceType>("通常")
	const [normalChoices, setNormalChoices] = useState<NormalChoice[]>([
		{ text: "はい", icon: "◎" },
		{ text: "いいえ", icon: "◎" }
	])
	const [numberChoices, setNumberChoices] = useState<NumberChoice[]>([
		{ value: 0, unit: "個", condition: "以上", icon: "◎" },
		{ value: 0, unit: "個", condition: "以上", icon: "◎" }
	])
	const [amountChoices, setAmountChoices] = useState<AmountChoice[]>([
		{ value: 0, condition: "以上", icon: "◎" },
		{ value: 0, condition: "以上", icon: "◎" }
	])
	const [timeChoices, setTimeChoices] = useState<TimeChoice[]>([
		{ time: 0, unit: "分", condition: "以上", icon: "◎" },
		{ time: 0, unit: "分", condition: "以上", icon: "◎" }
	])
	const [currency, setCurrency] = useState<string>("円")

	const addChoice = () => {
		if (choiceType === "通常" && normalChoices.length < 30) {
			setNormalChoices([...normalChoices, { text: "", icon: "◎" }])
		} else if (choiceType === "数字" && numberChoices.length < 30) {
			setNumberChoices([
				...numberChoices,
				{ value: 0, unit: "個", condition: "以上", icon: "◎" }
			])
		} else if (choiceType === "金額" && amountChoices.length < 30) {
			setAmountChoices([
				...amountChoices,
				{ value: 0, condition: "以上", icon: "◎" }
			])
		} else if (choiceType === "時間" && timeChoices.length < 30) {
			setTimeChoices([
				...timeChoices,
				{ time: 0, unit: "分", condition: "以上", icon: "◎" }
			])
		}
	}

	const removeChoice = (index: number) => {
		if (choiceType === "通常" && normalChoices.length > 2) {
			setNormalChoices(normalChoices.filter((_, i) => i !== index))
		} else if (choiceType === "数字" && numberChoices.length > 2) {
			setNumberChoices(numberChoices.filter((_, i) => i !== index))
		} else if (choiceType === "金額" && amountChoices.length > 2) {
			setAmountChoices(amountChoices.filter((_, i) => i !== index))
		} else if (choiceType === "時間" && timeChoices.length > 2) {
			setTimeChoices(timeChoices.filter((_, i) => i !== index))
		}
	}

	const updateChoice = (index: number, updatedChoice: Partial<Choice>) => {
		if (choiceType === "通常") {
			const newChoices = [...normalChoices]
			newChoices[index] = {
				...newChoices[index],
				...(updatedChoice as NormalChoice)
			}
			setNormalChoices(newChoices)
		} else if (choiceType === "数字") {
			const newChoices = [...numberChoices]
			newChoices[index] = {
				...newChoices[index],
				...(updatedChoice as NumberChoice)
			}
			setNumberChoices(newChoices)
		} else if (choiceType === "金額") {
			const newChoices = [...amountChoices]
			newChoices[index] = {
				...newChoices[index],
				...(updatedChoice as AmountChoice)
			}
			setAmountChoices(newChoices)
		} else if (choiceType === "時間") {
			const newChoices = [...timeChoices]
			newChoices[index] = {
				...newChoices[index],
				...(updatedChoice as TimeChoice)
			}
			setTimeChoices(newChoices)
		}
	}

	const resetForm = () => {
		if (confirm("本当にリセットしますか？")) {
			setTopic("")
			setChoiceType("通常")
			setNormalChoices([
				{ text: "はい", icon: "◎" },
				{ text: "いいえ", icon: "◎" }
			])
			setNumberChoices([
				{ value: 0, unit: "個", condition: "以上", icon: "◎" },
				{ value: 0, unit: "個", condition: "以上", icon: "◎" }
			])
			setAmountChoices([
				{ value: 0, condition: "以上", icon: "◎" },
				{ value: 0, condition: "以上", icon: "◎" }
			])
			setTimeChoices([
				{ time: 0, unit: "分", condition: "以上", icon: "◎" },
				{ time: 0, unit: "分", condition: "以上", icon: "◎" }
			])
			setCurrency("円")
		}
	}

	const saveForm = () => {
		if (confirm("保存しますか？")) {
			console.log("保存されました", {
				topic,
				choiceType,
				normalChoices,
				numberChoices,
				amountChoices,
				timeChoices,
				currency
			})
			// ここでデータベースに保存する処理を追加
		}
	}

	const renderChoices = () => {
		switch (choiceType) {
			case "通常":
				return normalChoices.map((choice, index) => (
					<div key={index} className='flex items-center space-x-2'>
						<Input
							value={choice.text}
							onChange={(e) => updateChoice(index, { text: e.target.value })}
							placeholder={`選択肢 ${index + 1}`}
							className='flex-1'
						/>
						<Button
							variant='outline'
							size='icon'
							onClick={() => removeChoice(index)}
							disabled={normalChoices.length <= 2}
						>
							<X className='h-4 w-4' />
						</Button>
					</div>
				))
			case "数字":
				return numberChoices.map((choice, index) => (
					<div key={index} className='flex items-center space-x-2'>
						<Input
							type='number'
							value={choice.value}
							onChange={(e) =>
								updateChoice(index, { value: Number(e.target.value) })
							}
							placeholder='数値'
							className='flex-1'
						/>
						<Select
							value={choice.unit}
							onValueChange={(value) => updateChoice(index, { unit: value })}
						>
							<SelectTrigger className='w-24'>
								<SelectValue placeholder='単位' />
							</SelectTrigger>
							<SelectContent>
								{japaneseUnits.map((unit) => (
									<SelectItem key={unit} value={unit}>
										{unit}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Select
							value={choice.condition}
							onValueChange={(value) =>
								updateChoice(index, { condition: value as Condition })
							}
						>
							<SelectTrigger className='w-24'>
								<SelectValue placeholder='条件' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='以上'>以上</SelectItem>
								<SelectItem value='以下'>以下</SelectItem>
								<SelectItem value='未満'>未満</SelectItem>
								<SelectItem value='非表示'>非表示</SelectItem>
							</SelectContent>
						</Select>
						<Button
							variant='outline'
							size='icon'
							onClick={() => removeChoice(index)}
							disabled={numberChoices.length <= 2}
						>
							<X className='h-4 w-4' />
						</Button>
					</div>
				))
			case "金額":
				return amountChoices.map((choice, index) => (
					<div key={index} className='flex flex-col space-y-2'>
						<div className='flex items-center space-x-2'>
							<Input
								type='number'
								value={choice.value}
								onChange={(e) =>
									updateChoice(index, { value: Number(e.target.value) })
								}
								placeholder='金額'
								className='flex-1'
							/>
							<Select
								value={choice.unit}
								onValueChange={(value) =>
									updateChoice(index, {
										unit: value as "千" | "万" | "億" | "兆" | "京"
									})
								}
							>
								<SelectTrigger className='w-24'>
									<SelectValue placeholder='単位' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='千'>千</SelectItem>
									<SelectItem value='万'>万</SelectItem>
									<SelectItem value='億'>億</SelectItem>
									<SelectItem value='兆'>兆</SelectItem>
									<SelectItem value='京'>京</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className='flex items-center space-x-2'>
							<Select
								value={choice.condition}
								onValueChange={(value) =>
									updateChoice(index, { condition: value as Condition })
								}
							>
								<SelectTrigger className='w-24'>
									<SelectValue placeholder='条件' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='以上'>以上</SelectItem>
									<SelectItem value='以下'>以下</SelectItem>
									<SelectItem value='未満'>未満</SelectItem>
									<SelectItem value='非表示'>非表示</SelectItem>
								</SelectContent>
							</Select>
							<Button
								variant='outline'
								size='icon'
								onClick={() => removeChoice(index)}
								disabled={amountChoices.length <= 2}
							>
								<X className='h-4 w-4' />
							</Button>
						</div>
					</div>
				))
			case "時間":
				return timeChoices.map((choice, index) => (
					<div key={index} className='flex items-center space-x-2'>
						<Input
							type='number'
							value={choice.time}
							onChange={(e) =>
								updateChoice(index, { time: Number(e.target.value) })
							}
							placeholder='時間'
							className='flex-1'
						/>
						<Select
							value={choice.unit}
							onValueChange={(value) =>
								updateChoice(index, { unit: value as "分" | "時間" })
							}
						>
							<SelectTrigger className='w-24'>
								<SelectValue placeholder='単位' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='分'>分</SelectItem>
								<SelectItem value='時間'>時間</SelectItem>
							</SelectContent>
						</Select>
						<Select
							value={choice.condition}
							onValueChange={(value) =>
								updateChoice(index, { condition: value as Condition })
							}
						>
							<SelectTrigger className='w-24'>
								<SelectValue placeholder='条件' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='以上'>以上</SelectItem>
								<SelectItem value='以下'>以下</SelectItem>
								<SelectItem value='未満'>未満</SelectItem>
								<SelectItem value='非表示'>非表示</SelectItem>
							</SelectContent>
						</Select>
						<Button
							variant='outline'
							size='icon'
							onClick={() => removeChoice(index)}
							disabled={timeChoices.length <= 2}
						>
							<X className='h-4 w-4' />
						</Button>
					</div>
				))
		}
	}

	const IconButton = ({
		icon,
		isSelected,
		onClick
	}: {
		icon: IconType
		isSelected: boolean
		onClick: () => void
	}) => (
		<Button
			variant={isSelected ? "default" : "outline"}
			size='icon'
			className='w-10 h-10'
			onClick={onClick}
		>
			{icon === "◎" && <CircleDot className='h-6 w-6' />}
			{icon === "◯" && <Circle className='h-6 w-6' />}
			{icon === "ー" && <Minus className='h-6 w-6' />}
			{icon === "▲" && <Triangle className='h-6 w-6' />}
			{icon === "✕" && <XIcon className='h-6 w-6' />}
		</Button>
	)

	const renderPreviewChoices = () => {
		const icons: IconType[] = ["◎", "◯", "ー", "▲", "✕"]
		const renderIcons = (choice: Choice, index: number) => (
			<div className='flex space-x-1 mb-2'>
				{icons.map((icon) => (
					<IconButton
						key={icon}
						icon={icon}
						isSelected={choice.icon === icon}
						onClick={() => updateChoice(index, { icon })}
					/>
				))}
			</div>
		)

		const renderChoiceText = (
			choice: NumberChoice | AmountChoice | TimeChoice
		) => {
			if (choice.condition === "非表示") {
				return `${choice.value}${choice.unit || ""}`
			} else {
				return `${choice.value}${choice.unit || ""} ${choice.condition}`
			}
		}

		switch (choiceType) {
			case "通常":
				return normalChoices.map((choice, index) => (
					<div key={index} className='mb-4'>
						{renderIcons(choice, index)}
						<span>{choice.text || `選択肢 ${index + 1}`}</span>
					</div>
				))
			case "数字":
				return numberChoices.map((choice, index) => (
					<div key={index} className='mb-4'>
						{renderIcons(choice, index)}
						<span>{renderChoiceText(choice)}</span>
					</div>
				))
			case "金額":
				return amountChoices.map((choice, index) => (
					<div key={index} className='mb-4'>
						{renderIcons(choice, index)}
						<span>
							{renderChoiceText(choice)} {currency}
						</span>
					</div>
				))
			case "時間":
				return timeChoices.map((choice, index) => (
					<div key={index} className='mb-4'>
						{renderIcons(choice, index)}
						<span>{renderChoiceText(choice)}</span>
					</div>
				))
		}
	}

	return (
		<div className='flex flex-col md:flex-row gap-8 p-6'>
			<div className='flex-1 space-y-6'>
				<h2 className='text-2xl font-bold'>価値観登録フォーム</h2>
				<div>
					<Label htmlFor='topic'>お題（100文字以内）</Label>
					<Textarea
						id='topic'
						value={topic}
						onChange={(e) => setTopic(e.target.value)}
						maxLength={100}
						placeholder='お題を入力してください'
						className='mt-1'
					/>
				</div>
				<Tabs
					value={choiceType}
					onValueChange={(value) => setChoiceType(value as ChoiceType)}
				>
					<TabsList>
						<TabsTrigger value='通常'>通常</TabsTrigger>
						<TabsTrigger value='数字'>数字</TabsTrigger>
						<TabsTrigger value='金額'>金額</TabsTrigger>
						<TabsTrigger value='時間'>時間</TabsTrigger>
					</TabsList>
					<TabsContent value='通常' className='space-y-4'>
						{renderChoices()}
					</TabsContent>
					<TabsContent value='数字' className='space-y-4'>
						{renderChoices()}
					</TabsContent>
					<TabsContent value='金額' className='space-y-4'>
						<div className='mb-4'>
							<Label htmlFor='currency'>通貨</Label>
							<Select value={currency} onValueChange={setCurrency}>
								<SelectTrigger className='w-full'>
									<SelectValue placeholder='通貨を選択' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='円'>円</SelectItem>
									<SelectItem value='ドル'>ドル</SelectItem>
									<SelectItem value='ユーロ'>ユーロ</SelectItem>
								</SelectContent>
							</Select>
						</div>
						{renderChoices()}
					</TabsContent>
					<TabsContent value='時間' className='space-y-4'>
						{renderChoices()}
					</TabsContent>
				</Tabs>
				<Button
					onClick={addChoice}
					disabled={
						(choiceType === "通常"
							? normalChoices
							: choiceType === "数字"
								? numberChoices
								: choiceType === "金額"
									? amountChoices
									: timeChoices
						).length >= 30
					}
					className='w-full'
				>
					<PlusCircle className='mr-2 h-4 w-4' /> 選択肢を追加
				</Button>
				<div className='flex space-x-4'>
					<Button variant='outline' onClick={resetForm}>
						リセット
					</Button>
					<Button onClick={saveForm}>保存</Button>
				</div>
			</div>
			<div className='flex-1'>
				<h2 className='text-2xl font-bold mb-4'>プレビュー</h2>
				<div className='border p-4 rounded-lg bg-gray-50'>
					<h3 className='text-xl font-semibold mb-4'>
						{topic || "お題が入力されていません"}
					</h3>
					<div className='space-y-2'>{renderPreviewChoices()}</div>
				</div>
			</div>
		</div>
	)
}
