-- Add missing indexes on Foreign Keys to prevent performance issues (Index Shotgun antipattern)

-- 1. Groups
CREATE INDEX IF NOT EXISTS idx_groups_leader_id ON public.groups(leader_id);

-- 2. Group Members
-- group_members has a composite PK (group_id, user_profile_id), so group_id is already indexed.
-- We need an index on user_profile_id for reverse lookups (finding groups a user belongs to).
CREATE INDEX IF NOT EXISTS idx_group_members_user_profile_id ON public.group_members(user_profile_id);

-- 3. Nations
CREATE INDEX IF NOT EXISTS idx_nations_owner_user_id ON public.nations(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_nations_owner_group_id ON public.nations(owner_group_id);

-- 4. Market Items
CREATE INDEX IF NOT EXISTS idx_market_items_seller_id ON public.market_items(seller_id);
CREATE INDEX IF NOT EXISTS idx_market_items_nation_id ON public.market_items(nation_id);
-- seller_group_id might also be useful if filtering by group
CREATE INDEX IF NOT EXISTS idx_market_items_seller_group_id ON public.market_items(seller_group_id);

-- 5. Nation Events
CREATE INDEX IF NOT EXISTS idx_nation_events_organizer_id ON public.nation_events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_nation_events_nation_id ON public.nation_events(nation_id);

-- 6. Nation Posts (adding as well for completeness, though not explicitly in report)
CREATE INDEX IF NOT EXISTS idx_nation_posts_nation_id ON public.nation_posts(nation_id);
CREATE INDEX IF NOT EXISTS idx_nation_posts_author_id ON public.nation_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_nation_posts_author_group_id ON public.nation_posts(author_group_id);

-- 7. Nation Groups
CREATE INDEX IF NOT EXISTS idx_nation_groups_group_id ON public.nation_groups(group_id);

-- 8. Nation Citizens
CREATE INDEX IF NOT EXISTS idx_nation_citizens_user_profile_id ON public.nation_citizens(user_profile_id);
