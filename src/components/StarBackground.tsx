import React, { ReactNode, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";

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
      >
        <color attach="background" args={["#000"]} />
        <Stars
          radius={100}
          depth={50}
          count={7000}
          factor={4}
          saturation={0}
          fade
          speed={0.5}
        />
      </Canvas>
      <div style={{ position: "relative", zIndex: 0 }}>
        {children}
      </div>
    </>
  );
};

export default StarBackground;
