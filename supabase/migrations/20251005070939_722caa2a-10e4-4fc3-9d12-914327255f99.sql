-- Ensure pgcrypto extension is enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Fix generate_share_token to use a method that always works
CREATE OR REPLACE FUNCTION public.generate_share_token()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Use gen_random_uuid() which is always available, remove hyphens for a clean token
  RETURN replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', '');
END;
$$;