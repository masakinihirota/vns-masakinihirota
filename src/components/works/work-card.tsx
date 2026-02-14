"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tables } from "@/types/types_db";
import Link from "next/link";

type Work = Tables<"works">;

interface WorkCardProps {
  work: Work;
}

export const WorkCard = ({ work }: WorkCardProps) => {
  return (
    <Card className="w-full h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="line-clamp-1 text-lg">{work.title}</CardTitle>
          <Badge variant={work.is_official ? "default" : "secondary"}>
            {work.category}
          </Badge>
        </div>
        <CardDescription className="line-clamp-1">{work.author}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {work.description || "No description available."}
        </p>
        <div className="mt-4 flex flex-wrap gap-1">
          {work.tags?.map((tag, index) => (
            <span
              key={`${work.id}-tag-${index}`}
              className="text-xs bg-muted px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between text-xs text-muted-foreground">
        <span>{new Date(work.created_at).toLocaleDateString()}</span>
        <Link href={`/works/${work.id}`} className="hover:underline">
          Details &rarr;
        </Link>
      </CardFooter>
    </Card>
  );
};
