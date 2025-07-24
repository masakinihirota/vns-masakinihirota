-- 言語テーブル
CREATE TABLE languages (
    id VARCHAR(10) PRIMARY KEY,
    name TEXT NOT NULL,
    native_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
