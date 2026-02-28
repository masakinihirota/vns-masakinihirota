/**
 * RBAC Constants - ロール階層定義
 * "use server" ファイルの制約を回避するため、定数を別ファイルに分離
 */

import type { GroupRole, NationRole } from "./types";

/**
 * RBAC Hierarchy - ロール権限の階層定義
 * インデックスが高いほど権限が高い
 * @example
 * RBAC_HIERARCHY['leader'] = 3 (最高権限)
 * RBAC_HIERARCHY['sub_leader'] = 2
 * RBAC_HIERARCHY['mediator'] = 1
 * RBAC_HIERARCHY['member'] = 0 (最低権限)
 */
export const RBAC_HIERARCHY: Record<GroupRole | NationRole, number> = {
  leader: 3,
  sub_leader: 2,
  mediator: 1,
  member: 0,
};
