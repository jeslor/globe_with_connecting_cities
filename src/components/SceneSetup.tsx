import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

export function SceneSetup() {
  const { gl } = useThree();

  useEffect(() => {
    gl.setPixelRatio(window.devicePixelRatio);
    // You can add more renderer settings here if needed
    // gl.toneMapping = THREE.ACESFilmicToneMapping;
    // gl.toneMappingExposure = 1.0;
  }, [gl]);

  return null; // This component doesn't render any Three.js objects directly
}
