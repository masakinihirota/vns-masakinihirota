# RBAC 失敗ケース テスト雛形

> 作成日: 2026-03-02
> 目的: RBAC実装前に「誰が / 何に / 何を / 期待HTTP」を先に固定し、deny-by-defaultを担保する

---

## 0. ドメイン前提（この文書の判定基準）

### 概念分離

- `root_account` は認証主体であり、複数の `user_profile` を管理する
- `persona` と `user_profile` は本サービスでは同義（目的別に使い分ける「仮面」）
- `user_profile` は活動主体であり、デフォルト状態として `ghost` を持つ
- 仮面（`user_profile` / `persona`）の切り替えはユーザーが手動で行う
- `group` はプロフィール単位で作成される（`root_account` 単位ではない）
- `matching` はプロフィール同士で成立する（`root_account` 同士ではない）

### プロフィール目的モデル（重要）

- プロフィール作成時に目的を設定する（例: モノ作り / 仕事 / 遊び / 婚活）
- 1つの `user_profile` が複数目的を同時に持つことができる
- 目的の違いで必ずプロフィールを分割する必要はない
- 複数プロフィールは「必要な人だけが使い分ける」任意機能とする
- したがって、目的拡張は「他グループへの参加」ではなく、まずプロフィール属性の拡張として扱う

### 仮面と受肉（Ghost ⇄ Persona の権限遷移）

> **イメージ**: Ghost（仮面なし）のままではアクション権がない。仮面を被ることで "受肉" し、初めてマッチングなどのアクション実行が許可される。

- `ghost` はデフォルト仮面（ユーザーが名前等を編集可能）
- `persona` は目的情報を持つ `user_profile`（1プロフィールで複数目的を持てる）
- 複数 `persona`（=複数 `user_profile`）の併用が可能
- `ghost` に許可される操作: 公開データ閲覧、`Watch`、条件なしマッチング
- `persona` に許可される操作: read + write 実行（Follow、条件付きマッチング、グループ運用など）

### マッチング・Watch/Follow 前提（プロフィールデータ起点）

- 各 `user_profile` は「好きなこと」「価値観」などの属性データを持つ
- 相性（compatibility）はプロフィール属性データから算出する
- マッチング判定は `profile` 間で行い、`group` の有無・役割は判定材料にしない
- サイト運用は原則オープンデータで、公開プロフィールは `Watch/Follow` 前でも閲覧可能
- `Watch` はマッチング有無に関係なく可能（Ghost/Personaともに可）
- `Follow` はマッチング有無に関係なく可能（ただし `ghost` は不可、`persona` のみ可）

#### Ghost の条件なし vs 条件付きマッチング

> **概念**: Ghost は属性データ（好きなこと・価値観）が未入力のため、条件そのものを設定できない。
> したがって **条件付きマッチングは実装不可能**（権限ではなく、物理的に条件がない）。

- **条件なしマッチング**: Ghost でも可能（全体マッチング）── 成功ケースで別管理
- **条件付きマッチング**: Ghost は実装不可（条件未設定 → `422 Unprocessable Entity`）
  - Ghost が呼び出してきても「条件設定がない」という実装上の理由で拒否
  - 本テンプレートではハイブリッド方針として **422 固定**（業務バリデーション失敗）
  - 純粋な権限制御違反（例: GhostのFollow）は 403 として分離する

#### Watch vs Follow の権限分離

> **イメージ**: Ghost は "実態がない" ため、相手に知らせる手段がない。
> - `Watch` = 観察（相手に通知されない）
> - `Follow` = 相手に気づいてもらう（相手に通知される）

- **`Watch` 実行は `ghost` でも可能**（read-only、相手に知られない）
- **`Follow` 実行は `persona` のみ可能**（相手に通知される操作のため、`ghost` は 403 拒否）
- 相互 `Follow` が確立すると相互フォロー状態になり、その後 Friend / Business Partner / Partner / Pre-partner などの関係へ進展可能
- したがって `group` と `persona`（仮面）は別概念であり、認可でも別軸で扱う

