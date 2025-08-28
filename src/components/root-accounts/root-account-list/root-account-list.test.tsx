/**
 * ルートアカウント一覧コンポーネントのテスト
 * TDD方式でまずテストを作成
 */

import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { describe, expect, it, vi } from "vitest"

import { RootAccountList } from "./root-account-list"

import type { RootAccountListItem } from "../../../types/root-account"

// モックデータ
const mockRootAccounts: RootAccountListItem[] = [
	{
		id: "1",
		authUserId: "auth-1",
		isVerified: true,
		totalPoints: 1500,
		accountStatus: "active",
		createdAt: new Date("2024-01-15T10:00:00Z"),
		updatedAt: new Date("2024-01-16T10:00:00Z")
	},
	{
		id: "2",
		authUserId: "auth-2",
		isVerified: false,
		totalPoints: 300,
		accountStatus: "pending",
		createdAt: new Date("2024-01-20T10:00:00Z"),
		updatedAt: new Date("2024-01-21T10:00:00Z")
	},
	{
		id: "3",
		authUserId: "auth-3",
		isVerified: true,
		totalPoints: 2000,
		accountStatus: "suspended",
		createdAt: new Date("2024-01-10T10:00:00Z"),
		updatedAt: new Date("2024-01-11T10:00:00Z")
	}
]

describe("RootAccountList", () => {
	it("should render root account list with proper headings", () => {
		render(<RootAccountList accounts={mockRootAccounts} />)

		// テーブルのヘッダーが表示されることを確認
		expect(screen.getByText("ID")).toBeInTheDocument()
		expect(screen.getByText("認証ユーザーID")).toBeInTheDocument()
		expect(screen.getByText("検証状態")).toBeInTheDocument()
		expect(screen.getByText("総ポイント")).toBeInTheDocument()
		expect(screen.getByText("アカウント状態")).toBeInTheDocument()
		expect(screen.getByText("作成日時")).toBeInTheDocument()
		expect(screen.getByText("操作")).toBeInTheDocument()
	})

	it("should display all root accounts data correctly", () => {
		render(<RootAccountList accounts={mockRootAccounts} />)

		// 各アカウントのデータが表示されることを確認
		expect(screen.getByText("1")).toBeInTheDocument()
		expect(screen.getByText("auth-1")).toBeInTheDocument()
		expect(screen.getByText("検証済み")).toBeInTheDocument()
		expect(screen.getByText("1,500")).toBeInTheDocument()

		expect(screen.getByText("2")).toBeInTheDocument()
		expect(screen.getByText("auth-2")).toBeInTheDocument()
		expect(screen.getByText("未検証")).toBeInTheDocument()
		expect(screen.getByText("300")).toBeInTheDocument()

		expect(screen.getByText("3")).toBeInTheDocument()
		expect(screen.getByText("auth-3")).toBeInTheDocument()
		expect(screen.getByText("2,000")).toBeInTheDocument()
	})

	it("should display account status with proper labels", () => {
		render(<RootAccountList accounts={mockRootAccounts} />)

		// アカウント状態のラベルが正しく表示されることを確認
		expect(screen.getByText("有効")).toBeInTheDocument() // active
		expect(screen.getByText("保留中")).toBeInTheDocument() // pending
		expect(screen.getByText("一時停止")).toBeInTheDocument() // suspended
	})

	it("should show action buttons for each account", () => {
		render(<RootAccountList accounts={mockRootAccounts} />)

		// 各アカウントに対してアクションボタンが表示されることを確認
		const viewButtons = screen.getAllByText("詳細")
		const editButtons = screen.getAllByText("編集")
		const deleteButtons = screen.getAllByText("削除")

		expect(viewButtons).toHaveLength(3)
		expect(editButtons).toHaveLength(3)
		expect(deleteButtons).toHaveLength(3)
	})

	it("should display empty state when no accounts provided", () => {
		render(<RootAccountList accounts={[]} />)

		// 空のリストの場合の表示を確認
		expect(
			screen.getByText("ルートアカウントが見つかりません")
		).toBeInTheDocument()
	})

	it("should handle action button clicks", () => {
		const mockOnView = vi.fn()
		const mockOnEdit = vi.fn()
		const mockOnDelete = vi.fn()

		render(
			<RootAccountList
				accounts={mockRootAccounts}
				onView={mockOnView}
				onEdit={mockOnEdit}
				onDelete={mockOnDelete}
			/>
		)

		// 最初のアカウントの各ボタンをクリック
		const firstViewButton = screen.getAllByText("詳細")[0]
		const firstEditButton = screen.getAllByText("編集")[0]
		const firstDeleteButton = screen.getAllByText("削除")[0]

		firstViewButton.click()
		expect(mockOnView).toHaveBeenCalledWith("1")

		firstEditButton.click()
		expect(mockOnEdit).toHaveBeenCalledWith("1")

		firstDeleteButton.click()
		expect(mockOnDelete).toHaveBeenCalledWith("1")
	})

	it("should format dates correctly", () => {
		render(<RootAccountList accounts={mockRootAccounts} />)

		// 日付が適切にフォーマットされていることを確認
		expect(screen.getByText("2024/01/15 10:00")).toBeInTheDocument()
		expect(screen.getByText("2024/01/20 10:00")).toBeInTheDocument()
		expect(screen.getByText("2024/01/10 10:00")).toBeInTheDocument()
	})

	it("should format points with thousands separator", () => {
		render(<RootAccountList accounts={mockRootAccounts} />)

		// ポイントが千の位区切りでフォーマットされることを確認
		expect(screen.getByText("1,500")).toBeInTheDocument()
		expect(screen.getByText("2,000")).toBeInTheDocument()
	})
})
