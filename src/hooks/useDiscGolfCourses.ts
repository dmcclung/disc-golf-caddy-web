import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Define the DiscGolfCourse type based on the database schema
export interface DiscGolfCourse {
  id: string;
  name: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  latitude?: number | null;
  longitude?: number | null;
  classification?: string | null;
  description?: string | null;
  designer?: string | null;
  directions?: string | null;
  elevation?: string | null;
  established?: string | null;
  holes?: number | null;
  par?: number | null;
  rating?: number | null;
  services?: string | null;
  contact_info?: any;
  length?: any;
  created_at: string;
}

export interface SearchParams {
  latitude?: number;
  longitude?: number;
  radius?: number;
  courseType?: string[];
  difficulty?: string;
  amenities?: string[];
  searchQuery?: string;
  page?: number;
  pageSize?: number;
}

export const useDiscGolfCourses = (searchParams?: SearchParams, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["disc-golf-courses", searchParams],
    queryFn: async () => {
      const page = searchParams?.page ?? 1;
      const pageSize = searchParams?.pageSize ?? 9;
      const offset = (page - 1) * pageSize;

      // If we have user location, use the distance-ordered RPC
      if (searchParams?.latitude != null && searchParams?.longitude != null) {
        const { latitude, longitude, radius, courseType, difficulty, amenities } = searchParams;
        const { data, error } = await supabase
          .rpc('get_disc_golf_courses_near', {
            user_lat: latitude,
            user_lon: longitude,
            radius_miles: radius ?? null,
            limit_count: pageSize,
            offset_count: offset,
          });
        if (error) throw error;

        const items = (data ?? []) as (DiscGolfCourse & { distance_miles?: number; total_count?: number })[];

        // Client-side filtering on metadata fields (classification/services) if provided
        let filteredItems = items;
        if (courseType && courseType.length > 0) {
          filteredItems = filteredItems.filter((course) =>
            courseType.some((type) => course.classification?.toLowerCase().includes(type))
          );
        }
        if (difficulty && difficulty !== 'any') {
          filteredItems = filteredItems.filter((course) => course.classification?.toLowerCase().includes(difficulty));
        }
        if (amenities && amenities.length > 0) {
          filteredItems = filteredItems.filter((course) => amenities.some((a) => course.services?.toLowerCase().includes(a)));
        }

        const totalCount = items.length > 0 && items[0].total_count ? Number(items[0].total_count) : filteredItems.length;
        return { items: filteredItems as DiscGolfCourse[], count: totalCount };
      }

      // Fallback: original query (no location ordering)
      const { data, error, count } = await supabase
        .from('disc_golf_courses')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + pageSize - 1);
      if (error) throw error;
      return { items: (data ?? []) as DiscGolfCourse[], count: count ?? 0 };
    },
    enabled: options?.enabled ?? true,
    // Preserve the last successful page while new params are fetching
    placeholderData: (previousData) => previousData,
  });
};

// Helper function to calculate distance between two points using Haversine formula
// Note: Haversine client helper removed; distance ordering is handled in SQL RPC.
