import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
import { SortConfig } from "../features/profile-dashboard.types";

interface SortHeaderProps {
  readonly label: string;
  readonly sortKey: string;
  readonly currentSort: SortConfig;
  readonly onSort: (key: string) => void;
  readonly extraClass?: string;
  readonly center?: boolean;
}

/**
 * ソート機能付きテーブルヘッダー
 */
export const SortHeader = ({
  label,
  sortKey,
  currentSort,
  onSort,
  extraClass = "",
  center = false,
}: SortHeaderProps) => {
  const isActive = currentSort.key === sortKey;

  return (
    <th
      className={`p-6 cursor-pointer hover:text-white transition-colors ${extraClass} ${center ? "text-center" : ""}`}
      onClick={() => onSort(sortKey)}
    >
      <div
        className={`flex items-center gap-2 ${center ? "justify-center" : ""}`}
      >
        {label}
        {isActive ? (
          currentSort.direction === "asc" ? (
            <ChevronUp className="w-5 h-5 text-indigo-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-indigo-400" />
          )
        ) : (
          <ArrowUpDown className="w-4 h-4 opacity-20" />
        )}
      </div>
    </th>
  );
};
