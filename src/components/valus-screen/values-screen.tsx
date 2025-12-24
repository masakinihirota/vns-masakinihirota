"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface ValueCategory {
  id: string;
  name: string;
  description?: string;
  isEnabled: boolean;
  isExpanded?: boolean;
  children?: ValueCategory[];
}

export default function ValuesScreen() {
  const [categories, setCategories] = useState<ValueCategory[]>([
    {
      id: "basic",
      name: "基本",
      description: "基本的な価値観",
      isEnabled: true,
      isExpanded: true,
      children: [
        {
          id: "basic-lifestyle",
          name: "生活スタイル",
          isEnabled: true,
          isExpanded: false,
          children: [
            { id: "basic-lifestyle-work", name: "仕事観", isEnabled: true },
            { id: "basic-lifestyle-family", name: "家族観", isEnabled: true },
            { id: "basic-lifestyle-money", name: "金銭観", isEnabled: true },
          ],
        },
        {
          id: "basic-relationships",
          name: "人間関係",
          isEnabled: true,
          isExpanded: false,
          children: [
            {
              id: "basic-relationships-friendship",
              name: "友人関係",
              isEnabled: true,
            },
            {
              id: "basic-relationships-communication",
              name: "コミュニケーション",
              isEnabled: true,
            },
          ],
        },
      ],
    },
    {
      id: "politics",
      name: "政治",
      description: "政治的な価値観",
      isEnabled: false,
      isExpanded: false,
      children: [
        {
          id: "politics-news",
          name: "ニュース",
          isEnabled: false,
          isExpanded: false,
          children: [
            {
              id: "politics-news-2024",
              name: "2024年",
              isEnabled: false,
              isExpanded: false,
              children: [
                {
                  id: "politics-news-2024-hyogo",
                  name: "兵庫県知事問題",
                  isEnabled: false,
                },
              ],
            },
          ],
        },
        {
          id: "politics-economy",
          name: "経済政策",
          isEnabled: false,
          isExpanded: false,
          children: [
            { id: "politics-economy-tax", name: "税制", isEnabled: false },
            {
              id: "politics-economy-welfare",
              name: "社会保障",
              isEnabled: false,
            },
          ],
        },
      ],
    },
    {
      id: "entertainment",
      name: "エンターテイメント",
      description: "娯楽・趣味に関する価値観",
      isEnabled: false,
      isExpanded: false,
      children: [
        {
          id: "entertainment-anime",
          name: "アニメ",
          isEnabled: false,
          isExpanded: false,
          children: [
            {
              id: "entertainment-anime-genre",
              name: "ジャンル好み",
              isEnabled: false,
            },
            {
              id: "entertainment-anime-era",
              name: "年代好み",
              isEnabled: false,
            },
          ],
        },
        {
          id: "entertainment-games",
          name: "ゲーム",
          isEnabled: false,
          isExpanded: false,
          children: [
            {
              id: "entertainment-games-type",
              name: "ゲームタイプ",
              isEnabled: false,
            },
            {
              id: "entertainment-games-platform",
              name: "プラットフォーム",
              isEnabled: false,
            },
          ],
        },
      ],
    },
    {
      id: "work",
      name: "仕事・キャリア",
      description: "職業観・キャリアに関する価値観",
      isEnabled: false,
      isExpanded: false,
      children: [
        {
          id: "work-style",
          name: "働き方",
          isEnabled: false,
          isExpanded: false,
          children: [
            {
              id: "work-style-remote",
              name: "リモートワーク",
              isEnabled: false,
            },
            {
              id: "work-style-balance",
              name: "ワークライフバランス",
              isEnabled: false,
            },
          ],
        },
        {
          id: "work-skills",
          name: "スキル・専門性",
          isEnabled: false,
          isExpanded: false,
          children: [
            { id: "work-skills-tech", name: "技術スキル", isEnabled: false },
            {
              id: "work-skills-management",
              name: "マネジメント",
              isEnabled: false,
            },
          ],
        },
      ],
    },
  ]);

  const toggleCategory = (categoryId: string, newState: boolean) => {
    const updateCategory = (cats: ValueCategory[]): ValueCategory[] => {
      return cats.map((cat) => {
        if (cat.id === categoryId) {
          // 選択されたカテゴリとその子要素すべてを更新
          const updateChildren = (children?: ValueCategory[]): ValueCategory[] | undefined => {
            if (!children) return undefined;
            return children.map((child) => ({
              ...child,
              isEnabled: newState,
              children: updateChildren(child.children),
            }));
          };

          return {
            ...cat,
            isEnabled: newState,
            children: updateChildren(cat.children),
          };
        }

        if (cat.children) {
          return {
            ...cat,
            children: updateCategory(cat.children),
          };
        }

        return cat;
      });
    };

    setCategories(updateCategory(categories));
  };

  const toggleExpanded = (categoryId: string) => {
    const updateCategory = (cats: ValueCategory[]): ValueCategory[] => {
      return cats.map((cat) => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            isExpanded: !cat.isExpanded,
          };
        }

        if (cat.children) {
          return {
            ...cat,
            children: updateCategory(cat.children),
          };
        }

        return cat;
      });
    };

    setCategories(updateCategory(categories));
  };

  const renderCategory = (category: ValueCategory, level = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const paddingLeft = level * 24;

    return (
      <div key={category.id} className="space-y-2">
        <div
          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
          style={{ paddingLeft: `${paddingLeft}px` }}
        >
          {hasChildren && (
            <button
              type="button"
              onClick={() => toggleExpanded(category.id)}
              className="p-1 hover:bg-muted rounded"
            >
              {category.isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          )}

          {!hasChildren && <div className="w-6" />}

          <div className="flex items-center space-x-2 flex-1">
            <Switch
              id={category.id}
              checked={category.isEnabled}
              onCheckedChange={(checked) => toggleCategory(category.id, checked)}
            />
            <Label
              htmlFor={category.id}
              className={`cursor-pointer flex-1 ${category.isEnabled ? "font-medium" : "text-muted-foreground"}`}
            >
              {category.name}
            </Label>
          </div>

          {category.description && (
            <span className="text-xs text-muted-foreground hidden sm:inline">
              {category.description}
            </span>
          )}
        </div>

        {hasChildren && category.isExpanded && (
          <div className="space-y-1">
            {category.children!.map((child) => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const getEnabledCount = (cats: ValueCategory[]): number => {
    return cats.reduce((count, cat) => {
      let currentCount = cat.isEnabled ? 1 : 0;
      if (cat.children) {
        currentCount += getEnabledCount(cat.children);
      }
      return count + currentCount;
    }, 0);
  };

  const enabledCount = getEnabledCount(categories);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">価値観の設定</h1>
          <p className="text-muted-foreground">
            カテゴリをオンにすると、そのカテゴリの価値観の質問が答えられるようになります
          </p>
          <div className="text-sm text-muted-foreground">
            現在有効: <span className="font-semibold text-primary">{enabledCount}</span> カテゴリ
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              価値観カテゴリ
              <div className="text-sm font-normal text-muted-foreground">
                上位カテゴリをオンにすると下位も自動的にオンになります
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {categories.map((category) => renderCategory(category))}
          </CardContent>
        </Card>

        <div className="flex justify-center space-x-4">
          <Button variant="outline">キャンセル</Button>
          <Button>設定を保存</Button>
        </div>

        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground space-y-2">
              <h3 className="font-semibold text-foreground">ヒント:</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>「基本」カテゴリは最初からオンになっています</li>
                <li>
                  上位カテゴリをオンにすると、その下のすべてのカテゴリも自動的にオンになります
                </li>
                <li>個別にオフにしたい場合は、該当するカテゴリを直接オフにしてください</li>
                <li>マッチング時は、オンになっているカテゴリの価値観が比較対象になります</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
