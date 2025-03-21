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
      position: 'absolute',
      top: 20,
      left: 20,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: '15px',
      borderRadius: '12px',
      color: 'white',
      fontFamily: 'Arial',
      boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)'
    }}>
      <h2>{song.title}</h2>
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
