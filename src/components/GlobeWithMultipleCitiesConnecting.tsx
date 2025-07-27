// src/App.tsx
import { useRef, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { Earth } from "./Earth";
import { FlightCoordinator } from "./FlightCoordinator";
import { SceneSetup } from "./SceneSetup"; // This component will handle auto-rotate logic
import { GLOBE_RADIUS } from "../utils/globeUtils";

// Define the type for the data received from CameraUpdater
interface CityLabelData {
  name: string;
  position: { x: number; y: number };
  isVisible: boolean;
}

export default function GlobeWithMultipleCitiesConnecting() {
  const orbitControlsRef = useRef<OrbitControlsImpl>(null);
  // State to hold the dynamic label data for visible cities
  const [cityLabelsData, setCityLabelsData] = useState<CityLabelData[]>([]);

  // Callback to receive updated label data from CameraUpdater
  const handleUpdateCityLabels = useCallback((labels: CityLabelData[]) => {
    setCityLabelsData(labels);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Canvas
        camera={{ position: [0, 2, 6], fov: 60 }}
        dpr={[1, 2]}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {/* SceneSetup configures the WebGL renderer and handles custom interactions */}
        {/* Pass the ref to SceneSetup for auto-rotate control */}
        <SceneSetup controlsRef={orbitControlsRef} />

        {/* Lights for the 3D scene */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={2} />
        <directionalLight
          position={[-5, -5, -5]}
          intensity={0.6}
          color="#c0c0ff"
        />

        {/* Earth component renders the globe, and its children are rendered relative to it */}
        <Earth>
          <FlightCoordinator />
        </Earth>

        {/* OrbitControls enables user interaction (spinning, zooming) */}
        <OrbitControls
          ref={orbitControlsRef} // Attach the ref here
          enablePan={false}
          enableZoom={true}
          minDistance={GLOBE_RADIUS * 1.5}
          maxDistance={GLOBE_RADIUS * 4}
          touches={{
            ONE: 0,
            TWO: 1,
          }}
          // autoRotate and autoRotateSpeed will be controlled by SceneSetup, NOT here directly.
          // We intentionally leave these props out here, as SceneSetup will set them on the instance.
        />

        {/* IMPORTANT: Render CameraUpdater INSIDE the Canvas.
            It uses R3F hooks to calculate 2D positions and passes them out. */}
      </Canvas>

      {/* Render HTML labels based on the data received from CameraUpdater. */}
      {cityLabelsData.map((label) => (
        <div
          key={label.name}
          style={{
            position: "absolute",
            left: `${label.position.x}px`,
            top: `${label.position.y}px`,
            transform: "translate(-50%, -50%)",
            background: "rgba(0, 0, 0, 0.6)",
            color: "white",
            padding: "3px 6px",
            borderRadius: "3px",
            fontSize: "0.7em",
            pointerEvents: "none",
            whiteSpace: "nowrap",
            zIndex: 999,
            opacity: label.isVisible ? 1 : 0,
            transition: "opacity 0.2s ease-out",
          }}
        >
          {label.name}
        </div>
      ))}
    </div>
  );
}
