"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type DeferredSectionProperties = {
    children: ReactNode;
    placeholderClassName?: string;
    rootMargin?: string;
};

export function DeferredSection({
    children,
    placeholderClassName = "h-80 rounded-2xl bg-slate-100/60 dark:bg-white/5",
    rootMargin = "200px",
}: DeferredSectionProperties) {
    const reference = useRef<HTMLDivElement | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isVisible) {
            return;
        }

        if (typeof IntersectionObserver === "undefined") {
            setIsVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (entry?.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin }
        );

        if (reference.current) {
            observer.observe(reference.current);
        }

        return () => observer.disconnect();
    }, [isVisible, rootMargin]);

    return (
        <div ref={reference}>
            {isVisible ? children : <div aria-hidden="true" className={placeholderClassName} />}
        </div>
    );
}
