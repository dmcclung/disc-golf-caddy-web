-- Make disc_golf_courses readable by both anon and authenticated users

-- Ensure schema exists (no-op if already present)
CREATE SCHEMA IF NOT EXISTS api;

-- Enable RLS (no-op if already enabled)
ALTER TABLE IF EXISTS api.disc_golf_courses ENABLE ROW LEVEL SECURITY;

-- Drop any existing read policies that might conflict
DROP POLICY IF EXISTS "Public can view disc golf courses" ON api.disc_golf_courses;
DROP POLICY IF EXISTS "Disc golf courses are viewable by everyone" ON api.disc_golf_courses;

-- Create a unified policy allowing both anon and authenticated roles to read
CREATE POLICY "Disc golf courses viewable by all roles"
ON api.disc_golf_courses
FOR SELECT
TO anon, authenticated
USING (true);


