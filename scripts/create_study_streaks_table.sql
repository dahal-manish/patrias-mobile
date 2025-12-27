-- Create study_streaks table for tracking daily study streaks
-- This table should reference profiles (not users) to match the current schema

CREATE TABLE IF NOT EXISTS public.study_streaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_study_date DATE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.study_streaks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for study_streaks table
DROP POLICY IF EXISTS "Users can view their own study streaks" ON public.study_streaks;
CREATE POLICY "Users can view their own study streaks" ON public.study_streaks
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own study streaks" ON public.study_streaks;
CREATE POLICY "Users can insert their own study streaks" ON public.study_streaks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own study streaks" ON public.study_streaks;
CREATE POLICY "Users can update their own study streaks" ON public.study_streaks
  FOR UPDATE USING (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON public.study_streaks TO postgres, anon, authenticated, service_role;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_study_streaks_user_id ON public.study_streaks(user_id);

