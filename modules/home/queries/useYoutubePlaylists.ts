// hooks/useYoutubePlaylist.ts
import { useQuery } from '@tanstack/react-query';

const fetchPlaylistVideos = async (playlistId: string) => {
  const res = await fetch(`/api/youtube/playlists?playlistId=${playlistId}`);
  if (!res.ok) throw new Error("Failed to fetch playlist");
  return res.json();
};

export const useYoutubePlaylist = (playlistId: string, enabled = true) => {
  return useQuery({
    queryKey: ['youtube-playlist', playlistId],
    queryFn: () => fetchPlaylistVideos(playlistId),
    enabled: !!playlistId && enabled,
    staleTime: 1000 * 60 * 5, // 5 mins
  });
};
