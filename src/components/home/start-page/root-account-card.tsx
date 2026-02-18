import { cn } from "@/lib/utils";
import { ShieldCheck } from "lucide-react";

/**
 * アカウントの情報を表示するカードコンポーネント
 */
export function AccountCard({
  isSimple = false,
  isTrial = false,
  className,
}: {
  isSimple?: boolean;
  isTrial?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-2 border-slate-300 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-900 overflow-hidden shadow-sm max-w-2xl mx-auto md:mx-0 relative",
        className
      )}
    >
      <div className="bg-slate-800 dark:bg-neutral-800 p-4 flex items-center gap-4 text-white">
        <div className="w-10 h-10 rounded-lg bg-slate-700 dark:bg-neutral-700 flex items-center justify-center">
          <ShieldCheck size={28} />
        </div>
        <div className="flex flex-col">
          <span className="text-[20px] font-black">アカウント</span>
        </div>
      </div>

      {/* アカウントアイテム */}
      <div className="p-6 space-y-4 text-[18px]">
        <div className="text-slate-700 dark:text-neutral-100 font-bold">
          ・プロフィールの管理（千の仮面）
        </div>
        {!isSimple && !isTrial && (
          <>
            <div className="text-slate-700 dark:text-neutral-100 font-bold">
              ・現実の情報（母語・居住エリア）
            </div>
            <div className="text-slate-700 dark:text-neutral-100 font-bold">
              ・ポイント・経済管理
            </div>
            <div className="text-slate-700 dark:text-neutral-100 font-bold">
              ・その他、非常時にする重要情報
            </div>
          </>
        )}
      </div>
    </div>
  );
}
