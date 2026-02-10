-- Fix Security Issues in Functions

-- 1. Secure create_nation
CREATE OR REPLACE FUNCTION public.create_nation(
    p_name TEXT,
    p_description TEXT,
    p_owner_id UUID
) RETURNS UUID AS $$
DECLARE
    v_owner_root_id UUID;
    v_owner_points INTEGER;
    v_foundation_fee INTEGER := 1000;
    v_nation_id UUID;
BEGIN
    -- Security Check: Prevent impersonation
    IF p_owner_id != auth.uid() THEN
        RAISE EXCEPTION 'Unauthorized: You can only create a nation for yourself.';
    END IF;

    -- 所有者のポイント確認
    SELECT r.id, r.points INTO v_owner_root_id, v_owner_points
    FROM public.root_accounts r
    JOIN public.user_profiles u ON u.root_account_id = r.id
    WHERE u.id = p_owner_id
    FOR UPDATE;

    IF v_owner_points < v_foundation_fee THEN
        RAISE EXCEPTION 'Insufficient points for foundation fee';
    END IF;

    -- ポイント減算
    UPDATE public.root_accounts SET points = points - v_foundation_fee WHERE id = v_owner_root_id;

    -- 国レコード作成
    INSERT INTO public.nations (
        name, description, owner_user_id, foundation_fee
    ) VALUES (
        p_name, p_description, p_owner_id, v_foundation_fee
    ) RETURNING id INTO v_nation_id;

    -- 所有者を市民(official)として追加
    INSERT INTO public.nation_citizens (
        nation_id, user_profile_id, role
    ) VALUES (
        v_nation_id, p_owner_id, 'official'
    );

    RETURN v_nation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Secure start_transaction
CREATE OR REPLACE FUNCTION public.start_transaction(
    p_item_id UUID,
    p_counter_party_id UUID -- 取引を開始するユーザー（購入者 or 受注者）
) RETURNS UUID AS $$
DECLARE
    v_item public.market_items%ROWTYPE;
    v_payer_root_id UUID;
    v_payer_points INTEGER;
    v_transaction_id UUID;
    v_fee_amount INTEGER;
    v_seller_revenue INTEGER;
    v_payer_user_id UUID;
    v_receiver_user_id UUID;
BEGIN
    -- Security Check: Prevent impersonation
    IF p_counter_party_id != auth.uid() THEN
        RAISE EXCEPTION 'Unauthorized: Transaction initiator must be the authenticated user.';
    END IF;

    -- アイテム情報の取得とロック
    SELECT * INTO v_item FROM public.market_items WHERE id = p_item_id FOR UPDATE;

    IF v_item.status != 'open' THEN
        RAISE EXCEPTION 'Item not available';
    END IF;

    -- 支払者と受取者の決定
    IF v_item.type = 'sell' THEN
        -- 通常販売: カウンターパーティ（購入者）が支払う
        v_payer_user_id := p_counter_party_id;
        v_receiver_user_id := v_item.seller_id;
    ELSIF v_item.type = 'buy_request' THEN
        -- 買取リクエスト: アイテム作成者（依頼者）が支払う
        v_payer_user_id := v_item.seller_id;
        v_receiver_user_id := p_counter_party_id;
    ELSE
        RAISE EXCEPTION 'Invalid item type';
    END IF;

    -- 支払者のルートアカウントIDとポイント取得
    SELECT r.id, r.points INTO v_payer_root_id, v_payer_points
    FROM public.root_accounts r
    JOIN public.user_profiles u ON u.root_account_id = r.id
    WHERE u.id = v_payer_user_id
    FOR UPDATE;

    IF v_payer_points < v_item.price THEN
        RAISE EXCEPTION 'Insufficient points';
    END IF;

    -- 手数料計算 (例: 10%)
    v_fee_amount := floor(v_item.price * 0.1);
    v_seller_revenue := v_item.price - v_fee_amount;

    -- ポイント減算（システム預かり）
    UPDATE public.root_accounts SET points = points - v_item.price WHERE id = v_payer_root_id;

    -- アイテムステータス更新
    UPDATE public.market_items SET status = 'sold' WHERE id = p_item_id;

    -- トランザクションレコード作成
    INSERT INTO public.market_transactions (
        item_id, buyer_id, seller_id, price, fee_rate, fee_amount, seller_revenue, status
    ) VALUES (
        p_item_id, v_payer_user_id, v_receiver_user_id, v_item.price, 10.0, v_fee_amount, v_seller_revenue, 'pending'
    ) RETURNING id INTO v_transaction_id;

    RETURN v_transaction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 3. Atomic Group Creation
CREATE OR REPLACE FUNCTION public.create_group_with_leader(
    p_name TEXT,
    p_leader_id UUID,
    p_description TEXT DEFAULT NULL,
    p_avatar_url TEXT DEFAULT NULL,
    p_cover_url TEXT DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
    v_group_id UUID;
    v_result JSONB;
BEGIN
    -- Security Check
    IF p_leader_id != auth.uid() THEN
        RAISE EXCEPTION 'Unauthorized: You can only create a group for yourself.';
    END IF;

    -- Create Group
    INSERT INTO public.groups (
        name, description, leader_id, avatar_url, cover_url
    ) VALUES (
        p_name, p_description, p_leader_id, p_avatar_url, p_cover_url
    ) RETURNING id INTO v_group_id;

    -- Add Leader as Member
    INSERT INTO public.group_members (
        group_id, user_profile_id, role
    ) VALUES (
        v_group_id, p_leader_id, 'leader'
    );

    -- Return the created group object
    SELECT jsonb_build_object(
        'id', id,
        'name', name,
        'description', description,
        'leader_id', leader_id,
        'created_at', created_at,
        'updated_at', updated_at
    ) INTO v_result
    FROM public.groups
    WHERE id = v_group_id;

    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 4. Data Integrity Constraint for Nation Posts
ALTER TABLE public.nation_posts
ADD CONSTRAINT check_author_exclusive CHECK (
    (author_id IS NOT NULL AND author_group_id IS NULL) OR
    (author_id IS NULL AND author_group_id IS NOT NULL)
);
