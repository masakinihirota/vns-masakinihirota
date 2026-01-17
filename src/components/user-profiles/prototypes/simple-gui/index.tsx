"use client";

import {
  User,
  Users,
  Sparkles,
  Monitor,
  Smile,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Briefcase,
  Heart,
  MessageCircle,
  Gamepad2,
  Star,
  Shield,
  BookOpen,
  Plus,
  Trash2,
  Trophy,
  Info,
} from "lucide-react";
import React, { useState } from "react";

// --- Data & Constants ---

const USER_TYPES = [
  {
    id: "SELF",
    title: "本人 (SELF)",
    subtitle: "あなた自身の「仮面」を作成します。",
    description:
      "最も標準的なプロフィールです。あなた自身の経歴、性格、ステータスを登録し、システム内でのあなたの「顔」となるプロフィールを作成します。",
    icon: <User className="w-6 h-6" />,
  },
  {
    id: "INTERVIEW",
    title: "インタビュー (INTERVIEW)",
    subtitle: "対話を通じて、相手の仮面を作成します。",
    description:
      "目の前にいる相手や、通話中の相手に質問を投げかけながら、その回答を元にプロフィールを埋めていきます。",
    icon: <MessageCircle className="w-6 h-6" />,
  },
  {
    id: "IMAGINED",
    title: "心象プロフィール (IMAGINED)",
    subtitle: "情報や想像から、人物像を構築します。",
    description:
      "ニュース、SNS、ランキングなどの「断片的な外部情報」を元に、あなたの解釈や想像力で補完して、「あなたから見たその人」の人物像を作り上げます。",
    icon: <Sparkles className="w-6 h-6" />,
  },
  {
    id: "IDEAL",
    title: "理想像 (IDEAL)",
    subtitle:
      "「求めている人物像」や「こうありたい」という理想をプロフィール化します。",
    description: "現実の制約を取り払い、理想的なキャラクター設定を作成します。",
    icon: <Star className="w-6 h-6" />,
  },
  {
    id: "AI_DUMMY",
    title: "AIダミー生成 (AI DUMMY)",
    subtitle: "テスト用にランダムなデータを生成します。",
    description:
      "デザインの確認や動作テストのために、AIが架空のプロフィール（名前、画像、設定）を自動生成してプロフィール項目を埋めます。",
    icon: <Monitor className="w-6 h-6" />,
  },
];

const PURPOSES = [
  { id: "play", label: "遊ぶ", icon: <Gamepad2 className="w-4 h-4" /> },
  {
    id: "create_work",
    label: "創る・働く",
    icon: <Briefcase className="w-4 h-4" />,
  },
  {
    id: "partner",
    label: "パートナー探し",
    icon: <Heart className="w-4 h-4" />,
  },
  { id: "consult", label: "相談", icon: <MessageCircle className="w-4 h-4" /> },
  { id: "other", label: "その他", icon: <Plus className="w-4 h-4" /> },
];

const WORK_CATEGORIES = [
  "漫画",
  "アニメ",
  "映画",
  "小説",
  "ゲーム",
  "音楽",
  "その他",
];

// --- Components ---

interface Step {
  id: number;
  label: string;
  desc: string;
}

