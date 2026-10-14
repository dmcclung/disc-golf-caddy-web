import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

type CoursePresenceInsert = TablesInsert<'course_presence'>;
type CoursePresenceUpdate = TablesUpdate<'course_presence'>;

export type CoursePresence = {
  id: string;
  user_id: string | null;
  course_id: string | null;
  is_active: boolean | null;
  last_seen: string | null;
  created_at: string | null;
  profiles: {
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

export const useCoursePresence = (courseId?: string) => {
  const queryClient = useQueryClient();

  // Query for active users at the course
  const query = useQuery({
    queryKey: ["course-presence", courseId],
    queryFn: async () => {
      if (!courseId) return [];

      const { data, error } = await supabase
        .from("course_presence")
        .select(`
          *,
          profiles:user_id (
            username,
            full_name,
            avatar_url
          )
        `)
        .eq("course_id", courseId)
        .eq("is_active", true)
        .gte("last_seen", new Date(Date.now() - 60 * 60 * 1000).toISOString()); // Last hour

      if (error) throw error;
      return data as CoursePresence[];
    },
    enabled: !!courseId,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Set up real-time subscription
  useEffect(() => {
    if (!courseId) return;

    const channel = supabase
      .channel(`course-presence-${courseId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "api",
          table: "course_presence",
          filter: `course_id=eq.${courseId}`,
        },
        () => {
          // Invalidate and refetch the query when presence changes
          queryClient.invalidateQueries({ queryKey: ["course-presence", courseId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [courseId, queryClient]);

  return {
    ...query,
    userCount: query.data?.length || 0,
  };
};

// Hook for managing user's own presence
export const useUserPresence = (courseId?: string) => {
  const queryClient = useQueryClient();

  const checkInMutation = useMutation({
    mutationFn: async () => {
      if (!courseId) throw new Error("Course ID is required");

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const upsertData: CoursePresenceInsert = {
        user_id: user.id,
        course_id: courseId,
        is_active: true,
        last_seen: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("course_presence")
        .upsert(upsertData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-presence", courseId] });
    },
  });

  const checkOutMutation = useMutation({
    mutationFn: async () => {
      if (!courseId) throw new Error("Course ID is required");

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const updateData: CoursePresenceUpdate = { is_active: false };

      const { data, error } = await supabase
        .from("course_presence")
        .update(updateData)
        .eq("user_id", user.id)
        .eq("course_id", courseId)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-presence", courseId] });
    },
  });


  return {
    checkIn: checkInMutation.mutate,
    checkOut: checkOutMutation.mutate,
    isCheckingIn: checkInMutation.isPending,
    isCheckingOut: checkOutMutation.isPending,
  };
};