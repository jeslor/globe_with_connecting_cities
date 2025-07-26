import { useRef, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { Earth } from "./Earth";
import { FlightCoordinator, type DisplayedCity } from "./FlightCoordinator";
import { SceneSetup } from "./SceneSetup";
import { GLOBE_RADIUS } from "../utils/globeUtils";

export default function GlobeWithMultipleCitiesConnecting() {
  const orbitControlsRef = useRef<OrbitControlsImpl>(null);
  const [currentCityPopup, setCurrentCityPopup] =
    useState<DisplayedCity | null>(null);

  const handleCityPopup = useCallback((city: DisplayedCity | null) => {
    setCurrentCityPopup(city);
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
        <SceneSetup controlsRef={orbitControlsRef} />

        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={2} />
        <directionalLight
          position={[-5, -5, -5]}
          intensity={0.6}
          color="#c0c0ff"
        />

        <Earth>
          <FlightCoordinator onCityPopup={handleCityPopup} />
        </Earth>

        <OrbitControls
          ref={orbitControlsRef}
          enablePan={false} // Pan is disabled anyway, so THREE finger won't work
          enableZoom={true}
          minDistance={GLOBE_RADIUS * 1.5}
          maxDistance={GLOBE_RADIUS * 4}
          touches={{
            ONE: 0, // Represents THREE.TOUCH.ROTATE
            TWO: 1, // Represents THREE.TOUCH.DOLLY
            // Removed: THREE: 2, // This property is not expected by the current type definition
          }}
        />
      </Canvas>

      {currentCityPopup && (
        <div
          style={{
            position: "absolute",
            left: `${currentCityPopup.position.x}px`,
            top: `${currentCityPopup.position.y}px`,
            transform: "translate(-50%, -100%)",
            background: "rgba(0, 0, 0, 0.7)",
            color: "white",
            padding: "5px 10px",
            borderRadius: "5px",
            fontSize: "0.8em",
            pointerEvents: "none",
            whiteSpace: "nowrap",
            zIndex: 1000,
            opacity: 1,
            transition: "opacity 0.5s ease-out",
          }}
        >
          {currentCityPopup.name}
        </div>
      )}
    </div>
  );
}
