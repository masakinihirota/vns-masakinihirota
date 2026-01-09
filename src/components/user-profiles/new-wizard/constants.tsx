import {
  User,
  MessageCircle,
  Sparkles,
  Star,
  Monitor,
  Gamepad2,
  Briefcase,
  Heart,
  Plus,
} from "lucide-react";
import React from "react";
import { UserTypeOption, PurposeOption } from "./types";

export const USER_TYPES: UserTypeOption[] = [
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
    subtitle: "対話を通じて、「相手の仮面」を作成します。",
    description:
      "実際に目の前にいる相手や、通話中の相手に質問を投げかけ、その回答を元に「相手の仮面」を作成します。",
    icon: <MessageCircle className="w-6 h-6" />,
  },
  {
    id: "IMAGINED",
    title: "心象プロフィール (IMAGINED)",
    subtitle: "自分が考えている「相手の仮面」を作成します。",
    description:
      "ニュース、SNS、ランキングなどの「断片的な外部情報」や、あなたの解釈や想像力で補完して、「あなたから見たその人」のプロフィールを作成します。",
    icon: <Sparkles className="w-6 h-6" />,
  },
  {
    id: "IDEAL",
    title: "理想像 (IDEAL)",
    subtitle:
      "「求めている人物像」や「こうありたい」という理想をプロフィール化します。",
    description: "現実の制約を取り払い、理想的なプロフィールを作成します。",
    icon: <Star className="w-6 h-6" />,
  },
  {
    id: "AI_DUMMY",
    title: "AIダミー生成 (AI DUMMY)",
    subtitle: "テスト用にランダムなプロフィールを生成します。",
    description:
      "デザインの確認や動作テストのために、AIが架空のプロフィール（作品、価値観、設定）を自動生成してプロフィール項目を埋めます。",
    icon: <Monitor className="w-6 h-6" />,
  },
];

export const ZODIAC_DATA = [
  { id: "aries", jp: "牡羊座", en: "Aries", symbol: "♈" },
  { id: "taurus", jp: "牡牛座", en: "Taurus", symbol: "♉" },
  { id: "gemini", jp: "双子座", en: "Gemini", symbol: "♊" },
  { id: "cancer", jp: "蟹座", en: "Cancer", symbol: "♋" },
  { id: "leo", jp: "獅子座", en: "Leo", symbol: "♌" },
  { id: "virgo", jp: "乙女座", en: "Virgo", symbol: "♍" },
  { id: "libra", jp: "天秤座", en: "Libra", symbol: "♎" },
  { id: "scorpio", jp: "蠍座", en: "Scorpio", symbol: "♏" },
  { id: "sagittarius", jp: "射手座", en: "Sagittarius", symbol: "♐" },
  { id: "capricorn", jp: "山羊座", en: "Capricorn", symbol: "♑" },
  { id: "aquarius", jp: "水瓶座", en: "Aquarius", symbol: "♒" },
  { id: "pisces", jp: "魚座", en: "Pisces", symbol: "♓" },
] as const;

export const NAME_ADJECTIVES = [
  "赤い",
  "青い",
  "黄色い",
  "緑の",
  "紫の",
  "橙色の",
  "黒い",
  "白い",
  "茶色の",
  "灰色の",
  "金色の",
  "銀色の",
  "茜色の",
  "翠色の",
  "瑠璃色の",
  "琥珀色の",
  "深紅の",
  "漆黒の",
];

export const NAME_CONCEPTS = [
  "炎",
  "氷",
  "光",
  "輝き",
  "幻想",
  "熱狂",
  "深遠",
  "清らかさ",
  "温かみ",
  "神秘",
  "静寂",
  "煌めき",
  "疾風",
  "雷鳴",
  "慈愛",
  "勇気",
  "叡智",
  "宿命",
];

export const GENRE_MAP: Record<string, string[]> = {
  アニメ: [
    "SF",
    "ファンタジー",
    "アクション",
    "コメディ",
    "恋愛",
    "日常",
    "学園",
    "スポーツ",
    "ミリタリー",
    "歴史",
    "ミステリー",
    "ホラー",
    "ドラマ",
    "青春",
    "音楽",
  ],
  漫画: [
    "少年漫画",
    "少女漫画",
    "青年漫画",
    "女性漫画",
    "アクション",
    "ギャグ",
    "恋愛",
    "SF",
    "ファンタジー",
    "ミステリー",
    "スポーツ",
    "歴史",
    "日常",
    "異世界",
    "青春",
  ],
  作家: [],
  スタジオ: [],
  監督: [],
};

export const PURPOSES: PurposeOption[] = [
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

export const WORK_CATEGORIES = [
  "漫画",
  "アニメ",
  "作家",
  "スタジオ",
  "監督",
  "映画",
  "小説",
  "ゲーム",
  "音楽",
  "その他",
] as const;

export const STEPS = [
  { id: 1, label: "Identity & Attributes", desc: "基本属性の設定" },
  { id: 2, label: "Own Works", desc: "自分の作品" },
  { id: 3, label: "Favorite Works", desc: "好きな作品" },
  { id: 4, label: "Values", desc: "価値観" },
  { id: 5, label: "Confirm", desc: "最終確認" },
] as const;
