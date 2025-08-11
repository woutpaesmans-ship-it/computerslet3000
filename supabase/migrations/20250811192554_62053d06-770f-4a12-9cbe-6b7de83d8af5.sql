-- Fix the search_path security issue by updating the function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email)
  VALUES (NEW.id, NEW.email);

  -- Create default tile for new users
  INSERT INTO public.tiles (user_id, title, content, color, order_index)
  VALUES (
    NEW.id,
    'Example',
    'Hey, you just copied your first tile! You can add more tiles with custom text and images to make your repeating work/answers/messages way more easy to copy-paste.',
    'blue',
    0
  );

  RETURN NEW;
END;
$$;