-- Drop existing policies
DROP POLICY "Allow public read access to disc golf courses" ON public.disc_golf_courses;
DROP POLICY "Disc golf courses are viewable by everyone" ON public.disc_golf_courses;

-- Create a single, consolidated policy
CREATE POLICY "Public can view disc golf courses" 
ON public.disc_golf_courses 
FOR SELECT 
TO anon 
USING (true);