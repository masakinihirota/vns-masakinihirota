-- CREATE TABLE IF NOT EXISTS public.template (
CREATE TABLE public.template (
  id UUID PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
