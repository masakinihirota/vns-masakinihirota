// Mind Map Category List
"use client"
import * as React from "react"
import { ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger
} from "@/components/ui/collapsible"

type TreeNode = {
	name: string
	children?: TreeNode[]
}

const data: TreeNode[] = [
	{
		name: "趣味活動",
		children: [
			{
				name: "視聴、見る、読む、聞く活動",
				children: [
					{ name: "漫画" },
					{ name: "アニメ" },
					{ name: "ゲーム" },
					{ name: "ドラマ" },
					{ name: "エンタメ" },
					{ name: "映画" },
					{ name: "小説" },
					{ name: "音楽" }
				]
			},
			{
				name: "作る活動",
				children: [
					{ name: "同人活動に参加している" },
					{ name: "同人誌を作っている" },
					{ name: "アプリを開発している" },
					{ name: "ゲーム開発" }
				]
			}
		]
	},
	{
		name: "ワークライフバランス",
		children: [
			{
				name: "生活、ライフスタイル",
				children: [
					{
						name: "生き方",
						children: [
							{ name: "ミニマリスト" },
							{ name: "マテリアリスト" },
							{ name: "シンプルライフ" },
							{ name: "華やかな生活" }
						]
					},
					{ name: "家事" },
					{ name: "健康" },
					{ name: "家族" },
					{ name: "社会" },
					{ name: "自立" },
					{ name: "宗教" }
				]
			},
			{ name: "お金" },
			{ name: "時間管理" },
			{ name: "仕事" },
			{ name: "スキル" },
			{ name: "ビジョン" },
			{ name: "老後" }
		]
	},
	{
		name: "パートナー",
		children: [
			{ name: "婚活" },
			{
				name: "恋人",
				children: [
					{ name: "恋愛対象" },
					{ name: "恋愛観" },
					{ name: "人生観" },
					{ name: "付き合い方" },
					{ name: "相手に望むもの" }
				]
			}
		]
	},
	{
		name: "他人",
		children: [
			{ name: "事件" },
			{ name: "災害" },
			{ name: "戦争" },
			{ name: "尊敬" }
		]
	}
]

function TreeNode({ node }: { node: TreeNode }) {
	const [isOpen, setIsOpen] = React.useState(false)

	return (
		<Collapsible open={isOpen} onOpenChange={setIsOpen}>
			<div className='flex items-center space-x-2'>
				{node.children && (
					<CollapsibleTrigger asChild>
						<Button variant='ghost' size='sm' className='w-6 h-6 p-0'>
							<ChevronRight
								className={`h-4 w-4 transition-transform ${
									isOpen ? "rotate-90" : ""
								}`}
							/>
							<span className='sr-only'>Toggle</span>
						</Button>
					</CollapsibleTrigger>
				)}
				<span className='text-sm'>{node.name}</span>
			</div>
			{node.children && (
				<CollapsibleContent className='ml-4 mt-1 border-l pl-4'>
					{node.children.map((child, index) => (
						<TreeNode key={index} node={child} />
					))}
				</CollapsibleContent>
			)}
		</Collapsible>
	)
}

export default function Component() {
	return (
		<div className='w-full max-w-md p-4 rounded-lg shadow'>
			<h2 className='text-2xl font-bold mb-4'>価値観のカテゴリー</h2>
			{data.map((node, index) => (
				<TreeNode key={index} node={node} />
			))}
		</div>
	)
}
