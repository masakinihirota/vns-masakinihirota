import { describe, it, expect } from "vitest";
import { TestDataFactory } from "./supabase-factory";

describe("TestDataFactory", () => {
  describe("基本的なエンティティ生成", () => {
    it("ユーザープロファイルを生成できる", () => {
      const profile = TestDataFactory.createUserProfile();
      expect(profile).toHaveProperty("id");
      expect(profile).toHaveProperty("user_id");
      expect(profile).toHaveProperty("username");
      expect(profile).toHaveProperty("display_name");
      expect(profile).toHaveProperty("bio");
      expect(profile).toHaveProperty("avatar_url");
    });

    it("作品データを生成できる", () => {
      const work = TestDataFactory.createWork();
      expect(work).toHaveProperty("id");
      expect(work).toHaveProperty("user_id");
      expect(work).toHaveProperty("title");
      expect(work).toHaveProperty("description");
    });

    it("スキルデータを生成できる", () => {
      const skill = TestDataFactory.createSkill();
      expect(skill).toHaveProperty("id");
      expect(skill).toHaveProperty("user_id");
      expect(skill).toHaveProperty("name");
      expect(skill).toHaveProperty("level");
      expect(skill.level).toBeGreaterThanOrEqual(1);
      expect(skill.level).toBeLessThanOrEqual(5);
    });

    it("タグデータを生成できる", () => {
      const tag = TestDataFactory.createTag();
      expect(tag).toHaveProperty("id");
      expect(tag).toHaveProperty("name");
      expect(tag).toHaveProperty("description");
    });

    it("ジャンルデータを生成できる", () => {
      const genre = TestDataFactory.createGenre();
      expect(genre).toHaveProperty("id");
      expect(genre).toHaveProperty("name");
      expect(genre).toHaveProperty("description");
    });
  });

  describe("複数エンティティの生成", () => {
    it("複数のユーザープロファイルを生成できる", () => {
      const profiles = TestDataFactory.createUserProfiles(3);
      expect(profiles).toHaveLength(3);
      expect(profiles[0].id).not.toBe(profiles[1].id);
      expect(profiles[0].user_id).not.toBe(profiles[1].user_id);
    });

    it("複数の作品データを生成できる", () => {
      const works = TestDataFactory.createWorks(3);
      expect(works).toHaveLength(3);
      expect(works[0].id).not.toBe(works[1].id);
    });

    it("複数のスキルデータを生成できる", () => {
      const skills = TestDataFactory.createSkills(3);
      expect(skills).toHaveLength(3);
      expect(skills[0].id).not.toBe(skills[1].id);
    });

    it("複数のタグデータを生成できる", () => {
      const tags = TestDataFactory.createTags(5);
      expect(tags).toHaveLength(5);
      expect(tags[0].id).not.toBe(tags[1].id);
    });
  });

  describe("カスタマイズ可能なデータ生成", () => {
    it("カスタムフィールドでユーザープロファイルを生成できる", () => {
      const customProfile = TestDataFactory.createUserProfile({
        username: "custom_user",
        display_name: "カスタムユーザー",
        bio: "カスタムプロフィール",
      });
      expect(customProfile.username).toBe("custom_user");
      expect(customProfile.display_name).toBe("カスタムユーザー");
      expect(customProfile.bio).toBe("カスタムプロフィール");
    });

    it("カスタムフィールドで作品データを生成できる", () => {
      const customWork = TestDataFactory.createWork({
        title: "カスタム作品",
        description: "カスタム説明",
      });
      expect(customWork.title).toBe("カスタム作品");
      expect(customWork.description).toBe("カスタム説明");
    });

    it("カスタムフィールドでスキルデータを生成できる", () => {
      const customSkill = TestDataFactory.createSkill({
        name: "カスタムスキル",
        level: 5,
      });
      expect(customSkill.name).toBe("カスタムスキル");
      expect(customSkill.level).toBe(5);
    });
  });

  describe("リレーションシップを含むデータ生成", () => {
    it("作品とタグの関連付けデータを生成できる", () => {
      const works = TestDataFactory.createWorks(2);
      const tags = TestDataFactory.createTags(3);
      const workTags = TestDataFactory.createWorkTags(works, tags, 2);

      // 各作品に1〜2個のタグが関連付けられているはず
      const workTagsByWork = workTags.reduce((acc, wt) => {
        acc[wt.work_id] = (acc[wt.work_id] || 0) + 1;
        return acc;
      }, {});

      Object.values(workTagsByWork).forEach((count) => {
        expect(count).toBeGreaterThanOrEqual(1);
        expect(count).toBeLessThanOrEqual(2);
      });
    });

    it("作品と著者の関連付けデータを生成できる", () => {
      const works = TestDataFactory.createWorks(2);
      const profiles = TestDataFactory.createUserProfiles(3);
      const workAuthors = TestDataFactory.createWorkAuthors(works, profiles, 2);

      // 各作品に1〜2人の著者が関連付けられているはず
      const authorsByWork = workAuthors.reduce((acc, wa) => {
        acc[wa.work_id] = (acc[wa.work_id] || 0) + 1;
        return acc;
      }, {});

      Object.values(authorsByWork).forEach((count) => {
        expect(count).toBeGreaterThanOrEqual(1);
        expect(count).toBeLessThanOrEqual(2);
      });

      // 主著者が含まれているか確認
      works.forEach((work) => {
        const hasMainAuthor = workAuthors.some(
          (wa) =>
            wa.work_id === work.id &&
            wa.user_id === work.user_id &&
            wa.role === "主著者",
        );
        expect(hasMainAuthor).toBe(true);
      });
    });

    it("スキル進捗履歴データを生成できる", () => {
      const skill = TestDataFactory.createSkill();
      const histories = TestDataFactory.createSkillProgressHistories(skill, 3);

      expect(histories).toHaveLength(3);
      histories.forEach((history) => {
        expect(history.skill_id).toBe(skill.id);
        expect(history.level).toBeGreaterThanOrEqual(1);
        expect(history.level).toBeLessThanOrEqual(5);
      });
    });
  });

  describe("複雑なデータセット生成", () => {
    it("完全なユーザーデータセットを生成できる", () => {
      const userId = "test-user-123";
      const dataSet = TestDataFactory.createCompleteUserDataSet({
        user_id: userId,
      });

      expect(dataSet.profile.user_id).toBe(userId);
      expect(dataSet.works.every((w) => w.user_id === userId)).toBe(true);
      expect(dataSet.skills.every((s) => s.user_id === userId)).toBe(true);
      expect(dataSet.notifications.every((n) => n.user_id === userId)).toBe(
        true,
      );

      // リレーションシップの確認
      expect(dataSet.workTags.length).toBeGreaterThan(0);
      expect(dataSet.skillHistories.length).toBeGreaterThan(0);
      expect(dataSet.mandalaSheet.user_id).toBe(userId);
      expect(
        dataSet.mandalaCells.every(
          (c) => c.sheet_id === dataSet.mandalaSheet.id,
        ),
      ).toBe(true);
    });

    it("複雑なリレーションシップを持つ完全なテストデータセットを生成できる", () => {
      const dataSet = TestDataFactory.createCompleteTestDataSet(3, {
        worksPerUser: 2,
        skillsPerUser: 2,
        tagsCount: 5,
        genresCount: 3,
        groupsCount: 2,
      });

      expect(dataSet.profiles).toHaveLength(3);
      expect(dataSet.works).toHaveLength(6); // 3ユーザー × 2作品
      expect(dataSet.skills).toHaveLength(6); // 3ユーザー × 2スキル
      expect(dataSet.tags).toHaveLength(5);
      expect(dataSet.genres).toHaveLength(3);
      expect(dataSet.groups).toHaveLength(2);

      // リレーションシップの確認
      expect(dataSet.workTags.length).toBeGreaterThan(0);
      expect(dataSet.workAuthors.length).toBeGreaterThan(0);
      expect(dataSet.skillHistories.length).toBeGreaterThan(0);
      expect(dataSet.groupMembers.length).toBeGreaterThan(0);
      expect(dataSet.mandalaSheets).toHaveLength(3); // 各ユーザーに1つ
      expect(dataSet.mandalaCells.length).toBe(3 * 9); // 3ユーザー × 9セル
    });
  });
});
