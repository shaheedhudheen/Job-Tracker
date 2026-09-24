-- ============================================
-- 🎯 JobTracker — Supabase Database Setup
-- ============================================
-- Run this in your Supabase SQL Editor:
-- Dashboard → SQL Editor → New Query → Paste → Run

-- 1. Create the job_applications table
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  job_role TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT DEFAULT '',
  applied_date DATE DEFAULT CURRENT_DATE,
  job_link TEXT DEFAULT '',
  contact_info TEXT DEFAULT '',
  platform TEXT DEFAULT '',
  job_description TEXT DEFAULT '',
  status TEXT DEFAULT 'applied' CHECK (status IN ('applied', 'got_response', 'interview', 'offered', 'rejected', 'accepted')),
  salary_range TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  resume_version TEXT DEFAULT '',
  follow_up_date DATE,
  interview_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_job_applications_user_id ON job_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status);
CREATE INDEX IF NOT EXISTS idx_job_applications_created_at ON job_applications(created_at DESC);

-- 3. Enable Row Level Security (RLS)
--    This ensures each user can ONLY see their own data
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies — users can only access their own rows
CREATE POLICY "Users can view their own applications"
  ON job_applications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own applications"
  ON job_applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications"
  ON job_applications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own applications"
  ON job_applications FOR DELETE
  USING (auth.uid() = user_id);

-- 5. Auto-update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON job_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 6. Enable Realtime for this table
--    This powers the cross-device sync feature
ALTER PUBLICATION supabase_realtime ADD TABLE job_applications;

-- ✅ Done! Your database is ready.
-- Now copy your Project URL and Anon Key into your .env file.
