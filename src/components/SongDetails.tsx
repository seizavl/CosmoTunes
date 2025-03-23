import React, { useEffect, useState } from 'react';
import { Youtube } from 'lucide-react';

interface Song {
  title: string;
  artist: string;
  videoId: string;
  thumbnail: string;
  url: string;
  duration: number;
}

interface SongDetailsProps {
  videoId: string;
}

const SongDetails: React.FC<SongDetailsProps> = ({ videoId }) => {
  const [song, setSong] = useState<Song | null>(null);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

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
        setProgress(0);
        setStartTime(Date.now());

        if (intervalId) clearInterval(intervalId);

        const id = setInterval(() => {
          if (!isDragging) {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            if (elapsed <= data.duration) {
              setProgress(elapsed);
            } else {
              clearInterval(id);
            }
          }
        }, 1000);

        setIntervalId(id);
      } else {
        console.error("曲情報の取得に失敗しました");
      }
    };
    fetchSong();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [videoId]);

  useEffect(() => {
    if (!isDragging && song) {
      if (intervalId) clearInterval(intervalId);

      const id = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        if (elapsed <= song.duration) {
          setProgress(elapsed);
        } else {
          clearInterval(id);
        }
      }, 1000);

      setIntervalId(id);
      return () => clearInterval(id);
    }
  }, [isDragging, startTime, song]);

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseInt(e.target.value);
    setProgress(newProgress);
    setStartTime(Date.now() - newProgress * 1000);
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div style={{
      fontSize: '0.6rem',
      position: 'fixed',
      top: '80%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      color: '#fff',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      zIndex: 10000,
      padding: '15px 30px 10px 30px',
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
          {song.title.length > 20 ? (
        <h2 style={{ 
          margin: '0', 
          fontWeight: 'bold', 
          overflow: 'hidden', 
          whiteSpace: 'nowrap', 
          display: 'inline-block', 
          position: 'relative', 
          width: '200px', 
        }}>
          <div style={{ 
            display: 'inline-block',
            whiteSpace: 'nowrap',
            paddingRight: '200px',
            animation: `slide ${song.title.length * 0.5}s linear infinite`
          }}>
            {song.title}　　{/* 曲名の後にスペースを追加 */}
            {song.title}　　{/* 曲名を複製して表示 */}
            {song.title}　　{/* 曲名を複製して表示 */}
          </div>
        </h2>
      ) : (
        <h2 style={{ margin: '0', fontWeight: 'bold' }}>{song.title}</h2>
      )}

      <style>
        {`
          @keyframes slide {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-100%);
            }
          }
        `}
      </style>
          <p style={{ margin: '5px 0' }}>{song.artist}</p>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="range"
              min="0"
              max={song.duration}
              value={progress}
              onChange={handleProgressChange}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              style={{
                marginTop: '10px',
                width: '100%',
                appearance: 'none',
                height: '6px',
                background: `linear-gradient(90deg, #999 ${(progress / song.duration) * 100}%, #555 0%)`,
                outline: 'none',
                borderRadius: '3px',
                cursor: 'pointer',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.8rem' }}>
              <span>{formatTime(progress)}</span>
              <span>{formatTime(song.duration)}</span>
            </div>
          </div>
          <a 
            href={`https://www.youtube.com/watch?v=${song.videoId}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ color: '#ffcc00', textDecoration: 'none', fontWeight: 'bold' }}
          >
            <Youtube size={24} style={{ marginTop: -10 }} />
          </a>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default SongDetails;
