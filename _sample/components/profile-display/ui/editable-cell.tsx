import { KeyboardEvent, useState } from "react";

import { ThemeVars as ThemeVariables } from "../features/profile-dashboard.types";

interface EditableCellProperties {
  readonly value: string;
  readonly onSave: (value: string) => void;
  readonly themeVars: ThemeVariables;
  readonly extraClass?: string;
  readonly isHeader?: boolean;
}

/**
 * クリックで編集可能になるテーブルセル
 * @param root0
 * @param root0.value
 * @param root0.onSave
 * @param root0.extraClass
 * @param root0.isHeader
 */
export const EditableCell = ({
  value,
  onSave,
  extraClass = "",
  isHeader = false,
}: EditableCellProperties) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);

  const handleSave = () => {
    setIsEditing(false);
    onSave(currentValue);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    }
    if (e.key === "Escape") {
      setIsEditing(false);
      setCurrentValue(value);
    }
  };

  const Component = isHeader ? "th" : "td";

  if (isEditing) {
    return (
      <Component
        className={`p-0 border-2 border-indigo-500/50 bg-indigo-500/5 ${extraClass}`}
      >
        <input
          autoFocus
          className="w-full h-full p-6 bg-transparent outline-none font-bold text-inherit"
          value={currentValue}
          onChange={(e) => setCurrentValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
        />
      </Component>
    );
  }

  return (
    <Component
      className={`p-6 cursor-text transition-colors ${extraClass}`}
      onClick={() => setIsEditing(true)}
    >
      {value || <span className="opacity-20 italic">未入力</span>}
    </Component>
  );
};
