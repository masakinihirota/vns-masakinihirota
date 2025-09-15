// 手動グループ作成画面
"use client"

import { useState } from "react"
import { PlusCircle, Search, UserPlus } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"

interface User {
	id: number;
	name: string;
	avatar: string;
}

export default function Component() {
	const [groupName, setGroupName] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const [groupMembers, setGroupMembers] = useState<User[]>([]);

	const dummyUsers: User[] = [
		{ id: 1, name: "田中太郎", avatar: "/placeholder.svg?height=40&width=40" },
		{ id: 2, name: "佐藤花子", avatar: "/placeholder.svg?height=40&width=40" },
		{ id: 3, name: "鈴木一郎", avatar: "/placeholder.svg?height=40&width=40" }
	];

	const handleAddMember = (user: User): void => {
		setGroupMembers([...groupMembers, user]);
	}

	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-2xl font-bold mb-4'>手動グループ作成</h1>
			<div className='grid gap-4 md:grid-cols-2'>
				<Card>
					<CardHeader>
						<CardTitle>新しいグループ</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='space-y-4'>
							<div>
								<Label htmlFor='group-name'>グループ名</Label>
								<Input
									id='group-name'
									value={groupName}
									onChange={(e) => setGroupName(e.target.value)}
									placeholder='グループ名を入力'
								/>
							</div>
							<div>
								<Label htmlFor='search-users'>ユーザー検索</Label>
								<div className='flex space-x-2'>
									<Input
										id='search-users'
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										placeholder='ユーザー名で検索'
									/>
									<Button size='icon'>
										<Search className='h-4 w-4' />
									</Button>
								</div>
							</div>
							<ScrollArea className='h-[200px] border rounded-md p-2'>
								{dummyUsers.map((user) => (
									<div
										key={user.id}
										className='flex items-center justify-between py-2'
									>
										<div className='flex items-center space-x-2'>
											<Avatar>
												<AvatarImage src={user.avatar} alt={user.name} />
												<AvatarFallback>{user.name[0]}</AvatarFallback>
											</Avatar>
											<span>{user.name}</span>
										</div>
										<Button
											size='sm'
											variant='outline'
											onClick={() => handleAddMember(user)}
										>
											<UserPlus className='h-4 w-4 mr-1' />
											追加
										</Button>
									</div>
								))}
							</ScrollArea>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>グループメンバー</CardTitle>
					</CardHeader>
					<CardContent>
						<ScrollArea className='h-[300px]'>
							{groupMembers.map((member) => (
								<div
									key={member.id}
									className='flex items-center space-x-2 py-2'
								>
									<Avatar>
										<AvatarImage src={member.avatar} alt={member.name} />
										<AvatarFallback>{member.name[0]}</AvatarFallback>
									</Avatar>
									<span>{member.name}</span>
								</div>
							))}
						</ScrollArea>
					</CardContent>
				</Card>
			</div>
			<div className='mt-4'>
				<Button>
					<PlusCircle className='h-4 w-4 mr-2' />
					グループを作成
				</Button>
			</div>
		</div>
	)
}
