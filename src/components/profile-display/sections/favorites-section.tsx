import { BookOpen, Layers, MonitorPlay, Trash2 } from "lucide-react";
import {
  Favorite,
  RatingType,
  SortConfig,
  ThemeVars,
} from "../features/profile-dashboard.types";
import { AddButton } from "../ui/add-button";
import { EditableCell } from "../ui/editable-cell";
import { RatingCell } from "../ui/rating-cell";
import { SectionHeader } from "../ui/section-header";
import { SortHeader } from "../ui/sort-header";

interface FavoritesSectionProps {
  readonly favorites: readonly Favorite[];
  readonly sortConfig: SortConfig;
  readonly isLikeMode: boolean;
  readonly filter: { readonly Manga: boolean; readonly Anime: boolean };
  readonly themeVars: ThemeVars;
  readonly onSort: (key: string) => void;
  readonly onUpdateCell: (id: number, field: string, value: any) => void;
  readonly onRatingChange: (id: number, value: RatingType | "Like") => void;
  readonly onDelete: (id: number, title: string) => void;
  readonly onAdd: () => void;
  readonly onFilterToggle: (type: "Manga" | "Anime") => void;
}

/**
 * 好きな作品（Favorite Content）セクション
 */
export const FavoritesSection = ({
  favorites,
  sortConfig,
  isLikeMode,
  filter,
  themeVars,
  onSort,
  onUpdateCell,
  onRatingChange,
  onDelete,
  onAdd,
  onFilterToggle,
}: FavoritesSectionProps) => (
  <section className={`rounded-2xl ${themeVars.card} border overflow-hidden`}>
    <SectionHeader
      title="Favorite Content"
      icon={<Layers className={`w-8 h-8 ${themeVars.accent}`} />}
      themeVars={themeVars}
    >
      <div className="flex bg-black/5 dark:bg-white/5 rounded-lg p-1 gap-1">
        <FilterButton
          active={filter.Manga}
          onClick={() => onFilterToggle("Manga")}
          icon={<BookOpen className="w-6 h-6" />}
          label="漫画"
        />
        <FilterButton
          active={filter.Anime}
          onClick={() => onFilterToggle("Anime")}
          icon={<MonitorPlay className="w-6 h-6" />}
          label="アニメ"
        />
      </div>
    </SectionHeader>

    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead
          className={`${themeVars.subText} text-[14pt] uppercase tracking-widest text-left`}
        >
          <tr className="border-b border-white/10">
            <SortHeader
              label="タイトル"
              sortKey="title"
              currentSort={sortConfig}
              onSort={onSort}
              extraClass="pl-12"
            />
            <SortHeader
              label="カテゴリ"
              sortKey="subCategory"
              currentSort={sortConfig}
              onSort={onSort}
            />
            <th className="p-6 w-72">ジャンル</th>
            <SortHeader
              label="評価"
              sortKey="rating"
              currentSort={sortConfig}
              onSort={onSort}
              center
            />
            <th className="p-6 w-16"></th>
          </tr>
        </thead>
        <tbody>
          {favorites.map((item) => (
            <tr
              key={item.id}
              className={`border-b border-white/5 transition-colors ${themeVars.rowHover} group`}
            >
              <EditableCell
                value={item.title}
                onSave={(v) => onUpdateCell(item.id, "title", v)}
                themeVars={themeVars}
                extraClass="pl-12"
              />
              <td className="p-6">
                <span
                  className={`px-4 py-1 rounded-full text-[14pt] font-bold ${item.subCategory === "Manga" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" : "bg-purple-500/10 text-purple-500 border border-purple-500/20"}`}
                >
                  {item.subCategory}
                </span>
              </td>
              <EditableCell
                value={item.genre}
                onSave={(v) => onUpdateCell(item.id, "genre", v)}
                themeVars={themeVars}
              />
              <RatingCell
                value={item.rating}
                isLikeMode={isLikeMode}
                onChange={(v) => onRatingChange(item.id, v)}
                themeVars={themeVars}
              />
              <td className="p-6 text-center">
                <Trash2
                  onClick={() => onDelete(item.id, item.title)}
                  className="w-6 h-6 text-red-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity mx-auto"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <AddButton onClick={onAdd} label="好きな作品を追加" themeVars={themeVars} />
  </section>
);

const FilterButton = ({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-6 py-2 rounded-md font-bold transition-all ${active ? "bg-white/20 text-white shadow-sm" : "text-white/40 hover:text-white/60"}`}
  >
    {icon} {label}
  </button>
);
