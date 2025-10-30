-- ====================================
-- VNS-MASAKINIHIROTA データベーススキーマ
-- 作成日: 2025-06-14
-- 参考: 03-テーブル定義書.md
-- ====================================


-- 2. 基本テーブル（依存関係が少ないもの）
-- ====================================



-- カテゴリテーブル
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ジャンルテーブル（カテゴリに依存）
CREATE TABLE genres (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(category_id, name)
);



-- ユーザープロフィールテーブル（ルートアカウントに依存）

-- 作品テーブル（カテゴリ、ジャンル、ユーザープロフィールに依存）
CREATE TABLE works (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category_id UUID REFERENCES categories(id),
    genre_id UUID REFERENCES genres(id),
    official_url TEXT,
    creator_type creator_type NOT NULL,
    user_profile_id UUID REFERENCES user_profiles(id),
    size work_size NOT NULL DEFAULT 'medium',
    release_year INTEGER,
    ai_comment_score INTEGER DEFAULT 0,
    call_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CHECK (
        (creator_type = 'official' AND user_profile_id IS NULL) OR
        (creator_type = 'user_created' AND user_profile_id IS NOT NULL)
    )
);

-- 価値観お題テーブル（カテゴリ、ユーザープロフィールに依存）
CREATE TABLE value_themes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    category_id UUID REFERENCES categories(id),
    creator_type creator_type NOT NULL,
    user_profile_id UUID REFERENCES user_profiles(id),
    tags TEXT[],
    comment_display_type comment_display_type,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CHECK (
        (creator_type = 'official' AND user_profile_id IS NULL) OR
        (creator_type = 'user_created' AND user_profile_id IS NOT NULL)
    )
);

-- 価値観選択肢テーブル（価値観お題に依存）
CREATE TABLE value_choices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    value_theme_id UUID NOT NULL REFERENCES value_themes(id) ON DELETE CASCADE,
    choice_text TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- スキルテーブル
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    creator_type creator_type NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- タグテーブル
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    creator_type creator_type NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- リストテーブル（ユーザープロフィールに依存）
CREATE TABLE lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    creator_type creator_type NOT NULL,
    user_profile_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    is_public BOOLEAN DEFAULT TRUE,
    list_type list_type NOT NULL DEFAULT 'other',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- チェーンテーブル（ユーザープロフィールに依存）
CREATE TABLE chains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    creator_type creator_type NOT NULL,
    user_profile_id UUID REFERENCES user_profiles(id),
    is_public BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CHECK (
        (creator_type = 'official' AND user_profile_id IS NULL) OR
        (creator_type = 'user_created' AND user_profile_id IS NOT NULL)
    )
);

-- チェーンノードテーブル（チェーン、作品に依存）
CREATE TABLE chain_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chain_id UUID NOT NULL REFERENCES chains(id) ON DELETE CASCADE,
    work_id UUID NOT NULL REFERENCES works(id) ON DELETE CASCADE,
    parent_node_id UUID REFERENCES chain_nodes(id),
    depth INTEGER NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    relation_label TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- グループテーブル（ユーザープロフィールに依存）
CREATE TABLE groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    leader_user_profile_id UUID NOT NULL REFERENCES user_profiles(id),
    rules TEXT,
    communication_means TEXT,
    is_public BOOLEAN DEFAULT TRUE,
    status group_status NOT NULL DEFAULT 'active',
    visibility group_visibility NOT NULL DEFAULT 'public',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 上位階層テーブル（グループに依存）
CREATE TABLE alliances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    alliance_leader_group_id UUID NOT NULL REFERENCES groups(id),
    status group_status NOT NULL DEFAULT 'active',
    visibility group_visibility NOT NULL DEFAULT 'public',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- マンダラシートテーブル（ユーザープロフィールに依存）
CREATE TABLE mandala_sheets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_profile_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 3. 中間テーブル・関連テーブル（複数テーブルに依存）
-- ====================================

-- ユーザープロフィール_好きな作品
CREATE TABLE user_profile_favorite_works (
    user_profile_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    work_id UUID NOT NULL REFERENCES works(id) ON DELETE CASCADE,
    evaluation_tier TEXT,
    time_segment time_segment,
    reaction_type reaction_type,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    PRIMARY KEY (user_profile_id, work_id)
);

