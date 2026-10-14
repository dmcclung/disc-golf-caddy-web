import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DiscGolfCourse } from "./useDiscGolfCourses";

export const useDiscGolfCourse = (courseId?: string) => {
  return useQuery({
    queryKey: ["disc-golf-course", courseId],
    queryFn: async () => {
      if (!courseId) throw new Error("Course ID is required");

      const { data, error } = await supabase
        .from("disc_golf_courses")
        .select("*")
        .eq("id", courseId)
        .single();

      if (error) throw error;
      return data as unknown as DiscGolfCourse;
    },
    enabled: !!courseId,
  });
};