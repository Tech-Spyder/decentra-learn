import { supabase } from '@/lib/superbaseClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';


export function useCompleteStep(userId: string, courseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (stepId: string) => {
      const { data: existing } = await supabase
        .from('course_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .maybeSingle();

      const updatedSteps = Array.from(new Set([...(existing?.completed_steps || []), stepId]));

      if (existing) {
        return supabase.from('course_progress').update({
          completed_steps: updatedSteps,
          last_updated: new Date().toISOString(),
        }).eq('id', existing.id);
      } else {
        return supabase.from('course_progress').insert({
          user_id: userId,
          course_id: courseId,
          completed_steps: [stepId],
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course', courseId, userId] });
    }
  });
}
