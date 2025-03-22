import React from 'react';

interface Song {
  title: string;
  artist: string;
  videoId: string;
  thumbnail: string;
  url: string;
}

interface SongDetailsProps {
  song: Song;
}

const SongDetails: React.FC<SongDetailsProps> = ({ song }) => {
  return (
    <div style={{
      fontSize: '0.7rem',
      position: 'absolute',
      top: '86%', // コレがちょうどいい位置
      left: '50%',
      transform: 'translate(-50%, -50%)', // 完全に中央に配置
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: '10px',
      borderRadius: '12px',
      color: 'white',
      fontFamily: 'Arial',
      boxShadow: '0px 0px 10px rgba(255, 255, 255, 0.5)',
      textAlign: 'center' // 中央揃え
    }}>
      <h2 style={{
         margin:'0',
      }}>{song.title}</h2>
      <p>by {song.artist}</p>
      <a 
        href={song.url} 
        target="_blank" 
        rel="noopener noreferrer" 
        style={{ color: '#ffcc00', textDecoration: 'none' }}
      >
        Watch on YouTube
      </a>
    </div>
  );
};

export default SongDetails;
