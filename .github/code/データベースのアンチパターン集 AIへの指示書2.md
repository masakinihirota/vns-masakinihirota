---
applyTo: "*.js,*.jsx,*.ts,*.tsx,*.css,*.scss,*.sass,*.json,*.env"
---

<!--
目的: 26章アンチパターンを AI による DB 設計/DDL/クエリレビュー/生成で機械的に検知・是正できる包括指示書
適用範囲: スキーマ設計 / マイグレーション / クエリ最適化 / セキュリティ / 運用ガバナンス
更新ルール: 章追加・改訂時は『総合横断チェックリスト』へ必ず反映し PR に差分概要を添付
-->

# データベース アンチパターン包括指示書 (AI 用)

## 0. ソースファイル一覧 (1–26)
[ch01_Introduction.txt](..\..\vns-masakinihirota-design\1000-参考資料資料\アンチパターン\ch01_Introduction.txt) /
[ch02_Jaywalking.txt](..\..\vns-masakinihirota-design\1000-参考資料資料\アンチパターン\ch02_Jaywalking.txt) /
[ch03_Trees.txt](..\..\vns-masakinihirota-design\1000-参考資料資料\アンチパターン\ch03_Trees.txt) /
[ch04_ID-Required.txt](..\..\vns-masakinihirota-design\1000-参考資料資料\アンチパターン\ch04_ID-Required.txt) /
[ch05_Keyless-Entry.txt](..\..\vns-masakinihirota-design\1000-参考資料資料\アンチパターン\ch05_Keyless-Entry.txt) /
[ch06_EAV.txt](..\..\vns-masakinihirota-design\1000-参考資料資料\アンチパターン\ch06_EAV.txt) /
[ch07_Polymorphic.txt](..\..\vns-masakinihirota-design\1000-参考資料資料\アンチパターン\ch07_Polymorphic.txt) /
[ch08_Multi-Column.txt](..\..\vns-masakinihirota-design\1000-参考資料資料\アンチパターン\ch08_Multi-Column.txt) /
[ch09_Metadata-Tribbles.txt](..\..\vns-masakinihirota-design\1000-参考資料資料\アンチパターン\ch09_Metadata-Tribbles.txt) /
[ch10_Rounding-Errors.txt](..\..\vns-masakinihirota-design\1000-参考資料資料\アンチパターン\ch10_Rounding-Errors.txt) /
[ch11_31-Flavors.txt](..\..\vns-masakinihirota-design\1000-参考資料資料\アンチパターン\ch11_31-Flavors.txt) /
[ch12_Phantom-Files.txt](..\..\vns-masakinihirota-design\1000-参考資料資料\アンチパターン\ch12_Phantom-Files.txt) /
[ch13_Index-Shotgun.txt](..\..\vns-masakinihirota-design\1000-参考資料資料\アンチパターン\ch13_Index-Shotgun.txt) /
[ch14_Fear-Unknown.txt](..\..\vns-masakinihirota-design\1000-参考資料資料\アンチパターン\ch14_Fear-Unknown.txt) /
[ch15_Groups.txt](..\..\vns-masakinihirota-design\1000-参考資料資料\アンチパターン\ch15_Groups.txt) /
[ch16_Random.txt](..\..\vns-masakinihirota-design\1000-参考資料資料\アンチパターン\ch16_Random.txt) /
[ch17_Search.txt](..\..\vns-masakinihirota-design\1000-参考資料資料\アンチパターン\ch17_Search.txt) /
[ch18_Spaghetti-Query.txt](..\..\vns-masakinihirota-design\1000-参考資料資料\アンチパターン\ch18_Spaghetti-Query.txt) /
[ch19_Implicit-Columns.txt](..\..\vns-masakinihirota-design\1000-参考資料資料\アンチパターン\ch19_Implicit-Columns.txt) /
[ch20_Passwords.txt](..\..\vns-masakinihirota-design\1000-参考資料資料\アンチパターン\ch20_Passwords.txt) /
[ch21_SQL-Injection.txt](..\..\vns-masakinihirota-design\1000-参考資料資料\アンチパターン\ch21_SQL-Injection.txt) /
[ch22_Neat-Freak.txt](..\..\vns-masakinihirota-design\1000-参考資料資料\アンチパターン\ch22_Neat-Freak.txt) /
[ch23_See-No-Evil.txt](..\..\vns-masakinihirota-design\1000-参考資料資料\アンチパターン\ch23_See-No-Evil.txt) /
[ch24_Diplomatic_immunity.txt](..\..\vns-masakinihirota-design\1000-参考資料資料\アンチパターン\ch24_Diplomatic_immunity.txt) /
[ch25_Procedures.txt](..\..\vns-masakinihirota-design\1000-参考資料資料\アンチパターン\ch25_Procedures.txt) /
[ch26_Foreign_key_standard.txt](..\..\vns-masakinihirota-design\1000-参考資料資料\アンチパターン\ch26_Foreign_key_standard.txt)

