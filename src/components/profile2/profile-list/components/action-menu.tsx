import { Edit3, Copy, Trash2, MoreVertical } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Button } from "../local-ui";

interface ActionMenuProps {
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export const ActionMenu: React.FC<ActionMenuProps> = ({ onEdit, onDuplicate, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Click outside to close (simplified)
  useEffect(() => {
    const close = () => setIsOpen(false);
    if (isOpen) window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [isOpen]);

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <Button
        variant="ghost"
        size="icon"
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="h-8 w-8 text-slate-400 hover:text-white"
      >
        <MoreVertical className="w-4 h-4" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-8 z-10 w-48 overflow-hidden rounded-md border border-slate-800 bg-slate-900 p-1 shadow-md animate-in fade-in zoom-in-95 duration-100">
          <div className="px-2 py-1.5 text-xs font-semibold text-slate-400">Actions</div>
          <button
            onClick={onEdit}
            className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-slate-800 hover:text-slate-100 text-slate-300"
          >
            <Edit3 className="mr-2 h-4 w-4" /> Edit Config
          </button>
          <button
            onClick={onDuplicate}
            className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-slate-800 hover:text-slate-100 text-slate-300"
          >
            <Copy className="mr-2 h-4 w-4" /> Duplicate
          </button>
          <div className="my-1 h-px bg-slate-800" />
          <button
            onClick={onDelete}
            className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-red-900/30 text-red-500 hover:text-red-400"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </button>
        </div>
      )}
    </div>
  );
};
