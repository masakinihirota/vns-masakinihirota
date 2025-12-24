"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Work } from "../common/types";
import { WorksList } from "./work-list";
import { fetchWorks } from "./work-list.logic";

export const WorksListContainer = () => {
  const router = useRouter();
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWorks = async () => {
      await fetchWorks()
        .then((data) => setWorks(data))
        .catch((e) => console.error(e))
        .finally(() => setLoading(false));
    };
    void loadWorks();
  }, []);

  const handleCreateNew = () => {
    router.push("/works/new");
  };

  return <WorksList works={works} loading={loading} onCreateNew={handleCreateNew} />;
};
