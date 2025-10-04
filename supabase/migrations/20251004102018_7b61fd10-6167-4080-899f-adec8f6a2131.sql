-- Update the handle_new_user function to create a default dashboard and link the example tile to it
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  new_dashboard_id uuid;
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (user_id, email)
  VALUES (NEW.id, NEW.email);

  -- Create default dashboard for new user
  INSERT INTO public.dashboards (user_id, name)
  VALUES (NEW.id, 'Default Dashboard')
  RETURNING id INTO new_dashboard_id;

  -- Create default example tile linked to the dashboard
  INSERT INTO public.tiles (user_id, title, content, color, order_index, dashboard_id)
  VALUES (
    NEW.id,
    'Example',
    'Hey, you just copied your first tile! You can add more tiles with custom text and images to make your repeating work/answers/messages way more easy to copy-paste.',
    'blue',
    0,
    new_dashboard_id
  );

  RETURN NEW;
END;
$$;