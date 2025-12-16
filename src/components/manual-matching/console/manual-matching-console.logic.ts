import { UserProfile, Work } from "../common/types";

// Mock Data
export const MOCK_SUBJECTS: UserProfile[] = [
  {
    id: "sub-001",
    name: "佐藤 健太",
    age: 28,
    gender: "male",
    location: "東京都 渋谷区",
    occupation: "ITエンジニア",
    income: "600-800万円",
    hobbies: ["映画鑑賞", "キャンプ"],
    bio: "都内でエンジニアをしています。休日はカフェ巡りやキャンプに行くのが好きです。",
    photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kenta&backgroundColor=b6e3f4",
    tags: ["初婚", "土日休み"],
    matchStatus: "searching",
    manualPriority: 1,
    favoriteWorks: [
      { category: "comic", title: "ONE PIECE" },
      { category: "comic", title: "宇宙兄弟" },
      { category: "movie", title: "インセプション" },
      { category: "game", title: "ゼルダの伝説" },
    ],
    values: ["仕事より家庭優先", "隠し事はしない", "週末はアクティブに", "金銭感覚は堅実"],
  },
  {
    id: "sub-002",
    name: "田中 美咲",
    age: 32,
    gender: "female",
    location: "神奈川県 横浜市",
    occupation: "薬剤師",
    income: "500-700万円",
    hobbies: ["ヨガ", "旅行"],
    bio: "仕事も落ち着いてきたので、将来を見据えたパートナーを探しています。",
    photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Misaki&backgroundColor=ffdfbf",
    tags: ["初婚", "ペット可"],
    matchStatus: "searching",
    manualPriority: 2,
    favoriteWorks: [
      { category: "movie", title: "ラ・ラ・ランド" },
      { category: "book", title: "ハリー・ポッター" },
      { category: "comic", title: "スラムダンク" },
    ],
    values: ["一人の時間も大切", "食の好みが合う", "ありがとうを言葉にする", "記念日を祝う"],
  },
];

export const MOCK_CANDIDATES: UserProfile[] = [
  {
    id: "cand-101",
    name: "伊藤 麻衣",
    age: 26,
    gender: "female",
    location: "東京都 目黒区",
    occupation: "デザイナー",
    income: "400-600万円",
    hobbies: ["美術館巡り", "カフェ"],
    bio: "デザイン関係の仕事をしています。感性が合う方とお話したいです。",
    photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mai&backgroundColor=ffdfbf",
    tags: ["初婚", "インドア派"],
    matchStatus: "searching",
    compatibilityScore: 88,
    manualPriority: 0,
    favoriteWorks: [
      { category: "comic", title: "宇宙兄弟" },
      { category: "movie", title: "グレイテスト・ショーマン" },
      { category: "game", title: "あつまれ どうぶつの森" },
    ],
    values: ["仕事より家庭優先", "嘘をつかない", "週末はのんびり", "記念日を祝う"],
  },
  {
    id: "cand-102",
    name: "高橋 優子",
    age: 30,
    gender: "female",
    location: "東京都 新宿区",
    occupation: "看護師",
    income: "500-600万円",
    hobbies: ["料理", "ランニング"],
    bio: "明るい性格と言われます。一緒に美味しいご飯を食べられる人が好きです。",
    photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Yuko&backgroundColor=ffdfbf",
    tags: ["初婚", "料理好き"],
    matchStatus: "searching",
    compatibilityScore: 92,
    manualPriority: 0,
    favoriteWorks: [
      { category: "comic", title: "ONE PIECE" },
      { category: "game", title: "ゼルダの伝説" },
      { category: "movie", title: "ジブリ作品" },
    ],
    values: ["週末はアクティブに", "金銭感覚は堅実", "隠し事はしない", "食事が楽しみ"],
  },
];

// Logic
export const calculateComparison = (subject: UserProfile, candidate: UserProfile) => {
  // Implement standard intersection logic
  const commonWorks = subject.favoriteWorks.filter((sWork) =>
    candidate.favoriteWorks.some((cWork) => cWork.title === sWork.title),
  );

  const subjectUniqueWorks = subject.favoriteWorks.filter(
    (sWork) => !candidate.favoriteWorks.some((cWork) => cWork.title === sWork.title),
  );

  const candidateUniqueWorks = candidate.favoriteWorks.filter(
    (cWork) => !subject.favoriteWorks.some((sWork) => sWork.title === cWork.title),
  );

  const commonValues = subject.values.filter((sVal) => candidate.values.includes(sVal));

  const subjectUniqueValues = subject.values.filter((sVal) => !candidate.values.includes(sVal));
  const candidateUniqueValues = candidate.values.filter((cVal) => !subject.values.includes(cVal));

  return {
    commonWorks,
    subjectUniqueWorks,
    candidateUniqueWorks,
    commonValues,
    subjectUniqueValues,
    candidateUniqueValues,
  };
};

export const fetchSubjects = async (): Promise<UserProfile[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_SUBJECTS), 400));
};

export const fetchCandidates = async (subjectGender: string): Promise<UserProfile[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filtered = MOCK_CANDIDATES.filter(
        (c) =>
          (subjectGender === "male" && c.gender === "female") ||
          (subjectGender === "female" && c.gender === "male"),
      );
      resolve(filtered);
    }, 400);
  });
};
