"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"; // For edit button in future
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit, ExternalLink, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";

// UI Type (matching what we use in list for consistency, but detail might have more)
interface UIWorkDetail {
  id: string;
  title: string;
  category: string;
  period: string;
  tags: string[];
  urls: { type: string; value: string }[];
  creatorName?: string;
  description?: string;
  scale?: string;
  isPurchasable?: boolean;
  status?: string;
  createdAt: string;
}

interface WorkDetailProps {
  work: UIWorkDetail;
  isOwner: boolean;
}

export const WorkDetail = ({ work, isOwner }: WorkDetailProps) => {
  const router = useRouter();

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Button
        variant="ghost"
        className="mb-6 pl-0 hover:pl-2 transition-all"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Works
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Image placeholder or metadata summary */}
        <div className="md:col-span-1 space-y-6">
          <Card className="overflow-hidden">
            <div className="aspect-[3/4] bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
              {/* Image placeholder */}
              <span className="text-4xl">📚</span>
            </div>
          </Card>

          <div className="space-y-4">
            {work.urls.length > 0 && (
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium">Links</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-2">
                  {work.urls.map((url, i) => (
                    <a
                      key={i}
                      href={url.value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-blue-600 hover:underline"
                    >
                      <ExternalLink className="mr-2 h-3 w-3" />
                      {url.type === "official" ? "Official Site" :
                        url.type === "affiliate" ? "Affiliate Link" : "External Link"}
                    </a>
                  ))}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium">Info</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Category</span>
                  <span className="font-medium capitalize">{work.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Release Year</span>
                  <span className="font-medium">{work.period || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Scale</span>
                  <span className="font-medium">{work.scale || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status</span>
                  <Badge variant="outline" className="capitalize">{work.status}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column: Main Content */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  {work.title}
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  {work.creatorName || "Unknown Author"}
                </p>
              </div>
              {isOwner && (
                <Button variant="outline" size="sm">
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {work.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <h3 className="text-xl font-semibold mb-2">Overview</h3>
            <p className="whitespace-pre-wrap leading-relaxed">
              {work.description || "No description available."}
            </p>
          </div>

          <div className="border-t pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Registered on {new Date(work.createdAt).toLocaleDateString()}
              </span>
              <Button variant="ghost" size="sm">
                <Share2 className="mr-2 h-4 w-4" /> Share
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
