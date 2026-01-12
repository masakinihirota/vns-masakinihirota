import { Link2, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useWorkRegistration } from "../hooks/use-work-registration";
import {
  Work,
  SCALES,
  STATUS_OPTIONS,
  RegistrationFormValues,
} from "../schema";

interface EntryFormProps {
  initialValues?: Partial<RegistrationFormValues>;
  onBack: () => void;
  onConfirm: (data: RegistrationFormValues) => void;
}

export function EntryForm({
  initialValues,
  onBack,
  onConfirm,
}: EntryFormProps) {
  const { form, onSubmit: handleSubmit } = useWorkRegistration(initialValues);

  const isNewWork = form.watch("work.isNew");
  const isAiGenerated = form.watch("work.isAiGenerated");
  const isWorkEditable = isNewWork && !isAiGenerated;
  const workCategory = form.watch("work.category");

  // Hook's onSubmit does the API call logic which we don't want yet if confirming.
  // We want to capture the data and call onConfirm.
  // But useWorkRegistration returns onSubmit which is already wrapped with handleSubmit.
  // We should probably just use form.handleSubmit directly here.

  const handleFormSubmit = form.handleSubmit((data) => {
    onConfirm(data);
  });

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500 pb-20">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          作品情報の入力・評価
        </h2>
      </div>

      <Form {...form}>
        <form
          onSubmit={handleFormSubmit}
          className="grid md:grid-cols-12 gap-8 items-start"
        >
          {/* Left Column: Work Data */}
          <div className="md:col-span-5 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6 sticky top-24">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 pb-2 border-b justify-between">
              <span className="flex items-center gap-2">
                <span className="text-xl">📖</span> 作品情報
              </span>
              {/* Category Badge */}
              {workCategory === "manga" ? (
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">
                  マンガ
                </span>
              ) : (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">
                  アニメ
                </span>
              )}
            </h3>

            <FormField
              control={form.control}
              name="work.title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>タイトル</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={!isWorkEditable} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="work.author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>作者</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={!isWorkEditable} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="work.publisher"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>出版社 / 制作会社</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={!isWorkEditable}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="work.scale"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>規模感</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!isWorkEditable}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="選択してください" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SCALES.map((scale) => (
                        <SelectItem key={scale.value} value={scale.value}>
                          {scale.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="work.officialUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Link2 className="w-4 h-4" /> 公式URL
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="https://..."
                      disabled={!isWorkEditable}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="work.summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>あらすじ</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={5}
                      disabled={!isWorkEditable}
                      className="resize-none"
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Right Column: User Entry */}
          <div className="md:col-span-7 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 pb-2 border-b">
              <span className="text-xl">✍️</span> あなたの記録
            </h3>

            <FormField
              control={form.control}
              name="entry.status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">ステータス</FormLabel>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {STATUS_OPTIONS.map((option) => (
                      <div
                        key={option.value}
                        onClick={() => field.onChange(option.value)}
                        className={`
                                                    cursor-pointer rounded-xl border-2 p-4 text-center transition-all
                                                    ${
                                                      field.value ===
                                                      option.value
                                                        ? "border-indigo-600 bg-indigo-50 text-indigo-700 font-bold"
                                                        : "border-slate-200 hover:border-indigo-200 text-slate-600"
                                                    }
                                                `}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="entry.tier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">評価 (Tier)</FormLabel>
                  <FormDescription>
                    この作品のTierを選択してください
                  </FormDescription>
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map((tier) => (
                      <div
                        key={tier}
                        onClick={() => field.onChange(tier)}
                        className={`
                                                    cursor-pointer rounded-xl border-2 p-6 text-center transition-all flex flex-col items-center justify-center gap-2
                                                    ${
                                                      field.value === tier
                                                        ? "border-amber-500 bg-amber-50 text-amber-700 font-bold shadow-md transform scale-105"
                                                        : "border-slate-200 hover:border-amber-200 text-slate-500"
                                                    }
                                                `}
                      >
                        <span className="text-2xl">Tier {tier}</span>
                        {/* Labels Removed as requested */}
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="entry.memo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">作品に対して一言</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={8}
                      placeholder="感想や評価メモを自由に書いてください"
                      value={field.value || ""}
                      className="text-base leading-relaxed"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-4 border-t flex justify-end">
              <Button
                type="submit"
                size="lg"
                className="px-8 bg-indigo-600 hover:bg-indigo-700 text-white gap-2 text-lg h-12"
              >
                確認画面へ
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
