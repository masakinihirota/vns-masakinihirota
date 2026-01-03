import {
  Plus,
  Trash2,
  Heart,
  BookOpen,
  // Film,
  // Clock,
  // Target,
  // Award,
  Fingerprint,
  List,
  BarChart2,
  ChevronRight,
  ArrowLeft,
  ExternalLink,
  Briefcase,
  Code,
} from "lucide-react";

import type {
  UserProfile,
  UserWork,
  UserEvaluation,
  UserValue,
} from "./profile-edit.logic";

// --- Types ---
// Logic file will handle these, but for UI props we need definitions
// Defined in profile-edit.logic.ts and imported

export type ProfileEditProps = {
  mode: "view" | "edit" | "create"; // Currently Sample is mostly "view/manage"
  page: "profile" | "portfolio";
  profile: UserProfile;
  myWorks: UserWork[];
  evaluations: UserEvaluation[];
  values: UserValue[];
  selectedCategory: string;
  viewMode: "simple" | "tiered";
  onSetPage: (page: "profile" | "portfolio") => void;
  onSetSelectedCategory: (category: string) => void;
  onSetViewMode: (mode: "simple" | "tiered") => void;
  // Actions
  onAddWork: () => void;
  onAddEvaluation: () => void;
  onAddValue: () => void;
  onDeleteEvaluation: (id: number) => void;
};

// --- Sub-Components (Kept internal as per sample) ---

const StatBox = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="flex flex-col gap-1.5">
    <div className="text-3xl font-black text-slate-900 dark:text-white leading-none tracking-tight">
      {value}
    </div>
    <div className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 leading-none">
      {label}
    </div>
  </div>
);

