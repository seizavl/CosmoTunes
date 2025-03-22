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
      marginTop: '430px',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      padding: '10px',
      borderRadius: '12px',
      color: 'white',
      fontFamily: 'Arial',
      textAlign: 'center',
      zIndex: 1,
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
