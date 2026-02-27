import type { Metadata } from "next";

import * as LegendarySpeech from "@/components/legendary-speech";


export const metadata: Metadata = {
  title: "伝説のスピーチ | VNS masakinihirota",
  description: "VNSの思想の根幹にあるメッセージを表示します。",
};

/**
 *
 */
export default function LegendarySpeechPage() {
  return <LegendarySpeech.LegendarySpeech />;
}
