import { CheckCircle2, Circle } from "lucide-react";
import React from "react";
import {
  ALL_SLOTS,
  Profile,
  SlotId,
} from "../../profile-creation-1000masks.logic";
import { StepHeader } from "../step-header";

interface Step4SlotsProps {
  activeProfile: Profile;
  onToggleSlot: (id: SlotId) => void;
}

export const Step4Slots: React.FC<Step4SlotsProps> = ({
  activeProfile,
  onToggleSlot,
}) => {
  return (
    <section className="transition-colors duration-300">
      <StepHeader
        num="4"
        title="スロットの構成"
        subtitle="「３．プロフィールの目的」のスロットの組み合わせを決定します。"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
        {ALL_SLOTS.map((slot) => {
          const isSelected = activeProfile.selectedSlots.includes(slot.id);
          return (
            <button
              key={slot.id}
              onClick={() => onToggleSlot(slot.id)}
              className={`flex items-center space-x-4 p-6 rounded-[2rem] border-2 transition-all ${
                isSelected
                  ? "bg-white dark:bg-white/5 border-blue-500 dark:border-blue-600 shadow-xl text-blue-900 dark:text-blue-300 ring-4 ring-blue-50 dark:ring-blue-900/10"
                  : "bg-slate-50/50 dark:bg-black/20 border-transparent text-slate-400 dark:text-slate-600 hover:bg-white dark:hover:bg-white/5 hover:border-slate-200 dark:hover:border-white/10"
              }`}
            >
              <div
                className={
                  isSelected
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-slate-300 dark:text-slate-800"
                }
              >
                {isSelected ? <CheckCircle2 size={28} /> : <Circle size={28} />}
              </div>
              <div className="flex items-center space-x-3 text-left">
                {React.createElement(slot.icon, {
                  size: 24,
                  className: isSelected
                    ? "text-blue-500 dark:text-blue-400"
                    : "opacity-40 dark:opacity-20",
                })}
                <span className="text-lg font-black tracking-tight text-left">
                  {slot.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
