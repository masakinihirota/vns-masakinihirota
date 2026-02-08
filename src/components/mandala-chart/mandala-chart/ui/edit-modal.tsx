import { Info, X } from 'lucide-react';
import React from 'react';
import { EditingCell } from '../mandala-chart.types';

interface EditModalProps {
  editingCell: EditingCell;
  value: string;
  onUpdate: (gridIdx: number, cellIdx: number, value: string) => void;
  onClose: () => void;
}

const GRID_POSITIONS = ["左上", "上", "右上", "左", "中央", "右", "左下", "下", "右下"];

/**
 * セル編集用モーダルコンポーネント
 */
export const EditModal: React.FC<EditModalProps> = ({
  editingCell,
  value,
  onUpdate,
  onClose,
}) => {
  const isSyncCell = (editingCell.gridIdx === 4 && editingCell.cellIdx !== 4) ||
    (editingCell.gridIdx !== 4 && editingCell.cellIdx === 4);

  return (
    <div
      className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-800 p-6 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4 shrink-0">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              {GRID_POSITIONS[editingCell.gridIdx]} - Position {editingCell.cellIdx + 1}
            </div>
            <h3 className="font-bold text-xl text-slate-800 dark:text-slate-100">
              {editingCell.gridIdx === 4 && editingCell.cellIdx === 4 ? "大目標 (Main Goal)" : "項目の編集"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400"
          >
            <X size={20} />
          </button>
        </div>

        <textarea
          autoFocus
          className="w-full flex-1 min-h-[180px] p-5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-[18px] md:text-[20px] leading-relaxed resize-none mb-6 text-slate-900 dark:text-slate-100 placeholder-slate-400 shadow-inner"
          value={value}
          onChange={(e) => onUpdate(editingCell.gridIdx, editingCell.cellIdx, e.target.value)}
          placeholder="ここに目標やアイデアを入力..."
        />

        <button
          onClick={onClose}
          className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 active:scale-95 shrink-0"
        >
          完了
        </button>

        {isSyncCell && (
          <div className="mt-4 flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-xs md:text-sm text-blue-700 dark:text-blue-300 shrink-0 border border-blue-100 dark:border-blue-800">
            <Info size={18} className="shrink-0 mt-0.5" />
            <span>このセルは他のグリッドの中心と自動的に同期されます。ここを変更すると、関連するグリッドも更新されます。</span>
          </div>
        )}
      </div>
    </div>
  );
};
