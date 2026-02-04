import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get("limit");

  // Security: Force strict limit
  const limit = limitParam ? Math.min(parseInt(limitParam), 20) : 20;

  const supabase = await createClient();

  // "Popular" works - for now, we just fetch officially recognized or simple list
  // In a real scenario, this might order by a 'view_count' or similar if it existed.
  // We strictly select safe fields.
  const { data: works, error } = await supabase
    .from("works")
    .select("id, title, category, author, is_official, status")
    .limit(limit);

  if (error) {
    console.error("Failed to fetch public works:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }

  return NextResponse.json(works);
}
