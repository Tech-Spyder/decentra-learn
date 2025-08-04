// import { useQuery } from '@tanstack/react-query';
// import { useUser } from '@privy-io/react-auth'; // or however you get the user
// import { supabase } from '@/lib/superbaseClient';

// export function useCourseWithProgress(slug: string) {
//   const { user } = useUser();

//   return useQuery({
//     queryKey: ['course', slug, user?.id],
//     queryFn: async () => {
//       if (!user?.id) throw new Error("User not logged in");

//       const { data: course, error: courseError } = await supabase
//         .from('courses')
//         .select(`
//           id,
//           slug,
//           title,
//           description,
//           reward_xp,
//           steps (
//             id,
//             title,
//             step_number,
//             requires_action,
//             sliders (
//               id,
//               type,
//               content,
//               order_index
//             )
//           )
//         `)
//         .eq('slug', slug)
//         .single();

//       if (courseError) throw courseError;

//       const { data: progress } = await supabase
//         .from('course_progress')
//         .select('*')
//         .eq('user_id', user.id)
//         .eq('course_id', course.id)
//         .maybeSingle();

//       return { course, progress };
//     },
//     enabled: !!slug && !!user?.id,
//   });
// }
// import { useQuery } from '@tanstack/react-query';
// import { useUser } from '@privy-io/react-auth';
// import { supabase } from '@/lib/superbaseClient';

// export function useAllCoursesWithProgress() {
//   const { user } = useUser();

//   return useQuery({
//     queryKey: ['all-courses-with-progress', user?.id],
//     queryFn: async () => {
//       const { data: courses, error: coursesError } = await supabase
//         .from('courses')
//         .select(`
//           id,
//           slug,
//           title,
//           description,
//           reward_xp,
//           steps (
//             id,
//             title,
//             step_number
//           )
//         `);

//       if (coursesError) throw coursesError;

//       if (!user?.id) {
//         // If user isn't logged in, just return courses with no progress
//         return courses.map((course) => ({ course, progress: null }));
//       }

//       const { data: progressData, error: progressError } = await supabase
//         .from('course_progress')
//         .select('*')
//         .eq('user_id', user.id);

//       if (progressError) throw progressError;

//       return courses.map((course) => {
//         const progress = progressData.find((p) => p.course_id === course.id);
//         return { course, progress };
//       });
//     },
//     enabled: !!user,
//   });
// }
// import { useQuery } from "@tanstack/react-query";
// import { usePrivy } from "@privy-io/react-auth";
// import { supabase } from "@/lib/superbaseClient";

// export function useCourseWithProgress(courseId: string) {
//   const { user } = usePrivy();

//   return useQuery({
//     queryKey: ["course-with-progress", courseId, user?.id],
//     queryFn: async () => {
//       // 1. Fetch course content
//       const { data: course, error } = await supabase
//         .from("courses")
//         .select(`
//           id,
//           slug,
//           title,
//           description,
//           reward_xp,
//           steps (
//             id,
//             title,
//             step_number,
//             requires_action,
//             sliders (
//               id,
//               type,
//               content,
//               order_index
//             )
//           )
//         `)
//         .eq("id", courseId)
//         .single();

//       if (error) throw error;

//       // 2. Fetch progress only if user is signed in
//       if (!user?.id) return { course, progress: null };

//       const { data: progress } = await supabase
//         .from("course_progress")
//         .select("*")
//         .eq("user_id", user.id)
//         .eq("course_id", courseId)
//         .single();

//       return { course, progress };
//     },
//     enabled: !!courseId,
//   });
// }
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
