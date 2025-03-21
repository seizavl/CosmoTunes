"use client";

import { useEffect, useState } from "react";
import StarBackground from "@/components/StarBackground";
import StarGenerate from "../components/Star";

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
    <StarBackground>
      <StarGenerate songs={displayedSongs} />
    </StarBackground>
  );
}
