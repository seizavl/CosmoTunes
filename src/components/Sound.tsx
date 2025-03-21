"use client";
import React, { useEffect, useState } from 'react';

interface Song {
  title: string;
  artist: string;
  videoId: string;
  thumbnail: string;
  url: string;
}

interface SongDetailsProps {
  videoId: string;
}

const Sound: React.FC<SongDetailsProps> = ({ videoId }) => {
  const [song, setSong] = useState<Song | null>(null);

  useEffect(() => {
    const fetchSong = async () => {
      const res = await fetch('/api/getSong', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId }),
      });

      if (res.ok) {
        const data = await res.json();
        setSong(data);
      } else {
        console.error("曲情報の取得に失敗しました");
      }
    };
    fetchSong();
  }, [videoId]);

  return (
    <div style={{
      position: 'absolute',
      top: 20,
      left: 20,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: '15px',
      borderRadius: '12px',
      color: 'white',
      fontFamily: 'Arial',
      boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)',
      opacity: 0,
    }}>
      {song ? (
        <>
          <h2>{song.title}</h2>
          <p>by {song.artist}</p>
          <p>by {song.url}</p>
          <iframe
            width="300"
            height="170"
            src={`https://www.youtube.com/embed/${song.videoId}?autoplay=1&loop=1&playlist=${song.videoId}`}
            title={song.title}
            allow="autoplay; encrypted-media"
            allowFullScreen
            style={{ borderRadius: '8px', border: 'none' }}
          />

          <br />
          <a
            href={song.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#ffcc00', textDecoration: 'none', marginTop: '8px', display: 'inline-block' }}
          >
            Watch on YouTube
          </a>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Sound;
