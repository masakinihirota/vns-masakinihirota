import { MockSupabaseClient } from "./supabase-types";
import { TestDataFactory } from "./supabase-factory";

/**
 * テストデータをセットアップする関数
 * @param client モックSupabaseクライアント
 * @param options セットアップオプション
 */
export function setupTestData(
  client: MockSupabaseClient,
  options: {
    userId?: string;
    includeProfiles?: boolean;
    includeWorks?: boolean;
    includeSkills?: boolean;
    includeGroups?: boolean;
    includeNotifications?: boolean;
    includeTags?: boolean;
    includeGenres?: boolean;
    includeRelationships?: boolean;
    includeSkillHistories?: boolean;
    includeMandalaSheets?: boolean;
    profileCount?: number;
    workCount?: number;
    skillCount?: number;
    groupCount?: number;
    tagCount?: number;
    genreCount?: number;
    notificationCount?: number;
    useComplexRelationships?: boolean;
  } = {},
) {
  const {
    userId = "test-user-id",
    includeProfiles = true,
    includeWorks = true,
    includeSkills = true,
    includeGroups = true,
    includeNotifications = true,
    includeTags = true,
    includeGenres = true,
    includeRelationships = true,
    includeSkillHistories = true,
    includeMandalaSheets = true,
    profileCount = 5,
    workCount = 10,
    skillCount = 8,
    groupCount = 3,
    tagCount = 15,
    genreCount = 8,
    notificationCount = 7,
    useComplexRelationships = false,
  } = options;

  // 複雑なリレーションシップを使用する場合
  if (useComplexRelationships) {
    const dataSet = TestDataFactory.createCompleteTestDataSet(profileCount, {
      worksPerUser: Math.ceil(workCount / profileCount),
      skillsPerUser: Math.ceil(skillCount / profileCount),
      tagsCount: tagCount,
      genresCount: genreCount,
      groupsCount: groupCount,
    });

    // データをクライアントにセット
    if (includeProfiles) {
      client._setMockData("profiles", dataSet.profiles);
    }

    if (includeWorks) {
      client._setMockData("works", dataSet.works);
    }

    if (includeSkills) {
      client._setMockData("skills", dataSet.skills);
    }

    if (includeSkillHistories) {
      client._setMockData("skill_progress_history", dataSet.skillHistories);
    }

    if (includeTags) {
      client._setMockData("tags", dataSet.tags);
    }

    if (includeGenres) {
      client._setMockData("genres", dataSet.genres);
    }

    if (includeRelationships) {
      client._setMockData("work_tags", dataSet.workTags);
      client._setMockData("work_authors", dataSet.workAuthors);
    }

    if (includeGroups) {
      client._setMockData("groups", dataSet.groups);
      client._setMockData("group_members", dataSet.groupMembers);
    }

    if (includeMandalaSheets) {
      client._setMockData("mandala_sheets", dataSet.mandalaSheets);
      client._setMockData("mandala_sheet_cells", dataSet.mandalaCells);
    }

    if (includeNotifications) {
      client._setMockData("notifications", dataSet.notifications);
    }

    // RPC関数の設定
    setupRpcFunctions(client, userId, dataSet);

    return client;
  }

  // 従来の方法（単一ユーザー中心）
  // 自分のプロファイル
  const myProfile = TestDataFactory.createUserProfile({
    id: "1",
    user_id: userId,
    username: "testuser",
    display_name: "テストユーザー",
    bio: "テスト用のプロフィールです",
  });

  // 他のユーザープロファイル
  const otherProfiles = TestDataFactory.createUserProfiles(profileCount - 1);
  const profiles = [myProfile, ...otherProfiles];

  // プロファイルデータをセット
  if (includeProfiles) {
    client._setMockData("profiles", profiles);
  }

  // 自分の作品
  const myWorks = TestDataFactory.createWorks(Math.ceil(workCount / 2), {
    user_id: userId,
  });

  // 他のユーザーの作品
  const otherWorks = TestDataFactory.createWorks(Math.floor(workCount / 2), {
    user_id: otherProfiles[0].user_id,
  });
  const works = [...myWorks, ...otherWorks];

  // 作品データをセット
  if (includeWorks) {
    client._setMockData("works", works);
  }

  // 自分のスキル
  const mySkills = TestDataFactory.createSkills(Math.ceil(skillCount / 2), {
    user_id: userId,
  });

  // 他のユーザーのスキル
  const otherSkills = TestDataFactory.createSkills(Math.floor(skillCount / 2), {
    user_id: otherProfiles[0].user_id,
  });
  const skills = [...mySkills, ...otherSkills];

  // スキルデータをセット
  if (includeSkills) {
    client._setMockData("skills", skills);
  }

  // スキル進捗履歴
  if (includeSkillHistories) {
    const skillHistories = skills.flatMap((skill) =>
      TestDataFactory.createSkillProgressHistories(skill, 3),
    );
    client._setMockData("skill_progress_history", skillHistories);
  }

  // タグとジャンル
  const tags = TestDataFactory.createTags(tagCount);
  const genres = TestDataFactory.createGenres(genreCount);

  if (includeTags) {
    client._setMockData("tags", tags);
  }

  if (includeGenres) {
    client._setMockData("genres", genres);
  }

  // 作品とタグの関連付け
  if (includeRelationships && includeWorks && includeTags) {
    const workTags = TestDataFactory.createWorkTags(works, tags);
    client._setMockData("work_tags", workTags);
  }

  // 作品と著者の関連付け
  if (includeRelationships && includeWorks && includeProfiles) {
    const workAuthors = TestDataFactory.createWorkAuthors(works, profiles);
    client._setMockData("work_authors", workAuthors);
  }

  // グループ
  const groups = TestDataFactory.createGroups(groupCount);

  // グループメンバー
  const groupMembers = [
    // 自分が管理者のグループ
    TestDataFactory.createGroupMember({
      id: "1",
      group_id: groups[0].id,
      user_id: userId,
      role: "admin",
    }),
    // 自分がメンバーのグループ
    TestDataFactory.createGroupMember({
      id: "2",
      group_id: groups[1].id,
      user_id: userId,
      role: "member",
    }),
    // 他のユーザーが管理者のグループ
    TestDataFactory.createGroupMember({
      id: "3",
      group_id: groups[1].id,
      user_id: otherProfiles[0].user_id,
      role: "admin",
    }),
    // 他のユーザーがメンバーのグループ
    TestDataFactory.createGroupMember({
      id: "4",
      group_id: groups[0].id,
      user_id: otherProfiles[1].user_id,
      role: "member",
    }),
  ];

  // グループデータをセット
  if (includeGroups) {
    client._setMockData("groups", groups);
    client._setMockData("group_members", groupMembers);
  }

  // マンダラシート
  if (includeMandalaSheets) {
    const mandalaSheets = [];
    const mandalaCells = [];

    // 自分のマンダラシート
    const myMandalaData = TestDataFactory.createCompleteMandalaSheet({
      user_id: userId,
    });
    mandalaSheets.push(myMandalaData.sheet);
    mandalaCells.push(...myMandalaData.cells);

    // 他のユーザーのマンダラシート
    otherProfiles.slice(0, 2).forEach((profile) => {
      const mandalaData = TestDataFactory.createCompleteMandalaSheet({
        user_id: profile.user_id,
      });
      mandalaSheets.push(mandalaData.sheet);
      mandalaCells.push(...mandalaData.cells);
    });

    client._setMockData("mandala_sheets", mandalaSheets);
    client._setMockData("mandala_sheet_cells", mandalaCells);
  }

  // 自分の通知
  const myNotifications = TestDataFactory.createNotifications(
    Math.ceil(notificationCount / 2),
    {
      user_id: userId,
    },
  );

  // 他のユーザーの通知
  const otherNotifications = TestDataFactory.createNotifications(
    Math.floor(notificationCount / 2),
    {
      user_id: otherProfiles[0].user_id,
    },
  );

  // 通知データをセット
  if (includeNotifications) {
    client._setMockData("notifications", [
      ...myNotifications,
      ...otherNotifications,
    ]);
  }

  // RPC関数の設定
  setupRpcFunctions(client, userId, {
    profiles,
    works,
    skills,
    groups,
    groupMembers,
  });

  return client;
}

