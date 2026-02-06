import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const WorkSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  author: z.string().optional(),
  category: z.enum(["anime", "manga", "other"]),
  description: z.string().max(1000).optional(),
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const json = await request.json();
    const validatedFields = WorkSchema.safeParse(json);

    if (!validatedFields.success) {
      return NextResponse.json(
        {
          message: "Validation Error",
          errors: validatedFields.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { title, author, category, description } = validatedFields.data;

    const { error } = await supabase.from("works").insert({
      title,
      author,
      category,
      description: description || null,
      owner_user_id: user.id,
      is_official: false,
      status: "pending",
    });

    if (error) {
      console.error("Database Error:", error);
      return NextResponse.json(
        { message: "Database Error: Failed to register work." },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Work registered successfully!" });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
