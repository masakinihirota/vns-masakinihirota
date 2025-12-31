"use client";

import {
  User,
  MapPin,
  Globe,
  Shield,
  Activity,
  Edit3,
  Save,
  CreditCard,
  AlertCircle,
  Terminal,
} from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import {
  LANGUAGES_MOCK,
  dummyUserProfileList,
} from "./root-account-dashboard.dummyData";
import {
  RootAccount,
  UserProfileSummary,
} from "./root-account-dashboard.types";

interface RootAccountDashboardProps {
  data: RootAccount;
}

export function RootAccountDashboard({ data }: RootAccountDashboardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<RootAccount>(data);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [profiles, setProfiles] =
    useState<UserProfileSummary[]>(dummyUserProfileList);

  // Simulate Server Action for Update
  const handleSave = async () => {
    setIsLoading(true);
    // Mimic network delay and optimistic UI update
    setTimeout(() => {
      setIsLoading(false);
      setIsEditing(false);
      // In a real app, this would trigger a toast notification based on Chapter 4 requirements
      alert("更新が完了しました (Server Action Mock)");
    }, 1000);
  };

  const handleCancel = () => {
    setFormData(data); // Reset changes to initial data
    setIsEditing(false);
  };

  const handleChange = (field: keyof RootAccount, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans">
      {/* Top Navigation Mock */}
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center text-white font-bold">
                R
              </div>
              <span className="font-bold text-lg text-slate-800 dark:text-slate-200">
                Root Account System
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Authenticated as: {formData.display_id}
              </span>
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                <User
                  size={18}
                  className="text-slate-500 dark:text-slate-400"
                />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="w-full py-8 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex md:items-center justify-between flex-col md:flex-row gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                アカウント管理
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                ユーザープロファイル、セキュリティ設定、および監査ログの確認
              </p>
            </div>
            <div className="flex items-center gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {isLoading ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Save size={16} />
                    )}
                    変更を保存
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  <Edit3 size={16} />
                  プロフィール編集
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Status Cards (Gamification & System Status) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Level Card */}
          <div className="bg-white dark:bg-slate-900 overflow-hidden shadow rounded-lg p-5 border-l-4 border-indigo-500">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Activity className="h-6 w-6 text-indigo-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">
                    現在のレベル
                  </dt>
                  <dd>
                    <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                      Lv. {formData.level}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          {/* Points Card */}
          <div className="bg-white dark:bg-slate-900 overflow-hidden shadow rounded-lg p-5 border-l-4 border-emerald-500">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CreditCard className="h-6 w-6 text-emerald-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">
                    総獲得ポイント
                  </dt>
                  <dd>
                    <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                      {formData.total_points.toLocaleString()} pt
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          {/* Warnings Card - Adjusted to include Trust Duration */}
          <div className="bg-white dark:bg-slate-900 overflow-hidden shadow rounded-lg p-5 border-l-4 border-amber-500">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-amber-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">
                    信頼継続日数 / 警告
                  </dt>
                  <dd className="flex items-baseline gap-2">
                    <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                      {formData.trust_duration_days}日
                    </div>
                    <div className="text-xs text-slate-500">
                      (警告: {formData.warning_count})
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Single Page Layout */}
        <div className="space-y-8">
          {/* My Profiles - Full Width */}
          <div className="bg-white dark:bg-slate-900 shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg leading-6 font-medium text-slate-900 dark:text-slate-50">
                  千の仮面 (My Profiles)
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  このルートアカウントに紐づくユーザープロフィールの一覧です。
                </p>
              </div>
              <button className="flex items-center gap-2 px-3 py-1.5 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                <User size={14} />
                新規作成
              </button>
            </div>

            <div className="space-y-4">
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  className="bg-slate-50 dark:bg-slate-800/50 overflow-hidden shadow-sm rounded-lg border border-slate-200 dark:border-slate-700 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 truncate">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-gray-900 dark:text-white text-sm font-medium truncate">
                          {profile.display_name}
                        </h3>
                        {profile.is_active ? (
                          <span className="flex-shrink-0 inline-block px-2 py-0.5 text-green-800 text-xs font-medium bg-green-100 rounded-full">
                            Active
                          </span>
                        ) : (
                          <span className="flex-shrink-0 inline-block px-2 py-0.5 text-gray-800 text-xs font-medium bg-gray-100 rounded-full">
                            Inactive
                          </span>
                        )}
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${profile.role_type === "leader"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-blue-100 text-blue-800"
                            }`}
                        >
                          {profile.role_type}
                        </span>
                      </div>
                      <p className="mt-1 text-gray-500 dark:text-gray-400 text-xs truncate">
                        {profile.purpose}
                      </p>
                    </div>
                    <div>
                      <button className="text-xs text-indigo-600 hover:text-indigo-500 font-medium">
                        詳細
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {profiles.length === 0 && (
                <div className="text-center py-4 text-sm text-slate-500">
                  プロフィールはまだありません
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Basic Info & AI Settings */}
            <div className="space-y-8">
              <div className="bg-white dark:bg-slate-900 shadow rounded-lg p-6">
                {/* Basic Info Section */}
                <section>
                  <h3 className="text-lg leading-6 font-medium text-slate-900 dark:text-slate-50 mb-4 flex items-center gap-2">
                    <User size={20} className="text-slate-400" />
                    ユーザー属性
                  </h3>
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    {/* Display ID */}
                    <div className="sm:col-span-6">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Display ID
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <input
                          type="text"
                          disabled={true} // Usually ID is immutable or hard to change
                          value={formData.display_id}
                          className="bg-slate-100 dark:bg-slate-800 block w-full border-slate-300 dark:border-slate-700 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border text-slate-500 dark:text-slate-400 cursor-not-allowed"
                        />
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        システム内での一意な識別子です (変更不可)
                      </p>
                    </div>

                    {/* Display Name */}
                    <div className="sm:col-span-6">
                      <label className="block text-sm font-medium text-slate-700">
                        表示名 (Display Name)
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          disabled={!isEditing}
                          value={formData.display_name}
                          onChange={(e) =>
                            handleChange("display_name", e.target.value)
                          }
                          className={`block w-full rounded-md sm:text-sm p-2 border ${isEditing ? "border-slate-300 dark:border-slate-600 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" : "bg-slate-50 dark:bg-slate-900 border-transparent text-slate-900 dark:text-slate-50"}`}
                        />
                      </div>
                    </div>

                    {/* Location (New Field) */}
                    <div className="sm:col-span-6">
                      <label className="block text-sm font-medium text-slate-700 flex items-center gap-1">
                        <MapPin size={14} /> 居住地 (Location)
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          disabled={!isEditing}
                          value={formData.location}
                          onChange={(e) =>
                            handleChange("location", e.target.value)
                          }
                          className={`block w-full rounded-md sm:text-sm p-2 border ${isEditing ? "border-slate-300 dark:border-slate-600 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" : "bg-slate-50 dark:bg-slate-900 border-transparent text-slate-900 dark:text-slate-50"}`}
                          placeholder="例: 東京都, 日本"
                        />
                      </div>
                    </div>

                    {/* Generation (New Field) */}
                    {/* Generation */}
                    <div className="sm:col-span-3">
                      <label className="block text-sm font-medium text-slate-700 flex items-center gap-1">
                        <Activity size={14} /> 生誕世代 (Generation)
                      </label>
                      <div className="mt-1">
                        {isEditing ? (
                          <select
                            value={formData.birth_generation}
                            onChange={(e) =>
                              handleChange("birth_generation", e.target.value)
                            }
                            className="block w-full py-2 px-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          >
                            <option value="1960s">1960s</option>
                            <option value="1970s">1970s</option>
                            <option value="1980s">1980s</option>
                            <option value="1990s">1990s</option>
                            <option value="2000s">2000s</option>
                            <option value="2010s">2010s</option>
                          </select>
                        ) : (
                          <div className="block w-full rounded-md sm:text-sm p-2 border bg-slate-50 dark:bg-slate-900 border-transparent text-slate-900 dark:text-slate-50">
                            {formData.birth_generation}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Culture Code */}
                    <div className="sm:col-span-3">
                      <label className="block text-sm font-medium text-slate-700">
                        活動文化圏 (Culture Sphere)
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          disabled={!isEditing}
                          value={formData.activity_culture_code}
                          onChange={(e) =>
                            handleChange(
                              "activity_culture_code",
                              e.target.value
                            )
                          }
                          className={`block w-full rounded-md sm:text-sm p-2 border ${isEditing ? "border-slate-300 dark:border-slate-600 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" : "bg-slate-50 dark:bg-slate-900 border-transparent text-slate-900 dark:text-slate-50"}`}
                        />
                      </div>
                    </div>

                    {/* Core Hours Start */}
                    <div className="sm:col-span-3">
                      <label className="block text-sm font-medium text-slate-700">
                        コア活動開始 (UTC)
                      </label>
                      <div className="mt-1">
                        <input
                          type="time"
                          disabled={!isEditing}
                          value={formData.core_hours_start}
                          onChange={(e) =>
                            handleChange("core_hours_start", e.target.value)
                          }
                          className={`block w-full rounded-md sm:text-sm p-2 border ${isEditing ? "border-slate-300 dark:border-slate-600 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" : "bg-slate-50 dark:bg-slate-900 border-transparent text-slate-900 dark:text-slate-50"}`}
                        />
                      </div>
                    </div>

                    {/* Core Hours End */}
                    <div className="sm:col-span-3">
                      <label className="block text-sm font-medium text-slate-700">
                        コア活動終了 (UTC)
                      </label>
                      <div className="mt-1">
                        <input
                          type="time"
                          disabled={!isEditing}
                          value={formData.core_hours_end}
                          onChange={(e) =>
                            handleChange("core_hours_end", e.target.value)
                          }
                          className={`block w-full rounded-md sm:text-sm p-2 border ${isEditing ? "border-slate-300 dark:border-slate-600 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" : "bg-slate-50 dark:bg-slate-900 border-transparent text-slate-900 dark:text-slate-50"}`}
                        />
                      </div>
                    </div>

                    {/* Statement */}
                    <div className="sm:col-span-6">
                      <label className="block text-sm font-medium text-slate-700">
                        自己紹介 (Statement)
                      </label>
                      <div className="mt-1">
                        <textarea
                          rows={3}
                          disabled={!isEditing}
                          value={formData.statement}
                          onChange={(e) =>
                            handleChange("statement", e.target.value)
                          }
                          className={`block w-full rounded-md sm:text-sm p-2 border ${isEditing ? "border-slate-300 dark:border-slate-600 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" : "bg-slate-50 dark:bg-slate-900 border-transparent text-slate-900 dark:text-slate-50"}`}
                        />
                      </div>
                    </div>
                  </div>
                </section>

                <hr className="border-slate-200 dark:border-slate-800 my-6" />

                {/* Language Settings */}
                <section>
                  <h3 className="text-lg leading-6 font-medium text-slate-900 dark:text-slate-50 mb-4 flex items-center gap-2">
                    <Globe size={20} className="text-slate-400" />
                    言語設定
                  </h3>
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label className="block text-sm font-medium text-slate-700">
                        母国語 (Mother Tongue)
                      </label>
                      <div className="mt-1">
                        {isEditing ? (
                          <select
                            value={formData.mother_tongue_code}
                            onChange={(e) =>
                              handleChange("mother_tongue_code", e.target.value)
                            }
                            className="block w-full py-2 px-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          >
                            {LANGUAGES_MOCK.map((lang) => (
                              <option key={lang.id} value={lang.id}>
                                {lang.native_name} ({lang.name})
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="block w-full rounded-md sm:text-sm p-2 border bg-slate-50 dark:bg-slate-900 border-transparent text-slate-900 dark:text-slate-50">
                            {
                              LANGUAGES_MOCK.find(
                                (l) => l.id === formData.mother_tongue_code
                              )?.native_name
                            }
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-sm font-medium text-slate-700">
                        サイト表示言語 (Site Language)
                      </label>
                      <div className="mt-1">
                        {isEditing ? (
                          <select
                            value={formData.site_language_code}
                            onChange={(e) =>
                              handleChange("site_language_code", e.target.value)
                            }
                            className="block w-full py-2 px-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          >
                            {LANGUAGES_MOCK.map((lang) => (
                              <option key={lang.id} value={lang.id}>
                                {lang.native_name} ({lang.name})
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="block w-full rounded-md sm:text-sm p-2 border bg-slate-50 dark:bg-slate-900 border-transparent text-slate-900 dark:text-slate-50">
                            {
                              LANGUAGES_MOCK.find(
                                (l) => l.id === formData.site_language_code
                              )?.native_name
                            }
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </section>

                <hr className="border-slate-200 dark:border-slate-800 my-6" />

                {/* AI Settings */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center h-5">
                    <input
                      id="ai_translation"
                      name="ai_translation"
                      type="checkbox"
                      disabled={!isEditing}
                      checked={formData.uses_ai_translation}
                      onChange={(e) =>
                        handleChange(
                          "uses_ai_translation",
                          e.target.checked ? "true" : "false"
                        )
                      }
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-2 text-sm">
                    <label
                      htmlFor="ai_translation"
                      className="font-medium text-slate-700 dark:text-slate-300"
                    >
                      AI自動翻訳を利用する
                    </label>
                    <p className="text-slate-500 dark:text-slate-400">
                      チェックすると、コミュニケーション時にAIによる自動翻訳が有効になります。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Security & Audit */}
            <div className="space-y-8">
              {/* Security & Audit Compact */}
              <div className="bg-white dark:bg-slate-900 shadow rounded-lg p-6">
                <h3 className="text-lg leading-6 font-medium text-slate-900 dark:text-slate-50 mb-4 flex items-center gap-2">
                  <Shield size={20} className="text-slate-400" />
                  セキュリティ & 連携
                </h3>

                <div className="space-y-4">
                  {/* Provider */}
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-md p-3 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white dark:bg-slate-700 rounded-full border border-slate-200 dark:border-slate-600 flex items-center justify-center shadow-sm">
                        <Image
                          src="https://www.google.com/favicon.ico"
                          alt="Google"
                          width={16}
                          height={16}
                          className="w-4 h-4"
                          unoptimized
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                          Google Account
                        </p>
                        <p className="text-xs text-slate-500">
                          連絡先のみ (認証不可)
                        </p>
                      </div>
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                      連携中
                    </span>
                  </div>

                  {/* 2FA Note */}
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-3">
                    <p className="text-xs text-yellow-700 dark:text-yellow-200">
                      2要素認証 (2FA) は現在サポート外です。
                    </p>
                  </div>

                  {/* Last Audit Log */}
                  <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        直近のイベント
                      </h4>
                      <button className="text-xs text-indigo-600 hover:text-indigo-500">
                        全ログを表示
                      </button>
                    </div>
                    <div className="text-xs text-slate-500">
                      <div className="flow-root">
                        <ul role="list" className="-mb-8">
                          {[
                            {
                              event: "LOGIN",
                              date: "2024-05-20 09:30",
                              status: "Success",
                            },
                            {
                              event: "PROFILE_UPDATE",
                              date: "2024-05-19 18:45",
                              status: "Success",
                            },
                          ].map((event, eventIdx) => (
                            <li key={eventIdx}>
                              <div className="relative pb-4">
                                {eventIdx !== 1 ? (
                                  <span
                                    className="absolute top-4 left-2 -ml-px h-full w-0.5 bg-slate-200"
                                    aria-hidden="true"
                                  />
                                ) : null}
                                <div className="relative flex space-x-3">
                                  <div>
                                    <span className="h-4 w-4 rounded-full bg-green-500 flex items-center justify-center ring-4 ring-white dark:ring-slate-900"></span>
                                  </div>
                                  <div className="min-w-0 flex-1 flex justify-between space-x-4">
                                    <div>
                                      <p className="text-xs text-slate-500">
                                        {event.event}
                                      </p>
                                    </div>
                                    <div className="text-right text-xs whitespace-nowrap text-slate-500">
                                      <time dateTime={event.date}>
                                        {event.date}
                                      </time>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer / Debug Info */}
      <footer className="w-full px-4 sm:px-6 lg:px-8 py-6 text-center text-xs text-slate-400 dark:text-slate-500">
        <p>Root Account System v1.0.0-prototype</p>
        <p className="mt-1">Schema Version: 0100-100-4-extended</p>
      </footer>
    </div>
  );
}
