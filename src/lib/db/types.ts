import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import * as schema from "./schema";

export type User = InferSelectModel<typeof schema.users>;

export type RootAccount = InferSelectModel<typeof schema.rootAccounts>;
export type NewRootAccount = InferInsertModel<typeof schema.rootAccounts>;

export type UserProfile = InferSelectModel<typeof schema.userProfiles>;
export type NewUserProfile = InferInsertModel<typeof schema.userProfiles>;

export type Group = InferSelectModel<typeof schema.groups>;
export type NewGroup = InferInsertModel<typeof schema.groups>;

export type GroupMember = InferSelectModel<typeof schema.groupMembers>;
export type NewGroupMember = InferInsertModel<typeof schema.groupMembers>;

export type Event = InferSelectModel<typeof schema.nationEvents>;
export type NewEvent = InferInsertModel<typeof schema.nationEvents>;

export type Nation = InferSelectModel<typeof schema.nations>;
export type NewNation = InferInsertModel<typeof schema.nations>;
