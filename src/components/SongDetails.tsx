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

const SongDetails: React.FC<SongDetailsProps> = ({ videoId }) => {
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
      fontSize: '0.7rem',
      position: 'fixed',
      marginTop: '33%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      padding: '10px',
      borderRadius: '12px',
      color: 'white',
      fontFamily: 'Arial',
      textAlign: 'center',
      zIndex: 10000,
    }}>
      {song ? (
        <>
          <h2 style={{
            margin:'0',
          }}>{song.title}</h2>
          <p>by {song.artist}</p>
          <a 
            href={`https://www.youtube.com/watch?v=${song.videoId}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ color: '#ffcc00', textDecoration: 'none' }}
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

export default SongDetails;
