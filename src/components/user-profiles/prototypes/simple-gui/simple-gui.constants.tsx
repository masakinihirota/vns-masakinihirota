import {
  User,
  Briefcase,
  Gamepad2,
  Heart,
  MessageCircle,
  Plus,
  Sparkles,
  Monitor,
  Star,
} from "lucide-react";
import React from "react";
import { UserType, Purpose, ValueQuestion } from "./simple-gui.types";

export const USER_TYPES: UserType[] = [
  {
    id: "SELF",
    title: "本人 (SELF)",
    subtitle: "「あなた自身の仮面」を作成します。",
    description:
      "最も標準的なプロフィールです。あなた自身の経歴、性格、ステータスを登録し、システム内でのあなたの「顔」となるプロフィールを作成します。",
    icon: React.createElement(User, { className: "w-6 h-6" }),
  },
  {
    id: "INTERVIEW",
    title: "インタビュー (INTERVIEW)",
    subtitle: "直接対話を通じて、「相手の仮面」を作成します。",
    description:
      "実際に相手と話して本人から直接回答を得てプロフィールを作ります。(直接本人から聞いてない場合は心象プロフィール (IMAGINED)で作成してください。)",
    icon: React.createElement(MessageCircle, { className: "w-6 h-6" }),
  },
  {
    id: "IMAGINED",
    title: "心象プロフィール (IMAGINED)",
    subtitle:
      "間接的な情報や想像から、人物像を構築し「相手の仮面」を作成します。",
    description:
      "ニュース、SNSなど間接的に得られる「断片的な外部情報」を元にあなたの解釈や想像力で「あなたから見たその人」のプロフィールを作ります。",
    icon: React.createElement(Sparkles, { className: "w-6 h-6" }),
  },
  {
    id: "IDEAL",
    title: "理想像 (IDEAL)",
    subtitle:
      "求めている人物像やこうありたいという理想をプロフィール化して「理想の仮面」を作成します",
    description: "理想的なプロフィールを作成します。",
    icon: React.createElement(Star, { className: "w-6 h-6" }),
  },
  {
    id: "AI_DUMMY",
    title: "AIダミー生成 (AI DUMMY)",
    subtitle: "テスト用にランダムなデータで「ダミーの仮面」を生成します。",
    description:
      "デザインの確認や動作テストのために、AIが架空のプロフィール（名前、画像、設定）を自動生成してプロフィール項目を埋めます。",
    icon: React.createElement(Monitor, { className: "w-6 h-6" }),
  },
];

export const PURPOSES: Purpose[] = [
  {
    id: "create_work",
    label: "創る・働く",
    icon: React.createElement(Briefcase, { className: "w-4 h-4" }),
  },
  {
    id: "play",
    label: "遊ぶ",
    icon: React.createElement(Gamepad2, { className: "w-4 h-4" }),
  },
  {
    id: "partner",
    label: "パートナー探し",
    icon: React.createElement(Heart, { className: "w-4 h-4" }),
  },
  {
    id: "consult",
    label: "相談",
    icon: React.createElement(MessageCircle, { className: "w-4 h-4" }),
  },
  {
    id: "other",
    label: "その他",
    icon: React.createElement(Plus, { className: "w-4 h-4" }),
  },
];

export const WORK_CATEGORIES = ["漫画", "アニメ"];

export const ERAS = ["2020年代", "2010年代", "2000年代", "1990年代以前"];

