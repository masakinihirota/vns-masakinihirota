import { ExternalLink, Trash2, Zap } from "lucide-react";
import {
  RatingType,
  SortConfig,
  ThemeVars,
  Work,
} from "../features/profile-dashboard.types";
import { AddButton } from "../ui/add-button";
import { EditableCell } from "../ui/editable-cell";
import { RatingCell } from "../ui/rating-cell";
import { SectionHeader } from "../ui/section-header";
import { SortHeader } from "../ui/sort-header";

interface WorksSectionProps {
  readonly works: readonly Work[];
  readonly sortConfig: SortConfig;
  readonly isLikeMode: boolean;
  readonly themeVars: ThemeVars;
  readonly onSort: (key: string) => void;
  readonly onUpdateCell: (id: number, field: string, value: any) => void;
  readonly onRatingChange: (id: number, value: RatingType | "Like") => void;
  readonly onDelete: (id: number, title: string) => void;
  readonly onAdd: () => void;
}

/**
 * 自分の作品実績セクション
 */
export const WorksSection = ({
  works,
  sortConfig,
  isLikeMode,
  themeVars,
  onSort,
  onUpdateCell,
  onRatingChange,
  onDelete,
  onAdd,
}: WorksSectionProps) => (
  <section className={`rounded-2xl ${themeVars.card} border overflow-hidden`}>
    <SectionHeader
      title="My Works"
      icon={<Zap className={`w-8 h-8 ${themeVars.accent}`} />}
      themeVars={themeVars}
    />

    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead
          className={`${themeVars.subText} text-[14pt] uppercase tracking-widest text-left`}
        >
          <tr className="border-b border-white/10">
            <SortHeader
              label="プロジェクト"
              sortKey="title"
              currentSort={sortConfig}
              onSort={onSort}
              extraClass="pl-12"
            />
            <SortHeader
              label="技術スタック"
              sortKey="category"
              currentSort={sortConfig}
              onSort={onSort}
            />
            <th className="p-6">リンク</th>
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
          {works.map((item) => (
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
              <EditableCell
                value={item.category}
                onSave={(v) => onUpdateCell(item.id, "category", v)}
                themeVars={themeVars}
              />
              <td className="p-6">
                <div className="flex items-center justify-between group/link">
                  <span
                    className={`font-mono ${themeVars.accent} truncate max-w-[250px]`}
                  >
                    {item.url}
                  </span>
                  <ExternalLink className="w-6 h-6 cursor-pointer opacity-40 group-hover/link:opacity-100 transition-opacity" />
                </div>
              </td>
              <RatingCell
                value={item.rating}
                isLikeMode={isLikeMode}
                onChange={(v) => onRatingChange(item.id, v)}
                themeVars={themeVars}
              />
              <td className="p-6 text-center">
                <Trash2
                  onClick={() => onDelete(item.id, item.title)}
                  className="w-6 h-6 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer mx-auto"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <AddButton onClick={onAdd} label="成果物を追加" themeVars={themeVars} />
  </section>
);
