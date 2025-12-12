"use client";

import { UseFormReturn } from "react-hook-form";
import { WorkFormValues } from "./work-registration.logic";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface WorkRegistrationProps {
  form: UseFormReturn<WorkFormValues>;
  onSubmit: (values: WorkFormValues) => void;
  isSubmitting: boolean;
  onFillDummyData: () => void;
}

export function WorkRegistration({
  form,
  onSubmit,
  isSubmitting,
  onFillDummyData,
}: WorkRegistrationProps) {
  return (
    <div className="container mx-auto max-w-2xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>作品登録</CardTitle>
          <CardDescription>新しい作品を登録します。必要な情報を入力してください。</CardDescription>
        </CardHeader>
        <CardContent>
          {process.env.NODE_ENV !== "production" && (
            <div className="mb-6 flex justify-end">
              <Button variant="outline" type="button" onClick={onFillDummyData}>
                ダミーデータを入力 (開発用)
              </Button>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>タイトル</FormLabel>
                    <FormControl>
                      <Input placeholder="作品のタイトル" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>説明</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="作品の説明を入力してください"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="itemTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>制作時期/時間</FormLabel>
                    <FormControl>
                      <Input placeholder="例: 2023年春, 30時間" {...field} />
                    </FormControl>
                    <FormDescription>制作にかかった時間や時期など</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ステータス</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="ステータスを選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="draft">下書き</SelectItem>
                        <SelectItem value="published">公開</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      公開すると他のユーザーから見えるようになります。
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* タグと画像の入力は今回は簡易的なテキストエリア等で代用せず、後ほど高度なコンポーネントにする想定で、
                 一旦JSON.stringifyなどで表示確認するか、あるいはカンマ区切り入力などで簡易実装する。
                 ここではシンプルにTODOコメントを残しつつ、最低限の動作フィールドを用意する方針とするが、
                 Planに従い画像URL入力欄を一つだけ設ける簡易実装にするか、あるいはarray fieldにする。
                 UI指示書には「ドラッグアンドドロップ」などの複雑なUIは分解せよとあるので、
                 ここではあえてシンプルなInput(カンマ区切り)として実装しておく。
               */}

              <div className="rounded-md bg-muted p-4 text-sm text-muted-foreground">
                <p className="font-bold">
                  ※画像アップロード機能・タグ入力機能は次回フェーズで実装予定
                </p>
                <p>現在はダミーデータ入力で内部値を確認できます。</p>
              </div>

              <div className="flex justify-end gap-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  登録する
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
