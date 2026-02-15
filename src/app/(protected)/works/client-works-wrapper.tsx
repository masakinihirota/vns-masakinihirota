"use client";

import { useRouter } from "next/navigation";
import { WorksList } from "@/components/works/work-list/work-list";

// UI Type Definition (should match common/types)
export interface UIWork {
  id: string;
  title: string;
  category: "anime" | "comic" | "novel" | "movie" | "game" | "other";
  period: string;
  tags: string[];
  urls: { type: string; value: string }[];
  creatorName?: string;
  imageUrl?: string;
}

export function ClientWorksWrapper({ works }: { works: UIWork[] }) {
  const router = useRouter();

  const handleCreateNew = () => {
    router.push("/works/new");
  };

  return (
    <WorksList works={works} loading={false} onCreateNew={handleCreateNew} />
  );
}
