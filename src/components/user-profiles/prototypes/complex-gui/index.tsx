"use client";

import {
  Plus,
  User,
  X,
  Check,
  ChevronRight,
  ChevronLeft,
  RefreshCcw,
  Undo2,
  ArrowRight,
  ShieldCheck,
  Lock,
  Ghost,
  Sparkles,
  Fingerprint,
  Eye,
  ShoppingBag,
  BookOpen,
  Layers,
  Activity,
  Grid,
  Newspaper,
  ClipboardList,
  Crown,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { GhostMap, type GhostProfile } from "./ghost-map/ghost-map";

interface FormData {
  displayName: string;
  avatar: string;
  format: string;
  role: string;
  purpose: string[];
  type: string;
  works: any[];
  interests: any[];
}

const steps = [
  { id: 0, title: "はじまりの選択" },
  { id: 1, title: "仮面の作成" },
  { id: 3, title: "受肉の儀式" },
];

interface ListSelectorProps {
  options: { id: string; label: string; sub?: string }[];
  value: string | string[];
  onChange: (val: any) => void;
  disabledFn?: (id: string) => boolean;
  isMulti?: boolean;
}

const ListSelector = ({
  options,
  value,
  onChange,
  disabledFn = (_id) => false,
  isMulti = false,
}: ListSelectorProps) => {
  const handleToggle = (id: string) => {
    if (isMulti && Array.isArray(value)) {
      const newValue = value.includes(id)
        ? value.filter((v) => v !== id)
        : [...value, id];
      onChange(newValue);
    } else {
      onChange(id);
    }
  };
  const isSelected = (id: string) =>
    isMulti && Array.isArray(value) ? value.includes(id) : value === id;
  return (
    <div className="grid grid-cols-1 gap-3">
      {options.map((opt) => {
        const disabled = disabledFn(opt.id);
        const active = isSelected(opt.id);
        return (
          <button
            key={opt.id}
            disabled={disabled}
            onClick={() => handleToggle(opt.id)}
            className={`w-full flex items-center justify-between p-6 px-10 rounded-[2rem] border-2 transition-all text-left ${
              active
                ? "bg-indigo-600/10 border-indigo-500 ring-2 ring-indigo-500/20 shadow-lg"
                : disabled
                  ? "opacity-20 cursor-not-allowed border-transparent bg-zinc-900/10"
                  : "bg-zinc-900/40 border-zinc-800 hover:border-zinc-700"
            }`}
          >
            <div className="flex items-center space-x-8">
              <div
                className={`w-4 h-4 rounded-full transition-all ${active ? "bg-indigo-400 scale-125 shadow-[0_0_15px_rgba(129,140,248,0.8)]" : "bg-zinc-700"}`}
              />
              <div className="flex flex-col">
                <p className="text-lg font-bold">{opt.label}</p>
                {opt.sub && (
                  <p className="text-lg mt-2 leading-relaxed text-zinc-500 font-medium">
                    {opt.sub}
                  </p>
                )}
              </div>
            </div>
            {active && <Check size={32} className="text-indigo-400 shrink-0" />}
          </button>
        );
      })}
    </div>
  );
};
const ComplexGUI = () => {
  const router = useRouter();
  const fixedZodiac: { emoji: string; name: string } = {
    emoji: " Scorpio",
    name: "蠍座",
  };

  // Profile State
  const [profiles, setProfiles] = useState<GhostProfile[]>([
    {
      id: "ghost_main",
      name: "Ghost",
      type: "ghost",
      avatarStr: "👻",
      position: { x: 10, y: 10 },
      zoneId: "world",
      color: "#6366f1", // Indigo
    },
    {
      id: "char_masked",
      name: "Masked Avatar",
      type: "avatar",
      avatarStr: "🎭",
      position: { x: 23, y: 15 }, // Start at exit/town
      zoneId: "world",
      color: "#ef4444", // Red
    },
  ]);
  const [activeProfileId, setActiveProfileId] = useState<string>("ghost_main");

  const activeProfile =
    profiles.find((p) => p.id === activeProfileId) || profiles[0];

  const handleUpdateProfile = (updates: Partial<GhostProfile>) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === activeProfileId ? { ...p, ...updates } : p))
    );
  };

  // 状態管理: 0=はじまりの選択, 1=仮面の生成, 3=受肉の儀式, 99=幽霊放浪, 88=チュートリアル案内, 77=ゲーミフィケーション中止
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState<FormData>({
    displayName: "",
    avatar: fixedZodiac.emoji,
    format: "profile",
    role: "member",
    purpose: ["play_purpose"],
    type: "self",
    works: [],
    interests: [],
  });

  const [nameCandidates, setNameCandidates] = useState<string[]>([]);
  const [nameHistory, setNameHistory] = useState<string[][]>([]);
  const [isRotating, setIsRotating] = useState<boolean>(false);

  // 名前候補生成
  const generateCandidates = (isNew: boolean = true) => {
    setIsRotating(true);
    setTimeout(() => {
      if (isNew && nameCandidates.length > 0) {
        setNameHistory((prev: string[][]) => [...prev, nameCandidates]);
      }
      const colors = [
        "赤い",
        "白い",
        "青い",
        "緑の",
        "黄色い",
        "紫の",
        "黒い",
        "銀の",
        "黄金の",
      ];
      const concepts = [
        "マテリアル",
        "光",
        "幻想",
        "氷",
        "炎",
        "風",
        "闇",
        "星",
        "霧",
      ];
      const lastHistory: string[] =
        nameHistory.length > 0 ? nameHistory[nameHistory.length - 1] : [];
      const newCandidates: string[] = [];
      while (newCandidates.length < 3) {
        const c = colors[Math.floor(Math.random() * colors.length)];
        const n = concepts[Math.floor(Math.random() * concepts.length)];
        const name = `${c}${n}の${fixedZodiac.name}`;
        if (!lastHistory.includes(name) && !newCandidates.includes(name)) {
          newCandidates.push(name);
        }
      }
      setNameCandidates(newCandidates);
      if (!newCandidates.includes(formData.displayName)) {
        setFormData((prev: FormData) => ({
          ...prev,
          displayName: newCandidates[0],
        }));
      }
      setIsRotating(false);
    }, 300);
  };

  const restorePreviousNames = () => {
    if (nameHistory.length === 0) return;
    setIsRotating(true);
    setTimeout(() => {
      const prevSet = nameHistory[nameHistory.length - 1];
      const newHistory = nameHistory.slice(0, -1);
      setNameCandidates(prevSet);
      setNameHistory(newHistory);
      setFormData((prev: FormData) => ({ ...prev, displayName: prevSet[0] }));
      setIsRotating(false);
    }, 200);
  };

  useEffect(() => {
    generateCandidates(false);
  }, []);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#020204] text-zinc-900 dark:text-zinc-100 overflow-hidden font-sans">
      {/* サイドバー */}
      <aside className="w-80 border-r border-zinc-200 dark:border-zinc-900 bg-white/80 dark:bg-black/60 flex flex-col shrink-0 hidden lg:flex">
        <div className="p-8">
          <div className="flex items-center space-x-4 mb-12">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-600/30">
              <User className="text-white" size={28} />
            </div>
            <h1 className="font-black text-xl tracking-tighter uppercase italic text-indigo-900 dark:text-indigo-100">
              Masakinihirota
            </h1>
          </div>
          <nav className="space-y-4">
            {steps.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  if (![99, 88].includes(currentStep)) setCurrentStep(s.id);
                }}
                className={`w-full flex items-center space-x-5 p-6 rounded-2xl transition-all text-left group ${
                  Math.floor(currentStep) === s.id
                    ? "bg-indigo-50 dark:bg-indigo-600/10 border-l-4 border-indigo-500 shadow-lg"
                    : "hover:bg-zinc-100 dark:hover:bg-zinc-800 border-l-4 border-transparent"
                }`}
              >
                <div
                  className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-lg font-black border-2 transition-colors ${
                    Math.floor(currentStep) === s.id
                      ? "bg-indigo-500 border-indigo-400 text-white shadow-lg"
                      : currentStep > s.id && ![99, 88].includes(currentStep)
                        ? "bg-emerald-500 border-emerald-400 text-white"
                        : "border-zinc-300 dark:border-zinc-700 text-zinc-400 dark:text-zinc-500 group-hover:border-zinc-400 dark:group-hover:border-zinc-500"
                  }`}
                >
                  {currentStep > s.id && ![99, 88].includes(currentStep) ? (
                    <Check size={20} />
                  ) : (
                    s.id
                  )}
                </div>
                <p
                  className={`text-lg font-bold tracking-tight ${Math.floor(currentStep) === s.id ? "text-indigo-900 dark:text-zinc-100" : "text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300"}`}
                >
                  {s.title}
                </p>
              </button>
            ))}
          </nav>

          {/* Profile Switcher */}
          <div className="mt-8 space-y-4">
            <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest pl-2 mb-4">
              Profiles
            </h3>
            <div className="space-y-3">
              {profiles.map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => setActiveProfileId(profile.id)}
                  className={`w-full flex items-center gap-4 p-3 rounded-xl border transition-all ${
                    activeProfileId === profile.id
                      ? "bg-indigo-50 dark:bg-zinc-800 border-indigo-500 dark:border-indigo-500 shadow-md"
                      : "hover:bg-zinc-100 dark:hover:bg-zinc-800/50 border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-sm relative overflow-hidden">
                    {profile.type === "ghost" ? (
                      <Ghost size={20} className="text-indigo-500" />
                    ) : (
                      <span>{profile.avatarStr}</span>
                    )}
                    {activeProfileId === profile.id && (
                      <div className="absolute inset-0 ring-2 ring-indigo-500 rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <div
                      className={`text-sm font-bold ${activeProfileId === profile.id ? "text-indigo-900 dark:text-zinc-100" : "text-zinc-500 dark:text-zinc-400"}`}
                    >
                      {profile.name}
                    </div>
                    <div className="text-[10px] text-zinc-400 font-mono">
                      {profile.zoneId} ({profile.position.x},{" "}
                      {profile.position.y})
                    </div>
                  </div>
                </button>
              ))}

              <button
                onClick={() =>
                  alert(
                    "New profile creation is not implemented in this prototype."
                  )
                }
                className="w-full py-3 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-400 font-bold text-sm hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                <span>Add Profile</span>
              </button>
            </div>
          </div>
        </div>
        <div className="mt-auto p-8 border-t border-zinc-200 dark:border-zinc-900/50 bg-white/40 dark:bg-black/40 text-center">
          <p className="text-lg text-zinc-400 dark:text-zinc-500 font-bold italic leading-snug">
            &quot;不確かな存在を、
            <br />
            愛おしく想います。&quot;
          </p>
        </div>
      </aside>

      {/* メインコンテンツ */}
      <main className="flex-1 flex flex-col relative bg-stone-50 dark:bg-zinc-950 overflow-hidden">
        {/* Dark Mode Gradient Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_10%,_rgba(67,56,202,0.1),_transparent)] dark:opacity-40" />

        <header className="h-20 px-12 flex items-center justify-between border-b border-zinc-200/50 dark:border-zinc-900/50 bg-white/50 dark:bg-black/50 backdrop-blur-3xl sticky top-0 z-20">
          <div className="flex items-center space-x-3 text-zinc-400 dark:text-zinc-500 text-lg font-bold tracking-widest uppercase">
            <span>Identity Flow</span>
            <ChevronRight size={16} />
            <span className="text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">
              Step {currentStep === 99 ? "?" : currentStep}
            </span>
          </div>
          <div className="flex items-center space-x-5 bg-white/80 dark:bg-zinc-900/80 px-6 py-2.5 rounded-full border border-zinc-200 dark:border-zinc-800 shadow-xl">
            <Ghost
              size={24}
              className={
                currentStep === 99
                  ? "text-indigo-400 animate-pulse"
                  : "text-zinc-600"
              }
            />
            <span className="text-lg font-black text-zinc-700 dark:text-zinc-300 tracking-widest uppercase">
              {currentStep === 99 ? "Observer" : "Ghost State"}
            </span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-12 py-12 scrollbar-none">
          <div className="max-w-5xl mx-auto space-y-12">
            {/* --- ステップ 0: 女王の問いかけ --- */}
            {currentStep === 0 && (
              <div className="animate-in slide-in-from-bottom-8 fade-in duration-600 flex flex-col space-y-10 items-center text-center py-6">
                <div className="w-24 h-24 bg-white dark:bg-zinc-900 rounded-[2.5rem] border-2 border-zinc-100 dark:border-zinc-800 flex items-center justify-center mb-2 shadow-2xl relative">
                  <Crown
                    size={54}
                    className="text-indigo-500 dark:text-indigo-400"
                  />
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-black text-indigo-900 dark:text-indigo-100 tracking-tight italic">
                    「不確かな存在で名前がまだないシュレディンガー(あなた)さん。ようこそ、ここは始まりの国です。」
                  </h2>
                  <p className="text-zinc-600 dark:text-zinc-300 text-lg leading-relaxed max-w-4xl font-medium px-8">
                    そして、私はこの始まりの国を治める女王です。アカウントを作ったばかりのあなたは、まだ形を持たない「幽霊」の状態なのです。
                    <br />
                    現在、眺めること(ウォッチ)はできますが、この世界で誰かと繋がったり、イベントに参加したりするには「仮面（プロフィール）」を作る必要があります。
                    <br />
                    選択肢はいくつかありますが、これからどうするか決めてくださいね。
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 w-full max-w-4xl mt-6 px-4">
                  {/* 1. チュートリアル案内 */}
                  {/* 1. チュートリアル案内 (Disabled) */}
                  <button
                    disabled
                    className="p-10 rounded-[3rem] bg-zinc-100 dark:bg-zinc-900/10 border-2 border-zinc-200 dark:border-zinc-800/50 opacity-60 cursor-not-allowed text-left flex items-center space-x-10 group shrink-0 relative overflow-hidden grayscale"
                  >
                    <div className="absolute inset-0 flex items-center justify-center bg-white/40 dark:bg-black/40 z-10 backdrop-blur-[1px]">
                      <span className="bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 px-6 py-2 rounded-full font-bold border border-zinc-200 dark:border-zinc-700 flex items-center gap-2 transform -rotate-3 text-sm">
                        <Lock size={16} />
                        チュートリアル（MVP対象外・後回し）
                      </span>
                    </div>
                    <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/10 rounded-[2rem] flex items-center justify-center shrink-0">
                      <BookOpen
                        className="text-emerald-700 dark:text-emerald-800"
                        size={48}
                      />
                    </div>
                    <div className="flex-1 opacity-50">
                      <p className="text-xl font-black text-emerald-900 leading-none mb-3">
                        導き手へ案内（チュートリアルの開始）
                      </p>
                      <p className="text-emerald-800/60 dark:text-emerald-900/60 text-lg leading-relaxed font-medium">
                        私の用意した導き手と一緒に、この世界の歩き方を丁寧に学べます。チュートリアルをしていくとLvがあがり使える機能が解放されていきますよ。
                      </p>
                    </div>
                    <ChevronRight size={40} className="text-emerald-900/20" />
                  </button>

                  {/* 2. プロフィールを作る */}
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="p-10 rounded-[3rem] bg-indigo-600 border-2 border-indigo-400 hover:scale-[1.02] transition-all shadow-2xl text-left flex items-center space-x-10 group"
                  >
                    <div className="w-24 h-24 bg-white/20 rounded-[2rem] flex items-center justify-center shadow-lg shrink-0 group-hover:rotate-6">
                      <Fingerprint className="text-white" size={48} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xl font-black text-white leading-none mb-3">
                        プロフィールを作る（仮面の作成）
                      </p>
                      <p className="text-indigo-100 text-lg leading-relaxed font-medium">
                        画面の指示に従って、あなたを映す「専用の仮面」を作成します。
                      </p>
                    </div>
                    <ChevronRight size={40} className="text-white/50" />
                  </button>

                  {/* 3. 幽霊のまま見て回る */}
                  <button
                    onClick={() => setCurrentStep(99)}
                    className="p-10 rounded-[3rem] bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:scale-[1.02] transition-all shadow-xl text-left flex items-center space-x-10 group shrink-0"
                  >
                    <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-800 rounded-[2rem] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Eye className="text-zinc-400" size={48} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xl font-black text-zinc-700 dark:text-zinc-300 leading-none mb-3">
                        幽霊状態のまま世界を見て回る
                      </p>
                      <p className="text-zinc-500 text-lg leading-relaxed font-medium">
                        仮面を作らず、まずは観測者として世界の様子を覗きに行きます。
                      </p>
                    </div>
                    <ChevronRight
                      size={40}
                      className="text-zinc-300 dark:text-zinc-700"
                    />
                  </button>

                  {/* 4. ゲーミフィケーション中止 */}
                  <button
                    onClick={() => {
                      alert(
                        "ゲーミフィケーションを中止し、自由行動モードで開始します（レベル制限を解除しますが、相互作用にはプロフィールが必要です）"
                      );
                      window.location.href = "/home?gamification=false";
                    }}
                    className="p-6 rounded-[2rem] bg-stone-100 dark:bg-zinc-950/50 border-2 border-stone-200 dark:border-zinc-900 hover:bg-stone-200 dark:hover:bg-zinc-900 hover:border-stone-300 dark:hover:border-zinc-700 hover:scale-[1.01] transition-all shadow-md text-left flex items-center space-x-8 group shrink-0 mt-4 mx-auto w-[90%]"
                  >
                    <div className="w-16 h-16 bg-white dark:bg-zinc-900 rounded-[1.5rem] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <X
                        className="text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-500 dark:group-hover:text-zinc-300"
                        size={32}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-lg font-black text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 leading-none mb-2">
                        ゲーミフィケーションを中止して自分で行動を決める
                      </p>
                      <p className="text-zinc-500 dark:text-zinc-600 text-base leading-relaxed font-medium">
                        ※一旦はレベルの制限をなくし自由に行動と選択ができます。ただしプロフィールを作らないと見て回るだけしか出来ないのは同じです。
                      </p>
                    </div>
                    <ChevronRight
                      size={32}
                      className="text-zinc-800 group-hover:text-zinc-600"
                    />
                  </button>
                </div>
              </div>
            )}

            {/* --- ステップ 99: 幽霊モード (2D探索マップ) --- */}
            {currentStep === 99 && (
              <div className="flex flex-col items-center justify-center p-8 animate-in fade-in duration-700">
                <div className="w-full max-w-5xl">
                  <GhostMap
                    onBack={() => setCurrentStep(0)}
                    activeProfile={activeProfile}
                    onUpdateProfile={handleUpdateProfile}
                  />
                </div>
              </div>
            )}

            {/* --- ステップ 88: チュートリアル案内 --- */}
            {currentStep === 88 && (
              <div className="animate-in fade-in zoom-in-95 duration-700 flex flex-col space-y-12 items-center py-6 text-center">
                <div className="w-full max-w-4xl p-16 bg-emerald-50 dark:bg-emerald-950/20 border-2 border-emerald-200 dark:border-emerald-500/30 rounded-[4rem] shadow-2xl relative overflow-hidden">
                  <div className="absolute -right-16 -top-16 opacity-[0.03]">
                    <BookOpen size={400} className="text-emerald-400" />
                  </div>
                  <BookOpen
                    size={80}
                    className="text-emerald-500 dark:text-emerald-400 mx-auto mb-10"
                  />
                  <h2 className="text-2xl font-black text-emerald-800 dark:text-emerald-100 mb-8 tracking-tight">
                    導き手に会いに行きますか？
                  </h2>
                  <p className="text-emerald-900/70 dark:text-zinc-300 text-lg leading-relaxed mb-12 font-medium px-10">
                    始まりの国の女王様が用意した「導き手」は、新しく訪れたシュレディンガーちゃんを心待ちにしています。
                    <br />
                    この世界の歩き方や、仮面の作り方、価値観でつながる喜びを、対話を通じて一つずつ学んでいきましょう。
                  </p>

                  <button
                    onClick={() => alert("チュートリアルを開始します。")}
                    className="w-full max-w-xl px-16 py-8 bg-emerald-500 text-emerald-950 rounded-[2.5rem] font-black text-xl hover:scale-[1.03] transition-all flex items-center justify-center space-x-6 shadow-2xl shadow-emerald-500/20"
                  >
                    <span>導き手の元へ向かう</span>
                    <ArrowRight size={32} />
                  </button>
                </div>

                <button
                  onClick={() => setCurrentStep(0)}
                  className="flex items-center space-x-4 text-zinc-500 font-bold text-lg hover:text-white transition-all underline underline-offset-8 decoration-2"
                >
                  <ChevronLeft size={28} />
                  <span>女王様の問いへ戻る</span>
                </button>
              </div>
            )}

            {/* --- ステップ 1: プロフィール作成への誘導 (リダイレクト案内) --- */}
            {currentStep === 1 && (
              <div className="animate-in slide-in-from-bottom-8 fade-in duration-600 flex flex-col items-center justify-center py-10 max-w-4xl mx-auto text-center space-y-12">
                <div className="w-32 h-32 bg-indigo-500/10 rounded-[3rem] flex items-center justify-center border-2 border-indigo-500/30 relative mb-8">
                  <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full" />
                  <Fingerprint
                    className="text-indigo-400 relative z-10"
                    size={64}
                  />
                </div>

                <div className="space-y-6">
                  <h2 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight leading-tight">
                    仮面(プロフィール)の作成
                  </h2>
                  <p className="text-xl text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium max-w-2xl mx-auto">
                    幽霊の状態では、あなたは「観測」しかできません。
                    <br />
                    誰かと話したり、作品を作ったり、市場に参加するには
                    <br />
                    <span className="text-indigo-400 font-bold">
                      「確かな実体」
                    </span>
                    が必要です。
                  </p>

                  <div className="bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 p-8 rounded-[2rem] max-w-2xl mx-auto text-left space-y-4 shadow-sm">
                    <div className="flex items-start gap-4">
                      <AlertCircle className="text-indigo-500 dark:text-indigo-400 shrink-0 mt-1" />
                      <div>
                        <h4 className="font-bold text-indigo-900 dark:text-indigo-200 mb-1">
                          プロフィール作成でできること
                        </h4>
                        <ul className="text-zinc-600 dark:text-zinc-400 space-y-2 list-disc list-inside">
                          <li>他ユーザーとの交流・マッチング</li>
                          <li>自分の作品の登録・販売</li>
                          <li>クエストやイベントへの参加</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
                  <button
                    onClick={() => router.push("/user-profiles/new")}
                    className="w-full py-6 px-8 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold text-xl transition-all shadow-xl shadow-indigo-900/20 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-4"
                  >
                    <span>プロフィール作成画面へ</span>
                    <ArrowRight />
                  </button>

                  <button
                    onClick={() => setCurrentStep(0)}
                    className="text-zinc-500 hover:text-zinc-300 font-medium transition-colors"
                  >
                    戻る
                  </button>
                </div>
              </div>
            )}

            {/* ステップ 3: 受肉の儀式（最終確認） */}
            {currentStep === 3 && (
              <div className="animate-in zoom-in-95 fade-in duration-300 flex flex-col space-y-12 items-center text-center">
                <header className="max-w-3xl">
                  <h2 className="text-2xl font-black text-zinc-900 dark:text-white leading-none uppercase italic tracking-tighter">
                    Incarnation Ritual
                  </h2>
                  <p className="text-zinc-600 dark:text-zinc-400 text-lg mt-8 font-medium leading-relaxed px-10">
                    作り上げた「仮面」は完成しました。シュレディンガーちゃん。
                    <br />
                    今、この仮面を被ることで幽霊状態を脱し、
                    <br />
                    価値観サイトの世界へ正式に「受肉（実体化）」します。
                  </p>
                </header>

                <div className="w-full max-w-4xl bg-white/50 dark:bg-zinc-900/30 border-2 border-zinc-200 dark:border-zinc-800 rounded-[4rem] p-16 space-y-12 text-left relative overflow-hidden shadow-[0_0_60px_rgba(99,102,241,0.15)]">
                  <div className="absolute -right-20 -bottom-20 opacity-[0.05]">
                    <Fingerprint size={400} className="text-indigo-400" />
                  </div>
                  <div className="flex items-center space-x-12">
                    <div className="w-56 h-56 bg-white dark:bg-zinc-950 rounded-[4rem] flex items-center justify-center text-9xl border-2 border-zinc-100 dark:border-zinc-800 shadow-inner">
                      {formData.avatar}
                    </div>
                    <div className="space-y-6">
                      <h3 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white leading-none">
                        {formData.displayName}
                      </h3>
                      <div className="flex gap-8">
                        <span className="bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 text-xl px-8 py-3 rounded-full border-2 border-indigo-500/30 font-black uppercase tracking-widest">
                          {formData.format}
                        </span>
                        <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-xl px-8 py-3 rounded-full border-2 border-zinc-200 dark:border-zinc-700 font-black uppercase tracking-widest">
                          {formData.role}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-8 border-t-2 border-zinc-100 dark:border-zinc-800 pt-16">
                    <p className="text-xl font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.4em] leading-none">
                      確定させる世界との接点
                    </p>
                    <div className="flex flex-wrap gap-6 mt-8">
                      {formData.purpose.map((p) => {
                        const labels: Record<string, string> = {
                          play_purpose: "遊ぶ目的",
                          work_purpose: "創る・働く目的",
                          partner_search: "パートナー探し",
                          consult_purpose: "相談する目的",
                        };
                        return (
                          <span
                            key={p}
                            className="bg-white/80 dark:bg-white/5 text-zinc-600 dark:text-zinc-300 text-2xl px-12 py-6 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 font-bold shadow-lg leading-none transition-all hover:bg-white dark:hover:bg-white/10"
                          >
                            {labels[p] || p}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-emerald-400/90 bg-emerald-500/5 px-16 py-8 rounded-full border-2 border-emerald-500/20 shadow-2xl">
                  <ShieldCheck size={48} />
                  <span className="text-2xl font-black uppercase tracking-widest leading-none">
                    Ready to incarnate
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* フッターアクション */}
        <footer className="h-32 px-12 border-t border-zinc-200 dark:border-zinc-900 bg-white/80 dark:bg-black/80 backdrop-blur-3xl flex items-center justify-between z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.6)]">
          <button
            onClick={() => {
              if (currentStep === 1) setCurrentStep(0);
              else if (currentStep === 3) setCurrentStep(1);
              else if (currentStep === 99 || currentStep === 88)
                setCurrentStep(0);
              else setCurrentStep((prev: number) => Math.max(0, prev - 1));
            }}
            className={`flex items-center space-x-6 px-16 py-8 rounded-[2.5rem] font-black text-xl tracking-[0.2em] transition-all ${
              currentStep === 0
                ? "opacity-0 pointer-events-none"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900/60 shadow-xl"
            }`}
          >
            <ChevronLeft size={40} />
            <span>BACK</span>
          </button>

          {currentStep !== 0 && currentStep !== 99 && currentStep !== 88 && (
            <button
              onClick={() => {
                if (currentStep === 1) setCurrentStep(3);
                else if (currentStep === 3)
                  alert("仮面を被り、世界へ受肉しました。");
              }}
              className="flex items-center space-x-8 px-24 py-8 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 rounded-[2.5rem] font-black text-2xl hover:scale-[1.03] active:scale-95 transition-all shadow-[0_0_50px_rgba(0,0,0,0.2)] dark:shadow-[0_0_50px_rgba(255,255,255,0.2)]"
            >
              <span>
                {currentStep === 3 ? "仮面を被り、世界へ受肉する" : "次に進む"}
              </span>
              <ArrowRight size={40} />
            </button>
          )}
        </footer>
      </main>

      <style jsx global>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-in {
          animation: fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default ComplexGUI;
