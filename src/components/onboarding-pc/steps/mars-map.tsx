"use strict";
import Image from "next/image";
import React from "react";
import { cn } from "@/lib/utils";
import { MARS_LOCATIONS } from "../onboarding.logic";

interface MarsMapProps {
  selectedLocation: string | undefined;
  onSelect: (location: string) => void;
  className?: string;
}

export const MarsMap: React.FC<MarsMapProps> = ({
  selectedLocation: _selectedLocation,
  onSelect: _onSelect,
  className,
}) => {
  // Approximate positions (%) on a 100x100 grid for Mars projection
  const _locations = [
    { name: MARS_LOCATIONS[0], x: 20, y: 40, r: 8, label: "オリンポス山" }, // Olympus Mons (Left)
    {
      name: MARS_LOCATIONS[1],
      x: 45,
      y: 55,
      r: 10,
      label: "マリネリス峡谷",
      type: "canyon",
    }, // Valles Marineris (Center)
    { name: MARS_LOCATIONS[2], x: 75, y: 45, r: 6, label: "大シルチス" }, // Syrtis Major (Right)
    {
      name: MARS_LOCATIONS[3],
      x: 28,
      y: 50,
      r: 7,
      label: "タルシス三山",
      type: "mountain",
    }, // Tharsis Montes (Near Olympus)
    { name: MARS_LOCATIONS[4], x: 55, y: 65, r: 4, label: "ゲール" }, // Gale Crater
    { name: MARS_LOCATIONS[5], x: 70, y: 35, r: 7, label: "イシディス" }, // Isidis
    { name: MARS_LOCATIONS[6], x: 65, y: 75, r: 9, label: "ヘラス盆地" }, // Hellas (Bottom Right)
    { name: MARS_LOCATIONS[7], x: 72, y: 30, r: 3, label: "ジェゼロ" }, // Jezero
    { name: MARS_LOCATIONS[8], x: 75, y: 20, r: 8, label: "ユートピア" }, // Utopia (Top Right)
    { name: MARS_LOCATIONS[9], x: 35, y: 25, r: 4, label: "シドニア" }, // Cydonia (North)
  ];

  return (
    <div
      className={cn(
        "relative w-full pb-[100%] max-w-[400px] mx-auto",
        className
      )}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/star/mars.svg"
          alt="Mars Map"
          fill
          className="object-contain"
        />
      </div>
    </div>
  );
};
