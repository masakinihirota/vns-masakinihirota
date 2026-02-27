import { Check, GripVertical, Layers } from "lucide-react";

import { CompactSlotItemProperties, TierBadgeProperties } from "../user-profile-app.types";

/**
 * Tierを表示するバッジコンポーネント
 * @param root0
 * @param root0.tier
 * @param root0.onClick
 */
export const TierBadge = ({
  tier,
  onClick,
}: TierBadgeProperties) => {
  const colors = {
    1: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
    2: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
    3: "bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800",
    none: "bg-slate-50 text-slate-300 border-slate-100 dark:bg-slate-900 dark:text-slate-600 dark:border-slate-800",
  } as const;

  const currentStyle = tier ? colors[tier as 1 | 2 | 3] : colors.none;
  const content = tier ? `Tier ${tier}` : "No Tier";

  if (onClick) {
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className={`text-[10px] font-bold px-1.5 rounded border whitespace-nowrap transition-all hover:opacity-80 active:scale-95 ${currentStyle}`}
        title="クリックでTierを変更"
      >
        {content}
      </button>
    );
  }

  if (!tier) return null;

  return (
    <span
      className={`text-[10px] font-bold px-1.5 rounded border ${currentStyle} whitespace-nowrap`}
    >
      {content}
    </span>
  );
};

/**
 * リスト表示用のコンパクトなスロットアイテム
 * @param root0
 * @param root0.item
 * @param root0.onAction
 * @param root0.actionIcon
 * @param root0.onClick
 * @param root0.onTierChange
 * @param root0.isEquipped
 * @param root0.isRegistered
 * @param root0.isPackageMember
 */
export const CompactSlotItem = ({
  item,
  onAction,
  actionIcon,
  onClick,
  onTierChange,
  isEquipped = false,
  isRegistered = false,
  isPackageMember = false,
}: CompactSlotItemProperties) => {
  return (
    <div
      onClick={onClick}
      className={`
        group flex items-center gap-2 px-2 py-1.5 border-b border-slate-100 last:border-0 text-sm transition-colors
        dark:border-slate-800
        ${isEquipped ? "bg-white dark:bg-slate-900" : ""}
        ${onClick ? "cursor-pointer" : ""}
        ${isRegistered
          ? "bg-blue-50 dark:bg-blue-900/20 text-slate-600 dark:text-slate-300"
          : "hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300"
        }
      `}
    >
      {isEquipped && (
        <GripVertical className="w-3 h-3 text-slate-300 dark:text-slate-600 cursor-grab" />
      )}

      <div className="flex-1 min-w-0 flex items-center gap-2">
        <span
          className={`font-medium truncate ${isRegistered ? "text-blue-700 dark:text-blue-300" : ""}`}
        >
          {item.title}
        </span>
        {item.author && (
          <>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <span className="text-xs text-slate-500 dark:text-slate-500 truncate">
              {item.author}
            </span>
          </>
        )}
      </div>

      <div className="shrink-0 flex items-center gap-2">
        {!isEquipped && (
          <span className="text-[10px] text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-1 rounded">
            {item.category}
          </span>
        )}

        <TierBadge tier={item.tier} onClick={onTierChange} />
      </div>

      {isRegistered && !isEquipped ? (
        <div
          className="w-6 h-6 flex items-center justify-center text-blue-500 dark:text-blue-400"
          title={
            isPackageMember
              ? "セットに含まれています"
              : "登録済み (クリックで解除)"
          }
        >
          {isPackageMember ? (
            <Layers className="w-3 h-3 opacity-50" />
          ) : (
            <Check className="w-4 h-4" />
          )}
        </div>
      ) : (
        onAction &&
        actionIcon && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAction();
            }}
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {actionIcon}
          </button>
        )
      )}
    </div>
  );
};
