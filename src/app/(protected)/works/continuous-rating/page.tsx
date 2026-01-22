import { Metadata } from "next";
import React from "react";
import { WorkContinuousRatingContainer } from "@/components/work-continuous-rating";

export const metadata: Metadata = {
  title: "作品連続評価 | Anti Design",
  description: "アニメや漫画を連続して効率的に評価できるページです。",
};

export default function ContinuousRatingPage() {
  return <WorkContinuousRatingContainer />;
}
