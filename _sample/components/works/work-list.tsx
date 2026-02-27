"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";

import { getWorksAction } from "@/app/actions/works";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Work } from "@/lib/db/types";

import { WorkCreateModal } from "./work-create-modal";

interface WorkListProperties {
  initialWorks?: Work[];
}

// Define the fetcher function for SWR
const fetchWorks = async () => {
  const works = (await getWorksAction()) as any[];
  return works;
};

export const WorkList = ({ initialWorks = [] }: WorkListProperties) => {
  const { data: items, mutate } = useSWR<any[]>("works", fetchWorks, {
    fallbackData: initialWorks,
  });

  const [searchQuery, setSearchQuery] = useState("");

  const refreshWorks = async () => {
    mutate();
  };

  const filteredItems = useMemo(() => {
    return (items || []).filter((work) =>
      work.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [items, searchQuery]);

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
        {filteredItems.map((work) => (
          <Card key={work.id}>
            <CardHeader>
              <CardTitle>{work.title}</CardTitle>
              <CardDescription>{work.author}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 line-clamp-3">
                {work.description}
              </p>
            </CardContent>
          </Card>
        ))}
        {filteredItems.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No works found.
          </div>
        )}
      </div>
    </div>
  );
};
