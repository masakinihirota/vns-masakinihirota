create table auth.users (
  instance_id uuid null,
  id uuid not null,
  aud character varying(255) null,
  role character varying(255) null,
  email character varying(255) null,
  encrypted_password character varying(255) null,
  email_confirmed_at timestamp with time zone null,
  invited_at timestamp with time zone null,
  confirmation_token character varying(255) null,
  confirmation_sent_at timestamp with time zone null,
  recovery_token character varying(255) null,
  recovery_sent_at timestamp with time zone null,
  email_change_token_new character varying(255) null,
  email_change character varying(255) null,
  email_change_sent_at timestamp with time zone null,
  last_sign_in_at timestamp with time zone null,
  raw_app_meta_data jsonb null,
  raw_user_meta_data jsonb null,
  is_super_admin boolean null,
  created_at timestamp with time zone null,
  updated_at timestamp with time zone null,
  phone text null default null::character varying,
  phone_confirmed_at timestamp with time zone null,
  phone_change text null default ''::character varying,
  phone_change_token character varying(255) null default ''::character varying,
  phone_change_sent_at timestamp with time zone null,
  confirmed_at timestamp with time zone GENERATED ALWAYS as (LEAST(email_confirmed_at, phone_confirmed_at)) STORED null,
  email_change_token_current character varying(255) null default ''::character varying,
  email_change_confirm_status smallint null default 0,
  banned_until timestamp with time zone null,
  reauthentication_token character varying(255) null default ''::character varying,
  reauthentication_sent_at timestamp with time zone null,
  is_sso_user boolean not null default false,
  deleted_at timestamp with time zone null,
  is_anonymous boolean not null default false,
  constraint users_pkey primary key (id),
  constraint users_phone_key unique (phone),
  constraint users_email_change_confirm_status_check check (
    (
      (email_change_confirm_status >= 0)
      and (email_change_confirm_status <= 2)
    )
  )
) TABLESPACE pg_default;

create index IF not exists users_instance_id_idx on auth.users using btree (instance_id) TABLESPACE pg_default;

create index IF not exists users_instance_id_email_idx on auth.users using btree (instance_id, lower((email)::text)) TABLESPACE pg_default;

create unique INDEX IF not exists confirmation_token_idx on auth.users using btree (confirmation_token) TABLESPACE pg_default
where
  ((confirmation_token)::text !~ '^[0-9 ]*$'::text);

create unique INDEX IF not exists recovery_token_idx on auth.users using btree (recovery_token) TABLESPACE pg_default
where
  ((recovery_token)::text !~ '^[0-9 ]*$'::text);

create unique INDEX IF not exists email_change_token_current_idx on auth.users using btree (email_change_token_current) TABLESPACE pg_default
where
  (
    (email_change_token_current)::text !~ '^[0-9 ]*$'::text
  );

create unique INDEX IF not exists email_change_token_new_idx on auth.users using btree (email_change_token_new) TABLESPACE pg_default
where
  (
    (email_change_token_new)::text !~ '^[0-9 ]*$'::text
  );

create unique INDEX IF not exists reauthentication_token_idx on auth.users using btree (reauthentication_token) TABLESPACE pg_default
where
  (
    (reauthentication_token)::text !~ '^[0-9 ]*$'::text
  );

create unique INDEX IF not exists users_email_partial_key on auth.users using btree (email) TABLESPACE pg_default
where
  (is_sso_user = false);

create index IF not exists users_is_anonymous_idx on auth.users using btree (is_anonymous) TABLESPACE pg_default;


















{
  "instance_id": "00000000-0000-0000-0000-000000000000",
  "id": "9524b3c8-274f-4b2d-9bd5-45e413478c7b",
  "aud": "authenticated",
  "role": "authenticated",
  "email": "masakinihirota@gmail.com",
  "encrypted_password": null,
  "email_confirmed_at": "2025-05-04 18:04:42.506115+00",
  "invited_at": null,
  "confirmation_token": "",
  "confirmation_sent_at": null,
  "recovery_token": "",
  "recovery_sent_at": null,
  "email_change_token_new": "",
  "email_change": "",
  "email_change_sent_at": null,
  "last_sign_in_at": "2025-05-04 18:04:52.551443+00",
  "raw_app_meta_data": {
    "provider": "google",
    "providers": [
      "google",
      "github"
    ]
  },
  "raw_user_meta_data": {
    "iss": "https://api.github.com",
    "sub": "7696510",
    "name": "masakinihirota",
    "email": "masakinihirota@gmail.com",
    "picture": "https://lh3.googleusercontent.com/a/ACg8ocKFZhMiKkyzRV9v7PxyyrKFS-L94yfp8sU7djstw6VlMZgErQ=s96-c",
    "full_name": "masakinihirota",
    "user_name": "masakinihirota",
    "avatar_url": "https://avatars.githubusercontent.com/u/7696510?v=4",
    "provider_id": "7696510",
    "email_verified": true,
    "phone_verified": false,
    "preferred_username": "masakinihirota"
  },
  "is_super_admin": null,
  "created_at": "2025-05-04 18:04:42.486273+00",
  "updated_at": "2025-05-04 18:04:52.554721+00",
  "phone": null,
  "phone_confirmed_at": null,
  "phone_change": "",
  "phone_change_token": "",
  "phone_change_sent_at": null,
  "confirmed_at": "2025-05-04 18:04:42.506115+00",
  "email_change_token_current": "",
  "email_change_confirm_status": 0,
  "banned_until": null,
  "reauthentication_token": "",
  "reauthentication_sent_at": null,
  "is_sso_user": false,
  "deleted_at": null,
  "is_anonymous": false,
  "providers": [
    "github",
    "google"
  ]
}



{
  "instance_id": "00000000-0000-0000-0000-000000000000",
  "id": "0480313b-25c6-4ee5-80e9-39435f82fab3",
  "aud": "authenticated",
  "role": "authenticated",
  "email": null,
  "encrypted_password": "",
  "email_confirmed_at": null,
  "invited_at": null,
  "confirmation_token": "",
  "confirmation_sent_at": null,
  "recovery_token": "",
  "recovery_sent_at": null,
  "email_change_token_new": "",
  "email_change": "",
  "email_change_sent_at": null,
  "last_sign_in_at": "2025-05-04 17:43:34.324219+00",
  "raw_app_meta_data": {},
  "raw_user_meta_data": {},
  "is_super_admin": null,
  "created_at": "2025-05-04 17:43:34.319254+00",
  "updated_at": "2025-05-04 17:43:34.327277+00",
  "phone": null,
  "phone_confirmed_at": null,
  "phone_change": "",
  "phone_change_token": "",
  "phone_change_sent_at": null,
  "confirmed_at": null,
  "email_change_token_current": "",
  "email_change_confirm_status": 0,
  "banned_until": null,
  "reauthentication_token": "",
  "reauthentication_sent_at": null,
  "is_sso_user": false,
  "deleted_at": null,
  "is_anonymous": true,
  "providers": []
}



