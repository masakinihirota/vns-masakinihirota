/**
 * ルートアカウント関連コンポーネントの集約ファイル
 * App Routerの指示に従い、関連するコンポーネントをまとめてエクスポートする
 */

// Server Actions
export * from "./root-account.actions"
// 削除コンポーネント
export { RootAccountDelete } from "./root-account-delete/root-account-delete"
// 詳細表示コンポーネント
export { RootAccountDetail } from "./root-account-detail/root-account-detail"
// フォームコンポーネント
export { RootAccountForm } from "./root-account-form/root-account-form"
// 一覧表示コンポーネント
export { RootAccountList } from "./root-account-list/root-account-list"

// Types（再エクスポート）
export type {
	CrudResult,
	RootAccount,
	RootAccountFormData,
	RootAccountListItem
} from "@/types/root-account"
