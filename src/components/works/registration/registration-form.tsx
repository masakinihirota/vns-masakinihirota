"use client";

import { Loader2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AiSuggestionDiff } from "./ai-suggestion-diff";
import { CATEGORIES, SCALES, STATUS_OPTIONS } from "./schema";
import { ThemeSwitcher } from "./theme-switcher";
import { useAiAutocomplete } from "./use-ai-autocomplete";
import { useWorkRegistration } from "./use-work-registration";

export function RegistrationForm() {
  const { form, onSubmit, isLoading, error } = useWorkRegistration();
  const {
    suggest,
    isSuggesting,
    suggestion,
    applySuggestion,
    discardSuggestion,
  } = useAiAutocomplete(form);

  const title = form.watch("work.title");

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            作品登録
          </h1>
          <p className="text-muted-foreground mt-2">
            新しい作品をデータベースに登録し、あなたの視聴ステータスを記録します。
          </p>
        </div>
        <ThemeSwitcher />
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md text-sm font-medium">
          {error}
        </div>
      )}

      <AiSuggestionDiff
        suggestion={suggestion!}
        onApply={applySuggestion}
        onDiscard={discardSuggestion}
      />

      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-8">
          {/* Work Information Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold border-b pb-2 text-gray-800 dark:text-gray-200">
              作品情報
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="work.title"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>タイトル</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input
                          placeholder="作品名を入力"
                          {...field}
                          className="bg-white/50 dark:bg-black/20"
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => suggest(title)}
                        disabled={!title || isSuggesting}
                        className="shrink-0"
                      >
                        {isSuggesting ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Wand2 className="w-4 h-4 mr-2" />
                        )}
                        AI入力補助
                      </Button>
                    </div>
                    <FormDescription>
                      タイトルを入力して「AI入力補助」を押すと、その他の情報を自動補完できます。
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="work.author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>作者 / スタジオ</FormLabel>
                    <FormControl>
                      <Input placeholder="作者名" {...field} />
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
                    <FormLabel>出版社 / レーベル</FormLabel>
                    <FormControl>
                      <Input placeholder="出版社名" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="work.category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>カテゴリー</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="カテゴリーを選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
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
                name="work.scale"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>規模感</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="規模感を選択" />
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
                name="work.releaseYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>公開年</FormLabel>
                    <FormControl>
                      <Input placeholder="例: 2024" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="work.officialUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>公式サイトURL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="work.summary"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>あらすじ</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="作品のあらすじ"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="work.tags"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>タグ (カンマ区切り)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="ファンタジー, バトル, 冒険"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="col-span-2 flex gap-6">
                <FormField
                  control={form.control}
                  name="work.isPurchasable"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>購入可能</FormLabel>
                        <FormDescription>
                          現在市場で購入または視聴可能な作品
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* User Entry Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold border-b pb-2 text-gray-800 dark:text-gray-200">
              あなたのステータス
            </h2>

            <FormField
              control={form.control}
              name="entry.status"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>状態</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <FormItem
                          key={status.value}
                          className="flex items-center space-x-3 space-y-0"
                        >
                          <FormControl>
                            <RadioGroupItem value={status.value} />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            {status.label}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="entry.memo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>メモ</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="視聴のきっかけや感想など"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end pt-6">
            <Button type="submit" size="lg" disabled={isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              登録する
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
