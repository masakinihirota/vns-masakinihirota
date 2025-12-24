import { Home } from "lucide-react";
import { describe, it, expect } from "vitest";
import { ICON_MAP, iconFor } from "@/config/menu-icons";
import manifest from "@/config/routes.manifest.json";
import { toSidebarUrl, mapPathToFeature, getMenuItemsWithState } from "./AppSidebar";

describe("AppSidebar manifest integration", () => {
  it("should have icon mapping for each visible menu route in manifest", () => {
    const visiblePaths = manifest.filter((r) => r.visibleInMenu).map((r) => r.path);
    const missing = visiblePaths.filter((p) => !Object.prototype.hasOwnProperty.call(ICON_MAP, p));
    expect(missing).toEqual([]);
  });

  it("toSidebarUrl should return manifest path, not /home-prefixed", () => {
    expect(toSidebarUrl("/matching")).toBe("/matching");
    expect(toSidebarUrl("/")).toBe("/");
    expect(toSidebarUrl("/home")).toBe("/home");
  });

  it("iconFor returns a Lucide component (fallback allowed)", () => {
    for (const entry of manifest) {
      if (!entry.visibleInMenu) continue;
      const icon = iconFor(entry.path);
      // lucide-react icons can be functions or objects depending on the bundler/runtime
      expect(icon).toBeDefined();
      expect(["function", "object"]).toContain(typeof icon);
    }
  });
});

describe("AppSidebar Lv制UI統合", () => {
  describe("mapPathToFeature", () => {
    it("should map /matching to matching", () => {
      expect(mapPathToFeature("/matching")).toBe("matching");
    });

    it("should map /groups to organizations", () => {
      expect(mapPathToFeature("/groups")).toBe("organizations");
    });

    it("should map /nations to nations", () => {
      expect(mapPathToFeature("/nations")).toBe("nations");
    });

    it("should map /works to works", () => {
      expect(mapPathToFeature("/works")).toBe("works");
    });

    it("should map /values to values", () => {
      expect(mapPathToFeature("/values")).toBe("values");
    });

    it("should map /skills to skills", () => {
      expect(mapPathToFeature("/skills")).toBe("skills");
    });
  });

  describe("getMenuItemsWithState", () => {
    it("should return items with state for level 1 user", () => {
      const items = [
        { title: "ホーム", url: "/home", icon: Home },
        { title: "マッチング", url: "/matching", icon: Home },
      ];
      const result = getMenuItemsWithState(items, 1);
      expect(result[0].state).toBe("unlocked");
      expect(result[1].state).toBe("grayed");
    });

    it("should return items with state for level 3 user", () => {
      const items = [
        { title: "マッチング", url: "/matching", icon: Home },
        { title: "国", url: "/nations", icon: Home },
      ];
      const result = getMenuItemsWithState(items, 3);
      expect(result[0].state).toBe("unlocked");
      expect(result[1].state).toBe("grayed");
    });

    it("should filter hidden items", () => {
      const items = [{ title: "スキル", url: "/skills", icon: Home }];
      const result = getMenuItemsWithState(items, 1);
      expect(result.length).toBe(0);
    });

    it("should show skills at level 10", () => {
      const items = [{ title: "スキル", url: "/skills", icon: Home }];
      const result = getMenuItemsWithState(items, 10);
      expect(result.length).toBe(1);
      expect(result[0].state).toBe("grayed");
    });

    it("should unlock skills at level 12", () => {
      const items = [{ title: "スキル", url: "/skills", icon: Home }];
      const result = getMenuItemsWithState(items, 12);
      expect(result.length).toBe(1);
      expect(result[0].state).toBe("unlocked");
    });
  });
});
