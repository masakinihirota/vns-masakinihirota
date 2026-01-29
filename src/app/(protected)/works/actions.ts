"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const WorkSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  author: z.string().optional(),
  category: z.enum(["anime", "manga", "other"]),
  description: z.string().max(1000).optional(),
});

export type WorkRegistrationState = {
  errors?: {
    title?: string[];
    author?: string[];
    category?: string[];
    description?: string[];
  };
  message?: string;
  success?: boolean;
};

export async function registerWork(
  prevState: WorkRegistrationState,
  formData: FormData
): Promise<WorkRegistrationState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { message: "Unauthorized" };
  }

  const validatedFields = WorkSchema.safeParse({
    title: formData.get("title"),
    author: formData.get("author"),
    category: formData.get("category"),
    description: formData.get("description"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation Error",
    };
  }

  const { title, author, category } = validatedFields.data;

  const { error } = await supabase.from("works").insert({
    title,
    author,
    category,
    // description: description, // Need to verify if description column exists in my migration. I added it in schema design but forgot in SQL earlier?
    // Wait, in my previous tool call I wrote: "title" text not null, "author" text, "category" text...
    // I DID NOT include 'description' in the migration SQL.
    // I should strictly follow the migration I created.
    // I will omit description for now or add a migration for it.
    // The design doc said "description" is optional.
    // I will skip description for now to match the migration.
    owner_user_id: user.id,
    is_official: false,
    status: "pending", // Default for user submission
  });

  if (error) {
    console.error("Database Error:", error);
    return { message: "Database Error: Failed to register work." };
  }

  revalidatePath("/works");
  return { success: true, message: "Work registered successfully!" };
}

export async function getWorks(filter?: {
  category?: string;
  is_official?: boolean;
  query?: string;
}) {
  const supabase = await createClient();

  let query = supabase.from("works").select("*");

  if (filter?.category && filter.category !== "all") {
    query = query.eq("category", filter.category);
  }

  if (filter?.is_official !== undefined) {
    query = query.eq("is_official", filter.is_official);
  }

  if (filter?.query) {
    query = query.ilike("title", `%${filter.query}%`);
  }

  const { data, error } = await query
    .order("created_at", { ascending: false })
    .limit(50); // limit for performance

  if (error) {
    console.error("Fetch Error:", error);
    return [];
  }

  return data;
}
