import { List, Plus, Trash2, X } from 'lucide-react';
import React from 'react';
import { MandalaChartData } from '../mandala-chart.types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  charts: readonly MandalaChartData[];
  activeIndex: number;
  onSelect: (index: number) => void;
  onAdd: () => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

/**
 * サイドバーコンポーネント
 */
export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  charts,
  activeIndex,
  onSelect,
  onAdd,
  onDelete,
}) => {
  return (
    <aside role="complementary" className={`
      fixed inset-y-0 left-0 z-40 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      md:relative md:translate-x-0 flex flex-col
    `}>
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
        <h2 className="font-bold flex items-center gap-2 text-slate-700 dark:text-slate-200">
          <List size={20} /> マイチャート
        </h2>
        <button onClick={onClose} className="md:hidden p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg" aria-label="サイドバーを閉じる">
          <X size={20} />
        </button>
      </div>

      <div className="p-4">
        <button
          onClick={onAdd}
          className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95"
        >
          <Plus size={18} /> 新規作成
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 custom-scrollbar">
        {charts.map((chart, idx) => (
          <div
            key={chart.id}
            onClick={() => { onSelect(idx); onClose(); }}
            className={`
              group relative p-3 rounded-xl cursor-pointer border transition-all select-none
              ${activeIndex === idx
                ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800 ring-1 ring-blue-400'
                : 'bg-white border-slate-100 hover:border-slate-300 dark:bg-slate-900 dark:border-slate-800'}
            `}
          >
            <div className="font-bold text-sm truncate pr-8">{chart.title || "無題のチャート"}</div>
            <div className="text-[10px] text-slate-400 mt-1 flex justify-between items-center">
              <span>{new Date(chart.createdAt).toLocaleDateString()}</span>
              {idx === activeIndex && <span className="text-blue-500 font-medium">表示中</span>}
            </div>

            <button
              onClick={(e) => onDelete(chart.id, e)}
              className="absolute top-3 right-2 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 p-1.5 rounded transition-all"
              title="削除"
              aria-label="チャートを削除"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
};
