-- Fix the share_token generation issue by using hex encoding instead of base64url
-- First, create a function to generate URL-safe tokens
CREATE OR REPLACE FUNCTION public.generate_share_token()
RETURNS text
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'hex');
END;
$$;

-- Update the shared_collections table to use the new function
ALTER TABLE public.shared_collections 
  ALTER COLUMN share_token SET DEFAULT public.generate_share_token();