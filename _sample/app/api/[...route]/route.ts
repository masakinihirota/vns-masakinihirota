// Copied from original [[...route]] folder
import { and, count, desc, eq, sql } from "drizzle-orm";
import { Hono } from "hono";
import { handle } from "hono/vercel";
import { revalidatePath } from "next/cache";
import { z } from "zod";

/* eslint-disable */
import { Profile } from "@/components/profile-creation-1000masks/profile-creation-1000masks.logic";
import { auth } from "@/lib/auth"; // Better-Auth
import { upsertBusinessCard } from "@/lib/db/business-cards";
import { db } from "@/lib/db/client";

import {
  groups,
  rootAccounts,
  userProfiles,
  userWorkRatings,
  works as worksTable,
} from "@/lib/db/schema.postgres";
import * as userProfilesDb from "@/lib/db/user-profiles";
import { createWork, getWorks } from "@/lib/db/works";
import { VNSTrialDataSchema } from "@/lib/trial-storage";
import { generateContent } from "@/lib/vertex-ai";

const isDev = process.env.NODE_ENV !== "production";
const logError = (...args: unknown[]) => {
  if (isDev) {
    console.error(...args);
  }
};

// Better-Auth Types
type User = typeof auth.$Infer.Session.user;
type Session = typeof auth.$Infer.Session.session;

type ApiVariables = {
  user: User | null;
  session: Session | null;
};

const app = new Hono<{ Variables: ApiVariables }>().basePath("/api");

app.use("*", async (c, next) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });
  c.set("user", session?.user || null);
  c.set("session", session?.session || null);
  await next();
});

app.get("/hello", (c) => {
  return c.json({
    message: "Hello from Hono!",
  });
});

// --- Auth Endpoints ---

app.post("/auth/anonymous", async (c) => {
  return c.json({ error: "Anonymous auth not supported yet" }, 501);
});

// --- Public Endpoints ---

app.get("/public/works", async (c) => {
  const worksData = await getWorks(20);
  return c.json({ works: worksData });
});

