-- Fix security warnings by setting search_path for functions

-- Update the update_updated_at_column function with proper search_path
CREATE OR REPLACE FUNCTION api.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = api, public;

-- Update the handle_new_user function with proper search_path
CREATE OR REPLACE FUNCTION api.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO api.profiles (id, username, full_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = api, public;

-- Update the cleanup_old_presence function with proper search_path
CREATE OR REPLACE FUNCTION api.cleanup_old_presence()
RETURNS void AS $$
BEGIN
  DELETE FROM api.course_presence 
  WHERE last_seen < NOW() - INTERVAL '1 hour' OR is_active = false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = api, public;