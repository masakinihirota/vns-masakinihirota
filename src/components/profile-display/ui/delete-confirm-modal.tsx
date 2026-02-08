import { AlertTriangle } from "lucide-react";
import { ThemeVars } from "../features/profile-dashboard.types";

interface DeleteConfirmModalProps {
  readonly title: string;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
  readonly themeVars: ThemeVars;
}

/**
 * 削除確認用モーダル
 */
export const DeleteConfirmModal = ({
  title,
  onConfirm,
  onCancel,
  themeVars,
}: DeleteConfirmModalProps) => (
  <div
    className={`fixed inset-0 z-[100] flex items-center justify-center p-6 ${themeVars.overlay} backdrop-blur-sm`}
  >
    <div
      className={`max-w-xl w-full p-10 rounded-3xl border-2 border-white/20 shadow-2xl ${themeVars.card}`}
    >
      <div className="flex items-center gap-4 text-rose-500 mb-6">
        <AlertTriangle className="w-12 h-12" />
        <h3 className="text-3xl font-black">削除の確認</h3>
      </div>
      <p className="mb-10 leading-relaxed text-2xl">
        「<span className="font-bold underline">{title}</span>
        」を削除してもよろしいですか？
        <br />
        この操作は取り消せません。
      </p>
      <div className="flex gap-4">
        <button
          onClick={onConfirm}
          className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-4 rounded-xl font-bold transition-all shadow-lg active:scale-95"
        >
          削除する
        </button>
        <button
          onClick={onCancel}
          className={`flex-1 py-4 rounded-xl font-bold border transition-all active:scale-95 ${themeVars.btnPrimary}`}
        >
          キャンセル
        </button>
      </div>
    </div>
  </div>
);
