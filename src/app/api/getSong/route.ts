
import { NextRequest, NextResponse } from 'next/server';
import YTMusic from 'ytmusic-api';

export const revalidate = 0; // API のキャッシュを無効化する設定

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
    console.error("Error fetching song:", error);
    return NextResponse.json({ error: '曲の取得に失敗しました', details: error.message }, { status: 500 });
  }
}
