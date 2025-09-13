"use client"

import { useState } from "react"

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
import { Textarea } from "@/components/ui/textarea"

export default function Component() {
	const [profileName, setProfileName] = useState("")
	const [purpose, setPurpose] = useState("")
	const [favoriteWorks, setFavoriteWorks] = useState("")
	const [valueSelection, setValueSelection] = useState({})

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		// ここでフォームデータを処理します
		console.log({ profileName, purpose, favoriteWorks, valueSelection })
	}

	return (
		<form
			onSubmit={handleSubmit}
			className='space-y-8 max-w-2xl mx-auto p-6 bg-background rounded-lg shadow-md'
		>
			<h1 className='text-3xl font-bold text-center mb-6'>
				ユーザープロフィール作成
			</h1>

			<div className='space-y-4'>
				<Label htmlFor='profile-name'>プロフィール名</Label>
				<Input
					id='profile-name'
					value={profileName}
					onChange={(e) => setProfileName(e.target.value)}
					placeholder='プロフィール名を入力してください'
				/>
			</div>

			<div className='space-y-4'>
				<Label htmlFor='purpose'>使用目的</Label>
				<Select onValueChange={setPurpose}>
					<SelectTrigger>
						<SelectValue placeholder='使用目的を選択してください' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='friend'>仲間探し</SelectItem>
						<SelectItem value='hobby'>趣味</SelectItem>
						<SelectItem value='work'>仕事用</SelectItem>
						<SelectItem value='partner'>パートナー探し</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className='space-y-4'>
				<Label htmlFor='favorite-works'>好きな作品</Label>
				<Textarea
					id='favorite-works'
					value={favoriteWorks}
					onChange={(e) => setFavoriteWorks(e.target.value)}
					placeholder='好きな作品をカンマ区切りで入力してください'
				/>
			</div>

			<div className='space-y-4'>
				<Label>価値観の選択</Label>
				<div className='space-y-2'>
					{["食事について", "仕事について", "趣味について"].map((topic) => (
						<div key={topic} className='space-y-2'>
							<h3 className='font-medium'>{topic}</h3>
							<RadioGroup
								onValueChange={(value) =>
									setValueSelection((prev) => ({ ...prev, [topic]: value }))
								}
							>
								<div className='flex items-center space-x-2'>
									<RadioGroupItem value='best' id={`${topic}-best`} />
									<Label htmlFor={`${topic}-best`}>◎ 最高</Label>
								</div>
								<div className='flex items-center space-x-2'>
									<RadioGroupItem value='good' id={`${topic}-good`} />
									<Label htmlFor={`${topic}-good`}>◯ 合格</Label>
								</div>
								<div className='flex items-center space-x-2'>
									<RadioGroupItem value='normal' id={`${topic}-normal`} />
									<Label htmlFor={`${topic}-normal`}>ー 普通</Label>
								</div>
								<div className='flex items-center space-x-2'>
									<RadioGroupItem value='bad' id={`${topic}-bad`} />
									<Label htmlFor={`${topic}-bad`}>▲ 出来れば拒否</Label>
								</div>
								<div className='flex items-center space-x-2'>
									<RadioGroupItem value='worst' id={`${topic}-worst`} />
									<Label htmlFor={`${topic}-worst`}>✕ 強く拒否</Label>
								</div>
							</RadioGroup>
						</div>
					))}
				</div>
			</div>

			<Button type='submit' className='w-full'>
				プロフィールを作成
			</Button>
		</form>
	)
}
