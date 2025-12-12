"use client";

import { useForm, useWatch, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  WorkFormValues,
  dummyFormValues,
  initialFormValues,
  workSchema,
  BASE_POINTS,
  DISCOUNT_TAGS,
  DISCOUNT_URL,
} from "./work-registration.logic";
import { WorkRegistration } from "./work-registration";
import { useState, useMemo } from "react";

export function WorkRegistrationContainer() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<WorkFormValues>({
    resolver: zodResolver(workSchema) as Resolver<WorkFormValues>,
    defaultValues: initialFormValues,
  });

  const watchedTags = useWatch({ control: form.control, name: "tags" });
  const watchedUrls = useWatch({ control: form.control, name: "urls" });

  const requiredPoints = useMemo(() => {
    let points = BASE_POINTS;
    // watchedTags might be undefined initially or if fields are unregistered
    if (watchedTags && watchedTags.length > 0) points -= DISCOUNT_TAGS;
    // watchedUrls might be undefined
    if (watchedUrls && watchedUrls.some((u) => u.value?.trim() !== "")) points -= DISCOUNT_URL;
    return Math.max(0, points);
  }, [watchedTags, watchedUrls]);

  const handleSubmit = async (values: WorkFormValues) => {
    setIsSubmitting(true);
    // Simulate API call
    const submissionData = {
      ...values,
      pointsSpent: requiredPoints,
    };

    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Form Submitted:", submissionData);
    alert(`登録完了！\n消費ポイント: ${requiredPoints}pt\n${JSON.stringify(submissionData, null, 2)}`);
    setIsSubmitting(false);
  };

  const handleFillDummyData = () => {
    form.reset(dummyFormValues);
  };

  return (
    <WorkRegistration
      form={form}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      onFillDummyData={handleFillDummyData}
      requiredPoints={requiredPoints}
    />
  );
}
