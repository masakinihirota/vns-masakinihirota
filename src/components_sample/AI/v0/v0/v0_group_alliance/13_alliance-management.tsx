// それ以上のまとまり機能の使い方
"use client"
import { useState } from "react"
import { Send, UserPlus, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

type Alliance = {
	id: string
	name: string
	members: string[]
}

type Group = {
	id: string
	name: string
	leader: string
}

export default function Component() {
	const [alliances, setAlliances] = useState<Alliance[]>([])
	const [newAllianceName, setNewAllianceName] = useState("")
	const [invitedGroup, setInvitedGroup] = useState("")

	// ダミーデータ: 実際のアプリケーションではAPIから取得します
	const groups: Group[] = [
		{ id: "1", name: "アニメ愛好会", leader: "ユーザー1" },
		{ id: "2", name: "漫画研究会", leader: "ユーザー2" },
		{ id: "3", name: "SF作品ファンクラブ", leader: "ユーザー3" }
	]

	const createAlliance = () => {
		if (newAllianceName.trim()) {
			const newAlliance: Alliance = {
				id: Date.now().toString(),
				name: newAllianceName,
				members: []
			}
			setAlliances([...alliances, newAlliance])
			setNewAllianceName("")
		}
	}

	const inviteGroup = (allianceId: string) => {
		if (invitedGroup) {
			setAlliances(
				alliances.map((alliance) =>
					alliance.id === allianceId
						? { ...alliance, members: [...alliance.members, invitedGroup] }
						: alliance
				)
			)
			setInvitedGroup("")
		}
	}

	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-2xl font-bold mb-4'>それ以上のまとまり管理</h1>

			<Card className='mb-6'>
				<CardHeader>
					<CardTitle>新しいそれ以上のまとまりを作成</CardTitle>
					<CardDescription>
						それ以上のまとまり名を入力して、新しいそれ以上のまとまりを作成します。
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='flex items-center space-x-2'>
						<Input
							value={newAllianceName}
							onChange={(e) => setNewAllianceName(e.target.value)}
							placeholder='それ以上のまとまり名'
						/>
						<Button onClick={createAlliance}>
							<UserPlus className='mr-2 h-4 w-4' />
							作成
						</Button>
					</div>
				</CardContent>
			</Card>

			{alliances.map((alliance) => (
				<Card key={alliance.id} className='mb-4'>
					<CardHeader>
						<CardTitle>{alliance.name}</CardTitle>
						<CardDescription>
							メンバー: {alliance.members.join(", ") || "なし"}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className='flex items-center space-x-2'>
							<select
								className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
								value={invitedGroup}
								onChange={(e) => setInvitedGroup(e.target.value)}
							>
								<option value=''>グループを選択</option>
								{groups.map((group) => (
									<option key={group.id} value={group.name}>
										{group.name}
									</option>
								))}
							</select>
							<Button onClick={() => inviteGroup(alliance.id)}>
								<Send className='mr-2 h-4 w-4' />
								招待
							</Button>
						</div>
					</CardContent>
					<CardFooter>
						<Button variant='outline' className='w-full'>
							<Users className='mr-2 h-4 w-4' />
							メンバー管理
						</Button>
					</CardFooter>
				</Card>
			))}
		</div>
	)
}
