"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function MainContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { setOpen } = useSidebar();
  const isMapPage = pathname === "/ghost";

  useEffect(() => {
    if (isMapPage) {
      setOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMapPage]);

  return (
    <main className={cn("flex-1", isMapPage ? "p-0" : "p-6")}>{children}</main>
  );
}
