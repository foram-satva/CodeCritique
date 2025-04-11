
-- Add language field to review_history table if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'review_history' 
    AND column_name = 'language'
  ) THEN 
    ALTER TABLE public.review_history 
    ADD COLUMN language text NOT NULL DEFAULT 'unknown';
  END IF;
END $$;
