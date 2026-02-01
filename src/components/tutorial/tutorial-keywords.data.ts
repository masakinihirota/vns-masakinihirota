import { BookOpen, Eye, Ghost, VenetianMask as Mask, Shield, Wind } from "lucide-react";

export interface TutorialKeyword {
    id: string;
    label: string;
    description: string;
    icon: any;
    trigger: {
        phase: "scene1" | "scene2" | "quest" | "scene3" | "end";
        lineIndex: number;
    };
}

export const TUTORIAL_KEYWORDS: TutorialKeyword[] = [
    {
        id: "oasis",
        label: "オアシス",
        description: "VNS（この世界）の別名。情報の洪水から逃れ、翼を休めるための場所。ここでは誰もが対等で、平和に共存することを目的としています。",
        icon: Shield,
        trigger: { phase: "scene1", lineIndex: 1 }, // "ここは『はじまりの国』...オアシスです。"
    },
    {
        id: "ghost",
        label: "幽霊 (Ghost)",
        description: "登録初期のあなたの姿。誰からも観測されず、誰にも干渉できない存在。世界を安全に見て回るための保護期間です。",
        icon: Ghost,
        trigger: { phase: "scene1", lineIndex: 3 }, // "今のそなたは『幽霊（ゴースト）』..."
    },
    {
        id: "watch",
        label: "ウォッチ (Watch)",
        description: "他者の活動を一方的に観察すること。ゴースト状態では相手に通知されず、気兼ねなく他人の価値観や振る舞いを知ることができます。",
        icon: Eye,
        trigger: { phase: "scene2", lineIndex: 1 }, // "彼らを見て(ウォッチ)しています..."
    },
    {
        id: "drift",
        label: "Drift",
        description: "合わないと感じた他者やコミュニティから、静かに距離を置く機能。ブロックとは異なり、相手を傷つけず、自分の視界からフェードアウトさせます。",
        icon: Wind,
        trigger: { phase: "scene2", lineIndex: 2 }, // "静かに離れればよいのです（Drift）..."
    },
    {
        id: "mask",
        label: "仮面 (Profile)",
        description: "ユーザープロフィール（人格）のこと。VNSでは一つの人間が複数の「仮面」を持つことが推奨されており、場面ごとに使い分けることができます。",
        icon: Mask,
        trigger: { phase: "scene3", lineIndex: 2 }, // "そなたも『仮面』を被り..."
    },
    {
        id: "root-account",
        label: "ルートアカウント",
        description: "あなたの本体となる契約アカウント。複数の仮面（プロフィール）を統括する存在で、他者からは決して見えません。",
        icon: BookOpen,
        trigger: { phase: "scene3", lineIndex: 4 }, // "契約（ルートアカウント）は済んでいますね..."
    },
];
