/**
 * ルートアカウント詳細表示コンポーネント
 */

import type { RootAccountDetail as RootAccountDetailType } from "../../../types/root-account"

export interface RootAccountDetailProps {
	account: RootAccountDetailType
	onEdit?: (id: string) => void
	onDelete?: (id: string) => void
	onBack?: () => void
}

/**
 * アカウント状態を日本語ラベルに変換
 */
function getAccountStatusLabel(
	status: RootAccountDetailType["accountStatus"]
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
function formatDate(date: Date | null | undefined): string {
	if (!date) return "未設定"
	return new Intl.DateTimeFormat("ja-JP", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit"
	}).format(date)
}

/**
 * null/undefined値を適切に表示
 */
function displayValue(value: string | null | undefined): string {
	return value ?? "未設定"
}

/**
 * OAuth プロバイダー配列を表示用文字列に変換
 */
function formatOAuthProviders(providers: string[]): string {
	return providers.length > 0 ? providers.join(", ") : "未設定"
}

/**
 * 詳細項目コンポーネント
 */
const DetailItem: React.FC<{
	label: string
	value: string | number
	className?: string
}> = ({ label, value, className }) => (
	<div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
		<dt className='text-sm font-medium text-gray-500'>{label}</dt>
		<dd
			className={`mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 ${className}`}
		>
			{value}
		</dd>
	</div>
)

/**
 * ルートアカウント詳細コンポーネント
 */
export const RootAccountDetail: React.FC<RootAccountDetailProps> = ({
	account,
	onEdit,
	onDelete,
	onBack
}) => {
	return (
		<div className='bg-white overflow-hidden shadow rounded-lg'>
			<div className='px-4 py-5 sm:px-6 flex justify-between items-center'>
				<div>
					<h3 className='text-lg leading-6 font-medium text-gray-900'>
						ルートアカウント詳細
					</h3>
					<p className='mt-1 max-w-2xl text-sm text-gray-500'>
						アカウント情報と設定の詳細
					</p>
				</div>
				<div className='space-x-2'>
					{onBack && (
						<button
							type='button'
							onClick={onBack}
							className='bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded'
						>
							戻る
						</button>
					)}
					<button
						type='button'
						onClick={() => onEdit?.(account.id)}
						className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
					>
						編集
					</button>
					<button
						type='button'
						onClick={() => onDelete?.(account.id)}
						className='bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
					>
						削除
					</button>
				</div>
			</div>

			<div className='border-t border-gray-200'>
				<dl>
					<DetailItem label='ID:' value={account.id} />

					<DetailItem label='認証ユーザーID:' value={account.authUserId} />

					<DetailItem
						label='検証状態:'
						value={getVerifiedLabel(account.isVerified)}
						className={
							account.isVerified ? "text-green-600" : "text-yellow-600"
						}
					/>

					<DetailItem
						label='母語コード:'
						value={displayValue(account.motherTongueCode)}
					/>

					<DetailItem
						label='サイト言語コード:'
						value={displayValue(account.siteLanguageCode)}
					/>

					<DetailItem
						label='生年世代:'
						value={displayValue(account.birthGeneration)}
					/>

					<DetailItem label='居住地区分:' value={account.livingAreaSegment} />

					<DetailItem
						label='総ポイント:'
						value={formatNumber(account.totalPoints)}
					/>

					<DetailItem
						label='最大ポイント:'
						value={formatNumber(account.maxPoints)}
					/>

					<DetailItem
						label='消費ポイント総計:'
						value={formatNumber(account.totalConsumedPoints)}
					/>

					<DetailItem
						label='アクティビティポイント:'
						value={formatNumber(account.activityPoints)}
					/>

					<DetailItem
						label='クリックポイント:'
						value={formatNumber(account.clickPoints)}
					/>

					<DetailItem label='連続日数:' value={account.consecutiveDays} />

					<DetailItem label='信頼度スコア:' value={account.trustScore} />

					<DetailItem
						label='警告回数:'
						value={account.warningCount}
						className={account.warningCount > 0 ? "text-red-600" : undefined}
					/>

					<DetailItem
						label='最終警告日時:'
						value={formatDate(account.lastWarningAt)}
					/>

					<DetailItem label='OAuth認証数:' value={account.oauthCount} />

					<DetailItem
						label='OAuth プロバイダー:'
						value={formatOAuthProviders(account.oauthProviders)}
					/>

					<DetailItem
						label='アカウント状態:'
						value={getAccountStatusLabel(account.accountStatus)}
						className={
							account.accountStatus === "active"
								? "text-green-600"
								: account.accountStatus === "suspended"
									? "text-red-600"
									: "text-yellow-600"
						}
					/>

					<DetailItem
						label='匿名初回認証:'
						value={account.isAnonymousInitialAuth ? "はい" : "いいえ"}
					/>

					<DetailItem label='招待日時:' value={formatDate(account.invitedAt)} />

					<DetailItem
						label='確認日時:'
						value={formatDate(account.confirmedAt)}
					/>

					<DetailItem
						label='最終ポイント回復日時:'
						value={formatDate(account.lastPointRecoveryAt)}
					/>

					<DetailItem label='作成日時:' value={formatDate(account.createdAt)} />

					<DetailItem label='更新日時:' value={formatDate(account.updatedAt)} />

					{account.deletedAt && (
						<DetailItem
							label='削除日時:'
							value={formatDate(account.deletedAt)}
							className='text-red-600'
						/>
					)}
				</dl>
			</div>
		</div>
	)
}
