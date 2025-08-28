/**
 * ルートアカウント一覧表示コンポーネント
 * テストの要件を満たす最小限の実装
 */

import type { RootAccountListItem } from "../../../types/root-account"

export interface RootAccountListProps {
	accounts: RootAccountListItem[]
	onView?: (id: string) => void
	onEdit?: (id: string) => void
	onDelete?: (id: string) => void
}

/**
 * アカウント状態を日本語ラベルに変換
 */
function getAccountStatusLabel(
	status: RootAccountListItem["accountStatus"]
): string {
	switch (status) {
		case "active":
			return "有効"
		case "pending":
			return "保留中"
		case "suspended":
			return "一時停止"
		case "banned":
			return "削除済み"
		default:
			return "不明"
	}
}

/**
 * 検証状態を日本語ラベルに変換
 */
function getVerifiedLabel(isVerified: boolean): string {
	return isVerified ? "検証済み" : "未検証"
}

/**
 * 数値を千の位区切りでフォーマット
 */
function formatNumber(num: number): string {
	return new Intl.NumberFormat("ja-JP").format(num)
}

/**
 * 日付をフォーマット
 */
function formatDate(date: Date): string {
	return new Intl.DateTimeFormat("ja-JP", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit"
	}).format(date)
}

/**
 * ルートアカウント一覧コンポーネント
 */
export const RootAccountList: React.FC<RootAccountListProps> = ({
	accounts,
	onView,
	onEdit,
	onDelete
}) => {
	if (accounts.length === 0) {
		return (
			<div className='text-center py-8'>
				<p className='text-gray-500'>ルートアカウントが見つかりません</p>
			</div>
		)
	}

	return (
		<div className='overflow-x-auto'>
			<table className='min-w-full bg-white border border-gray-200'>
				<thead className='bg-gray-50'>
					<tr>
						<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							ID
						</th>
						<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							認証ユーザーID
						</th>
						<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							検証状態
						</th>
						<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							総ポイント
						</th>
						<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							アカウント状態
						</th>
						<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							作成日時
						</th>
						<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							操作
						</th>
					</tr>
				</thead>
				<tbody className='bg-white divide-y divide-gray-200'>
					{accounts.map((account) => (
						<tr key={account.id} className='hover:bg-gray-50'>
							<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
								{account.id}
							</td>
							<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
								{account.authUserId}
							</td>
							<td className='px-6 py-4 whitespace-nowrap'>
								<span
									className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
										account.isVerified
											? "bg-green-100 text-green-800"
											: "bg-yellow-100 text-yellow-800"
									}`}
								>
									{getVerifiedLabel(account.isVerified)}
								</span>
							</td>
							<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
								{formatNumber(account.totalPoints)}
							</td>
							<td className='px-6 py-4 whitespace-nowrap'>
								<span
									className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
										account.accountStatus === "active"
											? "bg-green-100 text-green-800"
											: account.accountStatus === "pending"
												? "bg-yellow-100 text-yellow-800"
												: account.accountStatus === "suspended"
													? "bg-red-100 text-red-800"
													: "bg-gray-100 text-gray-800"
									}`}
								>
									{getAccountStatusLabel(account.accountStatus)}
								</span>
							</td>
							<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
								{formatDate(account.createdAt)}
							</td>
							<td className='px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2'>
								<button
									type='button'
									onClick={() => onView?.(account.id)}
									className='text-blue-600 hover:text-blue-900'
								>
									詳細
								</button>
								<button
									type='button'
									onClick={() => onEdit?.(account.id)}
									className='text-green-600 hover:text-green-900'
								>
									編集
								</button>
								<button
									type='button'
									onClick={() => onDelete?.(account.id)}
									className='text-red-600 hover:text-red-900'
								>
									削除
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}
