CREATE TABLE public.presence_settings (
  user_id UUID NOT NULL PRIMARY KEY,
  pause_profile BOOLEAN NOT NULL DEFAULT false,
  private_browsing BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.presence_settings TO authenticated;
GRANT ALL ON public.presence_settings TO service_role;

ALTER TABLE public.presence_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own presence settings"
ON public.presence_settings
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_presence_settings_updated_at
BEFORE UPDATE ON public.presence_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();