import routesManifest from "@/config/routes.manifest.json";
import { ICON_MAP } from "./AppSidebar";
import { describe, it, expect } from "vitest";

describe("ICON_MAP coverage", () => {
  it("has an explicit entry for every manifest route visibleInMenu", () => {
    type ManifestItem = { visibleInMenu?: boolean; path: string };
    const manifest = routesManifest as ManifestItem[];
    const missing: string[] = [];

    for (const r of manifest) {
      if (!r.visibleInMenu) continue;
      // skip known public routes intentionally not in ICON_MAP (root /)
      if (r.path === "/") continue;
      if (!Object.prototype.hasOwnProperty.call(ICON_MAP, r.path)) {
        missing.push(r.path);
      }
    }

    expect(missing).toEqual([]);
  });
});
