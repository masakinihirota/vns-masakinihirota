/**
 * ルートアカウント管理ページ
 * CRUD機能を統合したメインページ
 */

import { Suspense } from "react"

import { RootAccountsPageClient } from "./root-accounts-client"

import { getAllRootAccounts } from "@/components/root-accounts/root-account.actions"

import type { CrudResult, RootAccount } from "@/types/root-account"

/**
 * ルートアカウント管理ページ（Server Component）
 */
export default async function RootAccountsPage() {
	const accountsResult = await getAllRootAccounts()

	return (
		<div className='min-h-screen bg-gray-50'>
			<div className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
				{/* ページヘッダー */}
				<div className='px-4 py-6 sm:px-0'>
					<div className='border-b border-gray-200 pb-5'>
						<h1 className='text-3xl font-bold leading-6 text-gray-900'>
							ルートアカウント管理
						</h1>
						<p className='mt-2 max-w-4xl text-sm text-gray-500'>
							システム内のルートアカウントを管理します。新規作成、編集、削除が可能です。
						</p>
					</div>
				</div>

				{/* メインコンテンツ */}
				<div className='px-4 sm:px-0'>
					<Suspense
						fallback={
							<div className='flex items-center justify-center min-h-64'>
								<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
							</div>
						}
					>
						<RootAccountsPageClient
							initialAccounts={accountsResult as CrudResult<RootAccount[]>}
						/>
					</Suspense>
				</div>
			</div>
		</div>
	)
}
