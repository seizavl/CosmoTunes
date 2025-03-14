"use client";

import { useEffect, useState } from "react";

interface Song {
  title: string;
  artist: string;
  videoId: string;
  thumbnail: string;
  url: string;
}

export default function Home() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [relatedSongs, setRelatedSongs] = useState<Song[]>([]);
  const [displayedSongs, setDisplayedSongs] = useState<Song[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/songs")
      .then((res) => res.json())
      .then((data) => {
        setSongs(data);
        setDisplayedSongs(data); // 最初は人気曲を表示
      })
      .catch((error) => console.error("Error fetching songs:", error));
  }, []);

  const fetchRelatedSongs = (videoId: string) => {
    fetch("/api/related_songs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoId }),
    })
      .then((res) => res.json())
      .then((data) => {
        setRelatedSongs(data);
        setDisplayedSongs(data); // 表示曲を関連曲に差し替え
        setSelectedVideo(videoId);
      })
      .catch((error) => console.error("Error fetching related songs:", error));
  };

  return (
    <div style={{ textAlign: "center", fontFamily: "Arial, sans-serif" }}>
      <h2>{selectedVideo ? "関連する楽曲" : "日本の人気音楽"}</h2>
      <div className="song-list">
        {displayedSongs.map((song, index) => (
          <div
            key={song.videoId || `song-${index}`}
            className="song-item"
            onClick={() => fetchRelatedSongs(song.videoId)}
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              margin: "10px auto",
              padding: "10px",
              width: "60%",
              border: `2px solid ${selectedVideo === song.videoId ? "#0070f3" : "#ddd"}`,
              borderRadius: "10px",
              transition: "background 0.3s, border 0.3s",
              background: selectedVideo === song.videoId ? "#f0f8ff" : "white",
            }}
          >
            <img
              src={song.thumbnail}
              alt="thumbnail"
              width="80"
              height="80"
              style={{ borderRadius: "5px", marginRight: "15px" }}
            />
            <div>
              <strong>{song.title}</strong>
              <br />
              <small>{song.artist}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
