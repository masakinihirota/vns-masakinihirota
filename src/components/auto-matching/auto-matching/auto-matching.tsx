import React from "react";
import {
  Search,
  Filter,
  Briefcase,
  MapPin,
  DollarSign,
  Star,
  User,
  Settings,
  Loader2,
  Moon,
  Sun,
  CheckCircle2,
  AlertCircle,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchCriteria, MatchingScore } from "./auto-matching.logic";

interface AutoMatchingProps {
  criteria: SearchCriteria;
  results: MatchingScore[];
  loading: boolean;
  darkMode: boolean;
  onCriteriaChange: (
    key: keyof SearchCriteria,
    value: SearchCriteria[keyof SearchCriteria],
  ) => void;
  onSearch: () => void;
  onToggleDarkMode: () => void;
}

export const AutoMatching: React.FC<AutoMatchingProps> = ({
  criteria,
  results,
  loading,
  darkMode,
  onCriteriaChange,
  onSearch,
  onToggleDarkMode,
}) => {
  return (
    <div
      className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300`}
    >
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            Auto Match <span className="text-slate-400 font-normal text-sm ml-2">v0.1.0</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground hidden md:block">
            システム稼働中 | DB接続: 正常
          </div>
          <Button variant="ghost" className="rounded-full w-10 h-10 p-0" onClick={onToggleDarkMode}>
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 border flex items-center justify-center">
            <User className="w-5 h-5 text-slate-500" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar: Search Conditions */}
          <aside className="w-full lg:w-80 flex-shrink-0 space-y-6">
            <Card className="sticky top-24">
              <CardHeader className="pb-4 border-b">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  マッチング条件
                </CardTitle>
                <p className="text-sm text-muted-foreground">候補者の絞り込み条件を設定</p>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">希望職種</label>
                  <Select
                    value={criteria.role}
                    onValueChange={(val: string) => onCriteriaChange("role", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="職種を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Frontend Engineer">Frontend Engineer</SelectItem>
                      <SelectItem value="Backend Engineer">Backend Engineer</SelectItem>
                      <SelectItem value="Fullstack Engineer">Fullstack Engineer</SelectItem>
                      <SelectItem value="UI/UX Designer">UI/UX Designer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">勤務地 / エリア</label>
                  <Input
                    value={criteria.location}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      onCriteriaChange("location", e.target.value)
                    }
                    placeholder="例: 東京, リモート"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium leading-none">最低年収</label>
                    <span className="text-sm text-muted-foreground font-mono">
                      {criteria.min_salary} 万円
                    </span>
                  </div>
                  <input
                    type="range"
                    min={300}
                    max={1500}
                    value={criteria.min_salary}
                    onChange={(e) => onCriteriaChange("min_salary", parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-blue-600"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="checkbox"
                    id="remote"
                    checked={criteria.remote}
                    onChange={(e) => onCriteriaChange("remote", e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="remote"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    リモートワークのみ
                  </label>
                </div>

                <div className="pt-4">
                  <Button className="w-full" onClick={onSearch} disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        計算中...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        条件を更新して再検索
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
              <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2 flex items-center">
                <ArrowUpDown className="w-4 h-4 mr-1" />
                アルゴリズム設定
              </h3>
              <p className="text-xs text-blue-600 dark:text-blue-400 mb-2">
                現在のスコアリング戦略:{" "}
                <span className="font-mono bg-blue-100 dark:bg-blue-800 px-1 rounded">
                  weighted_v2
                </span>
              </p>
              <p className="text-xs text-muted-foreground">
                Server Actionにより、セキュアな環境でマッチングスコアが計算されます。
              </p>
            </div>
          </aside>

          {/* Main Content: Results */}
          <section className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">マッチング結果</h2>
                <p className="text-muted-foreground">
                  AIスコアリングによる推奨候補者リスト ({results.length}名)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Select defaultValue="score_desc">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="並び替え" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="score_desc">スコア高い順</SelectItem>
                    <SelectItem value="date_desc">登録新しい順</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {loading ? (
              // Loading Skeleton
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="h-40 bg-slate-100 dark:bg-slate-800/50 rounded-xl" />
                  </Card>
                ))}
              </div>
            ) : (
              // Result List
              <div className="space-y-4">
                {results.map((result) => (
                  <Card
                    key={result.session_id}
                    className="group overflow-hidden border-l-4 border-l-blue-500 hover:shadow-md transition-all"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Score Badge */}
                        <div className="flex flex-col items-center justify-center min-w-[100px] border-r border-dashed pr-6">
                          <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">
                            Match
                          </div>
                          <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                            {Math.floor(result.score * 100)}
                            <span className="text-lg text-slate-400">%</span>
                          </div>
                          <div className="mt-2">
                            {result.score > 0.8 ? (
                              <Badge className="bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400">
                                <CheckCircle2 className="w-3 h-3 mr-1" /> Best
                              </Badge>
                            ) : (
                              <Badge variant="secondary">Good</Badge>
                            )}
                          </div>
                        </div>

                        {/* Candidate Details */}
                        <div className="flex-1 space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-xl font-bold flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                                {result.candidate.name}
                                <span className="text-xs font-normal text-muted-foreground bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                                  ID: {result.candidate_id}
                                </span>
                              </h3>
                              <p className="text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center mt-1">
                                <Briefcase className="w-3.5 h-3.5 mr-1" />
                                {result.candidate.role}
                                <span className="mx-2 text-slate-300">|</span>
                                <MapPin className="w-3.5 h-3.5 mr-1" />
                                {result.candidate.location}
                              </p>
                            </div>
                            <Button variant="outline" className="hidden md:flex">
                              詳細プロフィール
                            </Button>
                          </div>

                          <div className="flex flex-wrap gap-2 mt-2">
                            {result.candidate.skills.map((skill) => (
                              <Badge key={skill} variant="secondary" className="font-normal">
                                {skill}
                              </Badge>
                            ))}
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-3 mt-2 border-t text-sm">
                            <div className="flex items-center text-muted-foreground">
                              <DollarSign className="w-4 h-4 mr-1.5 text-slate-400" />
                              <span>
                                希望: {result.candidate.min_salary}~{result.candidate.max_salary}万
                              </span>
                            </div>
                            <div className="flex items-center text-muted-foreground">
                              <Star className="w-4 h-4 mr-1.5 text-slate-400" />
                              <span>経験: {result.candidate.experience_years}年</span>
                            </div>
                            <div className="flex items-center text-muted-foreground md:col-span-1 col-span-2">
                              <AlertCircle className="w-4 h-4 mr-1.5 text-blue-500" />
                              <span className="text-xs">
                                スキル適合率: {result.explanation.skill_match}%
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Mobile Action */}
                        <div className="md:hidden mt-4">
                          <Button className="w-full" variant="outline">
                            詳細プロフィール
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {results.length === 0 && !loading && (
                  <div className="text-center py-12 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed">
                    <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium">
                      条件に一致する候補者が見つかりませんでした
                    </h3>
                    <p className="text-muted-foreground mt-2">
                      検索条件を緩和して再度お試しください
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};
