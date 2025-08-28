/**
 * ルートアカウントフォームコンポーネントのテスト
 */

import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import { describe, expect, it, vi } from "vitest"

import { RootAccountForm } from "./root-account-form"

import type { RootAccountFormData } from "../../../types/root-account"

describe("RootAccountForm", () => {
	it("should render form fields for creating new account", () => {
		render(<RootAccountForm mode='create' />)

		// フォームタイトルの確認
		expect(screen.getByText("新規ルートアカウント作成")).toBeInTheDocument()

		// フィールドラベルの確認
		expect(screen.getByLabelText("検証済み")).toBeInTheDocument()
		expect(screen.getByLabelText("母語コード")).toBeInTheDocument()
		expect(screen.getByLabelText("サイト言語コード")).toBeInTheDocument()
		expect(screen.getByLabelText("生年世代")).toBeInTheDocument()
		expect(screen.getByLabelText("居住地区分")).toBeInTheDocument()
		expect(screen.getByLabelText("最大ポイント")).toBeInTheDocument()
		expect(screen.getByLabelText("アカウント状態")).toBeInTheDocument()

		// ボタンの確認
		expect(screen.getByText("作成")).toBeInTheDocument()
		expect(screen.getByText("キャンセル")).toBeInTheDocument()
	})

	it("should render form fields for editing existing account", () => {
		const mockData: RootAccountFormData = {
			isVerified: true,
			motherTongueCode: "ja",
			siteLanguageCode: "ja",
			birthGeneration: "1990年代",
			livingAreaSegment: "area2",
			maxPoints: 1500,
			accountStatus: "active"
		}

		render(<RootAccountForm mode='edit' defaultValues={mockData} />)

		// フォームタイトルの確認
		expect(screen.getByText("ルートアカウント編集")).toBeInTheDocument()

		// デフォルト値の確認
		expect(screen.getByLabelText("検証済み")).toBeChecked()
		expect(screen.getByDisplayValue("ja")).toBeInTheDocument()
		expect(screen.getByDisplayValue("1990年代")).toBeInTheDocument()
		expect(screen.getByDisplayValue("1500")).toBeInTheDocument()

		// ボタンの確認
		expect(screen.getByText("更新")).toBeInTheDocument()
	})

	it("should validate required fields", async () => {
		const mockOnSubmit = vi.fn()
		render(<RootAccountForm mode='create' onSubmit={mockOnSubmit} />)

		// 最大ポイントを空にして送信
		const maxPointsInput = screen.getByLabelText("最大ポイント")
		fireEvent.change(maxPointsInput, { target: { value: "" } })

		const submitButton = screen.getByText("作成")
		fireEvent.click(submitButton)

		// エラーメッセージの確認
		await waitFor(() => {
			expect(screen.getByText("最大ポイントは必須です")).toBeInTheDocument()
		})

		expect(mockOnSubmit).not.toHaveBeenCalled()
	})

	it("should validate max points minimum value", async () => {
		const mockOnSubmit = vi.fn()
		render(<RootAccountForm mode='create' onSubmit={mockOnSubmit} />)

		// 最大ポイントを0に設定
		const maxPointsInput = screen.getByLabelText("最大ポイント")
		fireEvent.change(maxPointsInput, { target: { value: "0" } })

		const submitButton = screen.getByText("作成")
		fireEvent.click(submitButton)

		// バリデーションエラーの確認
		await waitFor(() => {
			expect(
				screen.getByText("最大ポイントは1以上である必要があります")
			).toBeInTheDocument()
		})

		expect(mockOnSubmit).not.toHaveBeenCalled()
	})

	it("should submit form with valid data", async () => {
		const mockOnSubmit = vi.fn()
		render(<RootAccountForm mode='create' onSubmit={mockOnSubmit} />)

		// フォームに入力
		fireEvent.change(screen.getByLabelText("母語コード"), {
			target: { value: "ja" }
		})
		fireEvent.change(screen.getByLabelText("サイト言語コード"), {
			target: { value: "ja" }
		})
		fireEvent.change(screen.getByLabelText("生年世代"), {
			target: { value: "1990年代" }
		})
		fireEvent.change(screen.getByLabelText("最大ポイント"), {
			target: { value: "1500" }
		})

		// 居住地区分の選択
		fireEvent.change(screen.getByLabelText("居住地区分"), {
			target: { value: "area2" }
		})

		// アカウント状態の選択
		fireEvent.change(screen.getByLabelText("アカウント状態"), {
			target: { value: "active" }
		})

		const submitButton = screen.getByText("作成")
		fireEvent.click(submitButton)

		// フォーム送信の確認
		await waitFor(() => {
			expect(mockOnSubmit).toHaveBeenCalledWith({
				isVerified: false, // デフォルト値
				motherTongueCode: "ja",
				siteLanguageCode: "ja",
				birthGeneration: "1990年代",
				livingAreaSegment: "area2",
				maxPoints: 1500,
				accountStatus: "active"
			})
		})
	})

	it("should call onCancel when cancel button is clicked", () => {
		const mockOnCancel = vi.fn()
		render(<RootAccountForm mode='create' onCancel={mockOnCancel} />)

		const cancelButton = screen.getByText("キャンセル")
		fireEvent.click(cancelButton)

		expect(mockOnCancel).toHaveBeenCalled()
	})

	it("should show loading state during submission", async () => {
		const mockOnSubmit = vi
			.fn()
			.mockImplementation(
				() => new Promise((resolve) => setTimeout(resolve, 100))
			)
		render(<RootAccountForm mode='create' onSubmit={mockOnSubmit} />)

		const submitButton = screen.getByText("作成")
		fireEvent.click(submitButton)

		// ローディング状態の確認
		expect(screen.getByText("作成中...")).toBeInTheDocument()
		expect(submitButton).toBeDisabled()

		// ローディング完了まで待機
		await waitFor(() => {
			expect(screen.getByText("作成")).toBeInTheDocument()
		})
	})

	it("should display server errors", () => {
		render(
			<RootAccountForm mode='create' error='サーバーエラーが発生しました' />
		)

		// エラーメッセージの確認
		expect(screen.getByText("サーバーエラーが発生しました")).toBeInTheDocument()
	})

	it("should render select options for living area segment", () => {
		render(<RootAccountForm mode='create' />)

		const select = screen.getByLabelText("居住地区分")

		// オプションの確認
		expect(screen.getByRole("option", { name: "エリア1" })).toBeInTheDocument()
		expect(screen.getByRole("option", { name: "エリア2" })).toBeInTheDocument()
		expect(screen.getByRole("option", { name: "エリア3" })).toBeInTheDocument()
		expect(screen.getByRole("option", { name: "エリア4" })).toBeInTheDocument()
		expect(screen.getByRole("option", { name: "エリア5" })).toBeInTheDocument()
	})

	it("should render select options for account status", () => {
		render(<RootAccountForm mode='create' />)

		// アカウント状態のオプション確認
		expect(screen.getByRole("option", { name: "有効" })).toBeInTheDocument()
		expect(screen.getByRole("option", { name: "保留中" })).toBeInTheDocument()
		expect(screen.getByRole("option", { name: "一時停止" })).toBeInTheDocument()
		expect(screen.getByRole("option", { name: "削除済み" })).toBeInTheDocument()
	})
})
