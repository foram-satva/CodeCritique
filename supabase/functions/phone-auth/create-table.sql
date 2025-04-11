
CREATE OR REPLACE FUNCTION create_phone_otps_if_not_exists()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the table exists
  IF NOT EXISTS (
    SELECT FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename = 'phone_otps'
  ) THEN
    -- Create the phone_otps table
    CREATE TABLE public.phone_otps (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      phone_number TEXT NOT NULL UNIQUE,
      otp_code TEXT NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now() NOT NULL
    );

    -- Enable RLS
    ALTER TABLE public.phone_otps ENABLE ROW LEVEL SECURITY;
    
    -- Only service role can access this table
    CREATE POLICY "Service role can manage phone_otps" ON public.phone_otps
      USING (auth.role() = 'service_role');
  END IF;
END;
$$;

-- Run the function to ensure the table exists
SELECT create_phone_otps_if_not_exists();
