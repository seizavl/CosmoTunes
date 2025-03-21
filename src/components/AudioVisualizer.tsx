import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const PseudoAudioVisualizer: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let instancedMesh: THREE.InstancedMesh;
    let animationId: number;

    const init = () => {
      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 40;

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000000, 0);
      renderer.domElement.style.position = 'fixed';
      renderer.domElement.style.top = '0';
      renderer.domElement.style.left = '0';
      renderer.domElement.style.width = '100vw';
      renderer.domElement.style.height = '100vh';
      renderer.domElement.style.zIndex = '9999';

      mountRef.current?.appendChild(renderer.domElement);

      const dotGeometry = new THREE.SphereGeometry(0.05, 8, 8);
      const dotMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

      const numDots = 256;
      const maxHeight = 30; // Maximum height of each bar
      const totalInstances = numDots * maxHeight;

      instancedMesh = new THREE.InstancedMesh(dotGeometry, dotMaterial, totalInstances);

      const dummy = new THREE.Object3D();
      const radius = 9;
      let index = 0;

      for (let i = 0; i < numDots; i++) {
        const angle = (i / numDots) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        for (let j = 0; j < maxHeight; j++) {
          dummy.position.set(x, y, j * 0.1);
          dummy.updateMatrix();
          instancedMesh.setMatrixAt(index, dummy.matrix);
          index++;
        }
      }

      scene.add(instancedMesh);
      animate();
    };

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (isPlaying) {
        const frequencyData = Array.from({ length: 256 }, () => Math.random());

        let index = 0;
        for (let i = 0; i < frequencyData.length; i++) {
          const intensity = frequencyData[i];
          const numVisibleDots = Math.floor(intensity * 30);

          for (let j = 0; j < 30; j++) {
            const visibility = j < numVisibleDots ? 1 : 0;
            instancedMesh.setColorAt(index, new THREE.Color(visibility, visibility, visibility));
            index++;
          }
        }

        instancedMesh.instanceColor!.needsUpdate = true;
      }
      
      renderer.render(scene, camera);
    };

    init();

    return () => {
      cancelAnimationFrame(animationId);
      if (renderer) mountRef.current?.removeChild(renderer.domElement);
    };
  }, [isPlaying]);

  return (
    <>
      <div ref={mountRef} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999 }} />
    </>
  );
};

export default PseudoAudioVisualizer;
