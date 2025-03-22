"use client";

import { useEffect, useState } from "react";
import StarBackground from "@/components/StarBackground";
import StarGenerate from "../components/Star";
import GlassmorphismSearchBar from "@/components/Searchbar";

interface Song {
  title: string;
  artist: string;
  videoId: string;
  thumbnail: string;
  url: string;
}

export default function Home() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [displayedSongs, setDisplayedSongs] = useState<Song[]>([]);

  useEffect(() => {
    fetch("/api/songs")
      .then((res) => res.json())
      .then((data) => {
        setSongs(data);
        setDisplayedSongs(data); // 最初は人気曲を表示
      })
      .catch((error) => console.error("Error fetching songs:", error));
  }, []);

  return (
    <StarBackground>
      <StarGenerate songs={displayedSongs} /> {/* Keyを設定 */}
      
    </StarBackground>
  );
}
