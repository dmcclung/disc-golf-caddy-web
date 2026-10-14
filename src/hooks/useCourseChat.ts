import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

type CourseChatInsert = TablesInsert<'course_chat'>;

export type ChatMessage = {
  id: string;
  course_id: string | null;
  user_id: string | null;
  message: string;
  emoji_type: string | null;
  created_at: string | null;
  profiles: {
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

export const useCourseChat = (courseId?: string) => {
  const queryClient = useQueryClient();

  // Query for chat messages
  const query = useQuery({
    queryKey: ["course-chat", courseId],
    queryFn: async () => {
      if (!courseId) return [];

      const { data, error } = await supabase
        .from("course_chat")
        .select(`
          *,
          profiles:user_id (
            username,
            full_name,
            avatar_url
          )
        `)
        .eq("course_id", courseId)
        .order("created_at", { ascending: true })
        .limit(100); // Limit to last 100 messages

      if (error) throw error;
      return data as ChatMessage[];
    },
    enabled: !!courseId,
  });

  // Set up real-time subscription for new messages
  useEffect(() => {
    if (!courseId) return;

    const channel = supabase
      .channel(`course-chat-${courseId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "api",
          table: "course_chat",
          filter: `course_id=eq.${courseId}`,
        },
        () => {
          // Invalidate and refetch the query when new messages arrive
          queryClient.invalidateQueries({ queryKey: ["course-chat", courseId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [courseId, queryClient]);

  // Mutation for sending messages
  const sendMessageMutation = useMutation({
    mutationFn: async ({ message, emojiType }: { message: string; emojiType?: string }) => {
      if (!courseId) throw new Error("Course ID is required");

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const insertData: CourseChatInsert = {
        course_id: courseId,
        user_id: user.id,
        message,
        emoji_type: emojiType,
      };

      const { data, error } = await supabase
        .from("course_chat")
        .insert(insertData)
        .select(`
          *,
          profiles:user_id (
            username,
            full_name,
            avatar_url
          )
        `)
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-chat", courseId] });
    },
  });

  // Mutation for deleting messages (own messages only)
  const deleteMessageMutation = useMutation({
    mutationFn: async (messageId: string) => {
      const { error } = await supabase
        .from("course_chat")
        .delete()
        .eq("id", messageId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-chat", courseId] });
    },
  });

  return {
    ...query,
    sendMessage: sendMessageMutation.mutate,
    deleteMessage: deleteMessageMutation.mutate,
    isSending: sendMessageMutation.isPending,
    isDeleting: deleteMessageMutation.isPending,
  };
};