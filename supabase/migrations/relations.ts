import { relations } from "drizzle-orm/relations";
import { usersInAuth, rootAccounts, userProfiles, businessCards, alliances, works, groups, nations, marketItems, marketTransactions, nationEvents, notifications, nationPosts, follows, groupMembers, nationGroups, nationCitizens, nationEventParticipants, userWorkRatings, userWorkEntries } from "./schema";

export const rootAccountsRelations = relations(rootAccounts, ({one, many}) => ({
	usersInAuth: one(usersInAuth, {
		fields: [rootAccounts.authUserId],
		references: [usersInAuth.id]
	}),
	userProfiles: many(userProfiles),
}));

export const usersInAuthRelations = relations(usersInAuth, ({many}) => ({
	rootAccounts: many(rootAccounts),
	works: many(works),
	userWorkRatings: many(userWorkRatings),
	userWorkEntries: many(userWorkEntries),
}));

export const userProfilesRelations = relations(userProfiles, ({one, many}) => ({
	rootAccount: one(rootAccounts, {
		fields: [userProfiles.rootAccountId],
		references: [rootAccounts.id]
	}),
	businessCards: many(businessCards),
	alliances_profileAId: many(alliances, {
		relationName: "alliances_profileAId_userProfiles_id"
	}),
	alliances_profileBId: many(alliances, {
		relationName: "alliances_profileBId_userProfiles_id"
	}),
	groups: many(groups),
	nations: many(nations),
	marketItems: many(marketItems),
	marketTransactions_buyerId: many(marketTransactions, {
		relationName: "marketTransactions_buyerId_userProfiles_id"
	}),
	marketTransactions_sellerId: many(marketTransactions, {
		relationName: "marketTransactions_sellerId_userProfiles_id"
	}),
	nationEvents: many(nationEvents),
	notifications: many(notifications),
	nationPosts: many(nationPosts),
	follows_followerProfileId: many(follows, {
		relationName: "follows_followerProfileId_userProfiles_id"
	}),
	follows_followedProfileId: many(follows, {
		relationName: "follows_followedProfileId_userProfiles_id"
	}),
	groupMembers: many(groupMembers),
	nationCitizens: many(nationCitizens),
	nationEventParticipants: many(nationEventParticipants),
}));

export const businessCardsRelations = relations(businessCards, ({one}) => ({
	userProfile: one(userProfiles, {
		fields: [businessCards.userProfileId],
		references: [userProfiles.id]
	}),
}));

export const alliancesRelations = relations(alliances, ({one}) => ({
	userProfile_profileAId: one(userProfiles, {
		fields: [alliances.profileAId],
		references: [userProfiles.id],
		relationName: "alliances_profileAId_userProfiles_id"
	}),
	userProfile_profileBId: one(userProfiles, {
		fields: [alliances.profileBId],
		references: [userProfiles.id],
		relationName: "alliances_profileBId_userProfiles_id"
	}),
}));

export const worksRelations = relations(works, ({one, many}) => ({
	usersInAuth: one(usersInAuth, {
		fields: [works.ownerUserId],
		references: [usersInAuth.id]
	}),
	userWorkRatings: many(userWorkRatings),
	userWorkEntries: many(userWorkEntries),
}));

export const groupsRelations = relations(groups, ({one, many}) => ({
	userProfile: one(userProfiles, {
		fields: [groups.leaderId],
		references: [userProfiles.id]
	}),
	nations: many(nations),
	marketItems: many(marketItems),
	nationPosts: many(nationPosts),
	groupMembers: many(groupMembers),
	nationGroups: many(nationGroups),
}));

export const nationsRelations = relations(nations, ({one, many}) => ({
	userProfile: one(userProfiles, {
		fields: [nations.ownerUserId],
		references: [userProfiles.id]
	}),
	group: one(groups, {
		fields: [nations.ownerGroupId],
		references: [groups.id]
	}),
	marketItems: many(marketItems),
	nationEvents: many(nationEvents),
	nationPosts: many(nationPosts),
	nationGroups: many(nationGroups),
	nationCitizens: many(nationCitizens),
}));

