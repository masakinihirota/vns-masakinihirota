import { relations } from "drizzle-orm";
import { businessCards } from "./business-cards";
import {
  groupMembers,
  groups,
  nationCitizens,
  nationGroups,
  nationPosts,
  nations,
} from "./community";
import { nationEventParticipants, nationEvents } from "./events";
import { marketItems, marketTransactions } from "./market";
import { notifications } from "./notifications";
import { alliances, follows } from "./relationships";
import { rootAccounts } from "./root-accounts";
import { userProfiles } from "./user-profiles";
import { userWorkEntries, userWorkRatings, works } from "./works";

/** root_accounts のリレーション */
export const rootAccountsRelations = relations(rootAccounts, ({ many }) => ({
  userProfiles: many(userProfiles),
}));

/** user_profiles のリレーション */
export const userProfilesRelations = relations(
  userProfiles,
  ({ one, many }) => ({
    rootAccount: one(rootAccounts, {
      fields: [userProfiles.rootAccountId],
      references: [rootAccounts.id],
    }),
    businessCard: one(businessCards, {
      fields: [userProfiles.id],
      references: [businessCards.userProfileId],
    }),
    // リレーションシップ
    alliancesAsA: many(alliances, { relationName: "profileA" }),
    alliancesAsB: many(alliances, { relationName: "profileB" }),
    followers: many(follows, { relationName: "followed" }),
    following: many(follows, { relationName: "follower" }),
    // コミュニティ
    ledGroups: many(groups),
    groupMemberships: many(groupMembers),
    nationCitizenships: many(nationCitizens),
    nationPosts: many(nationPosts, { relationName: "postAuthor" }),
    // イベント
    organizedEvents: many(nationEvents),
    eventParticipations: many(nationEventParticipants),
    // 通知
    notifications: many(notifications),
  })
);

/** business_cards のリレーション */
export const businessCardsRelations = relations(businessCards, ({ one }) => ({
  userProfile: one(userProfiles, {
    fields: [businessCards.userProfileId],
    references: [userProfiles.id],
  }),
}));

/** alliances のリレーション */
export const alliancesRelations = relations(alliances, ({ one }) => ({
  profileA: one(userProfiles, {
    fields: [alliances.profileAId],
    references: [userProfiles.id],
    relationName: "profileA",
  }),
  profileB: one(userProfiles, {
    fields: [alliances.profileBId],
    references: [userProfiles.id],
    relationName: "profileB",
  }),
}));

/** follows のリレーション */
export const followsRelations = relations(follows, ({ one }) => ({
  follower: one(userProfiles, {
    fields: [follows.followerProfileId],
    references: [userProfiles.id],
    relationName: "follower",
  }),
  followed: one(userProfiles, {
    fields: [follows.followedProfileId],
    references: [userProfiles.id],
    relationName: "followed",
  }),
}));

/** groups のリレーション */
export const groupsRelations = relations(groups, ({ one, many }) => ({
  leader: one(userProfiles, {
    fields: [groups.leaderId],
    references: [userProfiles.id],
  }),
  members: many(groupMembers),
  ownedNations: many(nations, { relationName: "nationOwnerGroup" }),
  nationMemberships: many(nationGroups),
}));

/** group_members のリレーション */
export const groupMembersRelations = relations(groupMembers, ({ one }) => ({
  group: one(groups, {
    fields: [groupMembers.groupId],
    references: [groups.id],
  }),
  userProfile: one(userProfiles, {
    fields: [groupMembers.userProfileId],
    references: [userProfiles.id],
  }),
}));

/** nations のリレーション */
export const nationsRelations = relations(nations, ({ one, many }) => ({
  ownerUser: one(userProfiles, {
    fields: [nations.ownerUserId],
    references: [userProfiles.id],
  }),
  ownerGroup: one(groups, {
    fields: [nations.ownerGroupId],
    references: [groups.id],
    relationName: "nationOwnerGroup",
  }),
  citizens: many(nationCitizens),
  nationGroups: many(nationGroups),
  posts: many(nationPosts),
  events: many(nationEvents),
  marketItems: many(marketItems),
}));

