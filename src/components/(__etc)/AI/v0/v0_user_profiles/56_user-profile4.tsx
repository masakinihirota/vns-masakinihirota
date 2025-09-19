// はい、ご要望の内容を理解しました。初めてのログイン時にユーザープロフィールを作成するプロセスを実装するReactコンポーネントを作成します。以下のコンポーネントは、ユーザーがプロフィールを作成する際の主要なステップを含んでいます。

// ```typescriptreact

// ```

// このコンポーネントは以下の機能を実装しています：

// 1. ユーザープロフィールの作成目的の選択
// 2. リーダーシップスタイルの選択
// 3. 興味のあるカテゴリの選択
// 4. 価値観の選択（1ページ目のみ実装）
// 5. プロフィール作成完了の表示

// 各ステップでユーザーの選択を保存し、最後に選択内容をまとめて表示します。実際のアプリケーションでは、最後のステップでデータベースに保存する処理を追加する必要があります。

// また、このコンポーネントは基本的な機能のみを実装しています。実際のアプリケーションでは、以下の点を考慮して拡張する必要があります：

// 1. より詳細なリーダー像の選択
// 2. 漫画やアニメの作品選択と評価
// 3. より多くの価値観の選択肢と複数ページの実装
// 4. エラー処理とバリデーション
// 5. データの永続化（データベースへの保存）
// 6. ユーザー認証との連携

// このコンポーネントは、ユーザーが初めてログインした際のプロフィール作成プロセスの基本的な流れを示しています。実際のアプリケーションに組み込む際は、アプリケーションの要件に合わせてさらにカスタマイズしてください。

"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select"

export default function Component() {
	const [step, setStep] = useState(1)
	const [purpose, setPurpose] = useState("")
	const [leadershipStyle, setLeadershipStyle] = useState("")
	const [categories, setCategories] = useState<string[]>([])
	const [values, setValues] = useState<string[]>([])

	const nextStep = () => setStep(step + 1)
	const prevStep = () => setStep(step - 1)

	const renderStep = () => {
		switch (step) {
			case 1:
				return (
					<Card className='w-[350px]'>
						<CardHeader>
							<CardTitle>ユーザープロフィールの作成目的</CardTitle>
							<CardDescription>
								プロフィールの目的を選択してください
							</CardDescription>
						</CardHeader>
						<CardContent>
							<RadioGroup onValueChange={setPurpose} defaultValue={purpose}>
								<div className='flex items-center space-x-2'>
									<RadioGroupItem value='play' id='play' />
									<Label htmlFor='play'>遊び用</Label>
								</div>
								<div className='flex items-center space-x-2'>
									<RadioGroupItem value='hobby' id='hobby' />
									<Label htmlFor='hobby'>趣味用</Label>
								</div>
								<div className='flex items-center space-x-2'>
									<RadioGroupItem value='work' id='work' />
									<Label htmlFor='work'>仕事用</Label>
								</div>
								<div className='flex items-center space-x-2'>
									<RadioGroupItem value='marriage' id='marriage' />
									<Label htmlFor='marriage'>婚活用</Label>
								</div>
							</RadioGroup>
						</CardContent>
						<CardFooter>
							<Button onClick={nextStep}>次へ</Button>
						</CardFooter>
					</Card>
				)
			case 2:
				return (
					<Card className='w-[350px]'>
						<CardHeader>
							<CardTitle>あなたのリーダー像</CardTitle>
							<CardDescription>
								リーダーシップスタイルを選択してください
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Select onValueChange={setLeadershipStyle}>
								<SelectTrigger className='w-[300px]'>
									<SelectValue placeholder='リーダーシップスタイルを選択' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='democratic'>民主主義的</SelectItem>
									<SelectItem value='delegative'>委任型</SelectItem>
									<SelectItem value='autocratic'>独裁的</SelectItem>
								</SelectContent>
							</Select>
						</CardContent>
						<CardFooter>
							<Button onClick={prevStep} variant='outline' className='mr-2'>
								戻る
							</Button>
							<Button onClick={nextStep}>次へ</Button>
						</CardFooter>
					</Card>
				)
			case 3:
				return (
					<Card className='w-[350px]'>
						<CardHeader>
							<CardTitle>カテゴリ選択</CardTitle>
							<CardDescription>
								興味のあるカテゴリを選択してください
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='flex flex-col space-y-2'>
								<Checkbox
									id='manga'
									onCheckedChange={(checked) =>
										setCategories(
											checked
												? [...categories, "manga"]
												: categories.filter((c) => c !== "manga")
										)
									}
								/>
								<Label htmlFor='manga'>漫画</Label>
								<Checkbox
									id='anime'
									onCheckedChange={(checked) =>
										setCategories(
											checked
												? [...categories, "anime"]
												: categories.filter((c) => c !== "anime")
										)
									}
								/>
								<Label htmlFor='anime'>アニメ</Label>
								<Checkbox
									id='values'
									onCheckedChange={(checked) =>
										setCategories(
											checked
												? [...categories, "values"]
												: categories.filter((c) => c !== "values")
										)
									}
								/>
								<Label htmlFor='values'>価値観</Label>
							</div>
						</CardContent>
						<CardFooter>
							<Button onClick={prevStep} variant='outline' className='mr-2'>
								戻る
							</Button>
							<Button onClick={nextStep}>次へ</Button>
						</CardFooter>
					</Card>
				)
			case 4:
				return (
					<Card className='w-[350px]'>
						<CardHeader>
							<CardTitle>価値観の選択</CardTitle>
							<CardDescription>
								あなたの価値観を選択してください (1/3)
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='flex flex-col space-y-2'>
								<Checkbox
									id='children'
									onCheckedChange={(checked) =>
										setValues(
											checked
												? [...values, "children"]
												: values.filter((v) => v !== "children")
										)
									}
								/>
								<Label htmlFor='children'>子どもが欲しい</Label>
								<Checkbox
									id='no-children'
									onCheckedChange={(checked) =>
										setValues(
											checked
												? [...values, "no-children"]
												: values.filter((v) => v !== "no-children")
										)
									}
								/>
								<Label htmlFor='no-children'>子どもは要らない</Label>
								<Checkbox
									id='live-with-parents'
									onCheckedChange={(checked) =>
										setValues(
											checked
												? [...values, "live-with-parents"]
												: values.filter((v) => v !== "live-with-parents")
										)
									}
								/>
								<Label htmlFor='live-with-parents'>親と同居して欲しい</Label>
							</div>
						</CardContent>
						<CardFooter>
							<Button onClick={prevStep} variant='outline' className='mr-2'>
								戻る
							</Button>
							<Button onClick={nextStep}>次へ</Button>
						</CardFooter>
					</Card>
				)
			case 5:
				return (
					<Card className='w-[350px]'>
						<CardHeader>
							<CardTitle>プロフィール作成完了</CardTitle>
							<CardDescription>
								ユーザープロフィールが作成されました
							</CardDescription>
						</CardHeader>
						<CardContent>
							<p>目的: {purpose}</p>
							<p>リーダーシップスタイル: {leadershipStyle}</p>
							<p>選択したカテゴリ: {categories.join(", ")}</p>
							<p>選択した価値観: {values.join(", ")}</p>
						</CardContent>
						<CardFooter>
							<Button onClick={() => console.log("プロフィール保存")}>
								保存して終了
							</Button>
						</CardFooter>
					</Card>
				)
			default:
				return null
		}
	}

	return (
		<div className='flex justify-center items-center min-h-screen'>
			{renderStep()}
		</div>
	)
}
