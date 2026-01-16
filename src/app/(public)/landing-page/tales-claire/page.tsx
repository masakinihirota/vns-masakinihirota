import { Metadata } from "next";
import React from "react";
import { TalesClaireLP } from "../../../../components/landing-page/tales-claire";

export const metadata: Metadata = {
  title: "VNS masakinihirota - Tales Claire Edition",
  description:
    "昨日僕が感動した作品を、今日の君はまだ知らない。価値観でつながるネットワークサービス。",
};

export default function TalesClairePage() {
  return <TalesClaireLP />;
}
