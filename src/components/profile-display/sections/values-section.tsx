import { Check, Trash2 } from "lucide-react";
import {
  CoreValue,
  RatingType,
  ThemeVars,
} from "../features/profile-dashboard.types";
import { AddButton } from "../ui/add-button";
import { EditableCell } from "../ui/editable-cell";
import { RatingCell } from "../ui/rating-cell";
import { SectionHeader } from "../ui/section-header";

interface ValuesSectionProps {
  readonly values: readonly CoreValue[];
  readonly isLikeMode: boolean;
  readonly themeVars: ThemeVars;
  readonly onUpdateCell: (id: number, field: string, value: any) => void;
  readonly onRatingChange: (id: number, value: RatingType | "Like") => void;
  readonly onDelete: (id: number, title: string) => void;
  readonly onAdd: () => void;
}

/**
 * 自分の価値観セクション
 */
export const ValuesSection = ({
  values,
  isLikeMode,
  themeVars,
  onUpdateCell,
  onRatingChange,
  onDelete,
  onAdd,
}: ValuesSectionProps) => (
  <section className={`rounded-2xl ${themeVars.card} border overflow-hidden`}>
    <SectionHeader
      title="Core Values"
      icon={<Check className={`w-8 h-8 ${themeVars.accent}`} />}
      themeVars={themeVars}
    />

    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead
          className={`${themeVars.subText} text-[14pt] uppercase tracking-widest text-left`}
        >
          <tr className="border-b border-white/10">
            <th className="p-6 w-1/4 pl-12">キーワード</th>
            <th className="p-6">説明 / 背景</th>
            <th className="p-6 w-80 text-center">評価</th>
            <th className="p-6 w-16"></th>
          </tr>
        </thead>
        <tbody>
          {values.map((v) => (
            <tr
              key={v.id}
              className={`border-b border-white/5 transition-colors ${themeVars.rowHover} group`}
            >
              <EditableCell
                value={v.key}
                onSave={(val) => onUpdateCell(v.id, "key", val)}
                themeVars={themeVars}
                extraClass="pl-12 font-bold text-2xl"
              />
              <EditableCell
                value={v.description}
                onSave={(val) => onUpdateCell(v.id, "description", val)}
                themeVars={themeVars}
              />
              <RatingCell
                value={v.rating}
                isLikeMode={isLikeMode}
                onChange={(val) => onRatingChange(v.id, val)}
                themeVars={themeVars}
              />
              <td className="p-6 text-center">
                <Trash2
                  onClick={() => onDelete(v.id, v.key)}
                  className="w-6 h-6 text-red-400 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity mx-auto"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <AddButton onClick={onAdd} label="価値観を追加" themeVars={themeVars} />
  </section>
);
