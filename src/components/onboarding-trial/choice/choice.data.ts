import { BookOpen, Ghost, UserPlus, Home } from "lucide-react";
import React from "react";

export type ChoiceId = "tutorial" | "ghost" | "profile" | "home";

export interface ChoicePath {
  id: ChoiceId;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  benefits: string[];
  recommends: string;
  color: "emerald" | "purple" | "amber" | "slate";
}

export const CHOICE_PATHS: ChoicePath[] = [
  {
    id: "tutorial",
    title: "物語を始める",
    subtitle: "チュートリアル",
    icon: BookOpen,
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
    icon: Ghost,
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
    icon: UserPlus,
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
    icon: Home,
    description:
      "何も選択せず、そのままトップページ（ホーム）へ移動します。いつでも後から選択可能です。",
    benefits: ["すぐにホームへ", "選択を保留", "自由行動"],
    recommends: "今は選びたくない方",
    color: "slate" as any, // Temporary fix for type strictness if needed, or update ChoicePath color type
  },
] as const;
