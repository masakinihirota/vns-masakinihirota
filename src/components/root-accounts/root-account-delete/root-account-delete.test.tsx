import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import "@testing-library/jest-dom"

import { RootAccountDelete } from "./root-account-delete"

import type { RootAccount } from "@/types/root-account"

describe("RootAccountDelete", () => {
	const mockAccount: RootAccount = {
		id: "123e4567-e89b-12d3-a456-426614174000",
		authUserId: "auth_123",
		isVerified: true,
		motherTongueCode: "ja",
		siteLanguageCode: "ja",
		birthGeneration: "1990s",
		livingAreaSegment: "area1",
		totalPoints: 100,
		warningCount: 0,
		isAnonymousInitialAuth: false,
		maxPoints: 200,
		totalConsumedPoints: 50,
		activityPoints: 75,
		clickPoints: 25,
		consecutiveDays: 10,
		trustScore: 85.5,
		oauthProviders: ["google"],
		oauthCount: 1,
		accountStatus: "active",
		createdAt: new Date("2024-01-01T00:00:00Z"),
		updatedAt: new Date("2024-01-15T10:30:00Z")
	}

	it("削除確認ダイアログが正しく表示される", () => {
		const mockOnConfirm = vi.fn()
		const mockOnCancel = vi.fn()

		render(
			<RootAccountDelete
				account={mockAccount}
				isOpen={true}
				onConfirm={mockOnConfirm}
				onCancel={mockOnCancel}
			/>
		)

		expect(screen.getByText("ルートアカウント削除確認")).toBeInTheDocument()
		expect(
			screen.getByText(/以下のルートアカウントを削除します/)
		).toBeInTheDocument()
		expect(
			screen.getByText("ID: 123e4567-e89b-12d3-a456-426614174000")
		).toBeInTheDocument()
		expect(screen.getByText("削除")).toBeInTheDocument()
		expect(screen.getByText("キャンセル")).toBeInTheDocument()
	})

	it("isOpenがfalseの場合、ダイアログが表示されない", () => {
		const mockOnConfirm = vi.fn()
		const mockOnCancel = vi.fn()

		render(
			<RootAccountDelete
				account={mockAccount}
				isOpen={false}
				onConfirm={mockOnConfirm}
				onCancel={mockOnCancel}
			/>
		)

		expect(
			screen.queryByText("ルートアカウント削除確認")
		).not.toBeInTheDocument()
	})

	it("削除ボタンをクリックすると確認関数が呼び出される", () => {
		const mockOnConfirm = vi.fn()
		const mockOnCancel = vi.fn()

		render(
			<RootAccountDelete
				account={mockAccount}
				isOpen={true}
				onConfirm={mockOnConfirm}
				onCancel={mockOnCancel}
			/>
		)

		fireEvent.click(screen.getByText("削除"))
		expect(mockOnConfirm).toHaveBeenCalledTimes(1)
		expect(mockOnConfirm).toHaveBeenCalledWith(mockAccount.id)
	})

	it("キャンセルボタンをクリックするとキャンセル関数が呼び出される", () => {
		const mockOnConfirm = vi.fn()
		const mockOnCancel = vi.fn()

		render(
			<RootAccountDelete
				account={mockAccount}
				isOpen={true}
				onConfirm={mockOnConfirm}
				onCancel={mockOnCancel}
			/>
		)

		fireEvent.click(screen.getByText("キャンセル"))
		expect(mockOnCancel).toHaveBeenCalledTimes(1)
	})

	it("削除中の状態が正しく表示される", () => {
		const mockOnConfirm = vi.fn()
		const mockOnCancel = vi.fn()

		render(
			<RootAccountDelete
				account={mockAccount}
				isOpen={true}
				onConfirm={mockOnConfirm}
				onCancel={mockOnCancel}
				isDeleting={true}
			/>
		)

		expect(screen.getByText("削除中...")).toBeInTheDocument()
		expect(screen.getByText("削除中...")).toBeDisabled()
	})

	it("エラーメッセージが正しく表示される", () => {
		const mockOnConfirm = vi.fn()
		const mockOnCancel = vi.fn()
		const errorMessage = "削除に失敗しました"

		render(
			<RootAccountDelete
				account={mockAccount}
				isOpen={true}
				onConfirm={mockOnConfirm}
				onCancel={mockOnCancel}
				error={errorMessage}
			/>
		)

		expect(screen.getByText(errorMessage)).toBeInTheDocument()
	})

	it("検証済みアカウントの警告メッセージが表示される", () => {
		const mockOnConfirm = vi.fn()
		const mockOnCancel = vi.fn()

		render(
			<RootAccountDelete
				account={mockAccount}
				isOpen={true}
				onConfirm={mockOnConfirm}
				onCancel={mockOnCancel}
			/>
		)

		expect(screen.getByText(/このアカウントは検証済みです/)).toBeInTheDocument()
	})

	it("未検証アカウントの場合は検証済み警告が表示されない", () => {
		const unverifiedAccount = { ...mockAccount, isVerified: false }
		const mockOnConfirm = vi.fn()
		const mockOnCancel = vi.fn()

		render(
			<RootAccountDelete
				account={unverifiedAccount}
				isOpen={true}
				onConfirm={mockOnConfirm}
				onCancel={mockOnCancel}
			/>
		)

		expect(
			screen.queryByText(/このアカウントは検証済みです/)
		).not.toBeInTheDocument()
	})

	it("オーバーレイをクリックしてもダイアログが閉じない（意図的な仕様）", () => {
		const mockOnConfirm = vi.fn()
		const mockOnCancel = vi.fn()

		render(
			<RootAccountDelete
				account={mockAccount}
				isOpen={true}
				onConfirm={mockOnConfirm}
				onCancel={mockOnCancel}
			/>
		)

		// オーバーレイを取得してクリック
		const overlay = screen.getByTestId("delete-dialog-overlay")
		fireEvent.click(overlay)

		// onCancelが呼ばれないことを確認
		expect(mockOnCancel).not.toHaveBeenCalled()
	})
})
