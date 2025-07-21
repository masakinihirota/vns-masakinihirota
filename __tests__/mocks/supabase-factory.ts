import { v4 as uuidv4 } from "uuid";
import { faker } from "@faker-js/faker/locale/ja";

/**
 * テストデータファクトリー
 * テスト用のデータを生成するためのユーティリティ関数群
 */
export class TestDataFactory {
  /**
   * ランダムな日付を生成（過去1年以内）
   * @returns ISO形式の日付文字列
   */
  static randomDate(startDate?: Date, endDate?: Date): string {
    const start = startDate || new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
    const end = endDate || new Date();

    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime()),
    ).toISOString();
  }

  /**
   * 配列からランダムな要素を選択
   * @param array 選択元の配列
   * @returns ランダムに選択された要素
   */
  static randomFromArray<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * ユーザープロファイルを生成
   * @param overrides カスタムフィールド
   * @returns ユーザープロファイル
   */
  static createUserProfile(overrides: Partial<any> = {}) {
    const id = overrides.id || uuidv4();
    const userId = overrides.user_id || `user-${uuidv4()}`;

    return {
      id,
      user_id: userId,
      username: overrides.username || `user_${id.substring(0, 8)}`,
      display_name: overrides.display_name || `ユーザー ${id.substring(0, 8)}`,
      bio: overrides.bio || "これはテスト用のプロフィールです。",
      avatar_url:
        overrides.avatar_url || `https://example.com/avatars/${id}.png`,
      created_at: overrides.created_at || this.randomDate(),
      updated_at: overrides.updated_at || new Date().toISOString(),
      ...overrides,
    };
  }

  /**
   * 複数のユーザープロファイルを生成
   * @param count 生成する数
   * @param baseOverrides 共通のカスタムフィールド
   * @returns ユーザープロファイルの配列
   */
  static createUserProfiles(count: number, baseOverrides: Partial<any> = {}) {
    return Array.from({ length: count }, (_, i) =>
      this.createUserProfile({
        ...baseOverrides,
        id: baseOverrides.id || `profile-${i + 1}`,
        username: baseOverrides.username || `user_${i + 1}`,
      }),
    );
  }

  /**
   * 作品データを生成
   * @param overrides カスタムフィールド
   * @returns 作品データ
   */
  static createWork(overrides: Partial<any> = {}) {
    const id = overrides.id || uuidv4();
    const userId = overrides.user_id || `user-${uuidv4()}`;

    return {
      id,
      user_id: userId,
      title: overrides.title || `テスト作品 ${id.substring(0, 8)}`,
      description: overrides.description || "これはテスト用の作品説明です。",
      image_url: overrides.image_url || `https://example.com/works/${id}.png`,
      created_at: overrides.created_at || new Date().toISOString(),
      updated_at: overrides.updated_at || new Date().toISOString(),
      ...overrides,
    };
  }

  /**
   * 複数の作品データを生成
   * @param count 生成する数
   * @param baseOverrides 共通のカスタムフィールド
   * @returns 作品データの配列
   */
  static createWorks(count: number, baseOverrides: Partial<any> = {}) {
    return Array.from({ length: count }, (_, i) =>
      this.createWork({
        ...baseOverrides,
        id: baseOverrides.id || `work-${i + 1}`,
        title: baseOverrides.title || `テスト作品 ${i + 1}`,
      }),
    );
  }

  /**
   * スキルデータを生成
   * @param overrides カスタムフィールド
   * @returns スキルデータ
   */
  static createSkill(overrides: Partial<any> = {}) {
    const id = overrides.id || uuidv4();
    const userId = overrides.user_id || `user-${uuidv4()}`;
    const skills = [
      "JavaScript",
      "TypeScript",
      "React",
      "Vue",
      "Angular",
      "Node.js",
      "Python",
      "Java",
      "C#",
      "PHP",
      "HTML",
      "CSS",
      "Sass",
      "GraphQL",
      "REST API",
      "Docker",
      "Kubernetes",
      "AWS",
      "Azure",
      "GCP",
    ];

    return {
      id,
      user_id: userId,
      name: overrides.name || skills[Math.floor(Math.random() * skills.length)],
      level: overrides.level || Math.floor(Math.random() * 5) + 1,
      created_at: overrides.created_at || new Date().toISOString(),
      updated_at: overrides.updated_at || new Date().toISOString(),
      ...overrides,
    };
  }

  /**
   * 複数のスキルデータを生成
   * @param count 生成する数
   * @param baseOverrides 共通のカスタムフィールド
   * @returns スキルデータの配列
   */
  static createSkills(count: number, baseOverrides: Partial<any> = {}) {
    const skills = [
      "JavaScript",
      "TypeScript",
      "React",
      "Vue",
      "Angular",
      "Node.js",
      "Python",
      "Java",
      "C#",
      "PHP",
      "HTML",
      "CSS",
      "Sass",
      "GraphQL",
      "REST API",
      "Docker",
      "Kubernetes",
      "AWS",
      "Azure",
      "GCP",
    ];

    return Array.from({ length: count }, (_, i) =>
      this.createSkill({
        ...baseOverrides,
        id: baseOverrides.id || `skill-${i + 1}`,
        name: baseOverrides.name || skills[i % skills.length],
      }),
    );
  }

  /**
   * グループデータを生成
   * @param overrides カスタムフィールド
   * @returns グループデータ
   */
  static createGroup(overrides: Partial<any> = {}) {
    const id = overrides.id || uuidv4();

    return {
      id,
      name: overrides.name || `テストグループ ${id.substring(0, 8)}`,
      description: overrides.description || "これはテスト用のグループです。",
      created_at: overrides.created_at || new Date().toISOString(),
      updated_at: overrides.updated_at || new Date().toISOString(),
      ...overrides,
    };
  }

  /**
   * 複数のグループデータを生成
   * @param count 生成する数
   * @param baseOverrides 共通のカスタムフィールド
   * @returns グループデータの配列
   */
  static createGroups(count: number, baseOverrides: Partial<any> = {}) {
    return Array.from({ length: count }, (_, i) =>
      this.createGroup({
        ...baseOverrides,
        id: baseOverrides.id || `group-${i + 1}`,
        name: baseOverrides.name || `テストグループ ${i + 1}`,
      }),
    );
  }

  /**
   * グループメンバーデータを生成
   * @param overrides カスタムフィールド
   * @returns グループメンバーデータ
   */
  static createGroupMember(overrides: Partial<any> = {}) {
    const id = overrides.id || uuidv4();
    const groupId = overrides.group_id || `group-${uuidv4()}`;
    const userId = overrides.user_id || `user-${uuidv4()}`;
    const roles = ["admin", "member", "moderator"];

    return {
      id,
      group_id: groupId,
      user_id: userId,
      role: overrides.role || roles[Math.floor(Math.random() * roles.length)],
      created_at: overrides.created_at || new Date().toISOString(),
      ...overrides,
    };
  }

  /**
   * 複数のグループメンバーデータを生成
   * @param count 生成する数
   * @param baseOverrides 共通のカスタムフィールド
   * @returns グループメンバーデータの配列
   */
  static createGroupMembers(count: number, baseOverrides: Partial<any> = {}) {
    return Array.from({ length: count }, (_, i) =>
      this.createGroupMember({
        ...baseOverrides,
        id: baseOverrides.id || `group-member-${i + 1}`,
      }),
    );
  }

  /**
   * 通知データを生成
   * @param overrides カスタムフィールド
   * @returns 通知データ
   */
  static createNotification(overrides: Partial<any> = {}) {
    const id = overrides.id || uuidv4();
    const userId = overrides.user_id || `user-${uuidv4()}`;
    const types = ["message", "like", "follow", "comment", "mention"];
    const type =
      overrides.type || types[Math.floor(Math.random() * types.length)];

    let content = "";
    switch (type) {
      case "message":
        content = "新しいメッセージがあります";
        break;
      case "like":
        content = "あなたの作品がいいねされました";
        break;
      case "follow":
        content = "新しいフォロワーがいます";
        break;
      case "comment":
        content = "あなたの作品にコメントがつきました";
        break;
      case "mention":
        content = "あなたがメンションされました";
        break;
      default:
        content = "新しい通知があります";
    }

    return {
      id,
      user_id: userId,
      type,
      content: overrides.content || content,
      read: overrides.read !== undefined ? overrides.read : Math.random() > 0.5,
      created_at: overrides.created_at || new Date().toISOString(),
      ...overrides,
    };
  }

  /**
   * 複数の通知データを生成
   * @param count 生成する数
   * @param baseOverrides 共通のカスタムフィールド
   * @returns 通知データの配列
   */
  static createNotifications(count: number, baseOverrides: Partial<any> = {}) {
    return Array.from({ length: count }, (_, i) =>
      this.createNotification({
        ...baseOverrides,
        id: baseOverrides.id || `notification-${i + 1}`,
      }),
    );
  }

  /**
   * タグデータを生成
   * @param overrides カスタムフィールド
   * @returns タグデータ
   */
  static createTag(overrides: Partial<any> = {}) {
    const id = overrides.id || uuidv4();
    const tags = [
      "プログラミング",
      "デザイン",
      "イラスト",
      "3DCG",
      "アニメーション",
      "ゲーム開発",
      "Web開発",
      "モバイルアプリ",
      "UI/UX",
      "グラフィック",
      "キャラクターデザイン",
      "背景",
      "音楽",
      "サウンドエフェクト",
      "シナリオ",
    ];

    return {
      id,
      name: overrides.name || this.randomFromArray(tags),
      description: overrides.description || faker.lorem.sentence(),
      created_at: overrides.created_at || this.randomDate(),
      updated_at: overrides.updated_at || new Date().toISOString(),
      ...overrides,
    };
  }

  /**
   * 複数のタグデータを生成
   * @param count 生成する数
   * @param baseOverrides 共通のカスタムフィールド
   * @returns タグデータの配列
   */
  static createTags(count: number, baseOverrides: Partial<any> = {}) {
    const tags = [
      "プログラミング",
      "デザイン",
      "イラスト",
      "3DCG",
      "アニメーション",
      "ゲーム開発",
      "Web開発",
      "モバイルアプリ",
      "UI/UX",
      "グラフィック",
      "キャラクターデザイン",
      "背景",
      "音楽",
      "サウンドエフェクト",
      "シナリオ",
    ];

    return Array.from({ length: count }, (_, i) =>
      this.createTag({
        ...baseOverrides,
        id: baseOverrides.id || `tag-${i + 1}`,
        name: baseOverrides.name || tags[i % tags.length],
      }),
    );
  }

  /**
   * 作品タグの関連付けデータを生成
   * @param overrides カスタムフィールド
   * @returns 作品タグの関連付けデータ
   */
  static createWorkTag(overrides: Partial<any> = {}) {
    const id = overrides.id || uuidv4();
    const workId = overrides.work_id || `work-${uuidv4()}`;
    const tagId = overrides.tag_id || `tag-${uuidv4()}`;

    return {
      id,
      work_id: workId,
      tag_id: tagId,
      created_at: overrides.created_at || this.randomDate(),
      ...overrides,
    };
  }

  /**
   * 複数の作品タグの関連付けデータを生成
   * @param works 作品データの配列
   * @param tags タグデータの配列
   * @param maxTagsPerWork 1作品あたりの最大タグ数
   * @returns 作品タグの関連付けデータの配列
   */
  static createWorkTags(works: any[], tags: any[], maxTagsPerWork: number = 3) {
    const workTags: any[] = [];
    let id = 1;

    works.forEach((work) => {
      // 各作品に1〜maxTagsPerWork個のタグをランダムに割り当て
      const tagCount = Math.floor(Math.random() * maxTagsPerWork) + 1;
      const shuffledTags = [...tags]
        .sort(() => Math.random() - 0.5)
        .slice(0, tagCount);

      shuffledTags.forEach((tag) => {
        workTags.push(
          this.createWorkTag({
            id: `work-tag-${id++}`,
            work_id: work.id,
            tag_id: tag.id,
          }),
        );
      });
    });

    return workTags;
  }

  /**
   * 作品の著者データを生成
   * @param overrides カスタムフィールド
   * @returns 作品の著者データ
   */
  static createWorkAuthor(overrides: Partial<any> = {}) {
    const id = overrides.id || uuidv4();
    const workId = overrides.work_id || `work-${uuidv4()}`;
    const userId = overrides.user_id || `user-${uuidv4()}`;
    const roles = [
      "主著者",
      "共著者",
      "イラストレーター",
      "デザイナー",
      "編集者",
    ];

    return {
      id,
      work_id: workId,
      user_id: userId,
      role: overrides.role || this.randomFromArray(roles),
      created_at: overrides.created_at || this.randomDate(),
      ...overrides,
    };
  }

  /**
   * 複数の作品著者データを生成
   * @param works 作品データの配列
   * @param users ユーザーデータの配列
   * @param maxAuthorsPerWork 1作品あたりの最大著者数
   * @returns 作品著者データの配列
   */
  static createWorkAuthors(
    works: any[],
    users: any[],
    maxAuthorsPerWork: number = 2,
  ) {
    const workAuthors: any[] = [];
    let id = 1;

    works.forEach((work) => {
      // 主著者を追加（作品のuser_idと同じ）
      workAuthors.push(
        this.createWorkAuthor({
          id: `work-author-${id++}`,
          work_id: work.id,
          user_id: work.user_id,
          role: "主著者",
        }),
      );

      // 追加の著者をランダムに割り当て
      if (maxAuthorsPerWork > 1) {
        const coAuthorCount =
          Math.floor(Math.random() * (maxAuthorsPerWork - 1)) + 1;
        const coAuthors = users
          .filter((user) => user.user_id !== work.user_id)
          .sort(() => Math.random() - 0.5)
          .slice(0, coAuthorCount);

        coAuthors.forEach((user) => {
          const roles = ["共著者", "イラストレーター", "デザイナー", "編集者"];
          workAuthors.push(
            this.createWorkAuthor({
              id: `work-author-${id++}`,
              work_id: work.id,
              user_id: user.user_id,
              role: this.randomFromArray(roles),
            }),
          );
        });
      }
    });

    return workAuthors;
  }

  /**
   * ジャンルデータを生成
   * @param overrides カスタムフィールド
   * @returns ジャンルデータ
   */
  static createGenre(overrides: Partial<any> = {}) {
    const id = overrides.id || uuidv4();
    const genres = [
      "ファンタジー",
      "SF",
      "ミステリー",
      "ホラー",
      "アクション",
      "アドベンチャー",
      "ロマンス",
      "コメディ",
      "ドラマ",
      "ヒストリカル",
      "スポーツ",
      "学園",
      "日常",
      "異世界",
      "サスペンス",
    ];

    return {
      id,
      name: overrides.name || this.randomFromArray(genres),
      description: overrides.description || faker.lorem.sentence(),
      created_at: overrides.created_at || this.randomDate(),
      updated_at: overrides.updated_at || new Date().toISOString(),
      ...overrides,
    };
  }

  /**
   * 複数のジャンルデータを生成
   * @param count 生成する数
   * @param baseOverrides 共通のカスタムフィールド
   * @returns ジャンルデータの配列
   */
  static createGenres(count: number, baseOverrides: Partial<any> = {}) {
    const genres = [
      "ファンタジー",
      "SF",
      "ミステリー",
      "ホラー",
      "アクション",
      "アドベンチャー",
      "ロマンス",
      "コメディ",
      "ドラマ",
      "ヒストリカル",
      "スポーツ",
      "学園",
      "日常",
      "異世界",
      "サスペンス",
    ];

    return Array.from({ length: count }, (_, i) =>
      this.createGenre({
        ...baseOverrides,
        id: baseOverrides.id || `genre-${i + 1}`,
        name: baseOverrides.name || genres[i % genres.length],
      }),
    );
  }

  /**
   * マンダラシートデータを生成
   * @param overrides カスタムフィールド
   * @returns マンダラシートデータ
   */
  static createMandalaSheet(overrides: Partial<any> = {}) {
    const id = overrides.id || uuidv4();
    const userId = overrides.user_id || `user-${uuidv4()}`;

    return {
      id,
      user_id: userId,
      title: overrides.title || `マンダラシート ${id.substring(0, 8)}`,
      description: overrides.description || faker.lorem.paragraph(),
      created_at: overrides.created_at || this.randomDate(),
      updated_at: overrides.updated_at || new Date().toISOString(),
      ...overrides,
    };
  }

  /**
   * マンダラシートのセルデータを生成
   * @param overrides カスタムフィールド
   * @returns マンダラシートのセルデータ
   */
  static createMandalaSheetCell(overrides: Partial<any> = {}) {
    const id = overrides.id || uuidv4();
    const sheetId = overrides.sheet_id || `sheet-${uuidv4()}`;

    return {
      id,
      sheet_id: sheetId,
      position_x:
        overrides.position_x !== undefined
          ? overrides.position_x
          : Math.floor(Math.random() * 3),
      position_y:
        overrides.position_y !== undefined
          ? overrides.position_y
          : Math.floor(Math.random() * 3),
      content: overrides.content || faker.lorem.sentence(),
      created_at: overrides.created_at || this.randomDate(),
      updated_at: overrides.updated_at || new Date().toISOString(),
      ...overrides,
    };
  }

  /**
   * マンダラシートの完全なデータセットを生成（シートとセル）
   * @param overrides カスタムフィールド
   * @returns マンダラシートの完全なデータセット
   */
  static createCompleteMandalaSheet(overrides: Partial<any> = {}) {
    const sheet = this.createMandalaSheet(overrides);
    const cells = [];

    // 3x3のマンダラシートを作成
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        cells.push(
          this.createMandalaSheetCell({
            sheet_id: sheet.id,
            position_x: x,
            position_y: y,
            content:
              x === 1 && y === 1
                ? `中心テーマ: ${faker.lorem.words(3)}`
                : faker.lorem.sentence(),
          }),
        );
      }
    }

    return {
      sheet,
      cells,
    };
  }

  /**
   * スキル進捗履歴データを生成
   * @param overrides カスタムフィールド
   * @returns スキル進捗履歴データ
   */
  static createSkillProgressHistory(overrides: Partial<any> = {}) {
    const id = overrides.id || uuidv4();
    const skillId = overrides.skill_id || `skill-${uuidv4()}`;

    return {
      id,
      skill_id: skillId,
      level: overrides.level || Math.floor(Math.random() * 5) + 1,
      recorded_at: overrides.recorded_at || this.randomDate(),
      notes: overrides.notes || faker.lorem.sentence(),
      ...overrides,
    };
  }

  /**
   * スキルの進捗履歴データセットを生成
   * @param skill スキルデータ
   * @param count 履歴エントリの数
   * @returns スキル進捗履歴データの配列
   */
  static createSkillProgressHistories(skill: any, count: number = 5) {
    const histories = [];
    let currentLevel = 1;

    // 過去の日付を生成（古い順）
    const dates = Array.from({ length: count }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (count - i));
      return date;
    });

    for (let i = 0; i < count; i++) {
      // レベルは徐々に上がるか同じ
      if (i > 0 && Math.random() > 0.7) {
        currentLevel = Math.min(currentLevel + 1, 5);
      }

      histories.push(
        this.createSkillProgressHistory({
          skill_id: skill.id,
          level: currentLevel,
          recorded_at: dates[i].toISOString(),
          notes:
            i === 0
              ? "スキル登録"
              : `レベル${currentLevel}に${currentLevel > histories[i - 1].level ? "上昇" : "維持"}`,
        }),
      );
    }

    return histories;
  }

  /**
   * 関連データを含む完全なユーザーデータセットを生成
   * @param overrides カスタムフィールド
   * @returns ユーザーデータセット
   */
  static createCompleteUserDataSet(overrides: Partial<any> = {}) {
    const userId = overrides.user_id || `user-${uuidv4()}`;

    const profile = this.createUserProfile({ user_id: userId, ...overrides });
    const works = this.createWorks(3, { user_id: userId });
    const skills = this.createSkills(5, { user_id: userId });
    const groups = this.createGroups(2);
    const groupMembers = groups.map((group, i) =>
      this.createGroupMember({
        user_id: userId,
        group_id: group.id,
        role: i === 0 ? "admin" : "member",
      }),
    );
    const notifications = this.createNotifications(5, { user_id: userId });

    // タグとジャンルを生成
    const tags = this.createTags(10);
    const genres = this.createGenres(8);

    // 作品とタグの関連付け
    const workTags = this.createWorkTags(works, tags);

    // スキル進捗履歴
    const skillHistories = skills.flatMap((skill) =>
      this.createSkillProgressHistories(skill, 3),
    );

    // マンダラシート
    const mandalaData = this.createCompleteMandalaSheet({ user_id: userId });

    return {
      profile,
      works,
      skills,
      groups,
      groupMembers,
      notifications,
      tags,
      genres,
      workTags,
      skillHistories,
      mandalaSheet: mandalaData.sheet,
      mandalaCells: mandalaData.cells,
    };
  }

  /**
   * 複雑なリレーションシップを持つ完全なテストデータセットを生成
   * @param userCount ユーザー数
   * @param options オプション設定
   * @returns 完全なテストデータセット
   */
  static createCompleteTestDataSet(
    userCount: number = 5,
    options: {
      worksPerUser?: number;
      skillsPerUser?: number;
      tagsCount?: number;
      genresCount?: number;
      groupsCount?: number;
    } = {},
  ) {
    const {
      worksPerUser = 3,
      skillsPerUser = 4,
      tagsCount = 15,
      genresCount = 10,
      groupsCount = 3,
    } = options;

    // ユーザープロファイル
    const profiles = this.createUserProfiles(userCount);

    // スキル
    const skills = profiles.flatMap((profile) =>
      this.createSkills(skillsPerUser, { user_id: profile.user_id }),
    );

    // スキル進捗履歴
    const skillHistories = skills.flatMap((skill) =>
      this.createSkillProgressHistories(
        skill,
        Math.floor(Math.random() * 3) + 1,
      ),
    );

    // タグとジャンル
    const tags = this.createTags(tagsCount);
    const genres = this.createGenres(genresCount);

    // 作品
    const works = profiles.flatMap((profile) =>
      this.createWorks(worksPerUser, { user_id: profile.user_id }),
    );

    // 作品とタグの関連付け
    const workTags = this.createWorkTags(works, tags);

    // 作品の著者関連付け
    const workAuthors = this.createWorkAuthors(works, profiles);

    // グループ
    const groups = this.createGroups(groupsCount);

    // グループメンバー
    const groupMembers = [];
    profiles.forEach((profile, i) => {
      // 各ユーザーを1〜3個のグループに所属させる
      const memberGroupCount = Math.floor(Math.random() * 3) + 1;
      const memberGroups = [...groups]
        .sort(() => Math.random() - 0.5)
        .slice(0, memberGroupCount);

      memberGroups.forEach((group, j) => {
        groupMembers.push(
          this.createGroupMember({
            user_id: profile.user_id,
            group_id: group.id,
            // 最初のユーザーは管理者、それ以外はランダム
            role:
              i === 0
                ? "admin"
                : ["admin", "member", "moderator"][
                    Math.floor(Math.random() * 3)
                  ],
          }),
        );
      });
    });

    // マンダラシート（各ユーザーに1つずつ）
    const mandalaSheets = [];
    const mandalaCells = [];

    profiles.forEach((profile) => {
      const mandalaData = this.createCompleteMandalaSheet({
        user_id: profile.user_id,
      });
      mandalaSheets.push(mandalaData.sheet);
      mandalaCells.push(...mandalaData.cells);
    });

    // 通知
    const notifications = profiles.flatMap((profile) =>
      this.createNotifications(Math.floor(Math.random() * 5) + 1, {
        user_id: profile.user_id,
      }),
    );

    return {
      profiles,
      works,
      skills,
      skillHistories,
      tags,
      genres,
      workTags,
      workAuthors,
      groups,
      groupMembers,
      mandalaSheets,
      mandalaCells,
      notifications,
    };
  }
}
