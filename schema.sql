/**
* USERS
* Note: This table contains user data. Users should only be able to view and update their own data.
-- ja ここにはユーザーデータが含まれています。ユーザーは自分のデータのみを表示および更新できるようにする必要があります。
*/
create table users (
  -- UUID from auth.users
  id uuid references auth.users not null primary key,
  full_name text,
  avatar_url text,
  -- The customer's billing address, stored in JSON format.
  billing_address jsonb,
  -- ja: 顧客の請求先住所、JSON形式で保存されます。
  -- Stores your customer's payment instruments.
  -- ja お客様の支払い手段を保存します。
  payment_method jsonb
);
alter table users enable row level security;
create policy "Can view own user data." on users for select using (auth.uid() = id);
create policy "Can update own user data." on users for update using (auth.uid() = id);

/**
* This trigger automatically creates a user entry when a new user signs up via Supabase Auth.
-- ja このトリガーは、新しいユーザーがSupabase Authを介してサインアップすると、自動的にユーザーエントリを作成します。
*/
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

/**
* CUSTOMERS
* Note: this is a private table that contains a mapping of user IDs to Stripe customer IDs.
-- ja これは、ユーザーIDとStripe顧客IDのマッピングを含むプライベートテーブルです。
*/
create table customers (
  -- UUID from auth.users
  id uuid references auth.users not null primary key,
  -- The user's customer ID in Stripe. User must not be able to update this.
  -- ja Stripeのユーザーの顧客ID。ユーザーはこれを更新できないようにする必要があります。
  stripe_customer_id text
);
alter table customers enable row level security;
-- No policies as this is a private table that the user must not have access to.
-- ja これはユーザーがアクセスできないプライベートテーブルです。

/**
* PRODUCTS
* Note: products are created and managed in Stripe and synced to our DB via Stripe webhooks.
-- ja 製品はStripeで作成および管理され、Stripe Webhookを介してDBに同期されます。
*/
create table products (
  -- Product ID from Stripe, e.g. prod_1234.
  id text primary key,
  -- Whether the product is currently available for purchase.
  -- ja 製品が現在購入可能かどうか。
  active boolean,
  -- The product's name, meant to be displayable to the customer. Whenever this product is sold via a subscription, name will show up on associated invoice line item descriptions.
  -- ja 顧客に表示可能な製品名。この製品がサブスクリプション経由で販売される場合、名前は関連する請求書の行項目の説明に表示されます。
  name text,
  -- The product's description, meant to be displayable to the customer. Use this field to optionally store a long form explanation of the product being sold for your own rendering purposes.
  -- ja 顧客に表示可能な製品の説明。このフィールドを使用して、販売されている製品の長い形式の説明をオプションで保存し、自分のレンダリング目的に使用します。
  description text,
  -- A URL of the product image in Stripe, meant to be displayable to the customer.
  -- ja 顧客に表示可能なStripeの製品画像のURL。
  image text,
  -- Set of key-value pairs, used to store additional information about the object in a structured format.
  -- ja 構造化された形式でオブジェクトに関する追加情報を保存するために使用されるキーと値のセット。
  metadata jsonb
);
alter table products enable row level security;
create policy "Allow public read-only access." on products for select using (true);

