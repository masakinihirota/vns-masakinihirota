"use client";

import React, { useState, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  Plus,
  X,
  Link as LinkIcon,
  Trash2,
  Smile,
  Tag,
  Check,
  Folder,
  Calendar,
  ChevronDown,
  ChevronUp,
  BadgeCheck,
  Users,
  Search,
  LayoutGrid,
  Coins,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  // CardHeader,
  // CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  // FormLabel,
  // FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

import {
  WorkFormValues,
  CATEGORIES,
  PERIOD_GROUPS,
  OFFICIAL_TAGS,
  USER_TAGS,
  URL_TYPES,
  DISCOUNT_TAGS,
  DISCOUNT_URL,
} from "./work-registration.logic";

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
  // --- Local UI State (Not needing persistence in form) ---
  const [isPastExpanded, setIsPastExpanded] = useState(false);
  const [isOfficialExpanded, setIsOfficialExpanded] = useState(false);
  const [isUserExpanded, setIsUserExpanded] = useState(false);
  const [officialSearchQuery, setOfficialSearchQuery] = useState("");
  const [userSearchQuery, setUserSearchQuery] = useState("");

  // --- Constants / Helpers for rendering ---
  const popularOfficialTags = OFFICIAL_TAGS.slice(0, 6);
  const popularUserTags = USER_TAGS.slice(0, 8);

  const filteredOfficialTags = useMemo(() => {
    if (!officialSearchQuery) return OFFICIAL_TAGS;
    return OFFICIAL_TAGS.filter((tag) =>
      tag.toLowerCase().includes(officialSearchQuery.toLowerCase()),
    );
  }, [officialSearchQuery]);

  const filteredUserTags = useMemo(() => {
    if (!userSearchQuery) return USER_TAGS;
    return USER_TAGS.filter((tag) => tag.toLowerCase().includes(userSearchQuery.toLowerCase()));
  }, [userSearchQuery]);

  const getTagStyle = (tagName: string, isSelected: boolean) => {
    const isOfficial = OFFICIAL_TAGS.includes(tagName);
    if (isSelected) {
      return isOfficial
        ? "bg-blue-100 text-blue-700 border-blue-200 font-bold"
        : "bg-emerald-100 text-emerald-700 border-emerald-200 font-bold";
    }
    return "bg-white text-gray-600 border-gray-200 hover:border-gray-300";
  };

  // --- Handlers ---
  const toggleTag = (
    tagToToggle: string,
    currentTags: string[],
    onChange: (tags: string[]) => void,
  ) => {
    if (currentTags.includes(tagToToggle)) {
      onChange(currentTags.filter((t) => t !== tagToToggle));
    } else {
      onChange([...currentTags, tagToToggle]);
    }
  };

  const addCustomTag = (currentTags: string[], onChange: (tags: string[]) => void) => {
    const newTag = userSearchQuery.trim();
    if (!newTag) return;
    if (!currentTags.includes(newTag)) {
      onChange([...currentTags, newTag]);
    }
    setUserSearchQuery("");
  };

  // Watch values for display (Points logic is in container, but we use form values for rendering styling)
  const watchedTags = form.watch("tags") || [];
  const watchedUrls = form.watch("urls") || [];
  const watchedTitle = form.watch("title");

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
                          <Label htmlFor="title" className="text-lg font-bold mb-2 block">
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
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
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
                                        : "border-gray-200 hover:border-blue-300 hover:bg-gray-50 text-gray-600",
                                    )}
                                  >
                                    <Icon
                                      className={cn(
                                        "w-6 h-6",
                                        isSelected ? "text-blue-600" : "text-gray-400",
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

                    <div className="border-t border-gray-100" />

                    {/* Period */}
                    <FormField
                      control={form.control}
                      name="period"
                      render={({ field }) => (
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
                                  (item) => item.id === field.value,
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
                                                  : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:bg-blue-50",
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
                  </CardContent>
                </Card>

                {/* 3. Tags */}
                <Card>
                  <CardContent className="p-6">
                    <FormField
                      control={form.control}
                      name="tags"
                      render={({ field }) => (
                        <FormItem>
                          <Label className="flex items-center gap-2 mb-4 font-bold text-gray-700">
                            <Tag className="w-5 h-5 text-blue-600" />
                            タグ設定
                          </Label>
                          <p className="text-xs text-gray-500 mb-6">
                            作品の特徴に合うタグを選択してください。情報を充実させると必要ポイントが減ります。
                          </p>
                          <FormControl>
                            <div>
                              {/* Selected Tags */}
                              <div className="mb-6 min-h-[48px] p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300 flex flex-wrap gap-2 items-center">
                                {field.value.length === 0 && (
                                  <span className="text-sm text-gray-400 flex items-center gap-1">
                                    <Smile className="w-4 h-4" /> 選択されたタグはここに表示されます
                                  </span>
                                )}
                                {field.value.map((tag, idx) => {
                                  const isOfficial = OFFICIAL_TAGS.includes(tag);
                                  return (
                                    <span
                                      key={idx}
                                      className={cn(
                                        "inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium animate-in fade-in zoom-in duration-200",
                                        isOfficial
                                          ? "bg-blue-100 text-blue-700"
                                          : "bg-emerald-100 text-emerald-700",
                                      )}
                                    >
                                      {isOfficial && <BadgeCheck className="w-3 h-3" />}
                                      {!isOfficial && <Users className="w-3 h-3" />}
                                      {tag}
                                      <button
                                        type="button"
                                        onClick={() => toggleTag(tag, field.value, field.onChange)}
                                        className={cn(
                                          "rounded-full p-0.5 transition-colors",
                                          isOfficial
                                            ? "hover:bg-blue-200 hover:text-blue-900"
                                            : "hover:bg-emerald-200 hover:text-emerald-900",
                                        )}
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </span>
                                  );
                                })}
                              </div>

                              {/* Official Tags Area */}
                              <div className="mb-8 pb-8 border-b border-gray-100">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                    <BadgeCheck className="w-4 h-4 text-blue-600" />
                                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                                      公式タグ (人気)
                                    </span>
                                  </div>
                                </div>
                                {!isOfficialExpanded && (
                                  <div className="flex flex-wrap gap-2 mb-4">
                                    {popularOfficialTags.map((tag) => {
                                      const isSelected = field.value.includes(tag);
                                      return (
                                        <button
                                          key={tag}
                                          type="button"
                                          onClick={() =>
                                            toggleTag(tag, field.value, field.onChange)
                                          }
                                          className={cn(
                                            "text-xs px-3 py-1.5 rounded-full transition-all border",
                                            getTagStyle(tag, isSelected),
                                          )}
                                        >
                                          {isSelected ? "✓ " : "+ "}
                                          {tag}
                                        </button>
                                      );
                                    })}
                                  </div>
                                )}
                                {isOfficialExpanded && (
                                  <div className="mb-4 animate-in slide-in-from-top-2 duration-200 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <div className="mb-4 relative">
                                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                                      <Input
                                        placeholder="公式タグを検索..."
                                        value={officialSearchQuery}
                                        onChange={(e) => setOfficialSearchQuery(e.target.value)}
                                        className="bg-white pl-10"
                                        autoFocus
                                      />
                                    </div>
                                    <div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto">
                                      {filteredOfficialTags.length > 0 ? (
                                        filteredOfficialTags.map((tag) => {
                                          const isSelected = field.value.includes(tag);
                                          return (
                                            <button
                                              key={tag}
                                              type="button"
                                              onClick={() =>
                                                toggleTag(tag, field.value, field.onChange)
                                              }
                                              className={cn(
                                                "text-xs px-3 py-1.5 rounded-full transition-all border",
                                                getTagStyle(tag, isSelected),
                                              )}
                                            >
                                              {isSelected ? "✓ " : "+ "}
                                              {tag}
                                            </button>
                                          );
                                        })
                                      ) : (
                                        <div className="text-gray-400 text-xs w-full text-center py-4">
                                          見つかりませんでした
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => setIsOfficialExpanded(!isOfficialExpanded)}
                                  className={cn(
                                    "w-full text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300",
                                    isOfficialExpanded && "bg-blue-50",
                                  )}
                                >
                                  <LayoutGrid className="w-4 h-4 mr-2" />
                                  {isOfficialExpanded
                                    ? "公式タグを閉じる"
                                    : "公式タグをすべて表示 / 検索"}
                                  {isOfficialExpanded ? (
                                    <ChevronUp className="w-4 h-4 ml-auto" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4 ml-auto" />
                                  )}
                                </Button>
                              </div>

                              {/* User Tags Area */}
                              <div>
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-emerald-600" />
                                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                                      ユーザータグ (人気)
                                    </span>
                                  </div>
                                </div>
                                {!isUserExpanded && (
                                  <div className="flex flex-wrap gap-2 mb-4">
                                    {popularUserTags.map((tag) => {
                                      const isSelected = field.value.includes(tag);
                                      return (
                                        <button
                                          key={tag}
                                          type="button"
                                          onClick={() =>
                                            toggleTag(tag, field.value, field.onChange)
                                          }
                                          className={cn(
                                            "text-xs px-3 py-1.5 rounded-full transition-all border",
                                            getTagStyle(tag, isSelected),
                                          )}
                                        >
                                          {isSelected ? "✓ " : "+ "}
                                          {tag}
                                        </button>
                                      );
                                    })}
                                  </div>
                                )}
                                {isUserExpanded && (
                                  <div className="mb-4 animate-in slide-in-from-top-2 duration-200 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <div className="flex gap-2 mb-4">
                                      <div className="relative flex-1">
                                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                                        <Input
                                          placeholder="タグを検索 または 作成..."
                                          value={userSearchQuery}
                                          onChange={(e) => setUserSearchQuery(e.target.value)}
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                              e.preventDefault();
                                              addCustomTag(field.value, field.onChange);
                                            }
                                          }}
                                          className="bg-white pl-10"
                                          autoFocus
                                        />
                                      </div>
                                      <Button
                                        type="button"
                                        onClick={() => addCustomTag(field.value, field.onChange)}
                                        disabled={!userSearchQuery.trim()}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                      >
                                        追加
                                      </Button>
                                    </div>

                                    {userSearchQuery &&
                                      !filteredUserTags.includes(userSearchQuery) && (
                                        <div className="mb-3 text-xs text-emerald-600 font-bold px-1 animate-in fade-in">
                                          <span className="bg-emerald-100 px-2 py-1 rounded">
                                            「{userSearchQuery}」を新規タグとして追加します
                                          </span>
                                        </div>
                                      )}

                                    <div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto">
                                      {filteredUserTags.length > 0 ? (
                                        filteredUserTags.map((tag) => {
                                          const isSelected = field.value.includes(tag);
                                          return (
                                            <button
                                              key={tag}
                                              type="button"
                                              onClick={() =>
                                                toggleTag(tag, field.value, field.onChange)
                                              }
                                              className={cn(
                                                "text-xs px-3 py-1.5 rounded-full transition-all border",
                                                getTagStyle(tag, isSelected),
                                              )}
                                            >
                                              {isSelected ? "✓ " : "+ "}
                                              {tag}
                                            </button>
                                          );
                                        })
                                      ) : (
                                        <div className="text-gray-400 text-xs w-full text-center py-4">
                                          既存のタグは見つかりませんでした。そのまま追加して作成できます。
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => setIsUserExpanded(!isUserExpanded)}
                                  className={cn(
                                    "w-full text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300",
                                    isUserExpanded && "bg-emerald-50",
                                  )}
                                >
                                  <LayoutGrid className="w-4 h-4 mr-2" />
                                  {isUserExpanded
                                    ? "ユーザータグを閉じる"
                                    : "ユーザータグから選ぶ / 作成"}
                                  {isUserExpanded ? (
                                    <ChevronUp className="w-4 h-4 ml-auto" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4 ml-auto" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Side Column */}
              <div className="lg:col-span-4 space-y-8">
                {/* 4. URLs using useFieldArray approach or just direct array field management */}
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
                      control={form.control}
                      name="urls"
                      render={({ field }) => (
                        <div className="space-y-4">
                          {field.value.map((urlItem, idx) => (
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
                                          : "text-gray-500 hover:text-gray-700",
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
                                      const newUrls = field.value.filter((_, i) => i !== idx);
                                      field.onChange(newUrls);
                                    }}
                                    className="text-gray-400 hover:text-red-500 h-11 w-11"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              field.onChange([...field.value, { type: "official", value: "" }]);
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

                {/* Submit Area */}
                <div className="sticky top-6">
                  <Card className="p-0 bg-gray-50 border-none shadow-none">
                    <CardContent className="p-0">
                      {/* Points Display */}
                      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-4 border border-blue-100 mb-6 relative overflow-hidden">
                        <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
                          <Coins className="w-24 h-24" />
                        </div>

                        <div className="flex items-baseline justify-between mb-2 relative z-10">
                          <span className="text-sm font-bold text-gray-600">消費ポイント</span>
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-extrabold text-blue-600">
                              {requiredPoints}
                            </span>
                            <span className="text-sm font-bold text-blue-400">pt</span>
                          </div>
                        </div>

                        {/* Discount Hints */}
                        <div className="space-y-1.5 relative z-10">
                          <div
                            className={cn(
                              "flex items-center justify-between text-xs",
                              watchedTags.length > 0 ? "text-green-600 font-bold" : "text-gray-400",
                            )}
                          >
                            <span className="flex items-center gap-1">
                              {watchedTags.length > 0 ? (
                                <Check className="w-3 h-3" />
                              ) : (
                                <div className="w-3 h-3 border rounded-full border-gray-300" />
                              )}
                              タグ設定
                            </span>
                            <span>-{DISCOUNT_TAGS}pt</span>
                          </div>
                          <div
                            className={cn(
                              "flex items-center justify-between text-xs",
                              watchedUrls.some((u) => u.value)
                                ? "text-green-600 font-bold"
                                : "text-gray-400",
                            )}
                          >
                            <span className="flex items-center gap-1">
                              {watchedUrls.some((u) => u.value) ? (
                                <Check className="w-3 h-3" />
                              ) : (
                                <div className="w-3 h-3 border rounded-full border-gray-300" />
                              )}
                              URL入力
                            </span>
                            <span>-{DISCOUNT_URL}pt</span>
                          </div>
                        </div>

                        {/* Total Discount Message */}
                        {requiredPoints > 20 ? (
                          <div className="mt-3 pt-2 border-t border-blue-100 text-[10px] text-blue-500 font-medium flex items-center justify-center gap-1">
                            <span>情報を入力してポイント節約！</span>
                            <ArrowRight className="w-3 h-3" />
                          </div>
                        ) : (
                          <div className="mt-3 pt-2 border-t border-green-100 text-[10px] text-green-600 font-bold flex items-center justify-center gap-1">
                            <BadgeCheck className="w-3 h-3" />
                            <span>最大割引適用中！お得に登録できます</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div className="text-sm text-gray-600 space-y-2">
                          <p className="flex items-center gap-2">
                            <Check
                              className={cn(
                                "w-4 h-4",
                                watchedTitle ? "text-green-500" : "text-gray-300",
                              )}
                            />
                            タイトル入力
                          </p>
                          {/* Add other validations here if needed */}
                        </div>

                        <Button
                          type="submit"
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 shadow-lg shadow-blue-200"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "登録中..." : "この内容で登録する"}
                        </Button>
                        <p className="text-[10px] text-gray-400 text-center">
                          登録内容は後から編集できます
                        </p>
                      </div>
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
