import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import SongDetails from './SongDetails';  // 新しく作成したコンポーネントをインポート

interface Song {
  title: string;
  artist: string;
  videoId: string;
  thumbnail: string;
  url: string;
}

interface StarGenerateProps {
  songs: Song[];
}

const StarGenerate: React.FC<StarGenerateProps> = ({ songs }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [selectedStar, setSelectedStar] = useState<THREE.Mesh | null>(null);
  const [relatedStars, setRelatedStars] = useState<THREE.Mesh[]>([]);
  const [songDetails, setSongDetails] = useState<Song | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000);
    camera.position.set(0, 0, 1200);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const textureLoader = new THREE.TextureLoader();
    const stars: THREE.Mesh[] = [];
    const starSize = 100;
    const relatedStarSize = 80;
    const radius = 500;

    const addStars = (songsList: Song[], size: number) => {
      const exclusionRadius = 150; // 他の星と重ならないようにする半径
      const maxAttempts = 100; // 配置を試行する最大回数
    
      songsList.forEach((song) => {
        const texture = textureLoader.load(song.thumbnail);
        const geometry = new THREE.PlaneGeometry(size, size);
        const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    
        let posX, posY, posZ;
        let tooClose = true;
        let attempts = 0;
    
        while (tooClose && attempts < maxAttempts) {
          posX = (Math.random() - 0.5) * 2000;
          posY = (Math.random() - 0.5) * 2000;
          posZ = (Math.random() - 0.5) * 2000;
          tooClose = false;
    
          for (const otherStar of stars) {
            const dx = posX - otherStar.position.x;
            const dy = posY - otherStar.position.y;
            const dz = posZ - otherStar.position.z;
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
    
            if (distance < exclusionRadius) {
              tooClose = true;
              break;
            }
          }
          attempts++;
        }
    
        if (attempts < maxAttempts) { // 無限ループを防ぐための安全策
          const star = new THREE.Mesh(geometry, material);
          star.position.set(posX!, posY!, posZ!);
          star.userData = { song };
    
          stars.push(star);
          scene.add(star);
        }
      });
    };
    
    

    addStars(songs, starSize);

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    const handleClick = async (event: MouseEvent) => {
      const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects([...stars, ...relatedStars]);

      if (intersects.length > 0) {
        const clickedStar = intersects[0].object as THREE.Mesh;
        const clickedSong = clickedStar.userData.song as Song;

        if (selectedStar !== clickedStar) {

          if (selectedStar) {
            gsap.to(selectedStar.position, {
              x: (Math.random() - 0.5) * 2000,
              y: (Math.random() - 0.5) * 2000,
              z: (Math.random() - 0.5) * 2000,
              duration: 1.5,
              ease: 'power3.out'
            });
            gsap.to(selectedStar.scale, { x: 1, y: 1, z: 1, duration: 1 });
            gsap.to((selectedStar.material as THREE.MeshBasicMaterial), { opacity: 1, duration: 1 });

            relatedStars.forEach(star => scene.remove(star));
            setRelatedStars([]);
          }

          setSelectedStar(clickedStar);
          setSongDetails(clickedSong);

          gsap.to(clickedStar.position, { x: 0, y: 0, z: 0, duration: 1.5, ease: 'power3.out' });
          gsap.to(clickedStar.scale, { x: 5, y: 5, z: 5, duration: 1 });

          gsap.to(
            stars
              .filter(star => star !== clickedStar && !relatedStars.includes(star))
              .map(star => (star.material as THREE.MeshBasicMaterial)),
            {
              opacity: 0,
              duration: 1
            }
          );

          try {
            const response = await fetch('/api/related_songs', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ videoId: clickedSong.videoId })
            });
            const relatedSongs: Song[] = await response.json();

            const newRelatedStars: THREE.Mesh[] = [];
            relatedSongs.forEach((relatedSong, index) => {
              const texture = textureLoader.load(relatedSong.thumbnail);
              const geometry = new THREE.PlaneGeometry(relatedStarSize, relatedStarSize);
              const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
            
              const exclusionRadius = 170; // 星同士の最小距離
              const scale = 1; // スケール値 (必要なら調整)
              const minX = -1000;
              const maxX = 1000;
              const minY = -1000;
              const maxY = 1000;
            
              let posX: number;
              let posY: number;
            
              do {
                posX = Math.random() * (maxX - minX) + minX;
                posY = Math.random() * (maxY - minY) + minY;
            
                if (index !== 1) {  // 特定の sessionId (index) が 1 でない場合、中心付近を避ける
                  while (posX > -100 && posX < 100 && posY > -100 && posY < 100) {
                    posX = Math.random() * (maxX - minX) + minX;
                    posY = Math.random() * (maxY - minY) + minY;
                  }
                }
              } while (
                stars.some((otherStar) => {
                  const dx = posX - otherStar.position.x;
                  const dy = posY - otherStar.position.y;
                  const distance = Math.sqrt(dx * dx + dy * dy);
                  return distance < exclusionRadius;
                })
              );
            
              const star = new THREE.Mesh(geometry, material);
              star.position.set(posX, posY, 0);
              star.userData = { song: relatedSong };
            
              stars.push(star);
              newRelatedStars.push(star);
              scene.add(star);
            });
            

            setRelatedStars(newRelatedStars);
          } catch (error) {
            console.error('関連曲の取得エラー:', error);
          }
        }
      }
    };

    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('click', handleClick);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [songs]);

  return (
    <div>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
      {songDetails && <SongDetails song={songDetails} />} {/* SongDetails を表示 */}
    </div>
  );
};

export default StarGenerate;
