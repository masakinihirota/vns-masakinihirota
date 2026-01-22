"use client";

import { Coins, ArrowRight } from "lucide-react";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CategorySelector } from "./parts/category-selector";
import { PeriodSelector } from "./parts/period-selector";
import { TagSelector } from "./parts/tag-selector";
import { UrlManager } from "./parts/url-manager";
import { WorkFormValues } from "./work-registration.logic";

interface WorkRegistrationProps {
  form: UseFormReturn<WorkFormValues>;
  onSubmit: (values: WorkFormValues) => Promise<void>;
  isSubmitting: boolean;
  onFillDummyData?: () => void;
  requiredPoints: number;
}

export function WorkRegistration({
  form,
  onSubmit,
  isSubmitting,
  onFillDummyData,
  requiredPoints,
}: WorkRegistrationProps) {
  // Watch values for display (Points logic is in container, but we use form values for rendering styling)
  // const watchedTags = form.watch("tags") || [];
  // const watchedUrls = form.watch("urls") || [];
  // const watchedTitle = form.watch("title");

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 font-sans text-gray-800">
      <div className="mx-auto max-w-4xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Header */}
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">作品を登録</h1>
                <p className="text-gray-500 mt-2">
                  好きな作品を登録して、同じ「好き」を持つ人とつながりましょう。
                </p>
              </div>
              {process.env.NODE_ENV !== "production" && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onFillDummyData}
                  className="text-gray-400 text-xs"
                >
                  ダミー入力
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Main Column */}
              <div className="lg:col-span-8 space-y-8">
                {/* 1. Title */}
                <Card>
                  <CardContent className="p-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <Label
                            htmlFor="title"
                            className="text-lg font-bold mb-2 block"
                          >
                            作品タイトル <span className="text-red-500">*</span>
                          </Label>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="作品名を入力してください"
                              className="text-lg font-bold h-14"
                            />
                          </FormControl>
                          {/* <FormMessage /> */}
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* 2. Category & Period */}
                <Card>
                  <CardContent className="p-6 space-y-8">
                    {/* Category */}
                    <CategorySelector control={form.control} />

                    <div className="border-t border-gray-100" />

                    {/* Period */}
                    <PeriodSelector control={form.control} />
                  </CardContent>
                </Card>

                {/* 3. Tags */}
                <Card>
                  <CardContent className="p-6">
                    <TagSelector control={form.control} />
                  </CardContent>
                </Card>
              </div>

              {/* Side Column */}
              <div className="lg:col-span-4 space-y-8">
                {/* 4. URLs */}
                <UrlManager control={form.control} />

                {/* Submit Area */}
                <div className="sticky top-6">
                  <Card className="p-0 bg-gray-50 border-none shadow-none">
                    <CardContent className="p-0">
                      {/* Points Display */}
                      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-4 border border-blue-100 mb-6 relative overflow-hidden">
                        <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
                          <Coins className="w-24 h-24" />
                        </div>
                        <div className="relative z-10">
                          <div className="text-sm font-bold text-gray-500 mb-1">
                            必要ポイント
                          </div>
                          <div className="flex items-end gap-2">
                            <span className="text-4xl font-black text-blue-600 tracking-tighter">
                              {requiredPoints}
                            </span>
                            <span className="text-sm font-bold text-gray-400 mb-2">
                              pts
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                            情報を充実させると、必要なポイントが減ります。
                            <br />
                            (タイトルのみ: 50pt / 完記: 0pt)
                          </p>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-14 text-lg font-bold shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 transition-all bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl"
                      >
                        {isSubmitting ? (
                          "登録中..."
                        ) : (
                          <>
                            作品を登録する
                            <ArrowRight className="w-5 h-5 ml-2" />
                          </>
                        )}
                      </Button>
                      <p className="text-center text-xs text-gray-400 mt-4">
                        登録することで利用規約に同意したものとみなします。
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
