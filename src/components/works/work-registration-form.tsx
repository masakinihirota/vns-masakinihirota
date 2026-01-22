"use client";

import { useActionState } from "react";
import { useEffect } from "react";
import { toast } from "sonner";
import {
  registerWork,
  WorkRegistrationState,
} from "@/app/(protected)/works/actions";
import { Button } from "@/components/ui/button"; // Assuming shadcn
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Assuming shadcn

const initialState: WorkRegistrationState = { message: "", errors: {} };

export function WorkRegistrationForm() {
  const [state, formAction, isPending] = useActionState(
    registerWork,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      // Optional: reset form or redirect
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>作品を登録する</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">タイトル (必須)</Label>
            <Input
              id="title"
              name="title"
              placeholder="作品名を入力"
              required
            />
            {state.errors?.title && (
              <p className="text-red-500 text-sm">{state.errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">作者 / 監督</Label>
            <Input id="author" name="author" placeholder="作者名を入力" />
            {state.errors?.author && (
              <p className="text-red-500 text-sm">{state.errors.author}</p>
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
            {state.errors?.category && (
              <p className="text-red-500 text-sm">{state.errors.category}</p>
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
