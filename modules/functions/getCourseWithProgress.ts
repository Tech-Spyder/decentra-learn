import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://xyz.supabase.co", "public-anon-key");

export async function getCourseWithProgress(slug: string, userId: string) {
  const { data: course, error } = await supabase
    .from("courses")
    .select(`
      id,
      slug,
      title,
      reward_xp,
      steps (
        id,
        step_number,
        title,
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

  const { data: progress } = await supabase
    .from("course_progress")
    .select("*")
    .eq("course_id", course?.id)
    .eq("user_id", userId)
    .maybeSingle();

  return { course, progress };
}
