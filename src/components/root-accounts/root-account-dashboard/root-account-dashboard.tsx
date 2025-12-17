"use client";

import React, { useState } from "react";
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
import { RootAccount } from "./root-account-dashboard.types";
import { LANGUAGES_MOCK } from "./root-account-dashboard.dummyData";

interface RootAccountDashboardProps {
  data: RootAccount;
}

export function RootAccountDashboard({ data }: RootAccountDashboardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<RootAccount>(data);
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "audit">("profile");

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <User size={18} className="text-slate-500 dark:text-slate-400" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
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

          {/* Status Card */}
          <div className="bg-white dark:bg-slate-900 overflow-hidden shadow rounded-lg p-5 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Shield className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">
                    アカウント状態
                  </dt>
                  <dd className="flex items-center gap-2 mt-1">
                    {formData.status === "active" ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                        有効 (Active)
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
                        {formData.status}
                      </span>
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          {/* Warnings Card */}
          <div className="bg-white dark:bg-slate-900 overflow-hidden shadow rounded-lg p-5 border-l-4 border-amber-500">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-amber-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">
                    警告カウント
                  </dt>
                  <dd>
                    <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                      {formData.warning_count}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <div className="bg-white dark:bg-slate-900 shadow rounded-lg min-h-[500px]">
          <div className="border-b border-slate-200 dark:border-slate-800">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("profile")}
                className={`${
                  activeTab === "profile"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
              >
                <User size={16} />
                基本情報 (Profile)
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`${
                  activeTab === "security"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
              >
                <Shield size={16} />
                セキュリティ & 連携
              </button>
              <button
                onClick={() => setActiveTab("audit")}
                className={`${
                  activeTab === "audit"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
              >
                <Terminal size={16} />
                監査ログ (Audit)
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "profile" && (
              <div className="space-y-8 animate-in fade-in duration-300">
                {/* Basic Info Section */}
                <section>
                  <h3 className="text-lg leading-6 font-medium text-slate-900 dark:text-slate-50 mb-4 flex items-center gap-2">
                    <User size={20} className="text-slate-400" />
                    ユーザー属性
                  </h3>
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    {/* Display ID */}
                    <div className="sm:col-span-3">
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
                    <div className="sm:col-span-3">
                      <label className="block text-sm font-medium text-slate-700">
                        表示名 (Display Name)
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          disabled={!isEditing}
                          value={formData.display_name}
                          onChange={(e) => handleChange("display_name", e.target.value)}
                          className={`block w-full rounded-md sm:text-sm p-2 border ${isEditing ? "border-slate-300 dark:border-slate-600 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" : "bg-slate-50 dark:bg-slate-900 border-transparent text-slate-900 dark:text-slate-50"}`}
                        />
                      </div>
                    </div>

                    {/* Location (New Field) */}
                    <div className="sm:col-span-3">
                      <label className="block text-sm font-medium text-slate-700 flex items-center gap-1">
                        <MapPin size={14} /> 居住地 (Location)
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          disabled={!isEditing}
                          value={formData.location}
                          onChange={(e) => handleChange("location", e.target.value)}
                          className={`block w-full rounded-md sm:text-sm p-2 border ${isEditing ? "border-slate-300 dark:border-slate-600 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" : "bg-slate-50 dark:bg-slate-900 border-transparent text-slate-900 dark:text-slate-50"}`}
                          placeholder="例: 東京都, 日本"
                        />
                      </div>
                    </div>

                    {/* Generation (New Field) */}
                    <div className="sm:col-span-3">
                      <label className="block text-sm font-medium text-slate-700 flex items-center gap-1">
                        <Activity size={14} /> 生誕世代 (Generation)
                      </label>
                      <div className="mt-1">
                        {isEditing ? (
                          <select
                            value={formData.birth_generation}
                            onChange={(e) => handleChange("birth_generation", e.target.value)}
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
                          onChange={(e) => handleChange("statement", e.target.value)}
                          className={`block w-full rounded-md sm:text-sm p-2 border ${isEditing ? "border-slate-300 dark:border-slate-600 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" : "bg-slate-50 dark:bg-slate-900 border-transparent text-slate-900 dark:text-slate-50"}`}
                        />
                      </div>
                    </div>
                  </div>
                </section>

                <hr className="border-slate-200 dark:border-slate-800" />

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
                            onChange={(e) => handleChange("mother_tongue_code", e.target.value)}
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
                              LANGUAGES_MOCK.find((l) => l.id === formData.mother_tongue_code)
                                ?.native_name
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
                            onChange={(e) => handleChange("site_language_code", e.target.value)}
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
                              LANGUAGES_MOCK.find((l) => l.id === formData.site_language_code)
                                ?.native_name
                            }
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* Security Tab (Placeholder based on Chapter 5 ACCOUNT_PROVIDERS) */}
            {activeTab === "security" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <section>
                  <h3 className="text-lg leading-6 font-medium text-slate-900 dark:text-slate-50 mb-4">
                    認証プロバイダ連携
                  </h3>
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-md p-4 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white dark:bg-slate-700 rounded-full border border-slate-200 dark:border-slate-600 flex items-center justify-center shadow-sm">
                          <Image
                            src="https://www.google.com/favicon.ico"
                            alt="Google"
                            width={20}
                            height={20}
                            className="w-5 h-5"
                            unoptimized
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                            Google Account
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            user@example.com
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                          連携中
                        </span>
                        <span className="text-xs text-slate-400">Primary</span>
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg leading-6 font-medium text-slate-900 dark:text-slate-50 mb-4">
                    アカウントセキュリティ
                  </h3>
                  <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700 dark:text-yellow-200">
                          2要素認証 (2FA) が未設定です。セキュリティ強化のために設定を推奨します。
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* Audit Tab (Based on Chapter 9: Logs & Audit) */}
            {activeTab === "audit" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-slate-900 dark:text-slate-50">
                    最近の認証イベント (AUTH_EVENTS)
                  </h3>
                  <button className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
                    全ログを表示
                  </button>
                </div>

                <div className="flex flex-col">
                  <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                      <div className="shadow overflow-hidden border-b border-slate-200 dark:border-slate-800 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                          <thead className="bg-slate-50 dark:bg-slate-900">
                            <tr>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                              >
                                日時
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                              >
                                イベント
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                              >
                                IPアドレス
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                              >
                                ステータス
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
                            {[
                              {
                                date: "2024-05-20 09:30:00",
                                event: "LOGIN",
                                ip: "192.168.1.1",
                                status: "Success",
                              },
                              {
                                date: "2024-05-19 18:45:12",
                                event: "PROFILE_UPDATE",
                                ip: "192.168.1.1",
                                status: "Success",
                              },
                              {
                                date: "2024-05-18 10:15:00",
                                event: "LOGIN",
                                ip: "192.168.1.1",
                                status: "Success",
                              },
                              {
                                date: "2024-05-15 14:20:55",
                                event: "LOGIN_FAILED",
                                ip: "203.0.113.42",
                                status: "Failed",
                              },
                            ].map((log, idx) => (
                              <tr key={idx}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                  {log.date}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">
                                  {log.event}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                  {log.ip}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {log.status === "Success" ? (
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                      Success
                                    </span>
                                  ) : (
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                      Failed
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer / Debug Info */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-xs text-slate-400 dark:text-slate-500">
        <p>Root Account System v1.0.0-prototype</p>
        <p className="mt-1">Schema Version: 0100-100-4-extended</p>
      </footer>
    </div>
  );
}