### 権限・状態ルール（本テンプレートの前提）

- 認可判定は `active_profile_id` を基準に行う
- **`ghost` は限定的状態**（観察と条件なしマッチングのみ許可）
- **`persona` は活動可能状態**（read + write 全操作を許可）
- 1つの `user_profile` は1つのグループを作成可能（プロフィール単位で管理）
- プロフィールがグループを作成した場合、そのプロフィールは自動で `group_leader` になる
- 1グループには複数プロフィールが `group_member` として参加可能
- **条件なしマッチング実行は `ghost` でも可能**（全体マッチング）── 成功ケースで別管理
- **条件付きマッチング実行は `persona` のみ**（`ghost` は条件未設定のため実装不可 → 422）
- **`Watch` 実行は `ghost` でも可能**（相手に通知されない観察）
- **`Follow` 実行は `persona` のみ可能**（相手に通知される操作のため、`ghost` は 403 拒否）

#### グループリーダー交代・終了

- `group_leader` は、メンバーがいる状態で後継メンバーを指名して交代できる
- `group_leader` は、グループを解散してから離脱できる
- 長期間活動がない場合、`group_member` から新リーダー提案が可能
- 新リーダーは、自身の `active_profile_id` で当該グループの `group_leader` になる

#### グループメンバーシップのジャーニー（Watch/Follow → 招待/参加申し込み）

- マッチング成立後、相手プロフィールを Watch or Follow(前提条件)
  - Watch のみ：相手のプロフィール情報を確認可能だが申し込みは未確定
  - Follow：相手に気づいてもらった状態
- 直接 Follow（マッチング非経由）で関係を開始する経路も許可する
- Watch/Follow 状態で、以下2つの選択肢が実行可能になる
  1. **自分のグループへ相手を招待** → リーダーが相手を `group_member` にするか判断
  2. **相手のグループへ参加申し込み** → 相手のリーダーが自分を `group_member` にするか判断
- グループリーダーは、申し込み者が Watch/Follow 済みであることを確認してからメンバー化判断を行う
- したがって、Watch/Follow なしで申し込みを試みても 403 or 404 で拒否される

---

## 1. 運用ルール（先に固定）

- 失敗ケースを先に作成（RED）し、成功ケースはその後に追加する
- すべてのケースで「判定主体（API / Server Action）」を明示する
- 同一操作は API と Server Action で判定同値を確認する
- 401 / 403 / 404 の使い分け方針を先に定義する

---

## 2. ケース定義テンプレート（最小）

| Case ID | 誰が（Actor） | 何に（Resource） | 何を（Action） | 前提条件 | 期待HTTP | 期待エラーコード/メッセージ | 判定主体 | テスト種別 | 実装先（予定） |
|---|---|---|---|---|---:|---|---|---|---|
| F-001 | 未認証ユーザー | `/api/groups/:id` | `GET` | セッションなし | 401 | `UNAUTHORIZED` | API | Integration | `src/__tests__/integration/...` |
| F-002 | `group_member` | `group-B` | `PATCH policy` | 所属は `group-A` のみ | 403 | `FORBIDDEN` | Server Action | Unit/Integration | `src/lib/auth/__tests__/...` |
| F-003 | `ghost` | `nation-X` | `POST create` | ghostモード | 403 | `GHOST_MODE_RESTRICTED` | API/Action | Integration | `src/__tests__/integration/...` |
| F-004 | `persona` | 他人の profile | `GET detail` | `active_profile_id` 不一致 | 404 または 403 | 方針に従う | API | Integration | `src/__tests__/integration/...` |

---

## 2.1 Actor固定 失敗ケース判定マトリクス（判断用）

> 目的: 「誰が（Actor）」の抜け漏れを防ぎ、失敗ケースを先に俯瞰で確定する

> 注意: グループロール（member/leader）とプロフィール状態（ghost/persona）は別軸で管理する

### Actor軸A: プロフィール状態

