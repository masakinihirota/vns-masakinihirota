import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod';

import { groups, nations, userPreferences, users } from './schema.postgres';

export const userInsertSchema = createInsertSchema(users);
export const userSelectSchema = createSelectSchema(users);
export const userUpdateSchema = createUpdateSchema(users);

export const userPreferencesInsertSchema = createInsertSchema(userPreferences);

export const groupInsertSchema = createInsertSchema(groups);
export const nationInsertSchema = createInsertSchema(nations);
