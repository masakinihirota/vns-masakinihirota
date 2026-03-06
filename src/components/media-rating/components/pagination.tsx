import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly onPageChange: (page: number) => void;
  readonly itemCount: number;
  readonly isSearchActive: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemCount,
  isSearchActive,
}: PaginationProps) {
  if (totalPages <= 0 && !isSearchActive) return null;

  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-8 py-6 bg-white border-t border-b gap-4">
      <div className="text-[1rem] text-slate-400 font-medium">
        {itemCount !== undefined && (
          <>
            {isSearchActive ? '検索結果: ' : '合計 '}
            <span className="font-bold text-slate-700 text-[1.1rem]">{itemCount}</span> 件 —
          </>
        )}
        ページ <span className="text-slate-800 font-bold">{currentPage}</span> / {Math.max(1, totalPages)}
      </div>

      {totalPages > 0 && (
        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="p-3 border-2 rounded-xl border-slate-200 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
            aria-label="前のページへ"
          >
            <ChevronLeft size={24} className="text-slate-600" />
          </button>

          <div className="flex gap-2 mx-2">
            {getPageNumbers().map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`w-12 h-12 border-2 rounded-xl font-bold transition-all text-[1rem] ${currentPage === pageNum
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg scale-110'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
              >
                {pageNum}
              </button>
            ))}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="p-3 border-2 rounded-xl border-slate-200 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
            aria-label="次のページへ"
          >
            <ChevronRight size={24} className="text-slate-600" />
          </button>
        </div>
      )}
    </div>
  );
}
