import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Root Account (New) | VNS masakinihirota",
  description: "Manage your root account status and points.",
};

export default function RootAccountNewLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
