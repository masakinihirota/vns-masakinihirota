"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface CellEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (value: string) => void;
  label: string;
  initialValue: string;
}

export const CellEditDialog: React.FC<CellEditDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  label,
  initialValue,
}) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleSave = () => {
    onSave(value);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-zinc-100">
            {label} の内容を編集
          </DialogTitle>
          <DialogDescription className="sr-only">
            マンダラチャートのセルの内容を編集します。
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="min-h-[100px] bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 focus:ring-indigo-500"
            placeholder="内容を入力してください..."
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            キャンセル
          </Button>
          <Button
            onClick={handleSave}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            保存する
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
