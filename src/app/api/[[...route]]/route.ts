import { Hono } from "hono";
import { handle } from "hono/vercel";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { upsertBusinessCard } from "@/lib/db/business-cards";
import { createClient } from "@/lib/supabase/server";

export const runtime = "edge";

const app = new Hono().basePath("/api");

app.get("/hello", (c: any) => {
  return c.json({
    message: "Hello from Hono!",
  });
});

// --- Auth Endpoints ---

app.post("/auth/anonymous", async (c: any) => {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInAnonymously();

  if (error) {
    return c.json({ error: "Anonymous sign in failed" }, 401);
  }

  return c.json({ success: true, redirect: "/works/popular" });
});

// --- User Profiles Endpoints ---

app.post("/user-profiles/:id/card", async (c: any) => {
  const profileId = c.req.param("id");
  const data = await c.req.json();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  // Ownership check
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("root_account_id")
    .eq("id", profileId)
    .single();

  if (!profile) {
    return c.json({ error: "Profile not found" }, 404);
  }

  try {
    await upsertBusinessCard(profileId, data);
    revalidatePath(`/user-profiles/${profileId}`);
    return c.json({ success: true });
  } catch (error) {
    console.error("Failed to save business card settings:", error);
    return c.json({ error: "Failed to save settings" }, 500);
  }
});

// --- Works Endpoints ---

const WorkSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  author: z.string().optional(),
  category: z.enum(["anime", "manga", "other"]),
});

app.post("/works", async (c: any) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const body = await c.req.json();
  const validatedFields = WorkSchema.safeParse(body);

  if (!validatedFields.success) {
    return c.json({ errors: validatedFields.error.flatten().fieldErrors }, 400);
  }

  const { title, author, category } = validatedFields.data;

  const { error } = await supabase.from("works").insert({
    title,
    author,
    category,
    owner_user_id: user.id,
    is_official: false,
    status: "pending",
  });

  if (error) {
    return c.json({ error: "Failed to register work" }, 500);
  }

  revalidatePath("/works");
  return c.json({ success: true });
});

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
export const OPTIONS = handle(app);
