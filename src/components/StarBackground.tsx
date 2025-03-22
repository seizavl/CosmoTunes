import React, { ReactNode, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { EffectComposer, Bloom, Noise } from "@react-three/postprocessing";

interface StarBackgroundProps {
  children: ReactNode;
}

const ShootingStar: React.FC = () => {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame(() => {
    if (ref.current) {
      ref.current.position.x -= 0.5;
      ref.current.position.y -= 0.2;
      if (ref.current.position.x < -100 || ref.current.position.y < -100) {
        ref.current.position.set(Math.random() * 200 - 100, Math.random() * 100 - 50, Math.random() * -50);
      }
    }
  });

  return (
    <mesh ref={ref} position={[Math.random() * 200 - 100, Math.random() * 100 - 50, Math.random() * -50]}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshBasicMaterial color="#fff" />
    </mesh>
  );
};



const StarBackground: React.FC<StarBackgroundProps> = ({ children }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <>
      <Canvas
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
        }}
        camera={{ position: [0, 0, 1] }}
      >
        <color attach="background" args={["#000000"]} />

        {/* 星 */}
        <Stars radius={150} depth={60} count={10000} factor={5} saturation={0} fade speed={0.5} />

        {/* ポストプロセッシングエフェクト */}
        <EffectComposer>
          <Bloom intensity={1.5} luminanceThreshold={0.1} luminanceSmoothing={0.9} />
          <Noise opacity={0.02} />
        </EffectComposer>
      </Canvas>

      <div style={{ position: "relative", zIndex: 0 }}>{children}</div>
    </>
  );
};

export default StarBackground;
