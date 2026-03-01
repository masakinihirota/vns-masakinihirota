ALTER TABLE "nation_citizens" DROP CONSTRAINT IF EXISTS "nation_citizens_role_check";--> statement-breakpoint
ALTER TABLE "nation_citizens" ADD CONSTRAINT "nation_citizens_role_check" CHECK (role = ANY (ARRAY['official'::text, 'citizen'::text, 'governor'::text]));
