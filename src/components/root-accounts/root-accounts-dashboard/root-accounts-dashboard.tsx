"use client"

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

import type React from "react"

/**
 * RootAccountsDashboard
 * v0 デザインサンプルを基にしたルートアカウントHOME UI の静的コンポーネント。
 * まだデータ取得/状態管理は未実装で将来的に Server Components + fetch / actions に分離予定。
 */
export const RootAccountsDashboard: React.FC = () => {
	return (
		<div className='min-h-screen bg-background'>
			<header className='border-b bg-card'>
				<div className='container px-6 py-4 mx-auto'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center space-x-4'>
							<div className='flex items-center justify-center w-8 h-8 rounded-lg bg-primary'>
								<span className='text-sm font-bold text-primary-foreground'>
									VNS
								</span>
							</div>
							<div>
								<h1 className='text-xl font-bold text-foreground'>
									ルートアカウント管理
								</h1>
								<p className='text-sm text-muted-foreground'>
									Virtual Network Service
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
			<div className='container px-6 py-8 mx-auto space-y-8'>
				{/* プロフィールリスト */}
				<UserProfilesSection />
				{/* 新規プロフィール作成 */}
				<NewProfileSection />
				{/* グループ機能 */}
				<GroupsSection />
				{/* それ以上のまとまり機能 */}
				<AlliancesSection />
				{/* アカウント状態/設定・警告/OAuth */}
				<AccountStatusAndSettings />
				{/* 基本情報 */}
				<BasicInformationSection />
			</div>
		</div>
	)
}

/* ---------- Sub Sections (暫定的に同ファイル。将来分割可能) ---------- */

const UserProfilesSection: React.FC = () => (
	<Card className='border-2 shadow-lg border-accent/20'>
		<CardHeader className='bg-gradient-to-r from-accent/5 to-primary/5'>
			<CardTitle className='text-xl'>
				<Users className='inline w-6 h-6 mr-2 text-accent' />
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
				{/* Active profiles (一部だけ保持) */}
				<ProfileRow
					bg='bg-blue-50'
					border='border-blue-300'
					title='田中太郎（ビジネス）'
					tagBg='bg-blue-100 text-blue-800'
					tag='仕事用'
					status='アクティブ'
				/>
				<ProfileRow
					bg='bg-purple-50'
					border='border-purple-300'
					title='T.Tanaka（学習者）'
					tagBg='bg-purple-100 text-purple-800'
					tag='学習用'
					status='アクティブ'
				/>
				<ProfileRow
					bg='bg-pink-50'
					border='border-pink-300'
					title='田中太郎（真剣交際）'
					tagBg='bg-pink-100 text-pink-800'
					tag='婚活用'
					status='アクティブ'
					extraBadge
				/>
				{/* Inactive */}
				<div className='flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg'>
					<div className='flex items-center space-x-3'>
						<Avatar className='w-10 h-10'>
							<AvatarFallback>趣味</AvatarFallback>
						</Avatar>
						<div>
							<div className='flex items-center space-x-2'>
								<span className='text-sm font-medium'>
									たなか（アニメ好き）
								</span>
								<Badge
									variant='outline'
									className='text-xs text-green-800 bg-green-100'
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
			<div className='flex pt-3 space-x-2 border-t'>
				<Button variant='outline' size='sm'>
					<Settings className='w-4 h-4 mr-2' />
					一括管理
				</Button>
				<Button variant='outline' size='sm'>
					<Shield className='w-4 h-4 mr-2' />
					公開設定
				</Button>
			</div>
		</CardContent>
	</Card>
)

interface ProfileRowProps {
	bg: string
	border: string
	title: string
	tagBg: string
	tag: string
	status: string
	extraBadge?: boolean
}
const ProfileRow: React.FC<ProfileRowProps> = ({
	bg,
	border,
	title,
	tagBg,
	tag,
	status,
	extraBadge
}) => (
	<div
		className={`flex items-center justify-between p-4 ${bg} border-2 ${border} rounded-lg`}
	>
		<div className='flex items-center space-x-3'>
			<Avatar className='w-10 h-10'>
				<AvatarImage src='/diverse-user-avatars.png' />
				<AvatarFallback>田中</AvatarFallback>
			</Avatar>
			<div>
				<div className='flex items-center space-x-2'>
					<span className='text-sm font-medium'>{title}</span>
					<Badge variant='outline' className={`text-xs ${tagBg}`}>
						{tag}
					</Badge>
					{extraBadge && (
						<Badge
							variant='secondary'
							className='text-xs text-orange-800 bg-orange-100'
						>
							1つまで
						</Badge>
					)}
				</div>
				<p className='text-xs text-muted-foreground'>公開中</p>
			</div>
		</div>
		<div className='flex items-center space-x-2'>
			<Badge variant='default' className='text-green-800 bg-green-100'>
				<CheckCircle className='w-3 h-3 mr-1' />
				{status}
			</Badge>
			<Button variant='outline' size='sm'>
				編集
			</Button>
		</div>
	</div>
)

