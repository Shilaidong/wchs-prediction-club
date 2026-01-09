-- Users table (extends Supabase Auth)
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- User Points
CREATE TABLE public.user_points (
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE PRIMARY KEY,
  current_points INTEGER DEFAULT 500,
  total_earned INTEGER DEFAULT 500,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Topics
CREATE TABLE public.topics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'HOT', 'SPORTS', 'CAMPUS'
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'active', -- 'active', 'closed', 'settled'
  result_value TEXT, -- The winning outcome
  pool_size INTEGER DEFAULT 0,
  participant_count INTEGER DEFAULT 0,
  image_url TEXT,
  created_by UUID REFERENCES public.user_profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Predictions
CREATE TABLE public.predictions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  topic_id UUID REFERENCES public.topics(id) ON DELETE CASCADE NOT NULL,
  prediction_value TEXT NOT NULL,
  wager INTEGER DEFAULT 0,
  points_earned INTEGER DEFAULT 0,
  is_correct BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, topic_id)
);

-- Point Transactions
CREATE TABLE public.point_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL, -- 'initial', 'prediction', 'win', 'redeem'
  amount INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Rewards
CREATE TABLE public.rewards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  cost INTEGER NOT NULL,
  description TEXT,
  image_url TEXT,
  remaining INTEGER DEFAULT 10,
  status TEXT DEFAULT 'active'
);

-- Redemptions
CREATE TABLE public.redemptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) NO DELETE CASCADE NOT NULL,
  reward_id UUID REFERENCES public.rewards(id),
  status TEXT DEFAULT 'pending', -- 'pending', 'fulfilled'
  code TEXT, -- Gift card code
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger to create user_profile and user_points after auth.users signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  
  INSERT INTO public.user_points (user_id, current_points)
  VALUES (new.id, 500);
  
  INSERT INTO public.point_transactions (user_id, type, amount, description)
  VALUES (new.id, 'initial', 500, 'Welcome Bonus');
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Policies (RLS) - Basic Safety
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read topics and rewards
CREATE POLICY "Public read topics" ON public.topics FOR SELECT USING (true);
CREATE POLICY "Public read rewards" ON public.rewards FOR SELECT USING (true);

-- Users can read their own data
CREATE POLICY "Users can read own profile" ON public.user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can read own points" ON public.user_points FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can read own predictions" ON public.predictions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can read own transactions" ON public.point_transactions FOR SELECT USING (auth.uid() = user_id);

-- Users can insert predictions (if authenticated)
CREATE POLICY "Users can predict" ON public.predictions FOR INSERT WITH CHECK (auth.uid() = user_id);
-- Setup initial data
INSERT INTO public.rewards (name, cost, description, remaining) VALUES
('Starbucks $5 Card', 2000, 'Redeem for a $5 Starbucks Gift Card. Valid at all locations.', 20),
('Starbucks $10 Card', 3500, 'Redeem for a $10 Starbucks Gift Card.', 10);

INSERT INTO public.topics (title, category, end_time, description, participant_count) VALUES
('Will school be closed tomorrow due to snow?', 'Immediate Heat', NOW() + INTERVAL '1 day', 'Heavy snow is forecasted. Will WCHS close?', 120),
('Varsity Basketball vs. Wootton', 'Varsity Glory', NOW() + INTERVAL '3 days', 'Predict the winner of the Friday night game.', 85);