-- ユーザープロフィール_選択した価値観
CREATE TABLE user_profile_selected_values (
    user_profile_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    value_theme_id UUID NOT NULL REFERENCES value_themes(id) ON DELETE CASCADE,
    value_choice_id UUID NOT NULL REFERENCES value_choices(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    PRIMARY KEY (user_profile_id, value_theme_id, value_choice_id)
);

-- ユーザープロフィール_スキル
CREATE TABLE user_profile_skills (
    user_profile_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    skill_level INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    PRIMARY KEY (user_profile_id, skill_id)
);

-- 作品_タグ
CREATE TABLE work_tags (
    work_id UUID NOT NULL REFERENCES works(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    PRIMARY KEY (work_id, tag_id)
);

-- 価値観お題_タグ
CREATE TABLE value_theme_tags (
    value_theme_id UUID NOT NULL REFERENCES value_themes(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    PRIMARY KEY (value_theme_id, tag_id)
);

-- 作品_作家
CREATE TABLE work_authors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_id UUID NOT NULL REFERENCES works(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    role TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- グループメンバー
CREATE TABLE group_members (
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    user_profile_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    role group_member_role NOT NULL,
    status group_member_status NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    PRIMARY KEY (group_id, user_profile_id)
);

-- 上位階層グループ
CREATE TABLE alliance_groups (
    alliance_id UUID NOT NULL REFERENCES alliances(id) ON DELETE CASCADE,
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    PRIMARY KEY (alliance_id, group_id)
);

-- 関係性
CREATE TABLE relationships (
    source_user_profile_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    target_user_profile_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    relationship_type relationship_type NOT NULL,
    group_context_id UUID REFERENCES groups(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    PRIMARY KEY (source_user_profile_id, target_user_profile_id),
    CHECK (source_user_profile_id != target_user_profile_id)
);

-- マンダラシートセル
CREATE TABLE mandala_sheet_cells (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mandala_sheet_id UUID NOT NULL REFERENCES mandala_sheets(id) ON DELETE CASCADE,
    row_index INTEGER NOT NULL,
    column_index INTEGER NOT NULL,
    content_type mandala_content_type NOT NULL,
    content_skill_id UUID REFERENCES skills(id),
    content_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(mandala_sheet_id, row_index, column_index),
    CHECK (row_index >= 0 AND row_index <= 8),
    CHECK (column_index >= 0 AND column_index <= 8),
    CHECK (
        (content_type = 'skill' AND content_skill_id IS NOT NULL AND content_text IS NULL) OR
        (content_type IN ('sub_theme', 'text') AND content_skill_id IS NULL AND content_text IS NOT NULL)
    )
);

-- 4. システム関連テーブル
-- ====================================

-- ポイント取引履歴
CREATE TABLE point_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    root_account_id UUID REFERENCES root_accounts(id),
    user_profile_id UUID REFERENCES user_profiles(id),
    transaction_type transaction_type NOT NULL,
    points_amount INTEGER NOT NULL,
    description TEXT,
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CHECK (
        (root_account_id IS NOT NULL AND user_profile_id IS NULL) OR
        (root_account_id IS NULL AND user_profile_id IS NOT NULL)
    )
);

-- 通知
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_user_profile_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    notification_type TEXT NOT NULL,
    content TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    link_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ペナルティ
CREATE TABLE penalties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    target_root_account_id UUID REFERENCES root_accounts(id),
    target_user_profile_id UUID REFERENCES user_profiles(id),
    penalty_type penalty_type NOT NULL,
    reason TEXT,
    applied_by_admin_id UUID,
    expires_at TIMESTAMP WITH TIME ZONE,
    warning_count INTEGER DEFAULT 0,
    last_warning_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CHECK (
        (target_root_account_id IS NOT NULL AND target_user_profile_id IS NULL) OR
        (target_root_account_id IS NULL AND target_user_profile_id IS NOT NULL)
    )
);

-- 翻訳
CREATE TABLE translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name TEXT NOT NULL,
    column_name TEXT NOT NULL,
    row_id UUID NOT NULL,
    language_code VARCHAR(10) NOT NULL REFERENCES languages(id),
    translation_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(table_name, column_name, row_id, language_code)
);

-- 5. 履歴テーブル
-- ====================================

-- 作品評価履歴
CREATE TABLE work_evaluation_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_profile_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    work_id UUID NOT NULL REFERENCES works(id) ON DELETE CASCADE,
    tier INTEGER NOT NULL,
    evaluated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    previous_tier INTEGER
);

-- 価値観選択履歴
CREATE TABLE value_selection_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_profile_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    value_theme_id UUID NOT NULL REFERENCES value_themes(id) ON DELETE CASCADE,
    selected_option TEXT NOT NULL,
    selected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    previous_option TEXT
);

-- スキル取得履歴
CREATE TABLE skill_progress_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_profile_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    level INTEGER NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    previous_level INTEGER
);

