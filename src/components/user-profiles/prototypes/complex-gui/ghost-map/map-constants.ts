export const TILE_SIZE = 48; // px
export const MAP_WIDTH = 30;
export const MAP_HEIGHT = 20;
export const WALK_DELAY = 250; // ms
export const RUN_DELAY = 100; // ms
export const MAX_VISIBLE_ENTITIES = 10;
export const CHAT_RADIUS = 5; // chat hearing range in tiles

// 0: Grass, 1: Water, 2: Sand, 3: Shrine, 4: Market, 5: BBS, 6: Tavern
export const INITIAL_MAP_LAYOUT: number[][] = Array(20)
  .fill([])
  .map((_, y) =>
    Array(30)
      .fill(0)
      .map((_, x) => {
        // Border Water
        if (x === 0 || x === 29 || y === 0 || y === 19) return 1;

        // Queen's Shrine (Top Left)
        if (x >= 2 && x <= 6 && y >= 2 && y <= 6) return 3;

        // Market (Top Right)
        if (x >= 20 && x <= 26 && y >= 3 && y <= 7) return 4;

        // BBS (Bottom Left)
        if (x >= 3 && x <= 8 && y >= 12 && y <= 16) return 5;

        // Tavern (Bottom Right)
        if (x >= 20 && x <= 26 && y >= 12 && y <= 16) return 6;

        // Paths
        if (x === 14 || y === 9) return 2; // Main crossroads

        return 0; // Grass default
      })
  );

export const TILE_COLORS: Record<number, string> = {
  // Earthy tones for Light Mode / Deep tones for Dark Mode
  0: "bg-[#5c8a45] dark:bg-[#0f2815]", // Grass (More natural green / Deep forest green)
  1: "bg-[#4da6ff] dark:bg-[#0a1930]", // Water (Bright blue / Abyssal blue)
  2: "bg-[#d6c4a0] dark:bg-[#3d342b]", // Sand/Path (Beige / Muddy brown)
  3: "bg-[#8a7aaa] dark:bg-[#2d1b4e]", // Shrine (Muted purple / Ancient purple)
  4: "bg-[#bd7b4a] dark:bg-[#3e2717]", // Market (Wood / Dark Wood)
  5: "bg-[#718096] dark:bg-[#1a202c]", // BBS (Stone / Dark Slate)
  6: "bg-[#9b2c2c] dark:bg-[#4a0f0f]", // Tavern (Brick Red / Blood Red)
};
