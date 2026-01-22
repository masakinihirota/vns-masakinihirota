import {
  X,
  Smile,
  Tag,
  BadgeCheck,
  Users,
  Search,
  LayoutGrid,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import React, { useState, useMemo } from "react";
import { Control, ControllerRenderProps } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  WorkFormValues,
  OFFICIAL_TAGS,
  USER_TAGS,
} from "../work-registration.logic";

interface TagSelectorProps {
  control: Control<WorkFormValues>;
}

export const TagSelector: React.FC<TagSelectorProps> = ({ control }) => {
  const [isOfficialExpanded, setIsOfficialExpanded] = useState(false);
  const [isUserExpanded, setIsUserExpanded] = useState(false);
  const [officialSearchQuery, setOfficialSearchQuery] = useState("");
  const [userSearchQuery, setUserSearchQuery] = useState("");

  const popularOfficialTags = OFFICIAL_TAGS.slice(0, 6);
  const popularUserTags = USER_TAGS.slice(0, 8);

  const filteredOfficialTags = useMemo(() => {
    if (!officialSearchQuery) return OFFICIAL_TAGS;
    return OFFICIAL_TAGS.filter((tag) =>
      tag.toLowerCase().includes(officialSearchQuery.toLowerCase())
    );
  }, [officialSearchQuery]);

  const filteredUserTags = useMemo(() => {
    if (!userSearchQuery) return USER_TAGS;
    return USER_TAGS.filter((tag) =>
      tag.toLowerCase().includes(userSearchQuery.toLowerCase())
    );
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

  const toggleTag = (
    tagToToggle: string,
    currentTags: string[],
    onChange: (tags: string[]) => void
  ) => {
    if (currentTags.includes(tagToToggle)) {
      onChange(currentTags.filter((t) => t !== tagToToggle));
    } else {
      onChange([...currentTags, tagToToggle]);
    }
  };

  const addCustomTag = (
    currentTags: string[],
    onChange: (tags: string[]) => void
  ) => {
    const newTag = userSearchQuery.trim();
    if (!newTag) return;
    if (!currentTags.includes(newTag)) {
      onChange([...currentTags, newTag]);
    }
    setUserSearchQuery("");
  };

  return (
    <FormField
      control={control}
      name="tags"
      render={({
        field,
      }: {
        field: ControllerRenderProps<WorkFormValues, "tags">;
      }) => (
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
                    <Smile className="w-4 h-4" />{" "}
                    選択されたタグはここに表示されます
                  </span>
                )}
                {field.value.map((tag: string, idx: number) => {
                  const isOfficial = OFFICIAL_TAGS.includes(tag);
                  return (
                    <span
                      key={idx}
                      className={cn(
                        "inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium animate-in fade-in zoom-in duration-200",
                        isOfficial
                          ? "bg-blue-100 text-blue-700"
                          : "bg-emerald-100 text-emerald-700"
                      )}
                    >
                      {isOfficial && <BadgeCheck className="w-3 h-3" />}
                      {!isOfficial && <Users className="w-3 h-3" />}
                      {tag}
                      <button
                        type="button"
                        onClick={() =>
                          toggleTag(tag, field.value, field.onChange)
                        }
                        className={cn(
                          "rounded-full p-0.5 transition-colors",
                          isOfficial
                            ? "hover:bg-blue-200 hover:text-blue-900"
                            : "hover:bg-emerald-200 hover:text-emerald-900"
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
                            getTagStyle(tag, isSelected)
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
                                getTagStyle(tag, isSelected)
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
                    isOfficialExpanded && "bg-blue-50"
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
                            getTagStyle(tag, isSelected)
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
                        onClick={() =>
                          addCustomTag(field.value, field.onChange)
                        }
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
                                getTagStyle(tag, isSelected)
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
                    isUserExpanded && "bg-emerald-50"
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
  );
};
