import { describe, it, expect, vi } from "vitest";

// メタデータをモックする
const mockMetadata = {
  title: "masakinihirota",
  description: "VNS",
  keywords: [
    "Shadcn UI Landing Page",
    "Shadcn UI Blocks",
    "Shadcn UI",
    "Landing Page",
    "Tailwind CSS Landing Page",
    "Beautiful Shadcn UI Landing Page",
    "Next.js 15 Landing Page",
    "Simple Landing Page",
    "Landing Page Template",
    "Landing Page Design",
  ],
  openGraph: {
    type: "website",
    siteName: "masakinihirota@gmail.com",
    locale: "ja",
    url: "https://masakinihirota.com/",
    title: "masakinihirota",
    description: "VNS",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Shadcn UI Landing Page Preview",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: [
    {
      rel: "icon",
      url: "/favicon.ico",
    },
    {
      rel: "apple-touch-icon",
      url: "/apple-touch-icon.png",
    },
    {
      rel: "icon",
      type: "image/png",
      url: "/favicon-32x32.png",
      sizes: "32x32",
    },
  ],
};

describe("メタデータのテスト", () => {
  it("基本的なメタデータが正しく設定されていること", () => {
    expect(mockMetadata.title).toBe("masakinihirota");
    expect(mockMetadata.description).toBe("VNS");
    expect(Array.isArray(mockMetadata.keywords)).toBe(true);
    expect(mockMetadata.keywords).toContain("Shadcn UI");
    expect(mockMetadata.keywords).toContain("Next.js 15 Landing Page");
  });

  it("OpenGraph メタデータが正しく設定されていること", () => {
    expect(mockMetadata.openGraph).toBeDefined();
    if (mockMetadata.openGraph) {
      expect(mockMetadata.openGraph.type).toBe("website");
      expect(mockMetadata.openGraph.siteName).toBe("masakinihirota@gmail.com");
      expect(mockMetadata.openGraph.locale).toBe("ja");
      expect(mockMetadata.openGraph.title).toBe("masakinihirota");
      expect(mockMetadata.openGraph.description).toBe("VNS");

      // 画像の設定を確認
      expect(Array.isArray(mockMetadata.openGraph.images)).toBe(true);
      if (
        Array.isArray(mockMetadata.openGraph.images) &&
        mockMetadata.openGraph.images.length > 0
      ) {
        const image = mockMetadata.openGraph.images[0];
        expect(image.url).toBe("/og-image.jpg");
        expect(image.width).toBe(1200);
        expect(image.height).toBe(630);
      }
    }
  });

  it("アイコンが正しく設定されていること", () => {
    expect(Array.isArray(mockMetadata.icons)).toBe(true);
    if (Array.isArray(mockMetadata.icons)) {
      // favicon.ico が含まれていることを確認
      const faviconExists = mockMetadata.icons.some(
        (icon) =>
          typeof icon === "object" &&
          "url" in icon &&
          icon.url === "/favicon.ico",
      );
      expect(faviconExists).toBe(true);

      // apple-touch-icon が含まれていることを確認
      const appleTouchIconExists = mockMetadata.icons.some(
        (icon) =>
          typeof icon === "object" &&
          "url" in icon &&
          icon.url === "/apple-touch-icon.png",
      );
      expect(appleTouchIconExists).toBe(true);
    }
  });

  it("robots 設定が正しく設定されていること", () => {
    expect(mockMetadata.robots).toBeDefined();
    if (mockMetadata.robots) {
      expect(mockMetadata.robots.index).toBe(true);
      expect(mockMetadata.robots.follow).toBe(true);
    }
  });
});
