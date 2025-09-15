// システム管理メニュー
import { AlertTriangle, Database, History, Shield, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function AdminDashboard() {
	return (
		<div className='min-h-screen bg-gray-100 p-8'>
			<Card className='w-full max-w-4xl mx-auto'>
				<CardHeader>
					<CardTitle className='text-2xl font-bold'>管理画面</CardTitle>
					<CardDescription>
						システム管理のための各種機能にアクセスできます
					</CardDescription>
				</CardHeader>
				<CardContent>
					<ScrollArea className='h-[400px] w-full rounded-md border p-4'>
						<div className='grid gap-4 md:grid-cols-2'>
							<AdminMenuItem
								icon={<Database className='h-6 w-6' />}
								title='データ入力管理'
								description='システムデータの入力と管理'
								href='/admin/data-input'
							/>
							<AdminMenuItem
								icon={<Users className='h-6 w-6' />}
								title='ユーザー管理'
								description='ユーザーアカウントの管理'
								href='/admin/user-management'
							/>
							<AdminMenuItem
								icon={<Shield className='h-6 w-6' />}
								title='権限管理'
								description='ユーザー権限の設定と管理'
								href='/admin/permissions'
							/>
							<AdminMenuItem
								icon={<History className='h-6 w-6' />}
								title='ユーザー履歴'
								description='ユーザーアクティビティの履歴'
								href='/admin/user-history'
							/>
							<AdminMenuItem
								icon={<AlertTriangle className='h-6 w-6' />}
								title='問題報告管理'
								description='ユーザーからの問題報告の管理'
								href='/admin/issue-reports'
							/>
						</div>
					</ScrollArea>
				</CardContent>
			</Card>
		</div>
	)
}

interface AdminMenuItemProps {
	icon: React.ReactNode
	title: string
	description: string
	href: string
}

function AdminMenuItem({ icon, title, description, href }: AdminMenuItemProps) {
	return (
		<Card>
			<CardHeader className='flex flex-row items-center gap-4'>
				{icon}
				<div>
					<CardTitle>{title}</CardTitle>
					<CardDescription>{description}</CardDescription>
				</div>
			</CardHeader>
			<CardContent>
				<Button asChild className='w-full'>
					<a href={href}>アクセス</a>
				</Button>
			</CardContent>
		</Card>
	)
}
