import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import SongDetails from './SongDetails';  // 新しく作成したコンポーネントをインポート
import Sound from './Sound';
import AudioVisualizer from './AudioVisualizer';
import { AnimatePresence, motion } from 'framer-motion';
import GlassmorphismSearchBar from './Searchbar';


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
interface SearchResult {
  title: string;
  artist: string;
  videoId: string;
  thumbnail: string;
  url: string;
}

const StarGenerate: React.FC<StarGenerateProps> = ({ songs }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [selectedStar, setSelectedStar] = useState<THREE.Mesh | null>(null);
  const [relatedStars, setRelatedStars] = useState<THREE.Mesh[]>([]);
  const [songDetails, setSongDetails] = useState<Song | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    if (!mountRef.current) return;
    if (searchResults.length > 0) {
      songs = searchResults
      setSongDetails(null);
    }
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000);
    camera.position.set(0, 0, 1200);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const textureLoader = new THREE.TextureLoader();
    const stars: THREE.Mesh[] = [];
    const starSize = 100;

    const addStars = (songsList: Song[], size: number) => {
      const exclusionRadius = 150; // 他の星と重ならないようにする半径
      const maxAttempts = 100; // 配置を試行する最大回数
    
      songsList.forEach((song) => {
        const texture = textureLoader.load(song.thumbnail);
        const geometry = new THREE.CircleGeometry(150 / 2, 64);
        const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 0 });  // 透明度を0に設定
    
        let posX, posY, posZ;
        let tooClose = true;
        let attempts = 0;
    
        while (tooClose && attempts < maxAttempts) {
          posX = (Math.random() - 0.5) * 2000;
          posY = (Math.random() - 0.5) * 2000;
          posZ = (Math.random() - 0.5) * 1000;
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
    
          // ⭐️ gsapでフェードインアニメーションを追加
          gsap.to(star.material, { opacity: 1, duration: 1.5, ease: 'power3.out' });
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
              z: (Math.random() - 0.5) * 1000,
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
          const starsToRemove = stars.filter(star => star !== clickedStar && !relatedStars.includes(star));

          gsap.to(clickedStar.position, { x: 0, y: 0, z: 0, duration: 1.5, ease: 'power3.out' });
          gsap.to(clickedStar.scale, { x: 3.5, y: 3.5, z: 3.5, duration: 1 });

          starsToRemove.forEach(star => {
            gsap.to(star.material as THREE.MeshBasicMaterial, {
              opacity: 0,
              duration: 1,
              onComplete: () => {
                // シーンから星を削除
                scene.remove(star);
          
                // リソース解放
                if (star.geometry) star.geometry.dispose();
                if (Array.isArray(star.material)) {
                  star.material.forEach(m => m.dispose());
                } else {
                  star.material.dispose();
                }
          
                // stars配列から削除
                const index = stars.indexOf(star);
                if (index > -1) stars.splice(index, 1);
              },
            });
          });

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
              const geometry = new THREE.CircleGeometry(150 / 2, 64);
              const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 0 });  // 最初は透明に設定
            
              const exclusionRadius = 200; // 星同士の最小距離
              const minX = -1500;
              const maxX = 1500;
              const minY = -1500;
              const maxY = 1500;
            
              let posX: number;
              let posY: number;
            
              do {
                posX = Math.random() * (maxX - minX) + minX;
                posY = Math.random() * (maxY - minY) + minY;
            
                while (posX > -400 && posX < 400 && posY > -400 && posY < 400) {
                  posX = Math.random() * (maxX - minX) + minX;
                  posY = Math.random() * (maxY - minY) + minY;
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
            
              // ⭐️ gsapを使ってフェードインさせる
              gsap.to(star.material, { opacity: 1, duration: 1.5, ease: 'power3.out' });
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
  }, [songs,searchResults]);
  const searchSongs = (results: SearchResult[]) => {
    setSearchResults(results);
    console.log("検索結果: ", results);
};
  return (
    <div>
      
      <div ref={mountRef} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: "1000" }} />

      {songDetails && <SongDetails videoId={songDetails.videoId} />} {/* SongDetails を表示 */}
      {songDetails && <Sound videoId={songDetails.videoId} />} {/* SongDetails を表示 */}
      <AnimatePresence mode="wait">
      {songDetails && (
        <motion.div
          key="audio-visualizer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}  // フェードイン・アウトの速度
        >
          <AudioVisualizer />
        </motion.div>
      )}
    </AnimatePresence>
    <GlassmorphismSearchBar onSearch={searchSongs}/> {/* 検索時にhandleSearchを呼び出す */}
    </div>
  );
};

export default StarGenerate;
