---
description: ポイントシステムの整合性担保、二重計上防止、トランザクション管理の技術的実装ガイド
triggers:
  - point
  - transaction
  - payment
  - ledger
---

# Point System Integrity Skill

## 概要

ポイントシステムは「通貨」と同様の厳密な管理が求められます。このスキルでは、**整合性 (Consistency)**、**可用性 (Availability)**、**監査可能性 (Auditability)** を担保するための、Supabase/PostgreSQLを用いた設計・実装パターンを提供します。

## 適用タイミング

- ポイント付与・消費・交換機能の実装時
- 課金システムの設計時
- ユーザー間の資産移動機能の実装時
- マーケットプレイスの決済機能実装時

## 1. データベース設計：複式簿記的アプローチ

単一の `points` カラムの増減だけでは、監査やトラブルシューティングが困難です。「台帳 (Ledger)」と「残高 (Balance)」を分離する設計を推奨します。

### スキーマ定義

```sql
-- 1. ポイント種別マスタ
CREATE TABLE point_types (
  id VARCHAR(50) PRIMARY KEY, -- 'paid', 'free', 'campaign_a' 等
  name VARCHAR(100) NOT NULL,
  priority INTEGER DEFAULT 0 -- 消費優先度
);

-- 2. ポイント取引台帳（不変の履歴）
-- INSERT専用。UPDATE/DELETE は原則禁止（補正はマイナスのINSERTで行う）
CREATE TABLE point_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id),
  point_type_id VARCHAR(50) NOT NULL REFERENCES point_types(id),
  amount INTEGER NOT NULL CHECK (amount != 0), -- 正:獲得, 負:消費
  transaction_type VARCHAR(50) NOT NULL, -- 'purchase', 'bonus', 'consume', 'expire', 'refund'
  reference_id VARCHAR(255), -- 外部決済ID、注文ID、アイテムIDなど
  reference_type VARCHAR(50), -- 'stripe', 'market_item', 'system'
  idempotency_key UUID UNIQUE, -- 冪等性担保用キー
  metadata JSONB DEFAULT '{}', -- 詳細情報
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_point_transactions_user ON point_transactions(user_id);
CREATE INDEX idx_point_transactions_type ON point_transactions(transaction_type);
CREATE INDEX idx_point_transactions_ref ON point_transactions(reference_id, reference_type);

-- 3. ポイント残高（現在高キャッシュ）
-- point_transactions の集計結果と常に一致させる
CREATE TABLE point_balances (
  user_id UUID NOT NULL REFERENCES user_profiles(id),
  point_type_id VARCHAR(50) NOT NULL REFERENCES point_types(id),
  balance INTEGER NOT NULL DEFAULT 0 CHECK (balance >= 0), -- マイナス不可
  last_updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, point_type_id)
);

-- 4. 有効期限管理（獲得ごとの残高）
CREATE TABLE point_expiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES point_transactions(id),
  user_id UUID NOT NULL REFERENCES user_profiles(id),
  initial_amount INTEGER NOT NULL CHECK (initial_amount > 0),
  remaining_amount INTEGER NOT NULL CHECK (remaining_amount >= 0),
  expires_at TIMESTAMPTZ NOT NULL,
  is_expired BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_point_expiries_user_date ON point_expiries(user_id, expires_at);
```

> [!IMPORTANT]
> `database-best-practices.md` に従い、全てのテーブルに対して **RLS (Row Level Security)** を有効化してください。
> ユーザーは自身の残高・履歴のみ参照可能とし、更新・削除は許可しない（システム関数経由のみ）ポリシーが推奨されます。

## 2. トランザクションとアトミック操作

ポイントの操作は、必ずデータベーストランザクション内で実行し、整合性を保つ必要があります。
Supabase (PostgreSQL) では `plpgsql` 関数 (RPC) を使用するのが最も安全です。

### ポイント付与 (Grant) RPC

