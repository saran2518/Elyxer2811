CREATE OR REPLACE FUNCTION public.get_early_access_total()
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT count(*)::integer FROM public.early_access_members;
$$;
REVOKE ALL ON FUNCTION public.get_early_access_total() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_early_access_total() FROM anon;
GRANT EXECUTE ON FUNCTION public.get_early_access_total() TO authenticated;
