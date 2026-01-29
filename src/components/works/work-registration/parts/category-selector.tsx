import { Folder } from "lucide-react";
import React from "react";
import { Control, ControllerRenderProps } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,

} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { WorkFormValues, CATEGORIES } from "../work-registration.logic";

interface CategorySelectorProps {
  control: Control<WorkFormValues>;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  control,
}) => {
  return (
    <FormField
      control={control}
      name="category"
      render={({
        field,
      }: {
        field: ControllerRenderProps<WorkFormValues, "category">;
      }) => (
        <FormItem>
          <Label className="flex items-center gap-2 mb-4 font-bold text-gray-700">
            <Folder className="w-5 h-5 text-blue-600" />
            カテゴリを選択
          </Label>
          <FormControl>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = field.value === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => field.onChange(cat.id)}
                    className={cn(
                      "flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all",
                      isSelected
                        ? "border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600"
                        : "border-gray-200 hover:border-blue-300 hover:bg-gray-50 text-gray-600"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-6 h-6",
                        isSelected ? "text-blue-600" : "text-gray-400"
                      )}
                    />
                    <span className="text-sm font-bold">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
};
