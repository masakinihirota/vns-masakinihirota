import { Link as LinkIcon, Plus, Trash2 } from "lucide-react";
import React from "react";
import { Control, ControllerRenderProps } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { WorkFormValues, URL_TYPES } from "../work-registration.logic";

interface UrlManagerProps {
  control: Control<WorkFormValues>;
}

export const UrlManager: React.FC<UrlManagerProps> = ({ control }) => {
  return (
    <Card className="bg-white border-blue-100 shadow-sm">
      <CardContent className="p-6">
        <Label className="flex items-center gap-2 mb-4 font-bold text-gray-700">
          <LinkIcon className="w-5 h-5 text-blue-600" />
          関連URL
        </Label>
        <p className="text-xs text-gray-500 mb-4">
          「公式サイト・情報」と「購入・アフィリエイト」を分けて登録できます。
        </p>

        <FormField
          control={control}
          name="urls"
          render={({
            field,
          }: {
            field: ControllerRenderProps<WorkFormValues, "urls">;
          }) => (
            <div className="space-y-4">
              {field.value.map(
                (urlItem: { value?: string; type?: string }, idx: number) => (
                  <div
                    key={idx}
                    className="flex flex-col gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <div className="flex gap-1 bg-gray-200 p-1 rounded-md">
                      {URL_TYPES.map((type) => {
                        const isActive = urlItem.type === type.id;
                        const TypeIcon = type.icon;
                        return (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() => {
                              const newUrls = [...field.value];
                              newUrls[idx].type = type.id;
                              field.onChange(newUrls);
                            }}
                            className={cn(
                              "flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-medium rounded-sm transition-all",
                              isActive
                                ? "bg-white text-blue-700 shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                            )}
                          >
                            <TypeIcon className="w-3 h-3" />
                            {type.label === "公式サイト・情報"
                              ? "公式・情報"
                              : "購入・紹介"}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          value={urlItem.value}
                          onChange={(e) => {
                            const newUrls = [...field.value];
                            newUrls[idx].value = e.target.value;
                            field.onChange(newUrls);
                          }}
                          placeholder={
                            urlItem.type === "official"
                              ? "https://公式サイト..."
                              : "https://Amazon/BOOTH..."
                          }
                          className="pl-9 text-sm"
                        />
                      </div>

                      {field.value.length > 2 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const newUrls = field.value.filter(
                              (_: unknown, i: number) => i !== idx
                            );
                            field.onChange(newUrls);
                          }}
                          className="text-gray-400 hover:text-red-500 h-11 w-11"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                )
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  field.onChange([
                    ...field.value,
                    { type: "official", value: "" },
                  ]);
                }}
                className="w-full mt-4 border-dashed text-gray-500 hover:text-blue-600 hover:border-blue-300"
              >
                <Plus className="w-4 h-4 mr-2" /> URLを追加
              </Button>
            </div>
          )}
        />
        <p className="text-xs text-gray-400 mt-3 text-center">
          ※ アフィリエイトURLを登録した場合は、広告OFFの場合に非表示になります。
        </p>
      </CardContent>
    </Card>
  );
};
