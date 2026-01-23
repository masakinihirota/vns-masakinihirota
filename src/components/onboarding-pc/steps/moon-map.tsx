"use strict";
import Image from "next/image";
import React from "react";
import { cn } from "@/lib/utils";

interface MoonMapProps {
  selectedLocation: string | undefined;
  onSelect: (location: string) => void;
  className?: string;
}

export const MoonMap: React.FC<MoonMapProps> = ({
  selectedLocation: _selectedLocation,
  onSelect: _onSelect,
  className,
}) => {
  return (
    <div
      className={cn(
        "relative w-full aspect-square max-w-[400px] mx-auto",
        className
      )}
    >
      <div className="relative w-full pb-[100%]">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/star/moon.svg"
            alt="Moon Map"
            fill
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
};
