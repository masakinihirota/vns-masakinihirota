
## 📊 **テーブル構造全体マップ**

### 🏛️ **1. 認証・アカウント基盤層**

#### **`auth_users`テーブル** 🔐

#### **`root_accounts`テーブル** 🌟 **【コアテーブル】**
**役割**: アプリケーション固有のユーザー情報とビジネスロジック
```
Phase 1実装済み機能:
🔵 ポイント管理システム
   - total_points: 現在の所持ポイント
   - max_points: 所持上限（OAuth認証数で決定）
   - last_point_recovery_at: 24時間回復システム
   - activity_points: サイト内行動ポイント
   - click_points: いいね・拍手ポイント

🔵 信頼度評価システム
   - trust_score: 総合信頼度
   - consecutive_days: 連続問題なし日数
   - oauth_providers: 認証済みプロバイダー配列
   - oauth_count: 認証数（信頼度に影響）

🔵 アカウント状態管理
   - account_status: active/suspended/banned/pending
   - warning_count: 警告回数
   - is_verified: 認証済みフラグ
```

---

### 🌍 **2. 言語・国際化層**

#### **`languages`テーブル** 🗣️
**役割**: システムで利用可能な言語マスターデータ
```
機能:
✅ ISO言語コード管理
https://ja.wikipedia.org/wiki/ISO_639-1%E3%82%B3%E3%83%BC%E3%83%89%E4%B8%80%E8%A6%A7
ISO-3166 国コードと ISO-639 言語コード
https://docs.oracle.com/cd/F25597_01/document/products/wli/docs92/xref/xqisocodes.html

✅ 各言語の表示名・ネイティブ名
✅ 多言語対応の基盤
```

#### **`user_languages`テーブル** 🌐
**役割**: ユーザーの言語習得状況管理
```
機能:
✅ ユーザーが使用できる言語
✅ 各言語の習熟度（native/fluent/intermediate/basic/learning）
✅ マッチング時の言語適合性判定
```

---

### 🔗 **3. 認証プロバイダー管理層**

#### **`account_providers`テーブル** 🔑
**役割**: ユーザーのOAuth認証プロバイダー管理
```
機能:
✅ Google, GitHub, 匿名認証の管理
✅ プライマリプロバイダーの設定
✅ 信頼度スコア計算の基礎データ
✅ セキュリティ向上（複数認証）
```

---

### 💰 **4. ポイントシステム層**

#### **`points_transactions`テーブル** 💳
**役割**: ポイント変動の全履歴管理（監査ログ）
```
機能:
✅ 全ポイント取得・消費の記録
✅ システム調整、ボーナス、ペナルティの追跡
✅ 不正使用の検知・分析
✅ ユーザー行動パターン分析
```

**ポイント理由の種類**:
- `signup_bonus`: 登録ボーナス
- `profile_complete`: プロフィール完成
- `login_streak`: ログイン継続
- `system_adjust`: システム調整
- `penalty`: ペナルティ

---

### 🛡️ **5. セキュリティ・監査層**

#### **`auth_events`テーブル** 📝
**役割**: 認証関連イベントの監査ログ
```
機能:
✅ ログイン・ログアウトの記録
✅ 認証失敗の追跡
✅ 匿名→正規アカウント移行の記録
✅ セキュリティ異常の検知
```

**イベント種別**:
- `sign_in/sign_out`: ログイン・ログアウト
- `refresh`: セッション更新
- `anonymous_upgrade`: 匿名→正規移行
- `provider_link/unlink`: プロバイダー連携
- `failure`: 認証失敗

---

## 🔄 **テーブル間の関係性とデータフロー**

### **🎯 ユーザー登録・認証フロー**
```
1. auth_users (Supabase) で基本認証
   ↓
2. root_accounts に拡張情報を作成
   ↓
3. account_providers に認証プロバイダー記録
   ↓
4. auth_events にイベント記録
```

### **💡 ポイント管理フロー**
```
1. ユーザーアクション発生
   ↓
2. points_transactions にトランザクション記録
   ↓
3. root_accounts のポイント残高更新
   ↓
4. 信頼度・アクティビティポイント更新
```

### **🌐 言語設定フロー**
```
1. root_accounts で母語・サイト言語設定
   ↓
2. user_languages で習得言語登録
   ↓
3. マッチング時に言語適合性判定
```

---

## 📈 **Phase別実装状況**

### **✅ Phase 1 完了（MVP機能）**
- 基本認証システム
- ポイント管理システム（完全実装）
- 信頼度評価システム（完全実装）
- セキュリティ監査システム
- 多言語対応基盤

### **🔄 Phase 2 準備中（重要機能）**
設計書より以下が計画されています：
- プロフィール制限管理（`profile_creation_count`, `max_profiles`）
- アカウント種別管理（`account_type`）
- リセット機能（`reset_count`, `last_reset_at`）

### **📋 Phase 3 将来機能（拡張機能）**
- 課金システム（`subscription_tier`）
- UI設定（`theme_preference`, `menu_level`）
- 個人情報認証強化

---

## 💡 **各テーブルの実際の使用例**

### **🌟 `root_accounts` の実際の活用**
```sql
-- ユーザーの信頼度とポイント状況確認
SELECT
  trust_score,
  total_points,
  max_points,
  oauth_count,
  account_status
FROM root_accounts
WHERE id = 'user-uuid';
```

### **💳 `points_transactions` の活用**
```sql
-- 過去30日のポイント履歴
SELECT reason, delta, description, created_at
FROM points_transactions
WHERE root_account_id = 'user-uuid'
AND created_at >= NOW() - INTERVAL '30 days'
ORDER BY created_at DESC;
```

---

## 🎯 **まとめ：システムの全体像**

現在のVNS masakinihirotaシステムは、**6つの主要テーブル**で以下を実現しています：

1. **🔐 堅牢な認証基盤**（auth_users + account_providers）
2. **💰 完全なポイント管理**（root_accounts + points_transactions）
3. **🛡️ セキュリティ監査**（auth_events）
4. **🌍 国際化対応**（languages + user_languages）
5. **📊 信頼度評価**（root_accounts内の複数フィールド）

**Phase 1として設計書で要求された機能は完全に実装済み**で、MVPとして十分な機能を持つデータベース設計が完成しています。

各テーブルが明確な責務を持ち、相互に連携してVNSプラットフォームの核心機能を支えている構造となっています。

## 💡 **Tips とアドバイス**

### 🚀 **開発効率化**
- 現在の設計は拡張性に優れ、Phase 2・3機能の追加が容易
- 各テーブルの責務が明確で、機能追加時の影響範囲が限定的

### 📈 **運用での活用**
- `points_transactions`による完全な監査ログ
- `auth_events`によるセキュリティ監視
- 段階的な信頼度向上システム

この設計により、安全で拡張性の高いユーザー管理システムが実現できています！
