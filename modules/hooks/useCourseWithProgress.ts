import { useQuery } from "@tanstack/react-query";
import { usePrivy } from "@privy-io/react-auth";
import { supabase } from "@/lib/superbaseClient";

export function useCourseWithProgress(slug: string) {
  const { user } = usePrivy();

  return useQuery({
    queryKey: ["course-with-progress", slug, user?.id],
    queryFn: async () => {
      // 1. Fetch course content by slug
      const { data: course, error } = await supabase
        .from("courses")
        .select(`
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
          )
        `)
        .eq("slug", slug)
        .single();

      if (error) throw error;

      // 2. Fetch progress only if user is signed in
      if (!user?.id) return { course, progress: null };

      const { data: progress } = await supabase
        .from("course_progress")
        .select("*")
        .eq("user_id", user.id)
        .eq("course_id", course.id) // ← Now using course.id
        .single();

      return { course, progress };
    },
    enabled: !!slug,
  });
}


export interface CourseProgress {
  id: string;
  course_id: string;
  user_id: string;
  completed_steps: string[];
  verified_steps: string[];
  earned_xp: number;
  courses: {
    id: string;
    title: string;
    reward_xp: number;
    description?: string;
  };
  steps_count: number;
}

export interface RawProgressData {
  id: string;
  course_id: string;
  user_id: string;
  completed_steps: string[];
  verified_steps: string[];
  earned_xp: number;
  courses: Array<{
    id: string;
    title: string;
    reward_xp: number;
    description?: string;
  }>;
}

export function useUserCourses() {
  const { user } = usePrivy();

  return useQuery<CourseProgress[]>({
    queryKey: ["user-courses", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const decodedUserId = decodeURIComponent(user.id);

      // Fetch course_progress with nested course data
      const { data: progressData, error: progressError } = await supabase
        .from("course_progress")
        .select(`
          id,
          course_id,
          user_id,
          completed_steps,
          verified_steps,
          earned_xp,
          courses (
            id,
            title,
            reward_xp,
            description
          )
        `)
        .eq("user_id", decodedUserId);

      if (progressError) throw progressError;
      if (!progressData) return [];

      // Get step counts for each course
      const coursesWithSteps: CourseProgress[] = await Promise.all(
        progressData.map(async (progress: RawProgressData) => {
          const { count } = await supabase
            .from("steps")
            .select("*", { count: "exact", head: true })
            .eq("course_id", progress.course_id);

          // Handle courses as array and get first item
          const courseData = Array.isArray(progress.courses)
            ? progress.courses[0]
            : progress.courses;

          return {
            id: progress.id,
            course_id: progress.course_id,
            user_id: progress.user_id,
            completed_steps: progress.completed_steps || [],
            verified_steps: progress.verified_steps || [],
            earned_xp: progress.earned_xp || 0,
            courses: courseData || {
              id: progress.course_id,
              title: "Unknown Course",
              reward_xp: 0,
              description: "",
            },
            steps_count: count || 0,
          };
        })
      );

      return coursesWithSteps;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}