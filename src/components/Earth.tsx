import React from "react";
import { useTexture } from "@react-three/drei";
import { GLOBE_RADIUS } from "../utils/globeUtils";

interface EarthProps {
  children: React.ReactNode;
}

export function Earth({ children }: EarthProps) {
  const texture = useTexture("/images/textures/earth.jpg");

  return (
    <mesh>
      <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
      <meshStandardMaterial map={texture} />
      {children}
    </mesh>
  );
}
