import {
  Check,
  Check as CheckIcon,
  Layers,
  Layout,
  Star,
  Zap,
} from "lucide-react";
import { FavoritesSection } from "../sections/favorites-section";
import { SkillsSection } from "../sections/skills-section";
import { ValuesSection } from "../sections/values-section";
import { WorksSection } from "../sections/works-section";
import { DeleteConfirmModal } from "../ui/delete-confirm-modal";
import { ThemeToggle } from "../ui/theme-toggle";
import { VisibilityToggle } from "../ui/visibility-toggle";
import {
  DashboardArrayKey,
  DashboardData,
  RatingType,
  SectionVisibility,
  SortConfig,
  ThemeVars,
} from "./profile-dashboard.types";

interface ProfileDashboardProps {
  readonly data: DashboardData;
  readonly isDarkMode: boolean;
  readonly isLikeMode: boolean;
  readonly filter: { readonly Manga: boolean; readonly Anime: boolean };
  readonly visibleSections: SectionVisibility;
  readonly themeVars: ThemeVars;
  readonly worksSort: SortConfig;
  readonly favsSort: SortConfig;
  readonly sortedWorks: readonly any[];
  readonly filteredAndSortedFavs: readonly any[];
  readonly pendingDelete: {
    readonly section: string;
    readonly id: number;
    readonly title: string;
  } | null;

  readonly onToggleTheme: () => void;
  readonly onToggleLikeMode: () => void;
  readonly onToggleFilter: (type: "Manga" | "Anime") => void;
  readonly onToggleSection: (section: keyof SectionVisibility) => void;
  readonly onSort: (section: "works" | "favorites", key: string) => void;
  readonly onUpdateCell: (
    section: DashboardArrayKey,
    id: number,
    field: string,
    value: any
  ) => void;
  readonly onRatingChange: (
    section: DashboardArrayKey,
    id: number,
    value: RatingType | "Like"
  ) => void;
  readonly onAdd: (section: DashboardArrayKey) => void;
  readonly onDeleteTrigger: (
    section: DashboardArrayKey,
    id: number,
    title: string
  ) => void;
  readonly onDeleteConfirm: () => void;
  readonly onDeleteCancel: () => void;
}

/**
 * プロフィールダッシュボードのメインプレゼンテーションコンポーネント
 */
