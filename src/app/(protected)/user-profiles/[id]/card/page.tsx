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
import { getUserProfileById } from "@/lib/db/user-profiles";
import { createClient } from "@/lib/supabase/server";
import { isValidUUID } from "@/lib/utils";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const profile = await getUserProfileById(params.id);

  if (!profile) {
    return { title: "Profile Not Found" };
  }

  return {
    title: `${profile.display_name} - Business Card`,
    description: `Business Card for ${profile.display_name}`,
  };
}

export default async function BusinessCardPage(props: Props) {
  const params = await props.params;
  const profileId = params.id;

  if (!isValidUUID(profileId)) {
    notFound();
  }

  const session = await getSession();
  const user = session?.user;
  const supabase = await createClient();

  const profile = await getUserProfileById(profileId);
  if (!profile) {
    notFound();
  }

  const businessCard = await getBusinessCardByProfileId(profileId);

  // Check ownership
  let isOwner = false;
  if (user) {
    const { data: rootAccount } = await supabase
      .from("root_accounts")
      .select("id")
      .eq("auth_user_id", user.id)
      .single();

    if (rootAccount && rootAccount.id === profile.root_account_id) {
      isOwner = true;
    }
  }

  // Fetch Works
  const { data: worksData } = await supabase
    .from("user_profile_works")
    .select(
      `
        tier,
        work:works (
            id,
            title,
            creator_name
        )
    `
    )
    .eq("user_profile_id", profileId);

  const works: Work[] = (worksData || []).map((item: any) => ({
    id: item.work.id,
    title: item.work.title,
    category: item.work.creator_name,
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
