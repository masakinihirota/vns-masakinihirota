// ルートアカウント
import React, { useState } from "react"
import { AlertCircle, History, Star, UserPlus } from "lucide-react"

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function RootAccountDashboard() {
	const [oasisDeclaration, setOasisDeclaration] = useState(false)

	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-3xl font-bold mb-6'>ルートアカウント管理</h1>

			<Tabs defaultValue='basic-info' className='space-y-4'>
				<TabsList>
					<TabsTrigger value='basic-info'>基本情報</TabsTrigger>
					<TabsTrigger value='profiles'>プロフィール</TabsTrigger>
					<TabsTrigger value='evaluations'>評価</TabsTrigger>
					<TabsTrigger value='penalties'>ペナルティ</TabsTrigger>
					<TabsTrigger value='history'>変更履歴</TabsTrigger>
				</TabsList>

				<TabsContent value='basic-info'>
					<Card>
						<CardHeader>
							<CardTitle>基本情報</CardTitle>
							<CardDescription>
								ルートアカウントの基本情報を管理します。
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form className='space-y-4'>
								<div className='space-y-2'>
									<Label htmlFor='username'>ユーザー名</Label>
									<Input id='username' placeholder='ユーザー名を入力' />
								</div>
								<div className='space-y-2'>
									<Label htmlFor='points'>所持ポイント</Label>
									<Input id='points' type='number' placeholder='0' readOnly />
								</div>
								<div className='flex items-center space-x-2'>
									<Checkbox
										id='oasis-declaration'
										checked={oasisDeclaration}
										onCheckedChange={setOasisDeclaration}
									/>
									<Label htmlFor='oasis-declaration'>
										オアシス宣言に同意します
									</Label>
								</div>
								<Button type='submit' disabled={!oasisDeclaration}>
									保存
								</Button>
							</form>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value='profiles'>
					<Card>
						<CardHeader>
							<CardTitle>ユーザープロフィール</CardTitle>
							<CardDescription>
								複数のプロフィールを管理します。
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Button className='mb-4'>
								<UserPlus className='mr-2 h-4 w-4' /> 新規プロフィール作成
							</Button>
							{/* プロフィールのリストをここに表示 */}
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value='evaluations'>
					<Card>
						<CardHeader>
							<CardTitle>ユーザー評価</CardTitle>
							<CardDescription>あなたの評価情報を表示します。</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='flex items-center space-x-2 mb-4'>
								<Star className='h-6 w-6 text-yellow-400' />
								<span className='text-2xl font-bold'>4.5</span>
								<span className='text-gray-500'>(32 評価)</span>
							</div>
							{/* 詳細な評価情報をここに表示 */}
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value='penalties'>
					<Card>
						<CardHeader>
							<CardTitle>ペナルティ情報</CardTitle>
							<CardDescription>
								警告やペナルティの履歴を表示します。
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='space-y-2'>
								<div className='flex items-center space-x-2'>
									<AlertCircle className='h-5 w-5 text-yellow-500' />
									<span>警告: 2回</span>
								</div>
								<div className='flex items-center space-x-2'>
									<AlertCircle className='h-5 w-5 text-red-500' />
									<span>イエローカード: 1回</span>
								</div>
								{/* その他のペナルティ情報 */}
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value='history'>
					<Card>
						<CardHeader>
							<CardTitle>変更履歴</CardTitle>
							<CardDescription>
								アカウント情報の変更履歴を表示します。
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='space-y-4'>
								<div className='flex items-start space-x-2'>
									<History className='h-5 w-5 mt-1' />
									<div>
										<p className='font-semibold'>ユーザー名変更</p>
										<p className='text-sm text-gray-500'>2023年9月1日 10:30</p>
									</div>
								</div>
								{/* その他の変更履歴 */}
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	)
}
