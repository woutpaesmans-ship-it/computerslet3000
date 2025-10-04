-- Fix the search_path security warning for generate_share_token function
CREATE OR REPLACE FUNCTION public.generate_share_token()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'hex');
END;
$$;