import { Layers, Trash2 } from "lucide-react";
import { Skill, ThemeVars } from "../features/profile-dashboard.types";
import { AddButton } from "../ui/add-button";
import { SectionHeader } from "../ui/section-header";

interface SkillsSectionProps {
  readonly skills: readonly Skill[];
  readonly themeVars: ThemeVars;
  readonly onDelete: (id: number, title: string) => void;
  readonly onAdd: () => void;
}

/**
 * 自分のスキルセクション
 */
export const SkillsSection = ({
  skills,
  themeVars,
  onDelete,
  onAdd,
}: SkillsSectionProps) => (
  <section className={`rounded-2xl ${themeVars.card} border overflow-hidden`}>
    <SectionHeader
      title="Specialized Skills"
      icon={<Layers className={`w-8 h-8 ${themeVars.accent}`} />}
      themeVars={themeVars}
    />

    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead
          className={`${themeVars.subText} text-[14pt] uppercase tracking-widest text-left`}
        >
          <tr className="border-b border-white/10">
            <th className="p-6 w-1/3 pl-12">スキル名</th>
            <th className="p-6">カテゴリー</th>
            <th className="p-6 text-right">習熟度</th>
            <th className="p-6 w-16"></th>
          </tr>
        </thead>
        <tbody>
          {skills.map((s) => (
            <tr
              key={s.id}
              className={`border-b border-white/5 transition-colors ${themeVars.rowHover} group`}
            >
              <td className="p-6 pl-12 font-bold text-2xl">{s.name}</td>
              <td className={`p-6 text-[16pt] ${themeVars.subText}`}>
                {s.category}
              </td>
              <td
                className={`p-6 text-right font-mono text-3xl font-black ${themeVars.accent}`}
              >
                {s.level}
              </td>
              <td className="p-6 text-center">
                <Trash2
                  onClick={() => onDelete(s.id, s.name)}
                  className="w-6 h-6 text-red-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity mx-auto"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <AddButton onClick={onAdd} label="スキルを追加" themeVars={themeVars} />
  </section>
);
