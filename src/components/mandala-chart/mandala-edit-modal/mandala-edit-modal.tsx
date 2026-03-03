"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface MandalaEditModalProps {
  /** 編集中のセルの値 */
  initialValue: string;
  /** 保存時のハンドラ */
  onSave: (newValue: string) => void;
  /** キャンセル時のハンドラ */
  onClose: () => void;
  /** モーダルが開いているかどうか */
  isOpen: boolean;
}

/**
 * セル編集用のモーダルコンポーネント
 */
export const MandalaEditModal = ({
  initialValue,
  onSave,
  onClose,
  isOpen,
}: MandalaEditModalProps) => {
  const [value, setValue] = useState(initialValue);

  // 初期値が変更されたら反映
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(value);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm animate-in fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 p-6 animate-in fade-in zoom-in duration-200">
          <div className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-neutral-100 dark:border-neutral-800">
              <Dialog.Title className="text-lg font-bold text-neutral-800 dark:text-neutral-100">
                目標を編集
              </Dialog.Title>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  aria-label="閉じる"
                >
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="space-y-2">
                <textarea
                  autoFocus
                  className="w-full min-h-[120px] p-4 text-[1rem] bg-neutral-50 dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl focus:border-blue-500 focus:outline-none transition-all resize-none"
                  placeholder="ここに目標を入力してください..."
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                      handleSubmit(e);
                    }
                  }}
                />
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Ctrl + Enter で保存できます
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-neutral-600 dark:text-neutral-300 font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 hover:shadow-xl active:scale-95 transition-all"
                >
                  保存する
                </button>
              </div>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