const NewProfileSection: React.FC = () => (
	<Card className='border-2 border-green-200 shadow-md'>
		<CardHeader className='bg-gradient-to-r from-green-50 to-emerald-50'>
			<CardTitle className='flex items-center space-x-2 text-xl'>
				<span className='text-green-600'>+</span>
				<span>新規ユーザープロフィール作成</span>
			</CardTitle>
			<CardDescription className='text-base'>
				目的を選択して新しいユーザープロフィールを作成します
			</CardDescription>
		</CardHeader>
		<CardContent className='pt-6 space-y-6'>
			{/* 目的選択・タイトル入力など UI 静的保持 */}
			<div className='grid grid-cols-2 gap-3 md:grid-cols-3'>
				{[
					"基本用",
					"仕事用",
					"就職用",
					"遊び用",
					"推し活",
					"私から見た他人用"
				].map((label, i) => (
					<Button
						key={label}
						variant='outline'
						size='sm'
						className='flex items-center justify-start h-auto p-3 space-x-3 bg-white border-2'
					>
						{" "}
						<span className='text-lg'>
							{["⚪", "💼", "🎯", "🎮", "🌟", "👁️"][i]}
						</span>
						<span className='text-sm font-medium'>{label}</span>
					</Button>
				))}
				<Button
					disabled
					variant='outline'
					size='sm'
					className='flex items-center justify-start h-auto p-3 space-x-3 bg-gray-100 border-2 opacity-50 cursor-not-allowed'
				>
					<span className='text-lg'>💕</span>
					<div className='flex flex-col items-start'>
						<span className='text-sm font-medium'>婚活用</span>
						<span className='text-xs text-red-600'>作成済み</span>
					</div>
				</Button>
			</div>
			<div className='space-y-3'>
				<h4 className='text-sm font-medium'>プロフィールタイトル</h4>
				<div className='flex items-center space-x-2'>
					<input
						type='text'
						placeholder='カスタムタイトル (任意)'
						className='flex-1 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2'
					/>
					<Button variant='outline' size='sm'>
						適用
					</Button>
				</div>
			</div>
			<div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
				<Button
					variant='outline'
					size='sm'
					className='flex items-center justify-start h-auto p-4 space-x-3'
				>
					<User className='w-5 h-5 text-green-600' />
					<span className='text-sm font-medium'>新規作成</span>
				</Button>
				<Button
					variant='outline'
					size='sm'
					className='flex items-center justify-start h-auto p-4 space-x-3'
				>
					<span className='text-lg'>📋</span>
					<span className='text-sm font-medium'>既存をコピー</span>
				</Button>
			</div>
			<Button className='w-full bg-green-500 hover:bg-green-600'>
				<User className='w-4 h-4 mr-2' />
				新しいユーザープロフィールを作成
			</Button>
		</CardContent>
	</Card>
)

const GroupsSection: React.FC = () => (
	<Card>
		<CardHeader>
			<CardTitle className='flex items-center space-x-2'>
				<Users className='w-5 h-5 text-blue-600' />
				<span>グループ機能</span>
			</CardTitle>
			<CardDescription>
				参加・管理しているグループの一覧と活動状況
			</CardDescription>
		</CardHeader>
		<CardContent className='space-y-4'>
			{/* 簡略化で静的表示 */}
			<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
				<div className='space-y-2'>
					<h4 className='flex items-center space-x-2 font-medium'>
						<span>👑</span>
						<span>管理中のグループ</span>
					</h4>
					<GroupRow
						icon='🏢'
						name='IT勉強会グループ'
						count='45'
						color='yellow'
					/>
					<GroupRow
						icon='🎮'
						name='ゲーム開発コミュニティ'
						count='32'
						color='yellow'
					/>
				</div>
				<div className='space-y-2'>
					<h4 className='flex items-center space-x-2 font-medium'>
						<span>👥</span>
						<span>参加中のグループ</span>
					</h4>
					<GroupRow icon='🎵' name='音楽制作サークル' count='18' color='blue' />
					<GroupRow icon='📚' name='読書クラブ' count='24' color='blue' />
				</div>
			</div>
			<div className='flex pt-4 space-x-2 border-t'>
				<Button variant='outline' size='sm'>
					<Users className='w-4 h-4 mr-2' />
					グループ管理
				</Button>
				<Button variant='outline' size='sm'>
					<span className='mr-2'>+</span>新規グループ作成
				</Button>
			</div>
		</CardContent>
	</Card>
)

