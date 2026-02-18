CREATE TYPE "public"."alliance_status" AS ENUM('requested', 'pre_partner', 'partner');--> statement-breakpoint
CREATE TYPE "public"."follow_status" AS ENUM('watch', 'follow');--> statement-breakpoint
CREATE TABLE "accounts" (
	"userId" uuid NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "accounts_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE "alliances" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_a_id" uuid NOT NULL,
	"profile_b_id" uuid NOT NULL,
	"status" "alliance_status" DEFAULT 'requested' NOT NULL,
	"expires_at" timestamp with time zone,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "alliances_unique_pair" UNIQUE("profile_a_id","profile_b_id"),
	CONSTRAINT "alliances_profile_order_check" CHECK (profile_a_id < profile_b_id)
);
--> statement-breakpoint
CREATE TABLE "business_cards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_profile_id" uuid NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"display_config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
	"updated_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
	"content" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "business_cards_user_profile_id_key" UNIQUE("user_profile_id")
);
--> statement-breakpoint
CREATE TABLE "follows" (
	"follower_profile_id" uuid NOT NULL,
	"followed_profile_id" uuid NOT NULL,
	"status" "follow_status" DEFAULT 'follow' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "follows_pkey" PRIMARY KEY("follower_profile_id","followed_profile_id"),
	CONSTRAINT "follows_self_check" CHECK (follower_profile_id <> followed_profile_id)
);
--> statement-breakpoint
CREATE TABLE "group_members" (
	"group_id" uuid NOT NULL,
	"user_profile_id" uuid NOT NULL,
	"role" text DEFAULT 'member',
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "group_members_pkey" PRIMARY KEY("group_id","user_profile_id"),
	CONSTRAINT "group_members_role_check" CHECK (role = ANY (ARRAY['leader'::text, 'mediator'::text, 'member'::text]))
);
--> statement-breakpoint
CREATE TABLE "groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"is_official" boolean DEFAULT false,
	"avatar_url" text,
	"cover_url" text,
	"leader_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "market_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nation_id" uuid NOT NULL,
	"seller_id" uuid,
	"seller_group_id" uuid,
	"title" text NOT NULL,
	"description" text,
	"price" integer NOT NULL,
	"currency" text DEFAULT 'point',
	"type" text DEFAULT 'sell',
	"status" text DEFAULT 'open',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "market_items_price_check" CHECK (price >= 0),
	CONSTRAINT "market_items_type_check" CHECK (type = ANY (ARRAY['sell'::text, 'buy_request'::text])),
	CONSTRAINT "market_items_status_check" CHECK (status = ANY (ARRAY['open'::text, 'sold'::text, 'closed'::text]))
);
--> statement-breakpoint
CREATE TABLE "market_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"item_id" uuid NOT NULL,
	"buyer_id" uuid,
	"seller_id" uuid,
	"price" integer NOT NULL,
	"fee_rate" numeric NOT NULL,
	"fee_amount" integer NOT NULL,
	"seller_revenue" integer NOT NULL,
	"status" text DEFAULT 'pending',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone,
	CONSTRAINT "market_transactions_status_check" CHECK (status = ANY (ARRAY['pending'::text, 'completed'::text, 'cancelled'::text]))
);
--> statement-breakpoint
CREATE TABLE "nation_citizens" (
	"nation_id" uuid NOT NULL,
	"user_profile_id" uuid NOT NULL,
	"role" text DEFAULT 'citizen',
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "nation_citizens_pkey" PRIMARY KEY("nation_id","user_profile_id"),
	CONSTRAINT "nation_citizens_role_check" CHECK (role = ANY (ARRAY['official'::text, 'citizen'::text]))
);
--> statement-breakpoint
CREATE TABLE "nation_event_participants" (
	"event_id" uuid NOT NULL,
	"user_profile_id" uuid NOT NULL,
	"status" text DEFAULT 'going',
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "nation_event_participants_pkey" PRIMARY KEY("event_id","user_profile_id"),
	CONSTRAINT "nation_event_participants_status_check" CHECK (status = ANY (ARRAY['going'::text, 'cancelled'::text, 'waitlist'::text]))
);
--> statement-breakpoint
CREATE TABLE "nation_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nation_id" uuid NOT NULL,
	"organizer_id" uuid,
	"title" text NOT NULL,
	"description" text,
	"image_url" text,
	"start_at" timestamp with time zone NOT NULL,
	"end_at" timestamp with time zone,
	"recruitment_start_at" timestamp with time zone,
	"recruitment_end_at" timestamp with time zone,
	"max_participants" integer,
	"conditions" text,
	"sponsors" text,
	"type" text DEFAULT 'free',
	"status" text DEFAULT 'published',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "nation_events_type_check" CHECK (type = ANY (ARRAY['product_required'::text, 'free'::text, 'other'::text])),
	CONSTRAINT "nation_events_status_check" CHECK (status = ANY (ARRAY['draft'::text, 'published'::text, 'cancelled'::text, 'completed'::text]))
);
--> statement-breakpoint
CREATE TABLE "nation_groups" (
	"nation_id" uuid NOT NULL,
	"group_id" uuid NOT NULL,
	"role" text DEFAULT 'member',
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "nation_groups_pkey" PRIMARY KEY("nation_id","group_id"),
	CONSTRAINT "nation_groups_role_check" CHECK (role = ANY (ARRAY['deputy'::text, 'member'::text]))
);
--> statement-breakpoint
CREATE TABLE "nation_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nation_id" uuid NOT NULL,
	"author_id" uuid,
	"author_group_id" uuid,
	"content" text NOT NULL,
	"type" text DEFAULT 'chat',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "nation_posts_type_check" CHECK (type = ANY (ARRAY['announcement'::text, 'chat'::text])),
	CONSTRAINT "check_author_exclusive" CHECK (((author_id IS NOT NULL) AND (author_group_id IS NULL)) OR ((author_id IS NULL) AND (author_group_id IS NOT NULL)))
);
--> statement-breakpoint
CREATE TABLE "nations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"is_official" boolean DEFAULT false,
	"avatar_url" text,
	"cover_url" text,
	"owner_user_id" uuid,
	"owner_group_id" uuid,
	"transaction_fee_rate" numeric DEFAULT '10.0',
	"foundation_fee" integer DEFAULT 1000,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_profile_id" uuid NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"link_url" text,
	"type" text NOT NULL,
	"is_read" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "point_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"root_account_id" uuid NOT NULL,
	"amount" integer NOT NULL,
	"type" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "root_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"auth_user_id" uuid NOT NULL,
	"points" integer DEFAULT 3000 NOT NULL,
	"level" integer DEFAULT 1 NOT NULL,
	"trust_days" integer DEFAULT 0 NOT NULL,
	"data_retention_days" integer DEFAULT 30,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "root_accounts_auth_user_id_key" UNIQUE("auth_user_id"),
	CONSTRAINT "root_accounts_points_check" CHECK (points >= 0),
	CONSTRAINT "root_accounts_level_check" CHECK (level >= 1),
	CONSTRAINT "root_accounts_trust_days_check" CHECK (trust_days >= 0)
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" uuid NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"root_account_id" uuid NOT NULL,
	"display_name" text NOT NULL,
	"purpose" text,
	"role_type" text DEFAULT 'member' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_interacted_record_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "role_type_check" CHECK (role_type = ANY (ARRAY['leader'::text, 'member'::text, 'admin'::text, 'mediator'::text]))
);
--> statement-breakpoint
CREATE TABLE "user_work_entries" (
	"user_id" uuid NOT NULL,
	"work_id" uuid NOT NULL,
	"status" text NOT NULL,
	"tier" integer,
	"memo" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_work_entries_pkey" PRIMARY KEY("user_id","work_id"),
	CONSTRAINT "user_work_entries_status_check" CHECK (status = ANY (ARRAY['expecting'::text, 'reading'::text, 'interesting'::text]))
);
--> statement-breakpoint
CREATE TABLE "user_work_ratings" (
	"user_id" uuid NOT NULL,
	"work_id" uuid NOT NULL,
	"rating" text NOT NULL,
	"last_tier" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_work_ratings_pkey" PRIMARY KEY("user_id","work_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"email" text,
	"emailVerified" timestamp,
	"image" text,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE "works" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"author" text,
	"category" text NOT NULL,
	"is_official" boolean DEFAULT false NOT NULL,
	"owner_user_id" uuid,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"description" text,
	"tags" text[] DEFAULT '{""}',
	"external_url" text,
	"affiliate_url" text,
	"release_year" text,
	"scale" text,
	"is_purchasable" boolean DEFAULT true,
	CONSTRAINT "works_category_check" CHECK (category = ANY (ARRAY['anime'::text, 'manga'::text, 'other'::text])),
	CONSTRAINT "works_status_check" CHECK (status = ANY (ARRAY['public'::text, 'pending'::text, 'private'::text])),
	CONSTRAINT "works_scale_check" CHECK (scale = ANY (ARRAY['half_day'::text, 'one_day'::text, 'one_week'::text, 'one_month'::text, 'one_cour'::text, 'long_term'::text]))
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alliances" ADD CONSTRAINT "alliances_profile_a_id_fkey" FOREIGN KEY ("profile_a_id") REFERENCES "public"."user_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alliances" ADD CONSTRAINT "alliances_profile_b_id_fkey" FOREIGN KEY ("profile_b_id") REFERENCES "public"."user_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_cards" ADD CONSTRAINT "business_cards_user_profile_id_fkey" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follows" ADD CONSTRAINT "follows_follower_profile_id_fkey" FOREIGN KEY ("follower_profile_id") REFERENCES "public"."user_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follows" ADD CONSTRAINT "follows_followed_profile_id_fkey" FOREIGN KEY ("followed_profile_id") REFERENCES "public"."user_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_members" ADD CONSTRAINT "group_members_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_members" ADD CONSTRAINT "group_members_user_profile_id_fkey" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "groups" ADD CONSTRAINT "groups_leader_id_fkey" FOREIGN KEY ("leader_id") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "market_items" ADD CONSTRAINT "market_items_nation_id_fkey" FOREIGN KEY ("nation_id") REFERENCES "public"."nations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "market_items" ADD CONSTRAINT "market_items_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "public"."user_profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "market_items" ADD CONSTRAINT "market_items_seller_group_id_fkey" FOREIGN KEY ("seller_group_id") REFERENCES "public"."groups"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "market_transactions" ADD CONSTRAINT "market_transactions_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "public"."market_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "market_transactions" ADD CONSTRAINT "market_transactions_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "market_transactions" ADD CONSTRAINT "market_transactions_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nation_citizens" ADD CONSTRAINT "nation_citizens_nation_id_fkey" FOREIGN KEY ("nation_id") REFERENCES "public"."nations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nation_citizens" ADD CONSTRAINT "nation_citizens_user_profile_id_fkey" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nation_event_participants" ADD CONSTRAINT "nation_event_participants_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."nation_events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nation_event_participants" ADD CONSTRAINT "nation_event_participants_user_profile_id_fkey" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nation_events" ADD CONSTRAINT "nation_events_nation_id_fkey" FOREIGN KEY ("nation_id") REFERENCES "public"."nations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nation_events" ADD CONSTRAINT "nation_events_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nation_groups" ADD CONSTRAINT "nation_groups_nation_id_fkey" FOREIGN KEY ("nation_id") REFERENCES "public"."nations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nation_groups" ADD CONSTRAINT "nation_groups_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nation_posts" ADD CONSTRAINT "nation_posts_nation_id_fkey" FOREIGN KEY ("nation_id") REFERENCES "public"."nations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nation_posts" ADD CONSTRAINT "nation_posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."user_profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nation_posts" ADD CONSTRAINT "nation_posts_author_group_id_fkey" FOREIGN KEY ("author_group_id") REFERENCES "public"."groups"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nations" ADD CONSTRAINT "nations_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nations" ADD CONSTRAINT "nations_owner_group_id_fkey" FOREIGN KEY ("owner_group_id") REFERENCES "public"."groups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_profile_id_fkey" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "point_transactions" ADD CONSTRAINT "point_transactions_root_account_id_fkey" FOREIGN KEY ("root_account_id") REFERENCES "public"."root_accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "root_accounts" ADD CONSTRAINT "root_accounts_auth_user_id_fkey" FOREIGN KEY ("auth_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_root_account_id_fkey" FOREIGN KEY ("root_account_id") REFERENCES "public"."root_accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_work_entries" ADD CONSTRAINT "user_work_entries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_work_entries" ADD CONSTRAINT "user_work_entries_work_id_fkey" FOREIGN KEY ("work_id") REFERENCES "public"."works"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_work_ratings" ADD CONSTRAINT "user_work_ratings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_work_ratings" ADD CONSTRAINT "user_work_ratings_work_id_fkey" FOREIGN KEY ("work_id") REFERENCES "public"."works"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "works" ADD CONSTRAINT "works_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_alliances_profile_a" ON "alliances" USING btree ("profile_a_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_alliances_profile_b" ON "alliances" USING btree ("profile_b_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "business_cards_user_profile_id_idx" ON "business_cards" USING btree ("user_profile_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_follows_followed_profile" ON "follows" USING btree ("followed_profile_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_follows_follower_profile" ON "follows" USING btree ("follower_profile_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_notifications_user_profile_id_is_read" ON "notifications" USING btree ("user_profile_id" bool_ops,"is_read" bool_ops);--> statement-breakpoint
CREATE INDEX "idx_point_transactions_root_account" ON "point_transactions" USING btree ("root_account_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_user_profiles_root_account_id" ON "user_profiles" USING btree ("root_account_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_user_work_entries_user_work" ON "user_work_entries" USING btree ("user_id" uuid_ops,"work_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_user_work_ratings_user_work" ON "user_work_ratings" USING btree ("user_id" uuid_ops,"work_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_works_owner_status" ON "works" USING btree ("owner_user_id" text_ops,"status" text_ops);