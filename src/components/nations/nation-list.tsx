"use client";

import { Users } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NationCreateModal } from "./nation-create-modal";
import { useNations } from "./nations.logic";

export const NationList = () => {
  const { nations, isLoading, isError, mutate } = useNations();

  if (isLoading) return <div>Loading nations...</div>;
  if (isError) return <div>Error loading nations</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Nations</h1>
        <NationCreateModal onSuccess={() => mutate()} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nations?.map((nation) => (
          <Link key={nation.id} href={`/nations/${nation.id}`}>
            <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{nation.name}</CardTitle>
                  {nation.is_official && <Badge>Official</Badge>}
                </div>
                <CardDescription className="line-clamp-2">
                  {nation.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Users className="h-4 w-4" />
                  <span>View Details</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
        {nations?.length === 0 && (
          <div className="col-span-full text-center text-gray-500 py-12">
            No nations found. create one!
          </div>
        )}
      </div>
    </div>
  );
};