---

## 1. AI 適用フロー (擬似アルゴリズム)
1. 入力差分分類: {スキーマ/DDL, クエリ, データ操作, セキュリティ, 運用} にタグ付け
2. 26章マッピング: 関連章のみ抽出 (章 -> チェックリスト)
3. 各章チェック: 禁止→違反抽出 / 例外 → 例外記録検証 / 推奨→未充足なら提案
4. 修正案生成: 最小差分 (DDL/SQL/スクリプト) + 根拠(章番号+短評)
5. 集約アウトプット: PASS/FAIL 表 + 必須是正一覧 + 任意改善一覧
6. 監査ログ出力 (機械可読 JSON テンプレ) ※将来拡張

例外許容条件: (a) 明示ドキュメント化 (b) 期限付 (c) 代替統制策 (d) 承認者 記録

---

## 2. 章別テンプレフォーマット
各章: 「目的 / アンチパターン概要 / 兆候(検知ヒント) / 禁止事項 / 推奨解決策 / 許容例外 / Checklist」

---

### 01 Introduction (総論)
目的: 以降章の形式統一とレビュー品質基盤
概要: DB設計での典型的誤りを体系的に抑止
兆候: 仕様→実装過程で暗黙判断 / 根拠欠如レビュー
禁止: 章未参照での即時DDL生成
推奨: 各変更 PR に関連章列挙
例外: 緊急障害対応 (後追いレビュー必須)
Checklist:
- [ ] PR 説明に関連章明示
- [ ] 例外時 24h 以内レビュー記録

### 02 Jaywalking (CSV/多値列)
目的: 正規化維持 / インデックス活用
概要: カンマ区切り等で複数値を1列詰込
兆候: LIKE '%,', FIND_IN_SET, REGEXP 区切り抽出
禁止: 汎用タグ列, デリミタ格納
推奨: 交差(bridge)テーブル PK=(主体ID, 値ID)
例外: 読取専用キャッシュ列 (元正規構造保持)
Checklist: 多値列0 / 交差テーブル存在 / クエリで分割関数不使用

### 03 Trees (Naive Tree)
目的: 階層クエリ効率
概要: 深い/全系統取得で隣接リストのみ依存
兆候: 再帰せず固定 JOIN 連鎖 / ループN+1
禁止: 任意深度探索をアプリ反復
推奨: 再帰CTE / 閉包テーブル / マテビュー
例外: 深さ <=2 固定の限定要件
Checklist: 再帰手段文書 / 閉包 or 代替実装 / N+1 無

### 04 ID Required (無目的汎用 id)
目的: キー意味明確化 / 重複防止
概要: すべて id( surrogate ) のみで一意性ロジック欠如
兆候: UNIQUE 欠如 / 重複語彙列
禁止: 複合自然キー候補無視
推奨: 自然/複合キー検討→不可時 surrogate
例外: 外部連携で surrogate 必須
Checklist: PK 命名規約 / 必要 UNIQUE 制約 / 重複行テスト

