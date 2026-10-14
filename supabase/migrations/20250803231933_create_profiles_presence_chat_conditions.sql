-- Create user profiles table in api schema
CREATE TABLE api.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE api.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view all profiles" ON api.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON api.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON api.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Create course presence table for real-time user locations
CREATE TABLE api.course_presence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id INTEGER REFERENCES api.disc_golf_courses(id) ON DELETE CASCADE,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_active BOOLEAN DEFAULT true,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Enable RLS on course presence
ALTER TABLE api.course_presence ENABLE ROW LEVEL SECURITY;

-- Create policies for course presence
CREATE POLICY "Users can view presence at courses" ON api.course_presence FOR SELECT USING (true);
CREATE POLICY "Users can manage own presence" ON api.course_presence FOR ALL USING (auth.uid() = user_id);

-- Create course chat table
CREATE TABLE api.course_chat (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id INTEGER REFERENCES api.disc_golf_courses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  emoji_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on course chat
ALTER TABLE api.course_chat ENABLE ROW LEVEL SECURITY;

-- Create policies for course chat
CREATE POLICY "Users can view course chat messages" ON api.course_chat FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert chat messages" ON api.course_chat FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own chat messages" ON api.course_chat FOR DELETE USING (auth.uid() = user_id);

-- Create course conditions table for crowdsourced updates
CREATE TABLE api.course_conditions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id INTEGER REFERENCES api.disc_golf_courses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  condition_type TEXT NOT NULL CHECK (condition_type IN ('muddy', 'wet', 'dry', 'icy', 'well_maintained', 'needs_maintenance')),
  description TEXT,
  severity INTEGER CHECK (severity BETWEEN 1 AND 5) DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on course conditions
ALTER TABLE api.course_conditions ENABLE ROW LEVEL SECURITY;

-- Create policies for course conditions
CREATE POLICY "Users can view course conditions" ON api.course_conditions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can report conditions" ON api.course_conditions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own condition reports" ON api.course_conditions FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_course_presence_course_id ON api.course_presence(course_id);
CREATE INDEX idx_course_presence_user_id ON api.course_presence(user_id);
CREATE INDEX idx_course_presence_last_seen ON api.course_presence(last_seen);
CREATE INDEX idx_course_chat_course_id ON api.course_chat(course_id);
CREATE INDEX idx_course_chat_created_at ON api.course_chat(created_at);
CREATE INDEX idx_course_conditions_course_id ON api.course_conditions(course_id);
CREATE INDEX idx_course_conditions_created_at ON api.course_conditions(created_at);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION api.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for profiles table
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON api.profiles
  FOR EACH ROW
  EXECUTE FUNCTION api.update_updated_at_column();

-- Create function to handle new user registration
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION api.handle_new_user();

-- Create function to clean up old presence data
CREATE OR REPLACE FUNCTION api.cleanup_old_presence()
RETURNS void AS $$
BEGIN
  DELETE FROM api.course_presence 
  WHERE last_seen < NOW() - INTERVAL '1 hour' OR is_active = false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;