```sql
CREATE OR REPLACE FUNCTION grant_points(
  p_user_id UUID,
  p_point_type_id VARCHAR,
  p_amount INTEGER,
  p_transaction_type VARCHAR,
  p_reference_id VARCHAR DEFAULT NULL,
  p_reference_type VARCHAR DEFAULT NULL,
  p_idempotency_key UUID DEFAULT NULL,
  p_expires_at TIMESTAMPTZ DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- システム権限で実行
AS $$
DECLARE
  v_transaction_id UUID;
  v_new_balance INTEGER;
BEGIN
  -- 1. 冪等性チェック
  IF p_idempotency_key IS NOT NULL AND EXISTS (SELECT 1 FROM point_transactions WHERE idempotency_key = p_idempotency_key) THEN
    RETURN jsonb_build_object('status', 'idempotent_skip');
  END IF;

  -- 2. 台帳への記録
  INSERT INTO point_transactions (
    user_id, point_type_id, amount, transaction_type, reference_id, reference_type, idempotency_key, metadata
  ) VALUES (
    p_user_id, p_point_type_id, p_amount, p_transaction_type, p_reference_id, p_reference_type, p_idempotency_key, p_metadata
  ) RETURNING id INTO v_transaction_id;

  -- 3. 残高の更新 (UPSERT)
  INSERT INTO point_balances (user_id, point_type_id, balance)
  VALUES (p_user_id, p_point_type_id, p_amount)
  ON CONFLICT (user_id, point_type_id)
  DO UPDATE SET
    balance = point_balances.balance + p_amount,
    last_updated_at = NOW()
  RETURNING balance INTO v_new_balance;

  -- 4. 有効期限テーブルへの追加
  IF p_expires_at IS NOT NULL THEN
    INSERT INTO point_expiries (transaction_id, user_id, initial_amount, remaining_amount, expires_at)
    VALUES (v_transaction_id, p_user_id, p_amount, p_amount, p_expires_at);
  END IF;

  RETURN jsonb_build_object(
    'status', 'success',
    'transaction_id', v_transaction_id,
    'new_balance', v_new_balance
  );
END;
$$;
```

### ポイント消費 (Consume) RPC

消費ロジックは「有効期限が近いものから消費する (FIFO)」が一般的です。

```sql
CREATE OR REPLACE FUNCTION consume_points(
  p_user_id UUID,
  p_point_type_id VARCHAR,
  p_amount INTEGER,
  p_transaction_type VARCHAR,
  p_reference_id VARCHAR DEFAULT NULL,
  p_reference_type VARCHAR DEFAULT NULL,
  p_idempotency_key UUID DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_balance INTEGER;
  v_remaining_needed INTEGER := p_amount;
  v_expiry_record RECORD;
BEGIN
  -- 1. 残高チェック（FOR UPDATEで行ロック）
  SELECT balance INTO v_current_balance
  FROM point_balances
  WHERE user_id = p_user_id AND point_type_id = p_point_type_id
  FOR UPDATE;

  IF v_current_balance IS NULL OR v_current_balance < p_amount THEN
    RAISE EXCEPTION 'Insufficient balance';
  END IF;

  -- 2. 台帳への記録（マイナス値）
  INSERT INTO point_transactions (
    user_id, point_type_id, amount, transaction_type, reference_id, reference_type, idempotency_key, metadata
  ) VALUES (
    p_user_id, p_point_type_id, -p_amount, p_transaction_type, p_reference_id, p_reference_type, p_idempotency_key, p_metadata
  );

  -- 3. 残高更新
  UPDATE point_balances
  SET balance = balance - p_amount, last_updated_at = NOW()
  WHERE user_id = p_user_id AND point_type_id = p_point_type_id;

  -- 4. 消し込み（期限が近いものから減算）
  FOR v_expiry_record IN
    SELECT * FROM point_expiries
    WHERE user_id = p_user_id AND remaining_amount > 0 AND NOT is_expired
    ORDER BY expires_at ASC
    FOR UPDATE
  LOOP
    IF v_remaining_needed <= 0 THEN EXIT; END IF;

    IF v_expiry_record.remaining_amount >= v_remaining_needed THEN
      UPDATE point_expiries SET remaining_amount = remaining_amount - v_remaining_needed WHERE id = v_expiry_record.id;
      v_remaining_needed := 0;
    ELSE
      UPDATE point_expiries SET remaining_amount = 0 WHERE id = v_expiry_record.id;
      v_remaining_needed := v_remaining_needed - v_expiry_record.remaining_amount;
    END IF;
  END LOOP;

  RETURN jsonb_build_object('status', 'success', 'new_balance', v_current_balance - p_amount);
END;
$$;
```

