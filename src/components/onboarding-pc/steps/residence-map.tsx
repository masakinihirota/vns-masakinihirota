"use strict";
import Image from "next/image";
import React from "react";
import { cn } from "@/lib/utils";

interface ResidenceMapProps {
  selectedAreaId: number | null | undefined;
  onSelect: (areaId: number) => void;
  className?: string;
}

export const ResidenceMap: React.FC<ResidenceMapProps> = ({
  selectedAreaId,
  onSelect,
  className,
}) => {
  const areas = [
    {
      id: 1,
      name: "Americas",
      src: "/world/area1.svg",
      label: "Area 1 (Americas)",
    },
    { id: 2, name: "EMEA", src: "/world/area2.svg", label: "Area 2 (EMEA)" },
    { id: 3, name: "APAC", src: "/world/area3.svg", label: "Area 3 (APAC)" },
  ];

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-[1000px] mx-auto",
        className
      )}
    >
      {areas.map((area) => {
        const isSelected = selectedAreaId === area.id;
        return (
          <button
            key={area.id}
            onClick={() => onSelect(area.id)}
            className={cn(
              "relative group transition-all duration-300 ease-in-out transform rounded-xl overflow-hidden bg-white dark:bg-slate-800",
              // Unselected: No border, pushed back slightly
              !isSelected &&
                "hover:-translate-y-1 hover:shadow-lg opacity-80 hover:opacity-100",
              // Selected: Prominent Border, Shadow, Scale
              isSelected &&
                "ring-4 ring-indigo-500 ring-offset-4 dark:ring-offset-slate-900 shadow-2xl scale-[1.02] z-10 opacity-100"
            )}
            aria-label={`Select ${area.label}`}
            aria-pressed={isSelected}
            type="button"
          >
            {/* Selected Badge */}
            {isSelected && (
              <div className="absolute top-2 right-2 z-20 bg-indigo-600 text-white rounded-full p-1 shadow-lg animate-in fade-in zoom-in duration-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}

            <div className="relative w-full aspect-[3/4]">
              <Image
                src={area.src}
                alt={area.label}
                fill
                className={cn(
                  "object-cover transition-all duration-300",
                  isSelected
                    ? "brightness-110"
                    : "grayscale-[0.5] group-hover:grayscale-0"
                )}
              />
            </div>
            <div
              className={cn(
                "absolute bottom-0 left-0 right-0 py-3 text-center text-sm font-bold transition-colors",
                isSelected
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-50/90 dark:bg-slate-900/90 text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white backdrop-blur-sm"
              )}
            >
              {area.label}
            </div>
          </button>
        );
      })}
    </div>
  );
};
