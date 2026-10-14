import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

export type ConditionType = 'muddy' | 'wet' | 'dry' | 'icy' | 'well_maintained' | 'needs_maintenance';

type CourseConditionInsert = TablesInsert<'course_conditions'>;

export type CourseCondition = {
  id: string;
  course_id: string | null;
  user_id: string | null;
  condition_type: string;
  description: string | null;
  severity: number | null;
  created_at: string | null;
  profiles: {
    username: string | null;
    full_name: string | null;
  } | null;
}

export const useCourseConditions = (courseId?: string) => {
  const queryClient = useQueryClient();

  // Query for course conditions
  const query = useQuery({
    queryKey: ["course-conditions", courseId],
    queryFn: async () => {
      if (!courseId) return [];

      const { data, error } = await supabase
        .from("course_conditions")
        .select(`
          *,
          profiles:user_id (
            username,
            full_name
          )
        `)
        .eq("course_id", courseId)
        .order("created_at", { ascending: false })
        .limit(20); // Last 20 condition reports

      if (error) throw error;
      return data as CourseCondition[];
    },
    enabled: !!courseId,
  });

  // Mutation for reporting conditions
  const reportConditionMutation = useMutation({
    mutationFn: async ({
      conditionType,
      description,
      severity = 3,
    }: {
      conditionType: ConditionType;
      description?: string;
      severity?: number;
    }) => {
      if (!courseId) throw new Error("Course ID is required");

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const insertData: CourseConditionInsert = {
        course_id: courseId,
        user_id: user.id,
        condition_type: conditionType,
        description,
        severity,
      };

      const { data, error } = await supabase
        .from("course_conditions")
        .insert(insertData)
        .select(`
          *,
          profiles:user_id (
            username,
            full_name
          )
        `)
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-conditions", courseId] });
    },
  });

  // Get condition summary for quick overview
  const getConditionSummary = () => {
    if (!query.data) return null;

    const recent = query.data.filter(
      (condition: CourseCondition) => new Date(condition.created_at || '') > new Date(Date.now() - 24 * 60 * 60 * 1000)
    );

    const conditionCounts = recent.reduce((acc, condition: CourseCondition) => {
      acc[condition.condition_type] = (acc[condition.condition_type] || 0) + 1;
      return acc;
    }, {} as Record<ConditionType, number>);

    const mostReported = Object.entries(conditionCounts)
      .sort(([,a], [,b]) => b - a)[0];

    return {
      totalReports: recent.length,
      mostReported: mostReported ? mostReported[0] as ConditionType : null,
      recentConditions: recent.slice(0, 3),
    };
  };

  return {
    ...query,
    reportCondition: reportConditionMutation.mutate,
    isReporting: reportConditionMutation.isPending,
    conditionSummary: getConditionSummary(),
  };
};