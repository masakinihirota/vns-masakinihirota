"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { createClient } from "@/lib/supabase/client";
import { registrationFormSchema, type RegistrationFormValues } from "./schema";

export function useWorkRegistration() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      work: {
        isNew: true,
        isAiGenerated: false,
        isPurchasable: true,
      },
      entry: {
        status: "expecting",
      },
    },
  });

  const onSubmit = async (values: RegistrationFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("ユーザーが認証されていません。");
      }

      // 2. Insert Work
      // Note: tags is a comma-separated string in the form, needs to be converted to array
      const tagsArray = values.work.tags
        ? values.work.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [];

      const { data: workData, error: workError } = await supabase
        .from("works")
        .insert({
          title: values.work.title,
          author: values.work.author,
          publisher: values.work.publisher,
          category: values.work.category,
          scale: values.work.scale,
          description: values.work.summary,
          release_year: values.work.releaseYear,
          is_purchasable: values.work.isPurchasable,
          official_url: values.work.officialUrl || null,
          affiliate_url: values.work.affiliateUrl || null,
          tags: tagsArray,
          owner_user_id: user.id, // Set owner to current user
          status: "published", // Default status for new work
        })
        .select()
        .single();

      if (workError) {
        throw new Error(`作品の登録に失敗しました: ${workError.message}`);
      }

      // 3. Insert User Entry
      const { error: entryError } = await supabase
        .from("user_work_entries")
        .insert({
          user_id: user.id,
          work_id: workData.id,
          status: values.entry.status,
          tier: values.entry.tier,
          memo: values.entry.memo,
        });

      if (entryError) {
        // If entry fails, we might want to delete the work or warn the user.
        // For now, just throw error.
        throw new Error(
          `ユーザーステータスの登録に失敗しました: ${entryError.message}`
        );
      }

      // Success
      router.push("/works"); // Redirect to works list (to be implemented)
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "予期せぬエラーが発生しました");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading,
    error,
  };
}
