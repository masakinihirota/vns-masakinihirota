import { Calendar, ChevronDown, ChevronUp, Check } from "lucide-react";
import React, { useState } from "react";
import { Control, ControllerRenderProps } from "react-hook-form";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { WorkFormValues, PERIOD_GROUPS } from "../work-registration.logic";

interface PeriodSelectorProps {
  control: Control<WorkFormValues>;
}

export const PeriodSelector: React.FC<PeriodSelectorProps> = ({ control }) => {
  const [isPastExpanded, setIsPastExpanded] = useState(false);

  return (
    <FormField
      control={control}
      name="period"
      render={({
        field,
      }: {
        field: ControllerRenderProps<WorkFormValues, "period">;
      }) => (
        <FormItem>
          <Label className="flex items-center gap-2 mb-4 font-bold text-gray-700">
            <Calendar className="w-5 h-5 text-blue-600" />
            制作年代・時期
          </Label>
          <FormControl>
            <div className="flex flex-col gap-4">
              {PERIOD_GROUPS.map((group) => {
                const isCollapsible = group.collapsible;
                const isExpanded = isCollapsible ? isPastExpanded : true;
                const selectedItemInGroup = group.items.find(
                  (item) => item.id === field.value
                );

                return (
                  <div key={group.id} className="space-y-2">
                    {isCollapsible ? (
                      <button
                        type="button"
                        onClick={() => setIsPastExpanded(!isPastExpanded)}
                        className="flex items-center justify-between w-full text-left text-xs font-bold text-gray-700 uppercase tracking-wider px-1 py-1 hover:bg-gray-100 rounded focus:outline-none"
                      >
                        <div className="flex items-center gap-2">
                          <span>{group.label}</span>
                          {!isExpanded && selectedItemInGroup && (
                            <span className="text-blue-600 font-bold ml-1">
                              選択中: {selectedItemInGroup.label}
                            </span>
                          )}
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    ) : (
                      <div className="text-xs font-bold text-gray-700 uppercase tracking-wider px-1 py-1">
                        {group.label}
                      </div>
                    )}

                    {isExpanded && (
                      <div className="flex flex-col gap-2 animate-in slide-in-from-top-2 duration-200">
                        {group.items.map((per) => {
                          const isSelected = field.value === per.id;
                          return (
                            <button
                              key={per.id}
                              type="button"
                              onClick={() => field.onChange(per.id)}
                              className={cn(
                                "w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all border flex items-center justify-between group",
                                isSelected
                                  ? "bg-blue-600 text-white border-blue-600 shadow-md"
                                  : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                              )}
                            >
                              <span>{per.label}</span>
                              {isSelected && (
                                <Check className="w-4 h-4 text-white" />
                              )}
                              {!isSelected && (
                                <span className="w-4 h-4 rounded-full border border-gray-300 group-hover:border-blue-400" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
};
