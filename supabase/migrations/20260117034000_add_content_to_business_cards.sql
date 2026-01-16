-- Add content column for Work Card extended attributes
alter table business_cards
add column if not exists content jsonb default '{}'::jsonb not null;
