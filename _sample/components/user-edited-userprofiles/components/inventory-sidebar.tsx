"use client";

import {
  BookOpen,
  Box,
  Briefcase,
  Check,
  ChevronDown,
  Clapperboard,
  Edit3,
  FileText,
  Heart,
  Layers,
  MonitorPlay,
  Plus,
  Search,
  Zap
} from "lucide-react";
import { useMemo, useState } from "react";

import { ITEMS, MOCK_PACKAGES } from "../user-profile-app.mock";
import {
  InventorySidebarProperties,
  Package,
  SlotType
} from "../user-profile-app.types";

/**
 * インベントリサイドバーコンポーネント
 * @param root0
 * @param root0.activeSectionId
 * @param root0.onEquipPackage
 * @param root0.onEquipItem
 * @param root0.onRemoveItem
 * @param root0.onUpdateTier
 * @param root0.localTiers
 * @param root0.setLocalTiers
 * @param root0.profile
 */
export const InventorySidebar = ({
  activeSectionId,
  onEquipPackage,
  onEquipItem,
  onRemoveItem,
  onUpdateTier,
  localTiers,
  setLocalTiers,
  profile,
}: InventorySidebarProperties) => {
  const [selectedWorkCategory, setSelectedWorkCategory] = useState<string | null>(null);
  const [expandedPackageId, setExpandedPackageId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const currentSlotType: SlotType = useMemo(() => {
    if (activeSectionId === "value" || activeSectionId === "skill") return activeSectionId;
    return "work";
  }, [activeSectionId]);

  // SectionId から UserProfile の equippedSlots キーへのマップ
  const SECTION_TO_SLOT_KEY = {
    "work_future": "worksFuture",
    "work_current": "worksCurrent",
    "work_life": "worksLife",
    "value": "values",
    "skill": "skills"
  } as const;

  // アイテムが登録されているかチェック
  const isItemRegisteredGlobally = (itemId: string): boolean => {
    const key = SECTION_TO_SLOT_KEY[activeSectionId as keyof typeof SECTION_TO_SLOT_KEY];
    if (!key) return false;
    const slots = profile?.equippedSlots?.[key];
    return slots?.some((s) => s.id === itemId) || false;
  };

  // パッケージが全装備されているかチェック
  const isPackageFullyEquipped = (package_: Package): boolean => {
    const key = SECTION_TO_SLOT_KEY[activeSectionId as keyof typeof SECTION_TO_SLOT_KEY];
    if (!key) return false;
    const slots = profile?.equippedSlots?.[key];
    if (!slots) return false;
    const equippedIds = new Set(slots.map((s) => s.id));
    return package_.items.every((item) => equippedIds.has(item.id));
  };

  // 表示用ラベル
  const sectionLabel = useMemo(() => {
    switch (activeSectionId) {
      case "work_future": {
        return "Future Works";
      }
      case "work_current": {
        return "Current Works";
      }
      case "work_life": {
        return "Life Works";
      }
      case "value": {
        return "Core Values";
      }
      case "skill": {
        return "Key Skills";
      }
      default: {
        return "Inventory";
      }
    }
  }, [activeSectionId]);

  // カテゴリ一覧
  const categories = useMemo(() => {
    const allItems = Object.values(ITEMS);
    const relevantItems = allItems.filter((item) => item.type === currentSlotType);
    return [...new Set(relevantItems.map((item) => item.category))];
  }, [currentSlotType]);

  // フィルタリングされたパッケージ
  const filteredPackages = useMemo(() => {
    return MOCK_PACKAGES.filter((package_) => {
      if (package_.type !== currentSlotType) return false;
      const query = searchQuery.toLowerCase();
      if (!query) return true;
      return (
        package_.title.toLowerCase().includes(query) ||
        (package_.description?.toLowerCase() || "").includes(query)
      );
    });
  }, [currentSlotType, searchQuery]);

  // フィルタリングされたアイテム
  const filteredItems = useMemo(() => {
    const allItems = Object.values(ITEMS);
    return allItems.filter((item) => {
      if (item.type !== currentSlotType) return false;
      if (selectedWorkCategory && item.category !== selectedWorkCategory) return false;
      const query = searchQuery.toLowerCase();
      if (!query) return true;
      return item.title.toLowerCase().includes(query);
    });
  }, [currentSlotType, selectedWorkCategory, searchQuery]);

  const renderPackageItem = (package_: Package) => {
    const isExpanded = expandedPackageId === package_.id || searchQuery.length > 0;
    const isEquipped = isPackageFullyEquipped(package_);

    return (
      <div key={package_.id} className="mb-2 border border-white/10 rounded-lg overflow-hidden bg-white/5">
        <button
          onClick={() => setExpandedPackageId(isExpanded ? null : package_.id)}
          className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition-colors"
          aria-expanded={isExpanded}
          aria-label={`${package_.title}の詳細を表示`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-md">
              <Layers size={16} />
            </div>
            <div className="text-left">
              <div className="text-sm font-medium text-white">{package_.title}</div>
              <div className="text-xs text-neutral-400">{package_.items.length} items</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isEquipped && <Check size={14} className="text-emerald-400" aria-label="装備済み" />}
            <ChevronDown size={14} className={`text-neutral-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} aria-hidden="true" />
          </div>
        </button>

        {isExpanded && (
          <div className="p-3 pt-0 border-t border-white/5 bg-black/20">
            <p className="text-xs text-neutral-400 mb-3">{package_.description || ""}</p>
            <div className="space-y-2">
              {package_.items.map((item) => {
                const isItemEquipped = isItemRegisteredGlobally(item.id);
                return (
                  <div key={item.id} className="flex items-center justify-between text-xs p-2 rounded bg-white/5">
                    <span className="text-neutral-300">{item.title}</span>
                    {isItemEquipped ? (
                      <Check size={12} className="text-emerald-500/50" />
                    ) : (
                      <button
                        onClick={() => onEquipItem(item)}
                        className="text-indigo-400 hover:text-indigo-300"
                      >
                        <Plus size={12} />
                        <span className="sr-only">Equip {item.title}</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            {!isEquipped && (
              <button
                onClick={() => onEquipPackage(package_)}
                className="w-full mt-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 text-xs font-medium rounded transition-colors"
              >
                Equip Package
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "漫画": {
        return <BookOpen size={14} />;
      }
      case "アニメ": {
        return <MonitorPlay size={14} />;
      }
      case "映画": {
        return <Clapperboard size={14} />;
      }
      case "Portfolio": {
        return <Briefcase size={14} />;
      }
      case "Team": {
        return <Heart size={14} />;
      }
      case "Personal": {
        return <Zap size={14} />;
      }
      default: {
        return <FileText size={14} />;
      }
    }
  };

  return (
    <aside
      className="h-full flex flex-col bg-[#0B0F1A] border-l border-white/10 w-80 text-white"
      aria-label="Inventory Sidebar"
      data-testid="inventory-sidebar"
    >
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-2 mb-4 text-indigo-400">
          <Box size={20} />
          <h2 className="text-lg font-bold tracking-tight">{sectionLabel}</h2>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} aria-hidden="true" />
          <input
            type="text"
            placeholder="Search items..."
            aria-label="アイテムを検索"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-neutral-600"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {/* Categories (Tabs-like) */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedWorkCategory(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${selectedWorkCategory ? 'bg-white/5 text-neutral-400 hover:bg-white/10' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'}`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedWorkCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors ${selectedWorkCategory === cat ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-white/5 text-neutral-400 hover:bg-white/10'}`}
            >
              {getCategoryIcon(cat)}
              {cat}
            </button>
          ))}
        </div>

        {/* Packages Section */}
        {filteredPackages.length > 0 && (
          <div className="mb-8">
            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-4 flex items-center gap-2" aria-label="推奨パッケージセクション">
              <Layers size={12} />
              Recommended Packages
            </div>
            <div className="space-y-1">
              {filteredPackages.map(renderPackageItem)}
            </div>
          </div>
        )}

        {/* Individual Items */}
        <div>
          <div className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-4 flex items-center gap-2" aria-label="個別アイテムセクション">
            <Plus size={12} />
            Individual Items
          </div>
          <div className="grid grid-cols-1 gap-2">
            {filteredItems.map((item) => {
              const isEquipped = isItemRegisteredGlobally(item.id);
              const currentTier = localTiers[item.id] || item.tier;

              return (
                <div key={item.id} className="group relative bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-white/10 hover:border-white/20 transition-all">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm font-medium text-neutral-200 group-hover:text-white transition-colors">{item.title}</div>
                      <div className="text-[10px] text-neutral-500">{item.author || item.category}</div>
                    </div>
                    {isEquipped ? (
                      <div className="flex items-center gap-1">
                        {currentTier && (
                          <button
                            onClick={() => onUpdateTier(item.id, currentTier)}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 transition-colors"
                            aria-label={`ティアを変更 (現在のティア: T${currentTier})`}
                          >
                            T{currentTier}
                          </button>
                        )}
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="p-1.5 text-neutral-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                          aria-label={`${item.title}を外す`}
                        >
                          <Edit3 size={14} aria-hidden="true" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => onEquipItem(item)}
                        className="p-2 text-indigo-400 hover:text-white hover:bg-indigo-600 rounded-lg transition-all shadow-lg shadow-indigo-600/0 hover:shadow-indigo-600/20"
                        aria-label={`${item.title}を装備`}
                      >
                        <Plus size={16} aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
};