interface GroupRowProps {
	icon: string
	name: string
	count: string
	color: "yellow" | "blue"
}
const GroupRow: React.FC<GroupRowProps> = ({ icon, name, count, color }) => (
	<div
		className={`flex items-center justify-between p-3 bg-${color}-50 border border-${color}-200 rounded-lg`}
	>
		{" "}
		{/* tailwind v4 JIT で動的クラス注意: 必要なら safelist */}
		<div className='flex items-center space-x-2'>
			<span>{icon}</span>
			<span className='text-sm font-medium'>{name}</span>
		</div>
		<Badge variant='outline' className={`bg-${color}-100 text-${color}-800`}>
			{count}人
		</Badge>
	</div>
)

const AlliancesSection: React.FC = () => (
	<Card>
		<CardHeader>
			<CardTitle className='flex items-center space-x-2'>
				<span className='text-purple-600'>🤝</span>
				<span>それ以上のまとまり機能</span>
			</CardTitle>
			<CardDescription>
				参加・管理しているそれ以上のまとまりの状況と権限
			</CardDescription>
		</CardHeader>
		<CardContent className='space-y-4'>
			<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
				<div className='space-y-3'>
					<h4 className='flex items-center space-x-2 font-medium'>
						<span>⚡</span>
						<span>リーダー権限あり</span>
					</h4>
					<div className='p-3 border border-purple-200 rounded-lg bg-purple-50'>
						<div className='flex items-center justify-between mb-2'>
							<span className='text-sm font-medium'>
								テックイノベーション連合
							</span>
							<Badge
								variant='outline'
								className='text-purple-800 bg-purple-100'
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
					<h4 className='flex items-center space-x-2 font-medium'>
						<span>🎨</span>
						<span>メンバー参加</span>
					</h4>
					<div className='p-3 border border-green-200 rounded-lg bg-green-50'>
						<div className='flex items-center justify-between mb-2'>
							<span className='text-sm font-medium'>クリエイター協会</span>
							<Badge variant='outline' className='text-green-800 bg-green-100'>
								メンバー
							</Badge>
						</div>
						<p className='text-xs text-muted-foreground'>
							デザイナー・アーティストの交流と支援
						</p>
					</div>
				</div>
			</div>
			<div className='flex pt-4 space-x-2 border-t'>
				<Button variant='outline' size='sm'>
					<Settings className='w-4 h-4 mr-2' />
					それ以上のまとまり管理
				</Button>
				<Button variant='outline' size='sm'>
					<Link2 className='w-4 h-4 mr-2' />
					新規参加申請
				</Button>
			</div>
		</CardContent>
	</Card>
)

const AccountStatusAndSettings: React.FC = () => (
	<div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
		<div className='space-y-6 lg:col-span-2'>
			<Card>
				<CardHeader>
					<CardTitle className='flex items-center space-x-2'>
						<User className='w-5 h-5' />
						<span>アカウント状態</span>
					</CardTitle>
				</CardHeader>
				<CardContent className='space-y-4'>
					<StatusRow
						label='ステータス'
						value={
							<Badge variant='default' className='text-green-800 bg-green-100'>
								<CheckCircle className='w-3 h-3 mr-1' />
								アクティブ
							</Badge>
						}
					/>
					<StatusRow
						label='アカウント種別'
						value={<Badge variant='secondary'>プレミアム</Badge>}
					/>
					<StatusRow
						label='信頼継続日数'
						value={<span className='text-sm font-bold text-accent'>127日</span>}
					/>
					<StatusRow
						label='最終ログイン'
						value={
							<span className='text-sm text-muted-foreground'>
								2025年1月23日 14:30
							</span>
						}
					/>
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle className='flex items-center space-x-2'>
						<Settings className='w-5 h-5' />
						<span>アカウント設定</span>
					</CardTitle>
				</CardHeader>
				<CardContent className='space-y-4'>
					<ToggleRow
						title='チュートリアル完了'
						subtitle='基本機能の説明'
						defaultChecked
					/>
					<Separator />
					<ToggleRow
						title='基本価値観回答'
						subtitle='マッチング精度向上'
						defaultChecked
					/>
					<Separator />
					<ToggleRow title='広告表示同意' subtitle='パーソナライズ広告' />
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
		<div className='space-y-6'>
			<Card>
				<CardHeader>
					<CardTitle className='flex items-center space-x-2'>
						<AlertTriangle className='w-5 h-5 text-orange-500' />
						<span>警告・リセット</span>
					</CardTitle>
				</CardHeader>
				<CardContent className='space-y-4'>
					<StatusRow
						label='警告回数'
						value={<Badge variant='outline'>0回</Badge>}
					/>
					<StatusRow
						label='リセット実行回数'
						value={<span className='text-sm'>1回</span>}
					/>
					<StatusRow
						label='最終リセット'
						value={
							<span className='text-xs text-muted-foreground'>
								2024年8月15日
							</span>
						}
					/>
					<Button variant='destructive' size='sm' className='w-full'>
						<FileText className='w-4 h-4 mr-2' />
						全データリセット
					</Button>
				</CardContent>
			</Card>
			<OAuthSection />
		</div>
	</div>
)

