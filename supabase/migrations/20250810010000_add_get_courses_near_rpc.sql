-- Enable required extensions for distance calculations
create extension if not exists cube;
create extension if not exists earthdistance;

-- Optional: simple index to help coarse bounding box filters
create index if not exists disc_golf_courses_lat_lon_idx on api.disc_golf_courses (latitude, longitude);

-- Distance-ordered RPC
create or replace function api.get_disc_golf_courses_near(
  user_lat double precision,
  user_lon double precision,
  radius_miles double precision default null,
  limit_count integer default 9,
  offset_count integer default 0
)
returns table (
  id uuid,
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
  updated_at timestamp with time zone,
  distance_miles double precision,
  total_count bigint
)
language sql
stable
security definer
set search_path = api, public
as $$
  with params as (
    select user_lat as lat,
           user_lon as lon,
           case when radius_miles is null then null else radius_miles * 1609.34 end as radius_meters
  ),
  filtered as (
    -- Optional coarse bounding-box filter for performance
    select d.*,
           p.lat,
           p.lon,
           p.radius_meters
    from api.disc_golf_courses d
    cross join params p
    where d.latitude is not null and d.longitude is not null
      and (
        p.radius_meters is null
        or (
          -- coarse bounding box (~69 miles per degree latitude)
          d.latitude between (p.lat - (p.radius_meters / 1609.34) / 69.0)
                          and (p.lat + (p.radius_meters / 1609.34) / 69.0)
          and d.longitude between (
            p.lon - ((p.radius_meters / 1609.34) / (69.0 * greatest(0.1, cos(radians(p.lat)))))
          ) and (
            p.lon + ((p.radius_meters / 1609.34) / (69.0 * greatest(0.1, cos(radians(p.lat)))))
          )
        )
      )
  )
  select
    f.id,
    f.name,
    f.city,
    f.state,
    f.postal_code,
    f.country,
    f.latitude,
    f.longitude,
    f.contact_info,
    f.established,
    f.designer,
    f.classification,
    f.rating,
    f.holes,
    f.configs,
    f.length,
    f.par,
    f.tees,
    f.targets,
    f.property,
    f.services,
    f.description,
    f.directions,
    f.elevation,
    f.foliage,
    f.created_at,
    f.updated_at,
    (earth_distance(ll_to_earth(f.lat, f.lon), ll_to_earth(f.latitude::float8, f.longitude::float8)) / 1609.34) as distance_miles,
    count(*) over() as total_count
  from filtered f
  where (
    f.radius_meters is null
    or earth_distance(ll_to_earth(f.lat, f.lon), ll_to_earth(f.latitude::float8, f.longitude::float8)) <= f.radius_meters
  )
  order by earth_distance(ll_to_earth(f.lat, f.lon), ll_to_earth(f.latitude::float8, f.longitude::float8)) asc
  limit limit_count offset offset_count;
$$;


