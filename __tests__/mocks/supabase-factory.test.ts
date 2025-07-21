import { describe, it, expect } from "vitest";
import { TestDataFactory } from "./supabase-factory";

describe("TestDataFactory", () => {
  describe("createUserProfile", () => {
    it("デフォルト値でユーザープロファイルを生成できること", () => {
      const profile = TestDataFactory.createUserProfile();

      expect(profile).toHaveProperty("id");
      expect(profile).toHaveProperty("user_id");
      expect(profile).toHaveProperty("username");
      expect(profile).toHaveProperty("display_name");
      expect(profile).toHaveProperty("bio");
      expect(profile).toHaveProperty("avatar_url");
      expect(profile).toHaveProperty("created_at");
      expect(profile).toHaveProperty("updated_at");
    });

    it("カスタム値でユーザープロファイルを生成できること", () => {
      const profile = TestDataFactory.createUserProfile({
        id: "custom-id",
        user_id: "custom-user-id",
        username: "customuser",
        display_name: "カスタムユーザー",
        bio: "カスタムバイオ",
      });

      expect(profile.id).toBe("custom-id");
      expect(profile.user_id).toBe("custom-user-id");
      expect(profile.username).toBe("customuser");
      expect(profile.display_name).toBe("カスタムユーザー");
      expect(profile.bio).toBe("カスタムバイオ");
    });
  });

  describe("createUserProfiles", () => {
    it("指定した数のユーザープロファイルを生成できること", () => {
      const profiles = TestDataFactory.createUserProfiles(3);

      expect(profiles).toHaveLength(3);
      expect(profiles[0].id).toBe("profile-1");
      expect(profiles[1].id).toBe("profile-2");
      expect(profiles[2].id).toBe("profile-3");
    });

    it("共通のカスタム値を適用できること", () => {
      const profiles = TestDataFactory.createUserProfiles(2, {
        bio: "共通のバイオ",
      });

      expect(profiles).toHaveLength(2);
      expect(profiles[0].bio).toBe("共通のバイオ");
      expect(profiles[1].bio).toBe("共通のバイオ");
    });
  });

  describe("createWork", () => {
    it("デフォルト値で作品データを生成できること", () => {
      const work = TestDataFactory.createWork();

      expect(work).toHaveProperty("id");
      expect(work).toHaveProperty("user_id");
      expect(work).toHaveProperty("title");
      expect(work).toHaveProperty("description");
      expect(work).toHaveProperty("image_url");
      expect(work).toHaveProperty("created_at");
      expect(work).toHaveProperty("updated_at");
    });

    it("カスタム値で作品データを生成できること", () => {
      const work = TestDataFactory.createWork({
        id: "custom-work-id",
        user_id: "custom-user-id",
        title: "カスタムタイトル",
        description: "カスタム説明",
      });

      expect(work.id).toBe("custom-work-id");
      expect(work.user_id).toBe("custom-user-id");
      expect(work.title).toBe("カスタムタイトル");
      expect(work.description).toBe("カスタム説明");
    });
  });

  describe("createWorks", () => {
    it("指定した数の作品データを生成できること", () => {
      const works = TestDataFactory.createWorks(3);

      expect(works).toHaveLength(3);
      expect(works[0].id).toBe("work-1");
      expect(works[1].id).toBe("work-2");
      expect(works[2].id).toBe("work-3");
    });
  });

  describe("createSkill", () => {
    it("デフォルト値でスキルデータを生成できること", () => {
      const skill = TestDataFactory.createSkill();

      expect(skill).toHaveProperty("id");
      expect(skill).toHaveProperty("user_id");
      expect(skill).toHaveProperty("name");
      expect(skill).toHaveProperty("level");
      expect(skill).toHaveProperty("created_at");
      expect(skill).toHaveProperty("updated_at");
      expect(skill.level).toBeGreaterThanOrEqual(1);
      expect(skill.level).toBeLessThanOrEqual(5);
    });
  });

  describe("createGroup", () => {
    it("デフォルト値でグループデータを生成できること", () => {
      const group = TestDataFactory.createGroup();

      expect(group).toHaveProperty("id");
      expect(group).toHaveProperty("name");
      expect(group).toHaveProperty("description");
      expect(group).toHaveProperty("created_at");
      expect(group).toHaveProperty("updated_at");
    });
  });

  describe("createNotification", () => {
    it("デフォルト値で通知データを生成できること", () => {
      const notification = TestDataFactory.createNotification();

      expect(notification).toHaveProperty("id");
      expect(notification).toHaveProperty("user_id");
      expect(notification).toHaveProperty("type");
      expect(notification).toHaveProperty("content");
      expect(notification).toHaveProperty("read");
      expect(notification).toHaveProperty("created_at");
    });

    it("タイプに応じた内容が生成されること", () => {
      const messageNotification = TestDataFactory.createNotification({
        type: "message",
      });
      expect(messageNotification.content).toContain("メッセージ");

      const likeNotification = TestDataFactory.createNotification({
        type: "like",
      });
      expect(likeNotification.content).toContain("いいね");

      const followNotification = TestDataFactory.createNotification({
        type: "follow",
      });
      expect(followNotification.content).toContain("フォロワー");
    });
  });

  describe("createCompleteUserDataSet", () => {
    it("関連データを含む完全なユーザーデータセットを生成できること", () => {
      const dataSet = TestDataFactory.createCompleteUserDataSet();

      expect(dataSet).toHaveProperty("profile");
      expect(dataSet).toHaveProperty("works");
      expect(dataSet).toHaveProperty("skills");
      expect(dataSet).toHaveProperty("groups");
      expect(dataSet).toHaveProperty("groupMembers");
      expect(dataSet).toHaveProperty("notifications");

      expect(dataSet.works).toHaveLength(3);
      expect(dataSet.skills).toHaveLength(5);
      expect(dataSet.groups).toHaveLength(2);
      expect(dataSet.groupMembers).toHaveLength(2);
      expect(dataSet.notifications).toHaveLength(5);

      // ユーザーIDが一貫していることを確認
      const userId = dataSet.profile.user_id;
      expect(dataSet.works.every((work) => work.user_id === userId)).toBe(true);
      expect(dataSet.skills.every((skill) => skill.user_id === userId)).toBe(
        true,
      );
      expect(
        dataSet.groupMembers.every((member) => member.user_id === userId),
      ).toBe(true);
      expect(
        dataSet.notifications.every(
          (notification) => notification.user_id === userId,
        ),
      ).toBe(true);
    });

    it("カスタムユーザーIDでデータセットを生成できること", () => {
      const userId = "custom-user-id";
      const dataSet = TestDataFactory.createCompleteUserDataSet({
        user_id: userId,
      });

      expect(dataSet.profile.user_id).toBe(userId);
      expect(dataSet.works.every((work) => work.user_id === userId)).toBe(true);
      expect(dataSet.skills.every((skill) => skill.user_id === userId)).toBe(
        true,
      );
      expect(
        dataSet.groupMembers.every((member) => member.user_id === userId),
      ).toBe(true);
      expect(
        dataSet.notifications.every(
          (notification) => notification.user_id === userId,
        ),
      ).toBe(true);
    });
  });
});
