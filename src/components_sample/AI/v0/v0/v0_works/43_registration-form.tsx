// 作品or価値観登録画面
"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Option {
	value: string
	label: string
}

const RequiredIndicator = () => <span className='text-red-500 ml-1'>*</span>

export default function RegistrationForm() {
	const [_formType, setFormType] = useState<"work" | "value">("work")
	const [category, setCategory] = useState<string>("")
	const [showOptionalItems, setShowOptionalItems] = useState(false)
	const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
		[]
	)

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault()
		// Handle form submission logic here
		console.log("Form submitted")
	}

	const subcategoryOptions =
		category === "anime"
			? [
					{ value: "adventure", label: "冒険" },
					{ value: "action", label: "格闘" },
					{ value: "historical", label: "大河" },
					{ value: "romcom", label: "ラブコメ" },
					{ value: "bl", label: "BL" }
				]
			: [
					{ value: "shonen", label: "少年漫画" },
					{ value: "shojo", label: "少女漫画" },
					{ value: "seinen", label: "青年漫画" },
					{ value: "josei", label: "女性漫画" },
					{ value: "romcom", label: "ラブコメ" },
					{ value: "sports", label: "スポーツ" }
				]

	const toggleSubcategory = (value: string) => {
		setSelectedSubcategories((prev) =>
			prev.includes(value)
				? prev.filter((item) => item !== value)
				: [...prev, value]
		)
	}

	return (
		<Card className='w-full'>
			<CardHeader>
				<CardTitle>作品&価値観登録</CardTitle>
				<CardDescription>
					カテゴリ別に作品または価値観を登録します。
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Tabs
					defaultValue='work'
					onValueChange={(value) => setFormType(value as "work" | "value")}
				>
					<TabsList className='grid w-full grid-cols-2'>
						<TabsTrigger value='work'>作品登録</TabsTrigger>
						<TabsTrigger value='value'>価値観登録</TabsTrigger>
					</TabsList>
					<TabsContent value='work'>
						<form onSubmit={handleSubmit}>
							<div className='space-y-6'>
								<div className='space-y-4'>
									<div>
										<Label>
											カテゴリ
											<RequiredIndicator />
										</Label>
										<div className='flex space-x-2 mt-1'>
											<Button
												type='button'
												variant={category === "anime" ? "default" : "outline"}
												onClick={() => setCategory("anime")}
												className='bg-primary text-primary-foreground hover:bg-primary/90 flex-1'
											>
												アニメ
											</Button>
											<Button
												type='button'
												variant={category === "manga" ? "default" : "outline"}
												onClick={() => setCategory("manga")}
												className='bg-primary text-primary-foreground hover:bg-primary/90 flex-1'
											>
												漫画
											</Button>
										</div>
									</div>
									<div>
										<Label htmlFor='title'>
											作品名
											<RequiredIndicator />
										</Label>
										<Input id='title' placeholder='作品名を入力' />
									</div>
									<div>
										<Label htmlFor='rating'>
											評価
											<RequiredIndicator />
										</Label>
										<Select>
											<SelectTrigger>
												<SelectValue placeholder='評価を選択' />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value='1'>ティア1</SelectItem>
												<SelectItem value='2'>ティア2</SelectItem>
												<SelectItem value='3'>ティア3</SelectItem>
												<SelectItem value='4'>
													普通もしくは自分に合わなかった
												</SelectItem>
												<SelectItem value='5'>未評価</SelectItem>
												<SelectItem value='6'>未読</SelectItem>
												<SelectItem value='7'>おすすめ</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>
								<Separator />
								{category && (
									<div className='space-y-6'>
										<div className='space-y-4'>
											<div>
												<Label htmlFor='subcategory'>
													サブカテゴリ（複数選択可）
												</Label>
												<div className='flex flex-wrap gap-2 mt-2'>
													{subcategoryOptions.map((option) => (
														<Button
															key={option.value}
															type='button'
															variant={
																selectedSubcategories.includes(option.value)
																	? "default"
																	: "outline"
															}
															onClick={() => toggleSubcategory(option.value)}
															className='bg-secondary text-secondary-foreground hover:bg-secondary/80'
														>
															{option.label}
														</Button>
													))}
												</div>
											</div>
											<div>
												<Label htmlFor='author'>作家名</Label>
												<Input id='author' placeholder='作家名を入力' />
											</div>
											<div className='flex items-center space-x-2'>
												<Checkbox id='is-own-work' />
												<Label htmlFor='is-own-work'>自分が作った作品</Label>
											</div>
											<div>
												<Label>作品の規模</Label>
												<Select>
													<SelectTrigger>
														<SelectValue placeholder='作品の規模を選択' />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value='small'>
															小 (短時間で読み、見終わる)
														</SelectItem>
														<SelectItem value='medium'>
															中 (何時間もかかる)
														</SelectItem>
														<SelectItem value='large'>
															大 (何日もかかる)
														</SelectItem>
													</SelectContent>
												</Select>
											</div>
											<div className='flex items-center space-x-2'>
												<Checkbox id='is-completed' />
												<Label htmlFor='is-completed'>完結</Label>
											</div>
											<div>
												<Label htmlFor='official-site'>公式サイトURL</Label>
												<Input
													id='official-site'
													type='url'
													placeholder='公式サイトURLを入力'
												/>
											</div>
											<div>
												<Label htmlFor='search-url'>作品検索URL</Label>
												<Input
													id='search-url'
													type='url'
													placeholder='作品検索URLを入力'
												/>
											</div>
										</div>
										<Separator />
										<div>
											<Button
												type='button'
												variant='outline'
												onClick={() => setShowOptionalItems(!showOptionalItems)}
												className='w-full bg-secondary text-secondary-foreground hover:bg-secondary/80'
											>
												{showOptionalItems
													? "オプション項目を隠す"
													: "その他のオプション項目を表示"}
											</Button>
										</div>
										{showOptionalItems && (
											<div className='space-y-4'>
												<div>
													<Label htmlFor='first-publication-year'>初出年</Label>
													<Input
														id='first-publication-year'
														type='number'
														placeholder='初出年を入力'
													/>
												</div>
												<div>
													<Label>適正年齢</Label>
													<Select>
														<SelectTrigger>
															<SelectValue placeholder='適正年齢を選択' />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value='preschool'>
																小学生未満が対象
															</SelectItem>
															<SelectItem value='elementary-lower'>
																小学生低学年以上
															</SelectItem>
															<SelectItem value='elementary-upper'>
																小学生高学年以上
															</SelectItem>
															<SelectItem value='junior-high'>
																中学生以上
															</SelectItem>
															<SelectItem value='high-school'>
																高校生以上
															</SelectItem>
															<SelectItem value='adult'>成年以上</SelectItem>
														</SelectContent>
													</Select>
												</div>
												<div>
													<Label>適正年齢幅</Label>
													<div className='flex items-center space-x-2'>
														<Input
															type='number'
															placeholder='下限'
															min={0}
															max={150}
															className='w-20'
														/>
														<span>〜</span>
														<Input
															type='number'
															placeholder='上限'
															min={0}
															max={150}
															className='w-20'
														/>
														<span>歳</span>
													</div>
												</div>
												<div>
													<Label htmlFor='country'>発売国</Label>
													<Input id='country' placeholder='発売国を入力' />
												</div>
												<div>
													<Label htmlFor='language'>言語</Label>
													<Input id='language' placeholder='言語を入力' />
												</div>
												<div>
													<Label htmlFor='introduction-url'>作品紹介URL</Label>
													<Input
														id='introduction-url'
														type='url'
														placeholder='作品紹介URLを入力'
													/>
												</div>
												<div>
													<Label htmlFor='affiliate-url'>
														アフィリエイトURL
													</Label>
													<Input
														id='affiliate-url'
														type='url'
														placeholder='アフィリエイトURLを入力'
													/>
												</div>
												<div className='flex justify-center'>
													<Button
														type='submit'
														className='bg-primary text-primary-foreground hover:bg-primary/90'
													>
														登録
													</Button>
												</div>
											</div>
										)}
									</div>
								)}
							</div>
						</form>
					</TabsContent>
					<TabsContent value='value'>
						<form onSubmit={handleSubmit}>
							<div className='space-y-8'>
								<div>
									<h3 className='text-lg font-medium'>必須項目</h3>
									<div className='grid grid-cols-2 gap-4 mt-4'>
										<div>
											<Label htmlFor='value-category'>
												サブカテゴリ
												<RequiredIndicator />
											</Label>
											<Select>
												<SelectTrigger>
													<SelectValue placeholder='サブカテゴリを選択' />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value='life'>生活</SelectItem>
													<SelectItem value='work'>仕事</SelectItem>
													<SelectItem value='play'>遊び</SelectItem>
													<SelectItem value='love'>恋愛</SelectItem>
													<SelectItem value='food'>食事</SelectItem>
													<SelectItem value='politics'>政治</SelectItem>
												</SelectContent>
											</Select>
										</div>
										<div>
											<Label htmlFor='value-title'>
												タイトル
												<RequiredIndicator />
											</Label>
											<Input id='value-title' placeholder='タイトルを入力' />
										</div>
									</div>
								</div>
								<Separator />
								<div>
									<h3 className='text-lg font-medium'>選択肢</h3>
									<div className='space-y-2 mt-4'>
										{["インドア", "アウトドア", "喫茶店", "散歩", "映画"].map(
											(option, index) => (
												<div
													key={index}
													className='flex items-center space-x-2'
												>
													<Select>
														<SelectTrigger className='w-20'>
															<SelectValue placeholder='選択' />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value='high'>◎</SelectItem>
															<SelectItem value='medium'>◯</SelectItem>
															<SelectItem value='low'>▲</SelectItem>
														</SelectContent>
													</Select>
													<Input defaultValue={option} className='flex-grow' />
												</div>
											)
										)}
									</div>
									<Button
										type='button'
										className='mt-2 bg-secondary text-secondary-foreground hover:bg-secondary/80'
									>
										選択肢を追加
									</Button>
								</div>
								<div className='flex justify-center'>
									<Button
										type='submit'
										className='bg-primary text-primary-foreground hover:bg-primary/90'
									>
										登録
									</Button>
								</div>
							</div>
						</form>
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	)
}