interface StatusRowProps {
	label: string
	value: React.ReactNode
}
const StatusRow: React.FC<StatusRowProps> = ({ label, value }) => (
	<div className='flex items-center justify-between'>
		<span className='text-sm font-medium'>{label}</span>
		{value}
	</div>
)

interface ToggleRowProps {
	title: string
	subtitle: string
	defaultChecked?: boolean
}
const ToggleRow: React.FC<ToggleRowProps> = ({
	title,
	subtitle,
	defaultChecked
}) => (
	<div className='flex items-center justify-between'>
		<div>
			<p className='text-sm font-medium'>{title}</p>
			<p className='text-xs text-muted-foreground'>{subtitle}</p>
		</div>
		<Switch defaultChecked={defaultChecked} />
	</div>
)

const OAuthSection: React.FC = () => (
	<Card>
		<CardHeader>
			<CardTitle className='flex items-center space-x-2'>
				<Link2 className='w-5 h-5' />
				<span>OAuth認証状況</span>
			</CardTitle>
			<CardDescription>
				Supabase認証システムで管理されている複数認証の接続状況
			</CardDescription>
		</CardHeader>
		<CardContent className='space-y-4'>
			<div className='space-y-3'>
				<OAuthRow
					provider='Google'
					iconBg='bg-red-500'
					identifier='tanaka@gmail.com'
				/>
				<OAuthRow
					provider='GitHub'
					iconBg='bg-gray-900'
					identifier='tanaka-dev'
				/>
				<div className='flex items-center justify-between p-3 border rounded-lg bg-gray-50'>
					<div className='flex items-center space-x-3'>
						<div className='flex items-center justify-center w-8 h-8 bg-black rounded'>
							<span className='text-sm font-bold text-white'>X</span>
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
			<div className='p-4 mt-4 border border-blue-200 rounded-lg bg-blue-50'>
				<div className='flex items-center mb-2 space-x-2'>
					<Shield className='w-4 h-4 text-blue-600' />
					<span className='text-sm font-medium'>認証統計</span>
				</div>
				<div className='grid grid-cols-2 gap-4 text-center'>
					<div>
						<div className='text-lg font-bold text-blue-600'>2</div>
						<div className='text-xs text-muted-foreground'>接続済み</div>
					</div>
					<div>
						<div className='text-lg font-bold text-orange-600'>1</div>
						<div className='text-xs text-muted-foreground'>未接続</div>
					</div>
				</div>
			</div>
		</CardContent>
	</Card>
)

interface OAuthRowProps {
	provider: string
	iconBg: string
	identifier: string
}
const OAuthRow: React.FC<OAuthRowProps> = ({
	provider,
	iconBg,
	identifier
}) => (
	<div className='flex items-center justify-between p-3 border border-green-200 rounded-lg bg-green-50'>
		<div className='flex items-center space-x-3'>
			<div
				className={`w-8 h-8 ${iconBg} rounded flex items-center justify-center`}
			>
				<span className='text-sm font-bold text-white'>{provider[0]}</span>
			</div>
			<div>
				<span className='text-sm font-medium'>{provider}</span>
				<p className='text-xs text-muted-foreground'>{identifier}</p>
			</div>
		</div>
		<Badge variant='default' className='text-green-800 bg-green-100'>
			<CheckCircle className='w-3 h-3 mr-1' />
			接続済み
		</Badge>
	</div>
)

