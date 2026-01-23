import { BookOpen, Plus } from "lucide-react";
import { Work } from "../schema";

interface WorkCardProps {
  work: Work;
  onClick?: () => void;
  source?: "db" | "ai";
}

export function WorkCard({ work, onClick, source = "db" }: WorkCardProps) {
  const isAi = source === "ai";

  return (
    <div
      onClick={onClick}
      className={`group flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${
        isAi
          ? "bg-indigo-50/30 border-indigo-100 hover:border-indigo-300"
          : "bg-white border-slate-100 hover:border-slate-300"
      }`}
    >
      {/* Thumbnail Placeholder */}
      <div
        className={`w-16 h-20 rounded-lg flex-shrink-0 flex items-center justify-center ${
          isAi ? "bg-indigo-100 text-indigo-300" : "bg-slate-200 text-slate-400"
        }`}
      >
        {work.coverImageUrl ? (
          <img
            src={work.coverImageUrl}
            alt={work.title}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <BookOpen size={24} />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <h4 className="font-bold text-slate-800 truncate pr-2 group-hover:text-indigo-700 transition-colors">
            {work.title}
          </h4>
          {work.isNew && isAi && (
            <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-100 text-indigo-600 rounded-full flex-shrink-0">
              New
            </span>
          )}
        </div>

        <p className="text-sm text-slate-500 truncate">{work.author}</p>

        <p className="text-xs text-slate-400 mt-2 line-clamp-2">
          {work.summary}
        </p>
      </div>

      <div className="self-center">
        <button
          className="p-2 rounded-full text-indigo-600 hover:bg-indigo-50 transition-colors"
          aria-label="追加"
        >
          <Plus size={20} />
        </button>
      </div>
    </div>
  );
}
