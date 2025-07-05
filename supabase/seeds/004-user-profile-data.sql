--ユーザープロフィール
-- UserProfile_FavoriteWorks
INSERT INTO public.user_profile_favorite_works (user_profile_id, work_id, evaluation_tier, time_segment) VALUES
('c0000008-0000-0000-0000-000000000002', 'c0000004-0000-0000-0000-000000000001', 'S', 'life'),
('c0000008-0000-0000-0000-000000000007', 'c0000004-0000-0000-0000-000000000005', 'A', 'recent');

-- UserProfile_SelectedValues
INSERT INTO public.user_selected_values (user_profile_id, value_theme_id, value_choice_id) VALUES
('c0000008-0000-0000-0000-000000000001', 'c0000005-0000-0000-0000-000000000001', 'c0000006-0000-0000-0000-000000000002'),
('c0000008-0000-0000-0000-000000000002', 'c0000005-0000-0000-0000-000000000002', 'c0000006-0000-0000-0000-000000000005');

-- UserProfile_Skills
INSERT INTO public.user_profile_skills (user_profile_id, skill_id, skill_level) VALUES
('c0000008-0000-0000-0000-000000000004', 'c0000003-0000-0000-0000-000000000008', 3);
