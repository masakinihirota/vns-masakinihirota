-- 1. グループ（Groups）
CREATE TABLE public.groups (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    is_official BOOLEAN DEFAULT false,
    avatar_url TEXT,
    cover_url TEXT,
    leader_id UUID REFERENCES public.user_profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- グループメンバー
CREATE TABLE public.group_members (
    group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
    user_profile_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    role TEXT CHECK (role IN ('leader', 'mediator', 'member')) DEFAULT 'member',
    joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (group_id, user_profile_id)
);

-- 2. 国（Nations）
CREATE TABLE public.nations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    is_official BOOLEAN DEFAULT false,
    avatar_url TEXT,
    cover_url TEXT,

    owner_user_id UUID REFERENCES public.user_profiles(id),
    owner_group_id UUID REFERENCES public.groups(id),

    -- 手数料率（パーセント、デフォルト10%）
    transaction_fee_rate NUMERIC DEFAULT 10.0,

    -- 建国コスト（システム設定値だが、記録として保持も可）
    foundation_fee INTEGER DEFAULT 1000,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 国に参加しているグループの役割管理
CREATE TABLE public.nation_groups (
    nation_id UUID NOT NULL REFERENCES public.nations(id) ON DELETE CASCADE,
    group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
    role TEXT CHECK (role IN ('deputy', 'member')) DEFAULT 'member',
    joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (nation_id, group_id)
);

-- 国の市民（個人参加）
CREATE TABLE public.nation_citizens (
    nation_id UUID NOT NULL REFERENCES public.nations(id) ON DELETE CASCADE,
    user_profile_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    role TEXT CHECK (role IN ('official', 'citizen')) DEFAULT 'citizen',
    joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (nation_id, user_profile_id)
);

-- 国の広場（チャット/アナウンス）
CREATE TABLE public.nation_posts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    nation_id UUID NOT NULL REFERENCES public.nations(id) ON DELETE CASCADE,
    author_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    author_group_id UUID REFERENCES public.groups(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    type TEXT CHECK (type IN ('announcement', 'chat')) DEFAULT 'chat',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. マーケット（Market）
CREATE TABLE public.market_items (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    nation_id UUID NOT NULL REFERENCES public.nations(id) ON DELETE CASCADE,
    seller_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    seller_group_id UUID REFERENCES public.groups(id) ON DELETE SET NULL,

    title TEXT NOT NULL,
    description TEXT,
    price INTEGER NOT NULL CHECK (price >= 0),
    currency TEXT DEFAULT 'point',

    type TEXT CHECK (type IN ('sell', 'buy_request')) DEFAULT 'sell',
    status TEXT CHECK (status IN ('open', 'sold', 'closed')) DEFAULT 'open',

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 取引履歴（Transactions & Escrow）
CREATE TABLE public.market_transactions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    item_id UUID NOT NULL REFERENCES public.market_items(id),
    buyer_id UUID REFERENCES public.user_profiles(id), -- Payer (支払者)
    seller_id UUID REFERENCES public.user_profiles(id), -- Receiver (受取者/事業者)

    price INTEGER NOT NULL,
    fee_rate NUMERIC NOT NULL,
    fee_amount INTEGER NOT NULL,
    seller_revenue INTEGER NOT NULL,

    -- 'pending': 支払い済み・預かり中, 'completed': 受取完了・送金済み, 'cancelled': 返金済み
    status TEXT CHECK (status IN ('pending', 'completed', 'cancelled')) DEFAULT 'pending',

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at TIMESTAMPTZ
);

-- 4. イベント（Events）
CREATE TABLE public.nation_events (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    nation_id UUID NOT NULL REFERENCES public.nations(id) ON DELETE CASCADE,
    organizer_id UUID REFERENCES public.user_profiles(id),

    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    start_at TIMESTAMPTZ NOT NULL,
    end_at TIMESTAMPTZ,
    recruitment_start_at TIMESTAMPTZ,
    recruitment_end_at TIMESTAMPTZ,
    max_participants INTEGER,
    conditions TEXT,
    sponsors TEXT,
    type TEXT CHECK (type IN ('product_required', 'free', 'other')) DEFAULT 'free',
    status TEXT CHECK (status IN ('draft', 'published', 'cancelled', 'completed')) DEFAULT 'published',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- イベント参加者
CREATE TABLE public.nation_event_participants (
    event_id UUID NOT NULL REFERENCES public.nation_events(id) ON DELETE CASCADE,
    user_profile_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('going', 'cancelled', 'waitlist')) DEFAULT 'going',
    joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (event_id, user_profile_id)
);

-- 5. 通知（Notifications）
CREATE TABLE public.notifications (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_profile_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link_url TEXT,
    type TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nation_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nation_citizens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nation_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nation_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nation_event_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Basic Policies (To be refined)
CREATE POLICY "Public read access for groups" ON public.groups FOR SELECT USING (true);
CREATE POLICY "Public read access for nations" ON public.nations FOR SELECT USING (true);
CREATE POLICY "Public read access for market items" ON public.market_items FOR SELECT USING (true);
CREATE POLICY "Public read access for events" ON public.nation_events FOR SELECT USING (true);

-- Authenticated users can insert (Refinement needed for logic checks)
CREATE POLICY "Authenticated users can create groups" ON public.groups FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
