"use client";

import { useState } from "react";
import { WorkRegistrationFormView } from "./work-registration-form";

export const WorkRegistrationFormContainer = () => {
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState<string[]>([]);
  const [tier, setTier] = useState(5);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isAdmin, _setIsAdmin] = useState(false); // 実際の実装では、ユーザーの権限に基づいて設定する

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // フォームの送信処理をここに実装
    console.log("フォームが送信されました");
  };

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setSubCategory([]);
  };

  const handleSubCategoryChange = (subCat: string, checked: boolean) => {
    if (checked) {
      setSubCategory([...subCategory, subCat]);
    } else {
      setSubCategory(subCategory.filter((sc) => sc !== subCat));
    }
  };

  return (
    <WorkRegistrationFormView
      category={category}
      subCategory={subCategory}
      tier={tier}
      tags={tags}
      newTag={newTag}
      isAdmin={isAdmin}
      onCategoryChange={handleCategoryChange}
      onSubCategoryChange={handleSubCategoryChange}
      onTierChange={setTier}
      onTagsChange={setTags}
      onNewTagChange={setNewTag}
      onAddTag={handleAddTag}
      onSubmit={handleSubmit}
    />
  );
};
