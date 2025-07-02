-- 1. ENUMタイプの定義（依存関係なし）
-- ====================================

-- プロフィールタイプ
CREATE TYPE profile_type AS ENUM (
    'self',
    'interview_target',
    'other_person_representation',
    'fictional_character',
    'bot'
);

-- プロフィールステータス
CREATE TYPE profile_status AS ENUM (
    'recruiting_member',
    'recruiting_job',
    'recruiting_partner',
    'recruiting_assistant',
    'recruiting_manga_friend',
    'seeking_advice',
    'offering_advice',
    'open_to_collaboration',
    'just_browsing',
    'other'
);

-- 関係性タイプ
CREATE TYPE relationship_type AS ENUM (
    'watch',
    'follow',
    'pre_partner',
    'partner'
);

-- 取引タイプ
CREATE TYPE transaction_type AS ENUM (
    'earn',
    'spend'
);

-- ペナルティタイプ
CREATE TYPE penalty_type AS ENUM (
    'warning',
    'mute',
    'ban'
);

-- 作成者タイプ
CREATE TYPE creator_type AS ENUM (
    'official',
    'user_created'
);

-- 時間セグメント
CREATE TYPE time_segment AS ENUM (
    'current',
    'future',
    'life'
);

-- リアクションタイプ
CREATE TYPE reaction_type AS ENUM (
    'like',
    'applause'
);

-- 居住地域セグメント
CREATE TYPE living_area_segment AS ENUM (
    'area1',
    'area2',
    'area3'
);

-- グループステータス
CREATE TYPE group_status AS ENUM (
    'active',
    'recruiting',
    'closed'
);

-- グループ可視性
CREATE TYPE group_visibility AS ENUM (
    'public',
    'private',
    'unlisted'
);

-- グループメンバー役割
CREATE TYPE group_member_role AS ENUM (
    'leader',
    'manager',
    'member'
);

-- グループメンバーステータス
CREATE TYPE group_member_status AS ENUM (
    'active',
    'pending_approval',
    'invited'
);

-- 作品サイズ
CREATE TYPE work_size AS ENUM (
    'short',
    'medium',
    'long',
    'epic',
    'never_ending'
);

-- リストタイプ
CREATE TYPE list_type AS ENUM (
    'category',
    'genre',
    'value',
    'skill',
    'other'
);

-- コメント表示タイプ
CREATE TYPE comment_display_type AS ENUM (
    'before_selection',
    'after_selection',
    'both'
);

-- マンダラセルコンテンツタイプ
CREATE TYPE mandala_content_type AS ENUM (
    'skill',
    'sub_theme',
    'text'
);