const BasicInformationSection: React.FC = () => (
	<Card className='border border-muted'>
		<CardHeader>
			<CardTitle className='flex items-center space-x-2 text-lg'>
				<User className='w-5 h-5 text-muted-foreground' />
				<span>基本情報管理</span>
				<Badge variant='outline' className='ml-2 text-xs'>
					設定済み
				</Badge>
			</CardTitle>
			<CardDescription>母語・使用言語・地域設定の基本情報</CardDescription>
		</CardHeader>
		<CardContent className='pt-6'>
			<div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
				<div className='space-y-4'>
					<h3 className='flex items-center space-x-2 text-base font-semibold'>
						<span>🌐</span>
						<span>言語設定</span>
					</h3>
					<Card className='border-blue-200 bg-blue-50/30'>
						<CardContent className='pt-4 space-y-4'>
							<StatusRow
								label='母語'
								value={
									<Badge
										variant='default'
										className='text-blue-800 bg-blue-100'
									>
										日本語
									</Badge>
								}
							/>
							<div className='space-y-2'>
								<span className='text-sm font-medium'>使用可能言語</span>
								<div className='flex flex-wrap gap-2'>
									<Badge
										variant='outline'
										className='text-green-800 border-green-200 bg-green-50'
									>
										日本語（ネイティブ）
									</Badge>
									<Badge
										variant='outline'
										className='text-blue-800 border-blue-200 bg-blue-50'
									>
										英語（中級）
									</Badge>
									<Badge
										variant='outline'
										className='text-orange-800 border-orange-200 bg-orange-50'
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
								<Settings className='w-4 h-4 mr-2' />
								言語設定を編集
							</Button>
						</CardContent>
					</Card>
				</div>
				<div className='space-y-4'>
					<h3 className='flex items-center space-x-2 text-base font-semibold'>
						<span>🌍</span>
						<span>地球3分割設定</span>
					</h3>
					<Card className='border-green-200 bg-green-50/30'>
						<CardContent className='pt-4 space-y-4'>
							<StatusRow
								label='現在の活動地域'
								value={
									<Badge variant='default' className='text-red-800 bg-red-100'>
										Area 1 (日付変更線〜+8h)
									</Badge>
								}
							/>
							<div className='space-y-2'>
								<span className='text-sm font-medium'>地域選択</span>
								<div className='space-y-2'>
									<RegionRow
										selected
										label='Area 1'
										desc='日付変更線 〜 +8時間 (120°)'
										color='red'
									/>
									<RegionRow
										label='Area 2'
										desc='+8時間 〜 +16時間 (120°)'
										color='yellow'
									/>
									<RegionRow
										label='Area 3'
										desc='+16時間 〜 日付変更線 (120°)'
										color='blue'
									/>
								</div>
							</div>
							<Button
								variant='outline'
								size='sm'
								className='w-full bg-transparent'
							>
								<Settings className='w-4 h-4 mr-2' />
								地域設定を変更
							</Button>
							<div className='p-4 space-y-2 text-xs border border-blue-200 rounded-lg bg-blue-50 text-muted-foreground'>
								<h4 className='flex items-center space-x-2 text-sm font-medium'>
									<span>📍</span>
									<span>地球3分割について</span>
								</h4>
								<p className='text-sm'>
									地球を日付変更線から3つのエリアに分割し活動時間帯でマッチング精度を最適化します。
								</p>
								<p>• Area 1: 日付変更線から8時間分 (120度)</p>
								<p>• Area 2: Area 1 から 8時間分 (120度)</p>
								<p>• Area 3: Area 2 から 8時間分 (120度, 日付変更線まで)</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</CardContent>
	</Card>
)

interface RegionRowProps {
	selected?: boolean
	label: string
	desc: string
	color: string
}
const RegionRow: React.FC<RegionRowProps> = ({
	selected,
	label,
	desc,
	color
}) => (
	<div
		className={`flex items-center justify-between p-3 ${selected ? `bg-${color}-50 border-2 border-${color}-300` : "bg-gray-50 border border-gray-200 hover:bg-yellow-50 hover:border-yellow-200 cursor-pointer"} rounded-lg`}
	>
		<div className='flex items-center space-x-2'>
			<div className={`w-4 h-4 bg-${color}-500 rounded-full`}></div>
			<div>
				<span className='text-sm font-medium'>{label}</span>
				<p className='text-xs text-muted-foreground'>{desc}</p>
			</div>
		</div>
		{selected ? (
			<Badge variant='default' className={`bg-${color}-100 text-${color}-800`}>
				選択中
			</Badge>
		) : (
			<Button variant='outline' size='sm'>
				選択
			</Button>
		)}
	</div>
)

export default RootAccountsDashboard
