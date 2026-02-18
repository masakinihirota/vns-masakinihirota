"use client";

import { useState } from "react";
import { getWorksAction } from "@/app/actions/works";
import { Input } from "@/components/ui/input";
import { Tables } from "@/types/types_db";
import { WorkCard } from "./work-card";
import { WorkCreateModal } from "./work-create-modal";

type Work = Tables<"works">;

interface WorkListProps {
  initialWorks?: Work[];
}

export const WorkList = ({ initialWorks = [] }: WorkListProps) => {
  const [works, setWorks] = useState<Work[]>(initialWorks);
  const [searchQuery, setSearchQuery] = useState("");

  const refreshWorks = async () => {
    try {
      const updatedWorks = (await getWorksAction()) as Work[];
      setWorks(updatedWorks);
    } catch (error) {
      console.error("Failed to refresh works", error);
    }
  };

  const filteredWorks = works.filter((work) =>
    work.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Works Catalog</h1>
        <WorkCreateModal onSuccess={refreshWorks} />
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search works..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorks.map((work) => (
          <WorkCard key={work.id} work={work} />
        ))}
        {filteredWorks.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No works found.
          </div>
        )}
      </div>
    </div>
  );
};
