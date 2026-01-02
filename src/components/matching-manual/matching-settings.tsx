/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/display-name */
"use client";
import {
  ChevronLeft,
  Save,
  Play,
  AlertTriangle,
  CheckCircle,
  Menu,
  X,
  ArrowDown,
} from "lucide-react";
import React, { useState, useCallback } from "react";

// --- ダミーデータ ---
const VALUE_OPTIONS = [
  { key: "freedom", label: "自由" },
  { key: "equality", label: "平等" },
  { key: "safety", label: "安全" },
  { key: "adventure", label: "冒険" },
];

const GENRE_OPTIONS = [
  "フィクション",
  "ファンタジー",
  "SF",
  "ノンフィクション",
  "ホラー",
  "ミステリー",
];

const SKILL_OPTIONS = [
  "プログラミング",
  "デザイン",
  "ライティング",
  "イラスト",
  "音楽",
];

const REGION_OPTIONS = ["すべて", "日本", "北米", "欧州", "その他"];

const GENERATION_OPTIONS = [
  "すべて",
  "1960年代",
  "1970年代",
  "1980年代",
  "1990年代",
  "2000年代",
];

// --- ヘルパーコンポーネント ---

/**
 * カスタムスライダーのバー表示
 * @param {number} percentage - 現在のパーセンテージ (0-100)
 */
const ValueBar = React.memo(({ percentage }: { percentage: number }) => {
  // 5%刻みの表示をシミュレート
  const totalBlocks = 10;
  const filledBlocks = Math.round((percentage / 100) * totalBlocks);
  const barDisplay =
    "■".repeat(filledBlocks) + "□".repeat(totalBlocks - filledBlocks);

  return (
    <span className="font-mono text-sm tracking-widest text-primary-600 dark:text-primary-400">
      {barDisplay}
    </span>
  );
});

/**
 * 通知メッセージコンポーネント
 */
