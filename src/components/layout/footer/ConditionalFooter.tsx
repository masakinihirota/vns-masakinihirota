"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";

const HIDDEN_FOOTER_PATHS = new Set<string>(["/tutorial/story", "/ghost"]);

export const ConditionalFooter = () => {
    const pathname = usePathname();

    if (pathname && HIDDEN_FOOTER_PATHS.has(pathname)) {
        return null;
    }

    return <Footer />;
};