app.get("/public/users", async (c) => {
  const usersData = await db.query.userProfiles.findMany({
    limit: 20,
    columns: {
      id: true,
      displayName: true,
      roleType: true,
      avatarUrl: true,
      purpose: true,
    },
  });

  c.header("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
  return c.json({ users: usersData });
});

// --- User Profiles Endpoints ---

const BusinessCardContentSchema = z.object({
  trust: z
    .object({
      response_time: z.string().optional(),
      completion_rate: z.string().optional(),
      revision_policy: z.string().optional(),
    })
    .optional(),
  value: z
    .object({
      feedback_stance: z.enum(["artistic", "commercial", "balanced"]).optional(),
      ai_stance: z.enum(["no_ai", "ai_assisted", "ai_full"]).optional(),
      self_management: z.array(z.string()).optional(),
    })
    .optional(),
  pr: z
    .object({
      promotion_level: z.string().optional(),
      comm_style: z.string().optional(),
    })
    .optional(),
  oasis: z
    .object({
      enabled: z.boolean().optional(),
    })
    .optional(),
});

const BusinessCardConfigSchema = z.object({
  show_display_name: z.boolean().optional(),
  show_role_type: z.boolean().optional(),
  show_purposes: z.boolean().optional(),
  show_skills: z.boolean().optional(),
  show_external_links: z.boolean().optional(),
  selected_works_ids: z.array(z.string()).optional(),
  custom_title: z.string().optional(),
  custom_bio: z.string().optional(),
});

const UpsertBusinessCardSchema = z.object({
  is_published: z.boolean().optional(),
  display_config: z.any().optional(), // Or BusinessCardConfigSchema
  content: BusinessCardContentSchema.optional(),
});

app.post("/user-profiles/:id/card", async (c) => {
  const profileId = c.req.param("id");
  const body = await c.req.json();
  const user = c.get("user");

  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const validatedFields = UpsertBusinessCardSchema.safeParse(body);
  if (!validatedFields.success) {
    return c.json({ errors: validatedFields.error.flatten().fieldErrors }, 400);
  }
  const data = validatedFields.data;

  const rootAccount = await userProfilesDb.getRootAccountByAuthUserId(user.id);
  if (!rootAccount) {
    return c.json({ error: "Root account not found" }, 404);
  }

  const profile = await userProfilesDb.getUserProfileById(profileId);
  if (!profile || (profile as any).root_account_id !== rootAccount.id) {
    return c.json({ error: "Forbidden" }, 403);
  }

  await upsertBusinessCard(profileId, data);
  revalidatePath(`/user-profiles/${profileId}`);
  return c.json({ success: true });
});

// --- Profiles Endpoints ---

app.get("/profiles", async (c) => {
  const user = c.get("user");
  if (!user || !user.id) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    const dbProfiles = await userProfilesDb.getUserProfilesByAuthUserId(
      user.id
    );

    const profiles: Profile[] = dbProfiles.map((p) => {
      const extra = ((p as any).external_links as Record<string, unknown>) || {};
      return {
        id: p.id,
        name: (p as any).display_name,
        is_official: (p as any).isOfficial || (p as any).is_official,
        constellationName: (extra.constellationName as string) || "",
        constellationHistory: (extra.constellationHistory as string[][]) || [],
        historyPointer: (extra.historyPointer as number) || 0,
        avatarType: (extra.avatarType as any) || "mask",
        maskId: (extra.maskId as any) || "mask_default",
        isGhost: (extra.isGhost as boolean) || false,
        selectedTypeId: (extra.selectedTypeId as any | null) || null,
        selectedObjectiveIds: (extra.selectedObjectiveIds as any[]) || [],
        selectedSlots: (extra.selectedSlots as any[]) || [],
        selectedValues: (extra.selectedValues as any[]) || [],
        workSetId: (extra.workSetId as string) || "",
        skillSetId: (extra.skillSetId as string) || "",
      };
    });

    return c.json(profiles);
  } catch (error) {
    logError("Failed to fetch profiles:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

const ProfileSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "名前は必須です"),
  constellationName: z.string().optional(),
  constellationHistory: z.array(z.array(z.string())).optional(),
  historyPointer: z.number().optional(),
  avatarType: z.enum(["user", "ghost"]).optional(),
  maskId: z.string().optional(),
  isGhost: z.boolean().default(false),
  selectedTypeId: z.string().nullable().optional(),
  selectedObjectiveIds: z.array(z.string()).optional(),
  selectedSlots: z.array(z.string()).optional(),
  selectedValues: z.array(z.string()).optional(),
  workSetId: z.string().optional(),
  skillSetId: z.string().optional(),
});

const ProfilesArraySchema = z.array(ProfileSchema);

app.post("/profiles", async (c) => {
  const user = c.get("user");
  if (!user || !user.id) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    const body = await c.req.json();
    const validatedProfiles = ProfilesArraySchema.safeParse(body);

    if (!validatedProfiles.success) {
      return c.json({ errors: validatedProfiles.error.flatten().fieldErrors }, 400);
    }

    // safeParseで得られた安全なデータを使用（便宜上元の型にキャスト、またはそのまま使用）
    const profiles = validatedProfiles.data as unknown as Profile[];

    const rootAccount = await userProfilesDb.getRootAccountByAuthUserId(
      user.id
    );

    if (!rootAccount) {
      return c.json({ error: "Root account not found" }, 404);
    }

    const profileIds = profiles.map((p) => p.id);
    const existingProfiles = await userProfilesDb.getProfilesByIds(profileIds);
    const existingProfileMap = new Map(existingProfiles.map((p) => [p.id, p]));

    const forbidden = profiles.find((profile) => {
      const existing = existingProfileMap.get(profile.id);
      return existing && (existing as any).root_account_id !== rootAccount.id;
    });

    if (forbidden) {
      return c.json({ error: "Forbidden" }, 403);
    }

    const profilesToUpsert = profiles
      .filter((profile) => !profile.isGhost)
      .map((profile) => {
        const extra = {
          constellationName: profile.constellationName,
          constellationHistory: profile.constellationHistory,
          historyPointer: profile.historyPointer,
          avatarType: profile.avatarType as any,
          maskId: profile.maskId,
          isGhost: profile.isGhost,
          selectedTypeId: profile.selectedTypeId,
          selectedObjectiveIds: profile.selectedObjectiveIds,
          selectedSlots: profile.selectedSlots,
          selectedValues: profile.selectedValues,
          workSetId: profile.workSetId,
          skillSetId: profile.skillSetId,
        };

        return {
          id: profile.id,
          rootAccountId: rootAccount.id,
          displayName: profile.name,
          externalLinks: extra,
        };
      });

    if (profilesToUpsert.length === 0) {
      return c.json({ message: "Successfully synced profiles", results: [] });
    }

    const upserted = await db
      .insert(userProfiles)
      .values(profilesToUpsert)
      .onConflictDoUpdate({
        target: userProfiles.id,
        set: {
          displayName: sql`EXCLUDED.display_name`,
          externalLinks: sql`EXCLUDED.external_links`,
          updatedAt: new Date().toISOString() as any,
        },
      })
      .returning();

    const results = upserted.map(userProfilesDb.mapToUserProfileDomain);
    return c.json({ message: "Successfully synced profiles", results });
  } catch (error) {
    logError("Failed to save profiles:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

// --- User Trial Import Endpoints ---

app.post("/user/import-trial", async (c) => {
  const user = c.get("user");
  if (!user || !user.id) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  let trialData;
  try {
    const json = await c.req.json();
    trialData = VNSTrialDataSchema.parse(json);
  } catch {
    return c.json({ error: "Invalid trial data format" }, 400);
  }

  const rootAccount = await db.query.rootAccounts.findFirst({
    where: eq(rootAccounts.authUserId, user.id),
    columns: { id: true, points: true },
  });

  if (!rootAccount) {
    return c.json({ error: "Root account not found" }, 404);
  }

  const MAX_POINTS = 1000000;
  const trialPoints = trialData.points.current || 0;

  if (trialPoints > 0) {
    try {
      await db
        .update(rootAccounts)
        .set({
          points: sql`LEAST(${rootAccounts.points} + ${trialPoints}, ${MAX_POINTS})`,
          updatedAt: new Date().toISOString() as any,
        })
        .where(eq(rootAccounts.id, rootAccount.id));
    } catch (updateError) {
      logError("Failed to update points:", updateError);
    }
  }

  const profilesToInsert = trialData.profiles.map((p) => ({
    id: p.id,
    displayName: p.name,
    roleType: p.type,
    rootAccountId: rootAccount.id,
    isActive: true,
    purpose: "trial_import",
  }));

  if (profilesToInsert.length > 0) {
    try {
      await db
        .insert(userProfiles)
        .values(profilesToInsert)
        .onConflictDoUpdate({
          target: userProfiles.id,
          set: {
            displayName: sql`EXCLUDED.display_name`,
            roleType: sql`EXCLUDED.role_type`,
            isActive: sql`EXCLUDED.is_active`,
            purpose: sql`EXCLUDED.purpose`,
            updatedAt: new Date().toISOString() as any,
          },
        });
    } catch (insertError) {
      logError("Failed to import profiles:", insertError);
      return c.json(
        {
          success: false,
          message: "Partial success: Points updated but profiles failed.",
        },
        500
      );
    }
  }

  return c.json({ success: true, message: "Trial data imported successfully" });
});

// --- AI Test Endpoints ---

app.get("/ai-test", async (c) => {
  try {
    const responseText = await generateContent(
      "「こんにちは、Vertex AIです！」という挨拶に続けて、自己紹介をしてください。"
    );
    return c.json({
      status: "success",
      message: "Vertex AI connection established.",
      data: { response: responseText },
    });
  } catch (error) {
    logError("API Error:", error);
    return c.json(
      {
        status: "error",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      500
    );
  }
});

app.post("/ai-test", async (c) => {
  try {
    const { prompt } = await c.req.json();
    if (!prompt) {
      return c.json(
        { status: "error", message: "Prompt is required in the request body." },
        400
      );
    }
    const responseText = await generateContent(prompt);
    return c.json({
      status: "success",
      data: { response: responseText },
    });
  } catch (error) {
    logError("API Error:", error);
    return c.json(
      {
        status: "error",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      500
    );
  }
});

// --- Works Endpoints ---

const WorkSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  author: z.string().optional(),
  category: z.enum(["anime", "manga", "other"]),
});

const WorkListQuerySchema = z.object({
  page: z.string().optional().default("1").transform(Number),
  limit: z.string().optional().default("20").transform(Number),
});

app.get("/works/list", async (c) => {
  const user = c.get("user");
  if (!user || !user.id) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const queryParams = c.req.query();
  const parsed = WorkListQuerySchema.safeParse(queryParams);
  if (!parsed.success) {
    return c.json({ error: "Invalid query parameters" }, 400);
  }

  const { page, limit } = parsed.data;
  const offset = (page - 1) * limit;

  const [totalCount] = await db.select({ value: count() }).from(worksTable);

  const worksList = await db.query.works.findMany({
    limit,
    offset,
    orderBy: [desc(worksTable.createdAt)],
    columns: {
      id: true,
      title: true,
      author: true,
      category: true,
      isOfficial: true,
    },
  });

  return c.json({ success: true, data: worksList, count: totalCount.value });
});

app.get("/business-cards", async (c) => {
  const user = c.get("user");

  if (!user || !user.id) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  return c.json({ success: true, data: [] });
});

app.post("/scan-card", async (c) => {
  const user = c.get("user");
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  return c.json({ success: true, message: "Card scanned successfully (mock)" });
});

app.post("/works", async (c) => {
  const user = c.get("user");

  if (!user || !user.id) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const body = await c.req.json();
  const validatedFields = WorkSchema.safeParse(body);

  if (!validatedFields.success) {
    return c.json({ errors: validatedFields.error.flatten().fieldErrors }, 400);
  }

  const { title, author, category } = validatedFields.data;

  await createWork({
    title,
    author: author ?? null,
    category,
    owner_user_id: user.id, // Auth.js user ID -> now Better-Auth use ID
    is_official: false,
    status: "pending",
  });
  revalidatePath("/works");
  return c.json({ success: true });
});

const RatingSchema = z.object({
  rating: z.enum(["like", "dislike", "none"]),
  tier: z.number().min(1).max(3).optional().nullable(),
});

app.put("/works/:id/rating", async (c) => {
  const user = c.get("user");
  if (!user || !user.id) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const workId = c.req.param("id");
  const body = await c.req.json();
  const validatedFields = RatingSchema.safeParse(body);

  if (!validatedFields.success) {
    return c.json({ errors: validatedFields.error.flatten().fieldErrors }, 400);
  }

  const { rating, tier } = validatedFields.data;

  // 既存の評価を確認して upsert
  const existing = await db.query.userWorkRatings.findFirst({
    where: and(
      eq(userWorkRatings.userId, user.id),
      eq(userWorkRatings.workId, workId)
    ),
  });

  if (existing) {
    await db
      .update(userWorkRatings)
      .set({
        rating,
        lastTier: tier ? String(tier) : null,
        updatedAt: new Date().toISOString(),
      })
      .where(
        and(
          eq(userWorkRatings.userId, user.id),
          eq(userWorkRatings.workId, workId)
        )
      );
  } else {
    await db.insert(userWorkRatings).values({
      userId: user.id,
      workId,
      rating,
      lastTier: tier ? String(tier) : null,
    });
  }

  return c.json({ success: true });
});

// --- Admin Endpoints ---

app.post("/admin/seed-works", async (c) => {
  const user = c.get("user");

  // 管理者チェック (Better-Authのrole)
  if (!user || user.role !== "admin") {
    return c.json({ error: "Forbidden: Admin access required" }, 403);
  }

  const defaultWorks = [
    {
      title: "Example Anime 1",
      category: "anime" as const,
      author: "Author A",
    },
    {
      title: "Example Manga 1",
      category: "manga" as const,
      author: "Author B",
    },
    {
      title: "Example Game 1",
      category: "other" as const,
      author: "Studio C",
    },
  ];

  const worksToInsert = defaultWorks.map((hw) => ({
    title: hw.title,
    category: hw.category,
    author: hw.author,
    isOfficial: true,
    status: "approved",
    ownerUserId: user.id,
  }));

  await db.insert(worksTable).values(worksToInsert);
  const count = worksToInsert.length;

  return c.json({ success: true, count });
});

// --- Groups Endpoints ---

const GroupListQuerySchema = z.object({
  page: z.string().optional().default("1").transform(Number),
  limit: z.string().optional().default("20").transform(Number),
});

app.get("/groups/list", async (c) => {
  const user = c.get("user");
  if (!user || !user.id) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const queryParams = c.req.query();
  const parsed = GroupListQuerySchema.safeParse(queryParams);
  if (!parsed.success) {
    return c.json({ error: "Invalid query parameters" }, 400);
  }

  const { page, limit } = parsed.data;
  const offset = (page - 1) * limit;

  const [totalCount] = await db.select({ value: count() }).from(groups);

  // 必要なカラムのみを選択して取得、limit/offset でページネーション
  const groupsList = await db.query.groups.findMany({
    limit,
    offset,
    columns: {
      id: true,
      name: true,
      description: true,
    },
  });

  return c.json({ success: true, data: groupsList, count: totalCount.value });
});

export async function GET(req: Request) { return handle(app)(req); }
export async function POST(req: Request) { return handle(app)(req); }
export async function PUT(req: Request) { return handle(app)(req); }
export async function DELETE(req: Request) { return handle(app)(req); }
export async function PATCH(req: Request) { return handle(app)(req); }
export async function OPTIONS(req: Request) { return handle(app)(req); }