const MarkdownTable = ({
  headers,
  rows,
  emptyMessage,
  onAdd,
  addLabel = "項目を追加",
}: {
  headers: { label: string; className?: string }[];
  rows: { cells: { content: React.ReactNode; className?: string }[] }[];
  emptyMessage?: string;
  onAdd?: () => void;
  addLabel?: string;
}) => (
  <div className="mb-8">
    <div className="overflow-x-auto border border-slate-300 dark:border-slate-700">
      <table className="w-full text-left border-collapse text-sm font-sans">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-800">
            {headers.map((h, i) => (
              <th
                key={i}
                className={`border border-slate-300 dark:border-slate-700 px-4 py-2 font-bold text-slate-700 dark:text-slate-200 ${
                  h.className || ""
                }`}
              >
                {h.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map((row, i) => (
              <tr
                key={i}
                className="bg-white dark:bg-slate-900 even:bg-slate-50/30 transition-colors"
              >
                {row.cells.map((cell, j) => (
                  <td
                    key={j}
                    className={`border border-slate-300 dark:border-slate-700 px-4 py-2 text-slate-600 dark:text-slate-300 align-top ${
                      cell.className || ""
                    }`}
                  >
                    {cell.content}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={headers.length}
                className="border border-slate-300 dark:border-slate-700 px-4 py-8 text-center text-slate-400 italic"
              >
                {emptyMessage || "データが登録されていません"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    {onAdd && (
      <button
        onClick={onAdd}
        className="mt-2 w-full py-2 flex items-center justify-center gap-1 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 hover:bg-slate-50 dark:hover:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 transition-all group"
        aria-label={addLabel}
      >
        <Plus
          size={12}
          className="group-hover:scale-125 transition-transform"
          aria-hidden="true"
        />
        <span>{addLabel}</span>
      </button>
    )}
  </div>
);

// --- Main Views ---

const ProfileView = (props: ProfileEditProps) => {
  const {
    profile,
    myWorks,
    evaluations,
    values,
    selectedCategory,
    viewMode,
    onSetPage,
    onSetSelectedCategory,
    onSetViewMode,
    onDeleteEvaluation,
    onAddWork,
    onAddEvaluation,
    onAddValue,
  } = props;

  const getTierDisplay = (tier: string) => {
    switch (tier) {
      case "tier1":
        return "1";
      case "tier2":
        return "2";
      case "tier3":
        return "3";
      default:
        return "普";
    }
  };

  return (
    <>
      {/* PROFILE SUMMARY */}
      <section className="py-8 border-b border-slate-200 dark:border-slate-800 mb-10">
        <div className="space-y-8">
          <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">
            <span>VNS Data Sheet</span>
            <ChevronRight size={12} />
            <span className="text-slate-900 dark:text-white">Profile View</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">
            {profile.name}
          </h1>
          <div className="flex flex-wrap gap-10">
            <StatBox label="信頼継続" value={`${profile.stats.trustDays}d`} />
            <StatBox label="制作作品数" value={profile.stats.works} />
            <StatBox label="総評価数" value={profile.stats.evals} />
            <StatBox
              label="ポイント"
              value={`${profile.stats.points.toLocaleString()} PT`}
            />
          </div>
        </div>
      </section>

      <div className="space-y-20">
        {/* 1. 自分自身が作った作品リスト */}
        <section>
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2 font-mono">
              <BookOpen size={14} className="text-blue-600" /> [
              自分自身が作った作品リスト ]
            </h2>
            <button
              onClick={() => onSetPage("portfolio")}
              className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1 uppercase tracking-wider"
            >
              ポートフォリオ（詳細説明）を見る <ChevronRight size={12} />
            </button>
          </div>
          <MarkdownTable
            headers={[
              { label: "作品タイトル" },
              { label: "カテゴリ", className: "w-32" },
              { label: "登録時期", className: "w-40 text-right" },
            ]}
            rows={myWorks.map((w) => ({
              cells: [
                {
                  content: (
                    <span className="font-bold text-slate-900 dark:text-white">
                      {w.title}
                    </span>
                  ),
                },
                { content: w.category },
                {
                  content: w.date,
                  className: "text-right font-mono text-xs",
                },
              ],
            }))}
            onAdd={onAddWork}
            addLabel="作品を追加"
          />
        </section>

        {/* 2. 作品評価 */}
        <section className="pt-8 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6">
            <div className="space-y-4">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2 font-mono">
                <Heart size={14} className="text-pink-500" /> [ 作品評価 ]
              </h2>
              <div className="flex border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden rounded shadow-sm w-fit font-mono">
                <button
                  onClick={() => onSetViewMode("simple")}
                  className={`px-4 py-2 text-[10px] font-black tracking-widest flex items-center gap-2 border-r border-slate-300 dark:border-slate-700 transition-colors ${
                    viewMode === "simple"
                      ? "bg-slate-900 text-white"
                      : "text-slate-400 hover:bg-slate-50"
                  }`}
                >
                  <List size={12} /> 評価(好き1種類のみ)
                </button>
                <button
                  onClick={() => onSetViewMode("tiered")}
                  className={`px-4 py-2 text-[10px] font-black tracking-widest flex items-center gap-2 transition-colors ${
                    viewMode === "tiered"
                      ? "bg-slate-900 text-white"
                      : "text-slate-400 hover:bg-slate-50"
                  }`}
                >
                  <BarChart2 size={12} /> 絶対相対評価(Tier1,2,3方式)
                </button>
              </div>
            </div>

            <div className="flex border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden rounded self-start lg:self-center">
              {["すべて", "アニメ", "漫画"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => onSetSelectedCategory(cat)}
                  className={`px-6 py-2 text-xs font-bold transition-colors border-r last:border-r-0 border-slate-300 dark:border-slate-700 ${
                    selectedCategory === cat
                      ? "bg-slate-900 text-white"
                      : "bg-transparent text-slate-400 hover:bg-slate-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-16">
            {(["now", "future", "life"] as const).map((status) => {
              const titles = {
                now: "Now Watching",
                future: "Future Expectations",
                life: "Lifetime Best",
              };
              const colors = {
                now: "text-blue-600",
                future: "text-orange-600",
                life: "text-purple-600",
              };
              return (
                <div key={status}>
                  <h3
                    className={`text-[10px] font-black mb-4 flex items-center gap-2 ${colors[status]} uppercase tracking-[0.2em] font-mono`}
                  >
                    &gt; {titles[status]}
                  </h3>
                  <MarkdownTable
                    headers={[
                      ...(viewMode === "tiered"
                        ? [
                            {
                              label: "絶対相対",
                              className: "w-24 text-center font-sans",
                            },
                          ]
                        : []),
                      { label: "作品タイトル" },
                      ...(selectedCategory === "すべて"
                        ? [{ label: "カテゴリ", className: "w-32" }]
                        : []),
                      { label: "操作", className: "w-12 text-right" },
                    ]}
                    rows={evaluations
                      .filter(
                        (e) =>
                          e.status === status &&
                          (selectedCategory === "すべて" ||
                            e.category === selectedCategory)
                      )
                      .map((e) => ({
                        cells: [
                          ...(viewMode === "tiered"
                            ? [
                                {
                                  content: getTierDisplay(e.tier),
                                  className: "text-center font-bold",
                                },
                              ]
                            : []),
                          {
                            content: (
                              <span className="font-bold">{e.title}</span>
                            ),
                          },
                          ...(selectedCategory === "すべて"
                            ? [
                                {
                                  content: (
                                    <span className="text-xs text-slate-400 font-mono">
                                      {e.category}
                                    </span>
                                  ),
                                },
                              ]
                            : []),
                          {
                            content: (
                              <button
                                onClick={() => onDeleteEvaluation(e.id)}
                                className="text-slate-300 hover:text-red-500"
                                aria-label="削除"
                              >
                                <Trash2 size={14} aria-hidden="true" />
                              </button>
                            ),
                            className: "text-right",
                          },
                        ],
                      }))}
                    onAdd={onAddEvaluation}
                    addLabel="作品を追加"
                  />
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. 価値観 */}
        <section className="pt-8 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2 mb-6 font-mono">
            <Fingerprint size={14} className="text-emerald-500" /> [ 価値観 ]
          </h2>
          <MarkdownTable
            headers={[
              { label: "カテゴリ", className: "w-32" },
              { label: "お題", className: "w-48" },
              { label: "回答" },
              { label: "重要度", className: "w-24 text-center" },
            ]}
            rows={values.map((v) => ({
              cells: [
                { content: v.category },
                {
                  content: <span className="font-bold">{v.topic}</span>,
                },
                {
                  content: (
                    <div className="flex flex-col space-y-1">
                      {v.answers.map((a, i) => (
                        <div key={i}>• {a}</div>
                      ))}
                    </div>
                  ),
                },
                {
                  content: (
                    <span
                      className={
                        v.level === "重要" ? "text-rose-500 font-bold" : ""
                      }
                    >
                      {v.level}
                    </span>
                  ),
                  className: "text-center font-black text-xs",
                },
              ],
            }))}
            onAdd={onAddValue}
          />
        </section>
      </div>
    </>
  );
};

const PortfolioView = (props: ProfileEditProps) => {
  const { profile, myWorks, onSetPage } = props;
  return (
    <div className="py-8">
      <button
        onClick={() => onSetPage("profile")}
        className="flex items-center gap-2 text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-black uppercase tracking-[0.2em] mb-10 transition-colors group"
      >
        <ArrowLeft
          size={14}
          className="group-hover:-translate-x-1 transition-transform"
        />
        Back to Profile
      </button>

      <div className="border-b border-slate-200 dark:border-slate-800 pb-8 mb-12">
        <h1 className="text-4xl font-black tracking-tighter uppercase leading-none mb-4">
          Portfolio: {profile.name}
        </h1>
        <p className="text-sm text-slate-500 font-mono tracking-widest uppercase">
          自分がこれまで情熱を注いで制作してきた作品の詳細です。
        </p>
      </div>

      <div className="space-y-24">
        {myWorks.map((work) => (
          <section
            key={work.id}
            className="grid grid-cols-1 lg:grid-cols-4 gap-10"
          >
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 font-black text-xs uppercase tracking-widest inline-block">
                {work.category} / {work.date}
              </div>
              <h2 className="text-2xl font-black tracking-tight">
                {work.title}
              </h2>
              <div className="space-y-2 pt-4">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <Briefcase size={12} /> Role
                </div>
                <div className="text-sm font-bold border-l-2 border-slate-200 pl-3">
                  {work.role}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <Code size={12} /> Tools
                </div>
                <div className="text-sm font-mono border-l-2 border-slate-200 pl-3">
                  {work.tools}
                </div>
              </div>
            </div>
            <div className="lg:col-span-3">
              <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-8 rounded-sm">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-6 border-b border-slate-200 pb-2 inline-block">
                  Description / 作品詳細
                </h3>
                <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-8">
                  {work.description}
                </p>
                <button className="flex items-center gap-2 text-blue-600 font-bold text-xs hover:underline uppercase tracking-wider">
                  作品を閲覧する <ExternalLink size={14} />
                </button>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export const ProfileEdit = (props: ProfileEditProps) => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      <main className="max-w-6xl mx-auto px-8 py-12 pb-24">
        {props.page === "profile" ? (
          <ProfileView {...props} />
        ) : (
          <PortfolioView {...props} />
        )}

        {/* FOOTER */}
        <footer className="pt-20 border-t border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex justify-between items-center font-mono">
          <div className="flex flex-wrap items-center gap-6">
            <span className="text-slate-400 font-black">VNS CORE ENGINE</span>
            <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
            <span>BUILD 2026.01.04</span>
            <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
            <span>MASAKINIHIROTA</span>
          </div>
          <div className="flex gap-8">
            <a
              href="#"
              className="hover:text-slate-900 transition-colors underline underline-offset-4 decoration-slate-200"
            >
              利用規約
            </a>
            <a
              href="#"
              className="hover:text-slate-900 transition-colors underline underline-offset-4 decoration-slate-200"
            >
              人間宣言
            </a>
            <a
              href="#"
              className="hover:text-slate-900 transition-colors underline underline-offset-4 decoration-slate-200"
            >
              オアシス宣言
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
};
