import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  CATEGORIES,
  SUB_CATEGORIES,
  TIER_NAMES,
} from "./work-registration-form.logic";

interface WorkRegistrationFormViewProps {
  category: string;
  subCategory: string[];
  tier: number;
  tags: string[];
  newTag: string;
  isAdmin: boolean;
  onCategoryChange: (value: string) => void;
  onSubCategoryChange: (subCat: string, checked: boolean) => void;
  onTierChange: (value: number) => void;
  onTagsChange: (tags: string[]) => void;
  onNewTagChange: (value: string) => void;
  onAddTag: () => void;
  onSubmit: (event: React.FormEvent) => void;
}

export const WorkRegistrationFormView = ({
  category,
  subCategory,
  tier,
  tags,
  newTag,
  isAdmin,
  onCategoryChange,
  onSubCategoryChange,
  onTierChange,
  onTagsChange: _onTagsChange, // Currently unused in view logic but passed if needed for deletions
  onNewTagChange,
  onAddTag,
  onSubmit,
}: WorkRegistrationFormViewProps) => {
  return (
    <form
      onSubmit={onSubmit}
      className="space-y-6 max-w-2xl mx-auto p-6 bg-background rounded-lg shadow-md"
    >
      <h1 className="text-2xl font-bold mb-6">作品登録</h1>

      <div>
        <Label htmlFor="category">カテゴリ</Label>
        <div>
          <Label htmlFor="category">カテゴリ</Label>
          <Select value={category} onValueChange={onCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="カテゴリを選択" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {category && (
        <div>
          <Label>サブカテゴリ</Label>
          <div className="grid grid-cols-2 gap-2">
            {SUB_CATEGORIES[category]?.map((subCat: string) => (
              <div key={subCat} className="flex items-center space-x-2">
                <Checkbox
                  id={subCat}
                  checked={subCategory.includes(subCat)}
                  onCheckedChange={(checked) =>
                    onSubCategoryChange(subCat, checked === true)
                  }
                />
                <Label htmlFor={subCat}>{subCat}</Label>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <Label htmlFor="title">作品名</Label>
        <Input id="title" required />
      </div>

      <div>
        <Label htmlFor="tier">評価</Label>
        <Select
          value={tier.toString()}
          onValueChange={(value) => onTierChange(Number(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="評価を選択" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(TIER_NAMES).map(([key, value]) => (
              <SelectItem key={key} value={key}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="author">作家名</Label>
        <Input id="author" />
      </div>

      <div>
        <Label htmlFor="releaseYear">初出年</Label>
        <Input id="releaseYear" type="number" />
      </div>

      <div>
        <Label>作品の規模</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="作品の規模を選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">小 (短時間で読み、見終わる)</SelectItem>
            <SelectItem value="medium">中 (何時間もかかる)</SelectItem>
            <SelectItem value="large">大 (何日もかかる)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>適正年齢幅</Label>
        <div className="flex space-x-4">
          <Slider
            defaultValue={[0, 100]}
            max={100}
            step={1}
            className="w-[60%]"
          />
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">
              最小年齢: <span className="text-muted-foreground">0歳</span>
            </p>
            <p className="text-sm font-medium leading-none">
              最大年齢: <span className="text-muted-foreground">100歳以上</span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="completed" />
        <Label htmlFor="completed">完結</Label>
      </div>

      <div>
        <Label htmlFor="country">発売国</Label>
        <Input id="country" />
      </div>

      <div>
        <Label htmlFor="language">言語</Label>
        <Input id="language" />
      </div>

      <div>
        <Label htmlFor="officialSite">公式サイトURL</Label>
        <Input id="officialSite" type="url" />
      </div>

      <div>
        <Label htmlFor="description">作品紹介</Label>
        <Textarea id="description" />
      </div>

      <div>
        <Label htmlFor="searchUrl">作品検索URL</Label>
        <Input id="searchUrl" type="url" />
      </div>

      <div>
        <Label htmlFor="affiliateUrl">アフィリエイトURL</Label>
        <Input id="affiliateUrl" type="url" />
      </div>

      <div>
        <Label>タグ</Label>
        <div className="flex space-x-2">
          <Input
            value={newTag}
            onChange={(e) => onNewTagChange(e.target.value)}
            placeholder="新しいタグを入力"
          />
          <Button type="button" onClick={onAddTag}>
            追加
          </Button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {isAdmin && (
        <div className="flex items-center space-x-2">
          <Checkbox id="adminCheck" />
          <Label htmlFor="adminCheck">管理人チェック</Label>
        </div>
      )}

      <Button type="submit" className="w-full">
        登録
      </Button>
    </form>
  );
};
