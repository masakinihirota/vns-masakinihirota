import type React from "react";
import { Choice, ValueSelectionMessage } from "./values-selection-screen.logic";

interface ValueSelectionScreenProps {
  choices: Choice[];
  message: ValueSelectionMessage | null;
  onAddChoice: () => void;
  onDeleteChoice: (idx: number) => void;
  importantValueId: string;
  relatedIds: string[];
}

export const ValueSelectionScreen: React.FC<ValueSelectionScreenProps> = ({
  choices,
  message,
  onAddChoice,
  onDeleteChoice,
  importantValueId,
  relatedIds,
}) => {
  return (
    <div className="max-w-4xl p-6 mx-auto bg-white rounded-lg shadow-md sm:p-8 lg:p-10 dark:bg-gray-800 dark:text-gray-100">
      {/* Message Box */}
      {message && (
        <div
          className={`fixed top-5 left-1/2 -translate-x-1/2 px-5 py-2 rounded-lg z-50 text-white transition-opacity duration-500 ${
            message ? "opacity-100" : "opacity-0"
          } ${message.type === "success" ? "bg-green-500" : "bg-red-500"}`}
        >
          {message.text}
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col items-start justify-between pb-4 mb-6 border-b border-gray-200 dark:border-gray-700 sm:flex-row sm:items-center">
        {/* Breadcrumbs */}
        <nav
          className="mb-2 text-sm text-gray-500 dark:text-gray-400 sm:mb-0"
          aria-label="パンくずリスト"
        >
          <ol className="inline-flex p-0 list-none">
            <li className="flex items-center">
              <button
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline bg-transparent border-none cursor-pointer"
                tabIndex={0}
                type="button"
              >
                ホーム
              </button>
              <svg
                className="flex-shrink-0 w-4 h-4 mx-2 text-gray-400 dark:text-gray-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-label="区切りアイコン"
              >
                <title>区切り</title>
                <path d="M5.555 17.776l8-16 .708.708-8 16-.708-.708z" />
              </svg>
            </li>
            <li className="flex items-center">
              <button
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline bg-transparent border-none cursor-pointer"
                tabIndex={0}
                type="button"
              >
                価値観カテゴリ
              </button>
              <svg
                className="flex-shrink-0 w-4 h-4 mx-2 text-gray-400 dark:text-gray-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-label="区切りアイコン"
              >
                <title>区切り</title>
                <path d="M5.555 17.776l8-16 .708.708-8 16-.708-.708z" />
              </svg>
            </li>
            <li className="flex items-center">
              <button
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline bg-transparent border-none cursor-pointer"
                tabIndex={0}
                type="button"
              >
                価値観リスト
              </button>
              <svg
                className="flex-shrink-0 w-4 h-4 mx-2 text-gray-400 dark:text-gray-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-label="区切りアイコン"
              >
                <title>区切り</title>
                <path d="M5.555 17.776l8-16 .708.708-8 16-.708-.708z" />
              </svg>
            </li>
            <li className="flex items-center">
              <span className="text-gray-500 dark:text-gray-400">
                現在のお題
              </span>
            </li>
          </ol>
        </nav>
        {/* Navigation */}
        <div className="flex space-x-4 text-sm font-medium text-blue-600 dark:text-blue-400">
          <button
            className="hover:underline bg-transparent border-none cursor-pointer"
            tabIndex={0}
            type="button"
          >
            ←戻る
          </button>
          <button
            className="hover:underline bg-transparent border-none cursor-pointer"
            tabIndex={0}
            type="button"
          >
            次へ→
          </button>
        </div>
      </div>

      {/* Basic Info Section */}
      <div className="mb-8">
        <div className="grid grid-cols-1 pb-4 text-sm text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 sm:grid-cols-3 gap-y-2 sm:gap-y-0 sm:gap-x-4">
          <div className="flex items-center">
            <span className="mr-2 font-semibold text-gray-800 dark:text-gray-200">
              カテゴリ
            </span>
            <span className="text-gray-700 dark:text-gray-300">基本</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2 font-semibold text-gray-800 dark:text-gray-200">
              番号
            </span>
            <span className="text-gray-700 dark:text-gray-300">
              ００１−０００１
            </span>
          </div>
          <div className="flex items-center">
            <span className="mr-2 font-semibold text-gray-800 dark:text-gray-200">
              作った人
            </span>
            <span className="text-gray-700 dark:text-gray-300">システム</span>
          </div>
        </div>
      </div>

      {/* Question/Theme Section */}
      <div className="mb-8">
        <div className="flex items-center mb-3">
          <input
            type="checkbox"
            id={importantValueId}
            name="importantValue"
            className="w-5 h-5 mr-2 text-blue-600 rounded-md form-checkbox dark:bg-gray-700 dark:border-gray-600"
          />
          <label
            htmlFor={importantValueId}
            className="text-xl font-semibold text-gray-800 dark:text-gray-100"
          >
            お題
          </label>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 text-xs font-medium px-2.5 py-0.5 rounded-full">
            タグ1
          </span>
          <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 text-xs font-medium px-2.5 py-0.5 rounded-full">
            タグ2
          </span>
          <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 text-xs font-medium px-2.5 py-0.5 rounded-full">
            タグ3
          </span>
        </div>

        {/* Choices List */}
        <div className="mb-6 space-y-3">
          {choices.map((choice, idx) => (
            <div
              key={choice.label}
              className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-700"
            >
              <div className="flex items-center">
                <span className="mr-4 text-gray-700 dark:text-gray-200">
                  {choice.label}
                </span>
                {choice.user && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {choice.user}
                  </span>
                )}
              </div>
              {choice.user && (
                <button
                  type="button"
                  className="text-gray-400 transition-colors duration-200 hover:text-red-500 dark:hover:text-red-400"
                  onClick={() => onDeleteChoice(idx)}
                  aria-label="選択肢削除"
                >
                  <i className="fas fa-trash-alt" />
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          className="flex items-center mt-4 font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
          onClick={onAddChoice}
        >
          <i className="mr-2 fas fa-plus" />
          追加の選択肢
        </button>
      </div>

      {/* Content Blocks Section */}
      <div className="flex flex-col gap-6 mb-8">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="p-5 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm"
          >
            <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
              タイトル
            </h3>
            <button
              className="block mb-2 text-sm text-blue-600 break-all hover:underline bg-transparent border-none cursor-pointer dark:text-blue-400"
              tabIndex={0}
              type="button"
            >
              URL
            </button>
            <p className="text-sm text-gray-600 dark:text-gray-300">コメント</p>
          </div>
        ))}
      </div>

      {/* Related Values Section */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-100">
          関連の価値観
        </h2>
        <div className="flex flex-wrap justify-center gap-4 sm:justify-start">
          {relatedIds.map((rid) => (
            <div
              key={rid}
              id={rid}
              className="flex items-center justify-center w-12 h-12 text-gray-500 bg-gray-200 rounded-full dark:bg-gray-600 dark:text-gray-400"
            />
          ))}
        </div>
      </div>

      {/* Footer Info Section */}
      <div className="flex justify-between pt-4 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
        <span>作成日時:YYYY/MM/DD HH:MM</span>
        <span>更新日時:YYYY/MM/DD HH:MM</span>
      </div>
    </div>
  );
};
