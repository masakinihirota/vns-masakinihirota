"use client";

import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Ghost,
  Home,
  Info,
  UserPlus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ActionButton } from "./ui/action-button";
import { SelectionCard } from "./ui/selection-card";

export function OnboardingChoice() {
  const router = useRouter();
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const paths = [
    {
      id: "tutorial",
      title: "物語を始める",
      subtitle: "チュートリアル",
      icon: (
        <BookOpen className="w-8 h-8 text-emerald-500 dark:text-emerald-400" />
      ),
      description:
        "「はじまりの国」の王様に会い、この世界の仕組みや思想を物語形式で学びます。",
      benefits: ["Lvアップ報酬あり", "世界観の理解", "王様との対話"],
      recommends: "初めての方・世界観を楽しみたい方",
      color: "emerald",
    },
    {
      id: "ghost",
      title: "自由に探索する",
      subtitle: "ゴーストモード",
      icon: <Ghost className="w-8 h-8 text-purple-500 dark:text-purple-400" />,
      description:
        "「幽霊」として誰にも干渉されず、マップを自由に歩き回ります。地図を拾うところから始まります。",
      benefits: ["即座に行動開始", "誰からも見えない", "ゲーム形式の操作"],
      recommends: "とりあえず動かしたい方・ゲーム慣れしている方",
      color: "purple",
    },
    {
      id: "profile",
      title: "仮面を作る",
      subtitle: "プロフィール作成",
      icon: <UserPlus className="w-8 h-8 text-amber-500 dark:text-amber-400" />,
      description:
        "あなたの分身となる「ユーザープロフィール（仮面）」を作成し、すぐに社会活動を開始します。",
      benefits: ["機能の早期解放", "マッチング利用", "自己表現"],
      recommends: "目的が決まっている方・すぐに交流したい方",
      color: "amber",
    },
    {
      id: "home",
      title: "何もしない",
      subtitle: "スキップ",
      icon: <Home className="w-8 h-8 text-slate-500 dark:text-slate-400" />,
      description:
        "何も選択せず、そのままトップページ（ホーム）へ移動します。いつでも後から選択可能です。",
      benefits: ["すぐにホームへ", "選択を保留", "自由行動"],
      recommends: "今は選びたくない方",
      color: "slate",
    },
  ];

  const handleSelect = (id: string) => {
    if (isConfirming) return;
    setSelectedPath(id);
  };

  const handleConfirm = () => {
    if (!selectedPath) return;
    setIsConfirming(true);

    // Simulate API call or transition delay and then route
    setTimeout(() => {
      switch (selectedPath) {
        case "tutorial":
          router.push("/tutorial/story");
          break;
        case "ghost":
          router.push("/ghost");
          break;
        case "profile":
          router.push("/profile/create"); // Assuming standard create path, verify if needed
          break;
        case "home":
          router.push("/"); // Or /home based on requirement. User said "Top page"
          break;
        default:
          router.push("/dev-dashboard");
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-slate-950 text-neutral-900 dark:text-slate-100 font-sans selection:bg-blue-500/30 flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-500">
      {/* Background Ambient Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-blue-200/40 dark:bg-blue-900/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[20%] w-[500px] h-[500px] bg-purple-200/40 dark:bg-purple-900/10 rounded-full blur-[100px]" />
      </div>

      <div className="z-10 max-w-7xl w-full flex flex-col items-center space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-4 animate-in fade-in slide-in-from-top-8 duration-700">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-neutral-800 via-neutral-600 to-neutral-800 dark:from-white dark:via-slate-200 dark:to-slate-400">
            あなたの旅を選択してください
          </h1>
          <p className="text-neutral-600 dark:text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            ようこそ、VNS masakinihirotaへ。
            <br className="hidden md:block" />
            あなたは今、「始まりの場所」に立っています。最初の一歩をどのように踏み出しますか？
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          {paths.map((path) => (
            <SelectionCard
              key={path.id}
              selected={selectedPath === path.id}
              onClick={() => handleSelect(path.id)}
              className="group flex flex-col h-full p-6 md:p-8 hover:bg-white dark:hover:bg-slate-900 dark:hover:border-slate-400 transition-all"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between mb-6">
                <div
                  className={`p-3 rounded-2xl bg-neutral-100 dark:bg-slate-950 border border-neutral-200 dark:border-slate-800 shadow-inner group-hover:scale-110 transition-transform duration-300`}
                >
                  {path.icon}
                </div>
                {selectedPath === path.id && (
                  <div className="animate-in zoom-in duration-300">
                    <CheckCircle2 className="w-6 h-6 text-blue-500" />
                  </div>
                )}
              </div>

              {/* Card Content */}
              <div className="flex-1 space-y-4">
                <div>
                  <p
                    className={`text-lg font-bold uppercase tracking-wider mb-1 text-${path.color}-600/80 dark:text-${path.color}-400/80 dark:group-hover:text-${path.color}-300 transition-colors`}
                  >
                    {path.subtitle}
                  </p>
                  <h3 className="text-xl font-bold text-neutral-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-200 transition-colors">
                    {path.title}
                  </h3>
                </div>

                <p className="text-lg text-neutral-600 dark:text-slate-400 dark:group-hover:text-slate-200 transition-colors leading-relaxed min-h-[4.5em]">
                  {path.description}
                </p>

                {/* Benefits List */}
                <div className="pt-4 border-t border-neutral-200 dark:border-slate-800/50">
                  <ul className="space-y-2">
                    {path.benefits.map((benefit, idx) => (
                      <li
                        key={idx}
                        className="flex items-center text-lg text-neutral-500 dark:text-slate-500 group-hover:text-neutral-700 dark:group-hover:text-slate-300 transition-colors"
                      >
                        <span
                          className={`w-1 h-1 rounded-full mr-2 bg-${path.color}-500/50`}
                        ></span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommendation Tag */}
              <div className="mt-6 pt-4">
                <div className="flex items-center gap-2 text-lg text-neutral-500 dark:text-slate-500 font-medium bg-neutral-100 dark:bg-slate-950/50 px-3 py-2 rounded-lg border border-neutral-200 dark:border-slate-800/50">
                  <Info className="w-3 h-3" />
                  {path.recommends}
                </div>
              </div>
            </SelectionCard>
          ))}
        </div>

        {/* Action Bar */}
        <div
          className={`
          flex flex-col items-center space-y-4 transition-all duration-500
          ${selectedPath ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}
        `}
        >
          <ActionButton
            onClick={handleConfirm}
            className="w-64 h-14 text-lg shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] transition-shadow"
            disabled={isConfirming}
          >
            {isConfirming ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                準備中...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                このルートで開始する <ArrowRight className="w-5 h-5" />
              </span>
            )}
          </ActionButton>
          <p className="text-lg text-neutral-500 dark:text-slate-500">
            ※ 選択した内容は後から変更・追加可能です。
          </p>
        </div>
      </div>
    </div>
  );
}
