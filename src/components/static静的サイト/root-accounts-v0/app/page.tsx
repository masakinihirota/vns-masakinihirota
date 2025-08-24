import {
	AlertTriangle,
	CheckCircle,
	FileText,
	Link2,
	Settings,
	Shield,
	User,
	Users
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

export default function RootAccountDashboard() {
	return (
		<div className='min-h-screen bg-background'>
			{/* Header */}
			<header className='border-b bg-card'>
				<div className='container mx-auto px-6 py-4'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center space-x-4'>
							<div className='h-8 w-8 rounded-lg bg-primary flex items-center justify-center'>
								<span className='text-primary-foreground font-bold text-sm'>
									VNS
								</span>
							</div>
							<div>
								<h1 className='text-xl font-bold text-foreground'>
									ルートアカウント管理
								</h1>
								<p className='text-sm text-muted-foreground'>
									Virtual Network Society
								</p>
							</div>
						</div>
						<div className='flex items-center space-x-3'>
							<Avatar>
								<AvatarImage src='/diverse-user-avatars.png' />
								<AvatarFallback>田中</AvatarFallback>
							</Avatar>
							<div className='text-right'>
								<p className='text-sm font-medium'>田中太郎</p>
								<p className='text-xs text-muted-foreground'>ID: root_001</p>
							</div>
						</div>
					</div>
				</div>
			</header>

			<div className='container mx-auto px-6 py-8'>
				{/* User Profile Management - Top Priority */}
				<Card className='mb-8 border-2 border-accent/20 shadow-lg'>
					<CardHeader className='bg-gradient-to-r from-accent/5 to-primary/5'>
						<CardTitle className='text-xl'>
							<Users className='h-6 w-6 text-accent inline mr-2' />
							ユーザープロフィールリスト
							<Badge variant='secondary' className='ml-2'>
								最重要
							</Badge>
						</CardTitle>
						<CardDescription className='text-base'>
							目的別ユーザープロフィールを自由に作成・管理し、適切なマッチングを実現します
						</CardDescription>
					</CardHeader>
					<CardContent className='pt-6'>
						<div className='space-y-3'>
							<div className='flex items-center justify-between p-4 bg-blue-50 border-2 border-blue-300 rounded-lg'>
								<div className='flex items-center space-x-3'>
									<Avatar className='h-10 w-10'>
										<AvatarImage src='/diverse-user-avatars.png' />
										<AvatarFallback>田中</AvatarFallback>
									</Avatar>
									<div>
										<div className='flex items-center space-x-2'>
											<span className='text-sm font-medium'>
												田中太郎（ビジネス）
											</span>
											<Badge
												variant='outline'
												className='text-xs bg-blue-100 text-blue-800'
											>
												仕事用
											</Badge>
										</div>
										<p className='text-xs text-muted-foreground'>
											IT企業・エンジニア - 公開中
										</p>
									</div>
								</div>
								<div className='flex items-center space-x-2'>
									<Badge
										variant='default'
										className='bg-green-100 text-green-800'
									>
										<CheckCircle className='h-3 w-3 mr-1' />
										アクティブ
									</Badge>
									<Button variant='outline' size='sm'>
										編集
									</Button>
								</div>
							</div>

							<div className='flex items-center justify-between p-4 bg-purple-50 border-2 border-purple-300 rounded-lg'>
								<div className='flex items-center space-x-3'>
									<Avatar className='h-10 w-10'>
										<AvatarImage src='/diverse-user-avatars.png' />
										<AvatarFallback>学習</AvatarFallback>
									</Avatar>
									<div>
										<div className='flex items-center space-x-2'>
											<span className='text-sm font-medium'>
												T.田中（学習者）
											</span>
											<Badge
												variant='outline'
												className='text-xs bg-purple-100 text-purple-800'
											>
												学習用
											</Badge>
										</div>
										<p className='text-xs text-muted-foreground'>
											プログラミング学習・資格取得 - 公開中
										</p>
									</div>
								</div>
								<div className='flex items-center space-x-2'>
									<Badge
										variant='default'
										className='bg-green-100 text-green-800'
									>
										<CheckCircle className='h-3 w-3 mr-1' />
										アクティブ
									</Badge>
									<Button variant='outline' size='sm'>
										編集
									</Button>
								</div>
							</div>

							<div className='flex items-center justify-between p-4 bg-pink-50 border-2 border-pink-300 rounded-lg'>
								<div className='flex items-center space-x-3'>
									<Avatar className='h-10 w-10'>
										<AvatarImage src='/diverse-user-avatars.png' />
										<AvatarFallback>💕</AvatarFallback>
									</Avatar>
									<div>
										<div className='flex items-center space-x-2'>
											<span className='text-sm font-medium'>
												田中太郎（真剣交際）
											</span>
											<Badge
												variant='outline'
												className='text-xs bg-pink-100 text-pink-800'
											>
												婚活用
											</Badge>
											<Badge
												variant='secondary'
												className='text-xs bg-orange-100 text-orange-800'
											>
												1つまで
											</Badge>
										</div>
										<p className='text-xs text-muted-foreground'>
											結婚を前提とした真剣な出会い - 限定公開
										</p>
									</div>
								</div>
								<div className='flex items-center space-x-2'>
									<Badge
										variant='default'
										className='bg-green-100 text-green-800'
									>
										<CheckCircle className='h-3 w-3 mr-1' />
										アクティブ
									</Badge>
									<Button variant='outline' size='sm'>
										編集
									</Button>
								</div>
							</div>

							{/* 非アクティブプロフィール */}
							<div className='flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg'>
								<div className='flex items-center space-x-3'>
									<Avatar className='h-10 w-10'>
										<AvatarFallback>趣味</AvatarFallback>
									</Avatar>
									<div>
										<div className='flex items-center space-x-2'>
											<span className='text-sm font-medium'>
												たなか（アニメ好き）
											</span>
											<Badge
												variant='outline'
												className='text-xs bg-green-100 text-green-800'
											>
												遊び用
											</Badge>
										</div>
										<p className='text-xs text-muted-foreground'>
											アニメ・ゲーム愛好家 - 限定公開
										</p>
									</div>
								</div>
								<div className='flex items-center space-x-2'>
									<Badge variant='secondary'>非アクティブ</Badge>
									<Button variant='outline' size='sm'>
										編集
									</Button>
									<Button variant='outline' size='sm'>
										アクティブ化
									</Button>
								</div>
							</div>
						</div>

						<div className='flex space-x-2 pt-3 border-t'>
							<Button variant='outline' size='sm'>
								<Settings className='h-4 w-4 mr-2' />
								一括管理
							</Button>
							<Button variant='outline' size='sm'>
								<Shield className='h-4 w-4 mr-2' />
								公開設定
							</Button>
						</div>
					</CardContent>
				</Card>

				<Card className='mb-8 border-2 border-green-200 shadow-md'>
					<CardHeader className='bg-gradient-to-r from-green-50 to-emerald-50'>
						<CardTitle className='flex items-center space-x-2 text-xl'>
							<span className='text-green-600'>+</span>
							<span>新規ユーザープロフィール作成</span>
						</CardTitle>
						<CardDescription className='text-base'>
							目的を選択して新しいユーザープロフィールを作成します
						</CardDescription>
					</CardHeader>
					<CardContent className='pt-6'>
						<div className='space-y-6'>
							<div className='space-y-4'>
								<h4 className='font-medium text-sm'>
									1. 目的を選択してください（複数選択可能）
								</h4>
								<div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
									<Button
										variant='outline'
										size='sm'
										className='h-auto p-3 flex items-center justify-start space-x-3 bg-white hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900 border-2'
									>
										<span className='text-lg'>⚪</span>
										<span className='text-sm font-medium'>基本用</span>
									</Button>
									<Button
										variant='outline'
										size='sm'
										className='h-auto p-3 flex items-center justify-start space-x-3 bg-white hover:bg-blue-50 hover:border-blue-300 hover:text-blue-900 border-2'
									>
										<span className='text-lg'>💼</span>
										<span className='text-sm font-medium'>仕事用</span>
									</Button>
									<Button
										variant='outline'
										size='sm'
										className='h-auto p-3 flex items-center justify-start space-x-3 bg-white hover:bg-orange-50 hover:border-orange-300 hover:text-orange-900 border-2'
									>
										<span className='text-lg'>🎯</span>
										<span className='text-sm font-medium'>就職用</span>
									</Button>
									<Button
										variant='outline'
										size='sm'
										className='h-auto p-3 flex items-center justify-start space-x-3 bg-white hover:bg-green-50 hover:border-green-300 hover:text-green-900 border-2'
									>
										<span className='text-lg'>🎮</span>
										<span className='text-sm font-medium'>遊び用</span>
									</Button>
									<Button
										variant='outline'
										size='sm'
										className='h-auto p-3 flex items-center justify-start space-x-3 bg-white hover:bg-purple-50 hover:border-purple-300 hover:text-purple-900 border-2'
									>
										<span className='text-lg'>🌟</span>
										<span className='text-sm font-medium'>推し活</span>
									</Button>
									<Button
										variant='outline'
										size='sm'
										className='h-auto p-3 flex items-center justify-start space-x-3 bg-white hover:bg-teal-50 hover:border-teal-300 hover:text-teal-900 border-2'
									>
										<span className='text-lg'>👁️</span>
										<span className='text-sm font-medium'>
											私から見た他人用
										</span>
									</Button>
									<Button
										variant='outline'
										size='sm'
										className='h-auto p-3 flex items-center justify-start space-x-3 bg-gray-100 hover:bg-gray-200 hover:border-gray-400 opacity-50 cursor-not-allowed border-2'
										disabled
									>
										<span className='text-lg'>💕</span>
										<div className='flex flex-col items-start'>
											<span className='text-sm font-medium'>婚活用</span>
											<span className='text-xs text-red-600'>作成済み</span>
										</div>
									</Button>
								</div>
							</div>

							<div className='space-y-4'>
								<h4 className='font-medium text-sm'>
									2. プロフィールタイトルを設定
								</h4>
								<div className='space-y-3'>
									<div className='flex items-center space-x-2'>
										<input
											type='text'
											placeholder='カスタムタイトルを入力（任意）'
											className='flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
										/>
										<Button variant='outline' size='sm'>
											適用
										</Button>
									</div>
								</div>
							</div>

							<div className='space-y-4'>
								<h4 className='font-medium text-sm'>3. 作成方法を選択</h4>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
									<Button
										variant='outline'
										size='sm'
										className='h-auto p-4 flex items-center justify-start space-x-3 bg-white hover:bg-green-50 hover:border-green-300 hover:text-green-900'
									>
										<User className='h-5 w-5 text-green-600' />
										<span className='text-sm font-medium'>新規作成</span>
									</Button>
									<Button
										variant='outline'
										size='sm'
										className='h-auto p-4 flex items-center justify-start space-x-3 bg-white hover:bg-blue-50 hover:border-blue-300 hover:text-blue-900'
									>
										<span className='text-lg'>📋</span>
										<span className='text-sm font-medium'>
											既存のユーザープロフィールを使ってコピーを作成
										</span>
									</Button>
								</div>
							</div>

							<Button className='w-full bg-green-500 hover:bg-green-600'>
								<User className='h-4 w-4 mr-2' />
								新しいユーザープロフィールを作成
							</Button>
						</div>
					</CardContent>
				</Card>

				<Card className='mb-8'>
					<CardHeader>
						<CardTitle className='flex items-center space-x-2'>
							<Users className='h-5 w-5 text-blue-600' />
							<span>グループ機能</span>
						</CardTitle>
						<CardDescription>
							参加・管理しているグループの一覧と活動状況
						</CardDescription>
					</CardHeader>
					<CardContent className='space-y-4'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div className='space-y-3'>
								<h4 className='font-medium flex items-center space-x-2'>
									<span>👑</span>
									<span>管理中のグループ</span>
								</h4>
								<div className='space-y-2'>
									<div className='flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg'>
										<div className='flex items-center space-x-2'>
											<span>🏢</span>
											<span className='text-sm font-medium'>
												IT勉強会グループ
											</span>
										</div>
										<Badge
											variant='outline'
											className='bg-yellow-100 text-yellow-800'
										>
											45人
										</Badge>
									</div>
									<div className='flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg'>
										<div className='flex items-center space-x-2'>
											<span>🎮</span>
											<span className='text-sm font-medium'>
												ゲーム開発コミュニティ
											</span>
										</div>
										<Badge
											variant='outline'
											className='bg-yellow-100 text-yellow-800'
										>
											32人
										</Badge>
									</div>
								</div>
							</div>
							<div className='space-y-3'>
								<h4 className='font-medium flex items-center space-x-2'>
									<span>👥</span>
									<span>参加中のグループ</span>
								</h4>
								<div className='space-y-2'>
									<div className='flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg'>
										<div className='flex items-center space-x-2'>
											<span>🎵</span>
											<span className='text-sm font-medium'>
												音楽制作サークル
											</span>
										</div>
										<Badge
											variant='outline'
											className='bg-blue-100 text-blue-800'
										>
											18人
										</Badge>
									</div>
									<div className='flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg'>
										<div className='flex items-center space-x-2'>
											<span>📚</span>
											<span className='text-sm font-medium'>読書クラブ</span>
										</div>
										<Badge
											variant='outline'
											className='bg-blue-100 text-blue-800'
										>
											24人
										</Badge>
									</div>
								</div>
							</div>
						</div>
						<div className='flex space-x-2 pt-4 border-t'>
							<Button variant='outline' size='sm'>
								<Users className='h-4 w-4 mr-2' />
								グループ管理
							</Button>
							<Button variant='outline' size='sm'>
								<span className='mr-2'>+</span>
								新規グループ作成
							</Button>
						</div>
					</CardContent>
				</Card>

				<Card className='mb-8'>
					<CardHeader>
						<CardTitle className='flex items-center space-x-2'>
							<span className='text-purple-600'>🤝</span>
							<span>アライアンス機能</span>
						</CardTitle>
						<CardDescription>
							参加・管理しているアライアンスの状況と権限
						</CardDescription>
					</CardHeader>
					<CardContent className='space-y-4'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div className='space-y-3'>
								<h4 className='font-medium flex items-center space-x-2'>
									<span>⚡</span>
									<span>リーダー権限あり</span>
								</h4>
								<div className='p-3 bg-purple-50 border border-purple-200 rounded-lg'>
									<div className='flex items-center justify-between mb-2'>
										<span className='text-sm font-medium'>
											テックイノベーション連合
										</span>
										<Badge
											variant='outline'
											className='bg-purple-100 text-purple-800'
										>
											リーダー
										</Badge>
									</div>
									<p className='text-xs text-muted-foreground'>
										技術革新を推進する企業・個人の連合体
									</p>
								</div>
							</div>
							<div className='space-y-3'>
								<h4 className='font-medium flex items-center space-x-2'>
									<span>🎨</span>
									<span>メンバー参加</span>
								</h4>
								<div className='p-3 bg-green-50 border border-green-200 rounded-lg'>
									<div className='flex items-center justify-between mb-2'>
										<span className='text-sm font-medium'>
											クリエイター協会
										</span>
										<Badge
											variant='outline'
											className='bg-green-100 text-green-800'
										>
											メンバー
										</Badge>
									</div>
									<p className='text-xs text-muted-foreground'>
										デザイナー・アーティストの交流と支援
									</p>
								</div>
							</div>
						</div>
						<div className='flex space-x-2 pt-4 border-t'>
							<Button variant='outline' size='sm'>
								<Settings className='h-4 w-4 mr-2' />
								アライアンス管理
							</Button>
							<Button variant='outline' size='sm'>
								<Link2 className='h-4 w-4 mr-2' />
								新規参加申請
							</Button>
						</div>
					</CardContent>
				</Card>

				<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
					{/* Left Column - Account Status & Settings */}
					<div className='lg:col-span-2 space-y-6'>
						{/* Account Status Overview */}
						<Card>
							<CardHeader>
								<CardTitle className='flex items-center space-x-2'>
									<User className='h-5 w-5' />
									<span>アカウント状態</span>
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='flex items-center justify-between'>
									<span className='text-sm font-medium'>ステータス</span>
									<Badge
										variant='default'
										className='bg-green-100 text-green-800'
									>
										<CheckCircle className='h-3 w-3 mr-1' />
										アクティブ
									</Badge>
								</div>
								<div className='flex items-center justify-between'>
									<span className='text-sm font-medium'>アカウント種別</span>
									<Badge variant='secondary'>プレミアム</Badge>
								</div>
								<div className='flex items-center justify-between'>
									<span className='text-sm font-medium'>連続経過日数</span>
									<span className='text-sm font-bold text-accent'>127日</span>
								</div>
								<div className='flex items-center justify-between'>
									<span className='text-sm font-medium'>最終ログイン</span>
									<span className='text-sm text-muted-foreground'>
										2025年1月23日 14:30
									</span>
								</div>
							</CardContent>
						</Card>

						{/* Account Settings */}
						<Card>
							<CardHeader>
								<CardTitle className='flex items-center space-x-2'>
									<Settings className='h-5 w-5' />
									<span>アカウント設定</span>
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='flex items-center justify-between'>
									<div>
										<p className='text-sm font-medium'>チュートリアル完了</p>
										<p className='text-xs text-muted-foreground'>
											基本機能の説明
										</p>
									</div>
									<Switch checked />
								</div>

								<Separator />

								<div className='flex items-center justify-between'>
									<div>
										<p className='text-sm font-medium'>基本価値観回答</p>
										<p className='text-xs text-muted-foreground'>
											マッチング精度向上
										</p>
									</div>
									<Switch checked />
								</div>

								<Separator />

								<div className='flex items-center justify-between'>
									<div>
										<p className='text-sm font-medium'>広告表示同意</p>
										<p className='text-xs text-muted-foreground'>
											パーソナライズ広告
										</p>
									</div>
									<Switch />
								</div>

								<Separator />

								<div className='space-y-2'>
									<p className='text-sm font-medium'>メニューレベル</p>
									<div className='flex space-x-2'>
										<Button variant='default' size='sm'>
											基本
										</Button>
										<Button variant='outline' size='sm'>
											標準
										</Button>
										<Button variant='outline' size='sm'>
											上級
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Right Column - Warning & OAuth */}
					<div className='space-y-6'>
						{/* Warning & Reset */}
						<Card>
							<CardHeader>
								<CardTitle className='flex items-center space-x-2'>
									<AlertTriangle className='h-5 w-5 text-orange-500' />
									<span>警告・リセット</span>
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='flex justify-between items-center'>
									<span className='text-sm font-medium'>警告回数</span>
									<Badge variant='outline'>0回</Badge>
								</div>

								<div className='flex justify-between items-center'>
									<span className='text-sm font-medium'>リセット実行回数</span>
									<span className='text-sm'>1回</span>
								</div>

								<div className='flex justify-between items-center'>
									<span className='text-sm font-medium'>最終リセット</span>
									<span className='text-xs text-muted-foreground'>
										2024年8月15日
									</span>
								</div>

								<Button variant='destructive' size='sm' className='w-full'>
									<FileText className='h-4 w-4 mr-2' />
									全データリセット
								</Button>
							</CardContent>
						</Card>

						{/* OAuth Connection Status */}
						<Card>
							<CardHeader>
								<CardTitle className='flex items-center space-x-2'>
									<Link2 className='h-5 w-5' />
									<span>OAuth認証状況</span>
								</CardTitle>
								<CardDescription>
									Supabase認証システムで管理されている複数認証の接続状況
								</CardDescription>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='space-y-3'>
									<div className='flex items-center justify-between p-3 border rounded-lg bg-green-50 border-green-200'>
										<div className='flex items-center space-x-3'>
											<div className='w-8 h-8 bg-red-500 rounded flex items-center justify-center'>
												<span className='text-white text-sm font-bold'>G</span>
											</div>
											<div>
												<span className='text-sm font-medium'>Google</span>
												<p className='text-xs text-muted-foreground'>
													tanaka@gmail.com
												</p>
											</div>
										</div>
										<Badge
											variant='default'
											className='bg-green-100 text-green-800'
										>
											<CheckCircle className='h-3 w-3 mr-1' />
											接続済み
										</Badge>
									</div>

									<div className='flex items-center justify-between p-3 border rounded-lg bg-green-50 border-green-200'>
										<div className='flex items-center space-x-3'>
											<div className='w-8 h-8 bg-gray-900 rounded flex items-center justify-center'>
												<span className='text-white text-sm font-bold'>G</span>
											</div>
											<div>
												<span className='text-sm font-medium'>GitHub</span>
												<p className='text-xs text-muted-foreground'>
													田中-dev
												</p>
											</div>
										</div>
										<Badge
											variant='default'
											className='bg-green-100 text-green-800'
										>
											<CheckCircle className='h-3 w-3 mr-1' />
											接続済み
										</Badge>
									</div>

									<div className='flex items-center justify-between p-3 border rounded-lg bg-gray-50'>
										<div className='flex items-center space-x-3'>
											<div className='w-8 h-8 bg-black rounded flex items-center justify-center'>
												<span className='text-white text-sm font-bold'>X</span>
											</div>
											<div>
												<span className='text-sm font-medium'>X (Twitter)</span>
												<p className='text-xs text-muted-foreground'>未接続</p>
											</div>
										</div>
										<Button variant='outline' size='sm'>
											接続する
										</Button>
									</div>
								</div>

								<div className='mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
									<div className='flex items-center space-x-2 mb-2'>
										<Shield className='h-4 w-4 text-blue-600' />
										<span className='text-sm font-medium'>認証統計</span>
									</div>
									<div className='grid grid-cols-2 gap-4 text-center'>
										<div>
											<div className='text-lg font-bold text-blue-600'>2</div>
											<div className='text-xs text-muted-foreground'>
												接続済み
											</div>
										</div>
										<div>
											<div className='text-lg font-bold text-orange-600'>1</div>
											<div className='text-xs text-muted-foreground'>
												未接続
											</div>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>

				{/* Basic Information Management - Lowest Priority */}
				<Card className='mt-8 border border-muted'>
					<CardHeader>
						<CardTitle className='flex items-center space-x-2 text-lg'>
							<User className='h-5 w-5 text-muted-foreground' />
							<span>基本情報管理</span>
							<Badge variant='outline' className='ml-2 text-xs'>
								設定済み
							</Badge>
						</CardTitle>
						<CardDescription>
							母語・使用言語・地域設定の基本情報
						</CardDescription>
					</CardHeader>
					<CardContent className='pt-6'>
						<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
							{/* Language Settings */}
							<div className='space-y-4'>
								<h3 className='font-semibold text-base flex items-center space-x-2'>
									<span>🌐</span>
									<span>言語設定</span>
								</h3>

								<Card className='border-blue-200 bg-blue-50/30'>
									<CardContent className='pt-4'>
										<div className='space-y-4'>
											<div className='flex items-center justify-between'>
												<span className='text-sm font-medium'>母語</span>
												<Badge
													variant='default'
													className='bg-blue-100 text-blue-800'
												>
													日本語
												</Badge>
											</div>

											<div className='space-y-2'>
												<span className='text-sm font-medium'>
													使用可能言語
												</span>
												<div className='flex flex-wrap gap-2'>
													<Badge
														variant='outline'
														className='bg-green-50 border-green-200 text-green-800'
													>
														日本語（ネイティブ）
													</Badge>
													<Badge
														variant='outline'
														className='bg-blue-50 border-blue-200 text-blue-800'
													>
														英語（中級）
													</Badge>
													<Badge
														variant='outline'
														className='bg-orange-50 border-orange-200 text-orange-800'
													>
														中国語（初級）
													</Badge>
												</div>
											</div>

											<Button
												variant='outline'
												size='sm'
												className='w-full bg-transparent'
											>
												<Settings className='h-4 w-4 mr-2' />
												言語設定を編集
											</Button>
										</div>
									</CardContent>
								</Card>
							</div>

							{/* Region Settings */}
							<div className='space-y-4'>
								<h3 className='font-semibold text-base flex items-center space-x-2'>
									<span>🌍</span>
									<span>地球3分割設定</span>
								</h3>

								<Card className='border-green-200 bg-green-50/30'>
									<CardContent className='pt-4'>
										<div className='space-y-4'>
											<div className='flex items-center justify-between'>
												<span className='text-sm'>現在の活動地域</span>
												<Badge
													variant='default'
													className='bg-red-100 text-red-800'
												>
													Area 1 (日付変更線〜+8h)
												</Badge>
											</div>

											<div className='space-y-3'>
												<span className='text-sm font-medium'>地域選択</span>
												<div className='space-y-2'>
													<div className='flex items-center justify-between p-3 bg-red-50 border-2 border-red-300 rounded-lg'>
														<div className='flex items-center space-x-2'>
															<div className='w-4 h-4 bg-red-500 rounded-full'></div>
															<div>
																<span className='text-sm font-medium'>
																	Area 1
																</span>
																<p className='text-xs text-muted-foreground'>
																	日付変更線 〜 +8時間 (120°)
																</p>
															</div>
														</div>
														<Badge
															variant='default'
															className='bg-red-100 text-red-800'
														>
															選択中
														</Badge>
													</div>

													<div className='flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-yellow-50 hover:border-yellow-200 cursor-pointer'>
														<div className='flex items-center space-x-2'>
															<div className='w-4 h-4 bg-yellow-500 rounded-full'></div>
															<div>
																<span className='text-sm font-medium'>
																	Area 2
																</span>
																<p className='text-xs text-muted-foreground'>
																	+8時間 〜 +16時間 (120°)
																</p>
															</div>
														</div>
														<Button variant='outline' size='sm'>
															選択
														</Button>
													</div>

													<div className='flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 cursor-pointer'>
														<div className='flex items-center space-x-2'>
															<div className='w-4 h-4 bg-blue-500 rounded-full'></div>
															<div>
																<span className='text-sm font-medium'>
																	Area 3
																</span>
																<p className='text-xs text-muted-foreground'>
																	+16時間 〜 日付変更線 (120°)
																</p>
															</div>
														</div>
														<Button variant='outline' size='sm'>
															選択
														</Button>
													</div>
												</div>
											</div>

											<Button
												variant='outline'
												size='sm'
												className='w-full bg-transparent'
											>
												<Settings className='h-4 w-4 mr-2' />
												地域設定を変更
											</Button>

											{/* 地球3分割の説明文 */}
											<div className='p-4 bg-blue-50 border border-blue-200 rounded-lg'>
												<h4 className='font-medium text-sm mb-3 flex items-center space-x-2'>
													<span>📍</span>
													<span>地球3分割について</span>
												</h4>
												<p className='text-sm text-muted-foreground mb-3'>
													地球を日付変更線から3つのエリアに分割し、あなたが主に活動する時間帯のエリアを選択してください。
													これにより、同じ時間帯で活動するユーザーとのマッチング精度が向上します。
												</p>
												<div className='text-xs text-muted-foreground space-y-1'>
													<p>
														• <strong>Area 1:</strong>{" "}
														日付変更線から8時間分（120度）
													</p>
													<p>
														• <strong>Area 2:</strong> Area
														1から8時間分（120度）
													</p>
													<p>
														• <strong>Area 3:</strong> Area
														2から8時間分（120度、日付変更線まで）
													</p>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
