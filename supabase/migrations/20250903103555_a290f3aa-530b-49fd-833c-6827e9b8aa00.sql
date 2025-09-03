-- Create dashboards table for multiple dashboard support
CREATE TABLE public.dashboards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL DEFAULT 'Default Dashboard',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.dashboards ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own dashboards" 
ON public.dashboards 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own dashboards" 
ON public.dashboards 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own dashboards" 
ON public.dashboards 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own dashboards" 
ON public.dashboards 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add dashboard_id to tiles table
ALTER TABLE public.tiles ADD COLUMN dashboard_id UUID REFERENCES public.dashboards(id) ON DELETE CASCADE;

-- Create shared_collections table for shareable links
CREATE TABLE public.shared_collections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  share_token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'base64url'),
  tiles_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.shared_collections ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own shared collections" 
ON public.shared_collections 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create shared collections" 
ON public.shared_collections 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own shared collections" 
ON public.shared_collections 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own shared collections" 
ON public.shared_collections 
FOR DELETE 
USING (auth.uid() = user_id);

-- Policy for public access to shared collections
CREATE POLICY "Public can view shared collections by token" 
ON public.shared_collections 
FOR SELECT 
USING (true);

-- Create function to migrate existing tiles to default dashboard
CREATE OR REPLACE FUNCTION public.migrate_tiles_to_default_dashboard()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create default dashboards for all users who have tiles but no dashboards
  INSERT INTO public.dashboards (user_id, name)
  SELECT DISTINCT user_id, 'Default Dashboard'
  FROM public.tiles
  WHERE user_id NOT IN (SELECT user_id FROM public.dashboards);
  
  -- Update tiles to reference their user's default dashboard
  UPDATE public.tiles 
  SET dashboard_id = d.id
  FROM public.dashboards d
  WHERE tiles.user_id = d.user_id 
    AND tiles.dashboard_id IS NULL
    AND d.name = 'Default Dashboard';
END;
$$;

-- Run the migration
SELECT public.migrate_tiles_to_default_dashboard();

-- Add triggers for automatic timestamp updates
CREATE TRIGGER update_dashboards_updated_at
BEFORE UPDATE ON public.dashboards
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();