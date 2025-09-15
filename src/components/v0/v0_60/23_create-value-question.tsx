// 価値観の質問に答えるUI
"use client"

import { useEffect, useState } from "react"
import { PlusCircle, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type Option = {
	id: string
	text: string
}

type Question = {
	id: string
	topic: string
	options: Option[]
	explanation: string
	category: {
		large: string
		medium: string
		small: string
	}
	createdAt: string
	createdBy: string
}

type CategoryData = {
	[key: string]: {
		[key: string]: string[]
	}
}

const categoryData: CategoryData = {
	趣味活動: {
		"視聴、見る、読む、聞く活動": [
			"漫画",
			"アニメ",
			"ゲーム",
			"ドラマ",
			"エンタメ",
			"映画",
			"小説",
			"音楽"
		],
		作る活動: [
			"同人活動に参加している",
			"同人誌を作っている",
			"アプリを開発している",
			"ゲーム開発"
		]
	},
	ワークライフバランス: {
		"生活、ライフスタイル": [
			"生き方",
			"家事",
			"健康",
			"家族",
			"社会",
			"自立",
			"宗教"
		],
		お金: ["経済観念", "消費"],
		時間管理: [
			"仕事と家庭とプライベートの割合",
			"計画性",
			"即興性",
			"効率性",
			"ゆとり"
		],
		仕事: [
			"企業形態",
			"報酬",
			"目標設定",
			"やりがい、意欲、挑戦",
			"キャリア志向",
			"安定志向",
			"社会貢献",
			"企業への貢献",
			"管理能力",
			"労働時間",
			"職場環境",
			"成長性",
			"福利厚生",
			"仕事観",
			"コミュニケーション能力",
			"チームワーク",
			"休暇"
		],
		スキル: ["持っているスキル", "専門性"],
		ビジョン: ["将来の夢と将来のビジョン"],
		老後: ["老後の計画"]
	},
	パートナー: {
		婚活: [
			"結婚の必要性",
			"結婚の時期",
			"同棲、お試しの付き合い",
			"最重要な項目",
			"お金",
			"発言権",
			"行動",
			"信頼",
			"尊重",
			"コミュニケーション",
			"家事",
			"家族計画",
			"家族、親族",
			"ビジョン",
			"夫婦のライフプラン",
			"宗教",
			"奉仕、貢献"
		],
		恋人: ["恋愛対象", "恋愛観", "人生観", "付き合い方", "相手に望むもの"]
	},
	他人: {
		事件: ["想像で判断する"],
		災害: ["避難準備を用意している", "避難場所を考えている"],
		戦争: ["首相", "他国"],
		尊敬: ["尊敬する人"]
	}
}

const MindMapCategory = ({ categoryData, onSelect, question }) => {
	const [selectedLarge, setSelectedLarge] = useState("")
	const [selectedMedium, setSelectedMedium] = useState("")

	const handleLargeClick = (category) => {
		setSelectedLarge(category)
		setSelectedMedium("")
		onSelect({ large: category, medium: "", small: "" })
	}

	const handleMediumClick = (category) => {
		setSelectedMedium(category)
		onSelect({ large: selectedLarge, medium: category, small: "" })
	}

	const handleSmallClick = (category) => {
		onSelect({ large: selectedLarge, medium: selectedMedium, small: category })
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

	const handleCategorySelect = (category) => {
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
