-- FitMind AI Database Setup Script
-- Complete schema with tables, RLS policies, and triggers

-- 1. CLEANUP (Optional - only if you want to reset)
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- DROP FUNCTION IF EXISTS public.handle_new_user();
-- DROP TABLE IF EXISTS public.chat_messages;
-- DROP TABLE IF EXISTS public.daily_goals;
-- DROP TABLE IF EXISTS public.weight_history;
-- DROP TABLE IF EXISTS public.meals;
-- DROP TABLE IF EXISTS public.workouts;
-- DROP TABLE IF EXISTS public.profiles;

-- 2. TABLES

-- Profiles table (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  age INTEGER,
  weight DECIMAL(5,2),
  height DECIMAL(5,2),
  goal TEXT CHECK (goal IN ('lose_weight', 'gain_muscle', 'maintain', 'endurance')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workouts table
CREATE TABLE IF NOT EXISTS public.workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('gym', 'home', 'outdoor', 'cardio', 'strength', 'flexibility')),
  duration_minutes INTEGER,
  calories_burned INTEGER,
  exercises JSONB,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Meals table
CREATE TABLE IF NOT EXISTS public.meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  calories INTEGER,
  protein DECIMAL(5,2),
  carbs DECIMAL(5,2),
  fat DECIMAL(5,2),
  foods JSONB,
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Weight history table
CREATE TABLE IF NOT EXISTS public.weight_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  weight DECIMAL(5,2) NOT NULL,
  logged_at DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily goals table
CREATE TABLE IF NOT EXISTS public.daily_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE DEFAULT CURRENT_DATE,
  calorie_goal INTEGER DEFAULT 2000,
  protein_goal INTEGER DEFAULT 150,
  workout_goal INTEGER DEFAULT 1,
  water_goal INTEGER DEFAULT 8,
  calories_consumed INTEGER DEFAULT 0,
  protein_consumed INTEGER DEFAULT 0,
  workouts_completed INTEGER DEFAULT 0,
  water_consumed INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Chat messages table for AI fitness coach
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ENABLE RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weight_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- 4. RLS POLICIES

-- Profiles policies
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Workouts policies
CREATE POLICY "workouts_select_own" ON public.workouts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "workouts_insert_own" ON public.workouts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "workouts_update_own" ON public.workouts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "workouts_delete_own" ON public.workouts FOR DELETE USING (auth.uid() = user_id);

-- Meals policies
CREATE POLICY "meals_select_own" ON public.meals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "meals_insert_own" ON public.meals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "meals_update_own" ON public.meals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "meals_delete_own" ON public.meals FOR DELETE USING (auth.uid() = user_id);

-- Weight history policies
CREATE POLICY "weight_history_select_own" ON public.weight_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "weight_history_insert_own" ON public.weight_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "weight_history_update_own" ON public.weight_history FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "weight_history_delete_own" ON public.weight_history FOR DELETE USING (auth.uid() = user_id);

-- Daily goals policies
CREATE POLICY "daily_goals_select_own" ON public.daily_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "daily_goals_insert_own" ON public.daily_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "daily_goals_update_own" ON public.daily_goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "daily_goals_delete_own" ON public.daily_goals FOR DELETE USING (auth.uid() = user_id);

-- Chat messages policies
CREATE POLICY "chat_messages_select_own" ON public.chat_messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "chat_messages_insert_own" ON public.chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "chat_messages_delete_own" ON public.chat_messages FOR DELETE USING (auth.uid() = user_id);

-- 5. TRIGGERS

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'name', NULL),
    new.email
  )
  ON CONFLICT (id) DO NOTHING;

  -- Create default daily goals for the new user
  INSERT INTO public.daily_goals (user_id, date)
  VALUES (new.id, CURRENT_DATE)
  ON CONFLICT (user_id, date) DO NOTHING;

  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
