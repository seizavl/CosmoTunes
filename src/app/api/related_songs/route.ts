import { NextResponse } from "next/server";
import YTMusic from "ytmusic-api";

const ytmusic = new YTMusic();

export async function POST(req: Request) {
  try {
    const { videoId } = await req.json();
    if (!videoId) {
      return NextResponse.json({ error: "videoId is required" }, { status: 400 });
    }

    await ytmusic.initialize();
    const relatedSongs = (await ytmusic.getUpNexts(videoId)).slice(0, 20);
    // 取得したデータをそのまま返す
    return NextResponse.json(relatedSongs);
  } catch (error) {
    console.error("Error fetching related songs:", error);
    return NextResponse.json({ error: "Failed to fetch related songs" }, { status: 500 });
  }
}
