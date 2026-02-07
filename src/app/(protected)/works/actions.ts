"use server";

import { Work } from "@/components/works/common/types";
import { fetchWorks } from "@/components/works/work-list/work-list.logic";

export interface GetWorksParams {
  is_official?: boolean;
  query?: string;
  category?: string;
}

export async function getWorks({
  is_official,
  query,
  category,
}: GetWorksParams = {}): Promise<Work[]> {
  const allWorks = await fetchWorks();

  let filteredWorks = allWorks;

  if (is_official !== undefined) {
    filteredWorks = filteredWorks.filter((work) => {
      const hasOfficialUrl = work.urls.some((url) => url.type === "official");
      return is_official ? hasOfficialUrl : !hasOfficialUrl;
    });
  }

  if (query) {
    const lowerQuery = query.toLowerCase();
    filteredWorks = filteredWorks.filter(
      (work) =>
        work.title.toLowerCase().includes(lowerQuery) ||
        work.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  }

  if (category && category !== "all") {
    filteredWorks = filteredWorks.filter((work) => work.category === category);
  }

  return filteredWorks;
}
