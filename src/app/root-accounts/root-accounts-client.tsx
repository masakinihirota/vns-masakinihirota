"use client"

/**
 * ルートアカウント管理ページ - クライアントコンポーネント
 * 状態管理とユーザーインタラクションを担当
 */

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"

import {
	type CrudResult,
	createRootAccount,
	deleteRootAccount,
	getAllRootAccounts,
	type RootAccount,
	RootAccountDelete,
	RootAccountDetail,
	RootAccountForm,
	type RootAccountFormData,
	RootAccountList,
	updateRootAccount
} from "@/components/root-accounts"

import type { RootAccountListItem } from "@/types/root-account"

interface RootAccountsPageClientProps {
	initialAccounts: CrudResult<RootAccount[]>
}

type ViewMode = "list" | "detail" | "create" | "edit" | "delete"

/**
 * RootAccountをRootAccountListItemに変換
 */
function toListItem(account: RootAccount): RootAccountListItem {
	return {
		id: account.id,
		authUserId: account.authUserId,
		isVerified: account.isVerified,
		totalPoints: account.totalPoints,
		accountStatus: account.accountStatus,
		createdAt: account.createdAt,
		updatedAt: account.updatedAt
	}
}

export function RootAccountsPageClient({
	initialAccounts
}: RootAccountsPageClientProps) {
	const router = useRouter()

	// 状態管理
	const [accounts, setAccounts] = useState<RootAccount[]>(
		initialAccounts.success ? initialAccounts.data || [] : []
	)
	const [selectedAccount, setSelectedAccount] = useState<RootAccount | null>(
		null
	)
	const [viewMode, setViewMode] = useState<ViewMode>("list")
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	// アカウントリストの再読み込み
	const refreshAccounts = useCallback(async () => {
		setIsLoading(true)
		try {
			const result = await getAllRootAccounts()
			if (result.success && result.data) {
				// データが配列であることを確認
				const accountsArray = Array.isArray(result.data)
					? result.data
					: [result.data]
				setAccounts(accountsArray)
				setError(null)
			} else {
				setError(result.error || "アカウント一覧の取得に失敗しました")
			}
		} catch (err) {
			setError("予期しないエラーが発生しました")
		} finally {
			setIsLoading(false)
		}
	}, [])

	// ビューモードの変更
	const handleViewChange = useCallback(
		(mode: ViewMode, account?: RootAccount) => {
			setViewMode(mode)
			setSelectedAccount(account || null)
			setError(null)
		},
		[]
	)

	// 新規作成処理
	const handleCreate = useCallback(
		async (data: RootAccountFormData) => {
			setIsLoading(true)
			try {
				// FormDataオブジェクトを作成
				const formData = new FormData()
				formData.append("isVerified", data.isVerified.toString())
				if (data.motherTongueCode)
					formData.append("motherTongueCode", data.motherTongueCode)
				if (data.siteLanguageCode)
					formData.append("siteLanguageCode", data.siteLanguageCode)
				if (data.birthGeneration)
					formData.append("birthGeneration", data.birthGeneration)
				formData.append("livingAreaSegment", data.livingAreaSegment)
				formData.append("maxPoints", data.maxPoints.toString())
				formData.append("accountStatus", data.accountStatus)

				const result = await createRootAccount(null, formData)
				if (result.success) {
					await refreshAccounts()
					setViewMode("list")
					setError(null)
				} else {
					setError(result.error || "作成に失敗しました")
				}
			} catch (err) {
				setError("予期しないエラーが発生しました")
			} finally {
				setIsLoading(false)
			}
		},
		[refreshAccounts]
	)

	// 更新処理
	const handleUpdate = useCallback(
		async (data: RootAccountFormData) => {
			if (!selectedAccount) return

			setIsLoading(true)
			try {
				// FormDataオブジェクトを作成
				const formData = new FormData()
				formData.append("isVerified", data.isVerified.toString())
				if (data.motherTongueCode)
					formData.append("motherTongueCode", data.motherTongueCode)
				if (data.siteLanguageCode)
					formData.append("siteLanguageCode", data.siteLanguageCode)
				if (data.birthGeneration)
					formData.append("birthGeneration", data.birthGeneration)
				formData.append("livingAreaSegment", data.livingAreaSegment)
				formData.append("maxPoints", data.maxPoints.toString())
				formData.append("accountStatus", data.accountStatus)

				const result = await updateRootAccount(
					selectedAccount.id,
					null,
					formData
				)
				if (result.success) {
					await refreshAccounts()
					setViewMode("detail")
					setError(null)
				} else {
					setError(result.error || "更新に失敗しました")
				}
			} catch (err) {
				setError("予期しないエラーが発生しました")
			} finally {
				setIsLoading(false)
			}
		},
		[selectedAccount, refreshAccounts]
	)

	// 削除処理
	const handleDelete = useCallback(
		async (id: string) => {
			setIsLoading(true)
			try {
				const result = await deleteRootAccount(id)
				if (result.success) {
					await refreshAccounts()
					setViewMode("list")
					setSelectedAccount(null)
					setError(null)
				} else {
					setError(result.error || "削除に失敗しました")
				}
			} catch (err) {
				setError("予期しないエラーが発生しました")
			} finally {
				setIsLoading(false)
			}
		},
		[refreshAccounts]
	)

	// 初期読み込みエラーの表示
	if (!initialAccounts.success) {
		return (
			<div className='rounded-md bg-red-50 p-4'>
				<div className='flex'>
					<svg
						className='h-5 w-5 text-red-400'
						viewBox='0 0 20 20'
						fill='currentColor'
					>
						<title>エラーアイコン</title>
						<path
							fillRule='evenodd'
							d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z'
							clipRule='evenodd'
						/>
					</svg>
					<div className='ml-3'>
						<h3 className='text-sm font-medium text-red-800'>
							データの読み込みに失敗しました
						</h3>
						<div className='mt-2 text-sm text-red-700'>
							<p>{initialAccounts.error || "予期しないエラーが発生しました"}</p>
						</div>
						<div className='mt-4'>
							<button
								type='button'
								onClick={() => router.refresh()}
								className='text-sm font-medium text-red-800 hover:text-red-600'
							>
								再読み込み →
							</button>
						</div>
					</div>
				</div>
			</div>
		)
	}

	// ビューモードに応じたコンテンツを表示
	return (
		<div className='space-y-6'>
			{/* ナビゲーションバー */}
			<div className='bg-white shadow rounded-lg'>
				<div className='px-4 py-5 sm:p-6'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center space-x-4'>
							{viewMode !== "list" && (
								<button
									type='button'
									onClick={() => handleViewChange("list")}
									className='inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700'
								>
									← 一覧に戻る
								</button>
							)}
							<span className='text-sm text-gray-500'>
								{viewMode === "list" && `${accounts.length}件のアカウント`}
								{viewMode === "detail" && "詳細表示"}
								{viewMode === "create" && "新規作成"}
								{viewMode === "edit" && "編集"}
								{viewMode === "delete" && "削除確認"}
							</span>
						</div>

						{viewMode === "list" && (
							<div className='flex items-center space-x-3'>
								<button
									type='button'
									onClick={refreshAccounts}
									disabled={isLoading}
									className='inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50'
								>
									{isLoading ? "読み込み中..." : "更新"}
								</button>
								<button
									type='button'
									onClick={() => handleViewChange("create")}
									className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
								>
									新規作成
								</button>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* エラー表示 */}
			{error && (
				<div className='rounded-md bg-red-50 p-4'>
					<div className='flex'>
						<svg
							className='h-5 w-5 text-red-400'
							viewBox='0 0 20 20'
							fill='currentColor'
						>
							<title>エラーアイコン</title>
							<path
								fillRule='evenodd'
								d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z'
								clipRule='evenodd'
							/>
						</svg>
						<div className='ml-3'>
							<h3 className='text-sm font-medium text-red-800'>
								エラーが発生しました
							</h3>
							<div className='mt-2 text-sm text-red-700'>
								<p>{error}</p>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* メインコンテンツエリア */}
			<div className='bg-white shadow rounded-lg'>
				{viewMode === "list" && (
					<RootAccountList
						accounts={accounts.map(toListItem)}
						onView={(id: string) => {
							const account = accounts.find((acc) => acc.id === id)
							if (account) handleViewChange("detail", account)
						}}
						onEdit={(id: string) => {
							const account = accounts.find((acc) => acc.id === id)
							if (account) handleViewChange("edit", account)
						}}
						onDelete={(id: string) => {
							const account = accounts.find((acc) => acc.id === id)
							if (account) handleViewChange("delete", account)
						}}
					/>
				)}

				{viewMode === "detail" && selectedAccount && (
					<RootAccountDetail
						account={selectedAccount}
						onEdit={() => handleViewChange("edit", selectedAccount)}
						onDelete={() => handleViewChange("delete", selectedAccount)}
						onBack={() => handleViewChange("list")}
					/>
				)}

				{viewMode === "create" && (
					<RootAccountForm
						mode='create'
						onSubmit={handleCreate}
						onCancel={() => handleViewChange("list")}
						error={error || undefined}
					/>
				)}

				{viewMode === "edit" && selectedAccount && (
					<RootAccountForm
						mode='edit'
						defaultValues={{
							isVerified: selectedAccount.isVerified,
							motherTongueCode: selectedAccount.motherTongueCode || undefined,
							siteLanguageCode: selectedAccount.siteLanguageCode || undefined,
							birthGeneration: selectedAccount.birthGeneration || undefined,
							livingAreaSegment: selectedAccount.livingAreaSegment,
							maxPoints: selectedAccount.maxPoints,
							accountStatus: selectedAccount.accountStatus
						}}
						onSubmit={handleUpdate}
						onCancel={() => handleViewChange("detail", selectedAccount)}
						error={error || undefined}
					/>
				)}
			</div>

			{/* 削除確認ダイアログ */}
			{viewMode === "delete" && selectedAccount && (
				<RootAccountDelete
					account={selectedAccount}
					isOpen={true}
					onConfirm={handleDelete}
					onCancel={() => handleViewChange("detail", selectedAccount)}
					isDeleting={isLoading}
					error={error || undefined}
				/>
			)}
		</div>
	)
}
