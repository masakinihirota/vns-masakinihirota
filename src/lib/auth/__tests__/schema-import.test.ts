import { describe, expect, it } from "vitest";
import * as schema from "../../../lib/db/schema.postgres";

describe("Schema Import Test", () => {
  it("should import schema without crashing", () => {
    expect(schema).toBeDefined();
    expect(schema.userProfiles).toBeDefined();
  });
});
