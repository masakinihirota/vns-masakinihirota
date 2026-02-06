"use client";

import {
  ArrowLeft,
  Heart,
  Check,
  Plus,
  Star,
  Zap,
  Layout,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  UserWork,
  UserEvaluation,
} from "../../profile-edit/profile-edit/profile-edit.logic";

// --- Mock Data: Trending / Recommended Works ---
const TRENDING_WORKS = [
  { id: 101, title: "葬送のフリーレン", category: "アニメ" },
  { id: 102, title: "薬屋のひとりごと", category: "アニメ" },
  { id: 103, title: "ダンジョン飯", category: "アニメ" },
  { id: 104, title: "呪術廻戦", category: "アニメ" },
  { id: 105, title: "SPY×FAMILY", category: "アニメ" },
  { id: 106, title: "チェンソーマン", category: "漫画" },
  { id: 107, title: "推しの子", category: "アニメ" },
  { id: 108, title: "ONE PIECE", category: "漫画" },
  { id: 109, title: "進撃の巨人", category: "アニメ" },
  { id: 110, title: "キングダム", category: "漫画" },
];

type Step = "works_ask" | "works_input" | "interests_input" | "confirm";

export function ProfileCreationStep2({
  initialData,
}: {
  initialData: { [key: string]: string | string[] | undefined };
}) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("works_ask");

  // State
  const [hasWorks, setHasWorks] = useState<boolean | null>(null);
  const [myWorks, setMyWorks] = useState<UserWork[]>([]);
  const [evaluations, setEvaluations] = useState<UserEvaluation[]>([]);

  // Input States
  const [workInput, setWorkInput] = useState({ title: "", role: "" });
  const [interestInput, setInterestInput] = useState("");

  // Handlers
  const handleAddWork = () => {
    if (!workInput.title || !workInput.role) return;
    const newWork: UserWork = {
      id: Date.now(),
      title: workInput.title,
      role: workInput.role,
      category: "その他",
      date: "2024",
      tools: "",
      description: "",
    };
    setMyWorks([...myWorks, newWork]);
    setWorkInput({ title: "", role: "" });
  };

  const handleAddInterest = (
    title: string,
    category: "アニメ" | "漫画" | "その他" = "その他"
  ) => {
    if (!title) return;
    // Prevent duplicates
    if (evaluations.some((e) => e.title === title)) return;

    const newEval: UserEvaluation = {
      id: Date.now(),
      title,
      category,
      status: "now", // Default to "Now Watching"
      tier: "tier1",
    };
    setEvaluations([...evaluations, newEval]);
  };

  const handleToggleInterest = (work: { title: string; category: string }) => {
    const exists = evaluations.find((e) => e.title === work.title);
    if (exists) {
      setEvaluations(evaluations.filter((e) => e.title !== work.title));
    } else {
      handleAddInterest(work.title, work.category as any);
    }
  };

  const handleComplete = () => {
    // Mock Save
    if (process.env.NODE_ENV === "development") {
      alert(
        "【開発モード】プロフィール作成完了（モック）\n\nダッシュボードへ移動します。"
      );
      router.push("/user-profiles");
    } else {
      alert("保存処理未実装");
    }
  };

  const handleBack = () => {
    if (step === "works_ask") {
      router.back();
    } else if (step === "works_input") {
      setStep("works_ask");
    } else if (step === "interests_input") {
      setStep(hasWorks ? "works_input" : "works_ask");
    } else if (step === "confirm") {
      setStep("interests_input");
    }
  };

  // --- Render Steps ---

  // Step 1: Works Question
  const renderWorksAsk = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-black uppercase tracking-widest text-slate-400">
          Step 2-1
        </h2>
        <h1 className="text-3xl font-bold">ご自身の作品登録</h1>
        <p className="text-slate-500">
          あなたが制作に関わった作品（漫画、イラスト、小説、プログラム等）はありますか？
          <br />
          ポートフォリオとして登録することができます。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <button
          onClick={() => {
            setHasWorks(true);
            setStep("works_input");
          }}
          className="group relative p-8 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 bg-white dark:bg-slate-900 transition-all hover:shadow-xl text-left"
        >
          <div className="absolute top-4 right-4 text-slate-300 group-hover:text-blue-500 transition-colors">
            <Layout size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
            はい、登録します
          </h3>
          <p className="text-sm text-slate-400">
            制作実績やポートフォリオを詳しく登録し、
            <br />
            スキルをアピールします。
          </p>
        </button>

        <button
          onClick={() => {
            setHasWorks(false);
            setStep("interests_input");
          }}
          className="group relative p-8 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 bg-slate-50 dark:bg-slate-950 transition-all text-left"
        >
          <div className="absolute top-4 right-4 text-slate-300 group-hover:text-slate-500 transition-colors">
            <ArrowRight size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2 text-slate-700 dark:text-slate-200">
            いいえ、スキップします
          </h3>
          <p className="text-sm text-slate-400">
            作品登録は後からでも可能です。
            <br />
            興味・関心の登録へ進みます。
          </p>
        </button>
      </div>
    </div>
  );

  // Step 2: Works Input
  const renderWorksInput = () => (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500 h-full flex flex-col">
      <div className="mb-8">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-blue-500 mb-2">
          Creator's Portfolio
        </h2>
        <h1 className="text-2xl font-bold mb-4">
          あなたの作品を教えてください
        </h1>
        <p className="text-sm text-slate-500">
          代表的な作品をいくつか登録しましょう。詳細は後から編集できます。
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Input Area */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                作品タイトル
              </label>
              <input
                type="text"
                value={workInput.title}
                onChange={(e) =>
                  setWorkInput({ ...workInput, title: e.target.value })
                }
                placeholder="例: オアシス宣言"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                役割 (Role)
              </label>
              <input
                type="text"
                value={workInput.role}
                onChange={(e) =>
                  setWorkInput({ ...workInput, role: e.target.value })
                }
                placeholder="例: イラスト、原作、デザイン"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <button
              onClick={handleAddWork}
              className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={16} /> 追加する
            </button>
          </div>
        </div>

        {/* List Area */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
            登録済み作品リスト ({myWorks.length})
          </h3>
          {myWorks.length === 0 ? (
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center text-slate-400 text-sm">
              まだ登録されていません
            </div>
          ) : (
            <ul className="space-y-3">
              {myWorks.map((work) => (
                <li
                  key={work.id}
                  className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm animate-in zoom-in duration-300"
                >
                  <div>
                    <div className="font-bold">{work.title}</div>
                    <div className="text-xs text-slate-500">{work.role}</div>
                  </div>
                  <button
                    onClick={() =>
                      setMyWorks(myWorks.filter((w) => w.id !== work.id))
                    }
                    className="text-slate-300 hover:text-red-500 transition-colors"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={() => setStep("interests_input")}
          className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold shadow-lg hover:shadow-blue-500/30 transition-all"
        >
          次へ進む <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );

  // Step 3: Interests Input
  const renderInterestsInput = () => (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500 h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-pink-500 mb-2">
          Interests & Hobbies
        </h2>
        <h1 className="text-2xl font-bold mb-2">今、面白いと思っている作品</h1>
        <p className="text-sm text-slate-500">
          今ハマっている、または注目している作品を選んでください。
          <br />
          あなたの好みに近いユーザーとマッチングしやすくなります。
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Your Selections & Input */}
        <div className="space-y-6 flex flex-col">
          <div className="relative">
            <input
              type="text"
              value={interestInput}
              onChange={(e) => setInterestInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddInterest(interestInput);
                  setInterestInput("");
                }
              }}
              placeholder="作品名を入力してEnter..."
              className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-full pl-5 pr-12 py-3 focus:outline-none focus:border-pink-500 transition-all font-bold"
            />
            <button
              onClick={() => {
                handleAddInterest(interestInput);
                setInterestInput("");
              }}
              className="absolute right-2 top-2 p-1.5 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="flex-1 bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 overflow-y-auto max-h-[400px]">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
              <Star size={12} className="text-yellow-500" /> あなたのセレクト (
              {evaluations.length})
            </h3>
            {evaluations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-slate-400 text-sm">
                <Heart className="mb-2 opacity-20" size={32} />
                <p>
                  右のリストから選ぶか、
                  <br />
                  直接入力してください
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {evaluations.map((item) => (
                  <span
                    key={item.id}
                    className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-full border border-pink-100 dark:border-slate-700 shadow-sm animate-in zoom-in duration-200"
                  >
                    <span className="font-bold text-sm">{item.title}</span>
                    <button
                      onClick={() =>
                        setEvaluations(
                          evaluations.filter((e) => e.id !== item.id)
                        )
                      }
                      className="text-slate-300 hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Trending List */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-orange-50 to-pink-50 dark:from-slate-900 dark:to-slate-800">
            <h3 className="text-xs font-black uppercase tracking-widest text-orange-600 dark:text-orange-400 flex items-center gap-2">
              <Zap size={14} /> 急上昇・トレンド
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <ul className="space-y-1">
              {TRENDING_WORKS.map((work, index) => {
                const isSelected = evaluations.some(
                  (e) => e.title === work.title
                );
                return (
                  <li key={work.id}>
                    <button
                      onClick={() => handleToggleInterest(work)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all group ${
                        isSelected
                          ? "bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-300"
                          : "hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-[10px] font-black w-4 text-center ${
                            index < 3 ? "text-orange-500" : "text-slate-300"
                          }`}
                        >
                          {index + 1}
                        </span>
                        <span className="font-bold">{work.title}</span>
                      </div>
                      <div
                        className={`transition-opacity ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-30"}`}
                      >
                        <Check size={16} />
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={() => setStep("confirm")}
          className="flex items-center gap-2 px-8 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-full font-bold shadow-lg hover:shadow-pink-500/30 transition-all"
        >
          確認へ進む <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );

  // Step 4: Confirmation
  const renderConfirm = () => (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 text-center space-y-8 max-w-2xl mx-auto">
      <div className="space-y-4">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-green-500">
          All Set!
        </h2>
        <h1 className="text-4xl font-black">プロフィールの準備が整いました</h1>
        <p className="text-slate-500">
          以下の内容で作成します。作成後もいつでも編集可能です。
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-left space-y-6 shadow-xl">
        <div className="space-y-2">
          <label className="text-xs font-black uppercase text-slate-400 tracking-widest">
            登録プロフィール
          </label>
          <div className="text-xl font-bold">
            {initialData?.display_name || "名無し"}
          </div>
          <div className="flex gap-2">
            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold rounded">
              {initialData?.role || "Member"}
            </span>
            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold rounded">
              {initialData?.profile_type || "Self"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 border-t border-slate-100 dark:border-slate-800 pt-6">
          <div>
            <div className="text-2xl font-black mb-1">{myWorks.length}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              My Works
            </div>
          </div>
          <div>
            <div className="text-2xl font-black mb-1">{evaluations.length}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Interests
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleComplete}
        className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-black text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
      >
        この内容でプロフィールを作成する
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-12">
          {step !== "works_ask" ? (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft size={14} /> Back
            </button>
          ) : (
            <div /> // Spacer
          )}

          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full transition-colors ${step === "works_ask" ? "bg-blue-500" : "bg-slate-300 dark:bg-slate-700"}`}
            />
            <div
              className={`w-2 h-2 rounded-full transition-colors ${step === "works_input" ? "bg-blue-500" : "bg-slate-300 dark:bg-slate-700"}`}
            />
            <div
              className={`w-2 h-2 rounded-full transition-colors ${step === "interests_input" ? "bg-pink-500" : "bg-slate-300 dark:bg-slate-700"}`}
            />
            <div
              className={`w-2 h-2 rounded-full transition-colors ${step === "confirm" ? "bg-green-500" : "bg-slate-300 dark:bg-slate-700"}`}
            />
          </div>
        </div>

        {/* Content */}
        <div className="min-h-[600px] flex flex-col justify-center">
          {step === "works_ask" && renderWorksAsk()}
          {step === "works_input" && renderWorksInput()}
          {step === "interests_input" && renderInterestsInput()}
          {step === "confirm" && renderConfirm()}
        </div>
      </div>
    </div>
  );
}
