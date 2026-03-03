import { ArrowDown, ArrowUp, ExternalLink, ShoppingCart } from 'lucide-react';
import { SortConfig, Work } from '../media-rating.types';

interface MediaTableProps {
  readonly works: readonly Work[];
  readonly isLoading: boolean;
  readonly selectedWorkId: number | null;
  readonly onWorkSelect: (id: number) => void;
  readonly adVisible: boolean;
  readonly sortConfig: SortConfig;
  readonly onSortRequest: (key: keyof Work | 'userRating') => void;
}

export function MediaTable({
  works,
  isLoading,
  selectedWorkId,
  onWorkSelect,
  adVisible,
  sortConfig,
  onSortRequest,
}: MediaTableProps) {
  const SortIcon = ({ columnKey }: { columnKey: keyof Work | 'userRating' }) => {
    if (sortConfig.key !== columnKey) return <ArrowUp size={16} className="opacity-10 group-hover:opacity-30" />;
    return sortConfig.direction === 'asc'
      ? <ArrowUp size={16} className="text-blue-600" />
      : <ArrowDown size={16} className="text-blue-600" />;
  };

  const SkeletonRow = () => (
    <tr className="border-b animate-pulse bg-white">
      <td className="p-4 border-r"><div className="h-8 bg-slate-100 rounded-lg w-full"></div></td>
      <td className="p-4 border-r"><div className="h-8 bg-slate-100 rounded-lg w-full"></div></td>
      <td className="p-4 border-r hidden lg:table-cell"><div className="h-8 bg-slate-100 rounded-lg w-full"></div></td>
      <td className="p-4 border-r"><div className="h-8 bg-slate-100 rounded-lg w-10 mx-auto"></div></td>
      {adVisible && <td className="p-4"><div className="h-8 bg-slate-100 rounded-lg w-10 mx-auto"></div></td>}
    </tr>
  );

  return (
    <div className="flex-1 overflow-auto bg-slate-50/50">
      <table className="w-full border-collapse table-fixed min-w-[800px] lg:min-w-[1000px]">
        <thead className="sticky top-0 bg-slate-100 z-10 shadow-sm">
          <tr className="text-left select-none text-[0.85rem] font-bold text-slate-500 uppercase tracking-wider">
            <th
              onClick={() => onSortRequest('category')}
              className="p-4 border-r border-b w-[120px] cursor-pointer hover:bg-slate-200 transition-colors group text-center"
            >
              <div className="flex items-center justify-center gap-2">
                種別 <SortIcon columnKey="category" />
              </div>
            </th>
            <th
              onClick={() => onSortRequest('title')}
              className="p-4 border-r border-b w-auto min-w-[300px] cursor-pointer hover:bg-slate-200 transition-colors group"
            >
              <div className="flex items-center gap-2">
                作品タイトル <SortIcon columnKey="title" />
              </div>
            </th>
            <th className="p-4 border-r border-b w-[280px] hidden lg:table-cell">タグ / 属性</th>
            <th className="p-4 border-r border-b w-[100px] text-center">公式</th>
            {adVisible && <th className="p-4 border-b w-[100px] text-center">広告</th>}
          </tr>
        </thead>
        <tbody className="bg-white">
          {isLoading ? (
            Array.from({ length: 15 }).map((_, i) => <SkeletonRow key={i} />)
          ) : works.length > 0 ? (
            works.map((work) => (
              <tr
                key={work.id}
                onClick={() => onWorkSelect(work.id)}
                className={`border-b hover:bg-blue-50/50 cursor-pointer transition-colors group ${selectedWorkId === work.id ? 'bg-blue-50/80 ring-2 ring-inset ring-blue-200' : ''
                  }`}
              >
                <td className="p-4 border-r text-center">
                  <span className={`text-[0.8rem] px-2 py-1 rounded-lg border-2 font-black whitespace-nowrap inline-block ${work.category === 'アニメ' ? 'border-purple-100 bg-purple-50 text-purple-600' :
                      work.category === '漫画' ? 'border-emerald-100 bg-emerald-50 text-emerald-600' :
                        'border-slate-100 bg-slate-50 text-slate-600'
                    }`}>
                    {work.category}
                  </span>
                </td>
                <td className="p-4 border-r font-bold align-middle">
                  <div className={`line-clamp-2 leading-relaxed text-[1.1rem] ${work.isOfficial ? 'text-slate-800' : 'text-blue-700'}`}>
                    {work.isOfficial && <span className="inline-block mr-2 px-1.5 py-0.5 bg-slate-800 text-white text-[0.65rem] rounded align-middle uppercase tracking-tighter">Official</span>}
                    {work.title}
                  </div>
                </td>
                <td className="p-4 border-r truncate text-[0.95rem] text-slate-400 hidden lg:table-cell italic">
                  {work.tags.map(t => `#${t}`).join(' ')}
                </td>
                <td className="p-4 border-r text-center">
                  <a
                    href={work.externalUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-slate-300 hover:text-blue-600 inline-block p-2.5 hover:bg-blue-50 rounded-xl transition-all active:scale-90"
                    aria-label="公式サイトを開く"
                  >
                    <ExternalLink size={24} />
                  </a>
                </td>
                {adVisible && (
                  <td className="p-4 text-center">
                    <a
                      href={work.affiliateUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-orange-300 hover:text-orange-600 inline-block p-2.5 hover:bg-orange-50 rounded-xl transition-all active:scale-90"
                      aria-label="購入ページを開く"
                    >
                      <ShoppingCart size={24} />
                    </a>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={adVisible ? 5 : 4} className="p-32 text-center text-slate-400 italic text-[1.2rem]">
                一致する作品が見つかりませんでした
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
