-- Update the function to use more restrictive search_path
CREATE OR REPLACE FUNCTION api.get_disc_golf_courses()
RETURNS TABLE (
  id text,
  name text,
  city text,
  state text,
  postal_code text,
  country text,
  latitude numeric,
  longitude numeric,
  contact_info jsonb,
  established integer,
  designer text,
  classification text,
  rating numeric,
  holes integer,
  configs text,
  length jsonb,
  par integer,
  tees jsonb,
  targets jsonb,
  property jsonb,
  services text,
  description text,
  directions text,
  elevation text,
  foliage text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
) 
SET search_path TO 'api'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    dgc.id,
    dgc.name,
    dgc.city,
    dgc.state,
    dgc.postal_code,
    dgc.country,
    dgc.latitude,
    dgc.longitude,
    dgc.contact_info,
    dgc.established,
    dgc.designer,
    dgc.classification,
    dgc.rating,
    dgc.holes,
    dgc.configs,
    dgc.length,
    dgc.par,
    dgc.tees,
    dgc.targets,
    dgc.property,
    dgc.services,
    dgc.description,
    dgc.directions,
    dgc.elevation,
    dgc.foliage,
    dgc.created_at,
    dgc.updated_at
  FROM disc_golf_courses dgc;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;