## 3. 応用：マーケット取引（アイテム購入）

マーケットでのアイテム購入は「購入者からの減算」と「販売者への加算」をアトミックに行う必要があります。

```sql
CREATE OR REPLACE FUNCTION purchase_market_item(
  p_buyer_id UUID,
  p_item_id UUID,
  p_point_type_id VARCHAR,
  p_idempotency_key UUID
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_item RECORD;
  v_price INTEGER;
  v_seller_id UUID;
BEGIN
  -- 1. アイテムのロックと確認
  SELECT * INTO v_item FROM market_items WHERE id = p_item_id FOR UPDATE;

  IF v_item IS NULL OR v_item.status != 'open' THEN
    RAISE EXCEPTION 'Item not available';
  END IF;

  v_price := v_item.price;
  v_seller_id := v_item.seller_id;

  IF v_seller_id = p_buyer_id THEN
    RAISE EXCEPTION 'Cannot buy own item';
  END IF;

  -- 2. ポイント消費（購入者）- 内部で残高チェック
  PERFORM consume_points(
    p_buyer_id, p_point_type_id, v_price, 'purchase', p_item_id::text, 'market_item', p_idempotency_key
  );

  -- 3. ポイント付与（販売者）
  -- 注意: 販売者への付与には別の冪等キーが必要だが、ここではトランザクション内なので省略可または生成
  PERFORM grant_points(
    v_seller_id, p_point_type_id, v_price, 'sale', p_item_id::text, 'market_item', NULL, NULL
  );

  -- 4. アイテム状態更新
  UPDATE market_items
  SET status = 'sold', buyer_id = p_buyer_id, sold_at = NOW()
  WHERE id = p_item_id;

  RETURN jsonb_build_object('status', 'success', 'item_id', p_item_id);
END;
$$;
```

## 4. クライアントサイドの実装 (TypeScript)

Supabase SDKを使用してRPCを呼び出します。

```typescript
import { v4 as uuidv4 } from 'uuid';

/**
 * 冪等性を担保したポイント購入処理
 */
export async function purchaseItem(itemId: string, price: number) {
  const idempotencyKey = uuidv4(); // リクエストごとのユニークキー

  const { data, error } = await supabase.rpc('purchase_market_item', {
    p_buyer_id: (await supabase.auth.getUser()).data.user?.id,
    p_item_id: itemId,
    p_point_type_id: 'paid', // 例: 有償ポイント
    p_idempotency_key: idempotencyKey
  });

  if (error) {
    console.error('Purchase failed:', error);
    // エラーハンドリング (トースト通知など)
    throw error;
  }

  return data;
}
```

## 5. 監査とモニタリング

不正検知のため、異常な増減を監視します。

- **高頻度操作検知**: 短時間の大量獲得を検知するクエリを定期実行。
- **整合性検証**:
  ```sql
  -- 残高と台帳の不整合をチェック
  SELECT user_id, balance,
    (SELECT COALESCE(SUM(amount), 0) FROM point_transactions WHERE user_id = pb.user_id AND point_type_id = pb.point_type_id) as calc_balance
  FROM point_balances pb
  WHERE balance != (SELECT COALESCE(SUM(amount), 0) FROM point_transactions WHERE user_id = pb.user_id AND point_type_id = pb.point_type_id);
  ```

## チェックリスト

- [ ] `point_transactions` (台帳) と `point_balances` (残高) を分離したか
- [ ] ポイント操作は全て RPC (Transaction) 経由で行っているか
- [ ] `FOR UPDATE` による行ロックを行っているか（特に消費時）
- [ ] クライアントから `idempotency_key` を送信しているか
- [ ] 全てのテーブルに適切に RLS を設定したか
