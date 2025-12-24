import {
  Plus,
  BookOpen,
  Film,
  Gamepad2,
  Monitor,
  MoreHorizontal,
  Loader2,
  ExternalLink,
} from "lucide-react";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Work } from "../common/types";

interface WorksListProps {
  works: Work[];
  loading: boolean;
  onCreateNew: () => void;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "anime":
      return <Monitor className="w-4 h-4" />;
    case "comic":
      return <BookOpen className="w-4 h-4" />;
    case "novel":
      return <BookOpen className="w-4 h-4" />; // Reusing BookOpen for novel
    case "movie":
      return <Film className="w-4 h-4" />;
    case "game":
      return <Gamepad2 className="w-4 h-4" />;
    default:
      return <MoreHorizontal className="w-4 h-4" />;
  }
};

export const WorksList: React.FC<WorksListProps> = ({ works, loading, onCreateNew }) => {
  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin text-slate-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-1">作品ライブラリ</h1>
          <p className="text-slate-500">登録済みの作品一覧</p>
        </div>
        <Button onClick={onCreateNew} className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          新規登録
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {works.map((work) => (
          <Card key={work.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <Badge variant="outline" className="flex items-center gap-1 mb-2">
                  {getCategoryIcon(work.category)}
                  <span className="capitalize">{work.category}</span>
                </Badge>
                <span className="text-xs text-slate-400 font-mono">{work.period}</span>
              </div>
              <CardTitle className="text-lg line-clamp-1" title={work.title}>
                {work.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {work.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              {work.urls.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs text-slate-400 font-medium">関連リンク:</p>
                  <div className="flex flex-col gap-1">
                    {work.urls.map((u, i) => (
                      <a
                        key={i}
                        href={u.value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-indigo-600 hover:underline flex items-center gap-1 truncate"
                      >
                        <ExternalLink className="w-3 h-3" />
                        {u.type === "official" ? "公式サイト" : "リンク"}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      {works.length === 0 && (
        <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
          <p>作品が登録されていません</p>
        </div>
      )}
    </div>
  );
};
