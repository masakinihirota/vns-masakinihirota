"use client";

import React from "react";
import { TILE_SIZE, TILE_COLORS } from "./map-constants";

interface MapTilesProps {
  layout: number[][];
}

export const MapTiles = React.memo(({ layout }: MapTilesProps) => {
  return (
    <div className="absolute inset-0">
      {layout.map((row, y) => (
        <div key={y} className="flex">
          {row.map((tileType, x) => (
            <div
              key={`${x}-${y}`}
              className={`
                                ${TILE_COLORS[tileType]}
                                border-[0.5px] border-black/[0.05] dark:border-white/[0.02]
                                transition-colors duration-500
                            `}
              style={{ width: TILE_SIZE, height: TILE_SIZE }}
            />
          ))}
        </div>
      ))}
    </div>
  );
});

MapTiles.displayName = "MapTiles";
