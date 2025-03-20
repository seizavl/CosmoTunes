"use client";

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface Song {
  title: string;
  artist: string;
  videoId: string;
  thumbnail: string;
  url: string;
}

interface StarBackgroundProps {
  songs: Song[];
}

const StarBackground: React.FC<StarBackgroundProps> = ({ songs }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedStar, setSelectedStar] = useState<{ x: number; y: number; size: number; img: HTMLImageElement; song: Song } | null>(null);
  const [relatedStars, setRelatedStars] = useState<{ x: number; y: number; size: number; img: HTMLImageElement; song: Song }[]>([]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const Stars: { x: number; y: number; size: number; img: HTMLImageElement; song: Song }[] = [];
    const StarSize = 100;
    const padding = 20;
    const maxAttempts = 1000;

    const isOverlapping = (x: number, y: number, size: number) => {
      return [...Stars, ...relatedStars].some(Star => {
        const dx = Star.x - x;
        const dy = Star.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < Star.size / 2 + size / 2 + padding;
      });
    };

    const drawStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (selectedStar) {
        const { img } = selectedStar;
        const newSize = 300;

        gsap.to(selectedStar, {
          duration: 1,
          x: canvas.width / 2,
          y: canvas.height / 2,
          size: newSize,
          onUpdate: () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.beginPath();
            ctx.arc(selectedStar.x, selectedStar.y, selectedStar.size / 2, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(img, selectedStar.x - selectedStar.size / 2, selectedStar.y - selectedStar.size / 2, selectedStar.size, selectedStar.size);
            ctx.restore();

            relatedStars.forEach(Star => {
              ctx.save();
              ctx.beginPath();
              ctx.arc(Star.x, Star.y, Star.size / 2, 0, Math.PI * 2);
              ctx.closePath();
              ctx.clip();
              ctx.drawImage(Star.img, Star.x - Star.size / 2, Star.y - Star.size / 2, Star.size, Star.size);
              ctx.restore();
            });
          }
        });
      } else {
        Stars.forEach(Star => {
          ctx.save();
          ctx.beginPath();
          ctx.arc(Star.x, Star.y, Star.size / 2, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(Star.img, Star.x - Star.size / 2, Star.y - Star.size / 2, Star.size, Star.size);
          ctx.restore();
        });
      }
    };

    const fetchRelatedSongs = async (song: Song) => {
      try {
        const response = await fetch('/api/related_songs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ videoId: song.videoId })
        });
        const relatedSongs: Song[] = await response.json();

        const relatedStarsData = relatedSongs.map((relatedSong) => {
          const img = new Image();
          img.src = relatedSong.thumbnail;

          let attempts = 0;
          let x, y;
          do {
            x = Math.random() * (canvas.width - 80) + 40;
            y = Math.random() * (canvas.height - 80) + 40;
            attempts++;
          } while (isOverlapping(x, y, 80) && attempts < maxAttempts);

          return { img, size: 80, x, y, song: relatedSong };
        });

        setRelatedStars(relatedStarsData);
      } catch (error) {
        console.error('Error fetching related songs:', error);
      }
    };

    songs.forEach((song) => {
      const img = new Image();
      img.src = song.thumbnail;

      img.onload = () => {
        let attempts = 0;
        let x, y;

        do {
          x = Math.random() * (canvas.width - StarSize) + StarSize / 2;
          y = Math.random() * (canvas.height - StarSize) + StarSize / 2;
          attempts++;
        } while (isOverlapping(x, y, StarSize) && attempts < maxAttempts);

        if (attempts < maxAttempts) {
          const Star = { x, y, size: StarSize, img, song };
          Stars.push(Star);
          drawStars();
        }
      };
    });

    const handleClick = (event: MouseEvent) => {
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const allStars = [...Stars, ...relatedStars];

      const clickedStar = allStars.find(Star => {
        const dx = mouseX - Star.x;
        const dy = mouseY - Star.y;
        return Math.sqrt(dx * dx + dy * dy) <= Star.size / 2;
      });

      if (clickedStar) {
        setSelectedStar(clickedStar);
        fetchRelatedSongs(clickedStar.song);
      }
    };

    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, [songs, selectedStar, relatedStars]);

  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }} />;
};

export default StarBackground;