const StepIndicator = ({
  currentStep,
  steps,
}: {
  currentStep: number;
  steps: Step[];
}) => {
  return (
    <div className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col h-full fixed left-0 top-0 pt-10 px-6 z-10 hidden md:flex">
      <div className="mb-10">
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">
          VNS Profile
        </h1>
        <p className="text-xs text-slate-500 mt-1">New User Registration</p>
      </div>
      <div className="space-y-8 relative">
        {/* Connection Line */}
        <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-slate-200 -z-10" />

        {steps.map((step, index) => {
          const isActive = currentStep === index + 1;
          const isCompleted = currentStep > index + 1;

          return (
            <div key={step.id} className="flex items-start group">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center border-2 shrink-0 transition-colors duration-300 z-10
                  ${
                    isActive
                      ? "bg-indigo-600 border-indigo-600 text-white"
                      : isCompleted
                        ? "bg-green-500 border-green-500 text-white"
                        : "bg-white border-slate-300 text-slate-400"
                  }
                `}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <div className="ml-4 pt-1">
                <p
                  className={`text-sm font-semibold transition-colors ${isActive ? "text-indigo-600" : isCompleted ? "text-green-600" : "text-slate-500"}`}
                >
                  {step.label}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- Main Application ---

export default function UserProfileCreator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    role: "Leader", // Fixed
    type: "SELF",
    purposes: [] as string[],
    displayName: "牡羊座 (Aries)", // Pre-filled from external data source
    ownWorks: [] as { id: number; title: string }[],
    favWorks: [] as {
      id: number;
      title: string;
      category: string;
      isBest: boolean;
    }[],
    valuesAnswer: "",
  });

  // Helper for form updates
  const updateForm = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const togglePurpose = (id: string) => {
    setFormData((prev) => {
      const exists = prev.purposes.includes(id);
      return {
        ...prev,
        purposes: exists
          ? prev.purposes.filter((p) => p !== id)
          : [...prev.purposes, id],
      };
    });
  };

  const addOwnWork = () => {
    setFormData((prev) => ({
      ...prev,
      ownWorks: [...prev.ownWorks, { id: Date.now(), title: "" }],
    }));
  };

  const updateOwnWork = (id: number, title: string) => {
    setFormData((prev) => ({
      ...prev,
      ownWorks: prev.ownWorks.map((w) => (w.id === id ? { ...w, title } : w)),
    }));
  };

  const removeOwnWork = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      ownWorks: prev.ownWorks.filter((w) => w.id !== id),
    }));
  };

  const addFavWork = (
    isManual: boolean,
    data: { title: string; selectedTitle: string; category: string }
  ) => {
    const newWork = {
      id: Date.now(),
      title: isManual ? data.title : data.selectedTitle,
      category: isManual ? "その他" : data.category,
      isBest: false,
    };
    setFormData((prev) => ({ ...prev, favWorks: [...prev.favWorks, newWork] }));
  };

  const toggleBestWork = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      favWorks: prev.favWorks.map((w) => ({
        ...w,
        isBest: w.id === id ? !w.isBest : w.isBest, // Allow multiple bests or single? Assuming multiple based on UI usually, but prompt implies singular 'most favorite'. Let's allow toggle.
      })),
    }));
  };

  const removeFavWork = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      favWorks: prev.favWorks.filter((w) => w.id !== id),
    }));
  };

  // --- Step Content Renderers ---

  const renderStep1 = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 1. Role Section */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-indigo-100 p-2 rounded-lg">
            <Shield className="w-6 h-6 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">1. 役割 (Role)</h2>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              Fixed
            </span>
            <h3 className="text-lg font-bold text-slate-800">
              リーダー (Leader)
            </h3>
          </div>

          <div className="prose prose-sm prose-slate max-w-none text-slate-600 leading-relaxed bg-white/50 p-4 rounded-lg border border-indigo-50/50">
            <p className="font-medium text-indigo-900 mb-2">
              価値観サイト VNS
              masakinihirotaではなぜリーダーである必要があるのか？
            </p>
            <p>
              価値観サイト VNS
              masakinihirotaは幸福追求権を優先する「言葉の盾」です。
              リーダーは単なる管理者ではなく、特定の価値観で集まる「組織」の責任者として不可欠です。
              「オアシス宣言」に基づく秩序維持や最終的なペナルティ執行権限を持ち、調停者では担えない最終決定を行います。
              また、組織の起点となり、さらに大きな「国」を建国する唯一の存在として、安全で快適なコミュニティを守り育てる守護者の役割を担います。
            </p>
          </div>
        </div>
      </section>

      {/* 2. Type Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">
            2. タイプ (Type)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {USER_TYPES.map((t) => (
            <div
              key={t.id}
              onClick={() => updateForm("type", t.id)}
              className={`
                cursor-pointer p-5 rounded-xl border-2 transition-all duration-200 hover:shadow-md
                ${
                  formData.type === t.id
                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200 ring-offset-1"
                    : "border-slate-200 bg-white hover:border-blue-300"
                }
              `}
            >
              <div className="flex items-start justify-between mb-2">
                <div
                  className={`p-2 rounded-lg ${formData.type === t.id ? "bg-blue-200 text-blue-700" : "bg-slate-100 text-slate-500"}`}
                >
                  {t.icon}
                </div>
                {formData.type === t.id && (
                  <CheckCircle2 className="w-6 h-6 text-blue-500" />
                )}
              </div>
              <h3 className="font-bold text-slate-800 mb-1">{t.title}</h3>
              <p className="text-sm font-medium text-slate-600 mb-2">
                {t.subtitle}
              </p>
              <p className="text-xs text-slate-500 leading-normal">
                {t.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Purpose Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-green-100 p-2 rounded-lg">
            <Trophy className="w-6 h-6 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">
            3. 目的 (Purpose)
          </h2>
        </div>

        <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-6 flex items-start gap-3">
          <Info className="w-5 h-5 text-green-700 shrink-0 mt-0.5" />
          <p className="text-sm text-green-800 leading-relaxed">
            <strong>なぜ目的を選ぶのですか？</strong>
            <br />
            このプロフィールをどのような目的で主に使用するか選択してください。ここで選択した「目的」に応じて、システム内でのマッチング精度が向上し、あなたにおすすめされる機能やコンテンツが最適化されます。
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {PURPOSES.map((p) => (
            <button
              key={p.id}
              onClick={() => togglePurpose(p.id)}
              className={`
                flex items-center gap-2 px-5 py-3 rounded-full font-medium transition-all text-sm
                ${
                  formData.purposes.includes(p.id)
                    ? "bg-green-600 text-white shadow-md transform scale-105"
                    : "bg-white border border-slate-300 text-slate-600 hover:bg-slate-50"
                }
              `}
            >
              {p.icon}
              {p.label}
            </button>
          ))}
        </div>
      </section>

      {/* 4. Display Name Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-purple-100 p-2 rounded-lg">
            <Smile className="w-6 h-6 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">
            4. 匿名表示名 (Identity)
          </h2>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-lg">
          <div className="flex items-start gap-4">
            <div className="bg-purple-50 p-3 rounded-full border border-purple-100">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-700 mb-1">
                登録済みの星座データを使用
              </h3>
              <p className="text-sm text-slate-500 mb-4 leading-relaxed">
                事前に入力していただいた星座情報に基づき、自動的に匿名ネームが割り当てられています。
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-200 rounded-lg text-purple-800 font-bold shadow-sm">
                <span>{formData.displayName}</span>
                <div className="flex items-center gap-1 text-xs font-normal bg-white px-2 py-0.5 rounded border border-purple-100 text-purple-500 ml-2">
                  <CheckCircle2 className="w-3 h-3" />
                  連携済み
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  const renderStep2 = () => {
    // Temporary state for the "Add Favorite Work" sub-form
    const [favMode, setFavMode] = useState("select"); // 'select' or 'manual'
    const [tempFav, setTempFav] = useState({
      category: WORK_CATEGORIES[0],
      selectedTitle: "",
      title: "",
    });

    const handleAddFav = () => {
      if (favMode === "select" && !tempFav.selectedTitle) return;
      if (favMode === "manual" && !tempFav.title) return;
      addFavWork(favMode === "manual", tempFav);
      setTempFav({ ...tempFav, selectedTitle: "", title: "" });
    };

    return (
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8">
          <p className="text-blue-800 text-sm flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            入力したい項目だけ埋めてください。すべて任意です。
          </p>
        </div>

        {/* Own Works */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-orange-100 p-2 rounded-lg">
              <Briefcase className="w-6 h-6 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">
              自分の作品の登録
            </h2>
          </div>

          <div className="space-y-3 max-w-2xl">
            {formData.ownWorks.map((work) => (
              <div
                key={work.id}
                className="flex gap-2 animate-in slide-in-from-left-2"
              >
                <input
                  type="text"
                  placeholder="作品タイトルを入力"
                  value={work.title}
                  onChange={(e) => updateOwnWork(work.id, e.target.value)}
                  className="flex-1 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  autoFocus
                />
                <button
                  onClick={() => removeOwnWork(work.id)}
                  className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            <button
              onClick={addOwnWork}
              className="flex items-center gap-2 text-orange-600 font-medium px-4 py-2 hover:bg-orange-50 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              作品を追加する
            </button>
          </div>
        </section>

        {/* Favorite Works */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-pink-100 p-2 rounded-lg">
              <Heart className="w-6 h-6 text-pink-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">
              好きな作品の登録
            </h2>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm max-w-3xl">
            {/* Input Area */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 pb-6 border-b border-slate-100">
              <div className="flex rounded-lg bg-slate-100 p-1 shrink-0 h-12 self-start">
                <button
                  onClick={() => setFavMode("select")}
                  className={`px-4 rounded-md text-sm font-medium transition-all ${favMode === "select" ? "bg-white shadow-sm text-slate-800" : "text-slate-500"}`}
                >
                  リストから選択
                </button>
                <button
                  onClick={() => setFavMode("manual")}
                  className={`px-4 rounded-md text-sm font-medium transition-all ${favMode === "manual" ? "bg-white shadow-sm text-slate-800" : "text-slate-500"}`}
                >
                  直接入力
                </button>
              </div>

              <div className="flex-1 flex flex-col gap-3">
                {favMode === "select" ? (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <select
                      className="p-3 border border-slate-300 rounded-lg bg-white"
                      value={tempFav.category}
                      onChange={(e) =>
                        setTempFav({ ...tempFav, category: e.target.value })
                      }
                    >
                      {WORK_CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <select
                      className="p-3 border border-slate-300 rounded-lg bg-white flex-1"
                      value={tempFav.selectedTitle}
                      onChange={(e) =>
                        setTempFav({
                          ...tempFav,
                          selectedTitle: e.target.value,
                        })
                      }
                    >
                      <option value="">作品を選択してください</option>
                      <option value="Sample Anime A">Sample Anime A</option>
                      <option value="Sample Movie B">Sample Movie B</option>
                      <option value="Sample Game C">Sample Game C</option>
                    </select>
                  </div>
                ) : (
                  <input
                    type="text"
                    placeholder="作品タイトルを入力"
                    className="flex-1 p-3 border border-slate-300 rounded-lg w-full"
                    value={tempFav.title}
                    onChange={(e) =>
                      setTempFav({ ...tempFav, title: e.target.value })
                    }
                  />
                )}

                <button
                  onClick={handleAddFav}
                  disabled={
                    (favMode === "select" && !tempFav.selectedTitle) ||
                    (favMode === "manual" && !tempFav.title)
                  }
                  className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed self-end"
                >
                  リストに追加
                </button>
              </div>
            </div>

            {/* List Area */}
            <div className="space-y-2">
              {formData.favWorks.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-sm">
                  まだ登録されていません
                </div>
              )}
              {formData.favWorks.map((work) => (
                <div
                  key={work.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-white border border-slate-200 px-2 py-1 rounded text-slate-500">
                      {work.category}
                    </span>
                    <span className="font-medium text-slate-700">
                      {work.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleBestWork(work.id)}
                      className={`flex items-center gap-1 text-sm px-2 py-1 rounded transition-colors ${work.isBest ? "bg-yellow-100 text-yellow-700" : "text-slate-400 hover:text-yellow-500"}`}
                      title="最も好きな作品に設定"
                    >
                      <Star
                        className={`w-4 h-4 ${work.isBest ? "fill-yellow-500" : ""}`}
                      />
                      <span className="hidden sm:inline">Best</span>
                    </button>
                    <button
                      onClick={() => removeFavWork(work.id)}
                      className="text-slate-400 hover:text-red-500 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-teal-100 p-2 rounded-lg">
              <Sparkles className="w-6 h-6 text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">価値観のお題</h2>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Q. 基礎の基礎：あなたが大切にしている信条は？
            </label>
            <textarea
              rows={4}
              className="w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none resize-none"
              placeholder="自由に記述してください..."
              value={formData.valuesAnswer}
              onChange={(e) => updateForm("valuesAnswer", e.target.value)}
            />
          </div>
        </section>
      </div>
    );
  };

  const renderStep3 = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">
          プロフィールの最終確認
        </h2>
        <p className="text-slate-500">
          以下の内容でプロフィールを作成します。よろしければ作成ボタンを押してください。
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden relative">
        {/* Cover-like Header */}
        <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600"></div>

        <div className="px-8 pb-8">
          <div className="flex justify-between items-end -mt-12 mb-6">
            <div className="flex items-end gap-6">
              <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center text-3xl font-bold text-indigo-600">
                {formData.displayName ? formData.displayName[0] : "G"}
              </div>
              <div className="pb-1">
                <h1 className="text-2xl font-bold text-slate-800">
                  {formData.displayName || "未設定"}
                </h1>
                <p className="text-indigo-600 font-medium">{formData.role}</p>
              </div>
            </div>
            <div className="flex gap-2 mb-1">
              {formData.purposes.map((pid) => {
                const p = PURPOSES.find((item) => item.id === pid);
                return p ? (
                  <span
                    key={pid}
                    className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-600 border border-slate-200"
                  >
                    {p.label}
                  </span>
                ) : null;
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-100 pt-8">
            <div>
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                Identity
              </h4>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm text-slate-500 mb-1">Type</dt>
                  <dd className="font-medium text-slate-800 flex items-center gap-2">
                    {USER_TYPES.find((t) => t.id === formData.type)?.title}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-500 mb-1">Value (Basic)</dt>
                  <dd className="text-slate-800 bg-slate-50 p-3 rounded-lg text-sm italic">
                    {formData.valuesAnswer || "（未回答）"}
                  </dd>
                </div>
              </dl>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                Portfolio / Favorites
              </h4>
              <div className="space-y-6">
                <div>
                  <dt className="text-sm text-slate-500 mb-2">Own Works</dt>
                  {formData.ownWorks.length > 0 ? (
                    <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                      {formData.ownWorks.map((w) => (
                        <li key={w.id}>{w.title}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-sm text-slate-400">なし</span>
                  )}
                </div>

                <div>
                  <dt className="text-sm text-slate-500 mb-2">
                    Favorite Works
                  </dt>
                  {formData.favWorks.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {formData.favWorks.map((w) => (
                        <span
                          key={w.id}
                          className={`text-sm px-3 py-1 rounded-full border ${w.isBest ? "bg-yellow-50 border-yellow-200 text-yellow-800" : "bg-white border-slate-200 text-slate-600"}`}
                        >
                          {w.isBest && (
                            <Star className="inline w-3 h-3 mr-1 -mt-0.5 fill-current" />
                          )}
                          {w.title}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm text-slate-400">なし</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-white font-sans text-slate-800 overflow-hidden text-left">
      {/* Sidebar Navigation */}
      <StepIndicator
        currentStep={currentStep}
        steps={[
          { id: 1, label: "Identity & Attributes", desc: "基本属性の設定" },
          { id: 2, label: "Details Wizard", desc: "詳細情報の入力" },
          { id: 3, label: "Confirm", desc: "最終確認" },
        ]}
      />

      {/* Main Content Area */}
      <main className="flex-1 ml-0 md:ml-64 flex flex-col h-full relative">
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 md:px-12 py-12 scroll-smooth">
          <div className="max-w-5xl mx-auto pb-24">
            {" "}
            {/* pb-24 for footer space */}
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
          </div>
        </div>

        {/* Floating Footer Navigation */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 px-6 md:px-12 py-4 z-20">
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <button
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all
                ${
                  currentStep === 1
                    ? "text-slate-300 cursor-not-allowed"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }
              `}
            >
              <ArrowLeft className="w-5 h-5" />
              戻る
            </button>

            {currentStep < 3 ? (
              <button
                onClick={() => setCurrentStep((prev) => Math.min(3, prev + 1))}
                className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:scale-105 active:scale-95"
              >
                次へ進む
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={() =>
                  alert(
                    "プロフィールを作成しました！（ダッシュボードへ遷移します）"
                  )
                }
                className="flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 shadow-lg shadow-green-200 transition-all hover:scale-105 active:scale-95"
              >
                <CheckCircle2 className="w-5 h-5" />
                プロフィールを作成する
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
