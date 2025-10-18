
import { useQuery } from "@tanstack/react-query";
import { usePrivy } from "@privy-io/react-auth";
import { supabase } from "@/lib/superbaseClient";

interface UserStats {
  total_xp: number;
  current_streak: number;
  user_rank: string;
}

export function useUserStats() {
  const { user } = usePrivy();

  return useQuery<UserStats>({
    queryKey: ["user-stats", user?.id],
    queryFn: async () => {
      if (!user?.id) return { total_xp: 0, current_streak: 0, user_rank: "Bronze" };

      const decodedUserId = decodeURIComponent(user.id);

      const { data: existingStats, error: fetchError } = await supabase
        .from("user_stats")
        .select("total_xp, current_streak, user_rank")
        .eq("user_id", decodedUserId)
        .maybeSingle();

      if (existingStats) {
        return existingStats;
      }

      if (fetchError?.code === "PGRST116" || !existingStats) {
        const { data: newStats, error: insertError } = await supabase
          .from("user_stats")
          .insert({
            user_id: decodedUserId,
            total_xp: 0,
            current_streak: 0,
            user_rank: "Bronze",
          })
          .select()
          .single();

        if (newStats) return newStats;
        if (insertError) {
          console.error("Error creating user stats:", insertError);
        }
      }

      return { total_xp: 0, current_streak: 0, user_rank: "Bronze" };
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}