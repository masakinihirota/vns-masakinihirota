import { AlertCircle, CheckCircle2 } from 'lucide-react';
import React from 'react';
import { ModalState } from '../profile-creation-1000masks.logic';

interface ModalProps {
  modal: ModalState;
  onClose: () => void;
  onConfirmExit?: () => void;
}

export const Modal: React.FC<ModalProps> = ({ modal, onClose, onConfirmExit }) => {
  if (!modal.isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#161B22] rounded-[2rem] shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 dark:border-white/10 animate-in zoom-in-95 duration-300">
        <div className="p-10 text-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 transition-colors ${modal.type === 'error'
              ? 'bg-red-50 dark:bg-red-900/20 text-red-500'
              : modal.type === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 text-green-500'
                : 'bg-amber-50 dark:bg-amber-900/20 text-amber-500'
            }`}>
            {modal.type === 'success' ? <CheckCircle2 size={40} /> : <AlertCircle size={40} />}
          </div>
          <h3 className="text-lg font-black text-slate-800 dark:text-neutral-100 mb-3 uppercase tracking-widest">Notification</h3>
          <p className="text-lg font-bold text-slate-500 dark:text-slate-400 leading-relaxed text-center px-4">
            {modal.message}
          </p>
        </div>
        <div className="p-8 bg-slate-50 dark:bg-black/20 border-t border-slate-100 dark:border-white/5 flex items-center justify-center space-x-4">
          {modal.type.startsWith('confirm') ? (
            <>
              <button
                onClick={onClose}
                className="px-8 py-3 rounded-2xl font-black text-lg text-slate-400 dark:text-slate-600 hover:bg-white dark:hover:bg-white/5 transition-all"
              >
                キャンセル
              </button>
              <button
                onClick={() => {
                  if (modal.type === 'confirm_exit' && onConfirmExit) {
                    onConfirmExit();
                  } else if (modal.action) {
                    modal.action();
                  }
                }}
                className="px-10 py-3 rounded-2xl font-black text-lg bg-slate-800 dark:bg-slate-700 text-white shadow-xl transition-all active:scale-95 hover:bg-black dark:hover:bg-slate-600"
              >
                破棄して移動
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="px-12 py-3 rounded-2xl font-black text-lg bg-blue-600 dark:bg-blue-700 text-white shadow-xl shadow-blue-100 dark:shadow-none transition-all active:scale-95 hover:bg-blue-700 dark:hover:bg-blue-600"
            >
              了解
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
