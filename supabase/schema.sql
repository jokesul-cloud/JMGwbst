-- Profiles table for users
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Series (Courses) table
CREATE TABLE series (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  trailer_url TEXT,
  price_cents INTEGER NOT NULL, -- Price in cents for one-time purchase
  category TEXT, -- Swing Mechanics, Short Game, etc.
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Videos table
CREATE TABLE videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  series_id UUID REFERENCES series(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  position INTEGER NOT NULL, -- Order in the series
  duration_seconds INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Subscriptions table (Stripe integration)
CREATE TABLE subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  stripe_subscription_id TEXT UNIQUE,
  status TEXT, -- active, trialing, past_due, canceled
  price_id TEXT,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Purchases table (Individual series purchases)
CREATE TABLE purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  series_id UUID REFERENCES series(id) ON DELETE CASCADE NOT NULL,
  stripe_checkout_id TEXT UNIQUE,
  amount_paid_cents INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, series_id)
);

-- Coach Messages table (Feedback system)
CREATE TABLE coach_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  coach_id UUID REFERENCES auth.users ON DELETE SET NULL, -- if multiple coaches
  content TEXT,
  video_url TEXT, -- User's uploaded swing or Coach's reply video
  is_from_coach BOOLEAN DEFAULT FALSE,
  parent_id UUID REFERENCES coach_messages(id) ON DELETE CASCADE, -- For threading
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE series ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_messages ENABLE ROW LEVEL SECURITY;

-- Policies
-- Profiles: Users can read their own profile, anyone can read basic profile info (if needed)
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Series: Anyone can read published series
CREATE POLICY "Anyone can view published series" ON series FOR SELECT USING (is_published = true);

-- Videos: Only users who have purchased the series or have an active subscription can view videos
-- This is a bit more complex, might need a function or separate check in the app logic, but for proof of concept:
CREATE POLICY "Subscribers or purchasers can view videos" ON videos FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM subscriptions WHERE user_id = auth.uid() AND status = 'active'
  ) OR EXISTS (
    SELECT 1 FROM purchases WHERE user_id = auth.uid() AND series_id = (SELECT series_id FROM videos v WHERE v.id = videos.id)
  )
);

-- Subscriptions: Users can read their own subscriptions
CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = user_id);

-- Purchases: Users can read their own purchases
CREATE POLICY "Users can view own purchases" ON purchases FOR SELECT USING (auth.uid() = user_id);

-- Coach Messages: Users can read their own threads
CREATE POLICY "Users can view own messages" ON coach_messages FOR SELECT USING (auth.uid() = user_id OR auth.uid() = coach_id);
CREATE POLICY "Users can send messages" ON coach_messages FOR INSERT WITH CHECK (auth.uid() = user_id);
