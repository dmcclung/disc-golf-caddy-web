-- Enable RLS on disc_golf_courses table
ALTER TABLE public.disc_golf_courses ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to disc golf courses
CREATE POLICY "Allow public read access to disc golf courses" 
ON public.disc_golf_courses 
FOR SELECT 
USING (true);