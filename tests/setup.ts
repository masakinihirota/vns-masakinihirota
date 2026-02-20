/**
 * @file Vitestのセットアップファイル
 * @description テスト実行前の環境設定を行います
 */

import "@testing-library/jest-dom";
import { expect, vi } from "vitest";
import { type AxeMatchers } from "vitest-axe";
import "vitest-axe/extend-expect";
import * as matchers from "vitest-axe/matchers";

expect.extend(matchers);

declare module "vitest" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-object-type
  export interface Assertion extends AxeMatchers { }
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface AsymmetricMatchersContaining extends AxeMatchers { }
}

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

global.ResizeObserver = class ResizeObserver {
  observe() { }
  unobserve() { }
  disconnect() { }
};