| Profile Actor | 説明 | セッション状態 | 備考 |
|---|---|---|---|
| 未認証ユーザー | ログイン前/セッション無効 | なし | 常に最優先で検証 |
| `ghost`（デフォルトプロファイル） | ルート配下の未受肉プロフィール | あり | Watch は可能、相手に通知される操作は拒否 |
| `persona`（受肉） | 受肉済みプロフィール | あり | マッチング・Follow・グループ操作等で活動可能 |

### Actor軸B: グループ所属/役割（プロフィールとは独立）

| Group Role Actor | 説明 |
|---|---|
| `no_group` | グループ未所属 |
| `group_member` | グループ所属メンバー |
| `group_leader` | グループ管理者（作成時に自動付与） |

### 組み合わせActor（失敗ケースで最低限使う代表）

| Actor | 説明 | セッション状態 | 備考 |
|---|---|---|---|
| 未認証ユーザー | ログイン前/セッション無効 | なし | 常に最優先で検証 |
| `ghost`（デフォルトプロファイル） | ルート配下の未受肉プロフィール | あり | 条件なしマッチング可能、条件付きマッチング実装不可（条件未設定） |
| `persona + no_group` | 受肉済みだがグループ未参加 | あり | Watch/Follow・条件なし・条件付きマッチング可能 |
| `persona + group_member` | 受肉済みでグループ参加中 | あり | リーダー権限なし、グループ操作は制限 |
| `persona + group_leader` | 受肉済みでグループ管理者 | あり | グループ作成時に自動付与、グループ操作可能 |

### 失敗ケース判定マトリクス（例）

| 操作（何に / 何を） | 未認証ユーザー | `ghost` | `persona + no_group` | `persona + group_member` | `persona + group_leader` |
|---|---:|---:|---:|---:|---:|
| 管理API `/admin/*` 参照 | 401 | 403 | 403 | 403 | 403 |
| グループ作成 `POST /groups` | 401 | 403 | 失敗ケース対象外 | 失敗ケース対象外 | 失敗ケース対象外 |
| マッチング実行 `POST /matchings`（条件なし） | 401 | 失敗ケース対象外 | 失敗ケース対象外 | 失敗ケース対象外 | 失敗ケース対象外 |
| マッチング実行（条件付き：好きな作品で絞り込み） | 401 | **422** | 失敗ケース対象外 | 失敗ケース対象外 | 失敗ケース対象外 |
| 公開プロフィール閲覧（非Watch/非Follow） | 401/許可 | 失敗ケース対象外 | 失敗ケース対象外 | 失敗ケース対象外 | 失敗ケース対象外 |
| Watch 実行 `POST /relationships/watch` | 401 | 失敗ケース対象外 | 失敗ケース対象外 | 失敗ケース対象外 | 失敗ケース対象外 |
| Follow 実行 `POST /relationships/follow` | 401 | **403** | 失敗ケース対象外 | 失敗ケース対象外 | 失敗ケース対象外 |
| マッチング非経由で Follow 実行 | 401 | **403** | 失敗ケース対象外 | 失敗ケース対象外 | 失敗ケース対象外 |
| マッチング成立・Watch/Follow なしで「相手を自グループへ招待」 | 401 | 403 | 403 | 403 | 403 |
| マッチング成立・Watch/Follow なしで「相手グループへ参加申し込み」 | 401 | 403 | 403 | 403 | 403 |
| マッチング成立・Watch/Follow 済みで「相手を自グループへ招待」 | 401 | 403 | 失敗ケース対象外 | 失敗ケース対象外 | 失敗ケース対象外 |
| マッチング成立・Watch/Follow 済みで「相手グループへ参加申し込み」 | 401 | 403 | 失敗ケース対象外 | 失敗ケース対象外 | 失敗ケース対象外 |
| マッチング未成立で「相手を自グループへ招待」 | 401 | 403 | 403 | 403 | 403 |
| マッチング未成立で「相手グループへ参加」 | 401 | 403 | 403 | 403 | 403 |
| 他人マッチングIDを使って「相手を自グループへ招待」 | 401 | 403 | 403 | 403 | 404 |
| 他人マッチングIDを使って「相手グループへ参加」 | 401 | 403 | 403 | 403 | 404 |
| 他プロフィール作成グループの更新 | 401 | 403 | 403 | 403 | 404 |
| 自グループ設定変更 `PATCH /groups/:id/policy` | 401 | 403 | 403 | 403 | 失敗ケース対象外 |
| グループメンバー追加 `POST /groups/:id/members` | 401 | 403 | 403 | 403 | 失敗ケース対象外 |
| リーダー交代（後継指名なしで離脱） | 401 | 403 | 403 | 403 | 403 |
| 長期非活動時のメンバー提案なしで第三者がリーダー昇格 | 401 | 403 | 403 | 403 | 404 |
| 他人プロフィール参照（秘匿対象） | 401 | 404 | 404 | 404 | 404 |
| `active_profile_id = null` で保護操作 | 401/403 | 403 | 403 | 403 | 403 |
| `active_profile_id` 参照切れで保護操作 | 401/403 | 403 | 403 | 403 | 403 |
| Server Action 保護操作実行 | 401相当 | 403 | 403 | 403 | 403（秘匿対象は404） |

