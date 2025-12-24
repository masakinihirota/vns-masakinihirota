import { ValueItem, UserValueAnswer } from "../common/types";

export const VALUES_QUESTIONS: ValueItem[] = [
  {
    id: "v1",
    category: "work",
    question: "仕事における成長意欲",
    description: "現在のスキルアップやキャリア向上に対する優先度",
  },
  {
    id: "v2",
    category: "work",
    question: "ワークライフバランス",
    description: "仕事よりもプライベートの時間を優先するか",
  },
  {
    id: "v3",
    category: "life",
    question: "一人の時間の重要性",
    description: "パートナーや友人と過ごすより一人の時間を確保したいか",
  },
  {
    id: "v4",
    category: "life",
    question: "規則正しい生活",
    description: "毎日決まったルーティンで生活することを好むか",
  },
  {
    id: "v5",
    category: "social",
    question: "社交性",
    description: "新しい人と出会ったり、大人数の集まりに参加するのが好きか",
  },
  {
    id: "v6",
    category: "money",
    question: "貯蓄の優先度",
    description: "現在の楽しみよりも将来のために貯蓄することを優先するか",
  },
];

export const MOCK_USER_ANSWERS: UserValueAnswer[] = [
  { id: "a1", questionId: "v1", answer: 80, isPublic: true },
  { id: "a2", questionId: "v2", answer: 60, isPublic: true },
  { id: "a3", questionId: "v3", answer: 70, isPublic: false },
];

export const fetchValues = async (): Promise<ValueItem[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(VALUES_QUESTIONS), 300));
};

export const fetchUserAnswers = async (): Promise<UserValueAnswer[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_USER_ANSWERS), 400));
};

export const saveUserAnswer = async (answer: UserValueAnswer): Promise<boolean> => {
  return new Promise((resolve) => setTimeout(() => resolve(true), 500));
};
