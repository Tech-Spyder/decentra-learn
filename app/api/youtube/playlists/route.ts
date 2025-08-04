// /app/api/youtube/playlists.ts
import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.YOUTUBE_API_KEY!;
const BASE_URL = "https://www.googleapis.com/youtube/v3/playlistItems";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const playlistId = searchParams.get("playlistId");

  if (!playlistId) {
    return NextResponse.json({ error: "Missing playlistId" }, { status: 400 });
  }

  const url = `${BASE_URL}?part=snippet&playlistId=${playlistId}&maxResults=20&key=${API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();
console.log("Fetched playlist data:", data);

  if (!res.ok) {
    return NextResponse.json({ error: data.error?.message || "Failed to fetch" }, { status: 500 });
  }

  return NextResponse.json(data.items.map((item: any) => ({
    id: item.snippet.resourceId.videoId,
    title: item.snippet.title,
    thumbnail: item.snippet.thumbnails.medium.url,
    description: item.snippet.description,
  })));
}
