-- Drop the overly permissive public SELECT policy
DROP POLICY IF EXISTS "Public can view shared collections by token" ON public.shared_collections;

-- Create a secure function to get shared collection by token
CREATE OR REPLACE FUNCTION public.get_shared_collection_by_token(p_share_token text)
RETURNS TABLE (
  id uuid,
  name text,
  tiles_data jsonb,
  created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only return the collection if the token matches and it hasn't expired
  RETURN QUERY
  SELECT 
    sc.id,
    sc.name,
    sc.tiles_data,
    sc.created_at
  FROM public.shared_collections sc
  WHERE sc.share_token = p_share_token
    AND (sc.expires_at IS NULL OR sc.expires_at > now())
  LIMIT 1;
END;
$$;

-- Grant execute permission to anonymous and authenticated users
GRANT EXECUTE ON FUNCTION public.get_shared_collection_by_token(text) TO anon, authenticated;