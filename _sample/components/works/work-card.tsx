"use client";

import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Work } from "@/lib/db/types";


interface WorkCardProperties {
  work: Work;
}

export const WorkCard = ({ work }: WorkCardProperties) => {
  return (
    <Card className="w-full h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="line-clamp-1 text-lg">{work.title}</CardTitle>
          {work.isOfficial && (
            <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium">
              OFFICIAL
            </span>
          )}
        </div>
        <CardDescription className="line-clamp-1">
          {work.author || "Unknown Author"}
        </CardDescription>
      </CardHeader>
      <CardContent className="py-2">
        <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
          {work.description || "No description available."}
        </p>
        <div className="mt-4 flex flex-wrap gap-1">
          {work.tags?.map((tag: string, index: number) => (
            <span
              key={`${work.id}-tag-${index}`}
              className="text-xs bg-muted px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between items-center text-[10px] text-muted-foreground">
        <span>{new Date(work.createdAt).toLocaleDateString()}</span>

        <Link href={`/works/${work.id}`} className="hover:underline">
          Details &rarr;
        </Link>
      </CardFooter>
    </Card>
  );
};
