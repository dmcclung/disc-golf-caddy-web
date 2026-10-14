-- Drop existing policy first
DROP POLICY "Public can view disc golf courses" ON public.disc_golf_courses;

-- Create api schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS api;

-- Move the table from public to api schema
ALTER TABLE public.disc_golf_courses SET SCHEMA api;

-- Create policy for the table in api schema
CREATE POLICY "Public can view disc golf courses" 
ON api.disc_golf_courses 
FOR SELECT 
TO anon 
USING (true);