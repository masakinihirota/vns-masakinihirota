export interface MatchingProfile {
  id: string;
  name: string;
  role: string;
  skills: string[];
  location: string;
  min_salary: number;
  max_salary: number;
  experience_years: number;
  avatar_url?: string;
}

export interface MatchingScore {
  session_id: string;
  candidate_id: string;
  score: number; // 0.000 to 1.000
  rank: number;
  explanation: {
    skill_match: number;
    salary_match: number;
    location_match: number;
    tags: string[];
  };
  candidate: MatchingProfile; // Join result
  created_at: string;
}

export interface SearchCriteria {
  role: string;
  skills: string[];
  location: string;
  min_salary: number;
  remote: boolean;
}

export const DUMMY_CANDIDATES: MatchingProfile[] = [
  {
    id: "c1",
    name: "田中 健太",
    role: "Frontend Engineer",
    skills: ["React", "Next.js", "TypeScript", "Tailwind"],
    location: "東京",
    min_salary: 600,
    max_salary: 800,
    experience_years: 5,
  },
  {
    id: "c2",
    name: "佐藤 優子",
    role: "Fullstack Engineer",
    skills: ["Node.js", "React", "PostgreSQL", "AWS"],
    location: "大阪",
    min_salary: 700,
    max_salary: 900,
    experience_years: 7,
  },
  {
    id: "c3",
    name: "鈴木 一郎",
    role: "Backend Engineer",
    skills: ["Go", "Docker", "Kubernetes", "gRPC"],
    location: "東京",
    min_salary: 800,
    max_salary: 1000,
    experience_years: 6,
  },
  {
    id: "c4",
    name: "高橋 美咲",
    role: "UI/UX Designer",
    skills: ["Figma", "Adobe XD", "HTML/CSS"],
    location: "リモート",
    min_salary: 500,
    max_salary: 700,
    experience_years: 3,
  },
  {
    id: "c5",
    name: "伊藤 翔",
    role: "Frontend Engineer",
    skills: ["Vue.js", "Nuxt", "JavaScript"],
    location: "福岡",
    min_salary: 550,
    max_salary: 750,
    experience_years: 4,
  },
];

export const calculateMatches = async (
  criteria: SearchCriteria,
): Promise<MatchingScore[]> => {
  // Simulating API latency
  await new Promise((resolve) => setTimeout(resolve, 800));

  const scoredResults = DUMMY_CANDIDATES.map((candidate) => {
    // Simple mock scoring logic
    let score = 0.5;
    if (candidate.role === criteria.role) score += 0.3;
    if (candidate.location.includes(criteria.location)) score += 0.1;
    if (candidate.min_salary <= criteria.min_salary) score += 0.1;

    // Normalize score 0-1 (mock)
    score = Math.min(Math.max(score + (Math.random() * 0.1 - 0.05), 0), 1);

    return {
      session_id: "sess_" + Math.random().toString(36).substr(2, 9),
      candidate_id: candidate.id,
      score: parseFloat(score.toFixed(3)),
      rank: 0, // calculated after sort
      explanation: {
        skill_match: Math.floor(score * 100),
        salary_match: 90,
        location_match: 80,
        tags: candidate.role === criteria.role ? ["職種一致"] : [],
      },
      candidate: candidate,
      created_at: new Date().toISOString(),
    } as MatchingScore;
  });

  // Sort by score descending
  scoredResults.sort((a, b) => b.score - a.score);

  // Assign ranks
  const rankedResults = scoredResults.map((item, index) => ({
    ...item,
    rank: index + 1,
  }));

  return rankedResults;
};
