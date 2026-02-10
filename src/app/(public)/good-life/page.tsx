import * as GoodLifeComponent from "@/components/good-life";

export const metadata = {
  title: "良い人生を送るための最も重要な美徳 | VNS masakinihirota",
  description: "愛のリスクと「弱さ」の哲学について語ります。",
};

export const dynamic = "force-static";

export default function GoodLifePage() {
  return <GoodLifeComponent.GoodLife />;
}
