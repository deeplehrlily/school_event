-- Create form submissions table to store all form data
CREATE TABLE IF NOT EXISTS public.form_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Basic Info
  name TEXT,
  birth_date DATE,
  phone TEXT,
  address TEXT,
  
  -- Education
  education_level TEXT,
  school_name TEXT,
  major TEXT,
  graduation_date DATE,
  gpa DECIMAL(3,2),
  
  -- Certifications (stored as JSON array)
  certifications JSONB DEFAULT '[]'::jsonb,
  
  -- Analysis Results
  analysis_score INTEGER,
  pass_status BOOLEAN,
  strengths TEXT[],
  weaknesses TEXT[],
  recommendations TEXT[]
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (since we don't have user auth)
CREATE POLICY "Allow public insert" ON public.form_submissions
  FOR INSERT WITH CHECK (true);

-- Create policy to allow reading own submissions (for future user auth)
CREATE POLICY "Allow public select" ON public.form_submissions
  FOR SELECT USING (true);
