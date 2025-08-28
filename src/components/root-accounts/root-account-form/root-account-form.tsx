/**
 * ルートアカウントフォームコンポーネント
 * Conformを使用した型安全なフォームバリデーション
 */

import { useState } from "react"
import {
	getFormProps,
	getInputProps,
	getSelectProps,
	useForm
} from "@conform-to/react"
import { getZodConstraint, parseWithZod } from "@conform-to/zod"

import {
	type RootAccountFormData,
	rootAccountFormSchema
} from "@/types/root-account"

import type { z } from "zod"

export interface RootAccountFormProps {
	mode: "create" | "edit"
	defaultValues?: RootAccountFormData
	onSubmit?: (data: RootAccountFormData) => Promise<void>
	onCancel?: () => void
	error?: string
}

/**
 * 居住地区分のオプション
 */
const livingAreaOptions = [
	{ value: "area1", label: "エリア1" },
	{ value: "area2", label: "エリア2" },
	{ value: "area3", label: "エリア3" }
] as const

/**
 * アカウント状態のオプション
 */
const accountStatusOptions = [
	{ value: "active", label: "有効" },
	{ value: "pending", label: "保留中" },
	{ value: "suspended", label: "一時停止" },
	{ value: "banned", label: "削除済み" }
] as const

/**
 * ルートアカウントフォームコンポーネント
 */
export const RootAccountForm: React.FC<RootAccountFormProps> = ({
	mode,
	defaultValues,
	onSubmit,
	onCancel,
	error
}) => {
	const [isSubmitting, setIsSubmitting] = useState(false)

	const [form, fields] = useForm({
		id: `root-account-form-${mode}`,
		constraint: getZodConstraint(rootAccountFormSchema as any),
		defaultValue: defaultValues,
		shouldValidate: "onBlur",
		shouldRevalidate: "onInput",
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: rootAccountFormSchema as any })
		},
		async onSubmit(event, { formData }) {
			event.preventDefault()

			const submission = parseWithZod(formData, {
				schema: rootAccountFormSchema as z.ZodSchema<RootAccountFormData>
			})

			if (submission.status === "success" && onSubmit) {
				setIsSubmitting(true)
				try {
					await onSubmit(submission.value as RootAccountFormData)
				} finally {
					setIsSubmitting(false)
				}
			}
		}
	})

	const title =
		mode === "create" ? "新規ルートアカウント作成" : "ルートアカウント編集"
	const submitButtonText =
		mode === "create"
			? isSubmitting
				? "作成中..."
				: "作成"
			: isSubmitting
				? "更新中..."
				: "更新"

	return (
		<div className='max-w-2xl mx-auto p-6 bg-white rounded-lg shadow'>
			<h2 className='text-2xl font-bold mb-6 text-gray-900'>{title}</h2>

			{error && (
				<div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-md'>
					<p className='text-red-600'>{error}</p>
				</div>
			)}

			<form {...getFormProps(form)} noValidate>
				<div className='space-y-6'>
					{/* 検証状態 */}
					<div>
						<div className='flex items-center'>
							<input
								{...getInputProps(fields.isVerified, { type: "checkbox" })}
								className='h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
							/>
							<label
								htmlFor={fields.isVerified.id}
								className='ml-2 text-sm text-gray-900'
							>
								検証済み
							</label>
						</div>
						{fields.isVerified.errors && (
							<div
								id={fields.isVerified.errorId}
								className='mt-1 text-sm text-red-600'
							>
								{fields.isVerified.errors.join(", ")}
							</div>
						)}
					</div>

					{/* 母語コード */}
					<div>
						<label
							htmlFor='motherTongueCode'
							className='block text-sm font-medium text-gray-700'
						>
							母語コード
						</label>
						<input
							{...getInputProps(fields.motherTongueCode, { type: "text" })}
							className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
						/>
						{fields.motherTongueCode.errors && (
							<div
								id={fields.motherTongueCode.errorId}
								className='mt-1 text-sm text-red-600'
							>
								{fields.motherTongueCode.errors.join(", ")}
							</div>
						)}
					</div>

					{/* サイト言語コード */}
					<div>
						<label
							htmlFor='siteLanguageCode'
							className='block text-sm font-medium text-gray-700'
						>
							サイト言語コード
						</label>
						<input
							{...getInputProps(fields.siteLanguageCode, { type: "text" })}
							className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
						/>
						{fields.siteLanguageCode.errors && (
							<div
								id={fields.siteLanguageCode.errorId}
								className='mt-1 text-sm text-red-600'
							>
								{fields.siteLanguageCode.errors.join(", ")}
							</div>
						)}
					</div>

					{/* 生年世代 */}
					<div>
						<label
							htmlFor='birthGeneration'
							className='block text-sm font-medium text-gray-700'
						>
							生年世代
						</label>
						<input
							{...getInputProps(fields.birthGeneration, { type: "text" })}
							className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
						/>
						{fields.birthGeneration.errors && (
							<div
								id={fields.birthGeneration.errorId}
								className='mt-1 text-sm text-red-600'
							>
								{fields.birthGeneration.errors.join(", ")}
							</div>
						)}
					</div>

					{/* 居住地区分 */}
					<div>
						<label
							htmlFor='livingAreaSegment'
							className='block text-sm font-medium text-gray-700'
						>
							居住地区分
						</label>
						<select
							{...getSelectProps(fields.livingAreaSegment)}
							className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
						>
							{livingAreaOptions.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>
						{fields.livingAreaSegment.errors && (
							<div
								id={fields.livingAreaSegment.errorId}
								className='mt-1 text-sm text-red-600'
							>
								{fields.livingAreaSegment.errors.join(", ")}
							</div>
						)}
					</div>

					{/* 最大ポイント */}
					<div>
						<label
							htmlFor='maxPoints'
							className='block text-sm font-medium text-gray-700'
						>
							最大ポイント
						</label>
						<input
							{...getInputProps(fields.maxPoints, { type: "number", min: "1" })}
							className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
						/>
						{fields.maxPoints.errors && (
							<div
								id={fields.maxPoints.errorId}
								className='mt-1 text-sm text-red-600'
							>
								{fields.maxPoints.errors
									?.map((error) => {
										if (error === "Expected number, received string")
											return "最大ポイントは必須です"
										if (
											error.includes(
												"Number must be greater than or equal to 1"
											)
										)
											return "最大ポイントは1以上である必要があります"
										return error
									})
									.join(", ")}
							</div>
						)}
					</div>

					{/* アカウント状態 */}
					<div>
						<label
							htmlFor='accountStatus'
							className='block text-sm font-medium text-gray-700'
						>
							アカウント状態
						</label>
						<select
							{...getSelectProps(fields.accountStatus)}
							className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
						>
							{accountStatusOptions.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>
						{fields.accountStatus.errors && (
							<div
								id={fields.accountStatus.errorId}
								className='mt-1 text-sm text-red-600'
							>
								{fields.accountStatus.errors.join(", ")}
							</div>
						)}
					</div>
				</div>

				{/* ボタン */}
				<div className='mt-8 flex justify-end space-x-4'>
					<button
						type='button'
						onClick={onCancel}
						className='px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
					>
						キャンセル
					</button>
					<button
						type='submit'
						disabled={isSubmitting}
						className='px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
					>
						{submitButtonText}
					</button>
				</div>
			</form>
		</div>
	)
}
