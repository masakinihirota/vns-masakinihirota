import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/helper";
import { Profile } from "@/components/profile-creation-1000masks/profile-creation-1000masks.logic";
import * as userProfilesDb from "@/lib/db/user-profiles";

// DrizzleのUserProfile型と共通化しつつ、外のProfile型とのマッピングを行う
export async function GET(_req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const dbProfiles = await userProfilesDb.getUserProfilesByAuthUserId(
      session.user.id
    );

    // DBの構造から ProfileCreation ツール用の型に変換
    const profiles: Profile[] = dbProfiles.map((p) => {
      const extra = p.external_links || {};
      return {
        id: p.id,
        name: p.display_name,
        constellationName: extra.constellationName || "",
        constellationHistory: extra.constellationHistory || [],
        historyPointer: extra.historyPointer || 0,
        avatarType: extra.avatarType || "mask",
        maskId: extra.maskId || "1",
        isGhost: extra.isGhost || false,
        selectedTypeId: extra.selectedTypeId || null,
        selectedObjectiveIds: extra.selectedObjectiveIds || [],
        selectedSlots: extra.selectedSlots || [],
        selectedValues: extra.selectedValues || [],
        workSetId: extra.workSetId,
        skillSetId: extra.skillSetId,
      };
    });

    return NextResponse.json(profiles);
  } catch (error) {
    console.error("Failed to fetch profiles:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const profiles: Profile[] = await req.json();
    const rootAccount = await userProfilesDb.getRootAccountByAuthUserId(
      session.user.id
    );

    if (!rootAccount) {
      return NextResponse.json(
        { error: "Root account not found" },
        { status: 404 }
      );
    }

    const results = [];
    for (const profile of profiles) {
      if (profile.isGhost) continue; // 幽霊は保存しない

      const extra = {
        constellationName: profile.constellationName,
        constellationHistory: profile.constellationHistory,
        historyPointer: profile.historyPointer,
        avatarType: profile.avatarType,
        maskId: profile.maskId,
        isGhost: profile.isGhost,
        selectedTypeId: profile.selectedTypeId,
        selectedObjectiveIds: profile.selectedObjectiveIds,
        selectedSlots: profile.selectedSlots,
        selectedValues: profile.selectedValues,
        workSetId: profile.workSetId,
        skillSetId: profile.skillSetId,
      };

      const data = {
        display_name: profile.name,
        external_links: extra,
        // 必要に応じて他のフィールドもマッピング
      };

      // IDが既存のUUIDなら更新、そうでなければ新規作成
      const existing = await userProfilesDb.getUserProfileById(profile.id);
      if (existing && existing.root_account_id === rootAccount.id) {
        const updated = await userProfilesDb.updateUserProfile(
          profile.id,
          data
        );
        results.push(updated);
      } else {
        const created = await userProfilesDb.createUserProfile(
          rootAccount.id,
          data
        );
        results.push(created);
      }
    }

    return NextResponse.json({
      message: "Successfully synced profiles",
      results,
    });
  } catch (error) {
    console.error("Failed to save profiles:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