> 注記:
> - `失敗ケース対象外` は、同操作の成功ケースで別途管理（本表は失敗ケース専用）
> - 本版では `404` 秘匿対象を固定済み（Section 5 を参照）

### マトリクス運用ルール

- 各セルにつき最低1ケースを `F-xxx` として起票する
- API と Server Action の両経路がある操作は、同一Actorで両方起票する
- 5 Actor のいずれかが未記入の操作は、実装着手不可とする
- グループ関連操作は「実行プロフィールID」と「対象グループのオーナープロフィールID」の一致/不一致を必ず前提条件に書く
- マッチング関連操作は「matching 当事者プロフィールID（from/to）」への包含判定を必ず前提条件に書く
- **招待/参加申し込み操作は Watch or Follow 状態を前提条件に必ず記入**（Watch/Follow なしでは 403）
- グループメンバー化操作は、リーダーが申し込み者の Watch/Follow 状態を確認してから判断する想定
- 招待/参加の分岐は別操作として扱い、同じ `matching_id` でも別ケースで起票する
- 相性算出ロジックは認可判定ロジックと分離し、認可テストでは「成立済み/未成立」の事実のみ前提として扱う

---

## 3. 記述用テンプレート（1ケース単位）

### [Case ID] F-xxx: タイトル

- 誰が（Actor）:
- 何に（Resource）:
- 何を（Action）:
- 前提条件:
- 判定主体（API / Server Action / 両方）:
- 期待HTTP:
- 期待エラーコード/本文:
- 監査ログ期待値（誰が・何に・なぜ拒否）:

#### テスト実行情報

- 実行コマンド:
- 期待結果:
- 実結果:
- 判定: PASS / FAIL
- 備考:

---

## 3.1 A: 初期Fケース起票（20件）

