import { useState, useMemo } from "react";

// --- Types ---
export type ValueTag = string;

export interface MatchingUser {
  id: string;
  name: string;
  avatarSrc: string;
  bio: string;
  tags: ValueTag[];
}

export interface Candidate {
  user: MatchingUser;
  compatibility: number; // 0-100
  isWatched: boolean;
  isFollowed: boolean;
}

// --- Dummy Data ---

export const CURRENT_USER: MatchingUser = {
  id: "me",
  name: "Myself",
  avatarSrc: "/Images/avatar_me.png",
  bio: "Looking for like-minded philosophy enthusiasts.",
  tags: ["Philosophy", "Coding", "Sci-Fi", "Coffee"],
};

const DUMMY_CANDIDATES_DATA: MatchingUser[] = [
  {
    id: "c1",
    name: "Alice",
    avatarSrc: "/Images/avatar_1.png",
    bio: "Loves Kant and Java.",
    tags: ["Philosophy", "Coding", "Tea"],
  },
  {
    id: "c2",
    name: "Bob",
    avatarSrc: "/Images/avatar_2.png",
    bio: "Art and Design lover.",
    tags: ["Art", "Design", "Coffee"],
  },
  {
    id: "c3",
    name: "Charlie",
    avatarSrc: "/Images/avatar_3.png",
    bio: "Full stack developer into Sci-Fi.",
    tags: ["Coding", "Sci-Fi", "Gaming"],
  },
  {
    id: "c4",
    name: "David",
    avatarSrc: "/Images/avatar_4.png",
    bio: "Just here for fun.",
    tags: ["Sports", "Music"],
  },
  {
    id: "c5",
    name: "Eve",
    avatarSrc: "/Images/avatar_5.png",
    bio: "Philosophy is life.",
    tags: ["Philosophy", "Ethics", "Coffee"],
  },
];

// --- Utilities ---

export const calculateCompatibility = (userA: MatchingUser, userB: MatchingUser): number => {
  const setA = new Set(userA.tags);
  const setB = new Set(userB.tags);

  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  const union = new Set([...setA, ...setB]);

  if (union.size === 0) return 0;

  return Math.round((intersection.size / union.size) * 100);
};

// --- Hook ---

export const useManualMatching = () => {
  // Initialize candidates with calculated compatibility
  const initialCandidates = useMemo(() => {
    return DUMMY_CANDIDATES_DATA.map((user) => ({
      user,
      compatibility: calculateCompatibility(CURRENT_USER, user),
      isWatched: false,
      isFollowed: false,
    })).sort((a, b) => b.compatibility - a.compatibility);
  }, []);

  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);

  const toggleWatch = (userId: string) => {
    setCandidates((prev) =>
      prev.map((c) => (c.user.id === userId ? { ...c, isWatched: !c.isWatched } : c)),
    );
  };

  const toggleFollow = (userId: string) => {
    setCandidates((prev) =>
      prev.map((c) => (c.user.id === userId ? { ...c, isFollowed: !c.isFollowed } : c)),
    );
  };

  return {
    currentUser: CURRENT_USER,
    candidates,
    toggleWatch,
    toggleFollow,
  };
};
