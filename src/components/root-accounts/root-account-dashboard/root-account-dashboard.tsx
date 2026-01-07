"use client";

import * as Slider from "@radix-ui/react-slider";
import {
  User,
  MapPin,
  Globe,
  Shield,
  Activity,
  Edit3,
  Save,
  AlertCircle,
  Clock,
  Plus,
  Trash2,
  X,
  AlertTriangle,
  Trophy,
  Star,
  Medal,
  Crown,
} from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { getZodiacSymbol } from "../../../lib/anonymous-name-generator";
import {
  normalizeRootAccountData,
  timeToHours,
  hoursToTime,
  AREA_DEFINITIONS,
} from "../../../lib/root-account-utils";
import { PointManagementSection } from "./point-management";
import {
  LANGUAGES_MOCK,
  COUNTRIES_MOCK,
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
  // データの正規化（旧スキーマからの変換対応）
  const normalizedData = normalizeRootAccountData(data);

  const [formData, setFormData] = useState<RootAccount>(normalizedData);
  const [originalData, setOriginalData] = useState<RootAccount>(normalizedData);
  const [selectedArea, setSelectedArea] = useState<number | null>(
    normalizedData.activity_area_id ?? null
  );
  const [originalArea, setOriginalArea] = useState<number | null>(
    normalizedData.activity_area_id ?? null
  );
  const [areaHistory, setAreaHistory] = useState<
    { from: number | string; to: number | string; at: string }[]
  >([]);

  // 全履歴モーダル表示用
  const [showAllHistory, setShowAllHistory] = useState(false);

  // 編集モード
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingCoreHours, setIsEditingCoreHours] = useState(false);
  const [isEditingLanguages, setIsEditingLanguages] = useState(false);
  const [isEditingCountries, setIsEditingCountries] = useState(false);

  // 第二コア活動時間の有効/無効状態
  const [isSubCoreHourEnabled, setIsSubCoreHourEnabled] = useState(
    !!(normalizedData.core_hours_2_start && normalizedData.core_hours_2_end)
  );

  // ローディング状態
  const [isLoading, setIsLoading] = useState(false);

  const [generationHistory, setGenerationHistory] = useState<
    { from: string; to: string; at: string }[]
  >([]);

  const generationOptions = [
    "1940-1945",
    "1945-1950",
    "1950-1955",
    "1955-1960",
    "1960-1965",
    "1965-1970",
    "1970-1975",
    "1975-1980",
    "1980-1985",
    "1985-1990",
    "1990-1995",
    "1995-2000",
    "2000-2005",
    "2005-2010",
    "2010-2015",
    "2015-2020",
    "2020-2026",
  ];

  const [profiles] = useState<UserProfileSummary[]>(dummyUserProfileList);

  // 日またぎ用の状態（翌日の終了時刻を保持）
  const [nextDayEndHour, setNextDayEndHour] = useState<number>(0);
  const [nextDayEndHour2, setNextDayEndHour2] = useState<number>(0);

  // 画像エラー状態
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  // クールダウン用ステート (残り秒数)
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(0);

  const handleChange = <K extends keyof RootAccount>(
    field: K,
    value: RootAccount[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerationChange = (newValue: string) => {
    handleChange("birth_generation", newValue);
  };

  // 保存処理（API実装予定）
  const handleSave = async () => {
    setIsLoading(true);
    try {
      // TODO: 実際のAPI呼び出しを実装
      // await updateRootAccount(formData);

      // 生誕世代の履歴保存
      if (originalData.birth_generation !== formData.birth_generation) {
        setGenerationHistory((prev) => [
          ...prev,
          {
            from: originalData.birth_generation || "未設定",
            to: formData.birth_generation || "未設定",
            at: new Date().toISOString(),
          },
        ]);
      }

      // 保存成功後、元データを更新
      setOriginalData(formData);
      setIsEditing(false);
      alert("変更を保存しました");
    } catch (error) {
      console.error("保存エラー:", error);
      alert("保存に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  // エリア設定の保存
  const handleSaveArea = async (
    targetArea: number = selectedArea || 0,
    _targetStart: string = formData.core_hours_start,
    _targetEnd: string = formData.core_hours_end
  ) => {
    // クールダウン中は実行しない（念のため）
    if (cooldownRemaining > 0) return;

    setIsLoading(true);

    // クールダウン設定 (10秒)
    setCooldownRemaining(10);
    const timer = setInterval(() => {
      setCooldownRemaining((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    try {
      // TODO: 実際のAPI呼び出しを実装

      setAreaHistory((prev) => {
        const newHistory = [
          ...prev,
          {
            from:
              originalArea &&
              AREA_DEFINITIONS[originalArea as keyof typeof AREA_DEFINITIONS]
                ? AREA_DEFINITIONS[
                    originalArea as keyof typeof AREA_DEFINITIONS
                  ].name
                : "未設定",
            to:
              targetArea &&
              AREA_DEFINITIONS[targetArea as keyof typeof AREA_DEFINITIONS]
                ? AREA_DEFINITIONS[targetArea as keyof typeof AREA_DEFINITIONS]
                    .name
                : "未設定",
            at: new Date().toISOString(),
          },
        ];
        // 1000件保持制限
        return newHistory.slice(-1000);
      });
      setOriginalArea(targetArea);
      if (targetArea) {
        handleChange("activity_area_id", targetArea);
      }

      // コアタイムも更新されたものとして扱う（本来はAPIで保存される）
      // ここではformDataは更新されていないが、サーバー側で保存されたとみなす。
      // 必要ならhandleChangeでstateも更新すべきだが、onClick側で更新済み想定。

      alert("エリア設定を保存しました（変更は10秒間制限されます）");
    } catch (error) {
      console.error("保存エラー:", error);
      alert("保存に失敗しました");
      // エラー時はクールダウン解除
      setCooldownRemaining(0);
      clearInterval(timer);
    } finally {
      setIsLoading(false);
    }
  };

  // 言語設定の保存
  const handleSaveLanguages = async () => {
    setIsLoading(true);
    try {
      // TODO: 実際のAPI呼び出しを実装

      setOriginalData(formData);
      setIsEditingLanguages(false);
      alert("言語設定を保存しました");
    } catch (error) {
      console.error("保存エラー:", error);
      alert("保存に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  // アクティブ時間（連絡OK）の保存
  const handleSaveCoreHours = async () => {
    setIsLoading(true);
    try {
      // TODO: 実際のAPI呼び出しを実装

      // 無効化されている場合はデータをクリアする
      if (!isSubCoreHourEnabled) {
        setFormData((prev) => ({
          ...prev,
          core_hours_2_start: undefined,
          core_hours_2_end: undefined,
        }));
      }

      setOriginalData(formData);
      setIsEditingCoreHours(false);
      alert("活動時間を保存しました");
    } catch (error) {
      console.error("保存エラー:", error);
      alert("保存に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  // VNS管理国の保存
  const handleSaveCountries = async () => {
    setIsLoading(true);
    try {
      // TODO: 実際のAPI呼び出しを実装

      setIsEditingCountries(false);
      alert("管理国設定を保存しました");
    } catch (error) {
      console.error("保存エラー:", error);
      alert("保存に失敗しました");
    } finally {
      setIsLoading(false);
    }
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
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                {(() => {
                  const symbol = getZodiacSymbol(formData.zodiac_sign);
                  return symbol ? (
                    <span
                      className="text-xl leading-none select-none"
                      role="img"
                      aria-label={formData.zodiac_sign}
                    >
                      {symbol}
                    </span>
                  ) : (
                    <User
                      size={18}
                      className="text-slate-500 dark:text-slate-400"
                    />
                  );
                })()}
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
              <a
                href="/user-profiles/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow transition-colors"
              >
                <Plus size={16} />
                プロフィール作成
              </a>
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

          {/* Points Card Removed - Replaced by PointManagementSection */}

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
          {/* Detailed Point Management Section */}
          <PointManagementSection data={formData} />

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
                <Edit3 size={14} />
                編集
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
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            profile.role_type === "leader"
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

            <div className="mt-4 flex justify-center">
              <a
                href="/user-profiles/new"
                className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-md text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                <Plus size={16} />
                新規作成
              </a>
            </div>
          </div>

          {/* VNS管理国一覧セクション */}
          <div className="bg-white dark:bg-slate-900 shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg leading-6 font-medium text-slate-900 dark:text-slate-50 flex items-center gap-2">
                  <Globe size={20} className="text-slate-400" />
                  VNS 管理国一覧
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  このアカウントが管理しているVNS内の国・地域
                </p>
              </div>
              <button
                onClick={() => {
                  if (isEditingCountries) {
                    void handleSaveCountries();
                  } else {
                    setIsEditingCountries(true);
                  }
                }}
                disabled={isLoading}
                className={`flex items-center gap-2 px-3 py-1.5 border border-transparent rounded-md shadow-sm text-xs font-medium text-white disabled:opacity-50 transition-colors duration-200 ${isEditingCountries ? "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700" : "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700"}`}
              >
                {isEditingCountries ? <Save size={14} /> : <Edit3 size={14} />}
                {isEditingCountries ? "保存" : "編集"}
              </button>
            </div>

            {isEditingCountries && (
              <div className="mb-4 text-xs text-slate-600 dark:text-slate-300 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-md px-3 py-2">
                国・地域の管理を編集モードに切り替えました。ここで登録・解除の操作ができます（実装予定）。
              </div>
            )}

            <div className="space-y-4">
              {COUNTRIES_MOCK.map((country) => (
                <div
                  key={country.code}
                  className="bg-slate-50 dark:bg-slate-800/50 overflow-hidden shadow-sm rounded-lg border border-slate-200 dark:border-slate-700 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-3xl" aria-hidden>
                        {country.flag}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-medium text-slate-900 dark:text-white truncate">
                            {country.name}
                          </h4>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100">
                            {country.code}
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-100">
                            {country.region}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 truncate">
                          管理中の国 / VNS domain
                        </p>
                      </div>
                    </div>
                    <div>
                      <button className="text-xs text-indigo-600 hover:text-indigo-500 font-medium">
                        詳細
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {COUNTRIES_MOCK.length === 0 && (
                <div className="text-center py-4 text-sm text-slate-500">
                  管理中の国はまだ登録されていません
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-center">
              <a
                href="/user-profiles/new"
                className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-md text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                <Plus size={16} />
                新規作成
              </a>
            </div>
          </div>

          {/* 世界地図セクション */}
          <div className="bg-white dark:bg-slate-900 shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg leading-6 font-medium text-slate-900 dark:text-slate-50 flex items-center gap-2">
                  <MapPin size={20} className="text-slate-400" />
                  現在地・居住地
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  活動エリアを選択してください
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(
              Object.entries(AREA_DEFINITIONS) as [
                string,
                (typeof AREA_DEFINITIONS)[keyof typeof AREA_DEFINITIONS],
              ][]
            ).map(([key, def]) => {
              const areaNum = Number(key);
              return (
                <div
                  key={areaNum}
                  onClick={() => {
                    if (cooldownRemaining > 0) {
                      alert(
                        `連続で変更できません。あと${cooldownRemaining}秒お待ちください。`
                      );
                      return;
                    }

                    setSelectedArea(areaNum);
                    const def =
                      AREA_DEFINITIONS[
                        areaNum as keyof typeof AREA_DEFINITIONS
                      ];

                    // 楽観的更新のためにstateをセットするが、実際には別途Saveが必要だったものを即時実行へ変更
                    // ここでステート更新と同時に保存処理も呼ぶ必要があるが、
                    // handleSaveAreaは現在のstate(selectedArea)を使うため、
                    // Reactのstate更新遅延を考慮して、引数を受け取れるようにするか、
                    // useEffectで監視するか、あるいは非同期でawaitするか。
                    // 今回はシンプルに、setState後に即時関数呼び出しはできないため、
                    // 専用の即時保存関数を用意するか、useEffectでトリガーするのが正しいが、
                    // 既存のhandleSaveAreaを再利用したい。
                    // handleSaveArea内部でformData.core_hours...を参照しているため、
                    // ここで時間も更新してから保存する必要がある。

                    let newStart = formData.core_hours_start;
                    let newEnd = formData.core_hours_end;

                    if (def?.defaultCoreHours) {
                      newStart = def.defaultCoreHours.start;
                      handleChange("core_hours_start", newStart);

                      newEnd =
                        def.defaultCoreHours.end === "24:00"
                          ? "24:00"
                          : def.defaultCoreHours.end;
                      handleChange("core_hours_end", newEnd);

                      // エリア変更時は必ずリセット

                      setNextDayEndHour(0);
                    }

                    // 即時保存実行 (引数でエリアと時間を渡せるようにhandleSaveAreaを改造するか、
                    // ここでAPIを直接呼ぶかだが、既存ロジックが大きいので
                    // setStateが反映されるのを待つより、ロジックを直書きしたほうが安全)
                    // しかしもっと簡単なのは、handleSaveAreaを「引数有り」に対応させること。

                    // ここでは `handleSaveArea` をこのスコープで呼び出しても `selectedArea` は古いまま。
                    // よって、handleSaveArea に引数を追加して対応する。
                    void handleSaveArea(areaNum, newStart, newEnd);
                  }}
                  className={`
                    relative cursor-pointer rounded-lg overflow-hidden
                    transition-all duration-300 ease-in-out
                    flex flex-col h-full
                    hover:-translate-y-2 hover:shadow-xl
                    ${
                      selectedArea === areaNum
                        ? "ring-4 ring-indigo-500 shadow-lg scale-105"
                        : "ring-1 ring-slate-200 dark:ring-slate-700"
                    }
                  `}
                >
                  <div
                    className={`
                    bg-slate-100 dark:bg-slate-800 p-4 relative aspect-[4/3]
                    ${selectedArea === areaNum ? "opacity-100" : "opacity-75"}
                  `}
                  >
                    {imageErrors.has(areaNum) ? (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <div className="text-center">
                          <MapPin size={48} className="mx-auto mb-2" />
                          <p className="text-sm">地図画像を読み込めません</p>
                        </div>
                      </div>
                    ) : (
                      <Image
                        src={`/world/area${areaNum}.svg`}
                        alt={def.name}
                        fill
                        className="object-cover"
                        priority={areaNum === 1}
                        onError={() => {
                          setImageErrors((prev) => new Set(prev).add(areaNum));
                        }}
                      />
                    )}
                  </div>
                  {/* Description Part */}
                  <div className="p-4 bg-white dark:bg-slate-800 flex-1 border-t border-slate-100 dark:border-slate-700">
                    <div className="mb-3">
                      <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {def.name}
                      </h4>
                      {selectedArea === areaNum && (
                        <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-1">
                          選択中
                        </p>
                      )}
                    </div>
                    {def.defaultCoreHours && (
                      <div className="flex flex-col gap-1 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/30 px-3 py-2 rounded border border-slate-100 dark:border-slate-800/50">
                        <div className="flex items-center gap-2 font-semibold text-indigo-600 dark:text-indigo-400">
                          <Clock size={12} />
                          <span>
                            UTC: {def.defaultCoreHours.start} -{" "}
                            {def.defaultCoreHours.end === "24:00"
                              ? "24:00"
                              : def.defaultCoreHours.end}
                          </span>
                        </div>
                        <div className="pl-5 text-slate-500 dark:text-slate-500">
                          現地: {(() => {
                            const formatInTimezone = (
                              timeStr: string,
                              tz: string
                            ) => {
                              const [h, m] = timeStr.split(":").map(Number);
                              const d = new Date();
                              d.setUTCHours(h);
                              d.setUTCMinutes(m || 0);
                              return new Intl.DateTimeFormat("ja-JP", {
                                hour: "2-digit",
                                minute: "2-digit",
                                timeZone: tz,
                              }).format(d);
                            };
                            const startLocal = formatInTimezone(
                              def.defaultCoreHours.start,
                              def.timezone
                            );
                            // endが24:00の場合は00:00として計算して表示上調整するか、単純に00:00で計算
                            const endHourStr =
                              def.defaultCoreHours.end === "24:00"
                                ? "00:00"
                                : def.defaultCoreHours.end;
                            const endLocal = formatInTimezone(
                              endHourStr,
                              def.timezone
                            );
                            return `${startLocal} - ${endLocal}`;
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {selectedArea && (
            <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
              <p className="text-sm text-indigo-900 dark:text-indigo-100">
                <span className="font-semibold">エリア {selectedArea}</span>{" "}
                が選択されています
              </p>
            </div>
          )}

          {/* エリア変更履歴 */}
          <div className="mt-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md p-3">
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                エリアの変更履歴（最新5件）
              </p>
              {areaHistory.length > 5 && (
                <button
                  onClick={() => setShowAllHistory(true)}
                  className="text-[11px] text-indigo-600 hover:text-indigo-500 font-medium"
                >
                  すべて表示
                </button>
              )}
            </div>
            {areaHistory.length > 0 ? (
              <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                {areaHistory
                  .slice()
                  .reverse()
                  .slice(0, 5) // 最新5件のみ表示
                  .map((entry, idx) => (
                    <li
                      key={`${entry.at}-${idx}`}
                      className="flex justify-between gap-2"
                    >
                      <span>
                        エリア {entry.from} → エリア {entry.to}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {new Date(entry.at).toLocaleString("ja-JP")}
                      </span>
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                変更履歴はまだありません
              </p>
            )}
          </div>

          {/* 全履歴表示モーダル */}
          {showAllHistory && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
              <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-xl shadow-2xl flex flex-col max-h-[80vh]">
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="text-lg font-bold">エリア変更履歴（全件）</h3>
                  <button
                    onClick={() => setShowAllHistory(false)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <ul className="space-y-3">
                    {areaHistory
                      .slice()
                      .reverse()
                      .map((entry, idx) => (
                        <li
                          key={`modal-${entry.at}-${idx}`}
                          className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700"
                        >
                          <span className="text-sm">
                            エリア {entry.from} → エリア {entry.to}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {new Date(entry.at).toLocaleString("ja-JP")}
                          </span>
                        </li>
                      ))}
                  </ul>
                </div>
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                  <button
                    onClick={() => setShowAllHistory(false)}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-md text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700"
                  >
                    閉じる
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* コア活動時間セクション */}
        <div className="bg-white dark:bg-slate-900 shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg leading-6 font-medium text-slate-900 dark:text-slate-50 flex items-center gap-2">
                <Clock size={20} className="text-slate-400" />
                アクティブ時間（連絡OK）（24時間制）
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 ml-7">
                設定される時間は現地時間です。現地時間で設定してください
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                主な活動時間を選択してください（UTC）。0時をまたぐことも可能です。
              </p>
            </div>
            <button
              onClick={() => {
                if (isEditingCoreHours) {
                  void handleSaveCoreHours();
                } else {
                  setIsEditingCoreHours(true);
                }
              }}
              disabled={isLoading}
              className={`flex items-center gap-2 px-3 py-1.5 border border-transparent rounded-md shadow-sm text-xs font-medium text-white disabled:opacity-50 transition-colors duration-200 ${isEditingCoreHours ? "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700" : "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700"}`}
            >
              {isEditingCoreHours ? <Save size={14} /> : <Edit3 size={14} />}
              {isEditingCoreHours ? "保存" : "編集"}
            </button>
          </div>

          <div className="space-y-8">
            {/* メインスライダー（当日の活動時間） */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    当日の活動時間
                  </label>
                  {selectedArea &&
                    AREA_DEFINITIONS[
                      selectedArea as keyof typeof AREA_DEFINITIONS
                    ] && (
                      <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {
                          AREA_DEFINITIONS[
                            selectedArea as keyof typeof AREA_DEFINITIONS
                          ].name
                        }{" "}
                        現地時間: {(() => {
                          const def =
                            AREA_DEFINITIONS[
                              selectedArea as keyof typeof AREA_DEFINITIONS
                            ];
                          // UTC offset calculation (approximate/static for display)
                          // Ideally use a library like date-fns-tz or luxon, but for now simple mapping or just label
                          // Asia/Tokyo: +9
                          // America/New_York: -5 (EST) / -4 (EDT) -> Let's treat as -5 for now or use Intl
                          // Europe/London: +0 / +1 -> Let's use Intl to be accurate

                          const formatInTimezone = (
                            hours: number,
                            tz: string
                          ) => {
                            const d = new Date();
                            d.setUTCHours(Math.floor(hours));
                            d.setUTCMinutes((hours % 1) * 60);
                            return new Intl.DateTimeFormat("ja-JP", {
                              hour: "2-digit",
                              minute: "2-digit",
                              timeZone: tz,
                            }).format(d);
                          };

                          const startLocal = formatInTimezone(
                            timeToHours(formData.core_hours_start),
                            def.timezone
                          );
                          const endLocal = formatInTimezone(
                            timeToHours(formData.core_hours_end),
                            def.timezone
                          );
                          return `${startLocal} ～ ${endLocal}`;
                        })()}
                      </span>
                    )}
                </div>
                <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                  {hoursToTime(timeToHours(formData.core_hours_start))} ～{" "}
                  {timeToHours(formData.core_hours_end) < 24 ||
                  nextDayEndHour === 0
                    ? hoursToTime(timeToHours(formData.core_hours_end))
                    : "24:00"}
                </span>
              </div>

              {isEditingCoreHours ? (
                (() => {
                  // Timezone Offset Calculation
                  const getOffset = (timezone: string) => {
                    const date = new Date();
                    const utcDate = new Date(
                      date.toLocaleString("en-US", { timeZone: "UTC" })
                    );
                    const tzDate = new Date(
                      date.toLocaleString("en-US", { timeZone: timezone })
                    );
                    return (
                      (tzDate.getTime() - utcDate.getTime()) / (60 * 60 * 1000)
                    );
                  };

                  const currentAreaDef = selectedArea
                    ? AREA_DEFINITIONS[
                        selectedArea as keyof typeof AREA_DEFINITIONS
                      ]
                    : null;
                  const offset = currentAreaDef
                    ? getOffset(currentAreaDef.timezone)
                    : 0;

                  // Helpers for Slider (UTC <-> Local)
                  const toLocal = (utcHours: number) => {
                    let local = utcHours + offset;
                    if (local < 0) local += 24;
                    return local;
                  };

                  const toUTC = (localHours: number) => {
                    let utc = localHours - offset;
                    if (utc < 0) utc += 24;
                    return utc;
                  };

                  const startLocalVal = toLocal(
                    timeToHours(formData.core_hours_start)
                  );
                  let endLocalVal = toLocal(
                    timeToHours(formData.core_hours_end)
                  );

                  if (endLocalVal < startLocalVal) endLocalVal += 24;

                  return (
                    <>
                      <Slider.Root
                        className="relative flex items-center select-none touch-none w-full h-5"
                        value={[startLocalVal, Math.min(endLocalVal, 24)]}
                        onValueChange={(values) => {
                          const newStartUtc = toUTC(values[0]);
                          const newEndLocal = values[1];
                          let newEndUtc = toUTC(newEndLocal);

                          handleChange(
                            "core_hours_start",
                            hoursToTime(newStartUtc)
                          );

                          if (newEndLocal < 24) {
                            handleChange(
                              "core_hours_end",
                              hoursToTime(newEndUtc)
                            );
                            setNextDayEndHour(0);
                          } else {
                            handleChange(
                              "core_hours_end",
                              hoursToTime(newEndUtc)
                            );
                          }
                        }}
                        min={0}
                        max={24}
                        step={0.5}
                        minStepsBetweenThumbs={1}
                        aria-label="Core activity hours"
                      >
                        <Slider.Track className="relative grow rounded-full h-3 bg-slate-200 dark:bg-slate-700">
                          <Slider.Range className="absolute h-full rounded-full bg-indigo-500" />
                        </Slider.Track>
                        <Slider.Thumb
                          className="block w-6 h-6 bg-white dark:bg-slate-800 border-2 border-indigo-500 rounded-full shadow-lg cursor-grab active:cursor-grabbing focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                          aria-label="Start time"
                        />
                        <Slider.Thumb
                          className="block w-6 h-6 bg-white dark:bg-slate-800 border-2 border-indigo-500 rounded-full shadow-lg cursor-grab active:cursor-grabbing focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                          aria-label="End time (same day)"
                        />
                      </Slider.Root>

                      {/* 時間軸ラベル */}
                      <div className="flex justify-between mt-2 text-xs text-slate-500 dark:text-slate-400">
                        <span>0時</span>
                        <span>6時</span>
                        <span>12時</span>
                        <span>18時</span>
                        <span>24時</span>
                      </div>
                    </>
                  );
                })()
              ) : (
                <div className="h-12 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg">
                  <span className="text-xl font-bold text-slate-900 dark:text-slate-50">
                    {hoursToTime(timeToHours(formData.core_hours_start))} ～{" "}
                    {timeToHours(formData.core_hours_end) < 24 ||
                    nextDayEndHour === 0
                      ? hoursToTime(timeToHours(formData.core_hours_end))
                      : "24:00"}
                  </span>
                </div>
              )}
            </div>

            {/* 翌日スライダー（上のスライダーが24時の時のみ有効） */}
            {timeToHours(formData.core_hours_end) >= 24 && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    翌日の終了時間
                  </label>
                  <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    翌日 {hoursToTime(nextDayEndHour)}
                  </span>
                </div>

                {isEditingCoreHours ? (
                  <>
                    <Slider.Root
                      className="relative flex items-center select-none touch-none w-full h-5"
                      value={[nextDayEndHour]}
                      onValueChange={(values) => {
                        setNextDayEndHour(values[0]);
                      }}
                      min={0}
                      max={24}
                      step={0.5}
                      aria-label="Next day end time"
                    >
                      <Slider.Track className="relative grow rounded-full h-3 bg-slate-200 dark:bg-slate-700">
                        <Slider.Range className="absolute h-full rounded-full bg-emerald-500" />
                      </Slider.Track>
                      <Slider.Thumb
                        className="block w-6 h-6 bg-white dark:bg-slate-800 border-2 border-emerald-500 rounded-full shadow-lg cursor-grab active:cursor-grabbing focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                        aria-label="Next day end time"
                      />
                    </Slider.Root>

                    {/* 時間軸ラベル */}
                    <div className="flex justify-between mt-2 text-xs text-slate-500 dark:text-slate-400">
                      <span>0時</span>
                      <span>6時</span>
                      <span>12時</span>
                      <span>18時</span>
                      <span>24時</span>
                    </div>
                  </>
                ) : (
                  <div className="h-12 flex items-center justify-center bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                    <span className="text-xl font-bold text-emerald-900 dark:text-emerald-50">
                      翌日 {hoursToTime(nextDayEndHour)}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* 第二コア活動時間 */}
            <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    第二活動時間（任意）
                  </label>
                </div>

                {/* 有効時の時間表示または無効時のボタン */}
                {isSubCoreHourEnabled ? (
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                      {formData.core_hours_2_start &&
                      formData.core_hours_2_end ? (
                        <>
                          {hoursToTime(
                            timeToHours(formData.core_hours_2_start)
                          )}{" "}
                          ～{" "}
                          {timeToHours(formData.core_hours_2_end) < 24 ||
                          nextDayEndHour2 === 0
                            ? hoursToTime(
                                timeToHours(formData.core_hours_2_end)
                              )
                            : "24:00"}
                        </>
                      ) : (
                        <span className="text-slate-400 text-sm font-normal">
                          設定中...
                        </span>
                      )}
                    </span>
                    {isEditingCoreHours && (
                      <button
                        onClick={() => setIsSubCoreHourEnabled(false)}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                        title="削除"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ) : (
                  // 無効時は「追加」ボタンを表示（編集モードのみ）
                  isEditingCoreHours && (
                    <button
                      onClick={() => {
                        setIsSubCoreHourEnabled(true);
                        // 有効化時の初期値セット (未設定の場合のみ)
                        if (!formData.core_hours_2_start) {
                          handleChange("core_hours_2_start", "21:00");
                          handleChange("core_hours_2_end", "23:00");
                        }
                      }}
                      className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-medium px-2 py-1 bg-indigo-50 hover:bg-indigo-100 rounded"
                    >
                      <Plus size={14} />
                      追加する
                    </button>
                  )
                )}
              </div>

              {/* スライダー表示制御: 編集モードかつ有効な場合 */}
              {isEditingCoreHours && isSubCoreHourEnabled ? (
                <>
                  <Slider.Root
                    className="relative flex items-center select-none touch-none w-full h-5"
                    value={
                      formData.core_hours_2_start && formData.core_hours_2_end
                        ? [
                            timeToHours(formData.core_hours_2_start),
                            Math.min(
                              timeToHours(formData.core_hours_2_end),
                              24
                            ),
                          ]
                        : [21, 23] // デフォルト値
                    }
                    onValueChange={(values) => {
                      handleChange(
                        "core_hours_2_start",
                        hoursToTime(values[0])
                      );
                      if (values[1] < 24) {
                        handleChange(
                          "core_hours_2_end",
                          hoursToTime(values[1])
                        );
                        setNextDayEndHour2(0);
                      } else {
                        handleChange("core_hours_2_end", hoursToTime(24));
                      }
                    }}
                    min={0}
                    max={24}
                    step={0.5}
                    minStepsBetweenThumbs={1}
                    aria-label="Second core activity hours"
                  >
                    <Slider.Track className="relative grow rounded-full h-3 bg-slate-200 dark:bg-slate-700">
                      <Slider.Range className="absolute h-full rounded-full bg-indigo-500 opacity-70" />
                    </Slider.Track>
                    <Slider.Thumb
                      className="block w-6 h-6 bg-white dark:bg-slate-800 border-2 border-indigo-500 rounded-full shadow-lg cursor-grab active:cursor-grabbing focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                      aria-label="Start time 2"
                    />
                    <Slider.Thumb
                      className="block w-6 h-6 bg-white dark:bg-slate-800 border-2 border-indigo-500 rounded-full shadow-lg cursor-grab active:cursor-grabbing focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                      aria-label="End time 2 (same day)"
                    />
                  </Slider.Root>

                  {/* 第二活動時間：翌日スライダー */}
                  {formData.core_hours_2_end &&
                    timeToHours(formData.core_hours_2_end) >= 24 && (
                      <div className="mt-4 pl-4 border-l-2 border-emerald-200 dark:border-emerald-800">
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
                            翌日の終了時間 (第二活動時間)
                          </label>
                          <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                            翌日 {hoursToTime(nextDayEndHour2)}
                          </span>
                        </div>
                        <Slider.Root
                          className="relative flex items-center select-none touch-none w-full h-5"
                          value={[nextDayEndHour2]}
                          onValueChange={(values) => {
                            setNextDayEndHour2(values[0]);
                          }}
                          min={0}
                          max={24}
                          step={0.5}
                          aria-label="Next day end time 2"
                        >
                          <Slider.Track className="relative grow rounded-full h-3 bg-slate-200 dark:bg-slate-700">
                            <Slider.Range className="absolute h-full rounded-full bg-emerald-500" />
                          </Slider.Track>
                          <Slider.Thumb
                            className="block w-6 h-6 bg-white dark:bg-slate-800 border-2 border-emerald-500 rounded-full shadow-lg cursor-grab active:cursor-grabbing focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                            aria-label="Next day end time 2"
                          />
                        </Slider.Root>
                      </div>
                    )}

                  <div className="mt-2 text-xs text-right text-slate-500 dark:text-slate-400">
                    <p>
                      ※ 24時を超える場合は、翌日スライダーで調整してください
                    </p>
                  </div>
                </>
              ) : isEditingCoreHours ? (
                // 編集モードだが無効の場合
                <div className="h-12 flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-dashed border-slate-300 dark:border-slate-700">
                  <span className="text-sm text-slate-400">
                    第2活動時間は無効です
                  </span>
                </div>
              ) : (
                // 表示モード
                <div className="h-12 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg">
                  <span className="text-xl font-bold text-slate-900 dark:text-slate-50">
                    {isSubCoreHourEnabled &&
                    formData.core_hours_2_start &&
                    formData.core_hours_2_end ? (
                      <>
                        {hoursToTime(timeToHours(formData.core_hours_2_start))}{" "}
                        ～{" "}
                        {timeToHours(formData.core_hours_2_end) < 24 ||
                        nextDayEndHour2 === 0
                          ? hoursToTime(timeToHours(formData.core_hours_2_end))
                          : "24:00"}
                      </>
                    ) : (
                      <span className="text-slate-400 text-sm">設定なし</span>
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 活動時間の説明 */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <span className="font-semibold">合計活動時間:</span> {(() => {
                const start1 = timeToHours(formData.core_hours_start);
                const end1 = timeToHours(formData.core_hours_end);
                const total1 =
                  end1 >= 24 && nextDayEndHour > 0
                    ? 24 - start1 + nextDayEndHour
                    : end1 >= start1
                      ? end1 - start1
                      : 24 - start1 + end1;

                let total2 = 0;
                if (
                  isSubCoreHourEnabled && // 有効な場合のみ計算
                  formData.core_hours_2_start &&
                  formData.core_hours_2_end
                ) {
                  const start2 = timeToHours(formData.core_hours_2_start);
                  const end2 = timeToHours(formData.core_hours_2_end);
                  total2 =
                    end2 >= 24 && nextDayEndHour2 > 0
                      ? 24 - start2 + nextDayEndHour2
                      : end2 >= start2
                        ? end2 - start2
                        : 24 - start2 + end2;
                }

                const total = total1 + total2;
                return `${total.toFixed(1)}時間`;
              })()}
            </p>
          </div>

          {/* 8時間超過警告 */}
          {(() => {
            const start1 = timeToHours(formData.core_hours_start);
            const end1 = timeToHours(formData.core_hours_end);
            const total1 =
              end1 >= 24 && nextDayEndHour > 0
                ? 24 - start1 + nextDayEndHour
                : end1 >= start1
                  ? end1 - start1
                  : 24 - start1 + end1;

            let total2 = 0;
            if (
              isSubCoreHourEnabled && // 有効な場合のみ計算
              formData.core_hours_2_start &&
              formData.core_hours_2_end
            ) {
              const start2 = timeToHours(formData.core_hours_2_start);
              const end2 = timeToHours(formData.core_hours_2_end);
              total2 =
                end2 >= 24 && nextDayEndHour2 > 0
                  ? 24 - start2 + nextDayEndHour2
                  : end2 >= start2
                    ? end2 - start2
                    : 24 - start2 + end2;
            }

            const total = total1 + total2;

            return total < 8 ? (
              <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-300 dark:border-amber-700">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                      活動時間が不足しています
                    </p>
                    <p className="text-sm text-amber-800 dark:text-amber-200 mt-1">
                      合計活動時間が8時間を下回っています（{total.toFixed(1)}
                      時間）。
                      信頼性を維持するため、8時間以上の活動を推奨します。
                    </p>
                  </div>
                </div>
              </div>
            ) : null;
          })()}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Basic Info & AI Settings */}
          <div className="space-y-8">
            <div className="bg-white dark:bg-slate-900 shadow rounded-lg p-6">
              {/* Basic Info Section */}
              <section>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-slate-900 dark:text-slate-50 flex items-center gap-2">
                    <User size={20} className="text-slate-400" />
                    ユーザー属性
                  </h3>
                  <button
                    onClick={() => {
                      if (isEditing) {
                        void handleSave();
                      } else {
                        setIsEditing(true);
                      }
                    }}
                    disabled={isLoading}
                    className={`flex items-center gap-2 px-3 py-1.5 border border-transparent rounded-md shadow-sm text-xs font-medium text-white disabled:opacity-50 transition-colors duration-200 ${isEditing ? "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700" : "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700"}`}
                  >
                    {isEditing ? <Save size={14} /> : <Edit3 size={14} />}
                    {isEditing ? "保存" : "編集"}
                  </button>
                </div>
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
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      システム内での一意な識別子です (変更不可)
                    </p>
                  </div>

                  {/* Display Name */}
                  <div className="sm:col-span-6">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
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
                        className={`block w-full rounded-md sm:text-sm p-2 border ${
                          isEditing
                            ? "border-slate-300 dark:border-slate-600 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                            : "bg-slate-50 dark:bg-slate-900 border-transparent text-slate-900 dark:text-slate-50"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Zodiac Sign (Read Only) */}
                  <div className="sm:col-span-6">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <Star size={14} /> 星座 (Zodiac Sign)
                    </label>
                    <div className="mt-1">
                      <div className="block w-full rounded-md sm:text-sm p-2 border border-transparent bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed">
                        {formData.zodiac_sign ? (
                          <span className="flex items-center gap-2">
                            <span className="text-lg leading-none">
                              {getZodiacSymbol(formData.zodiac_sign)}
                            </span>
                            {formData.zodiac_sign}
                          </span>
                        ) : (
                          "未設定"
                        )}
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      アカウント作成時に設定された星座です (変更不可)
                    </p>
                  </div>

                  <div className="sm:col-span-6">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <Activity size={14} /> 生誕世代 (Generation)
                    </label>
                    <div className="mt-1">
                      <select
                        value={formData.birth_generation}
                        disabled={!isEditing}
                        onChange={(e) => handleGenerationChange(e.target.value)}
                        className={`block w-full rounded-md sm:text-sm p-2 border ${
                          isEditing
                            ? "border-slate-300 dark:border-slate-600 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                            : "bg-slate-50 dark:bg-slate-900 border-transparent text-slate-900 dark:text-slate-50"
                        }`}
                      >
                        <option value="">選択してください</option>
                        {generationOptions.map((range) => (
                          <option key={range} value={range}>
                            {range}
                          </option>
                        ))}
                      </select>
                    </div>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      編集ボタンを押して5年区切りで選択できます。近い年代を選んでください。
                    </p>
                    <div className="mt-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md p-3">
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2">
                        生誕世代の変更履歴
                      </p>
                      {generationHistory.length > 0 ? (
                        <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                          {generationHistory
                            .slice()
                            .reverse()
                            .map((entry, idx) => (
                              <li
                                key={`${entry.at}-${idx}`}
                                className="flex justify-between gap-2"
                              >
                                <span>
                                  {entry.from} → {entry.to}
                                </span>
                                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                  {new Date(entry.at).toLocaleString("ja-JP")}
                                </span>
                              </li>
                            ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          変更履歴はまだありません
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Amazon Associate ID */}
                  {formData.amazon_associate_tag && (
                    <div className="sm:col-span-6">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Amazon アソシエイトID
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          disabled={true} // 登録後の変更は不可
                          value={formData.amazon_associate_tag}
                          className="bg-slate-50 dark:bg-slate-900 border-transparent text-slate-500 dark:text-slate-400 block w-full rounded-md sm:text-sm p-2 border cursor-not-allowed"
                        />
                      </div>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Amazonアフィリエイトリンクの生成に使用されるIDです（変更不可）。
                      </p>
                    </div>
                  )}
                </div>
              </section>

              <hr className="border-slate-200 dark:border-slate-800 my-6" />

              {/* Language Settings */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg leading-6 font-medium text-slate-900 dark:text-slate-50 flex items-center gap-2">
                    <Globe size={20} className="text-slate-400" />
                    言語設定
                  </h3>
                  <button
                    onClick={() => {
                      if (isEditingLanguages) {
                        void handleSaveLanguages();
                      } else {
                        setIsEditingLanguages(true);
                      }
                    }}
                    disabled={isLoading}
                    className={`flex items-center gap-2 px-3 py-1.5 border border-transparent rounded-md shadow-sm text-xs font-medium text-white disabled:opacity-50 transition-colors duration-200 ${isEditingLanguages ? "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700" : "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700"}`}
                  >
                    {isEditingLanguages ? (
                      <Save size={14} />
                    ) : (
                      <Edit3 size={14} />
                    )}
                    {isEditingLanguages ? "保存" : "編集"}
                  </button>
                </div>
                {isEditingLanguages && (
                  <div className="mb-4 text-xs text-slate-600 dark:text-slate-300 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-md px-3 py-2">
                    言語設定を編集モードに切り替えました。母語や使用言語の追加・削除、AI翻訳の切替を行えます（実装予定）。
                  </div>
                )}
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      母語 (複数選択可)
                    </label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.mother_tongue_codes.length > 0 ? (
                        formData.mother_tongue_codes.map((code) => {
                          const lang = LANGUAGES_MOCK.find(
                            (l) => l.id === code
                          );
                          return (
                            <span
                              key={code}
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100 border border-indigo-100 dark:border-indigo-800"
                            >
                              <span className="font-semibold">
                                {lang?.native_name ?? code}
                              </span>
                              <span className="ml-1 text-[11px] text-slate-500 dark:text-slate-300">
                                {lang?.name ?? "Unknown"}
                              </span>
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          登録されている母語はありません
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      バイリンガルや多言語話者にも対応できるよう、複数の母語を保持できます。
                    </p>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      使用できる言語 (複数選択可)
                    </label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.available_language_codes.length > 0 ? (
                        formData.available_language_codes.map((code) => {
                          const lang = LANGUAGES_MOCK.find(
                            (l) => l.id === code
                          );
                          return (
                            <span
                              key={code}
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100 border border-emerald-100 dark:border-emerald-800"
                            >
                              <span className="font-semibold">
                                {lang?.native_name ?? code}
                              </span>
                              <span className="ml-1 text-[11px] text-slate-500 dark:text-slate-300">
                                {lang?.name ?? "Unknown"}
                              </span>
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          使用可能な言語はまだ登録されていません
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      UI表示やコミュニケーションで使用する言語を複数登録できます。
                    </p>
                  </div>

                  <div className="sm:col-span-6">
                    <div className="flex items-start justify-between bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                          AI・機械翻訳ツールの常時利用
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          自身の語学力ではなく、AIや翻訳ツールを主に使用して活動する場合はオンにしてください。
                        </p>
                      </div>
                      <label
                        className={`relative inline-flex items-center ${isEditingLanguages ? "cursor-pointer" : "cursor-not-allowed opacity-60"}`}
                      >
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          disabled={!isEditingLanguages}
                          checked={formData.uses_ai_translation}
                          onChange={(e) =>
                            handleChange(
                              "uses_ai_translation",
                              e.target.checked
                            )
                          }
                        />
                        <span className="relative inline-flex items-center w-11 h-6 rounded-full bg-slate-200 dark:bg-slate-600 transition-colors peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 peer-checked:bg-indigo-600 dark:peer-checked:bg-indigo-500 peer-checked:[&>span]:translate-x-5">
                          <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white dark:bg-white shadow transition-transform" />
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </section>
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
                      <p className="text-xs text-slate-500 dark:text-slate-400">
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
                    <button className="text-xs text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
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
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                      {event.event}
                                    </p>
                                  </div>
                                  <div className="text-right text-xs whitespace-nowrap text-slate-500 dark:text-slate-400">
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

        {/* Awards & Rewards Section */}
        <div className="bg-white dark:bg-slate-900 shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg leading-6 font-medium text-slate-900 dark:text-slate-50 flex items-center gap-2">
                <Trophy size={20} className="text-yellow-500" />
                アワード・報奨 (Awards & Rewards)
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                獲得したアワードと報奨の一覧です。
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {formData.awards && formData.awards.length > 0 ? (
              formData.awards.map((award) => (
                <div
                  key={award.id}
                  className="flex items-start p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex-shrink-0 mr-4">
                    {award.icon_type === "trophy" && (
                      <Trophy className="h-8 w-8 text-yellow-500" />
                    )}
                    {award.icon_type === "star" && (
                      <Star className="h-8 w-8 text-indigo-500" />
                    )}
                    {award.icon_type === "medal" && (
                      <Medal className="h-8 w-8 text-orange-500" />
                    )}
                    {award.icon_type === "crown" && (
                      <Crown className="h-8 w-8 text-purple-500" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-50">
                      {award.title}
                    </h4>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {award.description}
                    </p>
                    <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                      {new Date(award.awarded_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-slate-500">
                獲得したアワードはありません
              </div>
            )}
          </div>
        </div>

        {/* Penalty Status Section (Moved to Bottom) */}
        <div className="bg-white dark:bg-slate-900 shadow rounded-lg p-6 border-l-4 border-rose-500">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg leading-6 font-medium text-slate-900 dark:text-slate-50 flex items-center gap-2">
                <AlertTriangle size={20} className="text-rose-500" />
                ペナルティ状況 (Penalty Status)
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                現在のアカウントのペナルティ状況です。
              </p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-rose-50 dark:bg-rose-900/20 rounded-lg">
            <div className="flex-1">
              <dl className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
                  <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Total Penalties
                  </dt>
                  <dd className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                    {formData.penalty_status?.total_penalties ?? 0}
                  </dd>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
                  <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Yellow Cards
                  </dt>
                  <dd className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {formData.penalty_status?.yellow_cards ?? 0}
                  </dd>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
                  <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Drift Count
                  </dt>
                  <dd className="text-2xl font-bold text-slate-600 dark:text-slate-400">
                    {formData.penalty_status?.drift_count ?? 0}
                  </dd>
                </div>
              </dl>
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