export const VALUE_QUESTIONS: ValueQuestion[] = [
  {
    id: "v1",
    category: "基本",
    title: "人生で最も大切にしているものは？",
    relatedPurposes: [], // Common
    tags: ["人生観", "優先順位"],
    choices: [
      { id: "c1", label: "家族との時間" },
      { id: "c2", label: "仕事での成功" },
      { id: "c3", label: "個人の自由" },
      { id: "c4", label: "社会への貢献" },
      { id: "c5", label: "富・財産" },
    ],
    infoBlocks: [
      {
        title: "マズローの欲求5段階説",
        url: "https://example.com/maslow",
        comment: "自己実現欲求との関連性を考えてみましょう。",
      },
    ],
    relatedIds: ["v2", "v3"],
  },
  {
    id: "v2",
    category: "仕事",
    title: "仕事における理想の状態は？",
    relatedPurposes: ["create_work", "consult"],
    tags: ["キャリア", "働き方"],
    choices: [
      { id: "c1", label: "高い報酬を得ること" },
      { id: "c2", label: "やりがいを感じること" },
      { id: "c3", label: "ワークライフバランス" },
      { id: "c4", label: "スキルアップ・成長" },
    ],
    infoBlocks: [],
    relatedIds: ["v1"],
  },
  {
    id: "v3",
    category: "人間関係",
    title: "パートナーに求める最も重要な要素は？",
    relatedPurposes: ["partner", "consult"],
    tags: ["恋愛", "パートナーシップ"],
    choices: [
      { id: "c1", label: "価値観の一致" },
      { id: "c2", label: "経済的な安定" },
      { id: "c3", label: "優しさ・思いやり" },
      { id: "c4", label: "容姿・スタイル" },
    ],
    infoBlocks: [],
    relatedIds: ["v1"],
  },
  {
    id: "v4",
    category: "趣味",
    title: "休日の過ごし方で最も優先するものは？",
    relatedPurposes: ["play", "other"],
    tags: ["ライフスタイル", "趣味"],
    choices: [
      { id: "c1", label: "一人で没頭する時間" },
      { id: "c2", label: "友人とワイワイ過ごす" },
      { id: "c3", label: "新しい体験・旅行" },
      { id: "c4", label: "家でゆっくり休む" },
    ],
    infoBlocks: [],
    relatedIds: [],
  },
];

export const generateDummyWorks = () => {
  const dummyWorks = [];
  const titles = [
    "冒険の旅",
    "未来戦記",
    "青春白書",
    "魔法学園",
    "宇宙開拓史",
    "日常の風景",
    "猫とロボット",
    "無限回廊",
    "英雄伝説",
    "星の記憶",
  ];
  const modifiers = [
    "ZERO",
    "GT",
    "改",
    "Re:",
    "Another",
    "Final",
    "Origins",
    "2024",
    "X",
    "SS",
  ];
  const authors = [
    "山田太郎",
    "鈴木一郎",
    "佐藤花子",
    "スタジオA",
    "Project B",
    "田中次郎",
    "高橋美咲",
    "W.Smith",
    "Team X",
    "Unknown",
  ];
  const tagsList = [
    "感動",
    "バトル",
    "恋愛",
    "日常",
    "SF",
    "ファンタジー",
    "ホラー",
    "ミステリー",
    "スポーツ",
    "歴史",
  ];

  for (let i = 1; i <= 100; i++) {
    const titleBase = titles[Math.floor(Math.random() * titles.length)];
    const modifier =
      Math.random() > 0.5
        ? modifiers[Math.floor(Math.random() * modifiers.length)]
        : "";
    const title = `${titleBase} ${modifier} ${i}`;
    const category = Math.random() > 0.5 ? "漫画" : "アニメ";
    const author = authors[Math.floor(Math.random() * authors.length)];
    const era = ERAS[Math.floor(Math.random() * ERAS.length)];

    // Pick 1-3 random tags
    const numTags = Math.floor(Math.random() * 3) + 1;
    const workTags = [];
    const availableTags = [...tagsList];
    for (let j = 0; j < numTags; j++) {
      if (availableTags.length === 0) break;
      const tagIndex = Math.floor(Math.random() * availableTags.length);
      workTags.push(availableTags[tagIndex]);
      availableTags.splice(tagIndex, 1);
    }

    dummyWorks.push({
      id: i,
      title: title,
      category: category,
      isBest: false,
      author: author,
      tags: workTags,
      era: era,
    });
  }
  return dummyWorks;
};
