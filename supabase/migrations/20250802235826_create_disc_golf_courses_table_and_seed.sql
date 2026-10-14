-- Create disc golf courses table
CREATE TABLE public.disc_golf_courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT,
  country TEXT NOT NULL DEFAULT 'United States',
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  contact_info JSONB,
  established INTEGER,
  designer TEXT,
  classification TEXT,
  rating DECIMAL(2,1),
  holes INTEGER NOT NULL,
  configs TEXT,
  length JSONB,
  par INTEGER,
  tees JSONB,
  targets JSONB,
  property JSONB,
  services TEXT,
  description TEXT,
  directions TEXT,
  elevation TEXT,
  foliage TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.disc_golf_courses ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Disc golf courses are viewable by everyone" 
ON public.disc_golf_courses 
FOR SELECT 
USING (true);

-- Insert the provided course data
INSERT INTO public.disc_golf_courses (name, city, state, postal_code, country, latitude, longitude, contact_info, established, designer, classification, rating, holes, configs, length, par, tees, targets, property, services, description, directions, elevation, foliage) VALUES
('Griffin Park', 'Norman', 'Oklahoma', '73071', 'United States', 35.239, -97.426, '{"phone": "405-326-5454"}', 1998, 'Local Disc Golf Community', 'Amateur', 4.2, 18, 'Standard', '{"course_length": 6858, "alternate_length": 6181, "hole_length_distribution": {"under_300ft": 5, "300_400ft": 9, "over_400ft": 4}}', 57, '{"tee_type": "Concrete"}', '{"target_type": "Chainstar"}', '{"camping": false, "facilities": false, "pay_to_play": false, "handicap_accessible": false, "private": false, "tee_signs": true}', 'Parking available, dog park nearby', 'Evenly balanced with good variety. Starts off open, then becomes technical. Great for all skill levels.', 'I-35; east on Robinson to a left on 12th St. (past 1st park entrance), 0.25 mile to a left into Griffin Park (after the 1st light). Follow road to parking lot.', '50/50 Flat/Hills', 'Mixed - Trees/Open'),

('Ruby Grant Park Disc Golf Course', 'Norman', 'Oklahoma', '73072', 'United States', 35.192, -97.498, '{"phone": "405-366-5470"}', 2020, 'City of Norman Parks', 'Championship', 4.3, 18, 'Multiple layouts', '{"course_length": 7200, "alternate_length": 6500, "hole_length_distribution": {"under_300ft": 4, "300_400ft": 10, "over_400ft": 4}}', 60, '{"tee_type": "Turf"}', '{"target_type": "DISCatcher Pro"}', '{"camping": false, "facilities": true, "pay_to_play": false, "handicap_accessible": true, "private": false, "tee_signs": true}', 'Restrooms, water fountains, picnic areas', 'Beautiful modern course with funky lines and creative shot shapes. Hosted tournaments and praised for scenic views.', 'From I-35, take Hwy 9 west, then north on 36th Ave NW to park entrance. Course is on the west side of the park.', 'Mostly flat', 'Open with scattered trees'),

('Northeast Lions Park', 'Norman', 'Oklahoma', '73071', 'United States', 35.238, -97.417, '{"phone": "405-366-5470"}', 1972, 'Lions Club', 'Classic', 4.0, 18, 'Standard', '{"course_length": 5500, "alternate_length": null, "hole_length_distribution": {"under_300ft": 10, "300_400ft": 6, "over_400ft": 2}}', 54, '{"tee_type": "Concrete"}', '{"target_type": "Mach V"}', '{"camping": false, "facilities": true, "pay_to_play": false, "handicap_accessible": false, "private": false, "tee_signs": true}', 'Playground, shelters, hosted tournaments', 'One of the oldest courses in Oklahoma, offering a championship-caliber experience with mixed terrain.', 'From downtown Norman, head east on Alameda St, then north on 24th Ave NE to park. Course starts near the pavilion.', 'Hilly', 'Wooded'),

('Colonial Estates Park', 'Norman', 'Oklahoma', '73072', 'United States', 35.207, -97.425, null, 2005, 'Community Volunteers', 'Recreational', 3.8, 9, 'Short layout', '{"course_length": 2500, "alternate_length": null, "hole_length_distribution": {"under_300ft": 7, "300_400ft": 2, "over_400ft": 0}}', 27, '{"tee_type": "Natural"}', '{"target_type": "Chainstar"}', '{"camping": false, "facilities": false, "pay_to_play": false, "handicap_accessible": true, "private": false, "tee_signs": false}', 'Nearby residential area, easy access', 'Compact neighborhood course ideal for beginners and quick rounds. Focuses on accuracy over distance.', 'From I-35, east on Lindsey St to park at 1641 E Lindsey St. Course is in the open park area.', 'Flat', 'Open'),

('The Dragon Disc Golf Course', 'Purcell', 'Oklahoma', '73080', 'United States', 35.021, -97.367, '{"phone": "405-527-3124"}', 2015, 'City of Purcell', 'Intermediate', 4.1, 18, 'Mixed terrain', '{"course_length": 6200, "alternate_length": 5800, "hole_length_distribution": {"under_300ft": 6, "300_400ft": 8, "over_400ft": 4}}', 58, '{"tee_type": "Concrete"}', '{"target_type": "DISCatcher"}', '{"camping": true, "facilities": true, "pay_to_play": false, "handicap_accessible": false, "private": false, "tee_signs": true}', 'Lake access, camping nearby', 'Challenging course with mixed terrain and obstacles around Purcell City Lake. Great for scenic rounds.', 'From Norman, south on I-35 to Purcell exit, then to Purcell City Lake. Course next to the lake.', 'Varied hills', 'Mixed - Trees/Water hazards'),

('Noble Disc Golf Course', 'Noble', 'Oklahoma', '73068', 'United States', 35.139, -97.395, null, 2018, 'PDGA Affiliates', 'Beginner-friendly', 3.9, 9, 'Loop layout', '{"course_length": 2800, "alternate_length": null, "hole_length_distribution": {"under_300ft": 6, "300_400ft": 3, "over_400ft": 0}}', 29, '{"tee_type": "Turf"}', '{"target_type": "Mach III"}', '{"camping": false, "facilities": false, "pay_to_play": false, "handicap_accessible": true, "private": false, "tee_signs": true}', 'Near schools, family-oriented', 'Short and sweet course in a small town park, perfect for casual play and introducing new players.', 'From Norman, south on Hwy 77 to Noble, east on Maguire Rd 0.5 mile to course on right before Hubbard School.', 'Flat', 'Open with light trees');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_disc_golf_courses_updated_at
BEFORE UPDATE ON public.disc_golf_courses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();