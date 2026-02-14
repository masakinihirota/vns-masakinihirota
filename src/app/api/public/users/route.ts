import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get("limit");

  // Security: Force strict limit
  const limit = limitParam ? Math.min(parseInt(limitParam), 10) : 10;

  const supabase = await createClient();

  // Fetch candidate users for matching simulation
  // We select only non-sensitive fields.
  // We rely on 'is_active' to only show active users.
  const { data: users, error } = await supabase
    .from("user_profiles")
    .select("id, display_name, purpose, role_type, is_active")
    .eq("is_active", true)
    // .order("updated_at", { ascending: false }) // Show recently active
    .limit(limit);

  if (error) {
    console.error("Failed to fetch public users:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }

  // Double check to ensure no sensitive data leaks (redundant given .select() but good for safety)
  const safeUsers = users?.map((u) => ({
    id: u.id,
    display_name: u.display_name,
    purpose: u.purpose,
    role_type: u.role_type,
    // Do NOT include root_account_id or timestamps if not needed
  }));

  return NextResponse.json(safeUsers, {
    headers: {
      // Add Cache-Control for performance and to reduce DB hit rate
      // s-maxage=60 (CDN cache 60s), stale-while-revalidate=300
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
