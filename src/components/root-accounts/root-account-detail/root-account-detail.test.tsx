/**
 * ルートアカウント詳細コンポーネントのテスト
 */

import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { describe, expect, it, vi } from "vitest"

import { RootAccountDetail } from "./root-account-detail"

import type { RootAccountDetail as RootAccountDetailType } from "../../../types/root-account"

// モックデータ
const mockRootAccount: RootAccountDetailType = {
	id: "123e4567-e89b-12d3-a456-426614174000",
	authUserId: "auth-123",
	createdAt: new Date("2024-01-15T10:00:00Z"),
	updatedAt: new Date("2024-01-16T10:00:00Z"),
	deletedAt: null,
	isVerified: true,
	motherTongueCode: "ja",
	siteLanguageCode: "ja",
	birthGeneration: "1990年代",
	totalPoints: 1500,
	livingAreaSegment: "area1" as const,
	warningCount: 1,
	lastWarningAt: new Date("2024-01-10T10:00:00Z"),
	isAnonymousInitialAuth: false,
	invitedAt: new Date("2024-01-05T10:00:00Z"),
	confirmedAt: new Date("2024-01-06T10:00:00Z"),
	maxPoints: 2000,
	lastPointRecoveryAt: new Date("2024-01-14T10:00:00Z"),
	totalConsumedPoints: 500,
	activityPoints: 100,
	clickPoints: 50,
	consecutiveDays: 15,
	trustScore: 85,
	oauthProviders: ["google", "github"],
	oauthCount: 2,
	accountStatus: "active" as const
}

describe("RootAccountDetail", () => {
	it("should render all account details correctly", () => {
		render(<RootAccountDetail account={mockRootAccount} />)

		// 基本情報の表示を確認
		expect(screen.getByText("ルートアカウント詳細")).toBeInTheDocument()
		expect(
			screen.getByText("123e4567-e89b-12d3-a456-426614174000")
		).toBeInTheDocument()
		expect(screen.getByText("auth-123")).toBeInTheDocument()

		// 検証状態の確認
		expect(screen.getByText("検証済み")).toBeInTheDocument()

		// ポイント関連の確認
		expect(screen.getByText("1,500")).toBeInTheDocument()
		expect(screen.getByText("2,000")).toBeInTheDocument()
		expect(screen.getByText("500")).toBeInTheDocument()
		expect(screen.getByText("100")).toBeInTheDocument()
		expect(screen.getByText("50")).toBeInTheDocument()

		// その他の数値データ
		expect(screen.getByText("1")).toBeInTheDocument() // warningCount
		expect(screen.getByText("15")).toBeInTheDocument() // consecutiveDays
		expect(screen.getByText("85")).toBeInTheDocument() // trustScore
		expect(screen.getByText("2")).toBeInTheDocument() // oauthCount
	})

	it("should display proper field labels", () => {
		render(<RootAccountDetail account={mockRootAccount} />)

		// フィールドラベルの表示確認
		expect(screen.getByText("ID:")).toBeInTheDocument()
		expect(screen.getByText("認証ユーザーID:")).toBeInTheDocument()
		expect(screen.getByText("検証状態:")).toBeInTheDocument()
		expect(screen.getByText("総ポイント:")).toBeInTheDocument()
		expect(screen.getByText("最大ポイント:")).toBeInTheDocument()
		expect(screen.getByText("消費ポイント総計:")).toBeInTheDocument()
		expect(screen.getByText("アクティビティポイント:")).toBeInTheDocument()
		expect(screen.getByText("クリックポイント:")).toBeInTheDocument()
		expect(screen.getByText("連続日数:")).toBeInTheDocument()
		expect(screen.getByText("信頼度スコア:")).toBeInTheDocument()
		expect(screen.getByText("警告回数:")).toBeInTheDocument()
		expect(screen.getByText("OAuth認証数:")).toBeInTheDocument()
		expect(screen.getByText("アカウント状態:")).toBeInTheDocument()
	})

	it("should format dates correctly", () => {
		render(<RootAccountDetail account={mockRootAccount} />)

		// 日付のフォーマット確認
		expect(screen.getByText("2024/01/15 10:00")).toBeInTheDocument()
		expect(screen.getByText("2024/01/16 10:00")).toBeInTheDocument()
		expect(screen.getByText("2024/01/10 10:00")).toBeInTheDocument()
		expect(screen.getByText("2024/01/05 10:00")).toBeInTheDocument()
		expect(screen.getByText("2024/01/06 10:00")).toBeInTheDocument()
		expect(screen.getByText("2024/01/14 10:00")).toBeInTheDocument()
	})

	it("should display OAuth providers as comma-separated list", () => {
		render(<RootAccountDetail account={mockRootAccount} />)

		// OAuth プロバイダーの表示確認
		expect(screen.getByText("google, github")).toBeInTheDocument()
	})

	it("should handle null/undefined values properly", () => {
		const accountWithNulls: RootAccountDetailType = {
			...mockRootAccount,
			motherTongueCode: null,
			siteLanguageCode: null,
			birthGeneration: null,
			lastWarningAt: null,
			invitedAt: null,
			confirmedAt: null,
			lastPointRecoveryAt: null,
			deletedAt: null
		}

		render(<RootAccountDetail account={accountWithNulls} />)

		// null値の場合の表示確認
		expect(screen.getAllByText("未設定")).toHaveLength(6) // null値の数だけ
	})

	it("should show edit and delete buttons", () => {
		const mockOnEdit = vi.fn()
		const mockOnDelete = vi.fn()

		render(
			<RootAccountDetail
				account={mockRootAccount}
				onEdit={mockOnEdit}
				onDelete={mockOnDelete}
			/>
		)

		// ボタンの表示確認
		expect(screen.getByText("編集")).toBeInTheDocument()
		expect(screen.getByText("削除")).toBeInTheDocument()
	})

	it("should call callbacks when buttons are clicked", () => {
		const mockOnEdit = vi.fn()
		const mockOnDelete = vi.fn()

		render(
			<RootAccountDetail
				account={mockRootAccount}
				onEdit={mockOnEdit}
				onDelete={mockOnDelete}
			/>
		)

		// ボタンクリック時のコールバック確認
		screen.getByText("編集").click()
		expect(mockOnEdit).toHaveBeenCalledWith(mockRootAccount.id)

		screen.getByText("削除").click()
		expect(mockOnDelete).toHaveBeenCalledWith(mockRootAccount.id)
	})

	it("should display account status with proper styling", () => {
		render(<RootAccountDetail account={mockRootAccount} />)

		// アカウント状態の表示確認
		expect(screen.getByText("有効")).toBeInTheDocument()
	})
})
