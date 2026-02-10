-- 通知機能のクエリパフォーマンス向上
-- user_profile_id と is_read の複合インデックスを追加

CREATE INDEX IF NOT EXISTS idx_notifications_user_profile_id_is_read
ON public.notifications(user_profile_id, is_read);

-- このインデックスは以下のクエリパターンを最適化します：
-- 1. 特定ユーザーの未読通知を取得
--    SELECT * FROM notifications WHERE user_profile_id = ? AND is_read = false ORDER BY created_at DESC;
-- 2. 特定ユーザーの全通知を取得
--    SELECT * FROM notifications WHERE user_profile_id = ? ORDER BY created_at DESC;
--
-- PostgreSQLは複合インデックスの最左プレフィックスを活用できるため、
-- user_profile_id 単独のクエリにも効果があります。
