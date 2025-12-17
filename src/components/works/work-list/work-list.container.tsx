"use client";

import React, { useState, useEffect } from "react";
import { WorksList } from "./work-list";
import { Work } from "../common/types";
import { fetchWorks } from "./work-list.logic";
import { useRouter } from "next/navigation";

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
    loadWorks();
  }, []);

  const handleCreateNew = () => {
    router.push("/works/new");
  };

  return <WorksList works={works} loading={loading} onCreateNew={handleCreateNew} />;
};