/** nation_citizens のリレーション */
export const nationCitizensRelations = relations(nationCitizens, ({ one }) => ({
  nation: one(nations, {
    fields: [nationCitizens.nationId],
    references: [nations.id],
  }),
  userProfile: one(userProfiles, {
    fields: [nationCitizens.userProfileId],
    references: [userProfiles.id],
  }),
}));

/** nation_groups のリレーション */
export const nationGroupsRelations = relations(nationGroups, ({ one }) => ({
  nation: one(nations, {
    fields: [nationGroups.nationId],
    references: [nations.id],
  }),
  group: one(groups, {
    fields: [nationGroups.groupId],
    references: [groups.id],
  }),
}));

/** nation_posts のリレーション */
export const nationPostsRelations = relations(nationPosts, ({ one }) => ({
  nation: one(nations, {
    fields: [nationPosts.nationId],
    references: [nations.id],
  }),
  author: one(userProfiles, {
    fields: [nationPosts.authorId],
    references: [userProfiles.id],
    relationName: "postAuthor",
  }),
  authorGroup: one(groups, {
    fields: [nationPosts.authorGroupId],
    references: [groups.id],
  }),
}));

/** nation_events のリレーション */
export const nationEventsRelations = relations(
  nationEvents,
  ({ one, many }) => ({
    nation: one(nations, {
      fields: [nationEvents.nationId],
      references: [nations.id],
    }),
    organizer: one(userProfiles, {
      fields: [nationEvents.organizerId],
      references: [userProfiles.id],
    }),
    participants: many(nationEventParticipants),
  })
);

/** nation_event_participants のリレーション */
export const nationEventParticipantsRelations = relations(
  nationEventParticipants,
  ({ one }) => ({
    event: one(nationEvents, {
      fields: [nationEventParticipants.eventId],
      references: [nationEvents.id],
    }),
    userProfile: one(userProfiles, {
      fields: [nationEventParticipants.userProfileId],
      references: [userProfiles.id],
    }),
  })
);

/** market_items のリレーション */
export const marketItemsRelations = relations(marketItems, ({ one, many }) => ({
  nation: one(nations, {
    fields: [marketItems.nationId],
    references: [nations.id],
  }),
  seller: one(userProfiles, {
    fields: [marketItems.sellerId],
    references: [userProfiles.id],
  }),
  sellerGroup: one(groups, {
    fields: [marketItems.sellerGroupId],
    references: [groups.id],
  }),
  transactions: many(marketTransactions),
}));

/** market_transactions のリレーション */
export const marketTransactionsRelations = relations(
  marketTransactions,
  ({ one }) => ({
    item: one(marketItems, {
      fields: [marketTransactions.itemId],
      references: [marketItems.id],
    }),
    seller: one(userProfiles, {
      fields: [marketTransactions.sellerId],
      references: [userProfiles.id],
    }),
    buyer: one(userProfiles, {
      fields: [marketTransactions.buyerId],
      references: [userProfiles.id],
    }),
  })
);

/** notifications のリレーション */
export const notificationsRelations = relations(notifications, ({ one }) => ({
  userProfile: one(userProfiles, {
    fields: [notifications.userProfileId],
    references: [userProfiles.id],
  }),
}));

/** works のリレーション */
export const worksRelations = relations(works, ({ many }) => ({
  userEntries: many(userWorkEntries),
  userRatings: many(userWorkRatings),
}));

/** user_work_entries のリレーション */
export const userWorkEntriesRelations = relations(
  userWorkEntries,
  ({ one }) => ({
    work: one(works, {
      fields: [userWorkEntries.workId],
      references: [works.id],
    }),
  })
);

/** user_work_ratings のリレーション */
export const userWorkRatingsRelations = relations(
  userWorkRatings,
  ({ one }) => ({
    work: one(works, {
      fields: [userWorkRatings.workId],
      references: [works.id],
    }),
  })
);
