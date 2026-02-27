"use client";

import { ChevronDown, ChevronRight, Edit3, Layers, Trash2 } from "lucide-react";
import React, { useState } from "react";

import { EquippedPackageItemProperties } from "../user-profile-app.types";

import { Button } from "./common-ui";
import { CompactSlotItem } from "./slot-items";

/**
 * 装備済みのパッケージを表示するコンポーネント
 * @param root0
 * @param root0.pkg
 * @param root0.onRemove
 * @param root0.onUpdateTier
 */
export const EquippedPackageItem = ({
  pkg,
  onRemove,
  onUpdateTier,
}: EquippedPackageItemProperties) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm overflow-hidden mb-2">
      <div
        className="flex items-center justify-between p-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-transform">
            {isOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-1 rounded">
            <Layers className="w-3 h-3" />
          </div>

          <div className="min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">
                {pkg.title}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 rounded-full">
                {pkg.items.length}
              </span>
            </div>
            {!isOpen && (
              <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate w-full">
                {pkg.items.map((index) => index.title).join(", ")}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-[10px] gap-1 px-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              /* 編集ロジック - 親で定義されるべきか、後ほどの拡張用 */
            }}
          >
            <Edit3 className="w-3 h-3" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="h-6 w-6 p-0 border-0 text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onRemove();
            }}
            title="このセットをまとめて削除"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 pl-8">
          {pkg.items.map((item) => (
            <CompactSlotItem
              key={item.id}
              item={item}
              isEquipped={false}
              onTierChange={() => onUpdateTier(item.id, item.tier)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
