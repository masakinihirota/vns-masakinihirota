export interface ValueItem {
  id: string;
  question: string;
  description: string;
  category: "work" | "life" | "social" | "money";
}

export interface UserValueAnswer {
  id: string;
  questionId: string;
  answer: number; // 0-100 scale
  isPublic: boolean;
}

export interface ValueGap {
  questionId: string;
  subjectAnswer: number;
  candidateAnswer: number;
  gap: number;
}
