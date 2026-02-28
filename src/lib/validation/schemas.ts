/**
 * Zod validation schemas for server actions
 *
 * This file centralizes input validation for all server actions,
 * providing type safety, error messaging, and reusability.
 *
 * @security Validates all user inputs before processing
 */

import { z } from "zod";

/**
 * Group creation input schema
 */
export const createGroupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Group name must be at least 3 characters")
    .max(100, "Group name must be at most 100 characters"),
  description: z
    .string()
    .max(500, "Description must be at most 500 characters")
    .optional()
    .nullable()
    .transform((val) => val || undefined),
});

export type CreateGroupInput = z.infer<typeof createGroupSchema>;

/**
 * Nation creation input schema
 */
export const createNationSchema = z.object({
  groupId: z
    .string()
    .min(1, "Group ID is required")
    .regex(/^[a-zA-Z0-9-_]+$/, "Invalid Group ID format"),
  name: z
    .string()
    .trim()
    .min(3, "Nation name must be at least 3 characters")
    .max(100, "Nation name must be at most 100 characters"),
  description: z
    .string()
    .max(500, "Description must be at most 500 characters")
    .optional()
    .nullable()
    .transform((val) => val || undefined),
});

export type CreateNationInput = z.infer<typeof createNationSchema>;
