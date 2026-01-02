import { describe, it, expect } from "vitest";
import {
  VALUES_QUESTIONS,

  fetchValues,
  fetchUserAnswers,
} from "./values-list.logic";

describe("Values List Logic", () => {
  it("質問リストが取得できること", async () => {
    const questions = await fetchValues();
    expect(questions.length).toBeGreaterThan(0);
    expect(questions[0].category).toBeDefined();
  });

  it("ユーザー回答が取得できること", async () => {
    const answers = await fetchUserAnswers();
    expect(answers.length).toBeGreaterThan(0);
    expect(answers[0].answer).toBeGreaterThanOrEqual(0);
    expect(answers[0].answer).toBeLessThanOrEqual(100);
  });

  it("質問IDが一意であること", () => {
    const ids = VALUES_QUESTIONS.map((q) => q.id);
    const uniqueIds = new Set(ids);
    expect(ids.length).toBe(uniqueIds.size);
  });
});
