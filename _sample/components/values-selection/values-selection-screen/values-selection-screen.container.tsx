"use client";

import React, { useId, useState } from "react";

import { ValueSelectionScreen } from "./values-selection-screen";
import {
  Choice,
  ValueSelectionMessage,
  INITIAL_CHOICES,
  generateRelatedIds,
} from "./values-selection-screen.logic";

export const ValueSelectionScreenContainer: React.FC = () => {
  const [choices, setChoices] = useState<Choice[]>(INITIAL_CHOICES);
  const [message, setMessage] = useState<ValueSelectionMessage | null>(null);

  // generate stable unique ids for elements to satisfy useUniqueElementIds rule
  const importantValueId = useId();
  const relatedBaseId = useId();
  const relatedIds = generateRelatedIds(relatedBaseId, 5);

  // 選択肢追加
  const handleAddChoice = () => {
    const nextNumber = choices.length + 1;
    setChoices([
      ...choices,
      { label: `選択肢${nextNumber} (追加)`, user: "登録ユーザー名" },
    ]);
    showMessage("選択肢が追加されました！", "success");
  };

  // 選択肢削除
  const handleDeleteChoice = (index: number) => {
    setChoices(choices.filter((_, index_) => index_ !== index));
    showMessage("選択肢が削除されました。", "success");
  };

  // メッセージ表示
  const showMessage = (message_: string, type: "success" | "error" = "success") => {
    setMessage({ text: message_, type });
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <ValueSelectionScreen
      choices={choices}
      message={message}
      onAddChoice={handleAddChoice}
      onDeleteChoice={handleDeleteChoice}
      importantValueId={importantValueId}
      relatedIds={relatedIds}
    />
  );
};
