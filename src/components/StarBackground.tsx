import React, { ReactNode, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { EffectComposer, Bloom, Noise } from "@react-three/postprocessing";

interface StarBackgroundProps {
  children: ReactNode;
}


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
