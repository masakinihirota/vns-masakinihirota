import * as Sanibonani from "@/components/sanibonani";

export const metadata = {
  title: "サニボナニ（Sanibonani）| VNS masakinihirota",
  description:
    "会話の本質と人間性を説く挨拶「サニボナニ」についてのメッセージを表示します。",
};

export const dynamic = "force-static";

export default function SanibonaniPage() {
  return <Sanibonani.Sanibonani />;
}
