"use client";

import {
  RefreshCcw,
  Check,
  User,
  Briefcase,
  Heart,
  Gamepad2,
  Sparkles,
  Building2,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import {
  generateUniqueCandidates,
  ZODIAC_MAPPING,
} from "@/lib/anonymous-name-generator";
import { UserProfile } from "@/lib/db/user-profiles";

// Types
export type ProfileFormat = "business_card" | "profile" | "full";
export type ProfileRole = "leader" | "member";
export type ProfileType = "self" | "interview" | "third_party" | "ideal" | "ai";
export type ProfilePurpose = "work" | "play" | "marriage";

interface ProfileCreationStep1Props {
  existingProfiles: UserProfile[];
}

export function ProfileCreationStep1({
  existingProfiles,
}: ProfileCreationStep1Props) {
  const router = useRouter();

  // --- State ---
  const [zodiacSign, setZodiacSign] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [candidates, setCandidates] = useState<string[]>([]);
  const [excludedNames, setExcludedNames] = useState<string[]>([]);

  const [format, setFormat] = useState<ProfileFormat>("profile");
  const [role, setRole] = useState<ProfileRole>("member");
  const [purposes, setPurposes] = useState<ProfilePurpose[]>(["work"]);
  const [type, setType] = useState<ProfileType>("self");

  // Validation State
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Computed
  const hasMarriageProfile = existingProfiles.some(
    (p) => p.purposes?.includes("marriage") || p.purpose === "marriage" // Check legacy field too just in case
  );

  // --- Handlers ---

  // Zodiac & Name
  useEffect(() => {
    if (zodiacSign) {
      const newCandidates = generateUniqueCandidates(zodiacSign, 3);
      setCandidates(newCandidates);
      setExcludedNames(newCandidates);
      if (!newCandidates.includes(displayName)) {
        setDisplayName("");
      }
    } else {
      setCandidates([]);
      setExcludedNames([]);
    }
  }, [zodiacSign]);

  const handleReloadNames = () => {
    if (!zodiacSign) return;
    const newCandidates = generateUniqueCandidates(
      zodiacSign,
      3,
      excludedNames
    );
    setCandidates(newCandidates);
    setExcludedNames((prev) => [...prev, ...newCandidates].slice(-50)); // Keep last 50
  };

  // Purpose Toggle
  const togglePurpose = (p: ProfilePurpose) => {
    if (
      p === "marriage" &&
      hasMarriageProfile &&
      !purposes.includes("marriage")
    ) {
      return; // Cannot add marriage if already exists
    }

    setPurposes((prev) => {
      if (prev.includes(p)) {
        return prev.filter((item) => item !== p);
      } else {
        return [...prev, p];
      }
    });
  };

  // Validation
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!displayName) newErrors.displayName = "表示名を選択してください";
    if (purposes.length === 0)
      newErrors.purposes = "目的を少なくとも1つ選択してください";

    // Role & Type Constraints
    if (role === "leader" && (type === "interview" || type === "third_party")) {
      newErrors.type =
        "リーダーはインタビューまたは他者視点のプロフィールを作成できません";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;

    // Build query params or state to pass to next step
    // Using URL search params for simplicity in this refactor
    const params = new URLSearchParams();
    params.set("display_name", displayName);
    params.set("zodiac_sign", zodiacSign);
    params.set("profile_format", format);
    params.set("role", role);
    params.set("profile_type", type);
    purposes.forEach((p) => params.append("purposes", p));

    // Determine target URL based on refactoring plan
    // We moved the old 'new' page to 'new/details'
    const targetUrl = `/user-profiles/new/details?${params.toString()}`;
    router.push(targetUrl);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-12 pb-20">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
          プロフィールの形を決める
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          あなたの新しい顔となるプロフィールの基本設定を行います
        </p>
      </div>

      {/* 1. Identity (Avatar & Name) */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-8">
        <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200">
          <User className="w-6 h-6 text-indigo-500" />
          アイデンティティ
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Constellation Select */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              星座 (匿名性の基盤)
            </label>
            <select
              value={zodiacSign}
              onChange={(e) => setZodiacSign(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            >
              <option value="">選択してください</option>
              {Object.entries(ZODIAC_MAPPING).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Name Selection */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                表示名候補
              </label>
              <button
                onClick={handleReloadNames}
                disabled={!zodiacSign}
                className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
              >
                <RefreshCcw size={14} /> 更新
              </button>
            </div>

            {!zodiacSign ? (
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 text-sm text-center">
                星座を選択すると候補が表示されます
              </div>
            ) : (
              <div className="grid gap-2">
                {candidates.map((name) => (
                  <button
                    key={name}
                    onClick={() => setDisplayName(name)}
                    className={`p-3 rounded-lg text-left transition-all flex justify-between items-center ${
                      displayName === name
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                        : "bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    <span>{name}</span>
                    {displayName === name && <Check size={16} />}
                  </button>
                ))}
              </div>
            )}
            {errors.displayName && (
              <p className="text-red-500 text-sm">{errors.displayName}</p>
            )}
          </div>
        </div>
      </section>

      {/* 2. Format Selection */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200">
          <Briefcase className="w-6 h-6 text-purple-500" />
          形式
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              id: "business_card",
              label: "名刺",
              desc: "必要最低限の情報のみ",
            },
            {
              id: "profile",
              label: "プロフィール",
              desc: "ポートフォリオ、履歴書、経歴書",
            },
            { id: "full", label: "フル", desc: "制限無しですべての情報を含む" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFormat(item.id as ProfileFormat)}
              className={`p-6 rounded-xl border-2 text-left transition-all space-y-2 ${
                format === item.id
                  ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                  : "border-slate-100 dark:border-slate-800 hover:border-purple-200"
              }`}
            >
              <div className="font-bold text-lg">{item.label}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {item.desc}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Role & Type */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Role */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200">
            <Building2 className="w-6 h-6 text-blue-500" />
            役割
          </h2>
          <div className="space-y-3">
            {[
              {
                id: "leader",
                label: "リーダー",
                desc: "プロフィール作成時、組織も同時に作成",
              },
              { id: "member", label: "メンバー", desc: "組織の構成パーツ" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setRole(item.id as ProfileRole)}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all flex justify-between items-center ${
                  role === item.id
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-slate-100 dark:border-slate-800 hover:border-blue-200"
                }`}
              >
                <div>
                  <div className="font-bold">{item.label}</div>
                  <div className="text-xs text-slate-500">{item.desc}</div>
                </div>
                {role === item.id && <Check className="text-blue-500" />}
              </button>
            ))}
          </div>
        </section>

        {/* Type */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200">
            <Users className="w-6 h-6 text-green-500" />
            種類
          </h2>
          <div className="space-y-2">
            {[
              {
                id: "self",
                label: "本人 (デフォルト)",
                allowedRoles: ["leader", "member"],
              },
              {
                id: "interview",
                label: "インタビュー",
                allowedRoles: ["member"],
              },
              {
                id: "third_party",
                label: "他人視点",
                allowedRoles: ["member"],
              },
              {
                id: "ideal",
                label: "理想像",
                allowedRoles: ["leader", "member"],
              },
              {
                id: "ai",
                label: "AI (架空)",
                allowedRoles: ["leader", "member"],
              },
            ].map((item) => {
              const isDisabled = !item.allowedRoles.includes(role);
              return (
                <button
                  key={item.id}
                  onClick={() => !isDisabled && setType(item.id as ProfileType)}
                  disabled={isDisabled}
                  className={`w-full p-3 rounded-lg border text-left transition-all flex md:justify-between md:items-center ${
                    type === item.id
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20 ring-1 ring-green-500"
                      : "border-slate-100 dark:border-slate-800"
                  } ${isDisabled ? "opacity-40 cursor-not-allowed bg-slate-100 dark:bg-slate-800" : "hover:bg-slate-50 dark:hover:bg-slate-800"}`}
                >
                  <span className="font-medium text-sm">{item.label}</span>
                  {isDisabled && (
                    <span className="text-xs text-red-400">リーダー不可</span>
                  )}
                </button>
              );
            })}
          </div>
          {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
        </section>
      </div>

      {/* 4. Purpose */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200">
          <Sparkles className="w-6 h-6 text-yellow-500" />
          目的 (複数選択可)
        </h2>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => togglePurpose("work")}
            className={`flex items-center gap-2 px-6 py-3 rounded-full border-2 transition-all ${
              purposes.includes("work")
                ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                : "border-slate-200 dark:border-slate-700 text-slate-600"
            }`}
          >
            <Briefcase size={18} /> 仕事
          </button>

          <button
            onClick={() => togglePurpose("play")}
            className={`flex items-center gap-2 px-6 py-3 rounded-full border-2 transition-all ${
              purposes.includes("play")
                ? "border-pink-500 bg-pink-50 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300"
                : "border-slate-200 dark:border-slate-700 text-slate-600"
            }`}
          >
            <Gamepad2 size={18} /> 遊び
          </button>

          <button
            onClick={() => togglePurpose("marriage")}
            disabled={hasMarriageProfile && !purposes.includes("marriage")}
            className={`relative flex items-center gap-2 px-6 py-3 rounded-full border-2 transition-all ${
              purposes.includes("marriage")
                ? "border-red-500 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                : "border-slate-200 dark:border-slate-700 text-slate-600"
            } ${hasMarriageProfile && !purposes.includes("marriage") ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Heart size={18} /> 婚活
            {hasMarriageProfile && !purposes.includes("marriage") && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs bg-slate-800 text-white px-2 py-0.5 rounded shadow-sm whitespace-nowrap">
                作成済み
              </span>
            )}
          </button>
        </div>
        {errors.purposes && (
          <p className="text-red-500 text-sm">{errors.purposes}</p>
        )}
      </section>

      {/* Footer / Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex justify-center z-50">
        <div className="w-full max-w-4xl flex justify-end">
          <button
            onClick={handleNext}
            className="px-10 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 hover:scale-105 active:scale-95 transition-all"
          >
            次へ進む
          </button>
        </div>
      </div>
    </div>
  );
}
