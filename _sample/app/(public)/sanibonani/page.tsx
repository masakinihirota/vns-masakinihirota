import type { Metadata } from "next";

import * as Sanibonani from "@/components/sanibonani";


export const metadata: Metadata = {
  title: "サニボナニ（Sanibonani）| VNS masakinihirota",
  description:
    "会話の本質と人間性を説く挨拶「サニボナニ」についてのメッセージを表示します。",
};

/**
 *
 */
export default function SanibonaniPage() {
  return <Sanibonani.Sanibonani />;
}
