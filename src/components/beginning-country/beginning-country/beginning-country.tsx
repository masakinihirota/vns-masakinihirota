"use client";

import {
  User,
  Plus,
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
} from "lucide-react";
import React from "react";
import {
  BeginningCountryStep,
  BeginningCountryFormData,
} from "./beginning-country.logic";

interface BeginningCountryProps {
  currentStep: BeginningCountryStep;
  onStepChange: (step: BeginningCountryStep) => void;
  formData: BeginningCountryFormData;
  onUpdateForm: (data: Partial<BeginningCountryFormData>) => void;
  nameCandidates: string[];
  onGenerateNames: () => void;
  onRestoreNames: () => void;
  isRotating: boolean;
  canRestore: boolean;
  zodiac: { name: string; emoji: string };
}

export function BeginningCountry({
  currentStep,
  onStepChange,
  formData,
  onUpdateForm,
  nameCandidates,
  onGenerateNames,
  onRestoreNames,
  isRotating,
  canRestore,
  zodiac,
}: BeginningCountryProps) {
  const steps = [
    { id: 0, title: "はじまりの選択" },
    { id: 1, title: "仮面の作成" },
    { id: 3, title: "受肉の儀式" },
  ];

  const ListSelector = ({
    options,
    value,
    onChange,
    disabledFn = () => false,
    isMulti = false,
  }: {
    options: { id: string; label: string; sub?: string }[];
    value: string | string[];
    onChange: (val: any) => void;
    disabledFn?: (id: string) => boolean;
    isMulti?: boolean;
  }) => {
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
                  className={`w-4 h-4 rounded-full transition-all ${
                    active
                      ? "bg-indigo-400 scale-125 shadow-[0_0_15px_rgba(129,140,248,0.8)]"
                      : "bg-zinc-700"
                  }`}
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
              {active && (
                <Check size={32} className="text-indigo-400 shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-[#020204] text-zinc-100 overflow-hidden font-sans">
      {/* サイドバー */}
      <aside className="w-80 border-r border-zinc-900 bg-black/60 flex flex-col shrink-0">
        <div className="p-8">
          <div className="flex items-center space-x-4 mb-12">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-600/30">
              <User className="text-white" size={28} />
            </div>
            <h1 className="font-black text-xl tracking-tighter uppercase italic text-indigo-100 italic">
              Masakinihirota
            </h1>
          </div>
          <nav className="space-y-4">
            {steps.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  if (![99, 88].includes(currentStep))
                    onStepChange(s.id as BeginningCountryStep);
                }}
                className={`w-full flex items-center space-x-5 p-6 rounded-2xl transition-all text-left group ${
                  Math.floor(currentStep) === s.id
                    ? "bg-indigo-600/10 border-l-4 border-indigo-500 shadow-lg"
                    : "hover:bg-zinc-800 border-l-4 border-transparent"
                }`}
              >
                <div
                  className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-lg font-black border-2 transition-colors ${
                    Math.floor(currentStep) === s.id
                      ? "bg-indigo-50 border-indigo-400 text-indigo-600 shadow-lg"
                      : currentStep > s.id && ![99, 88].includes(currentStep)
                        ? "bg-emerald-500 border-emerald-400 text-white"
                        : "border-zinc-700 text-zinc-500 group-hover:border-zinc-500"
                  }`}
                >
                  {currentStep > s.id && ![99, 88].includes(currentStep) ? (
                    <Check size={20} />
                  ) : (
                    s.id
                  )}
                </div>
                <p
                  className={`text-lg font-bold tracking-tight ${
                    Math.floor(currentStep) === s.id
                      ? "text-zinc-100"
                      : "text-zinc-500 group-hover:text-zinc-300"
                  }`}
                >
                  {s.title}
                </p>
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-8 border-t border-zinc-900/50 bg-black/40 text-center">
          <p className="text-lg text-zinc-500 font-bold italic leading-snug">
            "不確かな存在を、
            <br />
            愛おしく想います。"
          </p>
        </div>
      </aside>

      {/* メインコンテンツ */}
      <main className="flex-1 flex flex-col relative bg-[radial-gradient(circle_at_20%_10%,_rgba(67,56,202,0.1),_transparent)] overflow-hidden">
        <header className="h-20 px-12 flex items-center justify-between border-b border-zinc-900/50 backdrop-blur-3xl sticky top-0 z-20">
          <div className="flex items-center space-x-3 text-zinc-500 text-lg font-bold tracking-widest uppercase">
            <span>Identity Flow</span>
            <ChevronRight size={16} />
            <span className="text-zinc-100 uppercase tracking-widest">
              Step {currentStep === 99 ? "?" : currentStep}
            </span>
          </div>
          <div className="flex items-center space-x-5 bg-zinc-900/80 px-6 py-2.5 rounded-full border border-zinc-800 shadow-xl">
            <Ghost
              size={24}
              className={
                currentStep === 99
                  ? "text-indigo-400 animate-pulse"
                  : "text-zinc-600"
              }
            />
            <span className="text-lg font-black text-zinc-300 tracking-widest uppercase">
              {currentStep === 99 ? "Observer" : "Ghost State"}
            </span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-12 py-12 scrollbar-hide">
          <div className="max-w-5xl mx-auto space-y-12">
            {/* --- ステップ 0: 女王の問いかけ --- */}
            {currentStep === 0 && (
              <div className="animate-in slide-in-from-bottom-8 fade-in duration-600 flex flex-col space-y-10 items-center text-center py-6">
                <div className="w-24 h-24 bg-zinc-900 rounded-[2.5rem] border-2 border-zinc-800 flex items-center justify-center mb-2 shadow-2xl relative">
                  <Crown size={54} className="text-indigo-400" />
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-black text-indigo-100 tracking-tight italic">
                    「不確かな存在で名前がまだないシュレディンガー(あなた)さん。ようこそ、ここは始まりの国です。」
                  </h2>
                  <p className="text-zinc-300 text-lg leading-relaxed max-w-4xl font-medium px-8">
                    そして、私はこの始まりの国を治める女王です。アカウントを作ったばかりのあなたは、まだ形を持たない「幽霊」の状態なのです。
                    <br />
                    現在、眺めること(ウォッチ)はできますが、この世界で誰かと繋がったり、イベントに参加したりするには「仮面（プロフィール）」を作る必要があります。
                    <br />
                    この世界で誰かと繋がったり、参加したりするには「仮面（プロフィール）」を完成させて被らなければなりません。
                    <br />
                    選択肢は３つ、これからどうするか決めてくださいね。
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 w-full max-w-4xl mt-6 px-4">
                  {/* 1. プロフィールを作る */}
                  <button
                    onClick={() => onStepChange(1)}
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
                        あなたを確定する仮面（プロフィール）を作成します。
                      </p>
                    </div>
                    <ChevronRight size={40} className="text-white/50" />
                  </button>

                  {/* 2. 幽霊のまま見て回る */}
                  <button
                    onClick={() => onStepChange(99)}
                    className="p-10 rounded-[3rem] bg-zinc-900 border-2 border-zinc-800 hover:bg-zinc-800 hover:scale-[1.02] transition-all shadow-xl text-left flex items-center space-x-10 group shrink-0"
                  >
                    <div className="w-24 h-24 bg-zinc-800 rounded-[2rem] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Eye className="text-zinc-400" size={48} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xl font-black text-zinc-300 leading-none mb-3">
                        仮面（プロフィール）を作成せずに、幽霊状態のまま世界を見て回る
                      </p>
                      <p className="text-zinc-500 text-lg leading-relaxed font-medium">
                        まずは観測者としてこの世界の様子を見に行きます。
                      </p>
                    </div>
                    <ChevronRight size={40} className="text-zinc-700" />
                  </button>

                  {/* 3. チュートリアル案内 */}
                  <button
                    onClick={() => onStepChange(88)}
                    className="p-10 rounded-[3rem] bg-emerald-900/30 border-2 border-emerald-500/30 hover:bg-emerald-900/50 hover:scale-[1.02] transition-all shadow-xl text-left flex items-center space-x-10 group shrink-0"
                  >
                    <div className="w-24 h-24 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center shrink-0 group-hover:rotate-12 transition-transform">
                      <BookOpen className="text-emerald-400" size={48} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xl font-black text-emerald-100 leading-none mb-3">
                        導き手へ案内（チュートリアルの開始）
                      </p>
                      <p className="text-emerald-400/60 text-lg leading-relaxed font-medium">
                        私の用意した導き手と一緒に、丁寧にこの世界の歩き方を学べます。チュートリアルをしていくとLvが上がり、使える機能が解放されていきますよ。
                      </p>
                    </div>
                    <ChevronRight size={40} className="text-emerald-500/50" />
                  </button>

                  {/* 4. ゲーミフィケーション中止 */}
                  <button
                    onClick={() => onStepChange(77)}
                    className="p-6 rounded-[2rem] bg-zinc-950/50 border-2 border-zinc-900 hover:bg-zinc-900 hover:border-zinc-700 hover:scale-[1.01] transition-all shadow-md text-left flex items-center space-x-8 group shrink-0 mt-4 mx-auto w-[90%]"
                  >
                    <div className="w-16 h-16 bg-zinc-900 rounded-[1.5rem] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <X
                        className="text-zinc-500 group-hover:text-zinc-300"
                        size={32}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-lg font-black text-zinc-400 group-hover:text-zinc-200 leading-none mb-2">
                        ゲーミフィケーションを中止して自分で行動を決める
                      </p>
                      <p className="text-zinc-600 text-base leading-relaxed font-medium">
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

            {/* --- ステップ 99: 幽霊モードの詳細案内 --- */}
            {currentStep === 99 && (
              <div className="animate-in fade-in zoom-in-95 duration-700 flex flex-col space-y-12 items-center py-6">
                <div className="w-full max-w-5xl p-12 bg-zinc-900/50 border-2 border-indigo-500/20 rounded-[4rem] relative overflow-hidden shadow-2xl">
                  <div className="absolute -right-20 -top-20 opacity-5">
                    <Ghost size={500} className="text-indigo-400" />
                  </div>

                  <div className="relative z-10 space-y-12">
                    <div className="text-center">
                      <h2 className="text-2xl font-black text-indigo-100 mb-8 tracking-tight italic underline decoration-indigo-500 underline-offset-8">
                        シュレディンガーちゃんの観測
                      </h2>
                      <p className="text-zinc-300 text-lg leading-relaxed font-medium px-12">
                        眺めること(ウォッチ)はできますが、まだあなたは「実体」がありません。
                        <br />
                        プロフィール（仮面）がなくても、すぐに以下のことを「見る（観測）」ことが可能です。
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        {
                          icon: <Activity />,
                          title: "マッチングの観測",
                          desc: "価値観を基にした相性を算出します",
                        },
                        {
                          icon: <ShoppingBag />,
                          title: "マーケットを覗く",
                          desc: "流通する作品や依頼を閲覧します",
                        },
                        {
                          icon: <Layers />,
                          title: "登録作品を見る",
                          desc: "人々が生み出した感動の記録です",
                        },
                        {
                          icon: <ShieldCheck />,
                          title: "価値観に答える",
                          desc: "お題に答え、自分自身を観測します",
                        },
                        {
                          icon: <Plus />,
                          title: "スキルを見る",
                          desc: "他者が持つ多様な能力の目録です",
                        },
                        {
                          icon: <Grid />,
                          title: "マンダラチャート作成",
                          desc: "思考を整理し、深淵を覗き込みます",
                        },
                        {
                          icon: <Newspaper />,
                          title: "最新情報を見る",
                          desc: "世界で今何が起きているかを知ります",
                        },
                        {
                          icon: <ClipboardList />,
                          title: "リストを見る",
                          desc: "誰かの「まとめ」を観測します",
                        },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center space-x-6 bg-zinc-950/80 p-8 rounded-[2rem] border border-zinc-800 hover:border-indigo-500/40 transition-all group shadow-xl"
                        >
                          <div className="p-4 bg-zinc-900 rounded-2xl text-indigo-400 shadow-xl group-hover:scale-110 transition-transform">
                            {item.icon}
                          </div>
                          <div>
                            <p className="text-lg font-bold text-zinc-100 mb-1 leading-none">
                              {item.title}
                            </p>
                            <p className="text-lg text-zinc-600 leading-snug font-medium">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-10 bg-indigo-950/20 border-2 border-indigo-500/30 rounded-[3rem] space-y-6 text-center">
                      <p className="text-lg text-zinc-400 leading-relaxed font-medium">
                        ※幽霊状態はあくまで
                        <span className="text-indigo-300 font-bold">
                          「観測者」
                        </span>
                        としての滞在です。
                        <br />
                        誰かを応援したり、マッチングで繋がったり、イベントや国の活動に直接参加するには、
                        <br />
                        <span
                          className="text-white font-bold underline decoration-indigo-500 underline-offset-8 cursor-pointer hover:text-indigo-200 transition-colors"
                          onClick={() => onStepChange(1)}
                        >
                          ユーザープロフィール（仮面）
                        </span>
                        を完成させて装着する必要があります。
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8 w-full max-w-4xl">
                  <button
                    onClick={() => onStepChange(0)}
                    className="flex-1 w-full px-12 py-10 border-2 border-zinc-800 text-zinc-400 rounded-[2.5rem] font-bold text-lg hover:text-white hover:bg-zinc-800 transition-all flex items-center justify-center space-x-4 shadow-xl"
                  >
                    <ChevronLeft size={36} />
                    <span>女女王様の問いに戻る</span>
                  </button>
                  <button
                    onClick={() => {
                      /* Dashboard redirect handled in container */
                    }}
                    className="flex-[2] w-full px-16 py-10 bg-white text-zinc-950 rounded-[2.5rem] font-black text-xl hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center space-x-6 shadow-2xl shadow-white/10"
                  >
                    <span>幽霊のまま観測に出る</span>
                    <ArrowRight size={40} />
                  </button>
                </div>
              </div>
            )}

            {/* --- ステップ 88: チュートリアル案内 --- */}
            {currentStep === 88 && (
              <div className="animate-in fade-in zoom-in-95 duration-700 flex flex-col space-y-12 items-center py-6 text-center">
                <div className="w-full max-w-4xl p-16 bg-emerald-950/20 border-2 border-emerald-500/30 rounded-[4rem] shadow-2xl relative overflow-hidden">
                  <div className="absolute -right-16 -top-16 opacity-[0.03]">
                    <BookOpen size={400} className="text-emerald-400" />
                  </div>
                  <BookOpen
                    size={80}
                    className="text-emerald-400 mx-auto mb-10"
                  />
                  <h2 className="text-2xl font-black text-emerald-100 mb-8 tracking-tight">
                    導き手に会いに行きますか？
                  </h2>
                  <p className="text-zinc-300 text-lg leading-relaxed mb-12 font-medium px-10">
                    始まりの国の女女王様が用意した「導き手」は、新しく訪れたシュレディンガーちゃんを心待ちにしています。
                    <br />
                    この世界の歩き方や、仮面の作り方、価値観でつながる喜びを、対話を通じて一つずつ学んでいきましょう。
                  </p>

                  <button
                    onClick={() => {
                      /* Tutorial behavior handled in container */
                    }}
                    className="w-full max-w-xl px-16 py-8 bg-emerald-500 text-emerald-950 rounded-[2.5rem] font-black text-xl hover:scale-[1.03] transition-all flex items-center justify-center space-x-6 shadow-2xl shadow-emerald-500/20"
                  >
                    <span>導き手の元へ向かう</span>
                    <ArrowRight size={32} />
                  </button>
                </div>

                <button
                  onClick={() => onStepChange(0)}
                  className="flex items-center space-x-4 text-zinc-500 font-bold text-lg hover:text-white transition-all underline underline-offset-8 decoration-2"
                >
                  <ChevronLeft size={28} />
                  <span>女女王様の問いへ戻る</span>
                </button>
              </div>
            )}

            {/* --- ステップ 1: 仮面の作成（プロフィール） --- */}
            {currentStep === 1 && (
              <div className="animate-in slide-in-from-bottom-8 fade-in duration-600 flex flex-col space-y-12 pb-20">
                <div className="bg-indigo-600/5 border-2 border-indigo-500/20 rounded-[3rem] p-12 relative overflow-hidden group shadow-2xl">
                  <div className="absolute -right-10 -top-10 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Sparkles size={260} className="text-indigo-400" />
                  </div>
                  <div className="relative z-10 flex items-start space-x-10">
                    <div className="p-8 bg-indigo-500/10 rounded-[1.5rem] border-2 border-indigo-500/30 shadow-inner">
                      <Fingerprint className="text-indigo-400" size={54} />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-black text-indigo-100 mb-5 tracking-tight leading-none italic uppercase">
                        Generate Mask
                      </h2>
                      <p className="text-zinc-300 text-lg leading-relaxed font-medium">
                        この世界での「名前」と「あり方」を定めたプロフィールという名の仮面を作り上げましょう。
                        <br />
                        完成して装着した時、あなたは初めて幽霊を卒業し、確かな実体として「受肉」できます。
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-12">
                  <section className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <span className="w-2.5 h-6 bg-indigo-500 rounded-full shadow-[0_0_12px_rgba(99,102,241,0.8)]" />
                      <label className="text-lg font-black text-zinc-500 uppercase tracking-widest leading-none">
                        01. 魂の刻印（不変の星座）
                      </label>
                    </div>
                    <div className="flex items-center justify-between p-10 bg-zinc-900/30 border-2 border-zinc-900 rounded-[3rem] relative shadow-inner">
                      <div className="flex items-center space-x-12 relative z-10">
                        <div className="w-32 h-32 bg-zinc-950 rounded-[2.5rem] flex items-center justify-center text-7xl shadow-2xl border border-zinc-800">
                          {zodiac.emoji}
                        </div>
                        <div>
                          <p className="text-lg font-black text-indigo-500 uppercase tracking-[0.4em] leading-none mb-4 font-bold">
                            Metadata Locked
                          </p>
                          <h3 className="text-3xl font-black tracking-tight text-white leading-none">
                            {zodiac.name}
                          </h3>
                        </div>
                      </div>
                      <div className="flex items-center space-x-5 text-zinc-600 bg-zinc-950/80 px-10 py-5 rounded-2xl border border-zinc-800">
                        <Lock size={28} />
                        <span className="text-lg font-black uppercase tracking-widest">
                          不変
                        </span>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                      <div className="flex items-center space-x-4">
                        <span className="w-2.5 h-6 bg-indigo-500 rounded-full" />
                        <label className="text-lg font-black text-zinc-500 uppercase tracking-widest leading-none">
                          02. 言霊の選定（仮面の名）
                        </label>
                      </div>
                      <div className="flex items-center space-x-5">
                        <button
                          onClick={onRestoreNames}
                          disabled={isRotating || !canRestore}
                          className={`group flex items-center space-x-3 px-8 py-5 rounded-full border-2 transition-all ${
                            isRotating || !canRestore
                              ? "opacity-10 cursor-not-allowed border-zinc-800"
                              : "bg-zinc-800 border-zinc-700 hover:text-white"
                          }`}
                        >
                          <Undo2 size={28} />
                          <span className="text-lg font-black uppercase leading-none">
                            戻す
                          </span>
                        </button>
                        <button
                          onClick={onGenerateNames}
                          disabled={isRotating}
                          className={`group flex items-center space-x-4 px-10 py-5 rounded-full border-2 transition-all ${
                            isRotating
                              ? "bg-zinc-800 border-zinc-700 text-zinc-600"
                              : "bg-indigo-600/10 border-indigo-500/50 text-indigo-300 hover:bg-indigo-600 hover:text-white shadow-xl"
                          }`}
                        >
                          <RefreshCcw
                            size={28}
                            className={isRotating ? "animate-spin" : ""}
                          />
                          <span className="text-lg font-black uppercase leading-none">
                            {isRotating ? "生成中" : "再観測"}
                          </span>
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {nameCandidates.map((name) => (
                        <button
                          key={name}
                          onClick={() => onUpdateForm({ displayName: name })}
                          className={`p-16 rounded-[3rem] border-2 flex flex-col items-center justify-center space-y-6 transition-all group ${
                            formData.displayName === name
                              ? "bg-zinc-100 text-zinc-950 border-white shadow-2xl scale-[1.03]"
                              : "bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                          }`}
                        >
                          <div
                            className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center border-2 transition-all ${
                              formData.displayName === name
                                ? "bg-indigo-600 border-indigo-400 text-white"
                                : "bg-zinc-950/50 border-zinc-800"
                            }`}
                          >
                            <Check size={32} />
                          </div>
                          <span className="text-xl font-bold tracking-tight text-center leading-relaxed">
                            {name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </section>

                  <section className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <span className="w-2.5 h-6 bg-indigo-500 rounded-full" />
                      <label className="text-lg font-black text-zinc-500 uppercase tracking-widest leading-none">
                        03. 仮面の形式（情報の深度）
                      </label>
                    </div>
                    <ListSelector
                      value={formData.format}
                      onChange={(val) => onUpdateForm({ format: val })}
                      options={[
                        {
                          id: "card",
                          label: "名刺",
                          sub: "（必要最低限の情報のみ表示します）",
                        },
                        {
                          id: "profile",
                          label: "プロフィール",
                          sub: "（ポートフォリオ、履歴書、経歴書など。仕事で使える形にします）",
                        },
                        {
                          id: "full",
                          label: "フル",
                          sub: "（制限無しですべての情報を含む完全な記録です）",
                        },
                      ]}
                    />
                  </section>
                </div>
              </div>
            )}

            {/* ステップ 3: 受肉の儀式（最終確認） */}
            {currentStep === 3 && (
              <div className="animate-in zoom-in-95 fade-in duration-300 flex flex-col space-y-12 items-center text-center">
                <header className="max-w-3xl">
                  <h2 className="text-2xl font-black text-white leading-none uppercase italic tracking-tighter">
                    Incarnation Ritual
                  </h2>
                  <p className="text-zinc-400 text-lg mt-8 font-medium leading-relaxed px-10">
                    作り上げた「仮面」は完成しました。シュレディンガーちゃん。
                    <br />
                    今、この仮面を被ることで幽霊状態を脱し、
                    <br />
                    価値観サイトの世界へ正式に「受肉（実体化）」します。
                  </p>
                </header>

                <div className="w-full max-w-4xl bg-zinc-900/30 border-2 border-zinc-800 rounded-[4rem] p-16 space-y-12 text-left relative overflow-hidden shadow-[0_0_60px_rgba(99,102,241,0.15)]">
                  <div className="absolute -right-20 -bottom-20 opacity-[0.05]">
                    <Fingerprint size={400} className="text-indigo-400" />
                  </div>
                  <div className="flex items-center space-x-12">
                    <div className="w-56 h-56 bg-zinc-950 rounded-[4rem] flex items-center justify-center text-9xl border-2 border-zinc-800 shadow-inner">
                      {formData.avatar}
                    </div>
                    <div className="space-y-6">
                      <h3 className="text-4xl font-black tracking-tight text-white leading-none">
                        {formData.displayName}
                      </h3>
                      <div className="flex gap-8">
                        <span className="bg-indigo-600/20 text-indigo-400 text-xl px-8 py-3 rounded-full border-2 border-indigo-500/30 font-black uppercase tracking-widest">
                          {formData.format}
                        </span>
                        <span className="bg-zinc-800 text-zinc-400 text-xl px-8 py-3 rounded-full border-2 border-zinc-700 font-black uppercase tracking-widest">
                          {formData.role}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-8 border-t-2 border-zinc-800 pt-16">
                    <p className="text-xl font-black text-zinc-500 uppercase tracking-[0.4em] leading-none">
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
                            className="bg-white/5 text-zinc-300 text-2xl px-12 py-6 rounded-[2.5rem] border border-zinc-800 font-bold shadow-lg leading-none transition-all hover:bg-white/10"
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
        <footer className="h-32 px-12 border-t border-zinc-900 bg-black/80 backdrop-blur-3xl flex items-center justify-between z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.6)]">
          <button
            onClick={() => {
              if (currentStep === 1) onStepChange(0);
              else if (currentStep === 3) onStepChange(1);
              else if (currentStep === 99 || currentStep === 88)
                onStepChange(0);
              else
                onStepChange(
                  Math.max(0, currentStep - 1) as BeginningCountryStep
                );
            }}
            className={`flex items-center space-x-6 px-16 py-8 rounded-[2.5rem] font-black text-xl tracking-[0.2em] transition-all ${
              currentStep === 0
                ? "opacity-0 pointer-events-none"
                : "text-zinc-500 hover:text-zinc-100 hover:bg-zinc-900/60 shadow-xl"
            }`}
          >
            <ChevronLeft size={40} />
            <span>BACK</span>
          </button>

          {currentStep !== 0 && currentStep !== 99 && currentStep !== 88 && (
            <button
              onClick={() => {
                if (currentStep === 1) onStepChange(3);
                else if (currentStep === 3) {
                  /* Create profile handled in container */
                }
              }}
              className="flex items-center space-x-8 px-24 py-8 bg-white text-zinc-950 rounded-[2.5rem] font-black text-2xl hover:scale-[1.03] active:scale-95 transition-all shadow-[0_0_50px_rgba(255,255,255,0.2)]"
            >
              <span>
                {currentStep === 3 ? "仮面を被り、世界へ受肉する" : "次に進む"}
              </span>
              <ArrowRight size={40} />
            </button>
          )}
        </footer>
      </main>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .animate-in { animation: fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
}
