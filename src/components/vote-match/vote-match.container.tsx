"use client";

import { useState } from "react";
import { VoteMatchView } from "./vote-match";
import { QUESTIONS } from "./vote-match.logic";

export const VoteMatchContainer = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>(new Array(QUESTIONS.length).fill(null));
  const showNextButton =
    currentQuestion < QUESTIONS.length - 1 && answers[currentQuestion] !== null;

  const handleAnswer = (choice: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = choice;
    setAnswers(newAnswers);

    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const goToPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const goToNext = () => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

  return (
    <VoteMatchView
      currentQuestion={currentQuestion}
      totalQuestions={QUESTIONS.length}
      question={QUESTIONS[currentQuestion]}
      answer={answers[currentQuestion]}
      showNextButton={showNextButton}
      progress={progress}
      onAnswer={handleAnswer}
      onPrevious={goToPrevious}
      onNext={goToNext}
    />
  );
};