| Case ID | Actor | Resource | Action | 前提条件（要約） | 期待HTTP | 期待コード（例） |
|---|---|---|---|---|---:|---|
| F-101 | 未認証 | `/api/profiles/public` | `GET` | セッションなし | 401 | `UNAUTHORIZED` |
| F-102 | 未認証 | `/api/relationships/watch` | `POST` | セッションなし | 401 | `UNAUTHORIZED` |
| F-103 | `ghost` | `/api/matchings/conditional` | `POST` | 条件未設定 | 422 | `PROFILE_CONDITIONS_REQUIRED` |
| F-104 | `ghost` | `/api/relationships/follow` | `POST` | 相手プロフィール指定 | 403 | `FORBIDDEN_GHOST_FOLLOW` |
| F-105 | `ghost` | `/api/groups/:id/invite` | `POST` | Watch/Followなし | 403 | `RELATION_REQUIRED` |
| F-106 | `ghost` | `/api/groups/:id/join-request` | `POST` | Watch/Followなし | 403 | `RELATION_REQUIRED` |
| F-107 | `persona+group_member` | `/api/groups/:id/policy` | `PATCH` | リーダー権限なし | 403 | `ROLE_INSUFFICIENT` |
| F-108 | `persona+group_member` | `/api/groups/:id/members` | `POST` | リーダー権限なし | 403 | `ROLE_INSUFFICIENT` |
| F-109 | `persona+no_group` | `/api/groups/:id/invite` | `POST` | 自グループ未保有 | 403 | `GROUP_LEADER_REQUIRED` |
| F-110 | `persona+group_leader` | `/api/matchings/:other/invite` | `POST` | 他人matching_id | 404 | `NOT_FOUND` |
| F-111 | `persona+group_leader` | `/api/matchings/:other/join` | `POST` | 他人matching_id | 404 | `NOT_FOUND` |
| F-112 | `persona+group_leader` | `/api/groups/:other/policy` | `PATCH` | 他プロフィール作成group | 404 | `NOT_FOUND` |
| F-113 | `persona+group_leader` | `/api/profiles/:other/private` | `GET` | 秘匿対象プロフィール | 404 | `NOT_FOUND` |
| F-114 | `persona+group_member` | `/api/groups/:id/leader/transfer` | `POST` | 第三者昇格要求 | 403 | `ROLE_INSUFFICIENT` |
| F-115 | `persona+group_leader` | `/api/groups/:id/leave` | `POST` | 後継未指名・未解散 | 403 | `LEADER_TRANSFER_REQUIRED` |
| F-116 | `persona+no_group` | `/api/admin/policies` | `GET` | admin権限なし | 403 | `FORBIDDEN` |
| F-117 | `persona+group_leader` | `/api/groups/:id/invite` | `POST` | matching未成立 | 403 | `MATCHING_REQUIRED` |
| F-118 | `persona+group_leader` | `/api/groups/:id/join-request/approve` | `POST` | Watch/Follow要件欠落 | 403 | `RELATION_REQUIRED` |
| F-119 | `persona+group_leader` | `/api/groups/:id/leader/proposal` | `POST` | 非メンバーによる提案 | 404 | `NOT_FOUND` |
| F-120 | `persona+group_member` | `/api/relations/follow` | `POST` | 非公開対象への直接Follow | 404 | `NOT_FOUND` |

---

## 4. 優先失敗ケースチェックリスト（MVP向け）

### A. 認証欠落

- [ ] A-01 未認証で保護API `GET` が 401
- [ ] A-02 未認証で保護API `POST/PATCH/DELETE` が 401
- [ ] A-03 未認証で Server Action 実行が拒否（401相当）

### B. 権限不足（縦方向）

- [ ] B-01 一般ユーザーが admin 操作で 403
- [ ] B-02 `group_member` が `group_leader` 専用操作で 403
- [ ] B-03 `ghost` が変更系操作で 403

### C. コンテキスト不一致（横方向 / IDOR）

- [ ] C-01 他組織ID指定で更新が 404（秘匿）
- [ ] C-02 他国ID指定で更新が 404（秘匿）
- [ ] C-03 他人profile指定（秘匿対象）で参照/更新が 404
- [ ] C-04 他人matching指定で招待/参加操作が 404
- [ ] C-05 matching未成立状態で招待/参加操作が 403

### C2. マッチング・Watch起点フロー（Ghost制限の理由）

- [ ] C2-01 `ghost` の条件なしmatching は成功ケースで別管理（失敗表に混在させない）
- [ ] C2-02 `ghost` の条件付きmatching は実装不可（条件未設定の理由で 422 固定）
- [ ] C2-03 `ghost` は Watch 実行ができる（相手に通知されない観察）── 成功ケースで別管理
- [ ] C2-04 `ghost` は Follow 実行できない（403）── 相手に通知される操作は persona のみ
- [ ] C2-04b マッチング非経由の Follow でも `ghost` は 403（persona のみ許可）
- [ ] C2-05 Watch/Follow なしで「相手を自グループへ招待」を試みると 403 拒否
- [ ] C2-06 Watch/Follow なしで「相手グループへ参加申し込み」を試みると 403 拒否
- [ ] C2-07 Watch/Follow 済み状態が「相手を自グループへ招待」の前提条件
- [ ] C2-08 Watch/Follow 済み状態が「相手グループへ参加申し込み」の前提条件
- [ ] C2-09 `persona + group_member` は「相手を自グループへ招待」を実行できない（403）
- [ ] C2-10 `persona + group_leader` でも当事者外matchingでは招待できない（404）
- [ ] C2-11 `persona + no_group` が「相手グループへ参加」で当事者外matchingを使うと拒否（404）
- [ ] C2-12 招待/参加の判定結果が API / Server Action で一致
- [ ] C2-13 相互 Follow → 相互フォロー状態 → Friend/Partner/Pre-partner へ進展可能

