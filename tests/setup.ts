/**
 * @file Vitestのセットアップファイル
 * @description テスト実行前の環境設定を行います
 */

import "@testing-library/jest-dom";
import { vi } from "vitest";

// next/fontのモック
vi.mock("next/font/google", () => ({
  Geist: () => ({
    variable: "--font-geist-sans",
    className: "geist-sans",
  }),
  Geist_Mono: () => ({
    variable: "--font-geist-mono",
    className: "geist-mono",
  }),
}));
