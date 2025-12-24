import React, { useState, useEffect } from "react";
import { ValueItem, UserValueAnswer } from "../common/types";
import { ValuesList } from "./values-list";
import { fetchValues, fetchUserAnswers, saveUserAnswer } from "./values-list.logic";

export const ValuesListContainer = () => {
  const [questions, setQuestions] = useState<ValueItem[]>([]);
  const [answers, setAnswers] = useState<Record<string, UserValueAnswer>>({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchValues(), fetchUserAnswers()])
        .then(([qData, aData]) => {
          setQuestions(qData);
          const answersMap = aData.reduce((acc, curr) => ({ ...acc, [curr.questionId]: curr }), {});
          setAnswers(answersMap);
        })
        .catch((e) => console.error(e))
        .finally(() => setLoading(false));
    };
    void loadData();
  }, []);

  const handleAnswerChange = async (questionId: string, value: number) => {
    const newAnswer: UserValueAnswer = {
      id: answers[questionId]?.id || Math.random().toString(),
      questionId,
      answer: value,
      isPublic: answers[questionId]?.isPublic ?? true,
    };

    // Optimistic update
    setAnswers((prev) => ({ ...prev, [questionId]: newAnswer }));

    // Debounce save (simplified here to direct save for now, could be improved)
    setSavingId(questionId);
    await saveUserAnswer(newAnswer)
      .catch((e) => console.error("Failed to save", e))
      .finally(() => setSavingId(null));
  };

  const handlePrivacyToggle = async (questionId: string) => {
    const current = answers[questionId];
    if (!current) return;

    const newAnswer = { ...current, isPublic: !current.isPublic };
    setAnswers((prev) => ({ ...prev, [questionId]: newAnswer }));

    setSavingId(questionId);
    await saveUserAnswer(newAnswer);
    setSavingId(null);
  };

  return (
    <ValuesList
      questions={questions}
      answers={answers}
      loading={loading}
      savingId={savingId}
      onAnswerChange={handleAnswerChange}
      onPrivacyToggle={handlePrivacyToggle}
    />
  );
};
