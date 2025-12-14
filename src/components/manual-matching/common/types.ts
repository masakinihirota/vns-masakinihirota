export type Work = {
  category: "comic" | "movie" | "book" | "music" | "game";
  title: string;
};

export type UserProfile = {
  id: string;
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  location: string;
  occupation: string;
  income: string;
  hobbies: string[];
  bio: string;
  photoUrl: string;
  tags: string[];
  matchStatus: "pending" | "matched" | "searching";
  compatibilityScore?: number;
  manualPriority: number;
  favoriteWorks: Work[];
  values: string[];
};

export type MatchRecord = {
  id: string;
  subjectId: string;
  targetId: string;
  status: "draft" | "approved" | "rejected";
  createdAt: string;
};
