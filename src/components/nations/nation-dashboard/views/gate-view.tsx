import { DoorOpen, MapPin, Search } from "lucide-react";

export const GateView = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 animate-in fade-in duration-500">
      <DoorOpen className="w-24 h-24 text-gray-300 dark:text-gray-600 mb-6" />
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
        城門前
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-8 text-center max-w-md">
        ここから外の世界（ワールドマップ）へ旅立つことができます。
        <br />
        準備はいいですか？
      </p>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg shadow-lg hover:shadow-xl hover:from-green-600 hover:to-emerald-700 transition flex items-center justify-center gap-2 font-bold transform hover:-translate-y-0.5">
          <MapPin className="w-5 h-5" />
          世界地図を開く
        </button>
        <button className="w-full py-3 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 transition flex items-center justify-center gap-2 font-medium">
          <Search className="w-4 h-4" />
          他の国を検索
        </button>
      </div>
    </div>
  );
};
