"use client";

import {
  ChevronDown,
  Globe,
  Languages,
  MapPin,
  MessageCircle,
} from "lucide-react";
import Image from "next/image";
import React from "react";
import {
  useOnboarding,
  CULTURAL_SPHERES,
  GENERATIONS,
  LANGUAGE_OPTIONS,
  CORE_ACTIVITY_HOURS,
} from "./onboarding.logic";

export function Onboarding() {
  const { state, actions } = useOnboarding();
  const [hoveredArea, setHoveredArea] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-50">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="font-bold text-xl">VNS Onboarding</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4">
        <div className="flex justify-center items-center min-h-[80vh]">
          <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-6">
            <form
              onSubmit={actions.handleSubmit}
              className="space-y-12 max-w-3xl mx-auto py-8"
            >
              {/* Form Header */}
              <div className="space-y-4 text-center">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                  ルートアカウント作成
                </h1>
                <p className="text-slate-500 dark:text-slate-400">
                  VNSプラットフォームへようこそ。アカウントの基本情報を登録してください。
                </p>
              </div>

              {/* Step 1: Earth Division Field */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-slate-800 dark:text-slate-200 leading-none font-medium text-lg">
                  <span className="bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 text-xs px-2 py-1 rounded-full">
                    Step 1
                  </span>
                  地球3分割 (Earth Division)
                </label>
                <div className="flex flex-col md:flex-row w-full gap-0">
                  {[
                    {
                      id: "area1",
                      label: "エリア 1",
                      color: "bg-blue-50 text-blue-500",
                      image: "/world/area1.svg",
                      rounded:
                        "rounded-t-xl md:rounded-l-xl md:rounded-tr-none md:rounded-b-none",
                      width: 310,
                      height: 400,
                    },
                    {
                      id: "area2",
                      label: "エリア 2",
                      color: "bg-green-50 text-green-500",
                      image: "/world/area2.svg",
                      rounded: "rounded-none",
                      width: 300,
                      height: 400,
                    },
                    {
                      id: "area3",
                      label: "エリア 3",
                      color: "bg-orange-50 text-orange-500",
                      image: "/world/area3.svg",
                      rounded:
                        "rounded-b-xl md:rounded-r-xl md:rounded-bl-none md:rounded-t-none",
                      width: 310,
                      height: 400,
                    },
                  ].map((area) => (
                    <div
                      key={area.id}
                      onClick={() => actions.setSelectedArea(area.id)}
                      onMouseEnter={() => setHoveredArea(area.id)}
                      onMouseLeave={() => setHoveredArea(null)}
                      style={{
                        flexGrow:
                          hoveredArea === area.id
                            ? area.width * 1.15
                            : area.width,
                        aspectRatio: `${area.width}/${area.height}`,
                      }}
                      className={`
                        cursor-pointer border-2 transition-all duration-300 ease-in-out relative group overflow-hidden
                        ${area.rounded}
                        ${
                          state.selectedArea === area.id
                            ? "border-slate-900 dark:border-slate-50 border-4 shadow-xl z-20 scale-[1.02]"
                            : "border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 border-l-0 border-t-0 md:border-t-2 md:border-l-0 first:border-l-2 first:border-t-2 z-0 hover:z-10"
                        }
                      `}
                    >
                      <div className="absolute inset-0">
                        <Image
                          src={area.image}
                          alt={area.label}
                          fill
                          className="object-cover scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 2: Cultural Sphere Field */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-slate-800 dark:text-slate-200 leading-none font-medium text-lg">
                  <span className="bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 text-xs px-2 py-1 rounded-full">
                    Step 2
                  </span>
                  文化圏 (Cultural Sphere)
                </label>
                <div className="mb-2">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    主に活動する、または拠点とする文化圏を選択してください。
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    ※文化圏の分類はジブリのDVD販売文化圏に依拠しています。
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {CULTURAL_SPHERES.map((sphere) => (
                    <div
                      key={sphere.id}
                      onClick={() => actions.setCulturalSphere(sphere.id)}
                      className={`
                        cursor-pointer rounded-lg border-2 p-3 transition-all relative group overflow-hidden flex flex-col items-center justify-center text-center h-full min-h-[100px]
                        ${
                          state.culturalSphere === sphere.id
                            ? "border-yellow-400 dark:border-yellow-600 bg-yellow-50/50 dark:bg-yellow-900/10 shadow-md"
                            : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 hover:-translate-y-1"
                        }
                      `}
                    >
                      <div className="mb-2 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                        <Languages className="w-5 h-5" />
                      </div>
                      <div className="font-semibold text-slate-700 dark:text-slate-200 text-sm">
                        {sphere.label}
                      </div>
                      <div className="text-xs text-slate-400 dark:text-slate-500 mt-1 text-balance">
                        {sphere.en}
                      </div>
                    </div>
                  ))}
                </div>

                {/* 詳細地域設定 */}
                {state.currentDetail && (
                  <div className="mt-6 p-5 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex items-start gap-3 mb-4">
                      <MapPin className="w-5 h-5 text-yellow-600 dark:text-yellow-500 mt-0.5 shrink-0" />
                      <div>
                        <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                          詳細地域の設定
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          ※利用者数の多い文化圏については、より詳細な地域設定が可能です。
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          国 / Country
                        </label>
                        <div className="relative">
                          <select
                            value={state.selectedCountry}
                            onChange={(e) => {
                              actions.setSelectedCountry(e.target.value);
                              actions.setSelectedRegion("");
                            }}
                            className="appearance-none w-full h-12 px-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:focus:ring-yellow-600"
                          >
                            <option value="" disabled>
                              国を選択してください
                            </option>
                            {state.currentDetail.countries.map((c) => (
                              <option key={c.name} value={c.name}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
                        </div>
                      </div>

                      {state.selectedCountry &&
                        state.currentDetail.countries.find(
                          (c) => c.name === state.selectedCountry,
                        )?.regions && (
                          <div className="space-y-1 animate-in fade-in slide-in-from-left-2">
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              都道府県 / Prefecture
                            </label>
                            <div className="relative">
                              <select
                                value={state.selectedRegion}
                                onChange={(e) =>
                                  actions.setSelectedRegion(e.target.value)
                                }
                                className="appearance-none w-full h-12 px-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:focus:ring-yellow-600"
                              >
                                <option value="" disabled>
                                  都道府県を選択
                                </option>
                                {state.currentDetail.countries
                                  .find((c) => c.name === state.selectedCountry)
                                  ?.regions?.map((r) => (
                                    <option key={r} value={r}>
                                      {r}
                                    </option>
                                  ))}
                              </select>
                              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                )}
              </div>

              {/* Step 3: Birth Generation Field */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-slate-800 dark:text-slate-200 leading-none font-medium text-lg">
                  <span className="bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 text-xs px-2 py-1 rounded-full">
                    Step 3
                  </span>
                  生誕世代 (Birth Generation)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {GENERATIONS.map((gen) => (
                    <div
                      key={gen}
                      onClick={() => actions.setBirthGeneration(gen)}
                      className={`
                        cursor-pointer rounded-lg border-2 p-3 transition-all relative group overflow-hidden flex items-center justify-center text-center h-14
                        ${
                          state.birthGeneration === gen
                            ? "border-yellow-400 dark:border-yellow-600 bg-yellow-50/50 dark:bg-yellow-900/10 shadow-md font-semibold"
                            : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 hover:-translate-y-1"
                        }
                      `}
                    >
                      <div className="text-slate-700 dark:text-slate-200 text-sm">
                        {gen}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 4: Languages Field */}
              <div className="space-y-6">
                <label className="flex items-center gap-2 text-slate-800 dark:text-slate-200 leading-none font-medium text-lg">
                  <span className="bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 text-xs px-2 py-1 rounded-full">
                    Step 4
                  </span>
                  言語設定 (Languages)
                </label>

                {/* 母語 */}
                <div className="space-y-2 pl-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    母語 (Native Language)
                  </label>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                    あなたの第一言語を選択してください。
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[...LANGUAGE_OPTIONS, "その他 (Others)"].map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => actions.setNativeLanguage(lang)}
                        className={`
                          px-3 py-2 rounded-full text-sm border transition-all
                          ${
                            state.nativeLanguage === lang
                              ? "bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 border-slate-800 dark:border-slate-200 shadow-sm"
                              : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                          }
                        `}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 使用可能言語 */}
                <div className="space-y-2 pl-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    使用可能言語 (Available Languages)
                  </label>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                    母語以外にコミュニケーション可能な言語があれば複数選択してください。
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[...LANGUAGE_OPTIONS, "その他 (Others)"].map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => actions.toggleAvailableLanguage(lang)}
                        className={`
                          px-3 py-2 rounded-full text-sm border transition-all
                          ${
                            state.availableLanguages.includes(lang)
                              ? "bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 border-slate-800 dark:border-slate-200 shadow-sm"
                              : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                          }
                        `}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step 5: Activity Settings */}
              <div className="space-y-6">
                <label className="flex items-center gap-2 text-slate-800 dark:text-slate-200 leading-none font-medium text-lg">
                  <span className="bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 text-xs px-2 py-1 rounded-full">
                    Step 5
                  </span>
                  活動設定 (Activity Settings)
                </label>

                {/* Core Activity Time */}
                <div className="space-y-2 pl-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    コア活動時間 (Core Activity Time)
                  </label>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                    主に活動する時間帯（UTC基準）を設定してください。マッチングの参考にされます。
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="relative w-32">
                      <select
                        value={state.coreActivityStart}
                        onChange={(e) =>
                          actions.setCoreActivityStart(e.target.value)
                        }
                        className="appearance-none w-full h-10 px-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:focus:ring-yellow-600 font-mono text-center"
                      >
                        {CORE_ACTIVITY_HOURS.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
                    </div>
                    <span className="text-slate-400">〜</span>
                    <div className="relative w-32">
                      <select
                        value={state.coreActivityEnd}
                        onChange={(e) =>
                          actions.setCoreActivityEnd(e.target.value)
                        }
                        className="appearance-none w-full h-10 px-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:focus:ring-yellow-600 font-mono text-center"
                      >
                        {CORE_ACTIVITY_HOURS.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* AI Translation */}
                <div className="space-y-2 pl-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        リアルタイムAI翻訳 (AI Translation)
                        <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-[10px] px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                          Recommended
                        </span>
                      </label>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-lg">
                        有効にすると、異なる言語圏のユーザーとの会話がリアルタイムで翻訳されます。
                      </p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={state.useAiTranslation}
                      onClick={() =>
                        actions.setUseAiTranslation(!state.useAiTranslation)
                      }
                      className={`
                        relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2
                        ${
                          state.useAiTranslation
                            ? "bg-slate-900 dark:bg-slate-100"
                            : "bg-slate-200 dark:bg-slate-700"
                        }
                      `}
                    >
                      <span
                        aria-hidden="true"
                        className={`
                          pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white dark:bg-slate-900 shadow ring-0 transition duration-200 ease-in-out
                          ${
                            state.useAiTranslation
                              ? "translate-x-5"
                              : "translate-x-0"
                          }
                        `}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 6: Agreements */}
              <div className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                <label className="flex items-center gap-2 text-slate-800 dark:text-slate-200 leading-none font-medium text-lg">
                  <span className="bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 text-xs px-2 py-1 rounded-full">
                    Step 6
                  </span>
                  確認事項 (Confirmation)
                </label>

                <div className="space-y-4 bg-yellow-50/50 dark:bg-yellow-900/10 p-6 rounded-xl border border-yellow-100 dark:border-yellow-900/30">
                  {/* 成人確認 */}
                  <div className="flex items-start gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm">
                    <div className="flex h-6 items-center">
                      <input
                        id="is-adult"
                        type="checkbox"
                        checked={state.isAdult}
                        onChange={(e) => actions.setIsAdult(e.target.checked)}
                        className="h-5 w-5 rounded border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-50 focus:ring-slate-900 dark:focus:ring-slate-50 bg-white dark:bg-slate-700"
                      />
                    </div>
                    <div className="ml-0">
                      <label
                        htmlFor="is-adult"
                        className="text-sm font-medium text-slate-900 dark:text-slate-200 cursor-pointer"
                      >
                        成人確認 (Adult Confirmation)
                      </label>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        私は18歳以上であり、かつ、私の居住する国・地域における成人年齢（または本サービスの利用が許可される年齢）に達していることを確認します。
                      </p>
                    </div>
                  </div>

                  {/* 3つの宣言 */}
                  <div className="space-y-3">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200 px-1">
                      以下の方針に同意します：
                    </p>

                    {[
                      {
                        key: "oasis",
                        label: "オアシス宣言 (Oasis Declaration)",
                        desc: "他者の平穏を乱さず、心地よい空間維持に努めます。",
                      },
                      {
                        key: "human",
                        label: "人間宣言 (Human Declaration)",
                        desc: "AIやボットではなく、人間としての責任を持って行動します。",
                      },
                      {
                        key: "honesty",
                        label: "正直宣言 (Honesty Declaration)",
                        desc: "偽りのない情報を登録し、誠実なコミュニケーションを行います。",
                      },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-start gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm"
                      >
                        <div className="flex h-6 items-center">
                          <input
                            id={`agree-${item.key}`}
                            type="checkbox"
                            checked={
                              state.agreements[
                                item.key as keyof typeof state.agreements
                              ]
                            }
                            onChange={() =>
                              actions.toggleAgreement(
                                item.key as keyof typeof state.agreements,
                              )
                            }
                            className="h-5 w-5 rounded border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-50 focus:ring-slate-900 dark:focus:ring-slate-50 bg-white dark:bg-slate-700"
                          />
                        </div>
                        <div className="ml-0">
                          <label
                            htmlFor={`agree-${item.key}`}
                            className="text-sm font-medium text-slate-900 dark:text-slate-200 cursor-pointer"
                          >
                            {item.label}
                          </label>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={!state.canSubmit}
                  className={`
                    w-full min-h-14 px-4 py-3 rounded-lg font-medium transition-all shadow-sm text-lg
                    ${
                      !state.canSubmit
                        ? "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
                        : "bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 dark:focus:ring-slate-100"
                    }
                  `}
                >
                  アカウントを作成する
                </button>
                <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-4">
                  ※全ての必須項目と同意事項にチェックを入れるとボタンが有効になります。
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