export const marketItemsRelations = relations(marketItems, ({one, many}) => ({
	nation: one(nations, {
		fields: [marketItems.nationId],
		references: [nations.id]
	}),
	userProfile: one(userProfiles, {
		fields: [marketItems.sellerId],
		references: [userProfiles.id]
	}),
	group: one(groups, {
		fields: [marketItems.sellerGroupId],
		references: [groups.id]
	}),
	marketTransactions: many(marketTransactions),
}));

export const marketTransactionsRelations = relations(marketTransactions, ({one}) => ({
	marketItem: one(marketItems, {
		fields: [marketTransactions.itemId],
		references: [marketItems.id]
	}),
	userProfile_buyerId: one(userProfiles, {
		fields: [marketTransactions.buyerId],
		references: [userProfiles.id],
		relationName: "marketTransactions_buyerId_userProfiles_id"
	}),
	userProfile_sellerId: one(userProfiles, {
		fields: [marketTransactions.sellerId],
		references: [userProfiles.id],
		relationName: "marketTransactions_sellerId_userProfiles_id"
	}),
}));

export const nationEventsRelations = relations(nationEvents, ({one, many}) => ({
	nation: one(nations, {
		fields: [nationEvents.nationId],
		references: [nations.id]
	}),
	userProfile: one(userProfiles, {
		fields: [nationEvents.organizerId],
		references: [userProfiles.id]
	}),
	nationEventParticipants: many(nationEventParticipants),
}));

export const notificationsRelations = relations(notifications, ({one}) => ({
	userProfile: one(userProfiles, {
		fields: [notifications.userProfileId],
		references: [userProfiles.id]
	}),
}));

export const nationPostsRelations = relations(nationPosts, ({one}) => ({
	nation: one(nations, {
		fields: [nationPosts.nationId],
		references: [nations.id]
	}),
	userProfile: one(userProfiles, {
		fields: [nationPosts.authorId],
		references: [userProfiles.id]
	}),
	group: one(groups, {
		fields: [nationPosts.authorGroupId],
		references: [groups.id]
	}),
}));

export const followsRelations = relations(follows, ({one}) => ({
	userProfile_followerProfileId: one(userProfiles, {
		fields: [follows.followerProfileId],
		references: [userProfiles.id],
		relationName: "follows_followerProfileId_userProfiles_id"
	}),
	userProfile_followedProfileId: one(userProfiles, {
		fields: [follows.followedProfileId],
		references: [userProfiles.id],
		relationName: "follows_followedProfileId_userProfiles_id"
	}),
}));

export const groupMembersRelations = relations(groupMembers, ({one}) => ({
	group: one(groups, {
		fields: [groupMembers.groupId],
		references: [groups.id]
	}),
	userProfile: one(userProfiles, {
		fields: [groupMembers.userProfileId],
		references: [userProfiles.id]
	}),
}));

export const nationGroupsRelations = relations(nationGroups, ({one}) => ({
	nation: one(nations, {
		fields: [nationGroups.nationId],
		references: [nations.id]
	}),
	group: one(groups, {
		fields: [nationGroups.groupId],
		references: [groups.id]
	}),
}));

export const nationCitizensRelations = relations(nationCitizens, ({one}) => ({
	nation: one(nations, {
		fields: [nationCitizens.nationId],
		references: [nations.id]
	}),
	userProfile: one(userProfiles, {
		fields: [nationCitizens.userProfileId],
		references: [userProfiles.id]
	}),
}));

export const nationEventParticipantsRelations = relations(nationEventParticipants, ({one}) => ({
	nationEvent: one(nationEvents, {
		fields: [nationEventParticipants.eventId],
		references: [nationEvents.id]
	}),
	userProfile: one(userProfiles, {
		fields: [nationEventParticipants.userProfileId],
		references: [userProfiles.id]
	}),
}));

export const userWorkRatingsRelations = relations(userWorkRatings, ({one}) => ({
	usersInAuth: one(usersInAuth, {
		fields: [userWorkRatings.userId],
		references: [usersInAuth.id]
	}),
	work: one(works, {
		fields: [userWorkRatings.workId],
		references: [works.id]
	}),
}));

export const userWorkEntriesRelations = relations(userWorkEntries, ({one}) => ({
	usersInAuth: one(usersInAuth, {
		fields: [userWorkEntries.userId],
		references: [usersInAuth.id]
	}),
	work: one(works, {
		fields: [userWorkEntries.workId],
		references: [works.id]
	}),
}));