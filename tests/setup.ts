/**
 * @file Vitestのセットアップファイル
 * @description テスト実行前の環境設定を行います
 */

import "@testing-library/jest-dom";
import "vitest-axe/extend-expect";
import { expect, vi } from "vitest";
import * as matchers from "vitest-axe/matchers";

expect.extend(matchers);

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
