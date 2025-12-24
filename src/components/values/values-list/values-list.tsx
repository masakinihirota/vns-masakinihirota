import { Lock, Unlock, Loader2, Save } from "lucide-react";
import React from "react";
// import { Slider } from '@/components/ui/slider'; // Removed as we use native input
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils"; // Assuming standard shadcn utils
import { ValueItem, UserValueAnswer } from "../common/types";

interface ValuesListProps {
  questions: ValueItem[];
  answers: Record<string, UserValueAnswer>;
  loading: boolean;
  savingId: string | null;
  onAnswerChange: (questionId: string, value: number) => void;
  onPrivacyToggle: (questionId: string) => void;
}

export const ValuesList: React.FC<ValuesListProps> = ({
  questions,
  answers,
  loading,
  savingId,
  onAnswerChange,
  onPrivacyToggle,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin text-slate-500" />
      </div>
    );
  }

  const categories = Array.from(new Set(questions.map((q) => q.category)));

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-6">
      <header>
        <h1 className="text-3xl font-bold mb-2">価値観プロフィール</h1>
        <p className="text-slate-500">
          あなたの価値観を登録することで、相性の良いパートナーと出会える確率が高まります。
          直感に従って回答してください。
        </p>
      </header>

      {categories.map((category) => (
        <section key={category} className="space-y-4">
          <h2 className="text-xl font-semibold capitalize flex items-center gap-2">
            <span className="w-2 h-6 bg-indigo-500 rounded-full" />
            {category}
          </h2>
          <div className="grid gap-4 md:grid-cols-1">
            {questions
              .filter((q) => q.category === category)
              .map((q) => {
                const answer = answers[q.id]?.answer ?? 50; // Default to center
                const isPublic = answers[q.id]?.isPublic ?? true;
                const isSaving = savingId === q.id;

                return (
                  <Card key={q.id} className="transition-all hover:shadow-md">
                    <div className="flex flex-col md:flex-row md:items-center">
                      <div className="p-6 flex-1 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{q.question}</CardTitle>
                            <CardDescription>{q.description}</CardDescription>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onPrivacyToggle(q.id)}
                            className={cn(
                              "text-slate-400 hover:text-indigo-600",
                              !isPublic && "text-amber-500",
                            )}
                            title={isPublic ? "公開中" : "非公開"}
                          >
                            {isPublic ? (
                              <Unlock className="w-4 h-4" />
                            ) : (
                              <Lock className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="p-6 pt-0 md:pt-6 md:w-1/2 md:border-l border-slate-100 dark:border-slate-800 space-y-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-medium text-slate-400">重視しない</span>
                          <span className="text-lg font-bold text-indigo-600">{answer}%</span>
                          <span className="text-xs font-medium text-slate-400">重視する</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={answer}
                          onChange={(e) => onAnswerChange(q.id, parseInt(e.target.value))}
                          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                        {isSaving && (
                          <div className="flex justify-end">
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <Loader2 className="w-3 h-3 animate-spin" /> 保存中
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
          </div>
        </section>
      ))}
    </div>
  );
};
