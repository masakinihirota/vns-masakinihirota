export const TILE_SIZE = 32; // px (800/25=32, 600/18≈33)
export const MAP_WIDTH = 25;
export const MAP_HEIGHT = 18;

export const TILE_TYPE = {
  GRASS: 0,
  WATER: 1,
  PATH: 2,
  SHRINE: 3,
  MARKET: 4,
  BBS: 5,
  TAVERN: 6,
  MASK_MAKER: 7,
  SUMMONING_ROOM: 8,
};

// High contrast colors for better visibility
export const TILE_COLORS: Record<number, number> = {
  [TILE_TYPE.GRASS]: 0x2d5a27, // Deep Green
  [TILE_TYPE.WATER]: 0x1a73e8, // Bright Blue
  [TILE_TYPE.PATH]: 0xdcb878, // Sand/Path (Beige)
  [TILE_TYPE.SHRINE]: 0x6a1b9a, // Deep Purple
  [TILE_TYPE.MARKET]: 0xd84315, // Burnt Orange
  [TILE_TYPE.BBS]: 0x546e7a, // Blue Grey
  [TILE_TYPE.TAVERN]: 0x8d6e63, // Brown
  [TILE_TYPE.MASK_MAKER]: 0x00838f, // Cyan/Teal
  [TILE_TYPE.SUMMONING_ROOM]: 0x4a148c, // Darker Purple (Spawn)
};

export const SPAWN_POINT = {
  x: 4 * TILE_SIZE, // Inside Summoning Room
  y: 4 * TILE_SIZE,
};

// Generate layout
export const INITIAL_MAP_LAYOUT: number[][] = Array(MAP_HEIGHT)
  .fill([])
  .map((_, y) =>
    Array(MAP_WIDTH)
      .fill(TILE_TYPE.GRASS)
      .map((_, x) => {
        // Border Water
        if (x === 0 || x === MAP_WIDTH - 1 || y === 0 || y === MAP_HEIGHT - 1)
          return TILE_TYPE.WATER;

        // --- Temple Area (Top Left) ---
        // Summoning Room (Spawn)
        if (x >= 2 && x <= 5 && y >= 2 && y <= 5)
          return TILE_TYPE.SUMMONING_ROOM;
        // Main Shrine
        if (x >= 6 && x <= 8 && y >= 2 && y <= 5) return TILE_TYPE.SHRINE;
        // Mask Maker (Near Temple)
        if (x >= 2 && x <= 5 && y >= 7 && y <= 8) return TILE_TYPE.MASK_MAKER;

        // --- Market Area (Top Right) ---
        if (x >= 17 && x <= 23 && y >= 2 && y <= 6) return TILE_TYPE.MARKET;

        // --- Tavern Area (Bottom Right) ---
        if (x >= 17 && x <= 23 && y >= 10 && y <= 15) return TILE_TYPE.TAVERN;

        // --- BBS / Plaza (Bottom Left) ---
        if (x >= 2 && x <= 8 && y >= 11 && y <= 15) return TILE_TYPE.BBS;

        // --- Paths ---
        // Horizontal Path (Center)
        if (y === 8 || y === 9) return TILE_TYPE.PATH;
        // Vertical Path (Center)
        if (x === 12 || x === 13) return TILE_TYPE.PATH;
        // Path to Tavern
        if (x >= 13 && x <= 16 && y === 12) return TILE_TYPE.PATH;
        // Path to BBS
        if (x >= 9 && x <= 12 && y === 13) return TILE_TYPE.PATH;

        return TILE_TYPE.GRASS;
      })
  );

export const MAP_ENTITIES = [
  {
    id: "shrine_king",
    name: "女王 (Shrine)",
    type: "king",
    position: { x: 7, y: 3.5 }, // Center of Shrine
    zoneId: "shrine",
  },
  {
    id: "market_npc",
    name: "商人 (Market)",
    type: "market",
    position: { x: 20, y: 4 }, // Center of Market
    zoneId: "market",
  },
  {
    id: "tavern_master",
    name: "酒場のマスター (Tavern)",
    type: "tavern",
    position: { x: 20, y: 12.5 }, // Center of Tavern
    zoneId: "tavern",
  },
  {
    id: "bbs_board",
    name: "掲示板 (Plaza)",
    type: "bbs",
    position: { x: 5, y: 13 }, // Center of BBS
    zoneId: "bbs",
  },
  {
    id: "mask_maker",
    name: "仮面職人",
    type: "npc",
    position: { x: 3.5, y: 7.5 },
    zoneId: "mask_maker",
  },
  {
    id: "map_item",
    name: "古びた地図",
    type: "item",
    position: { x: 12, y: 8 }, // Center path area
    zoneId: "world",
  },
  {
    id: "tavern_door",
    name: "酒場入口",
    type: "door",
    position: { x: 17, y: 12 },
    zoneId: "tavern",
  },
];
