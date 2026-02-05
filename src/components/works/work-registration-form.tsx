"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type WorkRegistrationErrors = {
  title?: string[];
  author?: string[];
  category?: string[];
  description?: string[];
};

export function WorkRegistrationForm() {
  const [isPending, setIsPending] = useState(false);
  const [errors, setErrors] = useState<WorkRegistrationErrors>({});
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title"),
      author: formData.get("author"),
      category: formData.get("category"),
      description: formData.get("description"), // Assuming input exists or ignored
    };

    try {
      const response = await fetch("/api/works", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.errors) {
          setErrors(result.errors);
          toast.error("入力内容に誤りがあります");
        } else {
          toast.error(result.message || "登録に失敗しました");
        }
      } else {
        toast.success(result.message);
        router.refresh();
        // Optional: Reset form
        (e.target as HTMLFormElement).reset();
      }
    } catch (error) {
      console.error(error);
      toast.error("予期せぬエラーが発生しました");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>作品を登録する</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">タイトル (必須)</Label>
            <Input
              id="title"
              name="title"
              placeholder="作品名を入力"
              required
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">作者 / 監督</Label>
            <Input id="author" name="author" placeholder="作者名を入力" />
            {errors.author && (
              <p className="text-red-500 text-sm">{errors.author[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">カテゴリ</Label>
            <Select name="category" defaultValue="manga">
              <SelectTrigger>
                <SelectValue placeholder="カテゴリを選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manga">漫画</SelectItem>
                <SelectItem value="anime">アニメ</SelectItem>
                <SelectItem value="other">その他</SelectItem>
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category[0]}</p>
            )}
          </div>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "登録中..." : "登録する"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
