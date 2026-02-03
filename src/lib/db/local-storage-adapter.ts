"use client";

import { v4 as uuidv4 } from "uuid";
import { CreateProfileData, UserProfile } from "./user-profiles";

const STORAGE_KEY_PROFILES = "vns_trial_profiles";
const STORAGE_KEY_DEVICE_ID = "vns_device_id";

// デバイスIDを取得または生成する
export function getDeviceId(): string {
  if (typeof window === "undefined") return "server-side-dummy-id";

  let deviceId = window.localStorage.getItem(STORAGE_KEY_DEVICE_ID);
  if (!deviceId) {
    deviceId = uuidv4();
    window.localStorage.setItem(STORAGE_KEY_DEVICE_ID, deviceId);
  }
  return deviceId;
}

// ローカルストレージからプロフィールを取得
export async function getLocalUserProfiles(
  deviceId: string
): Promise<UserProfile[]> {
  if (typeof window === "undefined") return [];

  const stored = window.localStorage.getItem(STORAGE_KEY_PROFILES);
  if (!stored) return [];

  try {
    const profiles: UserProfile[] = JSON.parse(stored);
    // デバイスID（所有者）が一致するものだけを返す（念のため）
    // ※現状はブラウザ単位なので全件返しても良いが、形式を合わせる
    return profiles.filter((p) => p.root_account_id === deviceId);
  } catch (e) {
    console.error("Failed to parse local profiles", e);
    return [];
  }
}

// ローカルストレージにプロフィールを作成
export async function createLocalUserProfile(
  deviceId: string,
  data: CreateProfileData
): Promise<UserProfile> {
  if (typeof window === "undefined") {
    throw new Error("Cannot create local profile on server side");
  }

  await getLocalUserProfiles(deviceId);

  // 簡易的なID生成
  const newId = uuidv4();
  const now = new Date().toISOString();

  const newProfile: UserProfile = {
    id: newId,
    root_account_id: deviceId,
    display_name: data.display_name,
    purpose: data.purpose ?? null, // Deprecated but keep for compat
    role_type: data.role_type ?? "member",
    is_active: true,
    last_interacted_record_id: null,
    created_at: now,
    updated_at: now,
    profile_format: data.profile_format ?? "profile",
    role: data.role ?? "member",
    purposes: data.purposes ?? [],
    profile_type: data.profile_type ?? "self",
    avatar_url: data.avatar_url ?? null,
    external_links: data.external_links ?? null,
  };

  // 保存
  const allProfiles = await getAllLocalProfiles(); // 既存の別デバイスIDのデータも消さないように全取得
  const updatedAll = [...allProfiles, newProfile];
  window.localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(updatedAll));

  return newProfile;
}

// 内部ヘルパー: IDに関係なく全保存データを取得
async function getAllLocalProfiles(): Promise<UserProfile[]> {
  if (typeof window === "undefined") return [];
  const stored = window.localStorage.getItem(STORAGE_KEY_PROFILES);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}
