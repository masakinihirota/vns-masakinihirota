import { Crown, MapPin, Users } from "lucide-react";
import React from "react";
import { NATION_DATA, TABS } from "./nation-dashboard.constants";
import { TabId } from "./nation-dashboard.types";
import { BankView } from "./views/bank-view";
import { CastleView } from "./views/castle-view";
import { GateView } from "./views/gate-view";
import { MarketView } from "./views/market-view";
import { PlazaView } from "./views/plaza-view";

interface NationDashboardProps {
  activeTab: TabId;
  onTabChange: (id: TabId) => void;
  isScrolled: boolean;
}

export const NationDashboard: React.FC<NationDashboardProps> = ({
  activeTab,
  onTabChange,
  isScrolled,
}) => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-20 dark:bg-[#0B0F1A] dark:text-gray-100 transition-colors duration-300">
      {/* 1. 没入感ヘッダー (FV) */}
      <div className="relative h-48 md:h-64 bg-slate-900 overflow-hidden text-white">
        {/* 背景画像 (プレースホルダー) */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 opacity-90"></div>
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        ></div>

        <div className="absolute inset-0 flex items-center justify-center flex-col pt-8 animate-in fade-in duration-700">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/20 mb-3 shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            <Crown className="w-8 h-8 text-yellow-300 drop-shadow-md" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-wider font-serif shadow-black drop-shadow-lg text-center">
            {NATION_DATA.name}
          </h1>
          <p className="mt-2 text-indigo-200 text-sm max-w-md text-center px-4 font-medium opacity-90">
            {NATION_DATA.description}
          </p>

          <div className="mt-4 flex gap-4 text-xs font-mono opacity-80 bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" /> Pop:{" "}
              {NATION_DATA.population.toLocaleString()}
            </span>
            <span className="w-px h-3 bg-white/30"></span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Lv: {NATION_DATA.level}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Sticky Tab Navigation */}
      <div
        className={`sticky top-0 z-40 bg-white/95 dark:bg-[#0B0F1A]/95 backdrop-blur-sm border-b border-gray-200 dark:border-white/10 shadow-sm transition-all duration-300 ease-in-out ${
          isScrolled ? "py-1" : "py-3"
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 overflow-x-auto overflow-y-hidden no-scrollbar">
          <div className="flex justify-start md:justify-center gap-2 min-w-max">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id as TabId)}
                  className={`
                    relative flex flex-col items-center justify-center px-4 py-2 rounded-lg transition-all duration-200 min-w-[80px] group
                    ${
                      isActive
                        ? "text-indigo-600 bg-indigo-50/50 dark:text-indigo-400 dark:bg-white/5"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-white/5"
                    }
                  `}
                  aria-label={tab.label}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon
                    className={`w-5 h-5 mb-1 transition-transform group-hover:scale-110 ${
                      isActive ? "stroke-[2.5px] scale-105" : "stroke-[1.5px]"
                    }`}
                  />
                  <span
                    className={`text-[10px] font-bold tracking-wide transition-opacity ${
                      isActive
                        ? "opacity-100"
                        : "opacity-70 group-hover:opacity-90"
                    }`}
                  >
                    {tab.label}
                  </span>

                  {/* Active Indicator Line */}
                  {isActive && (
                    <span className="absolute bottom-0 w-8 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-in zoom-in duration-200"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 py-8 min-h-[500px]">
        {/* コンテンツ切り替え */}
        {activeTab === "plaza" && <PlazaView />}
        {activeTab === "market" && <MarketView />}
        {activeTab === "bank" && <BankView />}
        {activeTab === "castle" && <CastleView />}
        {activeTab === "gate" && <GateView />}
      </main>

      {/* Footer Info */}
      <footer className="text-center text-xs text-gray-400 dark:text-gray-600 mt-12 mb-8 border-t border-gray-200 dark:border-white/10 pt-8 mx-auto max-w-lg">
        <p className="font-serif italic opacity-70">
          VNS masakinihirota - The Origin Nation System
        </p>
        <p className="mt-1">Current Mode: Hybrid UI Prototype</p>
      </footer>
    </div>
  );
};