-- 6. 監査ログ・システム運用テーブル
-- ====================================

-- 削除ログ
CREATE TABLE deleted_records_log (
    id BIGSERIAL PRIMARY KEY,
    table_name TEXT NOT NULL,
    record_id TEXT NOT NULL,
    deleted_data JSONB NOT NULL,
    deleted_by UUID,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    deletion_reason TEXT,
    ip_address INET,
    user_agent TEXT
);

-- ユーザー操作ログ
CREATE TABLE user_activity_log (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID,
    action_type TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- エラーログ
CREATE TABLE error_logs (
    id BIGSERIAL PRIMARY KEY,
    error_type TEXT NOT NULL,
    error_message TEXT NOT NULL,
    stack_trace TEXT,
    user_id UUID,
    request_path TEXT,
    request_method TEXT,
    request_body JSONB,
    occurred_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- パフォーマンス監視
CREATE TABLE performance_metrics (
    id BIGSERIAL PRIMARY KEY,
    endpoint TEXT NOT NULL,
    response_time_ms INTEGER NOT NULL,
    memory_usage_mb FLOAT,
    cpu_usage_percent FLOAT,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ログイン試行ログ
CREATE TABLE login_attempts (
    id BIGSERIAL PRIMARY KEY,
    email TEXT,
    ip_address INET NOT NULL,
    user_agent TEXT,
    success BOOLEAN NOT NULL,
    failure_reason TEXT,
    attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- セキュリティインシデント
CREATE TABLE security_incidents (
    id BIGSERIAL PRIMARY KEY,
    incident_type TEXT NOT NULL,
    severity TEXT NOT NULL,
    description TEXT NOT NULL,
    source_ip INET,
    user_id UUID,
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- ====================================
-- インデックス作成
-- ====================================

-- 基本テーブルのインデックス
CREATE INDEX idx_root_accounts_email ON root_accounts(email);
CREATE INDEX idx_root_accounts_last_login ON root_accounts(last_login_at);
CREATE INDEX idx_root_accounts_mother_tongue ON root_accounts(mother_tongue_code);
CREATE INDEX idx_root_accounts_site_language ON root_accounts(site_language_code);

CREATE INDEX idx_user_profiles_root_account_id ON user_profiles(root_account_id);
CREATE INDEX idx_user_profiles_profile_type ON user_profiles(profile_type);
CREATE INDEX idx_user_profiles_status ON user_profiles(status);

CREATE INDEX idx_works_category_id ON works(category_id);
CREATE INDEX idx_works_genre_id ON works(genre_id);
CREATE INDEX idx_works_creator_type ON works(creator_type);
CREATE INDEX idx_works_user_profile_id ON works(user_profile_id);
CREATE INDEX idx_works_title ON works(title);
CREATE INDEX idx_works_release_year ON works(release_year);

CREATE INDEX idx_genres_category_id ON genres(category_id);

CREATE INDEX idx_value_themes_category_id ON value_themes(category_id);
CREATE INDEX idx_value_themes_creator_type ON value_themes(creator_type);
CREATE INDEX idx_value_themes_user_profile_id ON value_themes(user_profile_id);

CREATE INDEX idx_value_choices_value_theme_id ON value_choices(value_theme_id);
CREATE INDEX idx_value_choices_display_order ON value_choices(display_order);

CREATE INDEX idx_skills_creator_type ON skills(creator_type);
CREATE INDEX idx_skills_name ON skills(name);

CREATE INDEX idx_tags_creator_type ON tags(creator_type);
CREATE INDEX idx_tags_name ON tags(name);

CREATE INDEX idx_lists_user_profile_id ON lists(user_profile_id);
CREATE INDEX idx_lists_creator_type ON lists(creator_type);
CREATE INDEX idx_lists_list_type ON lists(list_type);

CREATE INDEX idx_chains_user_profile_id ON chains(user_profile_id);
CREATE INDEX idx_chains_creator_type ON chains(creator_type);

CREATE INDEX idx_chain_nodes_chain_id ON chain_nodes(chain_id);
CREATE INDEX idx_chain_nodes_work_id ON chain_nodes(work_id);
CREATE INDEX idx_chain_nodes_parent_node_id ON chain_nodes(parent_node_id);
CREATE INDEX idx_chain_nodes_depth ON chain_nodes(depth);

CREATE INDEX idx_groups_leader_user_profile_id ON groups(leader_user_profile_id);
CREATE INDEX idx_groups_status ON groups(status);
CREATE INDEX idx_groups_visibility ON groups(visibility);

CREATE INDEX idx_alliances_alliance_leader_group_id ON alliances(alliance_leader_group_id);

CREATE INDEX idx_mandala_sheets_user_profile_id ON mandala_sheets(user_profile_id);

-- 中間テーブルのインデックス
CREATE INDEX idx_user_profile_favorite_works_user_profile ON user_profile_favorite_works(user_profile_id);
CREATE INDEX idx_user_profile_favorite_works_work ON user_profile_favorite_works(work_id);
CREATE INDEX idx_user_profile_favorite_works_tier ON user_profile_favorite_works(evaluation_tier);
CREATE INDEX idx_user_profile_favorite_works_time_segment ON user_profile_favorite_works(time_segment);

CREATE INDEX idx_user_profile_selected_values_user_profile ON user_profile_selected_values(user_profile_id);
CREATE INDEX idx_user_profile_selected_values_value_theme ON user_profile_selected_values(value_theme_id);

CREATE INDEX idx_user_profile_skills_user_profile ON user_profile_skills(user_profile_id);
CREATE INDEX idx_user_profile_skills_skill ON user_profile_skills(skill_id);
CREATE INDEX idx_user_profile_skills_level ON user_profile_skills(skill_level);

CREATE INDEX idx_work_authors_work_id ON work_authors(work_id);
CREATE INDEX idx_work_authors_author_name ON work_authors(author_name);

CREATE INDEX idx_group_members_group_id ON group_members(group_id);
CREATE INDEX idx_group_members_user_profile_id ON group_members(user_profile_id);
CREATE INDEX idx_group_members_role ON group_members(role);
CREATE INDEX idx_group_members_status ON group_members(status);

CREATE INDEX idx_relationships_source_user_profile ON relationships(source_user_profile_id);
CREATE INDEX idx_relationships_target_user_profile ON relationships(target_user_profile_id);
CREATE INDEX idx_relationships_type ON relationships(relationship_type);

CREATE INDEX idx_mandala_sheet_cells_mandala_sheet_id ON mandala_sheet_cells(mandala_sheet_id);
CREATE INDEX idx_mandala_sheet_cells_content_skill_id ON mandala_sheet_cells(content_skill_id);

-- システムテーブルのインデックス
CREATE INDEX idx_point_transactions_root_account_id ON point_transactions(root_account_id);
CREATE INDEX idx_point_transactions_user_profile_id ON point_transactions(user_profile_id);
CREATE INDEX idx_point_transactions_transaction_date ON point_transactions(transaction_date);
CREATE INDEX idx_point_transactions_transaction_type ON point_transactions(transaction_type);

CREATE INDEX idx_notifications_recipient_user_profile_id ON notifications(recipient_user_profile_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

CREATE INDEX idx_penalties_target_root_account_id ON penalties(target_root_account_id);
CREATE INDEX idx_penalties_target_user_profile_id ON penalties(target_user_profile_id);
CREATE INDEX idx_penalties_penalty_type ON penalties(penalty_type);

CREATE INDEX idx_translations_table_column_row ON translations(table_name, column_name, row_id);
CREATE INDEX idx_translations_language_code ON translations(language_code);

-- 履歴テーブルのインデックス
CREATE INDEX idx_work_evaluation_history_user_profile_id ON work_evaluation_history(user_profile_id);
CREATE INDEX idx_work_evaluation_history_work_id ON work_evaluation_history(work_id);
CREATE INDEX idx_work_evaluation_history_evaluated_at ON work_evaluation_history(evaluated_at);

CREATE INDEX idx_value_selection_history_user_profile_id ON value_selection_history(user_profile_id);
CREATE INDEX idx_value_selection_history_value_theme_id ON value_selection_history(value_theme_id);
CREATE INDEX idx_value_selection_history_selected_at ON value_selection_history(selected_at);

CREATE INDEX idx_skill_progress_history_user_profile_id ON skill_progress_history(user_profile_id);
CREATE INDEX idx_skill_progress_history_skill_id ON skill_progress_history(skill_id);
CREATE INDEX idx_skill_progress_history_updated_at ON skill_progress_history(updated_at);

-- 監査ログテーブルのインデックス
CREATE INDEX idx_deleted_records_log_table_name ON deleted_records_log(table_name);
CREATE INDEX idx_deleted_records_log_deleted_at ON deleted_records_log(deleted_at);
CREATE INDEX idx_deleted_records_log_deleted_by ON deleted_records_log(deleted_by);

CREATE INDEX idx_user_activity_log_user_id ON user_activity_log(user_id);
CREATE INDEX idx_user_activity_log_action_type ON user_activity_log(action_type);
CREATE INDEX idx_user_activity_log_created_at ON user_activity_log(created_at);

CREATE INDEX idx_error_logs_error_type ON error_logs(error_type);
CREATE INDEX idx_error_logs_occurred_at ON error_logs(occurred_at);
CREATE INDEX idx_error_logs_user_id ON error_logs(user_id);

CREATE INDEX idx_performance_metrics_endpoint ON performance_metrics(endpoint);
CREATE INDEX idx_performance_metrics_recorded_at ON performance_metrics(recorded_at);

CREATE INDEX idx_login_attempts_email ON login_attempts(email);
CREATE INDEX idx_login_attempts_ip_address ON login_attempts(ip_address);
CREATE INDEX idx_login_attempts_attempted_at ON login_attempts(attempted_at);

CREATE INDEX idx_security_incidents_incident_type ON security_incidents(incident_type);
CREATE INDEX idx_security_incidents_severity ON security_incidents(severity);
CREATE INDEX idx_security_incidents_detected_at ON security_incidents(detected_at);

-- ====================================
-- 自動更新トリガー関数
-- ====================================

-- updated_at カラムを自動更新する関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- 各テーブルにupdated_atトリガーを設定
CREATE TRIGGER update_languages_updated_at
    BEFORE UPDATE ON languages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_genres_updated_at
    BEFORE UPDATE ON genres
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_root_accounts_updated_at
    BEFORE UPDATE ON root_accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_works_updated_at
    BEFORE UPDATE ON works
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_value_themes_updated_at
    BEFORE UPDATE ON value_themes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_value_choices_updated_at
    BEFORE UPDATE ON value_choices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skills_updated_at
    BEFORE UPDATE ON skills
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tags_updated_at
    BEFORE UPDATE ON tags
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lists_updated_at
    BEFORE UPDATE ON lists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chains_updated_at
    BEFORE UPDATE ON chains
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chain_nodes_updated_at
    BEFORE UPDATE ON chain_nodes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_groups_updated_at
    BEFORE UPDATE ON groups
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alliances_updated_at
    BEFORE UPDATE ON alliances
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mandala_sheets_updated_at
    BEFORE UPDATE ON mandala_sheets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profile_favorite_works_updated_at
    BEFORE UPDATE ON user_profile_favorite_works
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profile_selected_values_updated_at
    BEFORE UPDATE ON user_profile_selected_values
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profile_skills_updated_at
    BEFORE UPDATE ON user_profile_skills
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_work_authors_updated_at
    BEFORE UPDATE ON work_authors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_group_members_updated_at
    BEFORE UPDATE ON group_members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_relationships_updated_at
    BEFORE UPDATE ON relationships
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mandala_sheet_cells_updated_at
    BEFORE UPDATE ON mandala_sheet_cells
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_translations_updated_at
    BEFORE UPDATE ON translations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ====================================
-- 基本データの投入
-- ====================================

-- 言語データ
INSERT INTO languages (id, name, native_name) VALUES
('ja', 'Japanese', '日本語'),
('en', 'English', 'English'),
('ko', 'Korean', '한국어'),
('zh', 'Chinese (Simplified)', '中文(简体)'),
('zh-TW', 'Chinese (Traditional)', '中文(繁體)'),
('es', 'Spanish', 'Español'),
('fr', 'French', 'Français'),
('de', 'German', 'Deutsch'),
('it', 'Italian', 'Italiano'),
('pt', 'Portuguese', 'Português');

-- カテゴリデータ
INSERT INTO categories (name, description) VALUES
('アニメ', 'アニメーション作品'),
('漫画', '漫画・コミック作品'),
('ゲーム', 'ビデオゲーム・コンピューターゲーム'),
('小説', '小説・ライトノベル'),
('映画', '映画作品'),
('音楽', '音楽・楽曲'),
('価値観', '価値観に関するお題'),
('スキル', '技能・能力に関するカテゴリ'),
('その他', 'その他のカテゴリ');

-- コメント
-- このSQL文は以下の順序で作成されています：
-- 1. ENUMタイプ定義（依存関係なし）
-- 2. 基本テーブル（参照先テーブル）
-- 3. 中間テーブル・関連テーブル（参照元テーブル）
-- 4. システム関連テーブル
-- 5. 履歴テーブル
-- 6. 監査ログテーブル
-- 7. インデックス作成
-- 8. トリガー設定
-- 9. 基本データ投入
--
-- 外部キー制約により、参照先テーブルが先に作成され、
-- 参照元テーブルが後に作成される構造になっています。