### 05 Keyless Entry (外部キー未定義)
目的: 参照整合性自動担保
概要: FK をアプリ層で擬似実装
兆候: 孤立行 / 論理削除整合欠如
禁止: 意図無き FK 省略
推奨: すべての必須参照に FK + onDelete 方針
例外: 超高頻度書込監査ログ (後続整合チェック)
Checklist: 全関係FK / onDelete設計 / 孤立行 0

### 06 EAV (Entity-Attribute-Value)
目的: 型安全・整合性維持
概要: (entity, attr, value) 汎用属性テーブル濫用
兆候: attr_name 汎用文字列 / value 文字列単一型
禁止: 集計/検索対象属性のEAV化
推奨: 列追加 / サブタイプ分割 / JSONB(限定属性)
例外: 無制限動的属性 + 集計不要
Checklist: コア属性列化 / EAV 高頻度照会無 / 型制約確保

### 07 Polymorphic Association
目的: 参照整合 & 最適化
概要: (parent_type, parent_id) 二重用途キー
兆候: CASE で親テーブル切替
禁止: polymorphic 外部キー
推奨: 共通親テーブル or 個別交差テーブル
例外: ログで親型差異が非整合でも許容
Checklist: polymorphic列0 / FK解決可

### 08 Multi-Column Attribute
目的: 可変長多値の正規化
概要: tag1, tag2...列
兆候: 連番列命名 / OR 列比較
禁止: スキーマ改変前提列追加
推奨: 子テーブル1行1値
例外: 列数上限=仕様厳密 / 変更見込み無
Checklist: 連番列無 / 多値=別テーブル

### 09 Metadata Tribbles (年次増殖)
目的: メタデータ膨張抑制
概要: 年/カテゴリ別でテーブル/列コピー
兆候: *_2024 / table_2023
禁止: データ値→スキーマ拡張
推奨: パーティション / 単一テーブル + date列
例外: 法令上 年毎 別DB義務
Checklist: 年次テーブル0 / パーティション方針文書

### 10 Rounding Errors (浮動小数誤差)
目的: 金額/精度保証
概要: FLOAT/DOUBLE 金額格納
兆候: DECIMAL 不在 金額列
禁止: 浮動型での金融計算
推奨: DECIMAL(p,s) / 計算後丸め統一
例外: 統計近似で誤差許容
Checklist: 金額DECIMAL / 差分テスト / 中間誤差検証

### 11 31 Flavors (ENUM/CHECK 硬直)
目的: 値集合の進化容易化
概要: 直接 ENUM/CHECK 固定
兆候: ALTER TABLE 頻繁
禁止: 頻繁変動候補 ENUM 固定
推奨: 参照テーブル + FK + 廃止フラグ
例外: 変更頻度 ≦ 年1 / 公的標準コード
Checklist: 変動値=参照テーブル / ENUM使用理由明示

### 12 Phantom Files (外部ファイル孤立)
目的: 一貫バックアップ/完全性
概要: ファイルシステムのみ格納で参照切れ
兆候: file_path VARCHAR のみ / 孤立率不明
禁止: 整合性検査なしの外部保存
推奨: DB内BLOB or 外部+整合ジョブ
例外: CDN 署名URL (再生成可能 + メタDB起点)
Checklist: 孤立検査ジョブ / バックアップ手順 / BLOB vs 外部基準文書

### 13 Index Shotgun
目的: 最小コスト最大効果
概要: 闇雲インデックス/不足双方
兆候: ユースケース不明 index / 使われない idx >30%
禁止: 盲目的複合全列索引
推奨: MENTOR(Measure/Explain/Nominate/Test/Optimize/Review)
例外: 実験的 AB テスト期間限定
Checklist: 利用率測定 / 冗長idx削除計画 / 重要クエリ EXPLAIN 共有

### 14 Fear of the Unknown (NULL 回避/乱用)
目的: 欠損意味一貫性
概要: NULL の代替にマジック値
兆候: '0000-00-00', -1, '' の乱用
禁止: 欠損=特殊値置換
推奨: 正しく NULL + COALESCE / IS DISTINCT FROM
例外: レガシ API 互換層 (変換レイヤ明示)
Checklist: マジック値0 / NULL 意図説明

