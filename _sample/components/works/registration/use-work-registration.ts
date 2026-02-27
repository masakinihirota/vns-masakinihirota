/* eslint-disable no-console */

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { createWorkWithEntryAction } from "@/app/actions/works";
import { useSession } from "@/lib/auth-client";

import { registrationFormSchema, type RegistrationFormValues } from "./schema";

/**
 *
 */
export function useWorkRegistration() {
  const router = useRouter();
  const session: any = (useSession as any)();
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

    // eslint-disable-next-line no-restricted-syntax
    try {
      // 1. セッションからユーザーを取得
      if (!session?.user) {
        throw new Error("ユーザーが認証されていません。");
      }

      // 2. Call Server Action
      // Note: tags is a comma-separated string in the form, needs to be converted to array
      const tagsArray = values.work.tags
        ? values.work.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
        : [];

      await createWorkWithEntryAction(
        {
          title: values.work.title,
          author: values.work.author,
          category: values.work.category,
          scale: values.work.scale,
          description: values.work.summary,
          releaseYear: values.work.releaseYear,
          isPurchasable: values.work.isPurchasable,

          externalUrl: values.work.officialUrl || null,
          affiliateUrl: values.work.affiliateUrl || null,
          tags: tagsArray,
          ownerUserId: session.user.id, // オーナーを現在のユーザーに設定
          status: "published", // Default status for new work
        },
        {
          status: values.entry.status,
          tier: values.entry.tier,
          memo: values.entry.memo,
        }
      );

      // Success
      router.push("/works");
      router.refresh();
    } catch (error_) {
      setError(error_ instanceof Error ? error_.message : "予期せぬエラーが発生しました");
      console.error(error_);
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