export const ProfileDashboard = ({
  data,
  isDarkMode,
  isLikeMode,
  filter,
  visibleSections,
  themeVars,
  worksSort,
  favsSort,
  sortedWorks,
  filteredAndSortedFavs,
  pendingDelete,
  onToggleTheme,
  onToggleLikeMode,
  onToggleFilter,
  onToggleSection,
  onSort,
  onUpdateCell,
  onRatingChange,
  onAdd,
  onDeleteTrigger,
  onDeleteConfirm,
  onDeleteCancel,
}: ProfileDashboardProps) => {
  return (
    <div
      className={`min-h-screen ${themeVars.bg} ${themeVars.text} text-[18pt] font-sans p-10 transition-colors duration-300 select-none`}
    >
      {/* --- ヘッダー --- */}
      <header className="max-w-[1700px] mx-auto mb-10 space-y-6">
        <div
          className={`p-8 rounded-2xl ${themeVars.card} border flex justify-between items-center`}
        >
          <div>
            <div className="flex items-center gap-6 mb-2">
              <h1 className="text-5xl font-bold tracking-tight">
                {data.profile.name}
              </h1>
              <span
                className={`px-4 py-1 rounded-full text-[14pt] font-bold ${isDarkMode ? "bg-indigo-500/20 text-indigo-300" : "bg-blue-500/10 text-blue-700"}`}
              >
                {data.profile.status.toUpperCase()}
              </span>
            </div>
            <p className={`${themeVars.accent} font-medium`}>
              {data.profile.headline}
            </p>
          </div>
          <div className="flex gap-4 items-center">
            <ThemeToggle
              isDarkMode={isDarkMode}
              onClick={onToggleTheme}
              themeVars={themeVars}
            />
            <button
              onClick={onToggleLikeMode}
              className={`px-8 py-4 rounded-xl border font-bold transition-all flex items-center gap-3 ${isLikeMode ? "bg-indigo-500/30 border-indigo-400 text-white shadow-lg" : themeVars.btnPrimary}`}
            >
              <Star className={isLikeMode ? "text-white" : themeVars.accent} />
              {isLikeMode ? "LIKE表示中" : "TIER表示中"}
            </button>
          </div>
        </div>

        {/* セクション選択トグルパネル */}
        <div
          className={`p-4 rounded-xl ${themeVars.card} border flex items-center gap-6 justify-center`}
        >
          <div
            className={`flex items-center gap-3 pr-6 border-r border-white/10 ${themeVars.subText}`}
          >
            <Layout className="w-6 h-6" />
            <span className="font-bold text-[14pt]">セクション表示切替:</span>
          </div>
          <div className="flex gap-2">
            <VisibilityToggle
              active={visibleSections.works}
              onClick={() => onToggleSection("works")}
              label="自分の作品"
              icon={<Zap className="w-5 h-5" />}
              themeVars={themeVars}
            />
            <VisibilityToggle
              active={visibleSections.favorites}
              onClick={() => onToggleSection("favorites")}
              label="好きな作品"
              icon={<Layers className="w-5 h-5" />}
              themeVars={themeVars}
            />
            <VisibilityToggle
              active={visibleSections.values}
              onClick={() => onToggleSection("values")}
              label="価値観"
              icon={<CheckIcon className="w-5 h-5" />}
              themeVars={themeVars}
            />
            <VisibilityToggle
              active={visibleSections.skills}
              onClick={() => onToggleSection("skills")}
              label="スキル"
              icon={<Layers className="w-5 h-5" />}
              themeVars={themeVars}
            />
          </div>
        </div>
      </header>

      <main className="max-w-[1700px] mx-auto space-y-12 pb-24">
        <section className={`p-8 rounded-2xl ${themeVars.card} border`}>
          <h2
            className={`text-[14pt] uppercase tracking-widest font-bold mb-4 ${themeVars.subText}`}
          >
            Biography
          </h2>
          <p className="leading-relaxed">{data.profile.bio}</p>
        </section>

        {visibleSections.works && (
          <WorksSection
            works={sortedWorks}
            sortConfig={worksSort}
            isLikeMode={isLikeMode}
            themeVars={themeVars}
            onSort={(key) => onSort("works", key)}
            onUpdateCell={(id, field, value) =>
              onUpdateCell("works", id, field, value)
            }
            onRatingChange={(id, v) => onRatingChange("works", id, v)}
            onDelete={(id, title) => onDeleteTrigger("works", id, title)}
            onAdd={() => onAdd("works")}
          />
        )}

        {visibleSections.favorites && (
          <FavoritesSection
            favorites={filteredAndSortedFavs}
            sortConfig={favsSort}
            isLikeMode={isLikeMode}
            filter={filter}
            themeVars={themeVars}
            onSort={(key) => onSort("favorites", key)}
            onUpdateCell={(id, field, value) =>
              onUpdateCell("favorites", id, field, value)
            }
            onRatingChange={(id, v) => onRatingChange("favorites", id, v)}
            onDelete={(id, title) => onDeleteTrigger("favorites", id, title)}
            onAdd={() => onAdd("favorites")}
            onFilterToggle={onToggleFilter}
          />
        )}

        {visibleSections.values && (
          <ValuesSection
            values={data.values}
            isLikeMode={isLikeMode}
            themeVars={themeVars}
            onUpdateCell={(id, field, value) =>
              onUpdateCell("values", id, field, value)
            }
            onRatingChange={(id, v) => onRatingChange("values", id, v)}
            onDelete={(id, title) => onDeleteTrigger("values", id, title)}
            onAdd={() => onAdd("values")}
          />
        )}

        {visibleSections.skills && (
          <SkillsSection
            skills={data.skills}
            themeVars={themeVars}
            onDelete={(id, title) => onDeleteTrigger("skills", id, title)}
            onAdd={() => onAdd("skills")}
          />
        )}
      </main>

      {/* --- 確認モーダル --- */}
      {pendingDelete && (
        <DeleteConfirmModal
          title={pendingDelete.title}
          onConfirm={onDeleteConfirm}
          onCancel={onDeleteCancel}
          themeVars={themeVars}
        />
      )}

      {/* --- ステータスバー --- */}
      <footer
        className={`fixed bottom-0 left-0 right-0 p-4 px-10 border-t flex justify-between items-center text-[14pt] font-mono shadow-2xl ${themeVars.card}`}
      >
        <div className={themeVars.subText}>
          DGRID_OS_VER_2.1 // GLASSM_ENGINE
        </div>
        <div className="flex gap-10">
          <span className="flex items-center gap-2 text-emerald-400">
            <Check className="w-4 h-4" /> STATUS_READY
          </span>
          <span className={themeVars.subText}>USER_ID: 0X8F2A</span>
        </div>
      </footer>
    </div>
  );
};
