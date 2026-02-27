import { eq } from "drizzle-orm";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import { BusinessCardEditor } from "@/components/business-card/business-card-editor";
import {
  BusinessCardView,
  Skill,
  Work,
} from "@/components/business-card/business-card-view";
import { getSession } from "@/lib/auth/helper";
import { getBusinessCardByProfileId } from "@/lib/db/business-cards";
import { db } from "@/lib/db/client";
import {
  rootAccounts,
  userWorkEntries,
  works as worksTable,
} from "@/lib/db/schema.postgres";
import { getUserProfileById } from "@/lib/db/user-profiles";
import { isValidUUID } from "@/lib/utils";

type Properties = {
  params: Promise<{ id: string }>;
};

/**
 *
 * @param properties
 */
export async function generateMetadata(properties: Properties): Promise<Metadata> {
  const parameters = await properties.params;
  const profile = await getUserProfileById(parameters.id);

  if (!profile) {
    return { title: "Profile Not Found" };
  }

  return {
    title: `${profile.display_name} - Business Card`,
    description: `Business Card for ${profile.display_name}`,
  };
}

/**
 *
 * @param properties
 */
export default async function BusinessCardPage(properties: Properties) {
  const parameters = await properties.params;
  const profileId = parameters.id;

  if (!isValidUUID(profileId)) {
    notFound();
  }

  const session = await getSession();
  const user = session?.user;

  const profile = await getUserProfileById(profileId);
  if (!profile) {
    notFound();
  }

  const businessCard = await getBusinessCardByProfileId(profileId);

  // Check ownership
  let isOwner = false;
  if (user) {
    const rootAccount = await db.query.rootAccounts.findFirst({
      where: eq(rootAccounts.authUserId, user.id),
    });

    if (rootAccount && rootAccount.id === profile.root_account_id) {
      isOwner = true;
    }
  }

  // Fetch Works using Drizzle
  const worksData = await db
    .select({
      tier: userWorkEntries.tier,
      work: {
        id: worksTable.id,
        title: worksTable.title,
        author: worksTable.author,
      },
    })
    .from(userWorkEntries)
    .innerJoin(worksTable, eq(userWorkEntries.workId, worksTable.id))
    .where(eq(userWorkEntries.userId, user?.id || "")); // Note: In Drizzle user_work_entries.userId matches users.id (authUserId)

  const works: Work[] = (worksData || []).map((item) => ({
    id: item.work.id,
    title: item.work.title,
    category: item.work.author || "",
    url: "",
  }));

  const skills: Skill[] = [];

  if (isOwner) {
    return (
      <div className="container py-8 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Business Card Settings</h1>
        <BusinessCardEditor
          profile={profile}
          initialCard={businessCard}
          works={works}
          skills={skills}
        />
      </div>
    );
  }

  if (!businessCard?.is_published) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold mb-2">Private Profile</h1>
        <p className="text-muted-foreground">
          This business card is not publicly visible.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <BusinessCardView
        profile={profile}
        config={businessCard.display_config}
        works={works}
        skills={skills}
        className="transform scale-110 sm:scale-125"
      />
    </div>
  );
}
