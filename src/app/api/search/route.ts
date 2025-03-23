"use client"
import { NextResponse } from "next/server";
import YTMusic from "ytmusic-api";

const ytmusic = new YTMusic();

// POSTリクエストを処理（クエリに基づいて検索）
export async function POST(request: Request) {
  try {
    const { query } = await request.json(); // クライアントからのクエリを取得
    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: "検索クエリが指定されていません。" }, { status: 400 });
    }

    await ytmusic.initialize();
    const searchResults = await ytmusic.searchSongs(query);
    console.log(searchResults)
    
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

    return NextResponse.json({ results: songs });
  } catch (error) {
    console.error("Error fetching songs:", error);
    return NextResponse.json({ error: "Failed to fetch songs" }, { status: 500 });
  }
}
