import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { registrationFormSchema, RegistrationFormValues } from "../schema";

export function useWorkRegistration(
  initialValues?: Partial<RegistrationFormValues>
) {
  const defaultWork = {
    title: "",
    author: "",
    category: "manga" as const,
    isNew: true,
    isAiGenerated: false,
    ...initialValues?.work,
  };

  const defaultEntry = {
    status: "expecting",
    tier: undefined,
    memo: "",
    ...initialValues?.entry,
  };

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      work: defaultWork,
      entry: defaultEntry,
    },
  });

  // 初期値が変更されたらフォームをリセット
  useEffect(() => {
    if (initialValues) {
      form.reset({
        work: {
          title: "",
          author: "",
          category: "manga",
          isNew: true,
          isAiGenerated: false,
          ...initialValues.work,
        },
        entry: {
          status: "expecting",
          tier: undefined,
          memo: "",
          ...initialValues.entry,
        },
      });
    }
  }, [initialValues, form]);

  const onSubmit = useCallback(async (_data: RegistrationFormValues) => {
    try {
      // console.log("Submitting:", _data);
      // API call to save data
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("保存しました！");
    } catch (_error) {
      // console.error("Save failed:", _error);
      alert("保存に失敗しました");
    }
  }, []);

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