const Notification = ({
  message,
  type,
  onClose,
}: {
  message: string;
  type: string;
  onClose: () => void;
}) => {
  if (!message) return null;

  let bgColor = "bg-green-500";
  let Icon = CheckCircle;

  if (type === "error") {
    bgColor = "bg-red-500";
    Icon = AlertTriangle;
  }

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 max-w-lg w-11/12 p-4 rounded-lg shadow-2xl z-50 transition-all duration-300 ${bgColor} text-white flex items-center space-x-3`}
    >
      <Icon className="w-6 h-6 flex-shrink-0" />
      <p className="flex-grow text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="p-1 rounded-full hover:bg-white/20 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

// --- メインコンポーネント ---

const MatchingSettings = () => {
  // マッチング設定の状態管理
  const [settings, setSettings] = useState(() => {
    // 初期状態をダミーデータから設定
    const initialValueImportance = VALUE_OPTIONS.reduce(
      (acc, val) => {
        acc[val.key] =
          val.key === "equality"
            ? 80
            : val.key === "safety"
              ? 20
              : val.key === "adventure"
                ? 70
                : 50;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      valueImportance: initialValueImportance,
      genreFilters: [
        "フィクション",
        "ファンタジー",
        "ノンフィクション",
        "ミステリー",
      ],
      skillFilters: ["プログラミング", "デザイン", "イラスト"],
      regionFilter: "日本",
      generationFilter: "1980年代",
    };
  });

  // UIの状態管理
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isStartingMatching, setIsStartingMatching] = useState(false);

  // 設定値の更新ハンドラ
  const handleChange = useCallback((key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  // 価値観スライダーの更新ハンドラ
  const handleValueChange = useCallback((valueKey: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      valueImportance: {
        ...prev.valueImportance,
        [valueKey]: parseInt(value, 10),
      },
    }));
  }, []);

  // チェックボックス (ジャンル/スキル) の更新ハンドラ
  const handleCheckboxChange = useCallback(
    (key: string, item: string, isChecked: boolean) => {
      setSettings((prev: any) => {
        const currentArray = prev[key];
        const newArray = isChecked
          ? [...currentArray, item]
          : currentArray.filter((i: any) => i !== item);
        return {
          ...prev,
          [key]: newArray,
        };
      });
    },
    []
  );

  // 通知を閉じる
  const closeNotification = useCallback(() => {
    setNotification({ message: "", type: "" });
  }, []);

  // 設定保存のシミュレーション
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    closeNotification();

    // バリデーション: 少なくとも1つの条件を選択
    if (
      settings.genreFilters.length === 0 ||
      settings.skillFilters.length === 0
    ) {
      setNotification({
        message: "⚠️ 少なくとも一つのジャンルとスキルを選択してください。",
        type: "error",
      });
      setIsSaving(false);
      return;
    }

    // Supabase APIコールをシミュレート (2秒間の遅延)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      // 成功シミュレーション
      setNotification({ message: "✅ 設定を保存しました!", type: "success" });
      // 失敗シミュレーション (ランダムに失敗させることも可能だが、今回は成功とする)
      // throw new Error("保存失敗");
    } catch (_error) {
      setNotification({
        message: "⚠️ 設定の保存に失敗しました。もう一度お試しください。",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  }, [settings, closeNotification]);

  // マッチング開始のシミュレーション
  const handleStartMatching = useCallback(async () => {
    setIsStartingMatching(true);
    closeNotification();

    // 1. 設定を保存する (保存ロジックを再利用)
    // バリデーション
    if (
      settings.genreFilters.length === 0 ||
      settings.skillFilters.length === 0
    ) {
      setNotification({
        message: "⚠️ 少なくとも一つのジャンルとスキルを選択してください。",
        type: "error",
      });
      setIsStartingMatching(false);
      return;
    }

    // 保存シミュレーション
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setNotification({ message: "✅ 設定を保存しました!", type: "success" });

    // 2. マッチング処理をシミュレート
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      // 成功シミュレーション
      // 実際はここで `/matching/results` へ遷移する
      setNotification({
        message: "マッチングを開始し、結果画面へ遷移します...",
        type: "success",
      });
    } catch (_error) {
      setNotification({
        message: "⚠️ マッチング処理に失敗しました。もう一度お試しください。",
        type: "error",
      });
    } finally {
      setIsStartingMatching(false);
    }
  }, [settings, closeNotification]);

  // UIを構成するセクションタイトル
  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <>
      <div className="flex items-center space-x-2 my-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          {children}
        </h2>
      </div>
      <div className="h-0.5 w-full bg-primary-200 dark:bg-gray-700 -mt-2 mb-8" />
    </>
  );

  // 価値観の重要度設定セクション
  const ValueImportanceSection = () => (
    <div className="space-y-6">
      <SectionTitle>【価値観の重要度】</SectionTitle>
      {VALUE_OPTIONS.map(({ key, label }) => {
        const percentage = settings.valueImportance[key] || 50;
        return (
          <div
            key={key}
            className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm"
          >
            <label
              htmlFor={`slider-${key}`}
              className="w-full sm:w-32 font-medium text-gray-700 dark:text-gray-300"
            >
              価値観（{label}）:
            </label>
            <div className="flex items-center flex-grow space-x-4">
              <input
                id={`slider-${key}`}
                type="range"
                min="0"
                max="100"
                step="1"
                value={percentage}
                onChange={(e) => handleValueChange(key, e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg dark:bg-gray-700 accent-primary-500"
              />
              <div className="w-32 text-right flex items-center space-x-2">
                <ValueBar percentage={percentage} />
                <span className="font-semibold text-primary-600 dark:text-primary-400 min-w-[40px] text-right">
                  {percentage}%
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  // チェックボックスセクションの汎用コンポーネント
  const CheckboxGroup = ({
    title,
    options,
    stateKey,
    currentSelections,
  }: {
    title: string;
    options: string[];
    stateKey: string;
    currentSelections: string[];
  }) => (
    <div className="space-y-4">
      <SectionTitle>{title}</SectionTitle>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {options.map((item) => (
          <label
            key={item}
            className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors border-2 ${
              currentSelections.includes(item)
                ? "bg-primary-100 dark:bg-primary-900/50 border-primary-500 text-primary-700 dark:text-primary-300 shadow-md"
                : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            <input
              type="checkbox"
              checked={currentSelections.includes(item)}
              onChange={(e) =>
                handleCheckboxChange(stateKey, item, e.target.checked)
              }
              className="form-checkbox h-5 w-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:checked:bg-primary-600 dark:checked:border-primary-600"
            />
            <span className="ml-3 text-sm font-medium">{item}</span>
          </label>
        ))}
      </div>
    </div>
  );

  // その他の設定セクション
  const OtherSettingsSection = () => (
    <div className="space-y-6">
      <SectionTitle>【その他の設定】</SectionTitle>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-inner">
        {/* 地域ドロップダウン */}
        <div className="flex flex-col space-y-2">
          <label
            htmlFor="region-select"
            className="font-medium text-gray-700 dark:text-gray-300"
          >
            地域
          </label>
          <div className="relative">
            <select
              id="region-select"
              value={settings.regionFilter}
              onChange={(e) => handleChange("regionFilter", e.target.value)}
              className="w-full appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 px-4 pr-10 text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition duration-150"
            >
              {REGION_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ArrowDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* 世代ドロップダウン */}
        <div className="flex flex-col space-y-2">
          <label
            htmlFor="generation-select"
            className="font-medium text-gray-700 dark:text-gray-300"
          >
            世代
          </label>
          <div className="relative">
            <select
              id="generation-select"
              value={settings.generationFilter}
              onChange={(e) => handleChange("generationFilter", e.target.value)}
              className="w-full appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 px-4 pr-10 text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition duration-150"
            >
              {GENERATION_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ArrowDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );

  // ヘッダーとフッター (ダミー)
  const Header = () => (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        <div className="text-2xl font-extrabold text-primary-600 dark:text-primary-400">
          NextMatch
        </div>
        <button
          className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors rounded-lg"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="hidden md:flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            ユーザー名
          </span>
          <div className="w-8 h-8 bg-primary-200 dark:bg-primary-700 rounded-full"></div>
        </div>
      </div>
    </header>
  );

  const Sidebar = () => (
    <div className="p-4 space-y-2">
      <SidebarItem label="ホーム" href="#" active={false} />
      <SidebarItem label="マッチング" href="#" active={true} />
      <SidebarItem label="プロジェクト" href="#" active={false} />
      <SidebarItem label="プロフィール" href="#" active={false} />
    </div>
  );

  const SidebarItem = ({
    label,
    active,
  }: {
    label: string;
    active: boolean;
    href: string;
  }) => (
    <a
      href="#"
      className={`flex items-center p-3 rounded-lg transition-colors text-sm font-medium ${
        active
          ? "bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-200"
          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
      }`}
    >
      {label}
    </a>
  );

  const Footer = () => (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-12 py-4">
      <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; 2024 NextMatch. All rights reserved. | プライバシーポリシー
      </div>
    </footer>
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 antialiased font-sans">
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={closeNotification}
      />
      <Header />

      <div className="flex max-w-7xl mx-auto">
        {/* サイドバー (PC) */}
        <aside className="hidden md:block w-64 lg:w-72 border-r border-gray-200 dark:border-gray-700 flex-shrink-0 bg-white dark:bg-gray-900 pt-6">
          <Sidebar />
        </aside>

        {/* メインコンテンツ */}
        <main className="flex-grow p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto space-y-10">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">
              マッチング設定
            </h1>

            {/* ナビゲーション */}
            <div className="flex justify-start mb-10">
              <a
                href="/matching/results" // 遷移先シミュレーション
                className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                戻る
              </a>
            </div>

            {/* 1. 価値観の重要度設定 */}
            <ValueImportanceSection />

            {/* 2. 作品ジャンルの優先度設定 */}
            <CheckboxGroup
              title="【作品ジャンルの優先度】"
              options={GENRE_OPTIONS}
              stateKey="genreFilters"
              currentSelections={settings.genreFilters}
            />

            {/* 3. スキルの絞り込み設定 */}
            <CheckboxGroup
              title="【スキルの絞り込み】"
              options={SKILL_OPTIONS}
              stateKey="skillFilters"
              currentSelections={settings.skillFilters}
            />

            {/* 4. その他の設定 */}
            <OtherSettingsSection />

            {/* ボタンエリア */}
            <div className="pt-8 flex flex-col sm:flex-row justify-center sm:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={handleSave}
                disabled={isSaving || isStartingMatching}
                className={`flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-colors duration-300 border-2 ${
                  isSaving
                    ? "bg-gray-400 text-white"
                    : "border-primary-500 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/50"
                }`}
              >
                <Save className="w-5 h-5 mr-2" />
                {isSaving ? "保存中..." : "保存する"}
              </button>
              <button
                onClick={handleStartMatching}
                disabled={isSaving || isStartingMatching}
                className={`flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-colors duration-300 shadow-lg ${
                  isStartingMatching
                    ? "bg-primary-700"
                    : "bg-primary-600 hover:bg-primary-700"
                } text-white`}
              >
                <Play className="w-5 h-5 mr-2" />
                {isStartingMatching ? "マッチング処理中..." : "マッチング開始"}
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* モバイル用サイドバーオーバーレイ */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        >
          <div
            className="fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 shadow-xl p-4 transform transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end">
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <Sidebar />
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default MatchingSettings;
