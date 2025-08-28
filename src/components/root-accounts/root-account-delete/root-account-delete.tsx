/**
 * ルートアカウント削除確認ダイアログコンポーネント
 */

import { useState } from "react"

import type { RootAccount } from "@/types/root-account"

export interface RootAccountDeleteProps {
	account: RootAccount
	isOpen: boolean
	onConfirm: (id: string) => Promise<void>
	onCancel: () => void
	isDeleting?: boolean
	error?: string
}

/**
 * ルートアカウント削除確認ダイアログ
 */
export const RootAccountDelete: React.FC<RootAccountDeleteProps> = ({
	account,
	isOpen,
	onConfirm,
	onCancel,
	isDeleting = false,
	error
}) => {
	const [isProcessing, setIsProcessing] = useState(false)

	if (!isOpen) {
		return null
	}

	const handleConfirm = async () => {
		setIsProcessing(true)
		try {
			await onConfirm(account.id)
		} finally {
			setIsProcessing(false)
		}
	}

	const isLoading = isDeleting || isProcessing

	return (
		<div
			className='fixed inset-0 z-50 overflow-y-auto'
			data-testid='delete-dialog-overlay'
		>
			<div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
				<div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />

				<div className='relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6'>
					<div className='sm:flex sm:items-start'>
						<div className='mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10'>
							<svg
								className='h-6 w-6 text-red-600'
								fill='none'
								viewBox='0 0 24 24'
								strokeWidth='1.5'
								stroke='currentColor'
							>
								<title>エラーアイコン</title>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									d='M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z'
								/>
							</svg>
						</div>
						<div className='mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left'>
							<h3 className='text-base font-semibold leading-6 text-gray-900'>
								ルートアカウント削除確認
							</h3>
							<div className='mt-2'>
								<p className='text-sm text-gray-500'>
									以下のルートアカウントを削除します。この操作は取り消せません。
								</p>

								<div className='mt-4 rounded-md bg-gray-50 p-4'>
									<div className='text-sm'>
										<div className='font-medium text-gray-900'>
											ID: {account.id}
										</div>
										<div className='mt-1 text-gray-600'>
											状態:{" "}
											{account.accountStatus === "active"
												? "有効"
												: account.accountStatus === "pending"
													? "保留中"
													: account.accountStatus === "suspended"
														? "一時停止"
														: "削除済み"}
										</div>
										<div className='text-gray-600'>
											作成日: {account.createdAt.toLocaleDateString("ja-JP")}
										</div>
									</div>
								</div>

								{account.isVerified && (
									<div className='mt-4 rounded-md bg-yellow-50 p-3'>
										<div className='flex'>
											<svg
												className='h-5 w-5 text-yellow-400'
												viewBox='0 0 20 20'
												fill='currentColor'
											>
												<title>タイトル</title>
												<path
													fillRule='evenodd'
													d='M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z'
													clipRule='evenodd'
												/>
											</svg>
											<div className='ml-3'>
												<p className='text-sm text-yellow-800'>
													このアカウントは検証済みです。削除には十分注意してください。
												</p>
											</div>
										</div>
									</div>
								)}

								{error && (
									<div className='mt-4 rounded-md bg-red-50 p-3'>
										<div className='flex'>
											<svg
												className='h-5 w-5 text-red-400'
												viewBox='0 0 20 20'
												fill='currentColor'
											>
												<title>タイトル</title>
												<path
													fillRule='evenodd'
													d='M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z'
													clipRule='evenodd'
												/>
											</svg>
											<div className='ml-3'>
												<p className='text-sm text-red-800'>{error}</p>
											</div>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>

					<div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse'>
						<button
							type='button'
							onClick={handleConfirm}
							disabled={isLoading}
							className='inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto'
						>
							{isLoading ? "削除中..." : "削除"}
						</button>
						<button
							type='button'
							onClick={onCancel}
							disabled={isLoading}
							className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed sm:mt-0 sm:w-auto'
						>
							キャンセル
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
