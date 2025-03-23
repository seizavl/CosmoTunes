"use client"
import { NextRequest, NextResponse } from 'next/server';
import YTMusic from 'ytmusic-api';

export async function POST(req: NextRequest) {
  const { videoId } = await req.json();

  const ytmusic = new YTMusic();
  await ytmusic.initialize();

  try {
    const songInfo = await ytmusic.getSong(videoId);

    if (!songInfo || !songInfo.videoId) {
      return NextResponse.json({ error: '曲情報が見つかりません' }, { status: 404 });
    }

    const url = `https://music.youtube.com/watch?v=${songInfo.videoId}`;

    return NextResponse.json({
      title: songInfo.name,
      artist: songInfo.artist.name,
      thumbnail: songInfo.thumbnails[0]?.url,
      url,
      videoId: songInfo.videoId,
      duration: songInfo.duration,
    });
  } catch (error) {
    return NextResponse.json({ error: '曲の取得に失敗しました', details: error }, { status: 500 });
  }
}
