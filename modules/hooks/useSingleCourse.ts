import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/superbaseClient";
import { usePrivy } from "@privy-io/react-auth";

export function useCourse(slug:string) {
  const { user } = usePrivy();
  const userId = user?.id;

  return useQuery({
    queryKey: ["course", slug, userId],
    queryFn: async () => {
      if (!slug) return null;

      const { data, error } = await supabase
        .from("courses")
        .select(
          `
          id,
          slug,
          title,
          description,
          reward_xp,
          steps (
            id,
            title,
            step_number,
            requires_action,
            sliders (
              id,
              type,
              content,
              order_index
            )
          ),
          course_participants(count),
          course_progress:course_progress!course_id (
            user_id,
            completed_steps,
            verified_steps,
            earned_xp
          )
          `
        )
        .eq("slug", slug)
        .eq("course_progress.user_id", userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned - course not found
          return null;
        }
        throw error;
      }
      
      return data;
    },
    enabled: !!slug,
  });
}