import React from "react";
import { UserProfile, Work } from "../common/types";
import {
  Sun,
  Moon,
  Search,
  Filter,
  User,
  BookOpen,
  Heart,
  Sparkles,
  CheckCircle2,
  Tv,
  Music,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Types for props
interface ComparisonData {
  commonWorks: Work[];
  subjectUniqueWorks: Work[];
  candidateUniqueWorks: Work[];
  commonValues: string[];
  subjectUniqueValues: string[];
  candidateUniqueValues: string[];
}

interface ManualMatchingConsoleProps {
  subjects: UserProfile[];
  candidates: UserProfile[];
  selectedSubject: UserProfile | null;
  selectedCandidate: UserProfile | null;
  loadingSubjects: boolean;
  loadingCandidates: boolean;
  comparisonData: ComparisonData | null;
  darkMode: boolean;
  isMatchModalOpen: boolean;
  matchComment: string;
  isProcessingMatch: boolean;
  onSubjectSelect: (user: UserProfile) => void;
  onCandidateSelect: (user: UserProfile) => void;
  onToggleDarkMode: () => void;
  onOpenMatchModal: () => void;
  onCloseMatchModal: () => void;
  onExecuteMatch: () => void;
  onMatchCommentChange: (comment: string) => void;
}

// --- Helper Components ---
const getCategoryIcon = (category: string) => {
  switch (category) {
    case "book":
      return <BookOpen size={14} />;
    case "movie":
      return <Tv size={14} />;
    case "music":
      return <Music size={14} />;
    case "game":
      return <Zap size={14} />;
    default:
      return <Sparkles size={14} />;
  }
};

const UserCard = ({
  user,
  isSelected,
  onClick,
  compact = false,
}: {
  user: UserProfile;
  isSelected: boolean;
  onClick: () => void;
  compact?: boolean;
}) => {
  return (
    <Card
      onClick={onClick}
      className={`
        relative p-4 cursor-pointer transition-all duration-200 border-l-4
        ${
          isSelected
            ? "bg-indigo-50 border-indigo-500 shadow-md ring-1 ring-indigo-500 dark:bg-indigo-900/20 dark:border-indigo-400"
            : "bg-white border-transparent hover:border-indigo-300 hover:shadow-sm dark:bg-slate-900 dark:hover:border-slate-700"
        }
      `}
    >
      <div className="flex items-start gap-3">
        <img
          src={user.photoUrl}
          alt={user.name}
          className="w-12 h-12 rounded-full bg-slate-100 object-cover"
        />
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 truncate">{user.name}</h4>
            {user.compatibilityScore && (
              <span
                className={`text-xs font-bold ${user.compatibilityScore > 90 ? "text-green-600" : "text-slate-500"}`}
              >
                {user.compatibilityScore}%
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {user.age}歳 • {user.location}
          </p>
          {!compact && (
            <div className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
              <span className="font-medium mr-1">好き:</span>
              {user.favoriteWorks.map((w) => w.title).join(", ")}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export const ManualMatchingConsole: React.FC<ManualMatchingConsoleProps> = (props) => {
  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300 bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Header */}
      <header className="h-16 border-b px-6 flex items-center justify-between bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
            M
          </div>
          <h1 className="text-lg font-bold tracking-tight">Manual Matching Console</h1>
          <Badge variant="secondary" className="ml-2">
            Deep Match Mode
          </Badge>
        </div>
        <Button onClick={props.onToggleDarkMode} variant="ghost" size="icon">
          {props.darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </Button>
      </header>

      <main className="flex-1 flex overflow-hidden h-[calc(100vh-64px)]">
        {/* Column 1: Subject Selection */}
        <section className="w-80 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-white dark:bg-slate-900">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
              <User size={16} />
              対象会員
            </h2>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="名前検索..."
                className="w-full pl-9 pr-4 py-2 text-sm rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {props.loadingSubjects ? (
              <div>Loading...</div>
            ) : (
              props.subjects.map((subject) => (
                <UserCard
                  key={subject.id}
                  user={subject}
                  isSelected={props.selectedSubject?.id === subject.id}
                  onClick={() => {
                    props.onSubjectSelect(subject);
                  }}
                />
              ))
            )}
          </div>
        </section>

        {/* Column 2: Candidate Search */}
        <section className="w-80 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/30 dark:bg-slate-950/30">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
              <Filter size={16} />
              候補者リスト
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 text-xs">
                全表示
              </Button>
              <Button size="sm" className="flex-1 text-xs bg-indigo-600 hover:bg-indigo-700">
                作品一致
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {!props.selectedSubject ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm">
                対象を選択してください
              </div>
            ) : props.loadingCandidates ? (
              <div>Loading...</div>
            ) : (
              props.candidates.map((candidate) => (
                <UserCard
                  key={candidate.id}
                  user={candidate}
                  isSelected={props.selectedCandidate?.id === candidate.id}
                  onClick={() => props.onCandidateSelect(candidate)}
                  compact
                />
              ))
            )}
          </div>
        </section>

        {/* Column 3: Value & Work Comparison */}
        <section className="flex-1 flex flex-col bg-white dark:bg-slate-950 overflow-y-auto">
          {!props.selectedSubject || !props.selectedCandidate || !props.comparisonData ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 opacity-60">
              <div className="w-24 h-24 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-10 h-10 text-slate-300 dark:text-slate-700" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                価値観・作品マッチング
              </h3>
              <p className="text-sm">両者を選択して共通点を確認します</p>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              {/* Toolbar */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-950 z-10">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500">共通の作品</span>
                    <span className="text-lg font-bold text-indigo-600">
                      {props.comparisonData.commonWorks.length}{" "}
                      <span className="text-xs text-slate-400">件</span>
                    </span>
                  </div>
                  <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500">一致した価値観</span>
                    <span className="text-lg font-bold text-green-600">
                      {props.comparisonData.commonValues.length}{" "}
                      <span className="text-xs text-slate-400">個</span>
                    </span>
                  </div>
                </div>
                <Button
                  onClick={props.onOpenMatchModal}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg shadow-indigo-200 dark:shadow-none"
                >
                  <CheckCircle2 size={16} className="mr-2" />
                  このペアで確定
                </Button>
              </div>

              <div className="p-6 max-w-5xl mx-auto w-full space-y-8">
                {/* 1. Header with Photos */}
                <div className="flex items-center justify-center gap-8 mb-4">
                  <div className="text-center">
                    <img
                      src={props.selectedSubject.photoUrl}
                      className="w-20 h-20 rounded-full object-cover border-2 border-blue-500 mb-2"
                      alt="Subject"
                    />
                    <div className="font-bold text-sm">{props.selectedSubject.name}</div>
                  </div>
                  <div className="text-slate-300 dark:text-slate-700 text-2xl font-light">×</div>
                  <div className="text-center">
                    <img
                      src={props.selectedCandidate.photoUrl}
                      className="w-20 h-20 rounded-full object-cover border-2 border-pink-500 mb-2"
                      alt="Candidate"
                    />
                    <div className="font-bold text-sm">{props.selectedCandidate.name}</div>
                  </div>
                </div>

                {/* 2. Work Compatibility Section */}
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <BookOpen size={16} /> 好きな作品・コンテンツ
                  </h3>

                  {/* Common Works */}
                  {props.comparisonData.commonWorks.length > 0 ? (
                    <div className="mb-6 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-indigo-100 dark:border-indigo-900/30">
                      <div className="text-center text-xs font-bold text-indigo-500 mb-3 uppercase tracking-wide">
                        二人の共通点
                      </div>
                      <div className="flex flex-wrap justify-center gap-2">
                        {props.comparisonData.commonWorks.map((work, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 px-3 py-2 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-200 rounded-lg border border-indigo-200 dark:border-indigo-800"
                          >
                            {getCategoryIcon(work.category)}
                            <span className="font-bold">{work.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-slate-400 text-sm mb-6 py-4 border-b border-dashed border-slate-300 dark:border-slate-700">
                      共通の作品はまだ見つかっていません
                    </div>
                  )}

                  {/* Individual Works (Simplified for now) */}
                  {/* ... */}
                </div>

                {/* 3. Values Section */}
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Heart size={16} /> 大切にしている価値観
                  </h3>

                  <div className="flex flex-col gap-6">
                    {/* Matched Values */}
                    <div className="flex items-start">
                      <div className="w-24 text-xs font-bold text-green-600 pt-2">一致</div>
                      <div className="flex-1 flex flex-wrap gap-2">
                        {props.comparisonData.commonValues.length > 0 ? (
                          props.comparisonData.commonValues.map((val, i) => (
                            <span
                              key={i}
                              className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-md text-sm font-bold border border-green-200 dark:border-green-800"
                            >
                              {val}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 text-sm py-1.5">
                            完全一致する価値観タグはありません
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Match Modal */}
      {props.isMatchModalOpen && props.selectedSubject && props.selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <Card className="w-full max-w-lg animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <CheckCircle2 className="text-indigo-600" />
                マッチングの確定
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-slate-600 dark:text-slate-300">
                共通の作品{" "}
                <strong className="text-indigo-600">
                  {props.comparisonData?.commonWorks.length}件
                </strong>
                、 一致する価値観{" "}
                <strong className="text-green-600">
                  {props.comparisonData?.commonValues.length}個
                </strong>
                <br />
                このペアリングを確定しますか？
              </p>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  コンシェルジュコメント
                </label>
                <textarea
                  className="w-full p-3 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-950 focus:ring-2 focus:ring-indigo-500 outline-none text-sm h-24 resize-none"
                  placeholder="「〇〇（作品名）の話で盛り上がれそうです」など..."
                  value={props.matchComment}
                  onChange={(e) => props.onMatchCommentChange(e.target.value)}
                />
              </div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={props.onCloseMatchModal}
                disabled={props.isProcessingMatch}
              >
                キャンセル
              </Button>
              <Button
                onClick={props.onExecuteMatch}
                disabled={props.isProcessingMatch}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {props.isProcessingMatch ? "処理中..." : "確定する"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
