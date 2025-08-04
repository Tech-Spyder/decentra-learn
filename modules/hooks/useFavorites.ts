import { supabase } from "@/lib/superbaseClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useFavorites(userId: string | undefined) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["favorites", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("course_favorites")
        .select("course_id")
        .eq("user_id", userId);
      if (error) throw error;
      return data.map((f) => f.course_id);
    },
  });

  const toggleFavorite = useMutation({
    mutationFn: async ({
      courseId,
      isFavorited,
    }: {
      courseId: string;
      isFavorited: boolean;
    }) => {
      if (!userId) return;

      if (isFavorited) {
        await supabase
          .from("course_favorites")
          .delete()
          .eq("user_id", userId)
          .eq("course_id", courseId);
      } else {
        await supabase
          .from("course_favorites")
          .insert({ user_id: userId, course_id: courseId });
      }
    },
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ["favorites", userId] });
      }
    },
  });

  return {
    favorites: data ?? [],
    isLoading,
    toggleFavorite,
  };
}
