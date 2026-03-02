 

import { createHmac, createHash } from "crypto";
import { VNSTrialData } from "./trial-storage";
import { logger } from "@/lib/logger";

/**
 * 匿名データの署名・検証ユーティリティ
 * HMAC-SHA256 を使用してデータの完全性と改ざん検知を実現
 */

const SIGNATURE_SECRET = process.env.BETTER_AUTH_SECRET || "";
const VALIDATION_DAYS = 30;

/**
 * フォーマットを正規化してハッシュ化(重複検知用)
 */
export function hashTrialData(data: VNSTrialData): string {
  const normalized = JSON.stringify({
    rootAccount: data.rootAccount,
    profiles: data.profiles,
    watchlist: data.watchlist,
    points: data.points,
    createdAt: data.createdAt,
  });
  return createHash("sha256").update(normalized).digest("hex");
}

/**
 * データに署名を生成
 * @param data 署名するデータ
 * @returns { signature, hash }
 */
export function signTrialData(data: VNSTrialData): {
  signature: string;
  hash: string;
} {
  if (typeof window !== "undefined") {
    throw new Error("signTrialData はサーバー側のみで実行可能");
  }

  if (!SIGNATURE_SECRET) {
    logger.warn("[TrialSignature] BETTER_AUTH_SECRET が設定されていません");
    return { signature: "", hash: "" };
  }

  const hash = hashTrialData(data);
  const signature = createHmac("sha256", SIGNATURE_SECRET)
    .update(hash)
    .digest("hex");

  return { signature, hash };
}

/**
 * データの署名を検証
 * @param data 検証するデータ
 * @param signature 署名
 * @returns 署名が有効ならtrue
 */
export function verifyTrialData(
  data: VNSTrialData,
  signature: string
): boolean {
  if (typeof window !== "undefined") {
    throw new Error("verifyTrialData はサーバー側のみで実行可能");
  }

  if (!SIGNATURE_SECRET) {
    logger.warn("[TrialSignature] BETTER_AUTH_SECRET が設定されていません");
    return false;
  }

  const { signature: expectedSignature } = signTrialData(data);
  const isValid = signature === expectedSignature;

  if (!isValid) {
    logger.error("[TrialSignature] 署名が一致しません(改ざん検知)");
  }

  return isValid;
}

/**
 * タイムスタンプが有効期限内かチェック
 * @param createdAt データ作成日時
 * @param validationDays 有効期限(日数)
 * @returns 有効ならtrue
 */
export function isTimestampValid(
  createdAt: string,
  validationDays: number = VALIDATION_DAYS
): boolean {
  try {
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffMs = now.getTime() - createdDate.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    const isValid = diffDays <= validationDays;
    if (!isValid) {
      logger.warn(
        `[TrialSignature] データが期限切れです(${Math.floor(diffDays)}日前)`
      );
    }

    return isValid;
  } catch (error) {
    logger.error("[TrialSignature] タイムスタンプ検証エラー:", error);
    return false;
  }
}

/**
 * データの上限値チェック
 * @param data 検証するデータ
 * @returns { valid, errors } - valid=全て OK, errors=超過項目の配列
 */
export function validateDataLimits(data: VNSTrialData): {
  valid: boolean;
  errors: Array<{ field: string; current: number; max: number }>;
} {
  const errors: Array<{ field: string; current: number; max: number }> = [];

  // Points チェック
  const maxPoints = 1_000_000;
  if ((data.points?.current || 0) > maxPoints) {
    errors.push({
      field: "points",
      current: data.points.current,
      max: maxPoints,
    });
  }

  // Profiles チェック
  const maxProfiles = 10;
  if ((data.profiles?.length || 0) > maxProfiles) {
    errors.push({
      field: "profiles",
      current: data.profiles.length,
      max: maxProfiles,
    });
  }

  // Drafts チェック (watch と同じ配列を使う想定)
  const maxDrafts = 100;
  if ((data.watchlist?.length || 0) > maxDrafts) {
    errors.push({
      field: "watchlist/drafts",
      current: data.watchlist.length,
      max: maxDrafts,
    });
  }

  // Groups チェック
  const maxGroups = 2;
  if ((data.groups?.length || 0) > maxGroups) {
    errors.push({
      field: "groups",
      current: data.groups.length,
      max: maxGroups,
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * 全検証を実行
 * @param data 検証するデータ
 * @param signature 署名
 * @returns { valid, errors } - errors はエラー内容の配列
 */
export function validateTrialDataFull(
  data: VNSTrialData,
  signature: string
): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // 署名検証
  if (!verifyTrialData(data, signature)) {
    errors.push("signature_invalid: データが改ざんされています");
    return { valid: false, errors };
  }

  // タイムスタンプ検証
  if (!isTimestampValid(data.createdAt)) {
    errors.push(
      `timestamp_expired: ${VALIDATION_DAYS}日以上前のデータです`
    );
  }

  // 上限値チェック
  const limitCheck = validateDataLimits(data);
  if (!limitCheck.valid) {
    limitCheck.errors.forEach((err) => {
      errors.push(
        `limit_exceeded: ${err.field} (現在: ${err.current}, 上限: ${err.max})`
      );
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
