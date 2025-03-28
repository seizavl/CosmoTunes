
import { NextResponse } from "next/server";
import YTMusic from "ytmusic-api";

// 認証ファイルがあるなら指定する（ないなら無視してもOK）
const ytmusic = new YTMusic();

export const revalidate = 0; // API ルートのキャッシュを無効化する設定

export async function GET() {
  try {
    await ytmusic.initialize();

    const searchResults = await ytmusic.searchSongs("J-Pop Hits");

    console.log(searchResults);

    const songs = searchResults.slice(0, 20).map(song => ({
      title: song.name,
      artist: song.artist.name,
      artistId: song.artist.artistId,
      album: song.album ? song.album.name : "Unknown",
      albumId: song.album ? song.album.albumId : null,
      videoId: song.videoId,
      duration: song.duration,
      thumbnail: song.thumbnails.length > 0 ? song.thumbnails[0].url : null
    }));

    return NextResponse.json(songs);
  } catch (error) {
    console.error("Error fetching songs:", error);
    return NextResponse.json({ error: "Failed to fetch songs" }, { status: 500 });
  }
}
