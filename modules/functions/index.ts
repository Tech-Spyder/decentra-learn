import { supabase } from "@/lib/superbaseClient";


export async function recordCourseParticipant(courseId: string, userId: string) {
  if (!userId) return; // Skip if not signed in

  const { error } = await supabase
    .from("course_participants")
    .insert({ course_id: courseId, user_id: userId })
    .select()
    .single()
    // .catch(() => {}); // Supabase throws on unique constraint violation

  // ignore duplicate insert errors due to unique constraint
  if (error && error.code !== "23505") {
    console.error("Error recording participant:", error.message);
  }
}

// await recordCourseParticipant(course.id, user.id);