/**
 * RPC関数をセットアップする
 * @param client モックSupabaseクライアント
 * @param userId 現在のユーザーID
 * @param dataSet データセット
 */
function setupRpcFunctions(
  client: MockSupabaseClient,
  userId: string,
  dataSet: any,
) {
  const { profiles, works, skills, groupMembers } = dataSet;

  client._setMockFunction("get_user_stats", (params) => {
    const { user_id } = params;
    const userWorks = works.filter((w) => w.user_id === user_id);
    const userSkills = skills.filter((s) => s.user_id === user_id);
    const userGroups = groupMembers
      ? groupMembers.filter((m) => m.user_id === user_id)
      : [];

    if (user_id === userId) {
      return {
        works_count: userWorks.length,
        skills_count: userSkills.length,
        groups_count: userGroups.length,
        followers_count: 10,
        following_count: 5,
      };
    }
    return {
      works_count: userWorks.length,
      skills_count: userSkills.length,
      groups_count: userGroups.length,
      followers_count: 5,
      following_count: 2,
    };
  });

  client._setMockFunction("search_users", (params) => {
    const { query } = params;
    return profiles.filter(
      (p) =>
        p.username.includes(query) ||
        p.display_name.includes(query) ||
        p.bio.includes(query),
    );
  });

  client._setMockFunction("get_recommended_users", (params) => {
    const { limit = 5 } = params;
    return profiles.filter((p) => p.user_id !== userId).slice(0, limit);
  });
}
