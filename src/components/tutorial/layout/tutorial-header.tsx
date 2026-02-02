"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface TutorialHeaderProps {
    title: string;
    parentHref?: string;
    parentLabel?: string;
}

export const TutorialHeader = ({
    title,
    parentHref = "/tutorial",
    parentLabel = "チュートリアル",
}: TutorialHeaderProps) => {
    return (
        <div className="mb-6 flex items-center text-sm text-muted-foreground">
            <Link href={parentHref} className="hover:text-primary transition-colors">
                {parentLabel}
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="font-semibold text-foreground">{title}</span>
        </div>
    );
};
