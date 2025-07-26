import { useRef, useState, useCallback } from "react"; // Ensure useState and useCallback are imported
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { Earth } from "./Earth";
import { FlightCoordinator } from "./FlightCoordinator";
import { SceneSetup } from "./SceneSetup";
import { GLOBE_RADIUS } from "../utils/globeUtils"; // Ensure 'cities' is imported

// Define the type for the data received from CameraUpdater
interface CityLabelData {
  name: string;
  position: { x: number; y: number };
  isVisible: boolean; // Not strictly needed here if CameraUpdater only sends visible ones, but good for clarity
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
    // The main container for your app, positioning the canvas and HTML overlays
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
        dpr={[1, 2]} // Enable device pixel ratio for sharp rendering on high-DPI screens
        style={{ position: "absolute", top: 0, left: 0 }} // Canvas should fill its parent div
      >
        {/* SceneSetup configures the WebGL renderer and handles custom interactions */}
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
          <FlightCoordinator />{" "}
          {/* FlightCoordinator just manages flight animations */}
        </Earth>

        {/* OrbitControls enables user interaction (spinning, zooming) */}
        <OrbitControls
          ref={orbitControlsRef}
          enablePan={false}
          enableZoom={true}
          minDistance={GLOBE_RADIUS * 1.5} // Prevent camera from going too close
          maxDistance={GLOBE_RADIUS * 4} // Prevent camera from going too far
          touches={{
            ONE: 0, // Maps one-finger touch to rotation
            TWO: 1, // Maps two-finger touch to dolly (zoom)
          }}
        />

        {/* IMPORTANT: Render CameraUpdater INSIDE the Canvas.
            It uses R3F hooks to calculate 2D positions and passes them out. */}
      </Canvas>

      {/* Render HTML labels based on the data received from CameraUpdater.
          These are standard HTML elements positioned with CSS. */}
      {cityLabelsData.map((label) => (
        // Each label is rendered as a simple div
        <div
          key={label.name} // Unique key for React list rendering
          style={{
            position: "absolute",
            left: `${label.position.x}px`,
            top: `${label.position.y}px`,
            transform: "translate(-50%, -50%)", // Centers the label precisely over its point
            background: "rgba(0, 0, 0, 0.6)", // Semi-transparent black background
            color: "white",
            padding: "3px 6px",
            borderRadius: "3px",
            fontSize: "0.7em",
            pointerEvents: "none", // Critical: Allows mouse events to pass through to the Canvas below
            whiteSpace: "nowrap", // Prevents text from wrapping
            zIndex: 999, // Ensure labels are above the Canvas
            opacity: 1, // Full opacity when visible
            transition: "opacity 0.2s ease-out", // Smooth fade-in/out effect
          }}
        >
          {label.name}
        </div>
      ))}
    </div>
  );
}
