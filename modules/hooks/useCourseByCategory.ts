
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/superbaseClient";
import { usePrivy } from "@privy-io/react-auth";
import { Course, Progress } from "../types";


export function useCoursesByCategory(categorySlug: string) {
  const { user } = usePrivy();
  const userId = user?.id;

  return useQuery<
    (Course & {
      course_participants: { count: number }[];
      course_progress: Progress | null;
      category_slug: string;
    })[]
  >({
    queryKey: ["courses", categorySlug, userId],
    queryFn: async () => {
      let query = supabase
        .from("courses")
        .select(
          `
          id,
          slug,
          title,
          description,
          reward_xp,
          category,
          created_at,
          category_slug,
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
            id,
            user_id,
            course_id,
            completed_steps,
            earned_xp
          )
          `
        )
        .eq("category_slug", categorySlug)
        .order("created_at", { ascending: true });

      if (userId) {
        query = query.eq("course_progress.user_id", userId);
      }

      const { data, error } = await query;

      if (error) throw error;
      if (!data) return [];

      return data.map((course: Course & {
        course_participants: { count: number }[];
        course_progress: Progress[] | Progress | null;
        category_slug: string;
      }) => ({
        ...course,
        course_progress: Array.isArray(course.course_progress)
          ? course.course_progress[0] || null
          : course.course_progress || null,
      }));
    },
  });
}
