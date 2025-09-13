import { useState } from "react"
import { Check, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/ui/table"

type Role =
	| "管理人"
	| "リーダー"
	| "サブリーダー"
	| "メンバー"
	| "アライアンスリーダー"
	| "アライアンスサブリーダー"
	| "アライアンスメンバー"

type Permission = {
	name: string
	description: string
}

type RolePermissions = {
	[key in Role]: boolean
}

const roles: Role[] = [
	"管理人",
	"リーダー",
	"サブリーダー",
	"メンバー",
	"アライアンスリーダー",
	"アライアンスサブリーダー",
	"アライアンスメンバー"
]

const permissions: Permission[] = [
	{ name: "ユーザー管理", description: "ユーザーの追加、編集、削除" },
	{ name: "グループ作成", description: "新しいグループの作成" },
	{ name: "コンテンツ編集", description: "サイトコンテンツの編集" },
	{ name: "アライアンス管理", description: "アライアンスの作成と管理" }
]

export default function PermissionManagement() {
	const [permissionState, setPermissionState] = useState<{
		[key: string]: RolePermissions
	}>({})

	const togglePermission = (permission: string, role: Role) => {
		setPermissionState((prevState) => ({
			...prevState,
			[permission]: {
				...prevState[permission],
				[role]: !prevState[permission]?.[role]
			}
		}))
	}

	return (
		<div className='container mx-auto py-10'>
			<h1 className='text-2xl font-bold mb-5'>権限管理</h1>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className='w-[200px]'>権限</TableHead>
						<TableHead className='w-[300px]'>説明</TableHead>
						{roles.map((role) => (
							<TableHead key={role} className='text-center'>
								{role}
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{permissions.map((permission) => (
						<TableRow key={permission.name}>
							<TableCell className='font-medium'>{permission.name}</TableCell>
							<TableCell>{permission.description}</TableCell>
							{roles.map((role) => (
								<TableCell key={role} className='text-center'>
									<Switch
										checked={permissionState[permission.name]?.[role] || false}
										onCheckedChange={() =>
											togglePermission(permission.name, role)
										}
									/>
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
			<div className='mt-5 flex justify-end'>
				<Button className='mr-2'>
					<Check className='mr-2 h-4 w-4' /> 保存
				</Button>
				<Button variant='outline'>
					<X className='mr-2 h-4 w-4' /> キャンセル
				</Button>
			</div>
		</div>
	)
}
