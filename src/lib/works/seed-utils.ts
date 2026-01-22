import fs from "fs";
import path from "path";

export interface WorkSeedData {
  title: string;
  author?: string;
  category: "anime" | "manga";
}

export function parseAnimeData(filePath: string): WorkSeedData[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const works: WorkSeedData[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    // Skip headers or very short lines that assume aren't titles
    if (trimmed.startsWith("#") || trimmed.length < 2) continue;
    // Skip timeframe headers like "黎明期から..."
    if (
      trimmed.includes("（") &&
      trimmed.includes("）") &&
      (trimmed.includes("年代") || trimmed.includes("期"))
    )
      continue;

    works.push({
      title: trimmed,
      category: "anime",
    });
  }
  return works;
}

export function parseMangaData(filePath: string): WorkSeedData[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const works: WorkSeedData[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith("#") || trimmed.length < 2) continue;

    // Pattern: "Title - Author"
    // Use lastIndexOf to handle titles with hyphens, though " - " is the separator
    const separatorIndex = trimmed.lastIndexOf(" - ");

    if (separatorIndex !== -1) {
      const title = trimmed.substring(0, separatorIndex).trim();
      const author = trimmed.substring(separatorIndex + 3).trim();
      works.push({
        title,
        author,
        category: "manga",
      });
    } else {
      // Fallback for lines without author
      works.push({
        title: trimmed,
        category: "manga",
      });
    }
  }
  return works;
}
