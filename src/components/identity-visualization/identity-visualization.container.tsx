"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { IdentityVisualization } from "./identity-visualization.presentation";
import {
    IDENTITY_CONFIG,
    calculateBezierPath,
    getProfileById,
    type ProfileId,
} from "./identity-visualization.logic";

export function IdentityVisualizationContainer() {
    const [activeProfile, setActiveProfile] = useState<ProfileId>("ghost");
    const [linePath, setLinePath] = useState<string>("");

    const accountReference = useRef<HTMLDivElement | null>(null);
    const profileReferences = useRef<Record<string, HTMLButtonElement | null>>({});

    const updateLinePath = useCallback(() => {
        const startElement = accountReference.current;
        const endElement = profileReferences.current[activeProfile];

        if (startElement && endElement) {
            const startRect = startElement.getBoundingClientRect();
            const endRect = endElement.getBoundingClientRect();

            const containerElement = startElement.closest(".viz-container");
            if (!containerElement) return;

            const containerRect = containerElement.getBoundingClientRect();

            const x1 = startRect.right - containerRect.left;
            const y1 = startRect.top + startRect.height / 2 - containerRect.top;
            const x2 = endRect.left - containerRect.left;
            const y2 = endRect.top + endRect.height / 2 - containerRect.top;

            const path = calculateBezierPath(x1, y1, x2, y2);
            setLinePath(path);
        }
    }, [activeProfile]);

    useEffect(() => {
        updateLinePath();
        window.addEventListener("resize", updateLinePath);
        return () => window.removeEventListener("resize", updateLinePath);
    }, [updateLinePath]);

    const handleProfileSelect = (id: ProfileId) => {
        setActiveProfile(id);
    };

    const handleCreateMask = () => {
        // 将来拡張用のフックポイント
    };

    const currentProfile = getProfileById(activeProfile);

    return (
        <IdentityVisualization
            activeProfile={activeProfile}
            currentProfile={currentProfile}
            account={IDENTITY_CONFIG.account}
            masks={IDENTITY_CONFIG.masks}
            linePath={linePath}
            accountRef={accountReference}
            profileRefs={profileReferences}
            onProfileSelect={handleProfileSelect}
            onCreateMask={handleCreateMask}
        />
    );
}
