-- ============================================================
-- FitMind - Complete Database Setup Script
-- Run this entirely in your Supabase SQL Editor
-- ============================================================

-- ============================================================
-- STEP 1: CREATE TABLES
-- ============================================================

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT,
  email       TEXT,
  age         INTEGER,
  weight      NUMERIC(5, 2),
  height      NUMERIC(5, 2),
  goal        TEXT,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- Workouts table
CREATE TABLE IF NOT EXISTS public.workouts (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name              TEXT NOT NULL,
  type              TEXT,
  duration_minutes  INTEGER,
  calories_burned   INTEGER,
  completed         BOOLEAN DEFAULT FALSE,
  completed_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT now()
);

-- Meals table
CREATE TABLE IF NOT EXISTS public.meals (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  meal_type   TEXT,
  calories    INTEGER,
  protein     NUMERIC(6, 2),
  carbs       NUMERIC(6, 2),
  fat         NUMERIC(6, 2),
  logged_at   TIMESTAMPTZ DEFAULT now()
);

-- Weight history table
CREATE TABLE IF NOT EXISTS public.weight_history (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  weight      NUMERIC(5, 2) NOT NULL,
  date        DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Daily goals table
CREATE TABLE IF NOT EXISTS public.daily_goals (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date                DATE NOT NULL DEFAULT CURRENT_DATE,
  calorie_goal        INTEGER DEFAULT 2000,
  protein_goal        INTEGER DEFAULT 150,
  water_goal_ml       INTEGER DEFAULT 2000,
  workout_goal        INTEGER DEFAULT 1,
  calories_consumed   INTEGER DEFAULT 0,
  protein_consumed    NUMERIC(6, 2) DEFAULT 0,
  water_consumed_ml   INTEGER DEFAULT 0,
  workouts_completed  INTEGER DEFAULT 0,
  created_at          TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, date)
);

-- ============================================================
-- STEP 2: AUTO-CREATE PROFILE ON NEW USER SIGN-UP
-- ============================================================

-- This function creates a row in profiles whenever a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Attach the function to the auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- STEP 3: ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weight_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_goals   ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- STEP 4: RLS POLICIES
-- ============================================================

-- profiles: each user can only see and edit their own row
DROP POLICY IF EXISTS "Users can manage their own profile" ON public.profiles;
CREATE POLICY "Users can manage their own profile"
  ON public.profiles FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- workouts: each user can only see and edit their own rows
DROP POLICY IF EXISTS "Users can manage their own workouts" ON public.workouts;
CREATE POLICY "Users can manage their own workouts"
  ON public.workouts FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- meals: each user can only see and edit their own rows
DROP POLICY IF EXISTS "Users can manage their own meals" ON public.meals;
CREATE POLICY "Users can manage their own meals"
  ON public.meals FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- weight_history: each user can only see and edit their own rows
DROP POLICY IF EXISTS "Users can manage their own weight history" ON public.weight_history;
CREATE POLICY "Users can manage their own weight history"
  ON public.weight_history FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- daily_goals: each user can only see and edit their own rows
DROP POLICY IF EXISTS "Users can manage their own daily goals" ON public.daily_goals;
CREATE POLICY "Users can manage their own daily goals"
  ON public.daily_goals FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- Done! All tables created and secured.
-- ============================================================
