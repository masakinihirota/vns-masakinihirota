import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger
} from "@/components/ui/collapsible"

type MenuItem = {
	id: string
	label: string
	isAdvanced: boolean
	isUnlocked: boolean
}

const initialMenuItems: MenuItem[] = [
	{
		id: "matching",
		label: "マッチング＆比較",
		isAdvanced: false,
		isUnlocked: true
	},
	{
		id: "rootAccount",
		label: "ルートアカウント",
		isAdvanced: false,
		isUnlocked: true
	},
	{
		id: "userProfile",
		label: "ユーザープロフィールの作成",
		isAdvanced: false,
		isUnlocked: true
	},
	{ id: "worksList", label: "作品リスト", isAdvanced: false, isUnlocked: true },
	{
		id: "valuesList",
		label: "価値観リスト",
		isAdvanced: false,
		isUnlocked: true
	},
	{
		id: "autoGroup",
		label: "自動グループ",
		isAdvanced: true,
		isUnlocked: false
	},
	{
		id: "manualGroup",
		label: "手動グループ",
		isAdvanced: true,
		isUnlocked: false
	},
	{
		id: "alliance",
		label: "アライアンス",
		isAdvanced: true,
		isUnlocked: false
	},
	{ id: "registration", label: "登録", isAdvanced: true, isUnlocked: false },
	{
		id: "categoryDisplay",
		label: "カテゴリ別作品表示",
		isAdvanced: true,
		isUnlocked: false
	},
	{
		id: "tagListDisplay",
		label: "タグ＆リスト別作品表示",
		isAdvanced: true,
		isUnlocked: false
	}
]

export default function Component() {
	const [menuItems, setMenuItems] = useState(initialMenuItems)
	const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)

	const unlockAdvancedItems = () => {
		setMenuItems((items) =>
			items.map((item) =>
				item.isAdvanced ? { ...item, isUnlocked: true } : item
			)
		)
	}

	return (
		<div className='w-64 bg-background text-foreground p-4 rounded-lg shadow-md'>
			<h2 className='text-2xl font-bold mb-4'>メニュー</h2>
			<ul className='space-y-2'>
				{menuItems.map(
					(item) =>
						!item.isAdvanced && (
							<li key={item.id}>
								<Button variant='ghost' className='w-full justify-start'>
									{item.label}
								</Button>
							</li>
						)
				)}
			</ul>

			<Collapsible
				open={isAdvancedOpen}
				onOpenChange={setIsAdvancedOpen}
				className='mt-4'
			>
				<CollapsibleTrigger asChild>
					<Button variant='outline' className='w-full justify-between'>
						アドバンスメニュー
						{isAdvancedOpen ? (
							<ChevronDown className='h-4 w-4' />
						) : (
							<ChevronRight className='h-4 w-4' />
						)}
					</Button>
				</CollapsibleTrigger>
				<CollapsibleContent className='mt-2'>
					<ul className='space-y-2'>
						{menuItems.map(
							(item) =>
								item.isAdvanced && (
									<li key={item.id}>
										<Button
											variant='ghost'
											className='w-full justify-start'
											disabled={!item.isUnlocked}
										>
											{item.label}
										</Button>
									</li>
								)
						)}
					</ul>
					{!menuItems.every((item) => item.isUnlocked) && (
						<Button onClick={unlockAdvancedItems} className='w-full mt-2'>
							アドバンスメニューを開放
						</Button>
					)}
				</CollapsibleContent>
			</Collapsible>
		</div>
	)
}
