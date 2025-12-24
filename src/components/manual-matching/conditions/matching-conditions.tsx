import { Sliders, Save, Play, MapPin, Gauge } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { MatchingSettings, VALUE_OPTIONS, GENRE_OPTIONS } from "./matching-conditions.logic";

interface MatchingConditionsProps {
  settings: MatchingSettings;
  isSaving: boolean;
  isStarting: boolean;
  onValueImportanceChange: (id: string, value: number) => void;
  onGenreToggle: (genreId: string) => void;
  onLocationChange: (loc: string) => void;
  onSave: () => void;
  onStartMatching: () => void;
}

export const MatchingConditions: React.FC<MatchingConditionsProps> = (props) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-3">
            <Sliders className="w-8 h-8 text-indigo-600" />
            マッチング条件設定
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            AIマッチングエンジンのパラメータを微調整し、あなたに最適なパートナーを見つけます。
          </p>
        </header>

        {/* 1. Value Importance (Sliders) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="w-5 h-5 text-indigo-500" />
              価値観の重み付け
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {VALUE_OPTIONS.map((option) => (
              <div key={option.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor={`slider-${option.id}`}>{option.label}</Label>
                  <span className="text-sm font-medium text-slate-500">
                    {props.settings.valueImportance[option.id]}%
                  </span>
                </div>
                <input
                  id={`slider-${option.id}`}
                  type="range"
                  min="0"
                  max="100"
                  step="10"
                  value={props.settings.valueImportance[option.id]}
                  onChange={(e) =>
                    props.onValueImportanceChange(option.id, parseInt(e.target.value))
                  }
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 2. Genre Filter (Checkboxes) */}
        <Card>
          <CardHeader>
            <CardTitle>優先ジャンル</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {GENRE_OPTIONS.map((genre) => (
                <div key={genre.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`genre-${genre.id}`}
                    checked={props.settings.selectedGenres.includes(genre.id)}
                    onCheckedChange={() => props.onGenreToggle(genre.id)}
                  />
                  <Label htmlFor={`genre-${genre.id}`}>{genre.label}</Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 3. Location (Select) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-indigo-500" />
              地域設定
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={props.settings.locationPreference}
              onValueChange={props.onLocationChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="地域を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全国</SelectItem>
                <SelectItem value="kanto">関東</SelectItem>
                <SelectItem value="kansai">関西</SelectItem>
                <SelectItem value="remote">リモート可・問わない</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Action Footer */}
        <div className="sticky bottom-6 flex justify-end gap-4 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg">
          <Button variant="outline" onClick={props.onSave} disabled={props.isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {props.isSaving ? "保存中..." : "設定を保存"}
          </Button>
          <Button
            onClick={props.onStartMatching}
            disabled={props.isStarting}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Play className="w-4 h-4 mr-2" />
            {props.isStarting ? "開始中..." : "マッチングを開始"}
          </Button>
        </div>
      </div>
    </div>
  );
};
