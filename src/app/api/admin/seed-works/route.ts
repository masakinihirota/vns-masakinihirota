import { auth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { parseAnimeData, parseMangaData } from "@/lib/works/seed-utils";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function POST(_req: NextRequest) {
  // Better-Auth による認証チェック
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();

  // Double check if user is root/admin if needed, skipping for MVP/dev speed

  try {
    const animePath = path.join(process.cwd(), "src/data/anime.md");
    const mangaPath = path.join(process.cwd(), "src/data/manga.md");

    const animeWorks = parseAnimeData(animePath);
    const mangaWorks = parseMangaData(mangaPath);

    const allWorks = [...animeWorks, ...mangaWorks];

    const results = {
      total: allWorks.length,
      inserted: 0,
      errors: [] as any[],
    };

    // Bulk insert is possible, but let's do batches to be safe with large data
    const batchSize = 100;
    for (let i = 0; i < allWorks.length; i += batchSize) {
      const batch = allWorks.slice(i, i + batchSize).map((w) => ({
        ...w,
        is_official: true,
        status: "public",
        owner_user_id: session.user.id, // シーダーをオーナーとして設定
      }));

      const { error } = await supabase.from("works").insert(batch);

      if (error) {
        results.errors.push(error);
        console.error("Seed batch error:", error);
      } else {
        results.inserted += batch.length;
      }
    }

    return NextResponse.json({ success: true, ...results });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error },
      { status: 500 }
    );
  }
}
