import React, { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Earth } from "./Earth";
import { FlightCoordinator } from "./FlightCoordinator";
import { SceneSetup } from "./SceneSetup";
import { GLOBE_RADIUS } from "../utils/globeUtils";

export default function GlobeWithMultipleCitiesConnecting() {
  const orbitControlsRef = useRef<any>(null);

  return (
    <Canvas
      camera={{ position: [0, 2, 6], fov: 60 }}
      dpr={[1, 2]} // Enable dpr (device pixel ratio) for sharp rendering on high-DPI screens
    >
      {/* SceneSetup configures the WebGL renderer */}
      <SceneSetup />

      {/* Lights provide illumination for the scene */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />

      {/* Earth component renders the globe itself, and its children (FlightCoordinator) are rendered relative to it */}
      <Earth>
        <FlightCoordinator />
      </Earth>

      {/* OrbitControls enables user interaction (spinning, zooming) */}
      <OrbitControls
        ref={orbitControlsRef}
        enablePan={false}
        enableZoom={false}
        minDistance={GLOBE_RADIUS * 1.5} // Prevent camera from going too close
        maxDistance={GLOBE_RADIUS * 4} // Prevent camera from going too far
        // dampingFactor={0.05} // Adjust for smoother rotation stop
        // enableDamping={true} // Enable damping for smoother animation when released
      />
    </Canvas>
  );
}
