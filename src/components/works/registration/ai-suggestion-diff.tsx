import { Button } from "@/components/ui/button";
import type { RegistrationFormValues } from "./schema";

interface AiSuggestionDiffProps {
  suggestion: Partial<RegistrationFormValues>;
  onApply: () => void;
  onDiscard: () => void;
}

export function AiSuggestionDiff({
  suggestion,
  onApply,
  onDiscard,
}: AiSuggestionDiffProps) {
  if (!suggestion || !suggestion.work) return null;

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
        AIからの提案があります
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            タイトル
          </p>
          <p className="text-gray-900 dark:text-gray-100">
            {suggestion.work.title}
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            作者
          </p>
          <p className="text-gray-900 dark:text-gray-100">
            {suggestion.work.author}
          </p>
        </div>
        <div className="space-y-2 md:col-span-2">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            あらすじ (AI生成)
          </p>
          <p className="text-gray-900 dark:text-gray-100 text-sm whitespace-pre-wrap">
            {suggestion.work.summary}
          </p>
        </div>
        {/* Add more fields as needed */}
      </div>
      <div className="flex gap-2 justify-end">
        <Button
          variant="outline"
          onClick={onDiscard}
          className="text-gray-600 dark:text-gray-300"
        >
          破棄
        </Button>
        <Button
          onClick={onApply}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          適用する
        </Button>
      </div>
    </div>
  );
}
