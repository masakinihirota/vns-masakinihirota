import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RegistrationFormValues, STATUS_OPTIONS } from "../schema";

interface ConfirmationScreenProps {
  data: RegistrationFormValues;
  onBack: () => void;
  onRegister: () => void;
}

export function ConfirmationScreen({
  data,
  onBack,
  onRegister,
}: ConfirmationScreenProps) {
  const { work, entry } = data;
  const statusLabel = STATUS_OPTIONS.find(
    (s) => s.value === entry.status
  )?.label;

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500 pb-20">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          登録内容の確認
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Work Info Preview */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 pb-2 border-b">
            <span className="text-xl">📖</span> 作品情報
          </h3>
          <div className="space-y-4 text-sm">
            <div>
              <label className="block text-slate-500 mb-1">タイトル</label>
              <p className="text-lg font-bold text-slate-900">{work.title}</p>
            </div>
            <div>
              <label className="block text-slate-500 mb-1">作者</label>
              <p className="text-slate-800">{work.author}</p>
            </div>
            {work.publisher && (
              <div>
                <label className="block text-slate-500 mb-1">出版社</label>
                <p className="text-slate-800">{work.publisher}</p>
              </div>
            )}
            <div>
              <label className="block text-slate-500 mb-1">カテゴリー</label>
              {work.category === "manga" ? (
                <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">
                  マンガ
                </span>
              ) : (
                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">
                  アニメ
                </span>
              )}
            </div>
          </div>
        </div>

        {/* User Entry Preview */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 pb-2 border-b">
            <span className="text-xl">✍️</span> あなたの記録
          </h3>
          <div className="space-y-4 text-sm">
            <div>
              <label className="block text-slate-500 mb-1">ステータス</label>
              <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 font-bold rounded-lg border border-indigo-100">
                {statusLabel || entry.status}
              </span>
            </div>
            {entry.tier && (
              <div>
                <label className="block text-slate-500 mb-1">評価 (Tier)</label>
                <span className="inline-block px-3 py-1 bg-amber-50 text-amber-700 font-bold rounded-lg border border-amber-100">
                  Tier {entry.tier}
                </span>
              </div>
            )}
            {entry.memo && (
              <div>
                <label className="block text-slate-500 mb-1">メモ</label>
                <div className="bg-slate-50 p-4 rounded-lg text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {entry.memo}
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t flex justify-end gap-4">
            <Button variant="outline" onClick={onBack} size="lg">
              修正する
            </Button>
            <Button
              onClick={onRegister}
              size="lg"
              className="px-8 bg-indigo-600 hover:bg-indigo-700 text-white gap-2 text-lg h-12"
            >
              <Save className="w-5 h-5" />
              登録を確定する
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
