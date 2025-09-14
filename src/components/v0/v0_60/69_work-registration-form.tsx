// 作品登録
"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"

const categories = ["アニメ", "漫画", "ゲーム", "映画", "小説"]
const subCategories = {
	アニメ: ["冒険", "格闘", "大河", "ラブコメ", "BL"],
	漫画: ["少年漫画", "少女漫画", "青年漫画", "女性漫画", "ラブコメ", "スポーツ"]
	// 他のカテゴリのサブカテゴリも同様に定義
}
const tierNames = {
	1: "ティア1",
	2: "ティア2",
	3: "ティア3",
	4: "普通もしくは自分に合わない",
	5: "未評価",
	6: "未読",
	7: "おすすめ"
}

export default function WorkRegistrationForm() {
	const [category, setCategory] = useState("")
	const [subCategory, setSubCategory] = useState<string[]>([])
	const [tier, setTier] = useState(5)
	const [tags, setTags] = useState<string[]>([])
	const [newTag, setNewTag] = useState("")
	const [isAdmin, setIsAdmin] = useState(false) // 実際の実装では、ユーザーの権限に基づいて設定する

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault()
		// フォームの送信処理をここに実装
		console.log("フォームが送信されました")
	}

	const handleAddTag = () => {
		if (newTag && !tags.includes(newTag)) {
			setTags([...tags, newTag])
			setNewTag("")
		}
	}

	return (
		<form
			onSubmit={handleSubmit}
			className='space-y-6 max-w-2xl mx-auto p-6 bg-background rounded-lg shadow-md'
		>
			<h1 className='text-2xl font-bold mb-6'>作品登録</h1>

			<div>
				<Label htmlFor='category'>カテゴリ</Label>
				<Select
					id='category'
					value={category}
					onValueChange={(value) => {
						setCategory(value)
						setSubCategory([])
					}}
				>
					<option value=''>カテゴリを選択</option>
					{categories.map((cat) => (
						<option key={cat} value={cat}>
							{cat}
						</option>
					))}
				</Select>
			</div>

			{category && (
				<div>
					<Label>サブカテゴリ</Label>
					<div className='grid grid-cols-2 gap-2'>
						{subCategories[category].map((subCat) => (
							<div key={subCat} className='flex items-center space-x-2'>
								<Checkbox
									id={subCat}
									checked={subCategory.includes(subCat)}
									onCheckedChange={(checked) => {
										if (checked) {
											setSubCategory([...subCategory, subCat])
										} else {
											setSubCategory(subCategory.filter((sc) => sc !== subCat))
										}
									}}
								/>
								<Label htmlFor={subCat}>{subCat}</Label>
							</div>
						))}
					</div>
				</div>
			)}

			<div>
				<Label htmlFor='title'>作品名</Label>
				<Input id='title' required />
			</div>

			<div>
				<Label htmlFor='tier'>評価</Label>
				<Select
					id='tier'
					value={tier.toString()}
					onValueChange={(value) => setTier(Number(value))}
				>
					{Object.entries(tierNames).map(([key, value]) => (
						<option key={key} value={key}>
							{value}
						</option>
					))}
				</Select>
			</div>

			<div>
				<Label htmlFor='author'>作家名</Label>
				<Input id='author' />
			</div>

			<div>
				<Label htmlFor='releaseYear'>初出年</Label>
				<Input id='releaseYear' type='number' />
			</div>

			<div>
				<Label>作品の規模</Label>
				<Select>
					<option value='small'>小 (短時間で読み、見終わる)</option>
					<option value='medium'>中 (何時間もかかる)</option>
					<option value='large'>大 (何日もかかる)</option>
				</Select>
			</div>

			<div>
				<Label>適正年齢幅</Label>
				<div className='flex space-x-4'>
					<Slider
						defaultValue={[0, 100]}
						max={100}
						step={1}
						className='w-[60%]'
					/>
					<div className='space-y-1'>
						<p className='text-sm font-medium leading-none'>
							最小年齢: <span className='text-muted-foreground'>0歳</span>
						</p>
						<p className='text-sm font-medium leading-none'>
							最大年齢: <span className='text-muted-foreground'>100歳以上</span>
						</p>
					</div>
				</div>
			</div>

			<div className='flex items-center space-x-2'>
				<Checkbox id='completed' />
				<Label htmlFor='completed'>完結</Label>
			</div>

			<div>
				<Label htmlFor='country'>発売国</Label>
				<Input id='country' />
			</div>

			<div>
				<Label htmlFor='language'>言語</Label>
				<Input id='language' />
			</div>

			<div>
				<Label htmlFor='officialSite'>公式サイトURL</Label>
				<Input id='officialSite' type='url' />
			</div>

			<div>
				<Label htmlFor='description'>作品紹介</Label>
				<Textarea id='description' />
			</div>

			<div>
				<Label htmlFor='searchUrl'>作品検索URL</Label>
				<Input id='searchUrl' type='url' />
			</div>

			<div>
				<Label htmlFor='affiliateUrl'>アフィリエイトURL</Label>
				<Input id='affiliateUrl' type='url' />
			</div>

			<div>
				<Label>タグ</Label>
				<div className='flex space-x-2'>
					<Input
						value={newTag}
						onChange={(e) => setNewTag(e.target.value)}
						placeholder='新しいタグを入力'
					/>
					<Button type='button' onClick={handleAddTag}>
						追加
					</Button>
				</div>
				<div className='mt-2 flex flex-wrap gap-2'>
					{tags.map((tag) => (
						<span
							key={tag}
							className='bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm'
						>
							{tag}
						</span>
					))}
				</div>
			</div>

			{isAdmin && (
				<div className='flex items-center space-x-2'>
					<Checkbox id='adminCheck' />
					<Label htmlFor='adminCheck'>管理人チェック</Label>
				</div>
			)}

			<Button type='submit' className='w-full'>
				登録
			</Button>
		</form>
	)
}
