import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/superbaseClient";
import { usePrivy } from "@privy-io/react-auth";

export function useAllCourses() {
  const { user } = usePrivy();
  const userId = user?.id;

  return useQuery({
    queryKey: ["courses", userId], // Still include userId so it refetches when user changes
    queryFn: async () => {
      // Build the base query - this gets ALL courses
      let query = supabase
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
        .order("id", { ascending: true });

      // Only filter progress by user if user is signed in
      if (userId) {
        query = query.eq("course_progress.user_id", userId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    },
    // Remove the enabled condition - we always want to fetch courses
    // enabled: !!userId, // ❌ Remove this line
  });
}