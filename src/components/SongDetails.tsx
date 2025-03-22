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
        fontSize: '0.6rem',
        position: 'fixed',
        top: '77%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: '#fff',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center',
        zIndex: 10000,

        // グラスモーフィズムのデザイン
        padding: '15px 30px',
        background: 'rgba(255, 255, 255, 0.1)', 
        backdropFilter: 'blur(5px)', 
        WebkitBackdropFilter: 'blur(5px)',
        borderRadius: '12px',
        borderTop: '1px solid rgba(255, 255, 255, 0.4)',
        borderRight: '1px solid rgba(255, 255, 255, 0.2)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        borderLeft: '1px solid rgba(255, 255, 255, 0.4)',
      }}>
      {song ? (
        <>
          <h2 style={{ margin: '0', fontWeight: 'bold' }}>{song.title}</h2>
          <p style={{ margin: '5px 0' }}>by {song.artist}</p>
          <a 
            href={`https://www.youtube.com/watch?v=${song.videoId}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ color: '#ffcc00', textDecoration: 'none', fontWeight: 'bold' }}
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
