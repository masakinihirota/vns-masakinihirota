/**
 * ルートアカウント関連のServer Actions
 */

"use server"

import { parseWithZod } from "@conform-to/zod"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { v4 as uuidv4 } from "uuid"

import { rootAccounts } from "../../../drizzle/schema/root_accounts/root_accounts"

import { db } from "@/lib/db"
import {
	type RootAccountActionResult,
	rootAccountFormSchema,
	type UpdateRootAccountData
} from "@/types/root-account"

/**
 * 全ルートアカウントを取得
 */
export async function getAllRootAccounts(): Promise<RootAccountActionResult> {
	try {
		const accounts = await db.select().from(rootAccounts)

		return {
			success: true,
			data: accounts
		}
	} catch (error) {
		console.error("Failed to fetch root accounts:", error)
		return {
			success: false,
			error: "ルートアカウントの取得に失敗しました"
		}
	}
}

/**
 * 特定のルートアカウントを取得
 */
export async function getRootAccountById(
	id: string
): Promise<RootAccountActionResult> {
	try {
		const account = await db
			.select()
			.from(rootAccounts)
			.where(eq(rootAccounts.id, id))
			.limit(1)

		if (account.length === 0) {
			return {
				success: false,
				error: "指定されたルートアカウントが見つかりません"
			}
		}

		return {
			success: true,
			data: account[0]
		}
	} catch (error) {
		console.error("Failed to fetch root account:", error)
		return {
			success: false,
			error: "ルートアカウントの取得に失敗しました"
		}
	}
}

/**
 * 新しいルートアカウントを作成
 */
export async function createRootAccount(
	_prevState: unknown,
	formData: FormData
): Promise<RootAccountActionResult> {
	// フォームデータを解析・バリデーション
	const submission = parseWithZod(formData, {
		schema: rootAccountFormSchema
	})

	if (submission.status !== "success") {
		return {
			success: false,
			error: "フォームデータが無効です"
		}
	}

	try {
		// authUserIdは別途設定する必要があるため、ダミー値を使用
		// 実際の実装では認証システムから取得
		const newAccountData = {
			id: uuidv4(), // UUIDを生成
			authUserId: "dummy-auth-user-id", // TODO: 実際の認証ユーザーIDを設定
			isVerified: submission.value.isVerified,
			motherTongueCode: submission.value.motherTongueCode || null,
			siteLanguageCode: submission.value.siteLanguageCode || null,
			birthGeneration: submission.value.birthGeneration || null,
			totalPoints: 0, // 初期値
			livingAreaSegment: submission.value.livingAreaSegment,
			warningCount: 0, // 初期値
			lastWarningAt: null,
			isAnonymousInitialAuth: false, // 初期値
			invitedAt: null,
			confirmedAt: null,
			maxPoints: submission.value.maxPoints,
			lastPointRecoveryAt: null,
			totalConsumedPoints: 0, // 初期値
			activityPoints: 0, // 初期値
			clickPoints: 0, // 初期値
			consecutiveDays: 0, // 初期値
			trustScore: 0, // 初期値
			oauthProviders: [], // 初期値
			oauthCount: 0, // 初期値
			accountStatus: submission.value.accountStatus
		}

		const [createdAccount] = await db
			.insert(rootAccounts)
			.values(newAccountData)
			.returning()

		revalidatePath("/root-accounts")

		return {
			success: true,
			data: createdAccount,
			message: "ルートアカウントが正常に作成されました"
		}
	} catch (error) {
		console.error("Failed to create root account:", error)
		return {
			success: false,
			error: "ルートアカウントの作成に失敗しました"
		}
	}
}

/**
 * ルートアカウントを更新
 */
export async function updateRootAccount(
	id: string,
	_prevState: unknown,
	formData: FormData
): Promise<RootAccountActionResult> {
	// フォームデータを解析・バリデーション
	const submission = parseWithZod(formData, {
		schema: rootAccountFormSchema
	})

	if (submission.status !== "success") {
		return {
			success: false,
			error: "フォームデータが無効です"
		}
	}

	try {
		// 更新データを準備
		const updateData: UpdateRootAccountData = {
			isVerified: submission.value.isVerified,
			motherTongueCode: submission.value.motherTongueCode || null,
			siteLanguageCode: submission.value.siteLanguageCode || null,
			birthGeneration: submission.value.birthGeneration || null,
			livingAreaSegment: submission.value.livingAreaSegment,
			maxPoints: submission.value.maxPoints,
			accountStatus: submission.value.accountStatus
		}

		const [updatedAccount] = await db
			.update(rootAccounts)
			.set(updateData)
			.where(eq(rootAccounts.id, id))
			.returning()

		if (!updatedAccount) {
			return {
				success: false,
				error: "指定されたルートアカウントが見つかりません"
			}
		}

		revalidatePath("/root-accounts")
		revalidatePath(`/root-accounts/${id}`)

		return {
			success: true,
			data: updatedAccount,
			message: "ルートアカウントが正常に更新されました"
		}
	} catch (error) {
		console.error("Failed to update root account:", error)
		return {
			success: false,
			error: "ルートアカウントの更新に失敗しました"
		}
	}
}

/**
 * ルートアカウントを削除
 */
export async function deleteRootAccount(
	id: string
): Promise<RootAccountActionResult> {
	try {
		// ソフトデリート（deleted_atを設定）
		const [deletedAccount] = await db
			.update(rootAccounts)
			.set({
				deletedAt: new Date(),
				accountStatus: "banned" as const // 'banned'でソフトデリートを表現
			})
			.where(eq(rootAccounts.id, id))
			.returning()

		if (!deletedAccount) {
			return {
				success: false,
				error: "指定されたルートアカウントが見つかりません"
			}
		}

		revalidatePath("/root-accounts")

		return {
			success: true,
			data: deletedAccount,
			message: "ルートアカウントが正常に削除されました"
		}
	} catch (error) {
		console.error("Failed to delete root account:", error)
		return {
			success: false,
			error: "ルートアカウントの削除に失敗しました"
		}
	}
}

/**
 * ルートアカウントを完全削除（物理削除）
 * 注意: 通常は使用せず、管理者のみが実行する想定
 */
export async function hardDeleteRootAccount(
	id: string
): Promise<RootAccountActionResult> {
	try {
		const [deletedAccount] = await db
			.delete(rootAccounts)
			.where(eq(rootAccounts.id, id))
			.returning()

		if (!deletedAccount) {
			return {
				success: false,
				error: "指定されたルートアカウントが見つかりません"
			}
		}

		revalidatePath("/root-accounts")

		return {
			success: true,
			data: deletedAccount,
			message: "ルートアカウントが完全に削除されました"
		}
	} catch (error) {
		console.error("Failed to hard delete root account:", error)
		return {
			success: false,
			error: "ルートアカウントの完全削除に失敗しました"
		}
	}
}
