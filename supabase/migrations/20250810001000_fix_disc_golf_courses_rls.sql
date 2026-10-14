-- Ensure the disc_golf_courses table is readable by both anon and authenticated roles

CREATE SCHEMA IF NOT EXISTS api;
ALTER TABLE IF EXISTS api.disc_golf_courses ENABLE ROW LEVEL SECURITY;

-- Remove prior read policies if they exist
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policy p
    WHERE p.polrelid = 'api.disc_golf_courses'::regclass
      AND p.polcmd = 'r'
      AND p.polname IN (
        'Public can view disc golf courses',
        'Disc golf courses are viewable by everyone',
        'Disc golf courses viewable by all roles'
      )
  ) THEN
    BEGIN
      EXECUTE 'DROP POLICY IF EXISTS "Public can view disc golf courses" ON api.disc_golf_courses';
      EXECUTE 'DROP POLICY IF EXISTS "Disc golf courses are viewable by everyone" ON api.disc_golf_courses';
      EXECUTE 'DROP POLICY IF EXISTS "Disc golf courses viewable by all roles" ON api.disc_golf_courses';
    EXCEPTION WHEN undefined_object THEN
      -- Ignore if already dropped
      NULL;
    END;
  END IF;
END $$;

-- Create unified read policy for both roles
CREATE POLICY "Disc golf courses readable by anon and authenticated"
ON api.disc_golf_courses
FOR SELECT
TO anon, authenticated
USING (true);