### 15 Groups (Ambiguous GROUP BY)
目的: 集約正確性
概要: 非機能従属列を同時選択
兆候: ONLY_FULL_GROUP_BY 無効依存
禁止: 未集約,未GROUP列 SELECT
推奨: ウィンドウ関数 / サブクエリ / NOT EXISTS
例外: 分析一時スクリプト (再現性記録)
Checklist: 集約クエリ検証 / 最新行取得=ROW_NUMBER

### 16 Random Selection
目的: スケール性能
概要: ORDER BY RAND() 全表ソート
兆候: RAND()/RANDOM() + LIMIT
禁止: 大表 RAND 抽出
推奨: 主キー範囲法 / 抽出済キャッシュ / TABLESAMPLE
例外: 行数 << 1000 の小表
Checklist: RAND使用理由記録 / 代替法適用

### 17 Search (Poor Man's FTS)
目的: 精度/性能
概要: LIKE '%term%' 多用
兆候: 前方ワイルドカード頻出
禁止: 大量データ FTS 不使用生 LIKE
推奨: DB FTS / 外部エンジン / 転置索引
例外: 低頻度 小規模 (≦数千行)
Checklist: FTS 適用判定 / LIKE 前方% 限定使用

### 18 Spaghetti Query
目的: 可読性/最適化容易性
概要: 巨大一枚岩 SQL
兆候: 20+ JOIN / ネスト深 >5
禁止: 保守不能長大クエリ
推奨: 段階分解 / CTE / マテビュー
例外: 単発移行バッチ (記録済)
Checklist: クエリ長閾値超警告 / 分割案提示

### 19 Implicit Columns (SELECT * / 暗黙依存)
目的: 変更耐性
概要: SELECT * / INSERT 列省略
兆候: コード差分で列順依存壊れ
禁止: 本番経路 SELECT *
推奨: 必要列限定 / 別名明示
例外: ad-hoc デバッグ (コミット不可)
Checklist: SELECT * 0 / INSERT 列明示

### 20 Passwords (Readable Passwords)
目的: 資格情報秘匿
概要: 平文/可逆保存
兆候: password 列=VARCHAR(64) 平文
禁止: 可逆暗号のみ / ソルト無ハッシュ
推奨: Argon2/ bcrypt / PBKDF2 + per-user salt + 迭代
例外: 無し
Checklist: ハッシュ方式 / ソルト列 / リセットトークン期限

### 21 SQL Injection
目的: 任意SQL実行防止
概要: 文字列連結動的SQL
兆候: "'" + userInput 連結
禁止: プレースホルダ非使用値挿入
推奨: Prepared / 識別子ホワイトリスト / 最小権限
例外: 無し
Checklist: 連結SQL0 / バインド100% / ログマスキング

### 22 Neat Freak (疑似キー潔癖)
目的: 監査整合 / 追跡性
概要: 欠番再利用要求
兆候: RESEED / ID再割当議論
禁止: 再採番 / グループ別連番生成
推奨: 表示用は ROW_NUMBER()
例外: 法令で連続性必須(別監査テーブル)
Checklist: 再採番処理無 / 表示番号=派生

### 23 See No Evil (エラー無視)
目的: 障害早期検知
概要: 例外握り潰し / 戻り値未確認
兆候: try { } catch {} 空
禁止: DB失敗黙殺
推奨: ログ + 再試行ポリシ / 死活監視
例外: 起動時一過性リトライ内部
Checklist: 例外ハンドラ検証 / ログ粒度設定

### 24 Diplomatic Immunity (特別扱い)
目的: 変更統制 / 再現性
概要: スキーマ変更が版管理外
兆候: 手作業 ALTER 本番のみ
禁止: VCS 外 DDL / 手作業本番直適用
推奨: マイグレーションツール / CI 差分検証
例外: 緊急ホットフィックス(直後マイグ追加)
Checklist: 全DDL=マイグ / 差分CI PASS

