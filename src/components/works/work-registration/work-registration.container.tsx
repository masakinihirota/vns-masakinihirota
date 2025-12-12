"use client";

import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  WorkFormValues,
  generateDummyWork,
  initialFormValues,
  workSchema,
} from "./work-registration.logic";
import { WorkRegistration } from "./work-registration";
import { useState } from "react";
// import { toast } from "sonner";

// Using console/alert fallback if toast is missing, but Assuming toast might be available or I'll just use window.alert for "Dummy" phase.
// Actually, looking at components/ui, I didn't see 'sonner' or 'toast'. I'll stick to a simple alert for now to avoid dependency issues.

export function WorkRegistrationContainer() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<WorkFormValues>({
    resolver: zodResolver(workSchema) as Resolver<WorkFormValues>,
    defaultValues: initialFormValues,
  });

  const handleSubmit = async (values: WorkFormValues) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Form Submitted:", values);
    alert(`登録完了 (ダミー)\nタイトル: ${values.title}\nステータス: ${values.status}`);
    setIsSubmitting(false);
  };

  const handleFillDummyData = () => {
    const dummy = generateDummyWork();
    form.reset({
      title: dummy.title,
      description: dummy.description || "",
      itemTime: dummy.itemTime || "",
      status: dummy.status,
      // images, tags are arrays, might need handling if UI inputs existed
    });
  };

  return (
    <WorkRegistration
      form={form}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      onFillDummyData={handleFillDummyData}
    />
  );
}
