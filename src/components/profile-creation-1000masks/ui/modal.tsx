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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[2rem] shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-300">
        <div className="p-10 text-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 ${modal.type === 'error' ? 'bg-red-50 text-red-500' : modal.type === 'success' ? 'bg-green-50 text-green-500' : 'bg-amber-50 text-amber-500'}`}>
            {modal.type === 'success' ? <CheckCircle2 size={40} /> : <AlertCircle size={40} />}
          </div>
          <h3 className="text-lg font-black text-slate-800 mb-3 uppercase tracking-widest text-center text-left">Notification</h3>
          <p className="text-lg font-bold text-slate-500 leading-relaxed text-center text-left">{modal.message}</p>
        </div>
        <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-center space-x-4">
          {modal.type.startsWith('confirm') ? (
            <>
              <button onClick={onClose} className="px-8 py-3 rounded-2xl font-black text-lg text-slate-400 hover:bg-white transition-all">キャンセル</button>
              <button
                onClick={() => {
                  if (modal.type === 'confirm_exit' && onConfirmExit) {
                    onConfirmExit();
                  } else if (modal.action) {
                    modal.action();
                  }
                }}
                className="px-10 py-3 rounded-2xl font-black text-lg bg-slate-800 text-white shadow-xl transition-all active:scale-95"
              >
                破棄して移動
              </button>
            </>
          ) : (
            <button onClick={onClose} className="px-12 py-3 rounded-2xl font-black text-lg bg-blue-600 text-white shadow-xl shadow-blue-100 transition-all active:scale-95">了解</button>
          )}
        </div>
      </div>
    </div>
  );
};