/**
* PRICES
* Note: prices are created and managed in Stripe and synced to our DB via Stripe webhooks.
-- ja 価格はStripeで作成および管理され、Stripe Webhookを介してDBに同期されます。
*/
create type pricing_type as enum ('one_time', 'recurring');
create type pricing_plan_interval as enum ('day', 'week', 'month', 'year');
create table prices (
  -- Price ID from Stripe, e.g. price_1234.
  id text primary key,
  -- The ID of the prduct that this price belongs to.
  product_id text references products,
  -- Whether the price can be used for new purchases.
  active boolean,
  -- A brief description of the price.
  description text,
  -- The unit amount as a positive integer in the smallest currency unit (e.g., 100 cents for US$1.00 or 100 for ¥100, a zero-decimal currency).
  unit_amount bigint,
  -- Three-letter ISO currency code, in lowercase.
  currency text check (char_length(currency) = 3),
  -- One of `one_time` or `recurring` depending on whether the price is for a one-time purchase or a recurring (subscription) purchase.
  type pricing_type,
  -- The frequency at which a subscription is billed. One of `day`, `week`, `month` or `year`.
  interval pricing_plan_interval,
  -- The number of intervals (specified in the `interval` attribute) between subscription billings. For example, `interval=month` and `interval_count=3` bills every 3 months.
  interval_count integer,
  -- Default number of trial days when subscribing a customer to this price using [`trial_from_plan=true`](https://stripe.com/docs/api#create_subscription-trial_from_plan).
  trial_period_days integer,
  -- Set of key-value pairs, used to store additional information about the object in a structured format.
  metadata jsonb
);
alter table prices enable row level security;
create policy "Allow public read-only access." on prices for select using (true);

/**
* SUBSCRIPTIONS
* Note: subscriptions are created and managed in Stripe and synced to our DB via Stripe webhooks.
-- ja サブスクリプションはStripeで作成および管理され、Stripe Webhookを介してDBに同期されます。
*/
create type subscription_status as enum ('trialing', 'active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'unpaid', 'paused');
create table subscriptions (
  -- Subscription ID from Stripe, e.g. sub_1234.
  id text primary key,
  user_id uuid references auth.users not null,
  -- The status of the subscription object, one of subscription_status type above.
  -- ja サブスクリプションオブジェクトのステータス、上記のsubscription_statusタイプのいずれか。
  status subscription_status,
  -- Set of key-value pairs, used to store additional information about the object in a structured format.
  -- ja 構造化された形式でオブジェクトに関する追加情報を保存するために使用されるキーと値のセット。
  metadata jsonb,
  -- ID of the price that created this subscription.
  -- ja このサブスクリプションを作成した価格のID。
  price_id text references prices,
  -- Quantity multiplied by the unit amount of the price creates the amount of the subscription. Can be used to charge multiple seats.
  -- ja 価格の単価に数量を掛けると、サブスクリプションの金額が作成されます。複数のシートを請求するために使用できます。
  quantity integer,
  -- If true the subscription has been canceled by the user and will be deleted at the end of the billing period.
  -- ja trueの場合、ユーザーによってサブスクリプションがキャンセルされ、請求期間の終了時に削除されます。
  cancel_at_period_end boolean,
  -- Time at which the subscription was created.
  -- ja サブスクリプションが作成された時刻。
  created timestamp with time zone default timezone('utc'::text, now()) not null,
  -- Start of the current period that the subscription has been invoiced for.
  -- ja サブスクリプションが請求された現在の期間の開始。
  current_period_start timestamp with time zone default timezone('utc'::text, now()) not null,
  -- End of the current period that the subscription has been invoiced for. At the end of this period, a new invoice will be created.
  -- ja サブスクリプションが請求された現在の期間の終了。この期間の終わりに、新しい請求書が作成されます。
  current_period_end timestamp with time zone default timezone('utc'::text, now()) not null,
  -- If the subscription has ended, the timestamp of the date the subscription ended.
  -- ja サブスクリプションが終了した場合、サブスクリプションが終了した日付のタイムスタンプ。
  ended_at timestamp with time zone default timezone('utc'::text, now()),
  -- A date in the future at which the subscription will automatically get canceled.
  -- ja サブスクリプションが自動的にキャンセルされる未来の日付。
  cancel_at timestamp with time zone default timezone('utc'::text, now()),
  -- If the subscription has been canceled, the date of that cancellation. If the subscription was canceled with `cancel_at_period_end`, `canceled_at` will still reflect the date of the initial cancellation request, not the end of the subscription period when the subscription is automatically moved to a canceled state.
  -- ja: サブスクリプションがキャンセルされた場合、そのキャンセルの日付。サブスクリプションが`cancel_at_period_end`でキャンセルされた場合、`canceled_at`はサブスクリプションが自動的にキャンセルされた状態に移動されるサブスクリプション期間の終了日ではなく、初期のキャンセルリクエストの日付を引き続き反映します。

  canceled_at timestamp with time zone default timezone('utc'::text, now()),
  -- If the subscription has a trial, the beginning of that trial.
  -- ja サブスクリプションにトライアルがある場合、そのトライアルの開始。
  trial_start timestamp with time zone default timezone('utc'::text, now()),
  -- If the subscription has a trial, the end of that trial.
  -- ja サブスクリプションにトライアルがある場合、そのトライアルの終了。
  trial_end timestamp with time zone default timezone('utc'::text, now())
);
alter table subscriptions enable row level security;
create policy "Can only view own subs data." on subscriptions for select using (auth.uid() = user_id);

/**
 * REALTIME SUBSCRIPTIONS
--  リアルタイムサブスクリプション
 * Only allow realtime listening on public tables.
  * ja パブリックテーブルでのリアルタイムリスニングのみを許可します。
 */
drop publication if exists supabase_realtime;
create publication supabase_realtime for table products, prices;
