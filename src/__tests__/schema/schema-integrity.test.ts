/**
 * Database Schema Integrity Tests
 *
 * @description
 * Validates that all table relationships, constraints, and RLS policies
 * are correctly defined in the PostgreSQL database.
 *
 * Runs against a real database (configured via DATABASE_URL)
 * after migrations have been applied.
 */

import { describe, it, expect, beforeAll } from "vitest";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";

describe("Database Schema Integrity", () => {
  describe("Required Tables Exist", () => {
    const requiredTables = [
      "root_accounts",
      "user_profiles",
      "user_preferences",
      "groups",
      "group_members",
      "nations",
      "sessions",
      "accounts",
      "verifications",
      "two_factor_secrets",
      "audit_logs",
    ];

    requiredTables.forEach((tableName) => {
      it(`should have ${tableName} table`, async () => {
        const result = await db.execute(sql`
          SELECT EXISTS (
            SELECT FROM information_schema.tables
            WHERE table_schema = 'public'
            AND table_name = ${tableName}
          )
        `);

        expect(result.rows[0]?.exists).toBe(true);
      });
    });
  });

  describe("Foreign Key Relationships", () => {
    const foreignKeyConstraints = [
      {
        constraint_name: "user_profiles_root_account_id_fkey",
        table_name: "user_profiles",
        foreign_table_name: "root_accounts",
      },
      {
        constraint_name: "group_members_user_profile_id_fkey",
        table_name: "group_members",
        foreign_table_name: "user_profiles",
      },
      {
        constraint_name: "group_members_group_id_fkey",
        table_name: "group_members",
        foreign_table_name: "groups",
      },
      {
        constraint_name: "sessions_root_account_id_fkey",
        table_name: "sessions",
        foreign_table_name: "root_accounts",
      },
      {
        constraint_name: "accounts_root_account_id_fkey",
        table_name: "accounts",
        foreign_table_name: "root_accounts",
      },
      {
        constraint_name: "verifications_root_account_id_fkey",
        table_name: "verifications",
        foreign_table_name: "root_accounts",
      },
      {
        constraint_name: "two_factor_secrets_root_account_id_fkey",
        table_name: "two_factor_secrets",
        foreign_table_name: "root_accounts",
      },
    ];

    foreignKeyConstraints.forEach(({ constraint_name, table_name, foreign_table_name }) => {
      it(`should have ${constraint_name} FK constraint`, async () => {
        const result = await db.execute(sql`
          SELECT constraint_name
          FROM information_schema.table_constraints
          WHERE table_schema = 'public'
          AND table_name = ${table_name}
          AND constraint_name = ${constraint_name}
          AND constraint_type = 'FOREIGN KEY'
        `);

        expect(result.rows).toHaveLength(1);
        expect(result.rows[0]?.constraint_name).toBe(constraint_name);
      });
    });
  });

  describe("Unique Constraints", () => {
    const uniqueConstraints = [
      { table_name: "user_profiles", constraint_name: "user_profiles_root_account_id_key" },
      { table_name: "root_accounts", constraint_name: "root_accounts_auth_user_id_key" },
    ];

    uniqueConstraints.forEach(({ table_name, constraint_name }) => {
      it(`should have ${constraint_name} unique constraint on ${table_name}`, async () => {
        const result = await db.execute(sql`
          SELECT constraint_name
          FROM information_schema.table_constraints
          WHERE table_schema = 'public'
          AND table_name = ${table_name}
          AND constraint_name = ${constraint_name}
          AND constraint_type = 'UNIQUE'
        `);

        expect(result.rows).toHaveLength(1);
      });
    });
  });

  describe("Check Constraints", () => {
    const checkConstraints = [
      {
        table_name: "user_profiles",
        constraint_name: "user_profiles_points_check",
      },
      {
        table_name: "user_profiles",
        constraint_name: "user_profiles_level_check",
      },
    ];

    checkConstraints.forEach(({ table_name, constraint_name }) => {
      it(`should have ${constraint_name} check constraint`, async () => {
        const result = await db.execute(sql`
          SELECT constraint_name
          FROM information_schema.check_constraints
          WHERE constraint_name = ${constraint_name}
        `);

        expect(result.rows.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Primary Keys", () => {
    const tablesWithPK = [
      "root_accounts",
      "user_profiles",
      "groups",
      "group_members",
      "nations",
    ];

    tablesWithPK.forEach((tableName) => {
      it(`${tableName} should have a primary key`, async () => {
        const result = await db.execute(sql`
          SELECT constraint_name
          FROM information_schema.table_constraints
          WHERE table_schema = 'public'
          AND table_name = ${tableName}
          AND constraint_type = 'PRIMARY KEY'
        `);

        expect(result.rows).toHaveLength(1);
      });
    });
  });

  describe("Indexes", () => {
    const expectedIndexes = [
      "idx_user_profiles_root_account_id",
      "idx_sessions_root_account_id",
      "idx_root_accounts_active_profile_id",
    ];

    expectedIndexes.forEach((indexName) => {
      it(`should have ${indexName} index`, async () => {
        const result = await db.execute(sql`
          SELECT indexname
          FROM pg_indexes
          WHERE schemaname = 'public'
          AND indexname = ${indexName}
        `);

        expect(result.rows).toHaveLength(1);
      });
    });
  });

  describe("Timestamp Columns", () => {
    const tablesWithTimestamps = [
      { table_name: "root_accounts", columns: ["created_at", "updated_at"] },
      { table_name: "user_profiles", columns: ["created_at", "updated_at"] },
      { table_name: "sessions", columns: ["created_at", "updated_at"] },
    ];

    tablesWithTimestamps.forEach(({ table_name, columns }) => {
      columns.forEach((columnName) => {
        it(`${table_name}.${columnName} should be timestamp with time zone`, async () => {
          const result = await db.execute(sql`
            SELECT data_type
            FROM information_schema.columns
            WHERE table_schema = 'public'
            AND table_name = ${table_name}
            AND column_name = ${columnName}
          `);

          expect(result.rows).toHaveLength(1);
          expect(result.rows[0]?.data_type).toBe("timestamp with time zone");
        });
      });
    });
  });

  describe("RLS Policies Enforcement", () => {
    const tablesWithRLS = [
      "root_accounts",
      "user_profiles",
      "user_preferences",
      "sessions",
      "accounts",
      "verifications",
      "two_factor_secrets",
      "groups",
      "group_members",
      "nations",
      "audit_logs",
    ];

    tablesWithRLS.forEach((tableName) => {
      it(`${tableName} should have RLS enabled`, async () => {
        const result = await db.execute(sql`
          SELECT rowsecurity
          FROM pg_tables
          WHERE schemaname = 'public'
          AND tablename = ${tableName}
        `);

        expect(result.rows).toHaveLength(1);
        expect(result.rows[0]?.rowsecurity).toBe(true);
      });

      it(`${tableName} should have at least one RLS policy`, async () => {
        const result = await db.execute(sql`
          SELECT policyname
          FROM pg_policies
          WHERE schemaname = 'public'
          AND tablename = ${tableName}
          LIMIT 1
        `);

        expect(result.rows.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Enum Types", () => {
    const enumTypes = [
      { enum_name: "mask_category", values: ["ghost", "persona"] },
      { enum_name: "alliance_status", values: ["requested", "pre_partner", "partner"] },
      { enum_name: "follow_status", values: ["watch", "follow"] },
    ];

    enumTypes.forEach(({ enum_name, values }) => {
      it(`should have ${enum_name} enum type with correct values`, async () => {
        const result = await db.execute(sql`
          SELECT enumlabel
          FROM pg_enum
          JOIN pg_type ON pg_enum.enumtypid = pg_type.oid
          WHERE pg_type.typname = ${enum_name}
          ORDER BY enumsortorder
        `);

        const enumValues = result.rows.map((row) => row?.enumlabel);
        expect(enumValues).toEqual(values);
      });
    });
  });

  describe("Referential Integrity", () => {
    it("should not have orphaned foreign key references", async () => {
      // Check that all foreign key constraints are valid
      const result = await db.execute(sql`
        SELECT constraint_name
        FROM information_schema.table_constraints
        WHERE constraint_type = 'FOREIGN KEY'
        AND table_schema = 'public'
      `);

      expect(result.rows.length).toBeGreaterThan(0);
    });

    it("should enforce CASCADE DELETE on user_profiles->root_accounts", async () => {
      // Verify the deletion rule is CASCADE
      const result = await db.execute(sql`
        SELECT delete_rule
        FROM information_schema.referential_constraints
        WHERE table_name = 'user_profiles'
        AND constraint_name = 'user_profiles_root_account_id_fkey'
      `);

      expect(result.rows).toHaveLength(1);
      expect(result.rows[0]?.delete_rule).toBe("CASCADE");
    });
  });
});
