// User Management Screen
'use client'
import { useState } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Work = {
	id: string
	title: string
	tier: number
	type: string
}

type UserProfile = {
	name: string
	works: Work[]
}

export default function Component() {
	const [activeTab, setActiveTab] = useState("root")

	const rootAccount = {
		name: "ルートアカウント",
		uuid: "abc123-def456-ghi789",
		points: 1000,
		count: 50,
		createdAt: "2023-01-01",
		updatedAt: "2023-10-22"
	}

	const userProfiles: UserProfile[] = [
		{
			name: "マイリスト",
			works: [
				{ id: "1", title: "進撃の巨人 1期", tier: 1, type: "anime" },
				{ id: "2", title: "進撃の巨人 2期", tier: 1, type: "anime" },
				{ id: "21", title: "進撃の巨人", tier: 1, type: "manga" }
			]
		},
		{
			name: "ユーザー",
			works: [
				{ id: "2", title: "進撃の巨人 2期", tier: 1, type: "anime" },
				{ id: "3", title: "進撃の巨人 3期", tier: 1, type: "anime" },
				{ id: "21", title: "進撃の巨人", tier: 1, type: "manga" }
			]
		}
	]

	return (
		<Card className='w-full max-w-4xl'>
			<CardHeader>
				<CardTitle>ユーザー管理画面</CardTitle>
			</CardHeader>
			<CardContent>
				<Tabs value={activeTab} onValueChange={setActiveTab}>
					<TabsList>
						<TabsTrigger value='root'>ルートアカウント</TabsTrigger>
						<TabsTrigger value='profile'>ユーザープロフィール</TabsTrigger>
						<TabsTrigger value='list'>リスト</TabsTrigger>
					</TabsList>
					<TabsContent value='root'>
						<Table>
							<TableBody>
								<TableRow>
									<TableCell className='font-medium'>名前</TableCell>
									<TableCell>{rootAccount.name}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell className='font-medium'>UUID</TableCell>
									<TableCell>{rootAccount.uuid}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell className='font-medium'>個人のポイント</TableCell>
									<TableCell>{rootAccount.points}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell className='font-medium'>個人のカウント</TableCell>
									<TableCell>{rootAccount.count}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell className='font-medium'>新規作成日</TableCell>
									<TableCell>{rootAccount.createdAt}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell className='font-medium'>最終更新日時</TableCell>
									<TableCell>{rootAccount.updatedAt}</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</TabsContent>
					<TabsContent value='profile'>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>プロフィール名</TableHead>
									<TableHead>作品数</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{userProfiles.map((profile, index) => (
									<TableRow key={index}>
										<TableCell>{profile.name}</TableCell>
										<TableCell>{profile.works.length}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TabsContent>
					<TabsContent value='list'>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>タイトル</TableHead>
									<TableHead>ティア</TableHead>
									<TableHead>タイプ</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{userProfiles[0].works.map((work) => (
									<TableRow key={work.id}>
										<TableCell>{work.title}</TableCell>
										<TableCell>{work.tier}</TableCell>
										<TableCell>{work.type}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	)
}