### C3. グループ継承・解散

- [ ] C3-01 リーダーは後継指名なしで離脱できない（403）
- [ ] C3-02 リーダーは解散後に離脱可能（成功ケースで別管理）
- [ ] C3-03 長期非活動時の新リーダー提案はメンバーのみ可能（第三者は404）

### D. 境界・異常系

- [ ] D-01 `active_profile_id = null` は deny-by-default
- [ ] D-02 `active_profile_id` 参照切れは deny-by-default
- [ ] D-03 同時更新競合時に fail-safe（許可に倒れない）

### E. 経路同値性

- [ ] E-01 同一入力で API と Server Action の判定結果が一致
- [ ] E-02 エラー形式（HTTP/コード/メッセージ）が一致

---

## 5. 401 / 403 / 404 / 422 方針テンプレート

- 401: 未認証（セッションなし・無効）
- 403: 認証済みだが権限不足
- 404: 存在秘匿ポリシーを採用する対象で、権限不足時に秘匿する場合
- 422: 業務バリデーション不成立（例: Ghost の条件付きmatchingで条件未設定）

> ハイブリッド方針（固定）:
> - Ghost 条件付きmatching: **422**
> - Ghost Follow / IDOR / ロール不足: **403**
> - 秘匿対象への非許可アクセス: **404（本版で固定）**

### 404秘匿対象（固定）

- 他人 `matching_id` への招待/参加操作
- 他プロフィールが作成した `group` の更新系操作
- 秘匿対象プロフィールの詳細参照
- 非メンバーによるリーダー提案・昇格操作

> 注意: 上記4カテゴリは API/Server Action の両方で 404 を返すこと

---

## 5.1 C: API / Server Action 同値性 先行3ケース

| Eq ID | シナリオ | API期待 | Server Action期待 | 判定 |
|---|---|---:|---:|---|
| EQ-01 | Ghost 条件付きmatching | 422 | 422 | 同値 |
| EQ-02 | Ghost Follow 実行 | 403 | 403 | 同値 |
| EQ-03 | 他人matching_idで招待 | 404 | 404 | 同値 |

### 実行メモ（最低限）

- EQ-01: `ghost` で条件付きmatching payload送信 → API/Action とも 422
- EQ-02: `ghost` で Follow 実行 → API/Action とも 403
- EQ-03: 当事者外 `matching_id` で招待実行 → API/Action とも 404

---

## 6. 監査ログ期待テンプレート

```json
{
  "event": "rbac.denied",
  "actorId": "<auth-user-id>",
  "activeProfileId": "<profile-id|null>",
  "resourceType": "group|nation|profile|admin",
  "resourceId": "<id>",
  "action": "read|create|update|delete|execute",
  "reason": "unauthenticated|role_insufficient|context_mismatch|ghost_restricted",
  "httpStatus": 401,
  "timestamp": "<ISO8601>"
}
```

---

## 7. 実装着手前ゲート

- [ ] Priority 2 の失敗ケースを最低10件定義済み
- [ ] 5 Actor（未認証 / `ghost` / `persona+no_group` / `persona+group_member` / `persona+group_leader`）のケースを最低1件ずつ定義済み
- [ ] 401/403/404/422 方針を文書化済み
- [ ] API/Server Action 同値性ケースを最低3件定義済み
- [ ] 実行コマンドと期待結果をケースごとに記入済み
