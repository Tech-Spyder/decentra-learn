import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/superbaseClient";
import { usePrivy } from "@privy-io/react-auth";
import { Course, Progress } from "../types";


export type GroupedCourses = {
  [category: string]: (Course & {
    course_participants: { count: number }[];
    course_progress: Progress | null;
    category_slug: string;
  })[];
};

export function useCoursesGroupedByCategory() {
  const { user } = usePrivy();
  const userId = user?.id;

  return useQuery<GroupedCourses>({
    queryKey: ["courses", "grouped", userId],
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
        .order("created_at", { ascending: true });

      if (userId) {
        query = query.eq("course_progress.user_id", userId);
      }

      const { data, error } = await query;

      if (error) throw error;
      if (!data) return {};

      const groupedCourses: GroupedCourses = data.reduce((acc, course: Course & {
        course_participants: { count: number }[];
        course_progress: Progress[] | Progress | null;
        category_slug: string;
      }) => {
        const category = course.category_slug || "uncategorized";
        const transformedCourse: Course & {
          course_participants: { count: number }[];
          course_progress: Progress | null;
          category_slug: string;
        } = {
          ...course,
          course_progress: Array.isArray(course.course_progress)
            ? course.course_progress[0] || null
            : course.course_progress || null,
        };

        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(transformedCourse);
        return acc;
      }, {} as GroupedCourses);

      return groupedCourses;
    },
  });
}
