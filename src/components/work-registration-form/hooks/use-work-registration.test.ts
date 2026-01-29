import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { RegistrationFormValues } from "../schema";
import { useWorkRegistration } from "./use-work-registration";

describe("useWorkRegistration", () => {
  it("初期値が正しく設定されること", () => {
    const { result } = renderHook(() => useWorkRegistration());
    expect(result.current.form.getValues().work.title).toBe("");
    expect(result.current.form.getValues().entry.status).toBe("expecting");
  });

  it("props経由の初期値が反映されること", () => {
    const initialValues: Partial<RegistrationFormValues> = {
      work: {
        title: "テスト作品",
        author: "作者A",
        category: "manga",
        isNew: true,
        isAiGenerated: false,
      },
      entry: { status: "reading", memo: "メモ", tier: undefined },
    };
    const { result } = renderHook(() => useWorkRegistration(initialValues));

    expect(result.current.form.getValues().work.title).toBe("テスト作品");
    expect(result.current.form.getValues().entry.status).toBe("reading");
  });

  it("バリデーションが機能すること", async () => {
    const { result } = renderHook(() => useWorkRegistration());

    await act(async () => {
      // formState.errorsを購読対象にする
      const _ = result.current.form.formState.errors;
      await result.current.form.trigger();
    });

    expect(result.current.form.formState.errors.work?.title).toBeDefined();
    expect(result.current.form.formState.errors.work?.author).toBeDefined();
  });
});
