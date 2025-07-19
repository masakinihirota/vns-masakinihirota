"use client";

import React, { useState } from "react";
import { DAButton } from "@/components/ui/da-button";
import {
  DACard,
  DACardHeader,
  DACardTitle,
  DACardDescription,
  DACardContent,
} from "@/components/ui/da-card";
import { DAInput, DALabel, DATextarea } from "@/components/ui/da-input";

export default function DigitalAgencyDemoPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // バリデーション
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "お名前は必須です";
    if (!formData.email) newErrors.email = "メールアドレスは必須です";
    if (!formData.message) newErrors.message = "メッセージは必須です";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      alert("フォームが送信されました！");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-[var(--da-color-gray-50)] py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--da-color-gray-900)] mb-4">
            デジタル庁デザインシステム デモ
          </h1>
          <p className="text-[var(--da-color-gray-600)] text-lg">
            政府サービスに準拠したUIコンポーネントのデモンストレーション
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* ボタンデモ */}
          <DACard>
            <DACardHeader>
              <DACardTitle>ボタンコンポーネント</DACardTitle>
              <DACardDescription>
                デジタル庁デザインシステムに準拠したボタンの各種バリエーション
              </DACardDescription>
            </DACardHeader>
            <DACardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-[var(--da-color-gray-700)]">
                  バリエーション
                </h4>
                <div className="flex flex-wrap gap-2">
                  <DAButton variant="primary">プライマリ</DAButton>
                  <DAButton variant="secondary">セカンダリ</DAButton>
                  <DAButton variant="outline">アウトライン</DAButton>
                  <DAButton variant="ghost">ゴースト</DAButton>
                  <DAButton variant="destructive">削除</DAButton>
                  <DAButton variant="link">リンク</DAButton>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm text-[var(--da-color-gray-700)]">
                  サイズ
                </h4>
                <div className="flex flex-wrap items-center gap-2">
                  <DAButton size="sm">小</DAButton>
                  <DAButton size="md">中</DAButton>
                  <DAButton size="lg">大</DAButton>
                  <DAButton size="xl">特大</DAButton>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm text-[var(--da-color-gray-700)]">
                  状態
                </h4>
                <div className="flex flex-wrap gap-2">
                  <DAButton>通常</DAButton>
                  <DAButton disabled>無効</DAButton>
                </div>
              </div>
            </DACardContent>
          </DACard>

          {/* フォームデモ */}
          <DACard>
            <DACardHeader>
              <DACardTitle>フォームコンポーネント</DACardTitle>
              <DACardDescription>
                アクセシブルで使いやすいフォーム要素
              </DACardDescription>
            </DACardHeader>
            <DACardContent>
              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <DALabel
                    htmlFor="name"
                    required
                  >
                    お名前
                  </DALabel>
                  <DAInput
                    id="name"
                    placeholder="山田太郎"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    error={!!errors.name}
                    helperText={errors.name}
                  />
                </div>

                <div className="space-y-2">
                  <DALabel
                    htmlFor="email"
                    required
                  >
                    メールアドレス
                  </DALabel>
                  <DAInput
                    id="email"
                    type="email"
                    placeholder="example@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                </div>

                <div className="space-y-2">
                  <DALabel
                    htmlFor="message"
                    required
                  >
                    メッセージ
                  </DALabel>
                  <DATextarea
                    id="message"
                    placeholder="ご意見・ご要望をお聞かせください"
                    value={formData.message}
                    onChange={(e) =>
                      handleInputChange("message", e.target.value)
                    }
                    error={!!errors.message}
                    helperText={errors.message}
                    rows={4}
                  />
                </div>

                <div className="flex gap-2">
                  <DAButton
                    type="submit"
                    variant="primary"
                  >
                    送信
                  </DAButton>
                  <DAButton
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setFormData({ name: "", email: "", message: "" });
                      setErrors({});
                    }}
                  >
                    リセット
                  </DAButton>
                </div>
              </form>
            </DACardContent>
          </DACard>
        </div>

        {/* カラーパレット */}
        <DACard className="mt-8">
          <DACardHeader>
            <DACardTitle>カラーパレット</DACardTitle>
            <DACardDescription>
              デジタル庁デザインシステムのカラーパレット
            </DACardDescription>
          </DACardHeader>
          <DACardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <h4 className="font-medium mb-2 text-[var(--da-color-gray-700)]">
                  プライマリカラー
                </h4>
                <div className="flex gap-1">
                  {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map(
                    (shade) => (
                      <div
                        key={shade}
                        className="w-8 h-8 rounded"
                        style={{
                          backgroundColor: `var(--da-color-primary-${shade})`,
                        }}
                        title={`Primary ${shade}`}
                      />
                    ),
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2 text-[var(--da-color-gray-700)]">
                  グレースケール
                </h4>
                <div className="flex gap-1">
                  {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map(
                    (shade) => (
                      <div
                        key={shade}
                        className="w-8 h-8 rounded border border-gray-200"
                        style={{
                          backgroundColor: `var(--da-color-gray-${shade})`,
                        }}
                        title={`Gray ${shade}`}
                      />
                    ),
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2 text-[var(--da-color-gray-700)]">
                  セマンティックカラー
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded"
                      style={{ backgroundColor: "var(--da-color-success)" }}
                    />
                    <span className="text-sm">成功</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded"
                      style={{ backgroundColor: "var(--da-color-warning)" }}
                    />
                    <span className="text-sm">警告</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded"
                      style={{ backgroundColor: "var(--da-color-error)" }}
                    />
                    <span className="text-sm">エラー</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded"
                      style={{ backgroundColor: "var(--da-color-info)" }}
                    />
                    <span className="text-sm">情報</span>
                  </div>
                </div>
              </div>
            </div>
          </DACardContent>
        </DACard>

        {/* フッター */}
        <div className="text-center mt-8 text-[var(--da-color-gray-600)]">
          <p>デジタル庁デザインシステムに準拠したコンポーネント実装例</p>
        </div>
      </div>
    </div>
  );
}
