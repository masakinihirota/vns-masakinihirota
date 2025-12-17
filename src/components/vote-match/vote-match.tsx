import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Question } from "./vote-match.logic";

interface VoteMatchViewProps {
  currentQuestion: number;
  totalQuestions: number;
  question: Question;
  answer: string | null;
  showNextButton: boolean;
  progress: number;
  onAnswer: (choice: string) => void;
  onPrevious: () => void;
  onNext: () => void;
}

export const VoteMatchView = ({
  currentQuestion,
  totalQuestions,
  question,
  answer,
  showNextButton,
  progress,
  onAnswer,
  onPrevious,
  onNext,
}: VoteMatchViewProps) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="bg-primary text-primary-foreground">
        <CardTitle className="text-2xl font-bold text-center">衆議院選2024 ボートマッチ</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Progress value={progress} className="mb-4" />
        <p className="text-right mb-4">
          {currentQuestion + 1} / {totalQuestions}
        </p>
        <h2 className="text-4xl font-bold mb-4 text-center">Q{question.id}</h2>
        <h3 className="text-xl font-semibold mb-4 text-center">{question.category}</h3>
        <p className="text-lg mb-6 text-center">{question.text}</p>
        <div className="space-y-4 mb-6">
          {question.choices.map((choice, index) => (
            <Button
              key={index}
              variant={answer === choice ? "default" : "outline"}
              className="w-full text-left justify-start h-auto py-3 px-4"
              onClick={() => onAnswer(choice)}
            >
              {choice}
            </Button>
          ))}
        </div>
        <div className="flex justify-between">
          <Button onClick={onPrevious} disabled={currentQuestion === 0} variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" /> 前へ
          </Button>
          {showNextButton && (
            <Button onClick={onNext} variant="outline">
              次へ <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
