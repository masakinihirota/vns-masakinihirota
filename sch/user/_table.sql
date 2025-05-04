create table "user" (
  "id" uuid primary key not null,
  "created_at" timestamptz default now() not null,
  "updated_at" timestamptz,
  "email" varchar(255) unique not null,
  "password" varchar(255) not null
);
