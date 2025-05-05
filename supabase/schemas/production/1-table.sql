create table "production" (
  "id" uuid primary key not null,
  "created_at" timestamptz default now() not null,
  "updated_at" timestamptz
);
