import { CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChoicePath } from "./choice.data";

interface ChoiceCardProps {
  path: ChoicePath;
  isSelected: boolean;
  onClick: () => void;
  className?: string;
}

export const ChoiceCard = ({
  path,
  isSelected,
  onClick,
  className,
}: ChoiceCardProps) => {
  const { icon: Icon } = path;

  const colorMap = {
    emerald: {
      textRef: "text-emerald-400",
      bgRef: "bg-emerald-500/50",
      textUpper: "text-emerald-400/80",
    },
    purple: {
      textRef: "text-purple-400",
      bgRef: "bg-purple-500/50",
      textUpper: "text-purple-400/80",
    },
    amber: {
      textRef: "text-amber-400",
      bgRef: "bg-amber-500/50",
      textUpper: "text-amber-400/80",
    },
  };

  const { textRef, bgRef, textUpper } =
    colorMap[path.color] || colorMap.emerald;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex flex-col h-full p-6 md:p-8 rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden text-left w-full",
        isSelected
          ? "border-blue-500 bg-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.3)] scale-[1.02]"
          : "border-slate-800 bg-slate-900/60 hover:border-slate-600 hover:bg-slate-800/80 hover:shadow-lg hover:-translate-y-1",
        className
      )}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between mb-6 w-full">
        <div
          className={cn(
            "p-3 rounded-2xl bg-slate-950 border border-slate-800 shadow-inner group-hover:scale-110 transition-transform duration-300 shrink-0",
            textRef
          )}
        >
          <Icon className={cn("w-8 h-8", textRef)} />
        </div>
        {isSelected && (
          <div className="animate-in zoom-in duration-300">
            <CheckCircle2 className="w-6 h-6 text-blue-500" />
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="flex-1 space-y-4 w-full">
        <div>
          <p
            className={cn(
              "text-xs font-bold uppercase tracking-wider mb-1",
              textUpper
            )}
          >
            {path.subtitle}
          </p>
          <h2 className="text-xl font-bold text-slate-100 group-hover:text-blue-200 transition-colors">
            {path.title}
          </h2>
        </div>

        <p className="text-sm text-slate-400 leading-relaxed min-h-[4.5em]">
          {path.description}
        </p>

        {/* Benefits List */}
        <div className="pt-4 border-t border-slate-800/50 w-full">
          <ul className="space-y-2">
            {path.benefits.map((benefit, idx) => (
              <li
                key={idx}
                className="flex items-center text-xs text-slate-500 group-hover:text-slate-400 transition-colors"
              >
                <span
                  className={cn("w-1 h-1 rounded-full mr-2 shrink-0", bgRef)}
                ></span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommendation Tag */}
      <div className="mt-6 pt-4 w-full">
        <div className="inline-flex items-center gap-2 text-[10px] text-slate-500 font-medium bg-slate-950/50 px-3 py-2 rounded-lg border border-slate-800/50">
          <Info className="w-3 h-3 shrink-0" />
          {path.recommends}
        </div>
      </div>
    </button>
  );
};
