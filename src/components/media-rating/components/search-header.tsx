import { BookOpen, Eye, EyeOff, Search, Tv, X } from 'lucide-react';
import { Category } from '../media-rating.types';

interface SearchHeaderProps {
  readonly searchInput: string;
  readonly onSearchChange: (value: string) => void;
  readonly onSearchExecute: () => void;
  readonly onSearchClear: () => void;
  readonly adVisible: boolean;
  readonly onAdToggle: () => void;
  readonly enabledCategories: readonly Category[];
  readonly onCategoryToggle: (category: Category) => void;
}

export function SearchHeader({
  searchInput,
  onSearchChange,
  onSearchExecute,
  onSearchClear,
  adVisible,
  onAdToggle,
  enabledCategories,
  onCategoryToggle,
}: SearchHeaderProps) {
  return (
    <header className="px-6 py-6 border-b flex flex-col gap-6 bg-white shadow-sm shrink-0">
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <h1 className="font-bold text-3xl tracking-tight text-slate-800 shrink-0">登録済みリスト</h1>

        <div className="flex-1 flex items-center max-w-2xl gap-2">
          <div className="relative w-full group">
            <input
              type="text"
              placeholder="作品名・タグで検索 (Enterで実行)"
              value={searchInput}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSearchExecute()}
              className="w-full bg-slate-50 border-2 border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl pl-12 pr-12 py-3 outline-none transition-all text-[1rem]"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500" size={20} />
            {searchInput && (
              <button
                onClick={onSearchClear}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200"
                aria-label="検索条件をクリア"
              >
                <X size={20} />
              </button>
            )}
          </div>
          <button
            onClick={onSearchExecute}
            className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold py-3 px-8 rounded-xl transition-all whitespace-nowrap shadow-md text-[1rem]"
          >
            検索
          </button>
        </div>

        <button
          onClick={onAdToggle}
          className={`flex items-center gap-3 px-6 py-3 rounded-full border-2 transition-all font-bold text-[1rem] ${adVisible
              ? 'border-orange-500 text-orange-600 bg-orange-50 shadow-sm'
              : 'border-slate-300 text-slate-400 hover:border-slate-400'
            }`}
        >
          {adVisible ? <Eye size={20} /> : <EyeOff size={20} />}
          <span className="whitespace-nowrap">{adVisible ? '広告 ON' : '広告 OFF'}</span>
        </button>
      </div>

      <div className="flex items-center gap-4 py-1">
        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Category Filter:</span>
        <div className="flex gap-3">
          <button
            onClick={() => onCategoryToggle('アニメ')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl border-2 font-bold transition-all text-[1rem] ${enabledCategories.includes('アニメ')
                ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-sm'
                : 'border-slate-200 bg-white text-slate-300'
              }`}
          >
            <Tv size={20} /> アニメ
          </button>
          <button
            onClick={() => onCategoryToggle('漫画')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl border-2 font-bold transition-all text-[1rem] ${enabledCategories.includes('漫画')
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                : 'border-slate-200 bg-white text-slate-300'
              }`}
          >
            <BookOpen size={20} /> 漫画
          </button>
        </div>
      </div>
    </header>
  );
}