### 25 Procedures (過度な SP 依存)
目的: ポータビリティ / スケール
概要: 業務ロジック大半を SP
兆候: SP LOC 比率過大 / テスト不足
禁止: 表示/ドメインロジック SP 集中
推奨: アプリ層実装 / SP は性能/権限境界
例外: ネットワーク往復削減バッチ
Checklist: SP 採用理由記録 / テスト有

### 26 Foreign Key Standard (外部キー誤用)
目的: 正しい参照制約
概要: 型/順序/照合不一致, 親未 UNIQUE
兆候: 追加時エラー抑止 / 暗黙列順依存
禁止: 親 UNIQUE 無列参照 / 型不一致 / 無名重複制約
推奨: fk_{child}_{parent}_{cols} 命名 / 追加前孤立行検査
例外: 超高頻度挿入ログ (非FK + バッチ検査)
Checklist: 型照合一致 / 命名規約 / 非FK理由文書

---

## 3. 横断チェックリスト (集約)
|分類|条件|Pass基準|
|---|---|---|
|多値|CSV/連番多値列なし|02/08 OK|
|階層|深度取得方式記載|03 OK|
|主キー|自然/代理キー選定根拠|04/22 OK|
|参照整合|全FK or 例外文書|05/26 OK|
|可変属性|EAV最小化|06 OK|
|ポリモーフィック|parent_type/id 不使用|07 OK|
|年次増殖|年度別テーブル列無し|09 OK|
|精度|金額 DECIMAL|10 OK|
|値集合|参照テーブル + FK|11 OK|
|ファイル|孤立検査運用|12 OK|
|インデックス|MENTORログ|13 OK|
|NULL|マジック値排除|14 OK|
|集約|曖昧 GROUP BY 無|15 OK|
|ランダム|ORDER BY RAND 無|16 OK|
|検索|FTS/外部検討|17 OK|
|クエリ構造|分割/CTE適用|18 OK|
|暗黙列|SELECT * 無|19 OK|
|PW|不可逆+ソルト|20 OK|
|注入|バインド100%|21 OK|
|エラー|例外処理/ログ|23 OK|
|ガバナンス|DDL版管理|24 OK|
|SP|限定使用理由|25 OK|
|FK|型/照合/順序一致|26 OK|

---

## 4. 例外申請テンプレ (必須項目)
```
例外ID: EX-YYYYMMDD-N
対象: <テーブル/列/クエリ>
関連章: <番号 名称>
理由: <業務/性能/法令根拠>
代替統制: <監査/検査方法>
期限: <YYYY-MM-DD>
承認: <Role/Name>
撤回条件: <数値指標>
```

---

## 5. 生成時 強制ルール (AI MUST)
- INSERT は列明示 (章19)
- 金額/精度 DECIMAL (10) (章10)
- 多値要求→交差テーブル提案 (章02/08)
- ランダム行→RAND禁止 代替提示 (章16)
- 全文検索要望→FTS/外部比較提示 (章17)
- パスワード→Argon2/bcrypt/PBKDF2 + ソルト説明 (章20)
- 動的SQL → プレースホルダ & 識別子白リスト (章21)
- 集約 + 非GROUP列検出→修正案 (章15)
- SELECT * 検出→列限定版出力 (章19)
- EAV的提案検出→代替 (章06)
- SP要請→採否比較 (章25)
- FK 追加時 孤立行検査 SQL 併記 (章26)

---

## 6. 出力フォーマット指針
違反検知時:
```
Violation(<章番号> <短名>): <要約>
Context: <対象DDL/SQL抜粋>
Fix: <最小差分要約>
Rationale: <1行根拠>
```
全項目PASS時:
```
All checks passed (Ch:02,03,05,...). No violations.
Optional improvements: <列挙 or none>
```

---

## 7. メンテナンス
- 章内容更新時: 当ファイル該当章 + 横断表 + 強制ルール差分を同一 PR
- CI 追加候補: SELECT * / RAND / LIKE 前方% / 未使用インデックス検知
- 将来拡張: 監査 JSON スキーマ / 自動例外期限アラート

---

AI は本指示書に従い DB 関連生成/レビューを行い、逸脱時は理由 + 是正案を必ず提示すること。
